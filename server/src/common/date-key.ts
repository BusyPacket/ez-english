/**
 * 日期工具：以「东八区、每日凌晨 4 点」作为答题日/今日榜的分界。
 * 即每天 04:00 刷新为新的“一天”，凌晨 0~3 点仍计入前一天。
 */
export const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000
/** 每日开始的小时（东八区），凌晨 4 点开始新的一天 */
export const DAY_START_HOUR = 4
export const DAY_MS = 24 * 60 * 60 * 1000

/** 返回某时间戳所属「答题日」的日期键（YYYY-MM-DD，以东八区凌晨 4 点为日界） */
export function beijingDateKey(ts: number): string {
  return new Date(ts + BEIJING_OFFSET_MS - DAY_START_HOUR * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
}
