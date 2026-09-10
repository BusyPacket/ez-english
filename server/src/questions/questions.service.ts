import { Injectable, NotFoundException } from '@nestjs/common'
import { createHash, randomUUID } from 'node:crypto'
import { and, desc, eq, inArray, like, or, sql, type SQL } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { Question } from '../database/schema'
import type { CreateQuestionDto, RecordAnswerDto, UpdateQuestionDto } from './questions.schema'

/** AI 生成题在错题本中的标识前缀（例题库题目为 UUID，不会与此前缀冲突） */
const AI_KEY_PREFIX = 'ai:'

/**
 * AI 生成题的错题标识：题干指纹（归一化去空白后取 SHA-1 前 32 位）。
 * AI 生成题不落 questions 表、没有 id，用指纹代替 id 才能沿用
 * 「user_id + question_id」唯一索引，让同一道题重复做错累加次数。
 */
function aiQuestionKey(stem: string): string {
  const normalized = stem.toLowerCase().replace(/[\s\u3000]+/g, '')
  return `${AI_KEY_PREFIX}${createHash('sha1').update(normalized).digest('hex').slice(0, 32)}`
}

/** 数据库行 → API 响应（choices 反序列化为数组） */
function mapRow(row: Question) {
  return {
    id: row.id,
    type: row.type,
    pointId: row.pointId,
    pointTitle: row.pointTitle,
    stem: row.stem,
    choices: row.choices ? (JSON.parse(row.choices) as string[]) : [],
    answer: row.answer,
    analysis: row.analysis,
    createdAt: row.createdAt,
  }
}

@Injectable()
export class QuestionsService {
  /**
   * 例题列表；可按考点过滤、限制数量。
   * 默认全部，按「未答题在前、已答题在后」排序（组内按创建时间倒序），
   * 并附带当前用户的答题状态（answered / userAnswer / isCorrect）。
   */
  async list(userId: string, pointId?: string, limit?: number) {
    const rows = pointId
      ? await db
          .select()
          .from(schema.questions)
          .where(eq(schema.questions.pointId, pointId))
          .orderBy(desc(schema.questions.createdAt))
          .all()
      : await db.select().from(schema.questions).orderBy(desc(schema.questions.createdAt)).all()

    const size = Math.max(0, Math.min(limit ?? 100, 100))
    const sliced = rows.slice(0, size)

    // 联查当前用户的答题记录（仅涉及本批题目，避免全表扫描）；userId 为空（如 AI 去重场景）则跳过
    const answerMap = new Map<string, { userAnswer: string; isCorrect: number }>()
    if (userId && sliced.length) {
      const answers = await db
        .select({
          questionId: schema.questionAnswers.questionId,
          userAnswer: schema.questionAnswers.userAnswer,
          isCorrect: schema.questionAnswers.isCorrect,
        })
        .from(schema.questionAnswers)
        .where(
          and(
            eq(schema.questionAnswers.userId, userId),
            inArray(
              schema.questionAnswers.questionId,
              sliced.map((q) => q.id),
            ),
          ),
        )
        .all()
      for (const a of answers) answerMap.set(a.questionId, a)
    }

    const items = sliced.map((row) => {
      const answer = answerMap.get(row.id)
      return {
        ...mapRow(row),
        answered: Boolean(answer),
        userAnswer: answer?.userAnswer ?? null,
        isCorrect: answer ? answer.isCorrect === 1 : null,
      }
    })

    // 未答在前、已答在后（保持各分组内创建时间倒序）
    items.sort((a, b) => Number(a.answered) - Number(b.answered))
    return items
  }

