// initialData.js

export const initialTripData = {
    tripName: "四月東歐 2026",
    startDate: "2026-03-29",
    endDate: "2026-04-07",
    flightInfo: {
        outbound: {
            airline: "China Airlines",
            flightNumber: "CI0063",
            departure: { code: "TPE", time: "2026-03-29 23:40" },
            arrival: { code: "VIE", time: "2026-03-30 06:30" }
        },
        inbound: {
            airline: "China Airlines",
            flightNumber: "CI0064",
            departure: { code: "VIE", time: "2026-04-07 11:00" },
            arrival: { code: "TPE", time: "2026-04-08 06:00" }
        }
    },
    days: [
        {
            index: 0,
            date: "2026-03-29",
            city: "台北",
            activities: [
                {
                    id: 'd1_a1',
                    time: '20:00',
                    description: '抵達桃園機場',
                    type: 'transport',
                    location: 'TPE Airport',
                    note: '準備出發',
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
            city: "維也納",
            activities: [
                {
                    id: 'd2_a1',
                    time: '07:30',
                    description: '搭乘 RJX 火車前往中央車站',
                    type: 'transport',
                    location: 'VIE Airport -> Central Station',
                    note: '📝 ToDo： 抵達中央車站時，領取/確認機場往返市區的實體票券。',
                    expenses: [
                        { id: 'e_d2_1', amount: 4872, currency: 'TWD', category: '交通', description: 'RJX 火車 (來回票)', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd2_a2',
                    time: '09:00',
                    description: '寄放行李 / 輕裝出發',
                    type: 'accommodation',
                    location: 'Prize by Radisson, Vienna City (含早餐)',
                    note: '💰 費用：TWD 8,956 (媽付錢) | ✅ 已預訂。\n【關鍵任務】 🧳 行李： 辦理入住時寄放 6 個大行李箱（預計寄放至 Day 9 領取）。',
                    expenses: []
                },
                {
                    id: 'd2_a3',
                    time: '09:30',
                    description: '美泉宮',
                    type: 'sightseeing',
                    location: 'Schönbrunn Palace',
                    note: '',
                    expenses: []
                },
                {
                    id: 'd2_a4',
                    time: '12:30',
                    description: '午餐：Plachutta',
                    type: 'meal',
                    location: 'Plachutta',
                    note: '建議預約',
                    expenses: []
                },
                {
                    id: 'd2_a5',
                    time: '14:30',
                    description: '舊城區漫遊',
                    type: 'sightseeing',
                    location: 'Vienna Old Town',
                    note: '霍夫堡、聖史蒂芬大教堂',
                    expenses: []
                },
                {
                    id: 'd2_a6',
                    time: '18:30',
                    description: '晚餐：Figlmüller',
                    type: 'meal',
                    location: 'Figlmüller',
                    note: '務必準時，已預約',
                    expenses: []
                }
            ]
        },
        {
            index: 2,
            date: "2026-03-31",
            city: "哈修塔特",
            activities: [
                {
                    id: 'd3_a1',
                    time: '07:28',
                    description: '維也納 → 哈修塔特',
                    type: 'transport',
                    location: 'Vienna -> Hallstatt',
                    note: 'ÖBB 火車，需於 Linz 轉車。',
                    expenses: [
                        { id: 'e_d3_1', amount: 7413, currency: 'TWD', category: '交通', description: 'ÖBB 火車', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd3_a2',
                    time: '11:30',
                    description: '抵達哈修塔特 / 住宿 Check-in',
                    type: 'accommodation',
                    location: 'Weisses Lamm (含早餐)',
                    note: '💰 費用：TWD 15,615 (媽付錢) | ✅ 已預訂。\n【關鍵任務】 🎫 ToDo： 11:30 抵達後購買 13:30 場次的鹽礦導覽門票。',
                    expenses: []
                },
                {
                    id: 'd3_a3',
                    time: '13:30',
                    description: '鹽礦導覽',
                    type: 'sightseeing',
                    location: 'Salzwelten Hallstatt',
                    note: '鹽礦探險',
                    expenses: []
                },
                {
                    id: 'd3_a4',
                    time: '16:00',
                    description: 'Skywalk 觀景台',
                    type: 'sightseeing',
                    location: 'Skywalk',
                    note: '',
                    expenses: []
                }
            ]
        },
        {
            index: 3,
            date: "2026-04-01",
            city: "薩爾茲堡",
            activities: [
                {
                    id: 'd4_a1',
                    time: '11:32',
                    description: '哈修塔特 → 薩爾茲堡',
                    type: 'transport',
                    location: 'Hallstatt -> Salzburg',
                    note: 'ÖBB 火車，需於 Attnang-Puchheim 轉車。',
                    expenses: [
                        { id: 'e_d4_1', amount: 2794, currency: 'TWD', category: '交通', description: 'ÖBB 火車', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd4_a2',
                    time: '13:30',
                    description: '住宿 Check-in',
                    type: 'accommodation',
                    location: 'Pension Elisabeth (無早餐)',
                    note: '💰 費用：TWD 8,544 (媽付錢) | ✅ 已預訂。',
                    expenses: []
                },
                {
                    id: 'd4_a3',
                    time: '15:00',
                    description: '薩爾茲堡要塞',
                    type: 'sightseeing',
                    location: 'Hohensalzburg Fortress',
                    note: '音樂之聲',
                    expenses: []
                },
                {
                    id: 'd4_a4',
                    time: '17:00',
                    description: '米拉貝爾花園',
                    type: 'sightseeing',
                    location: 'Mirabell Palace',
                    note: '',
                    expenses: []
                }
            ]
        },
        {
            index: 4,
            date: "2026-04-02",
            city: "CK小鎮",
            activities: [
                {
                    id: 'd5_a1',
                    time: '11:00',
                    description: '薩爾茲堡 → CK 小鎮',
                    type: 'transport',
                    location: 'Salzburg -> Český Krumlov',
                    note: 'CK Shuttle 私人接駁。',
                    expenses: [
                        { id: 'e_d5_1', amount: 11867, currency: 'TWD', category: '交通', description: 'CK Shuttle', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd5_a2',
                    time: '15:00',
                    description: '住宿 Check-in',
                    type: 'accommodation',
                    location: 'Largo (含早餐)',
                    note: '💰 費用：TWD 8,786 (媽付錢) | ✅ 已預訂。',
                    expenses: []
                },
                {
                    id: 'd5_a3',
                    time: '16:00',
                    description: '童話巡禮',
                    type: 'sightseeing',
                    location: 'CK Town Center',
                    note: '隨意漫步',
                    expenses: []
                },
                {
                    id: 'd5_a4',
                    time: '19:00',
                    description: '晚餐：地窖餐廳',
                    type: 'meal',
                    location: 'Krčma v Šatlavské',
                    note: '務必準時，已預約',
                    expenses: []
                }
            ]
        },
        {
            index: 5,
            date: "2026-04-03",
            city: "布拉格",
            activities: [
                {
                    id: 'd6_a1',
                    time: '10:00',
                    description: 'CK 城堡彩繪塔',
                    type: 'sightseeing',
                    location: 'Castle Tower',
                    note: '',
                    expenses: []
                },
                {
                    id: 'd6_a2',
                    time: '13:00',
                    description: 'CK 小鎮 → 布拉格',
                    type: 'transport',
                    location: 'CK -> Prague',
                    note: 'CK Shuttle 私人接駁。',
                    expenses: [
                        { id: 'e_d6_1', amount: 10816, currency: 'TWD', category: '交通', description: 'CK Shuttle', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd6_a3',
                    time: '16:00',
                    description: '住宿 Check-in',
                    type: 'accommodation',
                    location: 'Comfortable and cosy apt (無早餐，入住 3 晚)',
                    note: '💰 費用：TWD 34,798 (媽付錢) | ✅ 已預訂。',
                    expenses: []
                },
                {
                    id: 'd6_a4',
                    time: '17:30',
                    description: '查理大橋賞日落',
                    type: 'sightseeing',
                    location: 'Charles Bridge',
                    note: '夕陽序曲',
                    expenses: []
                }
            ]
        },
        {
            index: 6,
            date: "2026-04-04",
            city: "布拉格",
            activities: [
                {
                    id: 'd7_a1',
                    time: '09:00',
                    description: '布拉格城堡區',
                    type: 'sightseeing',
                    location: 'Prague Castle',
                    note: '聖維特大教堂、黃金巷',
                    expenses: []
                },
                {
                    id: 'd7_a2',
                    time: '12:30',
                    description: '午餐：Kuchyň',
                    type: 'meal',
                    location: 'Kuchyň',
                    note: '城堡景觀餐廳',
                    expenses: []
                },
                {
                    id: 'd7_a3',
                    time: '14:30',
                    description: '舊城廣場',
                    type: 'sightseeing',
                    location: 'Old Town Square',
                    note: '天文鐘',
                    expenses: []
                },
                {
                    id: 'd7_a4',
                    time: '19:00',
                    description: '晚餐：Kantýna',
                    type: 'meal',
                    location: 'Kantýna',
                    note: '肉舖牛排館',
                    expenses: []
                }
            ]
        },
        {
            index: 7,
            date: "2026-04-05",
            city: "卡羅維瓦利",
            activities: [
                {
                    id: 'd8_a1',
                    time: '08:20',
                    description: '布拉格 ↔ 卡羅維瓦利 (KV)',
                    type: 'transport',
                    location: 'Prague <-> Karlovy Vary',
                    note: 'FlixBus 來回。',
                    expenses: [
                        { id: 'e_d8_1', amount: 5185, currency: 'TWD', category: '交通', description: 'FlixBus 來回', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd8_a2',
                    time: '11:00',
                    description: '溫泉迴廊體驗',
                    type: 'sightseeing',
                    location: 'Hot Spring Colonnade',
                    note: '買溫泉杯',
                    expenses: []
                },
                {
                    id: 'd8_a3',
                    time: '14:00',
                    description: '黛安娜觀景塔',
                    type: 'sightseeing',
                    location: 'Diana Observation Tower',
                    note: '',
                    expenses: []
                }
            ]
        },
        {
            index: 8,
            date: "2026-04-06",
            city: "維也納",
            activities: [
                {
                    id: 'd9_a1',
                    time: '12:37',
                    description: '布拉格 → 維也納',
                    type: 'transport',
                    location: 'Prague -> Vienna',
                    note: 'ÖBB 直達火車。',
                    expenses: [
                        { id: 'e_d9_1', amount: 8435, currency: 'TWD', category: '交通', description: 'ÖBB 直達火車', payer: '哥哥' }
                    ]
                },
                {
                    id: 'd9_a2',
                    time: '17:15',
                    description: '飯店 Check-in / 領回行李',
                    type: 'accommodation',
                    location: 'Prize by Radisson, Vienna City (無早餐)',
                    note: '💰 費用：TWD 8,517 (媽付錢) | ✅ 已預訂。\n【關鍵任務】 🧳 行李： 17:15 抵達飯店辦理入住，並領回 Day 2 寄放的 6 個大行李箱。',
                    expenses: []
                },
                {
                    id: 'd9_a3',
                    time: '18:00',
                    description: '最後採購',
                    type: 'shopping',
                    location: 'Vienna',
                    note: '🛍️ ToDo： 在布拉格 hl.n. 車站或維也納完成最後採購 (Botanicus/Manufaktura)。',
                    expenses: []
                },
                {
                    id: 'd9_a4',
                    time: '20:00',
                    description: '晚餐：Salm Bräu',
                    type: 'meal',
                    location: 'Salm Bräu',
                    note: '豬肋排與啤酒',
                    expenses: []
                }
            ]
        },
        {
            index: 9,
            date: "2026-04-07",
            city: "台北",
            activities: [
                {
                    id: 'd10_a1',
                    time: '08:00',
                    description: '辦理退房 / 前往機場',
                    type: 'transport',
                    location: 'Hotel -> VIE Airport',
                    note: '搭乘 RJX 前往機場 (費用已含在首日買的來回票中)。',
                    expenses: []
                },
                {
                    id: 'd10_a2',
                    time: '11:00',
                    description: '搭乘 CI64 返回台北',
                    type: 'flight',
                    location: 'VIE -> TPE',
                    note: '溫暖的家',
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
    currency: "TWD",
    timezone: "Europe/Vienna",
    currencies: [{ code: 'EUR', name: '歐元' }, { code: 'TWD', name: '新台幣' }, { code: 'CZK', name: '捷克克朗' }],
    familyMembers: ["爸爸", "媽媽", "哥哥", "可昕"],
    categories: ["餐飲", "門票", "交通", "住宿", "保險", "購物", "其他"]
};
