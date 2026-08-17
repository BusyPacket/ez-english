// 2025 年浙江省统招专升本英语真题
// 数据来源：exam-papers/2025年英语真题.md

import type { ExamPaper } from '@/types/exam'

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
                  stem: 'How much did it cost OpenAI to develop its latest ChatGPT model?',
                  choices: ['£1 million.', '£80 million.', '£4.8 million.', '£200 million.'],
                },
                {
                  no: 3,
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
                  stem: 'Which of the following is NOT a type of software in the passage?',
                  choices: ['Gemini.', 'ChatGPT.', 'DeepSeek.', 'CBS News.'],
                },
                {
                  no: 5,
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
                  stem: 'What does the underlined word "delay-free" in Para. 1 probably mean?',
                  choices: ['Safe.', 'Boring.', 'Painful.', 'Pleasant.'],
                },
                {
                  no: 7,
                  stem: "Which city was Austin's favorite during his train travel?",
                  choices: ['York.', 'Truro.', 'Carlisle.', 'Brighton.'],
                },
                {
                  no: 8,
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
                  stem: 'What does the underlined word "counterparts" in Para. 1 refer to?',
                  choices: ['Authors.', 'Ecologists.', 'Fish fathers.', 'Fish mothers.'],
                },
                {
                  no: 17,
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
                  stem: "What is Coulson's attitude towards the review according to Para. 3?",
                  choices: ['Positive.', 'Doubtful.', 'Negative.', 'Indifferent.'],
                },
                {
                  no: 19,
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
              questions: [],
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
          title: 'Section B Banked Cloze（选词填空）',
          score: '10 分',
          directions:
            'In this section, there is a passage with ten blanks. You are required to select one word for each blank from a list of choices given in a word bank following the passage. Read the passage through carefully before making your choices. Please mark the corresponding letter for each item on The Answer Sheet. You may not use any of the words in the bank more than once. (10 points)',
          passages: [
            {
              title: 'Celebrating Small Successes（空 26-39）',
              content: `Whether it's working hard at your favorite subject or baking a cake for your friends, putting effort into something that makes you happy is an achievement. It's a good feeling you can get from all __26__ of your life. You might not always notice your __27__: successes. Success can be something that no one else sees but you feel, such as making it through a __28__ day or speaking up in class.

Recognizing small successes __29__ you feel you can achieve bigger things, says Melanie MoNally, who is a psychologist. Studies show that when you celebrate your __30__, the __31__ of your brain lights up and boosts how you feel about yourself. This makes you feel __32__ motivated and helps to __33__ challenges in the future.

Celebrating your successes, even small ones, is important, MoNally says. If you __34__ such as learning a musical instrument, make a sticker chart to show how __35__ practice. When the chart is full, __36__ yourself with what Monally calls "victory" treats. __37__ could be fun things such as a bike ride with friends, playing games or a __38__ bath. Share __39__ wins with family and friends too, so they can support you.`,
              questions: [],
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
                { no: 36, stem: '', choices: ['idea', 'theory', 'meaning', 'definition'] },
                { no: 37, stem: '', choices: ['Besides', 'However', 'Therefore', 'Moreover'] },
                { no: 38, stem: '', choices: ['proved', 'reviewed', 'suggested', 'indicated'] },
                { no: 39, stem: '', choices: ['poor', 'effective', 'harmful', 'common'] },
                { no: 40, stem: '', choices: ['how', 'that', 'what', 'where'] },
                { no: 41, stem: '', choices: ['along', 'about', 'above', 'across'] },
                { no: 42, stem: '', choices: ['took', 'drew', 'carried', 'pointed'] },
                { no: 43, stem: '', choices: ['much', 'many', 'small', 'little'] },
                { no: 44, stem: '', choices: ['way', 'exist', 'visit', 'access'] },
                { no: 45, stem: '', choices: ['to', 'in', 'on', 'of'] },
                {
                  no: 46,
                  stem: '',
                  choices: ['hardly', 'regularly', 'absolutely', 'occasionally'],
                },
                { no: 47, stem: '', choices: ['it', 'them', 'itself', 'themselves'] },
                { no: 48, stem: '', choices: ['proved', 'reviewed', 'measured', 'indicated'] },
                {
                  no: 49,
                  stem: '',
                  choices: ['interest', 'incidents', 'instructions', 'information'],
                },
                { no: 50, stem: '', choices: ['up', 'off', 'out', 'down'] },
                { no: 51, stem: '', choices: ['make', 'meet', 'reach', 'handle'] },
                { no: 52, stem: '', choices: ['form', 'bring', 'examine', 'improve'] },
                { no: 53, stem: '', choices: ['be', 'get', 'see', 'have'] },
                { no: 54, stem: '', choices: ['else', 'other', 'others', 'another'] },
                { no: 55, stem: '', choices: ['as', 'by', 'like', 'against'] },
              ],
            },
          ],
        },
        {
          id: 'short-answer',
          title: 'Section B Short Answer Questions（篇章问答）',
          score: '10 分',
          directions:
            'In this part there is a short passage followed by five questions or incomplete statements. Read the passage carefully. Then answer the questions or complete the statements with no more than 10 words. Please write your answers on The Answer Sheet. (10 points)',
          passages: [
            {
              title: 'The Power of Smiling（Questions 56-60）',
              content: `Research reveals that showing you're happy can enhance both physical and mental health.

Smiling is a stress reliever. A University of Kansas study found that participants who were ___ to smile during stressful tasks had lower heart rates during stress recovery. So it seems even ___ yourself to look happy helps to manage tricky situations.

It may lower blood pressure. The fact that smiling reduces your heart rate when you're stressed ___ likely to have a knock-on effect on blood pressure. Other research has shown that blood ___ doesn't rise when people are exposed to humor.

Smiling boosts immunity (免疫力). A ___ so ___ if you want to stay well, it makes sense to ___. Being amused also causes the release of endorphins (内啡肽) in ___. Endorphins are the body's natural painkillers. In one study, participants who smiled ___ reported 40 percent less pain.

It ___ happy improves positive mood. It seems smiling really can boost your mood, rather ___ a response to feeling happy. A 2022 study of 3,878 participants in 19 countries ___ happiness rating was higher when they smiled.

It ___ live longer. A 2010 study from Washington State University found that pre-1950s ___ basketball players who had the broadest smile in photos lived longer.

Smiling also makes you appear kind to others and helps you to connect with them. If ___ enough, it'll become second nature. Give yourself cues to remind you to smile — when ___ laughing or you're making a cup of tea — or put a note on your phone as a reminder ___ pleasuable, such as a favorite person, place or memory.`,
              questions: [
                {
                  no: 56,
                  stem: '___ the participants required to do in the University of Kansas study?',
                },
                {
                  no: 57,
                  stem: "___ has suggested that blood pressure doesn't rise when people ______.",
                },
                { no: 58, stem: '___ smile improve immune function?' },
                { no: 59, stem: '___ be finding of the 2022 study?' },
                { no: 60, stem: '___ make smiling your second nature?' },
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
          title: 'Section A From Chinese to English（汉译英）',
          score: '15 分',
          directions:
            'Complete the sentences by translating into English the Chinese given in the brackets. Please write your translation on The Answer Sheet. (15 points)',
          questions: [
            { no: 61, stem: 'Art is great because it ______（让你认识你自己）.' },
            { no: 62, stem: 'A wetland is an area where the land ______（大多数时候被水覆盖）.' },
            { no: 63, stem: '______（帮助他人）benefits the one who helps.' },
            { no: 64, stem: 'There can be lots of new things that ______（发生在你的生活中）.' },
            { no: 65, stem: 'Dogs are ______（不仅可爱）but also very smart.' },
          ],
        },
        {
          id: 'en2cn',
          title: 'Section B From English to Chinese（英译汉）',
          score: '15 分',
          directions:
            'Translate into English the underlined sentences in the following passage. Write your translation on The Answer Sheet. (15 points)',
          questions: [
            { no: 66, stem: 'They could not make public speeches.' },
            { no: 67, stem: 'most women were full-time mothers and wives.' },
            { no: 68, stem: 'They worked to improve the lives of the poor.' },
            { no: 69, stem: 'They pursued professions in fields that interested them.' },
            { no: 70, stem: 'Women are the leaders of major companies and organizations.' },
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
          title: '写作（Composition）',
          score: '30 分',
          directions:
            'For this part, you are allowed 30 minutes to write a composition on the topic My View On Mutual Influence. You should write about 120 words based on the following outline given below. Please write your composition on The Answer Sheet. (30 points)',
          questions: [
            {
              no: 71,
              stem: '（1）限时考试是要求学生在规定时间内完成考试的一种传统方式。有人认为这种考试方式是公平的，所有学生都面临同等挑战和压力；有人认为这种考试方式不够公平，有些学生不能发挥正常水平。\n（2）请阐述你的观点和理由。',
            },
          ],
        },
      ],
    },
  ],
}