  /**
   * 记录一次答题（upsert：同一用户同一题仅保留一条，重复作答更新答案与判分）。
   * 例题库题目按 questions.id 落库；AI 生成题无 id，改用题干指纹标识（仅必要字段落错题本快照）。
   */
  async recordAnswer(userId: string, dto: RecordAnswerDto) {
    const answeredAt = new Date().toISOString()
    // 例题库题目用真实 id；AI 生成题用题干指纹，作为错题本的去重标识
    const questionId = dto.questionId ?? aiQuestionKey(dto.question?.stem ?? '')
    // AI 生成题快照：写入错题本供展示（例题库题目的内容从 questions 表联查，无需快照）
    const snapshot = dto.questionId ? null : (dto.question ?? null)

    if (dto.questionId) {
      // 仅例题库题目记录答题状态（供例题库「已答题」标记与排序；AI 生成题不落库）
      await db
        .insert(schema.questionAnswers)
        .values({
          id: randomUUID(),
          userId,
          questionId,
          type: dto.type,
          userAnswer: dto.userAnswer,
          isCorrect: dto.isCorrect ? 1 : 0,
          answeredAt,
        })
        .onConflictDoUpdate({
          target: [schema.questionAnswers.userId, schema.questionAnswers.questionId],
          set: {
            type: dto.type,
            userAnswer: dto.userAnswer,
            isCorrect: dto.isCorrect ? 1 : 0,
            answeredAt,
          },
        })
        .run()
    }

    // 答错则自动计入错题本：同一题重复做错累加次数并更新最近错答；答对不清除，由用户手动移出
    if (!dto.isCorrect) {
      await db
        .insert(schema.wrongQuestions)
        .values({
          id: randomUUID(),
          userId,
          questionId,
          pointId: snapshot?.pointId ?? null,
          pointTitle: snapshot?.pointTitle ?? null,
          type: snapshot ? dto.type : null,
          stem: snapshot?.stem ?? null,
          choices: snapshot?.choices?.length ? JSON.stringify(snapshot.choices) : null,
          answer: snapshot?.answer ?? null,
          analysis: snapshot?.analysis?.trim() ? snapshot.analysis : null,
          lastWrongAnswer: dto.userAnswer,
          wrongCount: 1,
          createdAt: answeredAt,
          updatedAt: answeredAt,
        })
        .onConflictDoUpdate({
          target: [schema.wrongQuestions.userId, schema.wrongQuestions.questionId],
          set: {
            // 快照随最近一次做错刷新；例题库题目恒为 null（内容以 questions 表为准）
            pointId: snapshot?.pointId ?? null,
            pointTitle: snapshot?.pointTitle ?? null,
            type: snapshot ? dto.type : null,
            stem: snapshot?.stem ?? null,
            choices: snapshot?.choices?.length ? JSON.stringify(snapshot.choices) : null,
            answer: snapshot?.answer ?? null,
            analysis: snapshot?.analysis?.trim() ? snapshot.analysis : null,
            lastWrongAnswer: dto.userAnswer,
            wrongCount: sql`${schema.wrongQuestions.wrongCount} + 1`,
            updatedAt: answeredAt,
          },
        })
        .run()
    }

    return { questionId, answered: true }
  }

  /**
   * 当前用户错题列表（仅本人；按最近做错时间倒序）。
   * 例题库题目从 questions 表联查最新内容，AI 生成题取落库快照，两者对外结构一致。
   */
  async listWrong(userId: string) {
    const rows = await db
      .select({
        questionId: schema.wrongQuestions.questionId,
        lastWrongAnswer: schema.wrongQuestions.lastWrongAnswer,
        wrongCount: schema.wrongQuestions.wrongCount,
        updatedAt: schema.wrongQuestions.updatedAt,
        // 例题库题目（questions 表联查）
        bankType: schema.questions.type,
        bankPointId: schema.questions.pointId,
        bankPointTitle: schema.questions.pointTitle,
        bankStem: schema.questions.stem,
        bankChoices: schema.questions.choices,
        bankAnswer: schema.questions.answer,
        bankAnalysis: schema.questions.analysis,
        // AI 生成题快照
        snapshotPointId: schema.wrongQuestions.pointId,
        snapshotPointTitle: schema.wrongQuestions.pointTitle,
        snapshotType: schema.wrongQuestions.type,
        snapshotStem: schema.wrongQuestions.stem,
        snapshotChoices: schema.wrongQuestions.choices,
        snapshotAnswer: schema.wrongQuestions.answer,
        snapshotAnalysis: schema.wrongQuestions.analysis,
      })
      .from(schema.wrongQuestions)
      .leftJoin(schema.questions, eq(schema.wrongQuestions.questionId, schema.questions.id))
      .where(eq(schema.wrongQuestions.userId, userId))
      .orderBy(desc(schema.wrongQuestions.updatedAt))
      .all()

    return rows
      .map((r) => {
        const choices = r.bankChoices ?? r.snapshotChoices
        return {
          // id 即题目标识：例题库为题目 id，AI 生成题为题干指纹（移出错题本沿用同一标识）
          id: r.questionId,
          type: r.bankType ?? r.snapshotType ?? 'single',
          pointId: r.bankPointId ?? r.snapshotPointId ?? '',
          pointTitle: r.bankPointTitle ?? r.snapshotPointTitle ?? null,
          stem: r.bankStem ?? r.snapshotStem ?? '',
          choices: choices ? (JSON.parse(choices) as string[]) : [],
          answer: r.bankAnswer ?? r.snapshotAnswer ?? '',
          analysis: r.bankAnalysis ?? r.snapshotAnalysis ?? null,
          // 来源：bank 例题库 / ai AI 生成题（前端据此打标）
          source: r.questionId.startsWith(AI_KEY_PREFIX) ? 'ai' : 'bank',
          lastWrongAnswer: r.lastWrongAnswer,
          wrongCount: r.wrongCount,
          updatedAt: r.updatedAt,
        }
      })
      .filter((r) => r.stem)
  }

