// 2025 年浙江省统招专升本英语真题
// 数据来源：exam-papers/2025年英语真题.md

import type { ExamPaper } from './exam.types'

export const examPaper2025: ExamPaper = {
  year: 2025,
  title: '浙江省2025年选拔优秀高职高专毕业生进入本科学习统一考试 · 英语',
  parts: [
    {
      id: 'reading',
      title: 'Part Reading Comprehension (60 points, 60 minutes)',
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
              content: `A Chinese company called DeepSeek has surprised many experts by releasing its own artificial intelligence (AI) software. AI is a computer system that can learn from experience and do things that usually take human intelligence.

DeepSeek uses generative AI, which is a type of software that can generate content such as text and images based on the prompt a person types in. For example, you could ask the software to write a shopping list, create computer code, make up a story, or you could use it to have a chat.

Other popular generative AI tools, most of which were created in the US, include OpenAI's ChatGPT, and Google's Gemini.

The company behind DeepSeek's new app is based in China. It has fewer than 200 people working for it. DeepSeek said it cost £4.8 million to develop its software. This isn't much compared with the £80 million that the boss of OpenAI said it cost to develop its latest ChatGPT model. Within a few days of the release of DeepSeek's new software, it became the most downloaded free app in the US. It quickly shot to number one on Apple's App Store chart.

The low cost of developing DeepSeek has made people ask whether US-based technology, open source, which means that anyone can access the computer code that was used to, say, DeepSeek's success could mean the US might no longer be the global leader in AI. It may mean that other companies will try to make their own cheap AI technology.

AI expert Giuseppe Sette told CBS News that DeepSeek has taken technology companies by storm. He said, "This shows that with AI, the surprises will keep on coming in the next years."`,
              questions: [
                {
                  no: 1,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '由第二段 "DeepSeek uses generative AI, which is a type of software..." 可知，生成式 AI 是一种软件，故选 C。',
                  stem: 'Generative AI is',
                  choices: [
                    'a piece of text',
                    'a shopping list',
                    'a type of software',
                    'a sort of computer code',
                  ],
                },
                {
                  no: 2,
                  answer: 'B',
                  point: '细节理解 · 数字定位',
                  analysis:
                    '第四段提到 "the £80 million that the boss of OpenAI said it cost"，OpenAI 开发最新 ChatGPT 模型花费约 8000 万英镑，故选 B。',
                  stem: 'How much did it cost OpenAI to develop its latest ChatGPT model?',
                  choices: ['£1 million.', '£80 million.', '£4.8 million.', '£200 million.'],
                },
                {
                  no: 3,
                  answer: 'A',
                  point: '推理判断',
                  analysis:
                    '专家称 AI 领域“惊喜会不断到来”，结合 DeepSeek 以极低成本成功并迅速登顶下载榜，可推断中国未来可能在 AI 领域领先世界，故选 A。',
                  stem: "What might be implied in the experts' words in Para. 4?",
                  choices: [
                    'China might lead the world in AI in the future.',
                    "Other companies might use DeepSeek's software.",
                    'US might be the global leader in AI in the future.',
                    'More expensive AI technology might be developed.',
                  ],
                },
                {
                  no: 4,
                  answer: 'D',
                  point: '细节理解 · 排除法',
                  analysis:
                    '文中提到 Gemini、ChatGPT、DeepSeek 均为 AI 软件/工具，而 CBS News 是一家新闻媒体，不属于软件，故选 D。',
                  stem: 'Which of the following is NOT a type of software in the passage?',
                  choices: ['Gemini.', 'ChatGPT.', 'DeepSeek.', 'CBS News.'],
                },
                {
                  no: 5,
                  answer: 'B',
                  point: '主旨大意 · 标题',
                  analysis:
                    '全文围绕 DeepSeek 发布引发的轰动（专家惊讶、迅速登顶下载榜、低成本挑战美国 AI 地位）展开，最能概括主旨的是 B。',
                  stem: 'Which of the following might be the best title for the passage?',
                  choices: [
                    'Low Cost of Developing AI Apps.',
                    'Surprise Caused by DeepSeek Launch.',
                    "Development of DeepSeek's New Software.",
                    "AI Tools' Ability to Learn from Experience.",
                  ],
                },
              ],
            },
            {
              title: 'Passage Two（Questions 6-10）',
              content: `Rail travel can be troublesome, but for one seven-year-old boy it was actually delay-free as he visited every city in England by train in 2024.

Austin from Felixstowe, Suffolk, visited all 55 cities with his father, Ashley. The pair began with a visit to Brighton in January and completed their list with a trip to Ely on December 22. They travelled north to Carlisle and west to Truro. York was a particular favorite.

"For me, it's the time with Austin," Ashley told BBC Radio Suffolk. "I spent a bit of time with my dad on the trains when I was younger, so it brings back memories for me." Ashley, who will soon take up a new job on the railway, said his son had loved trains since he was two. The family had taken so many day trips that Ashley realized they must have visited 25 English cities in 2023.

"We've made friends along the way," Ashley said, "It's given us an escape to meet up family and it's a goal to see Austin's confidence grow."`,
              questions: [
                {
                  no: 6,
                  answer: 'D',
                  point: '词义猜测',
                  analysis:
                    'delay-free 意为“无延误的”。首段说这段旅程 “actually delay-free”（实际毫无延误），且全文描述旅行顺利愉快，推断其语境含义与“愉快”相关，故选 D（Pleasant）。',
                  stem: 'What does the underlined word "delay-free" in Para. 1 probably mean?',
                  choices: ['Safe.', 'Boring.', 'Painful.', 'Pleasant.'],
                },
                {
                  no: 7,
                  answer: 'A',
                  point: '细节理解',
                  analysis:
                    '第一段 "York was a particular favorite." 明确提到约克是他特别喜欢的城市，故选 A。',
                  stem: "Which city was Austin's favorite during his train travel?",
                  choices: ['York.', 'Truro.', 'Carlisle.', 'Brighton.'],
                },
                {
                  no: 8,
                  answer: 'A',
                  point: '细节理解',
                  analysis:
                    '第三段 "his son had loved trains since he was two"（儿子两岁起就喜爱火车），故选 A；B、C、D 均与原文不符。',
                  stem: 'What can we learn from Para. 3?',
                  choices: [
                    'Austin fell in love with trains at the age of two.',
                    'Ashley had been working in the railway station.',
                    'Ashley visited 25 English cities in his childhood.',
                    'Austin had most of the rail travel with his friends.',
                  ],
                },
                {
                  no: 9,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '末段 "it\'s a goal to see Austin\'s confidence grow"，表明旅行的好处之一是 Austin 的自信心不断增强，故选 C。',
                  stem: 'What was one of the benefits Austin got from the train travel?',
                  choices: [
                    'He could plan a new trip.',
                    'He could drive a train well.',
                    'He gained more confidence.',
                    'He got an excuse to meet his fans.',
                  ],
                },
                {
                  no: 10,
                  answer: 'C',
                  point: '细节理解 · 排除法（NOT true）',
                  analysis:
                    '文章首段说旅程 “actually delay-free”（毫无延误），因此“他们经历了许多严重延误”与原文矛盾，故选 C。',
                  stem: 'Which of the following is NOT true about Ashley and Austin?',
                  choices: [
                    'They visited train stations.',
                    'They were affected by strikes.',
                    'They had many serious delays.',
                    'They tried train driver simulations.',
                  ],
                },
              ],
            },
            {
              title: 'Passage Three（Questions 11-15）',
              content: `When Stella Davidsen Olsen was 12 years old, her father gave her and her twin sister a choice. Keep family-owned sled (雪) dogs, which can be expensive and a lot of work. Her father asked the girls whether they'd like to take care of the dogs. She and her sister immediately jumped into action, fishing to feed the dogs, and working to train them to pull sleds across Greenland's snow and ice. Now, 14 years later, she's raising sled dogs of her own. Her dogs are like family.

For generations, people in Greenland have relied on sled dogs for transportation and hunting. It's a proud tradition. Today, dogsled rides are a popular activity for tourists who travel to the area. But it's also a part of Greenland's unique culture that is under threat.

The number of sled dogs has been cut in half over the last 20 years — from 25,000 to 13,000, according to researchers at the University of Greenland. One of the reasons is that the traditional fishing and hunting culture is changing. People are using other types of transportation.

Those who have long relied on sled dogs say that sea ice is not as common and as widespread as it used to be. Driving a sled with wheels to train her dogs, to account for the fact that there is less ice, Olsen has to adapt in order to keep this tradition alive.`,
              questions: [
                {
                  no: 11,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '第一段 "Her father asked the girls whether they\'d like to take care of the dogs"，父亲问女儿们是否愿意照顾雪橇犬，look after 与 take care of 同义，故选 C。',
                  stem: "Olsen's father asked his daughters whether they would like to",
                  choices: [
                    'feed the whole family',
                    'ski across snow and ice',
                    'look after their sled dogs',
                    'raise dogs for Greenland',
                  ],
                },
                {
                  no: 12,
                  answer: 'D',
                  point: '细节理解',
                  analysis:
                    '第二段 "people in Greenland have relied on sled dogs for transportation and hunting"，格陵兰人依靠雪橇犬运输和打猎，故选 D。',
                  stem: "It's a proud tradition for people in Greenland to use sled dogs for",
                  choices: [
                    'entertaining tourists',
                    'taking care of people',
                    'training other animals',
                    'hunting and transportation',
                  ],
                },
                {
                  no: 13,
                  answer: 'D',
                  point: '细节理解 · 因果',
                  analysis:
                    '第三段 "One of the reasons is that the traditional fishing and hunting culture is changing"，雪橇犬数量减半的原因是传统渔猎文化正在改变，故选 D。',
                  stem: 'Why has the number of sled dogs been cut in half over the last 20 years?',
                  choices: [
                    'Because it is too expensive to own sled dogs.',
                    'Because the settlements have become smaller.',
                    'Because training sled dogs involves a lot of work.',
                    'Because the traditional fishing and hunting culture is changing.',
                  ],
                },
                {
                  no: 14,
                  answer: 'D',
                  point: '细节理解',
                  analysis:
                    '末段 "Driving a sled with wheels to train her dogs... Olsen has to adapt"，为适应冰面减少，Olsen 用带轮子的雪橇训练狗，故选 D。',
                  stem: 'What did Olsen consider doing in order to keep the tradition alive?',
                  choices: [
                    'Pulling a sled by herself.',
                    'Fishing in a different place.',
                    'Cutting the number of sled dogs.',
                    'Buying a sled with wheels.',
                  ],
                },
                {
                  no: 15,
                  answer: 'B',
                  point: '词义猜测',
                  analysis:
                    '由上下文“训练狗拉雪橇跨越格陵兰的冰雪”可知，mushers 指驾驶狗拉雪橇的人，故选 B。',
                  stem: 'The underlined word "mushers" in Para. 4 means people who',
                  choices: [
                    'buy a dog sled',
                    'drive a dog sled',
                    'travel around Greenland',
                    'hunt animals in Greenland',
                  ],
                },
              ],
            },
            {
              title: 'Passage Four（Questions 16-20）',
              content: `According to Kopf, the lead author of a newly published review and ecologist at Charles Darwin University, Australia, older animals provide greater stability to their societies. For instance, some older fish mothers lay more eggs in a better place than their counterparts. Certain deep-sea corals (珊瑚) that live for thousands of years provide food and shelter for a wide range of ocean animals.

The review also stressed how older animals contribute valuable "wisdom" — knowledge acquired over their lifetime to their societies. Animals like whales, elephants, and some migratory (迁徙的) birds and fish, for example, rely on older individuals for guidance to find better breeding areas. In contrast, in species with strong social structures, like elephants, if older leaders can make such a structure unstable, Kopf said.

The review is "comprehensive and convincing", said Tim Coulson, a professor at the University of Oxford, U.K., not involved in the study. He also emphasized that "our strong interest in harvesting large, elderly fish, or the tallest, oldest trees is seriously misguided."

The authors recommended that commercial management of species should protect older individuals. They also recommend that the IUCN (the International Union for the Conservation of Nature and Natural Resources) Red List include "age class" in its assessments of species status, currently not the practice. This is similar to an old-growth forest. Kopf said: "You can chop down all of the big trees and still have a huge number of really young trees. But it doesn't mean that the population or that species is necessarily in good shape."

Coulson said that while a "nice thought experiment," including the status of older individuals into IUCN assessments is an "unrealistic expectation," considering the information needed to firmly capture the impact of such individuals in varying populations.`,
              questions: [
                {
                  no: 16,
                  answer: 'D',
                  point: '词义猜测 · 指代',
                  analysis:
                    '首段 "some older fish mothers lay more eggs in a better place than their counterparts"，counterparts 指与 older fish mothers 相对应的同类鱼妈妈（其他雌鱼），故选 D。',
                  stem: 'What does the underlined word "counterparts" in Para. 1 refer to?',
                  choices: ['Authors.', 'Ecologists.', 'Fish fathers.', 'Fish mothers.'],
                },
                {
                  no: 17,
                  answer: 'C',
                  point: '细节理解',
                  analysis:
                    '第二段 "rely on older individuals for guidance to find better breeding areas"，老年动物凭借经验引导年轻个体找到更优的觅食/繁殖区域，故选 C。',
                  stem: 'How can older animals help younger ones with their "wisdom" according to Para. 2?',
                  choices: [
                    'By building shelter.',
                    'By forming social structures.',
                    'By guiding them to find food.',
                    'By providing breeding places.',
                  ],
                },
                {
                  no: 18,
                  answer: 'A',
                  point: '观点态度',
                  analysis:
                    '第三段 Coulson 评价该综述 "comprehensive and convincing"（全面且令人信服），态度积极正面，故选 A。',
                  stem: "What is Coulson's attitude towards the review according to Para. 3?",
                  choices: ['Positive.', 'Doubtful.', 'Negative.', 'Indifferent.'],
                },
                {
                  no: 19,
                  answer: 'D',
                  point: '细节理解',
                  analysis:
                    '第四段 "recommend that the IUCN Red List include "age class" in its assessments"，作者建议 IUCN 濒危物种红色名录纳入“年龄等级”评估，故选 D。',
                  stem: 'What is recommended by the authors of the review in Para. 4?',
                  choices: [
                    "Assessing the species' status.",
                    'Chopping down the old big trees.',
                    'Cutting down most of the young trees.',
                    'Including "age class" in the IUCN Red List.',
                  ],
                },
                {
                  no: 20,
                  answer: 'B',
                  point: '主旨大意',
                  analysis:
                    '全文论述老年个体（老动物、老树）对种群和社会的重要价值，并呼吁保护老年个体，故选 B。',
                  stem: 'What is the passage mainly about?',
                  choices: [
                    'The survival of younger trees.',
                    'The protection of older individuals.',
                    'The current status of older animals.',
                    'The learning process of younger animals.',
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
              title: 'Staying Connected While Traveling（Questions 21-25）',
              content: `Staying connected while traveling is easier than ever. Here's a guide to the best ways to stay online and in touch no matter where your adventures take you.

21. ______________ Your best friend, a local SIM card, is easy, affordable, and widely available in most countries. Local SIMs are great if you're travelling in a single country or region for an extended period. Not only do they give you a local number, which is helpful for booking accommodations or restaurant reservations, but they also keep your internet speed fast and reliable.

22. ______________ For those who don't want to deal with switching SIM cards, international roaming plans can save you the trouble. Many carriers (运营商) offer plans specifically designed for travelers that let you use your phone abroad just as you would at home. Be sure to check with your carrier for their roaming rates before you travel.

23. ______________ Imagine having a personal, pocket-sized Wi-Fi router (路由器) wherever you go. That's exactly what a portable Wi-Fi hotspot provides. These devices connect to local mobile networks and broadcast a secure Wi-Fi signal that can be shared across multiple devices. They're ideal for those who need reliable internet access while travelling to remote areas.

24. ______________ Not staying in one country? An international SIM card could be your perfect travel companion. Unlike local SIMs, these cards work across multiple countries, allowing you to travel from one place to another without changing cards.

25. ______________ Nowadays, free Wi-Fi is everywhere. It's convenient, no doubt, and perfect for checking maps or sending emails. But be cautious. Public Wi-Fi can also be a hotspot for hackers. To protect yourself, always use a Virtual Private Network (VPN) which keeps your online activity private.

In a word, staying connected abroad is easier and cheaper than you might think, and knowing your options is essential.`,
              questions: [
                {
                  no: 21,
                  answer: 'B',
                  point: '段落主旨匹配',
                  analysis:
                    '本段介绍 local SIM 卡便宜、随处可得、适合在单一国家长时间旅行 → 对应 B（Buy a local SIM card）。',
                },
                {
                  no: 22,
                  answer: 'G',
                  point: '段落主旨匹配',
                  analysis:
                    '本段介绍国际漫游套餐让出国使用手机像在家一样方便 → 对应 G（Choose an international roaming plan）。',
                },
                {
                  no: 23,
                  answer: 'F',
                  point: '段落主旨匹配',
                  analysis:
                    '本段介绍便携式 Wi-Fi 热点（口袋路由器），适合在偏远地区保持可靠网络 → 对应 F（Make use of a portable Wi-Fi hotspot）。',
                },
                {
                  no: 24,
                  answer: 'E',
                  point: '段落主旨匹配',
                  analysis:
                    '本段介绍国际 SIM 卡可跨国使用、无需换卡 → 对应 E（Purchase an international SIM card）。',
                },
                {
                  no: 25,
                  answer: 'D',
                  point: '段落主旨匹配',
                  analysis:
                    '本段说明公共 Wi-Fi 便利但存在黑客风险，需谨慎使用 → 对应 D（Use public Wi-Fi with caution）。',
                },
              ],
            },
          ],
          optionBank: [
            'A. Try messaging apps.',
            'B. Buy a local SIM card.',
            'C. Download maps in advance.',
            'D. Use public Wi-Fi with caution.',
            'E. Purchase an international SIM card.',
            'F. Make use of a portable Wi-Fi hotspot.',
            'G. Choose an international roaming plan.',
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
              title: 'Celebrating Small Successes（空 26-35）',
              content: `Whether it's working hard at your favorite subject or baking a cake for your friends, putting effort into something that makes you happy is an achievement. It's a good feeling you can get from all __26__ of your life. You might not always notice your __27__ successes. Success can be something that no one else sees but you feel, such as making it through a __28__ day or speaking up in class.

Recognizing small successes __29__ you feel you can achieve bigger things, says Melanie MoNally, who is a psychologist. Studies show that when you celebrate your __30__, the __31__ of your brain lights up and boosts how you feel about yourself. This makes you feel __32__ motivated and helps to __33__ challenges in the future.

Celebrating your successes, even small ones, is important, MoNally says. If you __34__ such as learning a musical instrument, make a sticker chart to show how __35__ practice. When the chart is full, reward yourself with what MoNally calls "victory" treats. These could be fun things such as a bike ride with friends, playing games or a relaxing bath. Share small wins with family and friends too, so they can support you.`,
              questions: [
                {
                  no: 26,
                  answer: 'H',
                  point: '名词 · 语境理解',
                  analysis:
                    'from all areas of your life 意为“来自你生活的各个方面”，areas（方面、领域）符合语境。',
                },
                {
                  no: 27,
                  answer: 'N',
                  point: '形容词 · 语境理解',
                  analysis:
                    'your small successes 意为“你的小成就”，与文末 “Share small wins” 呼应，small 正确。',
                },
                {
                  no: 28,
                  answer: 'L',
                  point: '形容词 · 语境理解',
                  analysis:
                    'making it through a difficult day 意为“熬过艰难的一天”，difficult（艰难的）符合语境。',
                },
                {
                  no: 29,
                  answer: 'C',
                  point: '动词 · 主谓一致',
                  analysis:
                    'Recognizing small successes 为动名词短语作主语，谓语用第三人称单数 makes，构成 “makes you feel...”。',
                },
                {
                  no: 30,
                  answer: 'F',
                  point: '名词 · 语境理解',
                  analysis:
                    'celebrate your achievements 意为“庆祝你的成就”，achievements（成就）符合语境。',
                },
                {
                  no: 31,
                  answer: 'B',
                  point: '名词 · 语境理解',
                  analysis:
                    'the reward (centre) of your brain 意为“大脑的奖励中枢”，reward（奖励）恰当。',
                },
                {
                  no: 32,
                  answer: 'I',
                  point: '副词 · 修饰语',
                  analysis:
                    'usually 修饰形容词 motivated，表示“通常更有动力”。副词 only often/usually 可选，often 已用于 35 题，故选 usually。',
                },
                {
                  no: 33,
                  answer: 'K',
                  point: '动词 · 固定搭配',
                  analysis: 'overcome challenges 意为“克服挑战”，overcome（克服）符合固定搭配。',
                },
                {
                  no: 34,
                  answer: 'E',
                  point: '名词 · 语境理解',
                  analysis:
                    'If you have a goal such as learning... 意为“如果你有一个目标，比如学……”，goal（目标）正确。',
                },
                {
                  no: 35,
                  answer: 'D',
                  point: '副词 · 固定句型',
                  analysis:
                    'how often you practice 意为“你多久练习一次”，often 修饰 practice，符合 how often 句型。',
                },
              ],
            },
          ],
          optionBank: [
            'A. confident',
            'B. reward',
            'C. makes',
            'D. often',
            'E. goal',
            'F. achievements',
            'G. habit',
            'H. areas',
            'I. usually',
            'J. relaxing',
            'K. overcome',
            'L. difficult',
            'M. save',
            'N. small',
            'O. takes',
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
              title: 'Fog Collecting（Questions 36-55）',
              content: `Fog is cloud that forms near the Earth's surface. Given that you cannot even grab it, the __36__ of collecting fog might seem far-fetched (不切实际的). __37__, it's already happening in parts of the world. Researchers have __38__ that collecting fog on a larger scale could be a(n) __39__ way of supplying water to places __40__ really need it.

To find out more __41__ the possibility of fog collecting, researchers __42__ out a study in Alto Hospicio, a city in Chile. There's very __43__ rainfall there, and not many people have an __44__ to water. Most residents depend __45__ trucks to deliver it. However, fog forms __46__ the mountains around Alto Hospicio — and the researchers thought they could use __47__.

For the study, researchers __48__ the amount of fog they collected. They then combined data with other __49__, including weather forecasts, to work __50__ how much fog Alto Hospicio would need to __51__ its water demands.

The researchers say that, __52__ fog collecting to work well, there needs to __53__ a system for storing and distributing large amounts of water. They hope their work will inspire __54__ people explore fog collecting __55__ a way of supplying water to areas with similar conditions.`,
              questions: [
                {
                  no: 36,
                  answer: 'A',
                  point: '名词辨析 · 语境',
                  analysis:
                    'the idea of collecting fog 意为“收集雾的想法”，后文 far-fetched（不切实际）修饰的正是 idea，故选 A。',
                  stem: '',
                  choices: ['idea', 'theory', 'meaning', 'definition'],
                },
                {
                  no: 37,
                  answer: 'B',
                  point: '逻辑关系 · 连词',
                  analysis:
                    '前句说“看似不切实际”，后句说“在世界一些地方已经在发生”，前后为转折关系，用 However。',
                  stem: '',
                  choices: ['Besides', 'However', 'Therefore', 'Moreover'],
                },
                {
                  no: 38,
                  answer: 'C',
                  point: '动词辨析',
                  analysis:
                    'researchers have suggested... 意为“研究人员提出/表明……”，proved 语气过强且缺乏依据，suggested 最合适。',
                  stem: '',
                  choices: ['proved', 'reviewed', 'suggested', 'indicated'],
                },
                {
                  no: 39,
                  answer: 'B',
                  point: '形容词辨析',
                  analysis:
                    'an effective way of supplying water 意为“一种有效的供水方式”，effective（有效的）符合语境。',
                  stem: '',
                  choices: ['poor', 'effective', 'harmful', 'common'],
                },
                {
                  no: 40,
                  answer: 'D',
                  point: '定语从句引导词',
                  analysis:
                    'places 为地点先行词，空格处引导定语从句修饰 places（回忆版答案为 where）。',
                  stem: '',
                  choices: ['how', 'that', 'what', 'where'],
                },
                {
                  no: 41,
                  answer: 'B',
                  point: '介词 · 固定搭配',
                  analysis: 'find out about 意为“了解、查明”，about 与 find out 构成固定搭配。',
                  stem: '',
                  choices: ['along', 'about', 'above', 'across'],
                },
                {
                  no: 42,
                  answer: 'C',
                  point: '动词短语',
                  analysis: 'carried out a study 意为“开展一项研究”，carry out 为固定搭配。',
                  stem: '',
                  choices: ['took', 'drew', 'carried', 'pointed'],
                },
                {
                  no: 43,
                  answer: 'D',
                  point: '限定词辨析',
                  analysis:
                    "rainfall 为不可数名词，用 little 修饰，There's very little rainfall 意为“降雨非常少”。",
                  stem: '',
                  choices: ['much', 'many', 'small', 'little'],
                },
                {
                  no: 44,
                  answer: 'D',
                  point: '名词 · 固定搭配',
                  analysis:
                    'have access to water 意为“获得用水的途径”，access（途径、使用权）符合搭配。',
                  stem: '',
                  choices: ['way', 'exist', 'visit', 'access'],
                },
                {
                  no: 45,
                  answer: 'C',
                  point: '介词 · 固定搭配',
                  analysis: 'depend on 意为“依赖”，on 与 depend 构成固定搭配。',
                  stem: '',
                  choices: ['to', 'in', 'on', 'of'],
                },
                {
                  no: 46,
                  answer: 'B',
                  point: '副词 · 语境',
                  analysis: 'fog forms regularly 意为“雾经常形成”，regularly（经常地）符合语境。',
                  stem: '',
                  choices: ['hardly', 'regularly', 'absolutely', 'occasionally'],
                },
                {
                  no: 47,
                  answer: 'A',
                  point: '代词指代',
                  analysis: 'use it 中的 it 指代前文的 fog（雾），故选 A。',
                  stem: '',
                  choices: ['it', 'them', 'itself', 'themselves'],
                },
                {
                  no: 48,
                  answer: 'C',
                  point: '动词辨析',
                  analysis: 'measured the amount of fog 意为“测量雾的量”，measured（测量）最贴切。',
                  stem: '',
                  choices: ['proved', 'reviewed', 'measured', 'indicated'],
                },
                {
                  no: 49,
                  answer: 'D',
                  point: '名词 · 语境',
                  analysis:
                    'combined data with other information 意为“将数据与其他信息结合”，information（信息）正确。',
                  stem: '',
                  choices: ['interest', 'incidents', 'instructions', 'information'],
                },
                {
                  no: 50,
                  answer: 'C',
                  point: '动词短语',
                  analysis:
                    'work out 意为“计算出”，work out how much fog... 意为“计算出需要多少雾……”。',
                  stem: '',
                  choices: ['up', 'off', 'out', 'down'],
                },
                {
                  no: 51,
                  answer: 'B',
                  point: '动词 · 固定搭配',
                  analysis:
                    'meet its water demands 意为“满足其用水需求”，meet demands 为固定搭配。',
                  stem: '',
                  choices: ['make', 'meet', 'reach', 'handle'],
                },
                {
                  no: 52,
                  answer: 'A',
                  point: 'for...to 结构',
                  analysis:
                    'for fog collecting to work well 意为“为了使收集雾能很好地发挥作用”，此处 for...to do 表目的（回忆版选项 form 为 for 的形近词）。',
                  stem: '',
                  choices: ['form', 'bring', 'examine', 'improve'],
                },
                {
                  no: 53,
                  answer: 'A',
                  point: 'there be 句型',
                  analysis: 'there needs to be a system 意为“需要有一套系统”，there be 句型正确。',
                  stem: '',
                  choices: ['be', 'get', 'see', 'have'],
                },
                {
                  no: 54,
                  answer: 'B',
                  point: '限定词辨析',
                  analysis: 'other people 意为“其他人”，other 修饰复数可数名词 people，正确。',
                  stem: '',
                  choices: ['else', 'other', 'others', 'another'],
                },
                {
                  no: 55,
                  answer: 'A',
                  point: '介词 · 固定搭配',
                  analysis: 'as a way of... 意为“作为一种……的方式”，as（作为）符合搭配。',
                  stem: '',
                  choices: ['as', 'by', 'like', 'against'],
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
              title: 'The Power of Smiling（Questions 56-60）',
              content: `Research reveals that showing you're happy can enhance both physical and mental health.

Smiling is a stress reliever. A University of Kansas study found that participants who were ... to smile during stressful tasks had lower heart rates during stress recovery. So it seems even ... yourself to look happy helps to manage tricky situations.

It may lower blood pressure. The fact that smiling reduces your heart rate when you're stressed ... likely to have a knock-on effect on blood pressure. Other research has shown that blood ... doesn't rise when people are exposed to humor.

Smiling boosts immunity (免疫力). A ... so ... if you want to stay well, it makes sense to .... Being amused also causes the release of endorphins (内啡肽) in .... Endorphins are the body's natural painkillers. In one study, participants who smiled ... reported 40 percent less pain.

... happy improves positive mood. It seems smiling really can boost your mood, rather ... a response to feeling happy. A 2022 study of 3,878 participants in 19 countries ... happiness rating was higher when they smiled.

... live longer. A 2010 study from Washington State University found that pre-1950s ... basketball players who had the broadest smile in photos lived longer.

... smiling also makes you appear kind to others and helps you to connect with them. If ... enough, it'll become second nature. Give yourself cues to remind you to smile — when ... laughing or you're making a cup of tea — or put a note on your phone as a reminder ... pleasurable, such as a favorite person, place or memory.`,
              questions: [
                {
                  no: 56,
                  answer: 'To smile during stressful tasks.',
                  point: '细节定位',
                  analysis:
                    '定位到原文 “participants who were ... to smile during stressful tasks”，堪萨斯大学研究的参与者被要求在压力任务中微笑，故答 To smile during stressful tasks。',
                  stem: '... the participants required to do in the University of Kansas study?',
                },
                {
                  no: 57,
                  answer: 'are exposed to humor',
                  point: '细节定位',
                  analysis:
                    "定位到原文 “Other research has shown that blood pressure doesn't rise when people are exposed to humor”，人们接触幽默时血压不升高。",
                  stem: "... has suggested that blood pressure doesn't rise when people ______.",
                },
                {
                  no: 58,
                  answer: 'Yes. By releasing endorphins.',
                  point: '细节定位',
                  analysis:
                    '定位到 “Smiling boosts immunity” 部分，微笑通过促使大脑释放内啡肽（endorphins）来增强免疫力。',
                  stem: '... smile improve immune function?',
                },
                {
                  no: 59,
                  answer: 'Happiness rating was higher when they smiled.',
                  point: '细节定位',
                  analysis:
                    '定位到 2022 年研究 “happiness rating was higher when they smiled”，即微笑时幸福评分更高。',
                  stem: '... be finding of the 2022 study?',
                },
                {
                  no: 60,
                  answer: 'Give yourself cues to remind you to smile.',
                  point: '细节定位',
                  analysis:
                    '定位到末段 “Give yourself cues to remind you to smile”，通过给自己设置提示来让微笑成为第二天性。',
                  stem: '... make smiling your second nature?',
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
              answer: 'helps you (to) get to know yourself',
              point: '短语翻译 · help sb (to) do sth',
              analysis:
                'get to know 意为“逐渐认识”，help sb (to) do sth 意为“帮助某人做某事”，故填 helps you (to) get to know yourself。',
              stem: 'Art is great because it ______（让你认识你自己）.',
            },
            {
              no: 62,
              answer: 'is covered with water most of the time',
              point: '被动语态 · 短语',
              analysis:
                'be covered with 意为“被……覆盖”，most of the time 意为“大多数时候”，故填 is covered with water most of the time。',
              stem: 'A wetland is an area where the land ______（大多数时候被水覆盖）.',
            },
            {
              no: 63,
              answer: 'Helping others',
              point: '动名词作主语',
              analysis:
                '动名词短语 Helping others 作主语，谓语动词用单数 benefits，故填 Helping others。',
              stem: '______（帮助他人）benefits the one who helps.',
            },
            {
              no: 64,
              answer: 'happen in your life',
              point: '短语翻译 · 定语从句',
              analysis:
                'happen in your life 意为“发生在你的生活中”，作 that 引导的定语从句的谓语，故填 happen in your life。',
              stem: 'There can be lots of new things that ______（发生在你的生活中）.',
            },
            {
              no: 65,
              answer: 'not only cute',
              point: '并列结构 · not only...but also',
              analysis: 'not only... but also... 意为“不仅……而且……”，故填 not only cute。',
              stem: 'Dogs are ______（不仅可爱）but also very smart.',
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
              answer: '她们不能发表公开演讲。',
              point: '词汇翻译',
              analysis:
                'make public speeches 意为“发表公开演讲”，could not 表示“不能”，故译为“她们不能发表公开演讲”。',
              stem: 'They could not make public speeches.',
            },
            {
              no: 67,
              answer: '大多数女性都是全职的母亲和妻子。',
              point: '词汇翻译',
              analysis: 'full-time 意为“全职的”，故译为“大多数女性都是全职的母亲和妻子”。',
              stem: 'most women were full-time mothers and wives.',
            },
            {
              no: 68,
              answer: '她们努力改善穷人的生活。',
              point: '词汇翻译',
              analysis:
                'improve the lives of the poor 意为“改善穷人的生活”，故译为“她们努力改善穷人的生活”。',
              stem: 'They worked to improve the lives of the poor.',
            },
            {
              no: 69,
              answer: '她们在感兴趣的领域追求职业。',
              point: '定语从句翻译',
              analysis:
                'fields that interested them 意为“让她们感兴趣的领域”，pursue professions 意为“追求职业”，故译为“她们在感兴趣的领域追求职业”。',
              stem: 'They pursued professions in fields that interested them.',
            },
            {
              no: 70,
              answer: '女性是大型公司和组织的领导者。',
              point: '词汇翻译',
              analysis:
                'leaders of major companies and organizations 意为“大型公司和组织的领导者”，故译为“女性是大型公司和组织的领导者”。',
              stem: 'Women are the leaders of major companies and organizations.',
            },
          ],
        },
      ],
    },
    {
      id: 'writing',
      title: 'Part Writing (30 points, 30 minutes)',
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
                'Timed examinations have long been a traditional way of testing students within a limited time. Some people think they are fair because every student faces the same challenge and pressure. Others believe they are unfair because some students cannot perform well under pressure. In my view, timed exams are necessary and generally fair. They test quick thinking and time management, and offer a uniform standard for all students. To reduce unfairness, we should design papers of reasonable difficulty and practise more. All in all, although not perfect, timed exams remain an effective form of assessment.',
              point: '议论文写作',
              analysis:
                '观点型议论文：先陈述两种对立观点（限时考试公平 vs 不公平），再明确表达自己的观点并给出理由，最后总结。范文采用“总—分—总”结构：首段引出话题并说明两种观点，中间段表明“限时考试必要且总体公平”并阐述理由（统一标准、锻炼快速思维与时间管理），尾段提出改进建议并总结观点。',
              stem: '（1）限时考试是要求学生在规定时间内完成考试的一种传统方式。有人认为这种考试方式是公平的，所有学生都面临同等挑战和压力；有人认为这种考试方式不够公平，有些学生不能发挥正常水平。\n（2）请阐述你的观点和理由。',
            },
          ],
        },
      ],
    },
  ],
}
