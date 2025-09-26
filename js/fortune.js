/* ================================
   今日运势页面脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// 页面初始化
// ====================

document.addEventListener('DOMContentLoaded', function() {
    // 更新日期时间
    updateDateTime();

    // 加载今日运势
    loadTodayFortune();

    // 初始化黄历卡片
    initAlmanacCard();

    // 初始化时辰显示
    initShiChenDisplay();

    // 加载个性化建议
    loadPersonalizedAdvice();

    // 启动定时更新
    startAutoUpdate();
});

// ====================
// 更新日期时间
// ====================

function updateDateTime() {
    const updateDisplay = () => {
        const now = new Date();

        // 更新顶部时间
        const dateTimeEl = document.getElementById('currentDateTime');
        if (dateTimeEl) {
            dateTimeEl.textContent = `${Utils.formatDate(now)} ${Utils.formatTime(now)}`;
        }

        // 更新时辰
        const shiChenEl = document.getElementById('currentShiChen');
        if (shiChenEl) {
            const currentShiChen = BaZi.getCurrentShiChen();
            shiChenEl.textContent = `${currentShiChen.name}`;
        }

        // 更新日期卡片
        updateDateCard(now);
    };

    // 立即更新
    updateDisplay();

    // 每分钟更新
    setInterval(updateDisplay, 60000);
}

// ====================
// 更新日期卡片
// ====================

function updateDateCard(date) {
    // 公历日期
    const solarDateEl = document.getElementById('solarDate');
    if (solarDateEl) {
        solarDateEl.textContent = Utils.formatDate(date);
    }

    // 星期
    const weekdayEl = document.getElementById('weekday');
    if (weekdayEl) {
        weekdayEl.textContent = Utils.getWeekday(date);
    }

    // 农历日期
    const lunarDateEl = document.getElementById('lunarDate');
    if (lunarDateEl) {
        lunarDateEl.textContent = LunarCalendar.getLunarDate(date);
    }

    // 节气
    const solarTermEl = document.getElementById('solarTerm');
    if (solarTermEl) {
        solarTermEl.textContent = LunarCalendar.getSolarTerm(date);
    }

    // 干支
    const ganzhiEl = document.getElementById('ganzhiDate');
    if (ganzhiEl) {
        const ganzhi = BaZi.calculateGanZhi(date);
        ganzhiEl.textContent = `${ganzhi.text}年 ${getMonthGanZhi(date)}月 ${getDayGanZhi(date)}日`;
    }
}

// ====================
// 获取月干支（模拟）
// ====================

function getMonthGanZhi(date) {
    const tianGan = BaZi.tianGan;
    const diZhi = BaZi.diZhi;
    const month = date.getMonth();
    return tianGan[month % 10] + diZhi[month];
}

// ====================
// 获取日干支（模拟）
// ====================

function getDayGanZhi(date) {
    const tianGan = BaZi.tianGan;
    const diZhi = BaZi.diZhi;
    const day = date.getDate();
    return tianGan[day % 10] + diZhi[day % 12];
}

// ====================
// 加载今日运势
// ====================

function loadTodayFortune() {
    // 获取运势数据
    const fortune = Almanac.getTodayFortune();

    // 创建运势仪表盘
    const dashboardContainer = document.getElementById('fortuneDashboard');
    if (dashboardContainer) {
        new FortuneDashboard(dashboardContainer, fortune);
    }

    // 更新幸运元素
    updateLuckyElements(fortune);
}

// ====================
// 更新幸运元素
// ====================

function updateLuckyElements(fortune) {
    if (fortune.lucky) {
        // 幸运色
        const colorEl = document.getElementById('luckyColor');
        if (colorEl) {
            colorEl.textContent = fortune.lucky.color;
            colorEl.style.color = getColorCode(fortune.lucky.color);
        }

        // 幸运数字
        const numberEl = document.getElementById('luckyNumber');
        if (numberEl) {
            const numbers = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            ];
            numberEl.textContent = numbers.join(', ');
        }

        // 幸运方位
        const directionEl = document.getElementById('luckyDirection');
        if (directionEl) {
            directionEl.textContent = fortune.lucky.direction;
        }

        // 贵人生肖
        const zodiacEl = document.getElementById('luckyZodiac');
        if (zodiacEl) {
            const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
            const selected = [
                zodiacs[Math.floor(Math.random() * 12)],
                zodiacs[Math.floor(Math.random() * 12)]
            ];
            zodiacEl.textContent = selected.join('、');
        }
    }
}

// ====================
// 获取颜色代码
// ====================

function getColorCode(colorName) {
    const colors = {
        '红色': '#DC143C',
        '蓝色': '#4682B4',
        '绿色': '#32CD32',
        '金色': '#FFD700',
        '紫色': '#8B00FF',
        '黑色': '#000000',
        '白色': '#666666'
    };
    return colors[colorName] || '#8B00FF';
}

// ====================
// 初始化黄历卡片
// ====================

function initAlmanacCard() {
    const container = document.getElementById('almanacCard');
    if (container) {
        new AlmanacCard(container, new Date());
    }
}

// ====================
// 初始化时辰显示
// ====================

function initShiChenDisplay() {
    // 高亮当前时辰
    highlightCurrentShiChen();

    // 绑定点击事件
    document.querySelectorAll('.shichen-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            showShiChenDetail(this.dataset.time);
        });
    });

    // 每小时更新一次
    setInterval(highlightCurrentShiChen, 3600000);
}

// ====================
// 高亮当前时辰
// ====================

function highlightCurrentShiChen() {
    const currentShiChen = BaZi.getCurrentShiChen();

    document.querySelectorAll('.shichen-slot').forEach(slot => {
        slot.classList.remove('current');
        if (slot.dataset.time === currentShiChen.name) {
            slot.classList.add('current');
        }
    });
}

// ====================
// 显示时辰详情
// ====================

function showShiChenDetail(shiChenName) {
    const details = {
        '子时': '子时为一天之始，宜休息养神，不宜大动。',
        '丑时': '丑时肝经当令，宜深度睡眠，养肝血。',
        '寅时': '寅时肺经当令，宜深呼吸，清肺气。',
        '卯时': '卯时大肠经当令，宜排便，清肠道。',
        '辰时': '辰时胃经当令，宜进食，补充能量。',
        '巳时': '巳时脾经当令，宜工作学习，效率最高。',
        '午时': '午时心经当令，宜小憩，养心神。',
        '未时': '未时小肠经当令，宜午餐消化。',
        '申时': '申时膀胱经当令，宜多喝水，排毒素。',
        '酉时': '酉时肾经当令，宜进晚餐，补肾气。',
        '戌时': '戌时心包经当令，宜散步，护心脉。',
        '亥时': '亥时三焦经当令，宜安静，准备休息。'
    };

    const detail = details[shiChenName] || '';
    UIComponents.showNotification(detail, 'info', 3000);
}

// ====================
// 加载个性化建议
// ====================

function loadPersonalizedAdvice() {
    // 获取用户画像
    const userData = Utils.storage.get('userData');
    const profile = userData?.profile;

    // 基于用户画像生成建议（这里是模拟数据）
    generateCareerAdvice(profile);
    generateLoveAdvice(profile);
    generateWealthAdvice(profile);
    generateHealthAdvice(profile);
}

// ====================
// 生成事业建议
// ====================

function generateCareerAdvice(profile) {
    const advices = [
        '今日宜谈判签约，上午9-11点为最佳时机，易获贵人相助。',
        '适合开展新项目，创意思维活跃，可大胆提出想法。',
        '工作中可能遇到小挑战，保持冷静，下午会有转机。',
        '团队合作运势佳，多与同事交流可获得意外收获。',
        '适合处理文书工作，细心检查可避免失误。'
    ];

    const careerEl = document.getElementById('careerAdvice');
    if (careerEl) {
        careerEl.textContent = advices[Math.floor(Math.random() * advices.length)];
    }
}

// ====================
// 生成感情建议
// ====================

function generateLoveAdvice(profile) {
    const advices = [
        '桃花运旺盛，单身者有机会遇到心仪对象，已婚者宜增进感情。',
        '感情运平稳，适合约会或表白，真诚相待可获得好结果。',
        '注意沟通方式，避免因小事产生误会，多些理解和包容。',
        '适合安排浪漫活动，为感情增添新鲜感。',
        '感情需要维护，今日宜主动关心对方，表达爱意。'
    ];

    const loveEl = document.getElementById('loveAdvice');
    if (loveEl) {
        loveEl.textContent = advices[Math.floor(Math.random() * advices.length)];
    }
}

// ====================
// 生成财运建议
// ====================

function generateWealthAdvice(profile) {
    const advices = [
        '偏财运较好，但不宜大额投资，小额尝试或有意外收获。',
        '正财运稳定，工作收入有保障，可考虑制定储蓄计划。',
        '投资需谨慎，避免冲动决策，多做市场调研。',
        '有贵人相助，可能获得额外收入机会，把握机遇。',
        '理财运势佳，适合学习投资知识，为未来做准备。'
    ];

    const wealthEl = document.getElementById('wealthAdvice');
    if (wealthEl) {
        wealthEl.textContent = advices[Math.floor(Math.random() * advices.length)];
    }
}

// ====================
// 生成健康建议
// ====================

function generateHealthAdvice(profile) {
    const advices = [
        '注意呼吸系统健康，多喝温水，适合进行轻度运动。',
        '肠胃较为敏感，饮食宜清淡，避免生冷刺激食物。',
        '精力充沛，可适当增加运动量，但注意不要过度。',
        '需要充足睡眠，早睡早起有助于恢复体力。',
        '心情愉悦有助健康，可听音乐或与朋友聊天放松。'
    ];

    const healthEl = document.getElementById('healthAdvice');
    if (healthEl) {
        healthEl.textContent = advices[Math.floor(Math.random() * advices.length)];
    }
}

// ====================
// 自动更新
// ====================

function startAutoUpdate() {
    // 每小时更新一次运势
    setInterval(() => {
        loadTodayFortune();
        loadPersonalizedAdvice();
    }, 3600000);

    // 每天0点刷新页面
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        location.reload();
    }, msUntilMidnight);
}