  /** 把一道题移出错题本（仅限本人） */
  async removeWrong(userId: string, questionId: string) {
    const result = await db
      .delete(schema.wrongQuestions)
      .where(
        and(
          eq(schema.wrongQuestions.userId, userId),
          eq(schema.wrongQuestions.questionId, questionId),
        ),
      )
      .run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException('错题记录不存在')
    }
    return { questionId }
  }

  /** 随机抽取 N 道题（供练习抽题，可限定考点） */
  async random(limit: number, pointId?: string) {
    const size = Math.max(1, Math.min(limit || 10, 50))
    const rows = pointId
      ? await db
          .select()
          .from(schema.questions)
          .where(eq(schema.questions.pointId, pointId))
          .orderBy(desc(schema.questions.createdAt))
          .all()
      : await db.select().from(schema.questions).orderBy(desc(schema.questions.createdAt)).all()

    // 随机打乱后取前 N 道
    const shuffled = [...rows].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, size).map(mapRow)
  }

  /** 例题管理分页列表（admin）：预览考点/类型/题目前 20 字；支持关键词与考点筛选 */
  async adminList(page: number, pageSize: number, keyword?: string, pointId?: string) {
    const size = Math.max(1, Math.min(pageSize || 10, 100))
    const offset = (Math.max(1, page || 1) - 1) * size
    const kw = keyword?.trim()
    const conds: SQL[] = []
    if (kw) {
      const kwCond = or(
        like(schema.questions.stem, `%${kw}%`),
        like(schema.questions.pointTitle, `%${kw}%`),
      )
      if (kwCond) conds.push(kwCond)
    }
    if (pointId) conds.push(eq(schema.questions.pointId, pointId))
    const where = conds.length ? and(...conds) : undefined

    const totalRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.questions)
      .where(where)
      .get()
    const total = Number(totalRow?.count ?? 0)

    const rows = await db
      .select()
      .from(schema.questions)
      .where(where)
      .orderBy(desc(schema.questions.createdAt))
      .limit(size)
      .offset(offset)
      .all()

    return {
      items: rows.map((r) => ({
        id: r.id,
        pointId: r.pointId,
        pointTitle: r.pointTitle,
        type: r.type,
        stemPreview: r.stem.length > 20 ? `${r.stem.slice(0, 20)}…` : r.stem,
      })),
      total,
      page: Math.max(1, page || 1),
      pageSize: size,
    }
  }

  /** 新增例题（admin 添加） */
  async create(dto: CreateQuestionDto) {
    const row = {
      id: randomUUID(),
      pointId: dto.pointId,
      pointTitle: dto.pointTitle?.trim() ? dto.pointTitle : null,
      type: dto.type,
      stem: dto.stem,
      choices: dto.choices?.length ? JSON.stringify(dto.choices) : '[]',
      answer: dto.answer,
      analysis: dto.analysis?.trim() ? dto.analysis : null,
      createdAt: new Date().toISOString(),
    }
    await db.insert(schema.questions).values(row).run()
    return this.findOne(row.id)
  }

  /** 更新例题（admin 编辑） */
  async update(id: string, dto: UpdateQuestionDto) {
    const existing = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, id))
      .get()
    if (!existing) {
      throw new NotFoundException('题目不存在')
    }
    await db
      .update(schema.questions)
      .set({
        pointId: dto.pointId,
        pointTitle: dto.pointTitle,
        type: dto.type,
        stem: dto.stem,
        // 仅单选题存选项；填空/判断题一律清空为 []（避免切换题型后残留旧选项）
        choices: dto.type === 'single' && dto.choices?.length ? JSON.stringify(dto.choices) : '[]',
        answer: dto.answer,
        analysis: dto.analysis?.trim() ? dto.analysis : null,
      })
      .where(eq(schema.questions.id, id))
      .run()
    return this.findOne(id)
  }

  /** 删除例题（admin） */
  async remove(id: string) {
    const result = await db.delete(schema.questions).where(eq(schema.questions.id, id)).run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException('题目不存在')
    }
    return { id }
  }

  /** 题目详情 */
  async findOne(id: string) {
    const row = await db.select().from(schema.questions).where(eq(schema.questions.id, id)).get()
    if (!row) {
      throw new NotFoundException('题目不存在')
    }
    return mapRow(row)
  }
}
