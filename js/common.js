/* ================================
   公共脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// 工具函数库
// ====================

const Utils = {
    // 格式化日期
    formatDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    },

    // 格式化时间
    formatTime(date = new Date()) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    // 获取星期
    getWeekday(date = new Date()) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekdays[date.getDay()];
    },

    // 本地存储操作
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('存储失败:', e);
                return false;
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('读取失败:', e);
                return null;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    },

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('复制失败:', err);
            return false;
        }
    },

    // 获取URL参数
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    // 动画滚动到元素
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    }
};

// ====================
// 农历算法
// ====================

const LunarCalendar = {
    // 农历数据（简化版）
    lunarInfo: [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
        0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540
    ],

    // 获取农历日期
    getLunarDate(date = new Date()) {
        // 简化的农历计算（实际应用需要完整算法）
        const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月',
                            '七月', '八月', '九月', '十月', '冬月', '腊月'];
        const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

        // 这里返回模拟数据，实际需要完整的农历转换算法
        const month = date.getMonth();
        const day = date.getDate() - 1;

        return `农历${lunarMonths[month % 12]}${lunarDays[day % 30]}`;
    },

    // 获取节气
    getSolarTerm(date = new Date()) {
        const solarTerms = [
            '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
            '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
            '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
            '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
        ];

        // 简化计算（实际需要精确的节气算法）
        const month = date.getMonth();
        const day = date.getDate();

        // 每月大约有两个节气
        const termIndex = month * 2 + (day > 15 ? 1 : 0);
        return solarTerms[termIndex % 24];
    },

    // 获取生肖
    getZodiac(year) {
        const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        return zodiacs[(year - 4) % 12];
    }
};

// ====================
// 八字五行计算
// ====================

const BaZi = {
    // 天干
    tianGan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],

    // 地支
    diZhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],

    // 五行
    wuXing: ['木', '火', '土', '金', '水'],

    // 时辰
    shiChen: [
        {name: '子时', time: '23:00-01:00', value: '子'},
        {name: '丑时', time: '01:00-03:00', value: '丑'},
        {name: '寅时', time: '03:00-05:00', value: '寅'},
        {name: '卯时', time: '05:00-07:00', value: '卯'},
        {name: '辰时', time: '07:00-09:00', value: '辰'},
        {name: '巳时', time: '09:00-11:00', value: '巳'},
        {name: '午时', time: '11:00-13:00', value: '午'},
        {name: '未时', time: '13:00-15:00', value: '未'},
        {name: '申时', time: '15:00-17:00', value: '申'},
        {name: '酉时', time: '17:00-19:00', value: '酉'},
        {name: '戌时', time: '19:00-21:00', value: '戌'},
        {name: '亥时', time: '21:00-23:00', value: '亥'}
    ],

    // 获取当前时辰
    getCurrentShiChen() {
        const hour = new Date().getHours();
        const index = Math.floor((hour + 1) / 2) % 12;
        return this.shiChen[index];
    },

    // 计算天干地支（简化版）
    calculateGanZhi(date) {
        const year = date.getFullYear();
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;

        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            text: this.tianGan[ganIndex] + this.diZhi[zhiIndex]
        };
    },

    // 计算五行属性（简化版）
    calculateWuXing(date) {
        const elements = {
            木: Math.random() * 100,
            火: Math.random() * 100,
            土: Math.random() * 100,
            金: Math.random() * 100,
            水: Math.random() * 100
        };

        // 找出最强的五行
        let maxElement = '木';
        let maxValue = 0;

        for (let [element, value] of Object.entries(elements)) {
            if (value > maxValue) {
                maxValue = value;
                maxElement = element;
            }
        }

        return {
            dominant: maxElement,
            elements: elements
        };
    }
};

// ====================
// 黄历数据
// ====================

const Almanac = {
    // 获取今日宜忌（模拟数据）
    getTodayAlmanac() {
        const yiList = ['开市', '纳采', '祈福', '出行', '嫁娶', '移徙', '安床', '作灶', '求嗣', '解除'];
        const jiList = ['动土', '安葬', '开仓', '置产', '纳畜', '伐木', '上梁', '破土', '修造', '入宅'];

        // 随机选择几个
        const yi = this.randomSelect(yiList, 4);
        const ji = this.randomSelect(jiList, 4);

        return {
            yi: yi,
            ji: ji,
            jishi: this.getJiShi(),
            xiongshi: this.getXiongShi()
        };
    },

    // 获取吉时
    getJiShi() {
        const hours = ['子时', '寅时', '辰时', '午时', '申时', '戌时'];
        return this.randomSelect(hours, 3);
    },

    // 获取凶时
    getXiongShi() {
        const hours = ['丑时', '卯时', '巳时', '未时', '酉时', '亥时'];
        return this.randomSelect(hours, 3);
    },

    // 随机选择
    randomSelect(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // 获取今日运势
    getTodayFortune() {
        return {
            overall: Math.floor(Math.random() * 5) + 1,
            career: Math.floor(Math.random() * 100),
            love: Math.floor(Math.random() * 100),
            wealth: Math.floor(Math.random() * 100),
            health: Math.floor(Math.random() * 100),
            lucky: {
                color: ['蓝色', '红色', '绿色', '金色', '紫色'][Math.floor(Math.random() * 5)],
                number: Math.floor(Math.random() * 10),
                direction: ['东', '南', '西', '北', '东南', '东北', '西南', '西北'][Math.floor(Math.random() * 8)]
            }
        };
    }
};

// ====================
// 全局配置
// ====================

const Config = {
    // API配置
    api: {
        baseUrl: '',
        timeout: 10000
    },

    // 主题配置
    theme: {
        mode: 'light', // light | dark
        primaryColor: '#8B00FF'
    },

    // 用户配置
    user: {
        isLoggedIn: false,
        profile: null
    },

    // 应用配置
    app: {
        version: '1.0.0',
        name: '张大师智慧生活导航系统'
    }
};

// ====================
// 初始化
// ====================

const App = {
    // 初始化应用
    init() {
        this.loadUserData();
        this.initTheme();
        this.bindGlobalEvents();
    },

    // 加载用户数据
    loadUserData() {
        const userData = Utils.storage.get('userData');
        if (userData) {
            Config.user.profile = userData;
            Config.user.isLoggedIn = true;
        }
    },

    // 初始化主题
    initTheme() {
        const savedTheme = Utils.storage.get('theme');
        if (savedTheme) {
            Config.theme = savedTheme;
            this.applyTheme();
        }
    },

    // 应用主题
    applyTheme() {
        document.documentElement.setAttribute('data-theme', Config.theme.mode);
    },

    // 绑定全局事件
    bindGlobalEvents() {
        // 窗口大小改变
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 200));

        // 滚动事件
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));
    },

    // 处理窗口大小改变
    handleResize() {
        // 可以在这里处理响应式逻辑
    },

    // 处理滚动
    handleScroll() {
        // 可以在这里处理滚动相关逻辑
    }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}