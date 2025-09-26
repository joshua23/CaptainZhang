/**
 * 择吉日历功能 - 张大师智慧生活导航系统
 */

// 农历数据和转换
const lunarInfo = {
    monthNames: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    dayNames: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],
    tianGan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    diZhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    zodiac: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    solarTerms: ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
                 '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
                 '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至']
};

// 宜忌数据库
const yijiDatabase = {
    yi: [
        '祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木', '出火', '入宅', '移徙',
        '安床', '拆卸', '修造', '动土', '造畜稠', '入殓', '破土', '启钻', '安葬', '谢土',
        '立碑', '修坟', '开市', '交易', '立券', '纳财', '纳畜', '牧养', '开仓', '入学',
        '裁衣', '冠笄', '嫁娶', '纳婿', '沐浴', '剃头', '整容', '修饰', '扫舍', '理发'
    ],
    ji: [
        '诸事不宜', '开市', '入宅', '安门', '安床', '结网', '冠笄', '造屋', '动土', '起基',
        '上梁', '竖柱', '开仓', '出货', '纳财', '出行', '移徙', '安葬', '启钻', '修坟',
        '立碑', '嫁娶', '纳婿', '祭祀', '祈福', '求嗣', '解除', '伐木', '栽种', '放水',
        '开渠', '安碓', '修造', '拆卸', '求医', '治病', '开池', '塞穴', '畋猎', '捕鱼'
    ]
};

// 全局变量
let currentDate = new Date();
let selectedDate = null;
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// 初始化日历
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    updateTodayAlmanac();
    renderCalendar();
});

// 初始化日历
function initCalendar() {
    // 设置今日日期
    updateCurrentDate();
}

// 更新当前日期显示
function updateCurrentDate() {
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
    const todayDateEl = document.getElementById('todayDate');
    if (todayDateEl) {
        todayDateEl.textContent = dateStr;
    }
}

// 更新今日黄历
function updateTodayAlmanac() {
    const today = new Date();

    // 获取农历信息（模拟）
    const lunarData = getLunarDate(today);
    document.getElementById('todayLunar').textContent = `${lunarData.year} ${lunarData.month}${lunarData.day}`;

    // 更新节气信息
    const solarTerm = getSolarTerm(today);
    document.getElementById('solarTerm').textContent = solarTerm.name;

    // 生成今日宜忌
    generateTodayYiji();
}

// 渲染日历
function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // 更新月份标题
    document.getElementById('currentMonth').textContent = `${currentYear}年${currentMonth + 1}月`;
    const lunarMonth = getLunarMonth(currentYear, currentMonth);
    document.getElementById('currentLunarMonth').textContent = lunarMonth;

    // 获取本月第一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);

    const firstDayWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    // 填充上月日期
    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const date = prevLastDate - i;
        const cell = createDayCell(new Date(currentYear, currentMonth - 1, date), true);
        calendarDays.appendChild(cell);
    }

    // 填充本月日期
    for (let date = 1; date <= lastDate; date++) {
        const currentDate = new Date(currentYear, currentMonth, date);
        const cell = createDayCell(currentDate, false);
        calendarDays.appendChild(cell);
    }

    // 填充下月日期
    const remainingCells = 42 - (firstDayWeek + lastDate);
    for (let date = 1; date <= remainingCells; date++) {
        const cell = createDayCell(new Date(currentYear, currentMonth + 1, date), true);
        calendarDays.appendChild(cell);
    }
}

// 创建日期单元格
function createDayCell(date, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    if (isOtherMonth) {
        cell.classList.add('other-month');
    }

    // 检查是否是今天
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        cell.classList.add('today');
    }

    // 检查是否是吉日（模拟）
    if (!isOtherMonth && isAuspiciousDate(date)) {
        cell.classList.add('auspicious');
    }

    // 获取农历
    const lunarData = getLunarDate(date);

    // 添加内容
    const solarDiv = document.createElement('div');
    solarDiv.className = 'day-solar';
    solarDiv.textContent = date.getDate();

    const lunarDiv = document.createElement('div');
    lunarDiv.className = 'day-lunar';
    lunarDiv.textContent = lunarData.day === '初一' ? lunarData.month : lunarData.day;

    cell.appendChild(solarDiv);
    cell.appendChild(lunarDiv);

    // 添加点击事件
    if (!isOtherMonth) {
        cell.addEventListener('click', () => selectDate(date));
    }

    return cell;
}

