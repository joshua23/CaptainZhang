/* ================================
   公共脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// 表单验证器
// ====================

class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.messages = {};
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                if (this.onSubmit) {
                    this.onSubmit();
                }
            }
        });
    }

    addRule(fieldName, rules, messages) {
        this.rules[fieldName] = rules;
        this.messages[fieldName] = messages || {};
    }

    validate() {
        let isValid = true;

        // 清除之前的错误提示
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());

        for (let fieldName in this.rules) {
            const field = this.form[fieldName];
            const rules = this.rules[fieldName];
            const messages = this.messages[fieldName];

            if (rules.required && !field.value) {
                this.showError(field, messages.required || '此字段必填');
                isValid = false;
            }

            if (rules.minLength && field.value.length < rules.minLength) {
                this.showError(field, messages.minLength || `最少需要${rules.minLength}个字符`);
                isValid = false;
            }
        }

        return isValid;
    }

    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#C62828';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }
}

// ====================
// 农历日历工具
// ====================

const LunarCalendar = {
    getZodiac(year) {
        const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        return zodiac[(year - 4) % 12];
    },

    getLunarDate(date) {
        // 简化的农历日期（实际需要农历算法）
        const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
        const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

        const month = date.getMonth();
        const day = date.getDate() - 1;

        return lunarMonths[month] + '月' + lunarDays[day % 30];
    },

    getSolarTerm(date) {
        const solarTerms = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
                           '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
                           '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
                           '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'];

        const month = date.getMonth();
        const day = date.getDate();

        // 简化算法，每月两个节气
        const termIndex = month * 2 + (day > 15 ? 1 : 0);
        return solarTerms[termIndex % 24];
    }
};

// ====================
// 八字工具
// ====================

const BaZi = {
    shiChen: [
        { value: '子', name: '子时', time: '23:00-01:00' },
        { value: '丑', name: '丑时', time: '01:00-03:00' },
        { value: '寅', name: '寅时', time: '03:00-05:00' },
        { value: '卯', name: '卯时', time: '05:00-07:00' },
        { value: '辰', name: '辰时', time: '07:00-09:00' },
        { value: '巳', name: '巳时', time: '09:00-11:00' },
        { value: '午', name: '午时', time: '11:00-13:00' },
        { value: '未', name: '未时', time: '13:00-15:00' },
        { value: '申', name: '申时', time: '15:00-17:00' },
        { value: '酉', name: '酉时', time: '17:00-19:00' },
        { value: '戌', name: '戌时', time: '19:00-21:00' },
        { value: '亥', name: '亥时', time: '21:00-23:00' }
    ],

    getCurrentShiChen() {
        const hour = new Date().getHours();
        const index = Math.floor(((hour + 1) % 24) / 2);
        return this.shiChen[index];
    },

    calculateWuXing(date) {
        // 简化的五行计算
        return {
            metal: Math.floor(Math.random() * 30) + 10,
            wood: Math.floor(Math.random() * 30) + 10,
            water: Math.floor(Math.random() * 30) + 10,
            fire: Math.floor(Math.random() * 30) + 10,
            earth: Math.floor(Math.random() * 30) + 10
        };
    },

    calculateGanZhi(date) {
        const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

        const year = date.getFullYear();
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;

        return tianGan[ganIndex] + diZhi[zhiIndex] + '年';
    }
};

// ====================
// 黄历工具
// ====================

const Almanac = {
    getTodayFortune() {
        // 模拟今日运势
        const seed = new Date().getDate();

        return {
            overall: 3 + (seed % 3),  // 3-5星
            lucky: {
                direction: ['东南', '正东', '东北', '正南'][seed % 4],
                color: ['红色', '蓝色', '绿色', '金色'][seed % 4],
                number: [3, 6, 8, 9][seed % 4]
            },
            suitable: ['祈福', '出行', '签约', '会友'],
            avoid: ['动土', '安葬', '装修']
        };
    }
};

// ====================
// 配置
// ====================

const Config = {
    user: {
        isLoggedIn: false,
        profile: null
    }
};

// ====================
// UI组件
// ====================

const UIComponents = {
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // 添加到页面
        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    showModal(title, content, onConfirm) {
        // 创建模态框背景
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        `;

        modal.innerHTML = `
            <h2 style="margin-bottom: 1.5rem; color: #212121;">${title}</h2>
            <div style="margin-bottom: 2rem;">${content}</div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" id="modalConfirm">确定</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 确定按钮事件
        const confirmBtn = document.getElementById('modalConfirm');
        confirmBtn.onclick = () => {
            if (onConfirm) onConfirm();
            overlay.remove();
        };

        // 点击背景关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };
    }
};

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

// 全局配置已在上方定义

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