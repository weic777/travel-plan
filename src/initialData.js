// initialData.js

export const initialTripData = {
    tripName: "Central Europe 2026",
    startDate: "2026-03-29",
    endDate: "2026-04-07",
    flightInfo: {
        outbound: {
            airline: "China Airlines",
            flightNumber: "CI0063",
            departure: { code: "TPE", time: "2026-03-29 23:40" },
            arrival: { code: "VIE", time: "2026-03-30 06:30" } // Estimated arrival time
        },
        inbound: {
            airline: "China Airlines",
            flightNumber: "CI0064",
            departure: { code: "VIE", time: "2026-04-07 11:25" },
            arrival: { code: "TPE", time: "2026-04-08 06:00" } // Estimated arrival time
        }
    },
    days: [
        {
            index: 0,
            date: "2026-03-29",
            activities: [
                {
                    id: 'd1_a1',
                    time: '20:00',
                    description: '抵達桃園機場',
                    type: 'transport',
                    location: 'TPE Airport',
                    note: '晚餐：機場或飛機上',
                    expenses: []
                },
                {
                    id: 'd1_a2',
                    time: '23:40',
                    description: '台北出發 (CI0063)',
                    type: 'flight',
                    location: 'TPE -> VIE',
                    note: '住宿：飛機上',
                    expenses: []
                }
            ]
        },
        {
            index: 1,
            date: "2026-03-30",
            activities: [
                {
                    id: 'd2_a1',
                    time: '11:00',
                    description: '抵達維也納機場 (VIE)',
                    type: 'transport',
                    location: 'Vienna International Airport',
                    note: '住宿推薦：Neubau (7區)',
                    expenses: []
                },
                {
                    id: 'd2_a2',
                    time: '12:30',
                    description: '前往市區 Check-in',
                    type: 'transport',
                    location: 'Vienna City Center',
                    note: '搭乘 S-Bahn (S7 線)。午餐：火車站或住宿附近輕食',
                    expenses: [
                        { id: 'e_d2_1', amount: 4.50, currency: 'EUR', category: 'Transport', description: 'S-Bahn S7', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd2_a3',
                    time: '14:30',
                    description: '瑪麗亞希爾費大街 / 7區 Neubau 探索',
                    type: 'sightseeing',
                    location: 'Mariahilfer Straße',
                    note: '使用維也納週票',
                    expenses: []
                },
                {
                    id: 'd2_a4',
                    time: '17:30',
                    description: '博物館區 (MQ) 漫遊',
                    type: 'sightseeing',
                    location: 'MuseumsQuartier',
                    note: '不進博物館，純漫遊',
                    expenses: []
                },
                {
                    id: 'd2_a5',
                    time: '19:30',
                    description: '多瑙運河畔晚餐',
                    type: 'meal',
                    location: 'Donaukanal',
                    note: '推薦：Strandbar Herrmann 或 Badeschiff',
                    expenses: []
                }
            ]
        },
        {
            index: 2,
            date: "2026-03-31",
            activities: [
                {
                    id: 'd3_a1',
                    time: '08:00',
                    description: '維也納 → 哈修塔特',
                    type: 'transport',
                    location: 'Vienna -> Hallstatt',
                    note: '搭乘 ÖBB 國鐵，提早預訂 SparSchiene',
                    expenses: [
                        { id: 'e_d3_1', amount: 30.00, currency: 'EUR', category: 'Transport', description: 'ÖBB Train', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd3_a2',
                    time: '12:00',
                    description: '抵達 Hallstatt，搭船至小鎮',
                    type: 'transport',
                    location: 'Hallstatt',
                    note: '午餐：碼頭或小鎮輕食',
                    expenses: [
                        { id: 'e_d3_2', amount: 3.50, currency: 'EUR', category: 'Transport', description: 'Ferry', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd3_a3',
                    time: '14:00',
                    description: '鹽礦纜車 & Skywalk',
                    type: 'sightseeing',
                    location: 'Salzwelten Hallstatt',
                    note: '俯瞰哈修塔特湖',
                    expenses: [
                        { id: 'e_d3_3', amount: 22.00, currency: 'EUR', category: 'Ticket', description: 'Funicular Roundtrip', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd3_a4',
                    time: '17:00',
                    description: '環湖步道漫步',
                    type: 'sightseeing',
                    location: 'Hallstatt Lake',
                    note: '住宿：Hallstatt Lahn 區民宿',
                    expenses: []
                },
                {
                    id: 'd3_a5',
                    time: '19:30',
                    description: '晚餐：Gasthof Zauner',
                    type: 'meal',
                    location: 'Gasthof Zauner',
                    note: '享用湖區傳統料理',
                    expenses: []
                }
            ]
        },
        {
            index: 3,
            date: "2026-04-01",
            activities: [
                {
                    id: 'd4_a1',
                    time: '09:00',
                    description: '搭船離開哈修塔特',
                    type: 'transport',
                    location: 'Hallstatt Dock',
                    note: '',
                    expenses: [
                        { id: 'e_d4_1', amount: 3.50, currency: 'EUR', category: 'Transport', description: 'Ferry', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd4_a2',
                    time: '10:00',
                    description: '哈修塔特 → 薩爾斯堡',
                    type: 'transport',
                    location: 'Hallstatt -> Salzburg',
                    note: '巴士轉列車。住宿推薦：Schallmoos 區',
                    expenses: [
                        { id: 'e_d4_2', amount: 22.50, currency: 'EUR', category: 'Transport', description: 'Bus + Train', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd4_a3',
                    time: '13:00',
                    description: '抵達薩爾斯堡 Check-in',
                    type: 'accommodation',
                    location: 'Salzburg',
                    note: '午餐：新城區或老城區小吃',
                    expenses: []
                },
                {
                    id: 'd4_a4',
                    time: '15:00',
                    description: '米拉貝爾宮花園',
                    type: 'sightseeing',
                    location: 'Mirabell Palace',
                    note: '真善美場景',
                    expenses: []
                },
                {
                    id: 'd4_a5',
                    time: '17:00',
                    description: '霍亨薩爾斯堡要塞',
                    type: 'sightseeing',
                    location: 'Hohensalzburg Fortress',
                    note: '搭乘纜車上山',
                    expenses: [
                        { id: 'e_d4_3', amount: 16.60, currency: 'EUR', category: 'Ticket', description: 'Fortress + Funicular', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd4_a6',
                    time: '19:30',
                    description: '晚餐：Die Weisse',
                    type: 'meal',
                    location: 'Die Weisse',
                    note: '傳統奧地利豬肘與白啤酒',
                    expenses: []
                }
            ]
        },
        {
            index: 4,
            date: "2026-04-02",
            activities: [
                {
                    id: 'd5_a1',
                    time: '08:30',
                    description: '薩爾斯堡 → 國王湖',
                    type: 'transport',
                    location: 'Salzburg Hbf',
                    note: '搭乘 Bus 840/841 (RVO Day Ticket)',
                    expenses: [
                        { id: 'e_d5_1', amount: 12.00, currency: 'EUR', category: 'Transport', description: 'RVO Day Ticket', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd5_a2',
                    time: '09:30',
                    description: '國王湖遊船',
                    type: 'sightseeing',
                    location: 'Königssee',
                    note: '搭乘電動船至 Salet',
                    expenses: [
                        { id: 'e_d5_2', amount: 22.00, currency: 'EUR', category: 'Ticket', description: 'Boat Roundtrip', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd5_a3',
                    time: '11:00',
                    description: '奧伯湖 (Obersee) 健行',
                    type: 'sightseeing',
                    location: 'Obersee',
                    note: '午餐：自備野餐',
                    expenses: []
                },
                {
                    id: 'd5_a4',
                    time: '18:00',
                    description: '返回薩爾斯堡',
                    type: 'transport',
                    location: 'Königssee -> Salzburg',
                    note: '使用日票',
                    expenses: []
                },
                {
                    id: 'd5_a5',
                    time: '20:00',
                    description: '晚餐：民宿自煮',
                    type: 'meal',
                    location: 'Apartment',
                    note: '超市採買食材',
                    expenses: []
                }
            ]
        },
        {
            index: 5,
            date: "2026-04-03",
            activities: [
                {
                    id: 'd6_a1',
                    time: '09:00',
                    description: '薩爾斯堡老城巡禮',
                    type: 'sightseeing',
                    location: 'Salzburg Old Town',
                    note: '悠閒早餐',
                    expenses: []
                },
                {
                    id: 'd6_a2',
                    time: '11:30',
                    description: '薩爾斯堡 → CK 小鎮',
                    type: 'transport',
                    location: 'Salzburg -> Český Krumlov',
                    note: '私人接駁小巴 (約4小時)',
                    expenses: [
                        { id: 'e_d6_1', amount: 40.00, currency: 'EUR', category: 'Transport', description: 'Shuttle Bus', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd6_a3',
                    time: '15:30',
                    description: '抵達 CK 小鎮 Check-in',
                    type: 'accommodation',
                    location: 'Český Krumlov',
                    note: '住宿推薦：Penzion 或當地民宿',
                    expenses: []
                },
                {
                    id: 'd6_a4',
                    time: '17:00',
                    description: '城堡區觀景台 & 河畔漫步',
                    type: 'sightseeing',
                    location: 'CK Castle',
                    note: 'Vltava 河畔',
                    expenses: []
                },
                {
                    id: 'd6_a5',
                    time: '19:30',
                    description: '晚餐：Hospoda 99',
                    type: 'meal',
                    location: 'Hospoda 99',
                    note: '捷克燉牛肉 Goulash 或烤豬腳',
                    expenses: []
                }
            ]
        },
        {
            index: 6,
            date: "2026-04-04",
            activities: [
                {
                    id: 'd7_a1',
                    time: '09:00',
                    description: '城堡彩繪塔 / 鎮區漫步',
                    type: 'sightseeing',
                    location: 'Castle Tower',
                    note: '',
                    expenses: [
                        { id: 'e_d7_1', amount: 8.00, currency: 'EUR', category: 'Ticket', description: 'Tower Entrance', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd7_a2',
                    time: '14:00',
                    description: 'CK 小鎮 → 布拉格',
                    type: 'transport',
                    location: 'CK -> Prague',
                    note: '搭乘巴士 (RegioJet / FlixBus)',
                    expenses: [
                        { id: 'e_d7_2', amount: 12.50, currency: 'EUR', category: 'Transport', description: 'Bus Ticket', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd7_a3',
                    time: '17:30',
                    description: '抵達布拉格 Check-in',
                    type: 'accommodation',
                    location: 'Prague',
                    note: '住宿推薦：Vinohrady 或 Karlín 區',
                    expenses: [
                        { id: 'e_d7_3', amount: 4.00, currency: 'EUR', category: 'Transport', description: 'City Transport Ticket', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd7_a4',
                    time: '20:00',
                    description: '晚餐：Local Hospoda',
                    type: 'meal',
                    location: 'Vinohrady/Karlín',
                    note: '體驗當地酒吧美食',
                    expenses: []
                }
            ]
        },
        {
            index: 7,
            date: "2026-04-05",
            activities: [
                {
                    id: 'd8_a1',
                    time: '09:30',
                    description: 'Kampa Museum 或 國家藝廊',
                    type: 'sightseeing',
                    location: 'Kampa Museum',
                    note: '當代藝術',
                    expenses: [
                        { id: 'e_d8_1', amount: 12.00, currency: 'EUR', category: 'Ticket', description: 'Museum Entrance', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd8_a2',
                    time: '12:30',
                    description: '午餐：Letná Park 啤酒花園',
                    type: 'meal',
                    location: 'Letná Park',
                    note: '享受戶外午餐和城市景觀',
                    expenses: []
                },
                {
                    id: 'd8_a3',
                    time: '15:00',
                    description: '都會計時器 & 城市景觀',
                    type: 'sightseeing',
                    location: 'Letná Park',
                    note: '',
                    expenses: []
                },
                {
                    id: 'd8_a4',
                    time: '17:00',
                    description: '跳舞的房子 (Dancing House)',
                    type: 'sightseeing',
                    location: 'Dancing House',
                    note: '外觀參觀',
                    expenses: []
                },
                {
                    id: 'd8_a5',
                    time: '20:00',
                    description: '晚餐：Výtopna Railway Restaurant',
                    type: 'meal',
                    location: 'Výtopna',
                    note: '火車送餐餐廳',
                    expenses: []
                }
            ]
        },
        {
            index: 8,
            date: "2026-04-06",
            activities: [
                {
                    id: 'd9_a1',
                    time: '09:00',
                    description: '查理大橋 & 舊城廣場',
                    type: 'sightseeing',
                    location: 'Charles Bridge',
                    note: '快閃或悠閒早午餐',
                    expenses: []
                },
                {
                    id: 'd9_a2',
                    time: '12:00',
                    description: '布拉格 → 維也納',
                    type: 'transport',
                    location: 'Prague -> Vienna',
                    note: '巴士/火車，確保 17:00 前抵達',
                    expenses: [
                        { id: 'e_d9_1', amount: 27.50, currency: 'EUR', category: 'Transport', description: 'Train/Bus Ticket', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd9_a3',
                    time: '17:00',
                    description: '抵達維也納 Check-in',
                    type: 'accommodation',
                    location: 'Vienna',
                    note: '返回 Day 2 住宿點',
                    expenses: []
                },
                {
                    id: 'd9_a4',
                    time: '20:00',
                    description: '告別晚餐：Heuriger',
                    type: 'meal',
                    location: 'Grinzing',
                    note: '農家酒館，享受葡萄酒和冷盤',
                    expenses: []
                }
            ]
        },
        {
            index: 9,
            date: "2026-04-07",
            activities: [
                {
                    id: 'd10_a1',
                    time: '08:00',
                    description: '早餐、退房',
                    type: 'other',
                    location: 'Hotel',
                    note: '整理行李',
                    expenses: []
                },
                {
                    id: 'd10_a2',
                    time: '08:30',
                    description: '前往維也納機場 (VIE)',
                    type: 'transport',
                    location: 'Vienna Airport',
                    note: '搭乘 S-Bahn S7',
                    expenses: [
                        { id: 'e_d10_1', amount: 4.50, currency: 'EUR', category: 'Transport', description: 'S-Bahn Ticket', payer: '爸爸' }
                    ]
                },
                {
                    id: 'd10_a3',
                    time: '11:25',
                    description: '搭乘 CI0064 返回台北',
                    type: 'flight',
                    location: 'VIE -> TPE',
                    note: '平安賦歸',
                    expenses: []
                }
            ]
        }
    ],
    shoppingList: [
        { id: 's1', item: '莫札特巧克力', assignedTo: '媽媽', quantity: 5, purchased: false, location: '超市', note: '買 Mirabell 牌子的' },
        { id: 's2', item: '施華洛世奇水晶', assignedTo: '爸爸', quantity: 1, purchased: false, location: '市中心', note: '給奶奶的禮物' }
    ],
    packingList: [
        { id: 'p1', item: '護照', category: '證件', packed: false },
        { id: 'p2', item: '機票', category: '證件', packed: false },
        { id: 'p3', item: '充電器', category: '電子產品', packed: false },
        { id: 'p4', item: '行動電源', category: '電子產品', packed: false },
        { id: 'p5', item: '牙刷', category: '盥洗用品', packed: false },
        { id: 'p6', item: '洗髮精', category: '盥洗用品', packed: false },
        { id: 'p7', item: '內衣褲', category: '衣物', packed: false },
        { id: 'p8', item: '外套', category: '衣物', packed: false },
        { id: 'p9', item: '襪子', category: '衣物', packed: false }
    ],
    independentExpenses: []
};

export const initialSettings = {
    currency: "EUR",
    timezone: "Europe/Vienna",
    currencies: [{ code: 'EUR', name: '歐元' }, { code: 'TWD', name: '新台幣' }],
    familyMembers: ["爸爸", "媽媽", "小孩A", "小孩B"],
    categories: ["餐飲", "門票", "交通", "住宿", "保險", "其他"]
};