// 选择日期
function selectDate(date) {
    selectedDate = date;

    // 移除之前的选中状态
    document.querySelectorAll('.day-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });

    // 添加选中状态
    const cells = document.querySelectorAll('.day-cell');
    cells.forEach(cell => {
        const solarText = cell.querySelector('.day-solar').textContent;
        if (parseInt(solarText) === date.getDate() && !cell.classList.contains('other-month')) {
            cell.classList.add('selected');
        }
    });

    // 显示日期详情
    showDateDetail(date);
}

// 显示日期详情
function showDateDetail(date) {
    const detailSection = document.getElementById('dateDetail');
    detailSection.style.display = 'block';

    // 更新公历
    document.getElementById('detailSolar').textContent =
        `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    // 更新农历
    const lunarData = getLunarDate(date);
    document.getElementById('detailLunar').textContent =
        `${lunarData.month}${lunarData.day}`;

    // 更新干支
    const ganzhi = getGanZhi(date);
    document.getElementById('detailGanzhi').textContent = ganzhi;

    // 更新五行
    document.getElementById('detailWuxing').textContent = getWuxing(date);

    // 更新生肖
    document.getElementById('detailZodiac').textContent = getZodiac(date);

    // 更新节气
    const solarTerm = getSolarTerm(date);
    document.getElementById('detailSolarTerm').textContent = solarTerm.name;

    // 生成宜忌
    generateYiji(date);

    // 生成吉时
    generateJishi(date);

    // 滚动到详情
    detailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 生成宜忌
function generateYiji(date) {
    const yiList = document.getElementById('yiList');
    const jiList = document.getElementById('jiList');

    yiList.innerHTML = '';
    jiList.innerHTML = '';

    // 模拟生成宜忌（实际应根据黄历算法）
    const seed = date.getDate() + date.getMonth() * 31;
    const yiCount = 3 + (seed % 4);
    const jiCount = 2 + (seed % 3);

    // 生成宜
    for (let i = 0; i < yiCount; i++) {
        const index = (seed + i * 7) % yijiDatabase.yi.length;
        const span = document.createElement('span');
        span.className = 'yiji-item';
        span.textContent = yijiDatabase.yi[index];
        yiList.appendChild(span);
    }

    // 生成忌
    for (let i = 0; i < jiCount; i++) {
        const index = (seed + i * 13) % yijiDatabase.ji.length;
        const span = document.createElement('span');
        span.className = 'yiji-item';
        span.textContent = yijiDatabase.ji[index];
        jiList.appendChild(span);
    }
}

// 生成今日宜忌
function generateTodayYiji() {
    const yiTags = document.querySelector('.today-yiji .yi-section .yiji-tags');
    const jiTags = document.querySelector('.today-yiji .ji-section .yiji-tags');

    if (yiTags && jiTags) {
        const today = new Date();
        const seed = today.getDate() + today.getMonth() * 31;

        yiTags.innerHTML = '';
        jiTags.innerHTML = '';

        // 生成宜
        for (let i = 0; i < 5; i++) {
            const index = (seed + i * 7) % yijiDatabase.yi.length;
            const span = document.createElement('span');
            span.className = 'tag-yi';
            span.textContent = yijiDatabase.yi[index];
            yiTags.appendChild(span);
        }

        // 生成忌
        for (let i = 0; i < 5; i++) {
            const index = (seed + i * 13) % yijiDatabase.ji.length;
            const span = document.createElement('span');
            span.className = 'tag-ji';
            span.textContent = yijiDatabase.ji[index];
            jiTags.appendChild(span);
        }
    }
}

// 生成吉时
function generateJishi(date) {
    const jishiGrid = document.getElementById('jishiGrid');
    jishiGrid.innerHTML = '';

    const shichen = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时',
                     '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    const timeRanges = ['23-01', '01-03', '03-05', '05-07', '07-09', '09-11',
                        '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'];

    // 模拟吉时（实际应根据黄历算法）
    const seed = date.getDate();
    const goodHours = [
        (seed * 3) % 12,
        (seed * 5 + 3) % 12,
        (seed * 7 + 6) % 12,
        (seed * 11 + 9) % 12
    ];

    for (let i = 0; i < 12; i++) {
        const div = document.createElement('div');
        div.className = 'jishi-item';
        if (goodHours.includes(i)) {
            div.classList.add('good');
        }
        div.innerHTML = `
            <div>${shichen[i]}</div>
            <div style="font-size: 0.625rem;">${timeRanges[i]}</div>
        `;
        jishiGrid.appendChild(div);
    }
}

// 获取农历日期（简化模拟）
function getLunarDate(date) {
    // 这里应该使用真实的农历转换算法
    // 现在使用简单的模拟
    const year = lunarInfo.tianGan[(date.getFullYear() - 4) % 10] +
                 lunarInfo.diZhi[(date.getFullYear() - 4) % 12] + '年';
    const monthIndex = (date.getMonth() + 10) % 12;
    const month = lunarInfo.monthNames[monthIndex] + '月';
    const dayIndex = (date.getDate() - 1) % 30;
    const day = lunarInfo.dayNames[dayIndex];

    return { year, month, day };
}

// 获取农历月份
function getLunarMonth(year, month) {
    const tianGanIndex = (year - 4) % 10;
    const diZhiIndex = (year - 4) % 12;
    const monthName = lunarInfo.monthNames[(month + 10) % 12];

    return `${lunarInfo.tianGan[tianGanIndex]}${lunarInfo.diZhi[diZhiIndex]}年 ${monthName}月`;
}

// 获取干支
function getGanZhi(date) {
    const year = date.getFullYear();
    const tianGanIndex = (year - 4) % 10;
    const diZhiIndex = (year - 4) % 12;

    const month = date.getMonth();
    const monthTianGan = lunarInfo.tianGan[(tianGanIndex * 2 + month) % 10];
    const monthDiZhi = lunarInfo.diZhi[(month + 2) % 12];

    const day = date.getDate();
    const dayTianGan = lunarInfo.tianGan[day % 10];
    const dayDiZhi = lunarInfo.diZhi[day % 12];

    return `${lunarInfo.tianGan[tianGanIndex]}${lunarInfo.diZhi[diZhiIndex]}年 ` +
           `${monthTianGan}${monthDiZhi}月 ${dayTianGan}${dayDiZhi}日`;
}

// 获取五行
function getWuxing(date) {
    const wuxing = ['金', '木', '水', '火', '土'];
    const index = (date.getDate() + date.getMonth() * 31) % 5;
    const index2 = (date.getDate() + date.getMonth() * 17) % 5;
    return `${wuxing[index]}${wuxing[index2]}`;
}

// 获取生肖
function getZodiac(date) {
    const year = date.getFullYear();
    return lunarInfo.zodiac[(year - 4) % 12];
}

// 获取节气
function getSolarTerm(date) {
    // 简化的节气计算（实际应使用精确算法）
    const month = date.getMonth();
    const day = date.getDate();
    const termIndex = month * 2 + (day > 15 ? 1 : 0);

    return {
        name: lunarInfo.solarTerms[termIndex % 24],
        days: Math.abs(15 - day)
    };
}

// 检查是否是吉日
function isAuspiciousDate(date) {
    // 简单的模拟算法
    const seed = date.getDate() + date.getMonth() * 31;
    return seed % 3 === 0 || seed % 7 === 0;
}

// 切换月份
function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

// 回到今天
function goToToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();

    // 选中今天
    selectDate(today);
}

// 查找吉日
function findAuspiciousDate(eventType) {
    const auspiciousDatesSection = document.getElementById('auspiciousDates');
    const recommendedDates = document.getElementById('recommendedDates');

    auspiciousDatesSection.style.display = 'block';
    recommendedDates.innerHTML = '';

    // 事件类型对应的宜事项
    const eventYiMap = {
        wedding: ['嫁娶', '纳婿', '冠笄', '祭祀'],
        moving: ['入宅', '移徙', '安床', '修造'],
        opening: ['开市', '开业', '交易', '立券'],
        travel: ['出行', '出火', '解除'],
        contract: ['立券', '交易', '纳财'],
        meeting: ['会友', '祈福', '求嗣'],
        decoration: ['修造', '动土', '拆卸', '起基'],
        blessing: ['祭祀', '祈福', '求嗣', '开光']
    };

    const requiredYi = eventYiMap[eventType] || [];
    const startDate = new Date();
    const recommendations = [];

    // 查找未来30天内的吉日
    for (let i = 1; i <= 30 && recommendations.length < 5; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + i);

        if (isGoodDateForEvent(checkDate, requiredYi)) {
            recommendations.push(checkDate);
        }
    }

    // 显示推荐日期
    recommendations.forEach(date => {
        const lunarData = getLunarDate(date);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        const item = document.createElement('div');
        item.className = 'rec-date-item';
        item.innerHTML = `
            <div class="rec-date-header">
                <span class="rec-date-solar">${date.getMonth() + 1}月${date.getDate()}日 周${weekDays[date.getDay()]}</span>
                <span class="rec-date-lunar">${lunarData.month}${lunarData.day}</span>
            </div>
            <div class="rec-date-yiji">
                宜：${requiredYi.slice(0, 3).join('、')}
            </div>
        `;

        item.addEventListener('click', () => {
            currentYear = date.getFullYear();
            currentMonth = date.getMonth();
            renderCalendar();
            selectDate(date);
        });

        recommendedDates.appendChild(item);
    });

    // 滚动到推荐区域
    auspiciousDatesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 检查日期是否适合特定事项
function isGoodDateForEvent(date, requiredYi) {
    // 简化的判断逻辑
    const seed = date.getDate() + date.getMonth() * 31;
    return seed % 3 === 0 || seed % 5 === 0;
}

// 分享日期
function shareDate() {
    if (!selectedDate) {
        alert('请先选择一个日期');
        return;
    }

    const lunarData = getLunarDate(selectedDate);
    const text = `【张大师择吉日历】\n` +
                 `公历：${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日\n` +
                 `农历：${lunarData.year} ${lunarData.month}${lunarData.day}\n` +
                 `此日宜事，诸事顺遂！`;

    // 尝试使用Web Share API
    if (navigator.share) {
        navigator.share({
            title: '张大师择吉日历',
            text: text
        }).catch(err => console.log('分享失败', err));
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            alert('日期信息已复制到剪贴板');
        });
    }
}