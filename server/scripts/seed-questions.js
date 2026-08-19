// 例题种子脚本：为「专升本英语考点整理」的 63 个叶子考点各生成一道单选题
// 运行：在 server 目录执行 `node scripts/seed-questions.js`（幂等：先清空 questions 再写入）
const { createClient } = require('@libsql/client')
const { randomUUID } = require('node:crypto')
const { join } = require('node:path')

const client = createClient({
  url: `file:${join(process.cwd(), 'data', 'ez-english.db').replace(/\\/g, '/')}`,
})

// pointId 与 shared 大纲一致（@ez-english/shared knowledgeSections 的叶子 id）
const QUESTIONS = [
  // ============ 词汇 ============
  {
    pointId: 'noun-count',
    pointTitle: '可数名词与不可数名词',
    stem: '下列单词中，属于不可数名词的是？',
    choices: ['book', 'advice', 'desk', 'apple'],
    answer: 'B',
    analysis:
      'advice（建议）是不可数名词，无复数形式，不可与 a 连用；book / desk / apple 均为可数名词。',
  },
  {
    pointId: 'noun-plural',
    pointTitle: '名词单复数变化',
    stem: '下列名词的复数形式书写错误的是？',
    choices: ['tomato → tomatoes', 'photo → photos', 'child → childs', 'foot → feet'],
    answer: 'C',
    analysis:
      'child 的复数是不规则的 children，不是 childs。o 结尾少数加 es（tomato→tomatoes）、多数加 s（photo→photos）；foot→feet 改变元音。',
  },
  {
    pointId: 'noun-measure',
    pointTitle: '不可数名词的计量（piece of 等）',
    stem: '下列计量表达正确的是？',
    choices: ['two pieces of advices', 'a piece of news', 'two breads', 'an information'],
    answer: 'B',
    analysis:
      'news 是不可数名词，计量用 a piece of news。advice / bread / information 同样不可数，不能说 two advices、two breads、an information。',
  },
  {
    pointId: 'noun-possessive',
    pointTitle: '名词所有格',
    stem: '表示“教师节”的正确说法是？',
    choices: ['Teacher’s Day', 'Teachers’ Day', 'Teachers Day', 'Teachers’s Day'],
    answer: 'B',
    analysis:
      '复数名词以 s 结尾，所有格直接加撇号：Teachers’ Day。单数加 ’s（Teacher’s）；复数无 s 加 ’s（Children’s Day）。',
  },
  {
    pointId: 'det-basic',
    pointTitle: '常用限定词（some/any/many/much 等）',
    stem: 'Can I have ___ water, please?',
    choices: ['some', 'any', 'many', 'a'],
    answer: 'A',
    analysis:
      '期望得到肯定回答的请求疑问句用 some；any 用于否定或一般疑问句；many 修饰可数复数；a 后接单数可数名词。',
  },
  {
    pointId: 'det-quantifier',
    pointTitle: '数量限定词与可数/不可数搭配',
    stem: '下列搭配正确的是？',
    choices: ['much apples', 'many water', 'a few books', 'a little books'],
    answer: 'C',
    analysis:
      'a few + 可数名词复数（books），表“一些”。much 修饰不可数（much water），many 修饰可数复数（many apples），a little 修饰不可数名词。',
  },
  {
    pointId: 'det-order',
    pointTitle: '限定词的位置与排序（前/中/后位）',
    stem: '下列短语排序正确的是？',
    choices: [
      'all the four teachers',
      'the all four teachers',
      'four all the teachers',
      'all four the teachers',
    ],
    answer: 'A',
    analysis:
      '限定词排序：前位（all/both/half）+ 中位（the/this/my）+ 后位（four/first），即 all the four teachers。',
  },
  {
    pointId: 'pron-personal',
    pointTitle: '人称代词与物主代词',
    stem: '— Is this your umbrella? — No, it’s not ___.',
    choices: ['my', 'mine', 'I', 'me'],
    answer: 'B',
    analysis:
      '此处需要名词性物主代词作表语，用 mine。my 是形容词性物主代词，须接名词；I 是主格；me 是宾格。',
  },
  {
    pointId: 'pron-reflexive',
    pointTitle: '反身代词',
    stem: '“请随便吃点水果”的正确表达是？',
    choices: [
      'Help yourself to some fruit.',
      'Help you to some fruit.',
      'Enjoy you to some fruit.',
      'Devote yourself to some fruit.',
    ],
    answer: 'A',
    analysis:
      '固定搭配 help oneself to 表示“随便吃/用”。enjoy oneself 是“玩得开心”，devote oneself to 是“致力于”。',
  },
  {
    pointId: 'pron-interrogative',
    pointTitle: '疑问代词（who/whom/whose 等）',
    stem: '___ is knocking at the door?',
    choices: ['Who', 'Whom', 'Whose', 'Which'],
    answer: 'A',
    analysis:
      '作主语（敲门的人）用主格 who；whom 是宾格；whose 表所属；which 表选择。对主语提问保持陈述语序。',
  },
  {
    pointId: 'pron-indefinite',
    pointTitle: '不定代词（复合不定代词）',
    stem: 'I have ___ special to tell you.',
    choices: ['something', 'anything', 'nothing', 'everything'],
    answer: 'A',
    analysis: '肯定句用 something；形容词修饰复合不定代词要后置（something special）。',
  },
  {
    pointId: 'pron-reciprocal',
    pointTitle: '相互代词（each other / one another）',
    stem: 'The two brothers often help ___（两人之间互相帮助）。',
    choices: ['each other', 'one another', 'themselves', 'itself'],
    answer: 'A',
    analysis:
      '两者之间用 each other；三者以上用 one another；反身代词（themselves）表示“亲自”，不表相互。',
  },
  {
    pointId: 'pron-demonstrative',
    pointTitle: '指示代词',
    stem: '___ is my pen here in my hand（近指单数）。',
    choices: ['This', 'That', 'These', 'Those'],
    answer: 'A',
    analysis:
      'this 近指单数；that 远指单数；these 近指复数；those 远指复数。手边的笔是近指且单数，用 this。',
  },
  {
    pointId: 'article-indefinite',
    pointTitle: '不定冠词 a/an',
    stem: 'I waited for ___ hour at the station.',
    choices: ['a', 'an', 'the', '/'],
    answer: 'B',
    analysis: 'hour 以元音音素开头（h 不发音），用 an；a 用于辅音音素前（a house）。',
  },
  {
    pointId: 'article-definite',
    pointTitle: '定冠词 the',
    stem: '___ Smiths are friendly to me（史密斯一家）。',
    choices: ['A', 'An', 'The', '/'],
    answer: 'C',
    analysis: 'the + 姓氏复数表示一家人：The Smiths 史密斯一家。',
  },
  {
    pointId: 'article-zero',
    pointTitle: '零冠词',
    stem: '下列使用正确的是？',
    choices: [
      'play the football',
      'have the breakfast',
      'by bus',
      'go to the school（表示“上学”）',
    ],
    answer: 'C',
    analysis:
      'by + 交通方式不加冠词（by bus）；三餐、球类前不加冠词（have breakfast、play football）；go to school 表“上学”，加 the 则指“去那所学校”。',
  },
  {
    pointId: 'num-cardinal',
    pointTitle: '基数词',
    stem: 'There are ___ students in our school（五百名）。',
    choices: ['five hundreds', 'five hundred', 'hundreds of', 'five hundreds of'],
    answer: 'B',
    analysis: '前面有具体数字不加 s（five hundred）；hundreds of 表“成百上千”，不与具体数字连用。',
  },
  {
    pointId: 'num-ordinal',
    pointTitle: '序数词',
    stem: '— Would you like ___ cup of tea? — No, thanks.',
    choices: ['second', 'the second', 'a second', 'two'],
    answer: 'C',
    analysis: '序数词与不定冠词连用表“再一、又一”：a second cup 再来一杯。',
  },
  {
    pointId: 'num-expression',
    pointTitle: '分数、小数、日期与编号表达',
    stem: '“五分之二”的正确表达是？',
    choices: ['two fifth', 'two fifths', 'second fifths', 'fifth twos'],
    answer: 'B',
    analysis:
      '分数：分子用基数词（two）、分母用序数词（fifth），分子大于 1 时分母加 s → two fifths。',
  },
  {
    pointId: 'num-arithmetic',
    pointTitle: '算术表达（plus/minus/equals 等）',
    stem: '“二加三等于五”的正确表达是？',
    choices: [
      'Two plus three equal five.',
      'Two plus three equals five.',
      'Two plus three are five.',
      'Two plus three is equal five.',
    ],
    answer: 'B',
    analysis:
      '算术表达中的 equals 固定用单数：Two plus three equals five.；表达“等于”用 equals，不用 is equal（或 is equal to）。',
  },
  {
    pointId: 'adj-usage',
    pointTitle: '形容词作定语/表语',
    stem: 'Leaves turn ___ in autumn.',
    choices: ['yellow', 'yellowly', 'yellowness', 'a yellow'],
    answer: 'A',
    analysis: 'turn 是系动词，后接形容词作表语（yellow），不加 -ly，也不加冠词。',
  },
  {
    pointId: 'adj-order',
    pointTitle: '多个形容词的排列顺序',
    stem: '下列形容词排序正确的是：___ house',
    choices: [
      'a small old Chinese wooden',
      'a Chinese old wooden small',
      'a wooden small old Chinese',
      'a small wooden old Chinese',
    ],
    answer: 'A',
    analysis: '多个形容词排序口诀（大小→新旧→国籍→材料）：a small old Chinese wooden house。',
  },
  {
    pointId: 'adj-conversion',
    pointTitle: '形容词与其他词类的转化',
    stem: '下列哪个是形容词 careful 的正确副词形式？',
    choices: ['careful', 'carefuly', 'carefully', 'care'],
    answer: 'C',
    analysis:
      '形容词变副词一般加 -ly：careful → carefully。careful 是形容词本身，carefuly 拼写错误，care 是名词/动词。',
  },
  {
    pointId: 'adv-type',
    pointTitle: '副词分类（时间/地点/方式/程度/频率）',
    stem: '下列副词中，属于频率副词的是？',
    choices: ['often', 'here', 'very', 'slowly'],
    answer: 'A',
    analysis: 'often（经常）是频率副词；here 是地点副词；very 是程度副词；slowly 是方式副词。',
  },
  {
    pointId: 'adv-usage',
    pointTitle: '副词的位置与用法',
    stem: 'He speaks English ___ well.',
    choices: ['very', 'very much', 'much', 'enough'],
    answer: 'A',
    analysis:
      'very 可单独修饰形容词/副词（very well）；very 不可单独修饰动词；enough 作副词须后置。',
  },
  {
    pointId: 'degree-comparative',
    pointTitle: '比较级',
    stem: 'This book is ___ than that one.',
    choices: ['much easier', 'more easy', 'very easier', 'easyer'],
    answer: 'A',
    analysis:
      '比较级前可用 much 加强（much easier）；easy 双音节以 y 结尾 → easier；very 不修饰比较级；easyer 拼写错误。',
  },
  {
    pointId: 'degree-superlative',
    pointTitle: '最高级',
    stem: 'He is ___ student in our class.',
    choices: ['the tallest', 'tallest', 'a tallest', 'more tallest'],
    answer: 'A',
    analysis: '最高级前用 the：the + 最高级 + 名词 + 范围短语（in our class）。',
  },
  {
    pointId: 'degree-equality',
    pointTitle: '同级比较与倍数表达',
    stem: 'The lake is twice ___ large as that one.',
    choices: ['as', 'so', 'than', 'more'],
    answer: 'A',
    analysis: '倍数表达法：A + 谓语 + 倍数 + as + 原级 + as + B，即 twice as large as。',
  },
  {
    pointId: 'prep-time',
    pointTitle: '时间介词',
    stem: 'I was born ___ the morning of May 1st.',
    choices: ['in', 'on', 'at', 'for'],
    answer: 'B',
    analysis:
      '具体某一天的上午/下午用 on（on the morning of May 1st）；泛指上/下午用 in；时刻用 at。',
  },
  {
    pointId: 'prep-place',
    pointTitle: '地点介词',
    stem: 'There is a temple ___ the hill.',
    choices: ['on', 'in', 'at', 'under'],
    answer: 'A',
    analysis: 'on 表表面接触（寺庙建在山上）；in 表三维里面；at 接一个地点“点”。',
  },
  {
    pointId: 'prep-manner',
    pointTitle: '方式介词（by/with/through 等）',
    stem: 'I learn English ___ watching movies.',
    choices: ['by', 'for', 'at', 'on'],
    answer: 'A',
    analysis: 'by doing 表“通过……方式”；介词后接动词必须用动名词（watching）。',
  },
  {
    pointId: 'prep-reason',
    pointTitle: '原因介词（for/because of）',
    stem: 'He was late ___ the heavy rain.',
    choices: ['because', 'because of', 'because for', 'for of'],
    answer: 'B',
    analysis: 'because of + 名词/短语（the heavy rain）表原因；because 后须接从句。',
  },
  {
    pointId: 'prep-collocation',
    pointTitle: '常用介词搭配（动+介 / 形+介）',
    stem: 'Thank you ___ helping me.',
    choices: ['for', 'of', 'to', 'with'],
    answer: 'A',
    analysis: '固定搭配 thank sb. for doing sth.；介词后接动词用动名词（helping）。',
  },
  {
    pointId: 'conj-coordinating',
    pointTitle: '并列连词（and/but/or/so）',
    stem: 'He studies hard, ___ he gets good grades.',
    choices: ['and', 'or', 'but', 'so'],
    answer: 'A',
    analysis:
      'and 连接并列递进的两个完整句子（连接完整句子须加逗号）；but 表转折；or 表选择；so 表结果。',
  },
  {
    pointId: 'conj-subordinating',
    pointTitle: '从属连词（引导从句）',
    stem: '___ you work hard, you will succeed（只要）。',
    choices: ['As long as', 'Because', 'Though', 'While'],
    answer: 'A',
    analysis: 'as long as 引导条件状语从句，表“只要”；主将从现（从句用一般现在时，主句用将来时）。',
  },
  {
    pointId: 'verb-transitive',
    pointTitle: '及物动词与不及物动词',
    stem: '下列动词中，通常作不及物动词（不能直接接宾语）的是？',
    choices: ['buy', 'arrive', 'give', 'make'],
    answer: 'B',
    analysis:
      'arrive 是不及物动词，须接介词（arrive at/in + 地点）；buy / give / make 是及物动词，可直接接宾语。',
  },
  {
    pointId: 'verb-link',
    pointTitle: '系动词',
    stem: 'The food ___ delicious.',
    choices: ['tastes', 'eats', 'drinks', 'has'],
    answer: 'A',
    analysis: 'taste 是感官系动词，后接形容词作表语（delicious）；感官动词没有被动语态。',
  },
  {
    pointId: 'verb-auxiliary',
    pointTitle: '助动词与情态动词',
    stem: 'You ___ have finished your homework yesterday（本应该做而没做）。',
    choices: ['should', 'must', 'can', 'need'],
    answer: 'A',
    analysis: 'should have done 表“本应该做而未做”；must have done 表“过去一定做了”（推测）。',
  },
  {
    pointId: 'verb-durative',
    pointTitle: '延续性动词与瞬时性动词',
    stem: 'I have ___ the book for two weeks.',
    choices: ['borrowed', 'bought', 'kept', 'come'],
    answer: 'C',
    analysis:
      '非延续性动词不能与时间段连用，需换成延续性动词：borrow→keep、buy→have/own、come→be here。',
  },
  {
    pointId: 'verb-nonfinite',
    pointTitle: '非谓语动词（不定式/动名词/分词）',
    stem: 'He enjoys ___ football after school.',
    choices: ['playing', 'to play', 'play', 'played'],
    answer: 'A',
    analysis:
      'enjoy 后接动名词（enjoy doing）。记忆口诀“享完避练”指 enjoy/finish/mind/avoid/practice 等接 doing。',
  },
  {
    pointId: 'verb-phrasal',
    pointTitle: '短语动词与固定搭配',
    stem: 'He has got ___ to getting up early.',
    choices: ['used', 'use', 'using', 'uses'],
    answer: 'A',
    analysis: 'be/get used to doing 表“习惯于做某事”，to 是介词，后接动名词（getting up）。',
  },
  {
    pointId: 'int-basic',
    pointTitle: '常用感叹词与用法（oh/well/ah 等）',
    stem: '下列单词中，属于感叹词的是？',
    choices: ['oh', 'and', 'the', 'at'],
    answer: 'A',
    analysis: 'oh 是感叹词（表惊讶、领悟等）；and 是连词；the 是冠词；at 是介词。',
  },
  // ============ 句子 ============
  {
    pointId: 'sentence-elements',
    pointTitle: '句子成分',
    stem: '在 “He asked me to help him.” 中，me 充当的是？',
    choices: ['宾语', '主语', '定语', '状语'],
    answer: 'A',
    analysis: 'asked 是及物动词，me 作宾语；to help him 作宾语补足语。',
  },
  {
    pointId: 'five-basic-patterns',
    pointTitle: '五种基本句型',
    stem: 'The flowers are blooming. 属于哪种基本句型？',
    choices: ['主谓 SV', '主谓宾 SVO', '主系表 SVP', '主谓双宾 SVOO'],
    answer: 'A',
    analysis: '谓语是 are blooming（现在进行时整体作谓语），句子为主谓结构；时态不影响句子结构。',
  },
  {
    pointId: 'subject-verb-agreement',
    pointTitle: '主谓一致',
    stem: 'There ___ a pen and two pencils on the desk.',
    choices: ['is', 'are', 'be', 'have'],
    answer: 'A',
    analysis: 'There be 就近原则：be 由紧跟的第一个名词（a pen，单数）决定 → is。',
  },
  {
    pointId: 'predicate-verb',
    pointTitle: '造句与谓语动词',
    stem: '一个简单句中，谓语动词必须是？',
    choices: ['实义动词', '系动词', '情态动词', '助动词'],
    answer: 'A',
    analysis:
      '谓语动词一定是实义动词；一个简单句只能有一个主谓结构。系/情态/助动词都不能独立作谓语。',
  },
  {
    pointId: 'compound-predicate',
    pointTitle: '并列谓语',
    stem: 'My brother jumped out of the closet and ___ me.',
    choices: ['frightened', 'frightens', 'frightening', 'to frighten'],
    answer: 'A',
    analysis: '同一主语发出多个动作，用 and 连接并列谓语，时态保持一致（jumped → frightened）。',
  },
  {
    pointId: 'compound-predicative',
    pointTitle: '并列表语',
    stem: 'The weather is cold in the North and ___ in the East.',
    choices: ['windy', 'wind', 'windily', 'winds'],
    answer: 'A',
    analysis: '一个主语 + 系动词 + 多个表语，用 and 连接形容词（cold and windy）。',
  },
  {
    pointId: 'tense-simple',
    pointTitle: '一般时态（现在/过去/将来）',
    stem: 'She ___ to school every day.',
    choices: ['goes', 'went', 'will go', 'is going'],
    answer: 'A',
    analysis: 'every day 表经常性动作，用一般现在时；第三人称单数主语，谓语用 goes。',
  },
  {
    pointId: 'tense-progressive',
    pointTitle: '进行时态',
    stem: 'Look! The children ___ in the playground.',
    choices: ['are playing', 'play', 'played', 'will play'],
    answer: 'A',
    analysis: 'look! 提示当下正在发生，用现在进行时（are playing）。',
  },
  {
    pointId: 'tense-perfect',
    pointTitle: '完成时态',
    stem: 'He ___ to Beijing twice（去了已回）。',
    choices: ['has been', 'has gone', 'went', 'had gone'],
    answer: 'A',
    analysis: 'been to 表“去了已回”，gone to 表“去了未回”；twice 提示用现在完成时 have/has been。',
  },
  {
    pointId: 'voice',
    pointTitle: '被动语态',
    stem: 'The classroom ___ by the students every day.',
    choices: ['is cleaned', 'cleans', 'is cleaning', 'cleaned'],
    answer: 'A',
    analysis: '被动语态：be + 过去分词（is cleaned）；动作承受者 classroom 作主语。',
  },
  {
    pointId: 'clause-nominal',
    pointTitle: '名词性从句（主/宾/表/同位语）',
    stem: 'I don’t know ___ he is.',
    choices: ['who', 'whom', 'whose', 'which'],
    answer: 'A',
    analysis: '宾语从句必须用陈述语序；who 作表语（who he is），不能用 who is he。',
  },
  {
    pointId: 'clause-attributive',
    pointTitle: '定语从句',
    stem: 'This is the book ___ I bought yesterday.',
    choices: ['which', 'who', 'when', 'where'],
    answer: 'A',
    analysis: '先行词 book 是物，从句缺宾语，用 which/that；who 指人，when/where 作状语。',
  },
  {
    pointId: 'clause-adverbial',
    pointTitle: '状语从句',
    stem: 'I fell asleep ___ I was reading.',
    choices: ['while', 'until', 'since', 'because'],
    answer: 'A',
    analysis:
      'while 接进行时，表“正在……的时候”（正在看书时睡着了）；until 表“直到”，since 表“自从”，because 表原因。',
  },
  {
    pointId: 'imperative',
    pointTitle: '祈使句',
    stem: '___ late for school again.',
    choices: ['Don’t be', 'Not be', 'Don’t', 'Be not'],
    answer: 'A',
    analysis: '祈使句否定：Don’t + 动词原形；be 动词的否定为 Don’t be。',
  },
  {
    pointId: 'there-be',
    pointTitle: 'There be 句型',
    stem: '___ a meeting tomorrow.',
    choices: ['There will be', 'There will have', 'There have', 'There is going to have'],
    answer: 'A',
    analysis: 'There be 表“存在”，绝不用 There have；将来时用 There will be。',
  },
  {
    pointId: 'exclamatory',
    pointTitle: '感叹句',
    stem: '___ a good boy Tom is!',
    choices: ['What', 'How', 'What a', 'How a'],
    answer: 'C',
    analysis: '感叹句结构：What + a/an + adj. + n. + 主谓！boy 是可数单数，须用 What a。',
  },
  {
    pointId: 'question-types',
    pointTitle: '疑问句（四大类）',
    stem: '___ is in the room?（对主语提问）',
    choices: ['Who', 'Whom', 'Whose', 'Which'],
    answer: 'A',
    analysis: '对主语或主语定语提问时保持陈述语序，用主格 who（Who is in the room?）。',
  },
  {
    pointId: 'causative-verb',
    pointTitle: '使役动词与主谓宾',
    stem: 'The teacher had the students ___ the text.',
    choices: ['read', 'to read', 'reading', 'readed'],
    answer: 'A',
    analysis: '使役动词 have/make/let + sb. + 动词原形（省略 to）：had the students read。',
  },
  {
    pointId: 'subjunctive',
    pointTitle: '虚拟语气',
    stem: 'If I ___ you, I would study harder.',
    choices: ['were', 'am', 'was', 'be'],
    answer: 'A',
    analysis:
      '与现在事实相反的非真实条件句：if 从句用过去式（be 一律用 were），主句用 would + do。',
  },
  {
    pointId: 'inversion',
    pointTitle: '倒装句',
    stem: 'Never ___ such a beautiful place before.',
    choices: ['have I seen', 'I have seen', 'I seen', 'have seen I'],
    answer: 'A',
    analysis: '否定副词 never 置于句首，句子部分倒装：助动词提到主语前（have I seen）。',
  },
  {
    pointId: 'emphasis',
    pointTitle: '强调句',
    stem: 'It was in 2012 ___ I graduated.',
    choices: ['that', 'when', 'which', 'where'],
    answer: 'A',
    analysis:
      '强调句结构 It is/was + 被强调部分 + that + 其余；强调非人成分只能用 that（不能用 when/which/where）。',
  },
]

async function seed() {
  // 幂等：清空旧题再写入，保证重新运行结果一致
  await client.execute('DELETE FROM questions')
  const createdAt = new Date().toISOString()
  let inserted = 0
  for (const q of QUESTIONS) {
    await client.execute({
      sql: `INSERT INTO questions (id, type, point_id, point_title, stem, choices, answer, analysis, created_at)
            VALUES (?, 'single', ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        randomUUID(),
        q.pointId,
        q.pointTitle,
        q.stem,
        JSON.stringify(q.choices),
        q.answer,
        q.analysis,
        createdAt,
      ],
    })
    inserted += 1
  }
  console.log(`✅ 例题已写入 ${inserted} 道（清空后重建）`)
  process.exit(0)
}

seed().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
