// 2024 年浙江省统招专升本英语真题
// 数据来源：exam-papers/2024年英语真题_pymupdf.md（PDF 提取）

import type { ExamPaper } from './exam.types'

export const examPaper2024: ExamPaper = {
  year: 2024,
  title: '浙江省2024年选拔优秀高职高专毕业生进入本科学习统一考试 · 英语',
  parts: [
    {
      id: 'reading',
      title: 'Part I Reading Comprehension (60 points, 60 minutes)',
      score: '60 分',
      blocks: [
        {
          id: 'passage-reading-format1',
          type: '四选一',
          title: 'Section A Passage Reading · Format I（阅读选择）',
          score: '40 分',
          directions:
            'There are 4 passages in this part. Each passage is followed by some questions or unfinished statements. For each of them there are four choices marked A, B, C, and D. You should decide on the best choice and blacken the corresponding letter on The Answer Sheet. (40 points)',
          passages: [
            {
              title: 'Passage One（Questions 1-5）',
              content: `Blue whales (鲸鱼) have made themselves at home in a part of the Indian Ocean, where they hadn't been seen for many years, according to a study published late last year. The blue whale is the largest animal on Earth. These whales can grow to about 100 feet long, and the animal's heart alone can be the size of a small car. Blue whales were filmed in the waters around the Seychelles in 2020. The Seychelles are a group of islands that make up the smallest African country. Hunters almost completely wiped out blue whales in the area in the 1960s.

During this recent exploration, however, scientists spotted several of the creatures. Research suggests that these whales are not just passing through. The discovery was made with the help of a "sound trap," an object that was fitted with recording devices and batteries and placed on the seafloor in November 2021. It was left there for a year, recording 15 minutes every hour. When scientists studied the recordings, they discovered the blue whales' recognizable song, which is so deep that it can't be heard naturally by human ears.

The whale song were detected between December and April, a common time for blue whales to breed and nurse their young. Kathleen Stafford, one of the researchers, said that the scientists think the noise was the singing of male whales. "They sing during the breeding season," she explained. This could mean that the Seychelles is an important breeding area far this type of animals. The government of the Seychelles has been making major efforts to protect the oceans around the island since 2015. The appearance of these whales shows that its work seems to have many difference. Stafford said that the Seychelles, which doesn't have many big ships sailing nearby, could be "a nice, quiet, sale place for blue whales."`,
              questions: [
                {
                  no: 1,
                  answer: 'D',
                  point: '细节理解',
                  analysis:
                    '由第一段倒数第二句 "The Seychelles are a group of islands that make up the smallest African country." 可知，塞舌尔是一群岛屿，构成非洲最小的国家，故选 D。',
                  stem: 'What can we learn about the Seychelles according to Para.1?',
                  choices: [
                    'It is a big island.',
                    'It is a part of India.',
                    'It is a large ocean.',
                    'It is an African country.',
                  ],
                },
                {
                  no: 2,
                  answer: 'C',
                  point: '细节理解 · 数字定位',
                  analysis:
                    '由第一段最后一句 "Hunters almost completely wiped out blue whales in the area in the 1960s." 可知，20 世纪 60 年代猎人几乎将该地区蓝鲸全部消灭，即蓝鲸几乎全部灭绝（died out 是 wiped out 的同义表达），故选 C。',
                  stem: 'What happened to blue whales in the Seychelles in the 1960s?',
                  choices: [
                    'They were filmed nearby.',
                    'They were spotted by hunters.',
                    'They almost entirely died out.',
                    'They passed through the place.',
                  ],
                },
                {
                  no: 3,
                  answer: 'B',
                  point: '词义猜测',
                  analysis:
                    '由第二段最后三句可知，sound trap 是一个装有记录设备（recording devices）的物体，每小时记录 15 分钟，科学家们据此发现蓝鲸歌声，可推知 sound trap 指一种记录声音的设备，故选 B。',
                  stem: 'What does the underlined expression "sound trap" in Para.2 refer to?',
                  choices: [
                    'An object for placing batteries.',
                    'A device for recording sounds.',
                    'A tool for catching blue whales.',
                    'A machine for attracting blue whales.',
                  ],
                },
                {
                  no: 4,
                  answer: 'C',
                  point: '细节理解 · 时间范围',
                  analysis:
                    '由第三段第一句 "The whale song were detected between December and April" 可知，蓝鲸歌声在 12 月到 4 月之间被探测到，选项中只有 C（In March，在 3 月）在该时间范围内，故选 C。',
                  stem: 'When were the whale songs detected?',
                  choices: ['In July.', 'In May.', 'In March.', 'In November.'],
                },
                {
                  no: 5,
                  answer: 'B',
                  point: '细节理解 · 目的',
                  analysis:
                    '由第三段 "The government of the Seychelles has been making major efforts to protect the oceans around the islands since 2015." 可知，自 2015 年以来塞舌尔政府一直努力保护岛屿周围的海洋，故选 B。',
                  stem: "What's the purpose of the government's major work since 2015?",
                  choices: [
                    'To build a nice home for blue whales.',
                    'To protect the waters around the islands.',
                    'To make the appearance of the place different.',
                    'To prevent many big ships from sailing nearby.',
                  ],
                },
              ],
            },
            {
              title: 'Passage Two（Questions 6-10）',
              content: `You won't be surprised to hear that sweet treats such as cakes and biscuits contain sugar, but do you know that sugar occurs naturally in most foods apart from meat and fish? We look at this remarkable substance and how it has changed the world.

Humans started growing sugar cane (甘蔗) around 10,000 years ago on the island of New Guinea (新几内亚) in the Pacific Ocean. Before that, honey and juice from fruit were almost the only sweeteners people had. Over thousands of years, knowledge of how to grow sugar cane spread to China, Southeast Asia and India. Slowly, the love of sugar travelled west.

In the 11th century, soldiers who fought in the Crusades in the Middle East brought sugar back to Britain. It took a long time for it to become popular there, partly because it was very expensive. It was used sparingly (少量地) as a flavor and a medicine for coughs and stomach problems.

For hundreds of yeas, sugar was a luxury reserved for royalty and nobles, but steadily the market grew. By the I7th century, the farms growing sugar in the Caribbean couldn't keep up with demand. More farms to grow more sugar cane needed more people to work them. To feed this need, Europeans enslaved men, women and children from Africa and transported them to the Caribbean and Central and South America. There they were forced to work in terrible conditions. Britain's strong desire for sugar helped drive this trade in enslaved people. Nowadays, most companies try to make sure that the farmers and workers who produce their sugar are treated fairly.

Experts say that sugar is fine when eaten in small amounts. The trouble comes when you eat too much of it. They suggested that you enjoy sugar as an occasional treat and brush you teeth twice a day.`,
              questions: [
                {
                  no: 6,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '由第二段第一句 "Humans started growing sugar cane around 10,000 years ago on the island of New Guinea in the Pacific Ocean." 可知，大约 1 万年前人类在太平洋的新几内亚岛上开始种植甘蔗，即新几内亚人首先开始种植，故选 C。',
                  stem: 'Who started growing sugar cane first?',
                  choices: ['Chinese.', 'British.', 'New Guineans.', 'Southeast Asians.'],
                },
                {
                  no: 7,
                  answer: 'D',
                  point: '细节理解 · 因果',
                  analysis:
                    '由第三段 "...It took a long time for it to become popular there, partly because it was very expensive." 可知，糖在英国流行起来很慢，部分原因是它非常昂贵，故选 D。',
                  stem: 'Sugar was used sparingly in Britain in the 11th century because it was ______.',
                  choices: ['natural', 'unknown', 'unhealthy', 'expensive'],
                },
                {
                  no: 8,
                  answer: 'B',
                  point: '细节理解 · 因果',
                  analysis:
                    '由第四段 "Britain\'s strong desire for sugar helped drive this trade in enslaved people." 可知，英国对糖的强烈需求助推了奴隶贸易的发展，故选 B。',
                  stem: "What was the result of Britain's growing need for sugar in the 17th century?",
                  choices: [
                    'Sugar producers were treated fairly.',
                    'The trade in slaves began to develop.',
                    'People could make a fortune from trading sugar.',
                    'Sugar became a luxury reserved for royalty and nobles.',
                  ],
                },
                {
                  no: 9,
                  answer: 'A',
                  point: '观点态度',
                  analysis:
                    '末段专家说少量吃糖没问题，但吃太多就有麻烦，建议偶尔吃糖、每天刷两次牙，态度中立，故选 A（Neutral 中立的）。',
                  stem: "What is experts' attitude toward eating sugar?",
                  choices: ['Neutral.', 'Negative.', 'Supportive.', 'Indifferent.'],
                },
                {
                  no: 10,
                  answer: 'B',
                  point: '主旨大意 · 标题',
                  analysis:
                    '第一段最后一句 "We look at this remarkable substance and how it has changed the world." 点明主旨：糖如何改变了世界，其余选项只是文中的部分内容，故选 B。',
                  stem: 'What does the passage mainly talk about?',
                  choices: [
                    'How sugar came to Britain.',
                    'How sugar has changed the world.',
                    'When people started growing sugar.',
                    'What benefits people get from sugar.',
                  ],
                },
              ],
            },
            {
              title: 'Passage Three（Questions 11-15）',
              content: `We're all familiar with the sound of birds, but how do they get that perfect pitch (音高)?

Songbirds do indeed have perfect pitch. A scientific study has shown that various songbirds are much better at determining, distinguishing and remembering isolated pitches than human beings.

The birds wake up at a very particular time in the morning and begin to sing. This is because each type has its own specific waking stimulus, which is linked to the brightness of the dawn light. These waking times are so precise that we can even tell the time by them.

Just as human beings have to learn to speak, so birds have to learn how to sing. They do this in several stages. First, they practice tones and sounds, which is similar to the baby stage in human language development. During the second stage, the birds practice their song for eight to nine months, until memory and practice match up. The singing is strengthened and polished during the final phase. Humans and birds both appear to go through a phase when the brain is particularly receptive (易于接受的) to learning a language or song. This is why birds have to hear other birds of their own type sing while they are still young. Otherwise, they won't be able to produce much more than a whistle later on.

Birds don't all sing the same songs, not even within a type. The song of a robin (知更鸟) in London will be quite different from that of a robin in Paris. Although the members of each bird type share a system of sounds, dialect differences are quite common. Some bird types have more than 60 dialects. Males that master several dialects have a better chance of finding a mate since females prefer mates from the same dialect family. Bird dialects also help to drive evolution, because different songs lead to the formation of groups.`,
              questions: [
                {
                  no: 11,
                  answer: 'B',
                  point: '细节理解 · 排除法（NOT good at）',
                  analysis:
                    '由第二段第二句 "A scientific study has shown that various songbirds are much better at determining, distinguishing and remembering isolated pitches than human beings." 可知，鸣禽擅长确定、区分和记忆音高，只有 explaining（解释）未提及，故选 B。',
                  stem: 'According to the scientific study, songbirds are NOT good at ______ different pitches.',
                  choices: ['telling', 'explaining', 'memorizing', 'determining'],
                },
                {
                  no: 12,
                  answer: 'D',
                  point: '词义猜测',
                  analysis:
                    '由第三段 "each type has its own specific waking stimulus, which is linked to the brightness of the dawn light" 可知，唤醒刺激与黎明光线亮度有关，stimulus 指光亮（light），故选 D。',
                  stem: 'What does the underlined word "stimulus" in Para.3 refer to?',
                  choices: ['Color.', 'Smell.', 'Sound.', 'Light.'],
                },
                {
                  no: 13,
                  answer: 'A',
                  point: '细节理解',
                  analysis:
                    '第四段说明鸟类分几个阶段学鸣唱：先练习声调和发音，第二阶段练习八到九个月直至记忆与练习匹配，最后阶段加强完善，即分三个阶段学习，故选 A。',
                  stem: 'Which of the following is true about birds learning how to sing?',
                  choices: [
                    'They learn to sing in three stages.',
                    'They polish their sounds for 8 months.',
                    'They begin to practice songs in the first stage.',
                    'They match memory with practice in the third stage.',
                  ],
                },
                {
                  no: 14,
                  answer: 'D',
                  point: '细节理解',
                  analysis:
                    '由最后一段 "Males that master several dialects have a better chance of finding a mate since females prefer mates from the same dialect family." 可知，掌握多种鸟鸣的雄性更容易找到配偶，故选 D。',
                  stem: 'A male bird singing ______ can find a mate more easily.',
                  choices: [
                    'at spring dawn',
                    'at perfect pitch',
                    'in a strong sound',
                    'in different dialects',
                  ],
                },
                {
                  no: 15,
                  answer: 'C',
                  point: '主旨大意 · 标题',
                  analysis:
                    '全文围绕鸟鸣展开：鸣禽的音高能力、唤醒刺激、学习鸣唱阶段、方言差异与进化作用，C（Science of Birdsong，鸟鸣的科学）最适合作标题，故选 C。',
                  stem: 'What is the best title of the passage?',
                  choices: [
                    'Dialects of Birds.',
                    'Research on Pitch.',
                    'Science of Birdsong.',
                    'Process of Learning to Sing.',
                  ],
                },
              ],
            },
            {
              title: 'Passage Four（Questions 16-20）',
              content: `Generations of parents have told their children to practise their musical instruments. But does musicality improve their cognition later in life? A recent study in an international journal investigated this question by asking middle-aged and older people to complete a questionnaire on their lifetime musical experience before completing cognitive tests. The results showed that musical people had better memory and executive function - the ability to stay focused on tasks, plan and have self-control — than those with less or no musicality.

A good memory is important for playing a musical instrument and this seems to translate into people's cognitive performance. Similarly, executive function is required when people play an instrument, and this also translates into improved cognitive performance. This finding was similar, regardless of which instrument people played or the level of musical proficiency people acquired — although most people in the study played an instrument for only a few years of their lives. What made a difference, however, was whether people still played an instrument or only played in the past. This makes sense as continued engagement in cognitively stimulating activities, such as playing an instrument, should result in continued brain health benefits. In the test having played the piano for three years at primary school might not have such a big impact on our cognitive performance later in life.

According to the study, singing could result in better executive function but not memory, suggesting that playing an instrument has additional brain health benefits. Why singing would help us with our executive function is not clear and requires further investigation. However, singing has a strong social benefit when done in choirs, and there is good evidence that being engaged in social activities is good for our brain health. Sadly, the current study found no association between listening to music and cognitive performance. Cognitive stimulation depends on us being actively engaged in activities, so passively listening to music doesn't seem to provide any cognitive benefits.`,
              questions: [
                {
                  no: 16,
                  answer: 'B',
                  point: '细节理解',
                  analysis:
                    '由第一段最后一句 "The results showed that musical people had better memory and executive function... than those with less or no musicality." 可知，有音乐才能的人记忆力和执行能力更好，故选 B。',
                  stem: 'What is the finding of the recent study in Para.1?',
                  choices: [
                    'Older people can control themselves better.',
                    'Musical people usually have better memory.',
                    'Musical people should pay more attention to their tasks.',
                    'Middle-aged people have greater ability to carry out plans.',
                  ],
                },
                {
                  no: 17,
                  answer: 'D',
                  point: '词义猜测',
                  analysis:
                    '由第二段第一句 "...this seems to translate into people\'s cognitive performance."（这似乎会转变为人们的认知表现）可推知，translate 意为"转变"，与 D（Change from one to another）最接近，故选 D。',
                  stem: 'What does the underlined word "translate" probably mean in Para.2?',
                  choices: [
                    'Give in return for another.',
                    'Express in another language.',
                    'Move from one place to another.',
                    'Change from one to another.',
                  ],
                },
                {
                  no: 18,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '由第二段 "What made a difference, however, was whether people still played an instrument... continued engagement in cognitively stimulating activities... should result in continued brain health benefits." 可知，持续演奏乐器才对大脑健康有益，故选 C。',
                  stem: "What's made a difference in improving people's brain health?",
                  choices: [
                    'Learning music at an early age.',
                    'Playing an instrument in the past.',
                    'Playing an instrument continuously.',
                    'Listening to music for several years.',
                  ],
                },
                {
                  no: 19,
                  answer: 'D',
                  point: '细节理解 · 因果',
                  analysis:
                    '由第三段 "singing has a strong social benefit when done in choirs, and there is good evidence that being engaged in social activities is good for our brain health." 可知，合唱有显著社交益处，有利于大脑健康，故选 D。',
                  stem: "Singing in choirs is good for people's brain health because it can ______.",
                  choices: [
                    'improve their memory',
                    'stimulate their creativity',
                    'result in great self-control',
                    'have a strong social benefit',
                  ],
                },
                {
                  no: 20,
                  answer: 'A',
                  point: '主旨大意',
                  analysis:
                    '全文围绕"音乐才能如何提高认知能力"展开：研究发现有音乐才能者记忆力和执行力更好，持续演奏乐器有益大脑健康，故选 A。',
                  stem: 'What does the passage mainly talk about?',
                  choices: [
                    "How musicality improves people's cognition.",
                    'How music practice is associated with self-control.',
                    "How music instruments change people's memory.",
                    'How singing songs contributes to executive function.',
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'passage-reading-format2',
          type: '七选五',
          title: 'Section A Passage Reading · Format II（七选五）',
          score: '10 分',
          directions:
            'In the following passage, some sentences have been removed. For questions 21-25, choose the most suitable one from the list A-G to fit into each of the numbered blanks. There are two extra choices, which do not fit into any of the gaps. You should decide on the best choice and blacken the corresponding letter on The Answer Sheet. (10 points)',
          passages: [
            {
              title: 'Saving Money at the Cinema（Questions 21-25）',
              content: `There is nothing quite like seeing a new movie on the big screen! But with cinemas not being the cheapest day out, here is how to save some money.

21. ______________ The most expensive tickets are going to be on peak times, which will usually run from Friday night until Sunday evening. But if you can go midweek or in the daytime, you will hopefully find lower prices. There might also be certain days when all tickets are reduced further. Besides, you'd also ask yourself whether you really need to pay extra for a good seat or 3D screening. If you don't think it'll make much of a difference, go for the cheaper option instead.

22. ______________ Some cinema memberships also offer free tickets and then discounts (折扣) on future visits, so they're worth looking at if you know you'll get the money back. But if you are going at least twice a month, then the all-you-can-watch memberships can be wonderful value. There is sometimes a free membership option which could save you a little on things such as online booking fees, so it's well worth signing up!

23. ______________ Most cinemas also run special screenings for families with young kids at a lower price. They're normally at the same time each week and might even come with an extra like a free cup of tea!

24. ______________ If you live somewhere with many cinemas, check what ticket prices are at each one. Often you'll find that one is far cheaper than the other.

25. ______________ You can also save by buying cinema gift cards. You'll often see some cinemas cutting 15% to 20%. You can also use cash-back apps to buy the gift cards and get a percentage back. What's good about these is that they stack with other offers, so you can save twice.`,
              questions: [
                {
                  no: 21,
                  answer: 'B',
                  point: '段落主旨匹配',
                  analysis:
                    '本段讲高峰时段票价最贵，选择周中或白天可买到更低价格 → 对应 B（Avoid expensive tickets，避开昂贵的电影票）。',
                },
                {
                  no: 22,
                  answer: 'C',
                  point: '段落主旨匹配',
                  analysis:
                    '本段介绍电影院会员资格可提供免费票和未来折扣 → 对应 C（Consider a membership，考虑会员资格）。',
                },
                {
                  no: 23,
                  answer: 'F',
                  point: '段落主旨匹配',
                  analysis:
                    '本段讲电影院为带小孩的家庭提供低价特别放映（special screenings）→ 对应 F（Look for special screenings）。',
                },
                {
                  no: 24,
                  answer: 'E',
                  point: '段落主旨匹配',
                  analysis:
                    '本段讲住地附近多家电影院时，逐一比较各家票价 → 对应 E（Compare different cinemas，比较不同的电影院）。',
                },
                {
                  no: 25,
                  answer: 'D',
                  point: '段落主旨匹配',
                  analysis:
                    '本段讲购买电影礼品卡可打折并叠加返现优惠 → 对应 D（Use discounted gift cards，使用打折的礼品卡）。',
                },
              ],
            },
          ],
          optionBank: [
            'A. Get free tickets online.',
            'B. Avoid expensive tickets.',
            'C. Consider a membership.',
            'D. Use discounted gift cards.',
            'E. Compare different cinemas.',
            'F. Look for special screenings.',
            'G. Bring some food to the cinema.',
          ],
        },
        {
          id: 'banked-cloze',
          type: '十五选十',
          title: 'Section B Banked Cloze（选词填空）',
          score: '10 分',
          directions:
            'In this section, there is a passage with ten blanks. You are required to select one word for each blank from a list of choices given in a word bank following the passage. Read the passage through carefully before making your choices. Please mark the corresponding letter for each item on The Answer Sheet. You may not use any of the words in the bank more than once. (10 points)',
          passages: [
            {
              title: 'Exploring Your City（空 26-35）',
              content: `It's easy to get so busy in your daily life. You __26__ notice the exciting world where you live. With the weather outside __27__ up, now is a good time to go exploring with a friend. Maybe there's a(n) __28__ building you can tour, or a new ice cream store you've been wanting to try.

One way is to do some research __29__. A local museum might have a new __30__ you haven't seen since the last time you visited. You can also find out whether any TV __31__ or movies have been filmed near you and visit the location. Look up walking tours for a whole new way to explore your city. Some cities __32__ walking tours focused on a theme, like food or local parks. You can also search for free self-guided walking tours in your area.

Another way to see where you live with __33__ eyes is to go exploring with your camera. Pick a theme for your __34__, whether it's architecture, or birds and other wildlife in your area.

Theses things make your city __35__ apart from the others — and at the end of the day, you can look back on all your adventures close to home.`,
              questions: [
                {
                  no: 26,
                  answer: 'D',
                  point: '副词 · 语境理解',
                  analysis:
                    '主谓宾结构完整，空处应填副词作状语修饰 notice，barely 意为“几乎没有”。句意：你几乎没有留意你所生活的世界。',
                },
                {
                  no: 27,
                  answer: 'F',
                  point: '固定搭配 · warm up',
                  analysis:
                    '逗号前为 With 复合结构，空处用非谓语动词，warm up 意为“变暖”。句意：随着外面天气变暖，现在是和朋友一起去探险的好时机。',
                },
                {
                  no: 28,
                  answer: 'J',
                  point: '形容词 · 词性判断',
                  analysis:
                    '空前为不定冠词 a(n)，空后为名词 building，空处填形容词作定语，historic 意为“具有历史意义的”。句意：也许有一栋你可以参观的历史建筑。',
                },
                {
                  no: 29,
                  answer: 'L',
                  point: '副词 · 词性判断',
                  analysis:
                    '句子结构完整，空处位于句尾，填副词作状语，online 意为“在网上”。句意：一种方法是在网上做一些研究。',
                },
                {
                  no: 30,
                  answer: 'G',
                  point: '名词 · 词性判断',
                  analysis:
                    '空前为 a new（形容词），空处填名词，exhibit 意为“展览品”。句意：当地的博物馆可能会有一件你上次参观后没看过的新展览品。',
                },
                {
                  no: 31,
                  answer: 'A',
                  point: '名词 · 词性判断',
                  analysis:
                    'or 连接两个并列名词（短语）作主语，TV shows 意为“电视节目”。句意：你还可以查明是否有电视节目或电影在附近拍摄。',
                },
                {
                  no: 32,
                  answer: 'H',
                  point: '动词 · 词性判断',
                  analysis:
                    '空前为名词主语、空后为名词宾语，空处填动词作谓语，offer 意为“提供”。句意：一些城市提供主题徒步旅行，比如美食或当地公园。',
                },
                {
                  no: 33,
                  answer: 'N',
                  point: '形容词 · 词性判断',
                  analysis:
                    '空后为名词 eyes，空处填形容词作定语，fresh 意为“新的”。句意：用新眼光看你所生活的地方的另一种方法是带着相机去探索。',
                },
                {
                  no: 34,
                  answer: 'M',
                  point: '名词 · 词性判断',
                  analysis:
                    '空前为形容词性物主代词 your，空处填名词，photos 意为“照片”。句意：为你的照片选择一个主题，无论是建筑还是鸟类等野生动物。',
                },
                {
                  no: 35,
                  answer: 'C',
                  point: '固定搭配 · stand apart from',
                  analysis:
                    'stand apart from the others 为固定搭配，意为“与众不同”。句意：这些东西让你的城市与众不同。',
                },
              ],
            },
          ],
          optionBank: [
            'A. shows',
            'B. purpose',
            'C. stand',
            'D. barely',
            'E. looking',
            'F. warming',
            'G. exhibit',
            'H. offer',
            'I. mostly',
            'J. historic',
            'K. hear',
            'L. online',
            'M. photos',
            'N. fresh',
            'O. fall',
          ],
        },
      ],
    },
    {
      id: 'integrated',
      title: 'Part II Integrated Testing (30 points, 30 minutes)',
      score: '30 分',
      blocks: [
        {
          id: 'cloze',
          type: '完形填空',
          title: 'Section A Cloze（完形填空）',
          score: '20 分',
          directions:
            'There are 20 blanks in the following passage. For each blank there are four choices marked A, B, C and D. You should choose the ONE that best fits into the passage. Then mark the corresponding letter on The Answer Sheet. (20 points)',
          passages: [
            {
              title: 'The Importance of Breakfast（Questions 36-55）',
              content: `"Finish your breakfast!" is the phrase I often hear __36__ my mother in the morning. But why is the __37__ of breakfast so emphasized?

Firstly, breakfast can provide individuals __38__ enough energy to get through the day. Some days are just slower than __39__, and you may find __40__ more difficult to get out of bed and __41__ the day.

Healthy breakfasts can also __42__ the chance of illness. Research has shown that __43__ who do not eat breakfast regularly are found to be __44__ higher risk of various __45__. As heart disease is the __46__ cause of death across all groups in the United States, it is important to __47__ care of your heart. If one is concerned about cardiovascular (心血管的) health, foods, such as bacon __48__ is processed and contains high amounts of fat and sugar, should be stayed __49__ from.

__50__ that I found to be very useful is __51__ a delicious breakfast can actually __52__ memory throughout the day. __53__ special days that may contain things such as a test, a job __54__, or a competition, it is important to eat a healthy breakfast in the morning to __55__ you to make full use of your abilities.`,
              questions: [
                {
                  no: 36,
                  answer: 'B',
                  point: '词义辨析 · 固定搭配',
                  analysis:
                    'hear from 意为“从……那里听到”，hear from my mother 意为“从我妈妈那里听到”，故选 B。',
                  stem: '',
                  choices: ['of', 'from', 'upon', 'about'],
                },
                {
                  no: 37,
                  answer: 'D',
                  point: '词义辨析',
                  analysis:
                    'why is the importance of breakfast so emphasized 意为“为什么要如此强调早餐的重要性”，importance（重要性）符合语境，故选 D。',
                  stem: '',
                  choices: ['time', 'space', 'action', 'importance'],
                },
                {
                  no: 38,
                  answer: 'B',
                  point: '固定搭配 · provide sb with sth',
                  analysis:
                    'provide sb. with sth. 为固定搭配，意为“给某人提供某物”，provide individuals with enough energy，故选 B。',
                  stem: '',
                  choices: ['for', 'with', 'upon', 'into'],
                },
                {
                  no: 39,
                  answer: 'C',
                  point: '代词辨析',
                  analysis:
                    'some days are just slower than others 意为“有些日子就是过得比其他日子慢”，others 相当于 other days，故选 C。',
                  stem: '',
                  choices: ['any', 'other', 'others', 'another'],
                },
                {
                  no: 40,
                  answer: 'A',
                  point: '语法结构 · 形式宾语',
                  analysis:
                    'it 作形式宾语，真正的宾语是后面的不定式短语 to get out of bed and start the day，故选 A。',
                  stem: '',
                  choices: ['it', 'them', 'that', 'this'],
                },
                {
                  no: 41,
                  answer: 'A',
                  point: '语法结构 · 并列不定式',
                  analysis:
                    'and 连接两个并列的不定式短语，and 后不定式常省略 to，故用动词原形 start，故选 A。',
                  stem: '',
                  choices: ['start', 'starts', 'started', 'starting'],
                },
                {
                  no: 42,
                  answer: 'B',
                  point: '词义辨析',
                  analysis:
                    'healthy breakfasts can also lower the chance of illness 意为“健康的早餐也能降低患病的可能性”，lower（降低）符合语境，故选 B。',
                  stem: '',
                  choices: ['mean', 'lower', 'cause', 'create'],
                },
                {
                  no: 43,
                  answer: 'D',
                  point: '语法结构 · 代词先行词',
                  analysis:
                    '空处作宾语从句主语，且后跟 who 引导的定语从句，用于泛指人用 those，those who 意为“那些……的人”，故选 D。',
                  stem: '',
                  choices: ['this', 'that', 'these', 'those'],
                },
                {
                  no: 44,
                  answer: 'A',
                  point: '固定搭配 · at risk of',
                  analysis:
                    'at risk of 为固定搭配，意为“有……的风险”，at higher risk of various diseases，故选 A。',
                  stem: '',
                  choices: ['at', 'below', 'above', 'beyond'],
                },
                {
                  no: 45,
                  answer: 'C',
                  point: '词义辨析 · 复现',
                  analysis:
                    '由上文 illness（疾病）可推知此处为近义词复现，various diseases 意为“各种疾病”，故选 C。',
                  stem: '',
                  choices: ['mistakes', 'failures', 'diseases', 'accidents'],
                },
                {
                  no: 46,
                  answer: 'B',
                  point: '词义辨析',
                  analysis:
                    'heart disease is the major cause of death 意为“心脏病是死亡的主要原因”，major（主要的）符合语境，故选 B。',
                  stem: '',
                  choices: ['final', 'major', 'natural', 'practical'],
                },
                {
                  no: 47,
                  answer: 'D',
                  point: '固定搭配 · take care of',
                  analysis:
                    'take care of 为固定搭配，意为“照顾”，take care of your heart 意为“照顾好你的心脏”，故选 D。',
                  stem: '',
                  choices: ['get', 'pay', 'look', 'take'],
                },
                {
                  no: 48,
                  answer: 'D',
                  point: '语法结构 · 定语从句',
                  analysis:
                    '空处引导定语从句，修饰指物的先行词 bacon，且在从句中作主语，应用 which，故选 D。',
                  stem: '',
                  choices: ['when', 'what', 'where', 'which'],
                },
                {
                  no: 49,
                  answer: 'A',
                  point: '固定搭配 · stay away from',
                  analysis:
                    'stay away from 为固定搭配，意为“远离”，should be stayed away from 意为“应远离”，故选 A。',
                  stem: '',
                  choices: ['away', 'down', 'around', 'behind'],
                },
                {
                  no: 50,
                  answer: 'C',
                  point: '词义辨析',
                  analysis:
                    'Something that I found to be very useful is... 意为“我发现的非常有用的事情是……”，something 作先行词，故选 C。',
                  stem: '',
                  choices: ['Nothing', 'Anything', 'Something', 'Everything'],
                },
                {
                  no: 51,
                  answer: 'C',
                  point: '语法结构 · 表语从句',
                  analysis:
                    '空处引导表语从句，从句成分和意义完整，用只起连接作用且无词义的 that，故选 C。',
                  stem: '',
                  choices: ['how', 'why', 'that', 'whether'],
                },
                {
                  no: 52,
                  answer: 'D',
                  point: '词义辨析',
                  analysis:
                    'a delicious breakfast can actually improve memory 意为“美味的早餐实际上可以提高记忆力”，improve（提高）符合语境，故选 D。',
                  stem: '',
                  choices: ['form', 'bring', 'examine', 'improve'],
                },
                {
                  no: 53,
                  answer: 'A',
                  point: '介词 · 时间',
                  analysis:
                    '表示在特定某一天（special days）用介词 on，on special days 意为“在特殊的日子里”，故选 A。',
                  stem: '',
                  choices: ['On', 'In', 'At', 'To'],
                },
                {
                  no: 54,
                  answer: 'C',
                  point: '词义辨析 · 搭配',
                  analysis: 'a job interview 意为“求职面试”，符合搭配与语境，故选 C。',
                  stem: '',
                  choices: ['reward', 'market', 'interview', 'requirement'],
                },
                {
                  no: 55,
                  answer: 'D',
                  point: '词义辨析',
                  analysis:
                    'enable you to make full use of your abilities 意为“让你能够充分利用自己的能力”，enable sb. to do sth. 符合结构，故选 D。',
                  stem: '',
                  choices: ['ask', 'call', 'order', 'enable'],
                },
              ],
            },
          ],
        },
        {
          id: 'short-answer',
          type: '篇章问答',
          title: 'Section B Short Answer Questions（篇章问答）',
          score: '10 分',
          directions:
            'In this part there is a short passage followed by five questions or incomplete statements. Read the passage carefully. Then answer the questions or complete the statements with no more than 10 words. Please write your answers on The Answer Sheet. (10 points)',
          passages: [
            {
              title: 'Marie Curie（Questions 56-60）',
              content: `Marie Curie might have lived a long time ago, but she is still inspiring people today. This superstar scientist won two Nobel Prizes and discovered two new chemical elements. She was also one of the first researchers to investigate radioactivity (放射性) and organized mobile X-Ray units during the First World War (1914-1918). Curie did this just a few years after women were first allowed to study at universities. Let's take a look at this remarkable scientist's life story.

In 1867, when Marie was born, Poland was part of the Russian Empire. Around the world, women were only just beginning to be accepted into universities. The first French woman to gain a degree graduated in August 1861. In 1868, the first women were admitted to university in Britain. In Poland, however, women were not allowed to enroll in universities, so the young Marie took lessons with the Flying University, a secret college that gave lessons in changing locations such as private houses around the country.

Marie moved to Paris in 1891 to further her studies. Unable to afford heat in her small apartment, she kept warm by wearing all her clothes at once. Studying hard, she earned her first degree in physics in 1893 and then another one in mathematics. In 1894, she met another young scientist, Pierre Curie, and on 26 July 1895, Marie and Pierre got married. Marie Curie began researching radiation. Her husband, seeing the progress she was making, giving up his own research to work with her. In 1898, the Curies published two papers announcing the discovery of two new chemical elements — polonium and radium.

In recognition of their work, the 1903 Nobel Prize for physics was awarded to Marie and Pierre Curie. This was the first time a husband-and-wife team had ever won the prize.`,
              questions: [
                {
                  no: 56,
                  answer: 'Polonium and radium.',
                  point: '细节定位',
                  analysis:
                    '由第三段最后一句 "...the Curies published two papers announcing the discovery of two new chemical elements — polonium and radium." 可知，居里夫妇发现了两种化学元素——钋（polonium）和镭（radium）。',
                  stem: 'What are the two chemical elements the Marie discovered?',
                },
                {
                  no: 57,
                  answer: 'In 1868.',
                  point: '细节定位',
                  analysis:
                    '由第二段 "In 1868, the first women were admitted to university in Britain." 可知，1868 年英国第一批女性被大学录取。',
                  stem: 'When were British women first admitted to university?',
                },
                {
                  no: 58,
                  answer: 'in changing locations (such as private houses around the country)',
                  point: '细节定位',
                  analysis:
                    '由第二段最后一句 "...a secret college that gave lessons in changing locations such as private houses around the country." 可知，飞行大学在全国各地的私人住宅等不同地点授课。',
                  stem: 'The Flying University was a secret college that gave lessons ______.',
                },
                {
                  no: 59,
                  answer: 'By wearing all her clothes at once.',
                  point: '细节定位',
                  analysis:
                    '由第三段 "Unable to afford heat in her small apartment, she kept warm by wearing all her clothes at once." 可知，Marie 付不起公寓取暖费，把所有的衣服同时穿上保暖。',
                  stem: 'How did Marie keep warm in her apartment while studying in Paris?',
                },
                {
                  no: 60,
                  answer: 'Because he saw the progress she was making.',
                  point: '细节定位 · 因果',
                  analysis:
                    '由第三段 "Her husband, seeing the progress she was making, giving up his own research to work with her." 可知，Marie 的丈夫看到她取得的进步，因此放弃自己的研究与她一起工作。',
                  stem: "Why did Marie's husband give up his own research to work with her?",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'translation',
      title: 'Part III Translation (30 points, 30 minutes)',
      score: '30 分',
      blocks: [
        {
          id: 'cn2en',
          type: '汉译英',
          title: 'Section A From Chinese to English（汉译英）',
          score: '15 分',
          directions:
            'Complete the sentences by translating into English the Chinese given in the brackets. Please write your translation on The Answer Sheet. (15 points)',
          questions: [
            {
              no: 61,
              answer: 'Because of/Due to/Owing to the bad weather',
              point: '短语翻译 · 原因状语',
              analysis:
                '“由于”可译为 because of、due to 或 owing to；“天气恶劣”可译为 bad weather，故填 Because of/Due to/Owing to the bad weather。',
              stem: '______（由于天气恶劣）, all the flights were canceled.',
            },
            {
              no: 62,
              answer: 'in case there should be misunderstanding/in case of misunderstanding',
              point: '目的状语从句 · 虚拟语气',
              analysis:
                '“以免误解”可译为 in case 引导的目的状语从句，从句可用虚拟语气（should+动词原形），也可译为介词短语 in case of misunderstanding。',
              stem: 'Communication is necessary ______（以免误解）.',
            },
            {
              no: 63,
              answer:
                'that/which hold the most international meetings/conferences 或 where the most international meetings/conferences are held',
              point: '定语从句 · 动词时态',
              analysis:
                '定语从句应用一般现在时表示现状，“举办”译为 hold，“国际会议”译为 international meeting/conference，“最多”译为 most。',
              stem: 'Shanghai is one of the cities ______（举办国际会议最多）in China per year.',
            },
            {
              no: 64,
              answer: 'would/could explain to him personally/in person',
              point: '虚拟语气',
              analysis:
                'If 引导非真实条件句，表示对现在情况的假设，主句用 should/would/could/might+动词原形；“亲自”译为 personally 或 in person；“解释”译为 explain。',
              stem: 'If he were here, I ______（就可以亲自向他解释了）.',
            },
            {
              no: 65,
              answer: 'try our best to study hard/study as hard as possible',
              point: '常用短语翻译',
              analysis:
                "“尽可能”可译为 try one's best to do sth. 或 do sth. as...as possible；“努力”译为 hard；“学习”译为 study。",
              stem: 'As students, we should ______（尽可能努力学习）.',
            },
          ],
        },
        {
          id: 'en2cn',
          type: '英译汉',
          title: 'Section B From English to Chinese（英译汉）',
          score: '15 分',
          directions:
            'Translate into English the underlined sentences in the following passage. Write your translation on The Answer Sheet. (15 points)',
          questions: [
            {
              no: 66,
              answer: '你在开始自己的旅行以前，要对当地文化做一些研究。',
              point: '时间状语从句 · 常用短语',
              analysis:
                '本句包含 Before（在……以前）引导的时间状语从句；begin 译为“开始”，journey 译为“旅行”，research 译为“研究”，local culture 译为“当地文化”。',
              stem: 'Before you begin your journey, do some research about the local culture.',
            },
            {
              no: 67,
              answer: '只带走照片，只留下脚印。',
              point: '并列句 · 常用单词',
              analysis:
                'and 连接两个并列的祈使句，顺译即可；Take 译为“带走”，only 译为“只”，leave 译为“留下”，footprints 译为“脚印”。',
              stem: 'Take only pictures, and leave only footprints.',
            },
            {
              no: 68,
              answer: '对当地人来说，这些地方是他们的家。',
              point: '常用单词翻译',
              analysis:
                'for 译为“对……来说”，locals 译为“当地人”，places 译为“地方”，homes 译为“家”。',
              stem: 'for the locals, these places are their homes.',
            },
            {
              no: 69,
              answer: '己所不欲，勿施于人。',
              point: '谚语翻译 · 方式状语从句',
              analysis:
                '本句包含 as（照……方式）引导的方式状语从句，基本意思为“照你希望被对待的方式对待他人”，可译为中国古话“己所不欲，勿施于人”。',
              stem: "treat others as you'd like to be treated",
            },
            {
              no: 70,
              answer: '你应该做出负责任的选择。',
              point: '常用单词和短语',
              analysis:
                'should 译为“应该”，make...choices 译为“做出……选择”，responsible 译为“负责任的”。',
              stem: 'you should make responsible choices.',
            },
          ],
        },
      ],
    },
    {
      id: 'writing',
      title: 'Part IV Writing (30 points, 30 minutes)',
      score: '30 分',
      blocks: [
        {
          id: 'composition',
          type: '短文写作',
          title: '写作（Composition）',
          score: '30 分',
          directions:
            'For this part, you are allowed 30 minutes to write a composition on the topic My View On Mutual Influence. You should write about 120 words based on the following outline given below. Please write your composition on The Answer Sheet. (30 points)',
          questions: [
            {
              no: 71,
              answer:
                'My View On Mutual Influence\n\nIn recent years, with the development of globalization and social media, there is a growing tendency that people are exerting a strong influence on each other, especially among family members, friends and classmates.\n\nIt is obvious that mutual influence has its positive and negative effects. On the one hand, there is no doubt that some successful people will set good examples to others, which can encourage them to work hard. On the other hand, it goes without saying that for those pessimistic people, they will get more pressure from others, which may make them give up easily.\n\nFrom my point of view, we live together with other people, which means we can not isolate ourselves from others. Mutual influence is unavoidable. We should try to make full use of it, and try to avoid the negative impact.',
              point: '议论文写作',
              analysis:
                '观点型议论文：先点明相互影响（尤其在家人、朋友、同学之间）非常普遍，再分别阐述其积极与消极影响，最后表明自己的观点（相互影响不可避免，应充分利用积极影响、避免消极影响）。范文采用“总—分—总”结构：首段引出话题，中间段对比正反两方面影响，尾段总结并给出态度。',
              stem: '（1）相互影响在家人、朋友、同学等之间非常普遍；\n（2）这种影响可能是积极的，也可能是消极的。请谈谈你的看法。',
            },
          ],
        },
      ],
    },
  ],
}
