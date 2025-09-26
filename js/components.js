/* ================================
   组件脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// UI组件类
// ====================

class UIComponents {
    // 显示通知
    static showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} show`;
        notification.innerHTML = `
            <div class="notification-title">${type === 'success' ? '成功' : type === 'error' ? '错误' : '提示'}</div>
            <div class="notification-message">${message}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // 显示模态框
    static showModal(title, content, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="modalCancel">取消</button>
                    <button class="btn btn-primary" id="modalConfirm">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加显示类
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // 绑定事件
        modal.querySelector('.modal-close').onclick = () => this.closeModal(modal);
        modal.querySelector('#modalCancel').onclick = () => this.closeModal(modal);
        modal.querySelector('#modalConfirm').onclick = () => {
            if (onConfirm) onConfirm();
            this.closeModal(modal);
        };

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        };
    }

    // 关闭模态框
    static closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    // 创建加载动画
    static showLoading(container) {
        const loading = document.createElement('div');
        loading.className = 'loading-container';
        loading.innerHTML = '<div class="loading"></div>';

        if (container) {
            container.appendChild(loading);
        } else {
            document.body.appendChild(loading);
        }

        return loading;
    }

    // 移除加载动画
    static hideLoading(loading) {
        if (loading && loading.parentNode) {
            loading.remove();
        }
    }

    // 创建工具提示
    static createTooltip(element, text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip';

        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltip-text';
        tooltipText.textContent = text;

        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(tooltipText);
    }

    // 创建进度条
    static createProgress(value, max = 100) {
        const progress = document.createElement('div');
        progress.className = 'progress';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${(value / max) * 100}%`;

        progress.appendChild(progressBar);
        return progress;
    }

    // 创建标签
    static createTag(text, type = 'default') {
        const tag = document.createElement('span');
        tag.className = `tag tag-${type}`;
        tag.textContent = text;
        return tag;
    }
}

// ====================
// 运势仪表盘组件
// ====================

class FortuneDashboard {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const html = `
            <div class="fortune-dashboard">
                <div class="fortune-circle">
                    <div class="fortune-center">
                        <div class="fortune-score">${this.data.overall}/5</div>
                        <div class="fortune-label">综合运势</div>
                    </div>
                </div>
                <div class="fortune-details">
                    ${this.renderBar('事业', this.data.career)}
                    ${this.renderBar('感情', this.data.love)}
                    ${this.renderBar('财运', this.data.wealth)}
                    ${this.renderBar('健康', this.data.health)}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    renderBar(label, value) {
        return `
            <div class="fortune-bar">
                <span class="fortune-bar-label">${label}</span>
                <div class="fortune-bar-track">
                    <div class="fortune-bar-fill" style="width: ${value}%"></div>
                </div>
                <span class="fortune-bar-value">${value}%</span>
            </div>
        `;
    }

    update(data) {
        this.data = data;
        this.render();
    }
}

// ====================
// 黄历组件
// ====================

class AlmanacCard {
    constructor(container, date = new Date()) {
        this.container = container;
        this.date = date;
        this.init();
    }

    init() {
        this.almanacData = Almanac.getTodayAlmanac();
        this.render();
    }

    render() {
        const html = `
            <div class="almanac-card">
                <div class="almanac-header">
                    <div class="almanac-date">${Utils.formatDate(this.date)}</div>
                    <div class="almanac-lunar">${LunarCalendar.getLunarDate(this.date)}</div>
                </div>
                <div class="almanac-content">
                    <div class="almanac-row">
                        <div class="almanac-good">
                            <div class="almanac-title">宜</div>
                            <div class="almanac-items">
                                ${this.almanacData.yi.map(item =>
                                    `<span class="almanac-item">${item}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="almanac-bad">
                            <div class="almanac-title">忌</div>
                            <div class="almanac-items">
                                ${this.almanacData.ji.map(item =>
                                    `<span class="almanac-item">${item}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }
}

// ====================
// 时辰组件
// ====================

class ShiChenWheel {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.currentShiChen = BaZi.getCurrentShiChen();
        this.render();
        this.startTimer();
    }

    render() {
        const html = `
            <div class="shichen-wheel">
                ${BaZi.shiChen.map((sc, index) => {
                    const rotation = (index * 30) - 90;
                    const isCurrent = sc.name === this.currentShiChen.name;

                    return `
                        <div class="shichen-item ${isCurrent ? 'shichen-current' : ''}"
                             style="transform: rotate(${rotation}deg)">
                            <div style="transform: rotate(-${rotation}deg)">
                                <div class="shichen-name">${sc.name}</div>
                                <div class="shichen-time">${sc.time}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        this.container.innerHTML = html;
    }

    startTimer() {
        // 每分钟更新一次
        setInterval(() => {
            const newShiChen = BaZi.getCurrentShiChen();
            if (newShiChen.name !== this.currentShiChen.name) {
                this.currentShiChen = newShiChen;
                this.render();
            }
        }, 60000);
    }
}

// ====================
// 日期选择器组件
// ====================

class DatePicker {
    constructor(input, options = {}) {
        this.input = input;
        this.options = {
            showLunar: true,
            showSolarTerm: true,
            ...options
        };
        this.init();
    }

    init() {
        this.input.addEventListener('focus', () => this.show());
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.hide(), 200);
        });
    }

    show() {
        if (this.picker) return;

        this.picker = document.createElement('div');
        this.picker.className = 'date-picker';
        this.picker.innerHTML = this.generateCalendar();

        const rect = this.input.getBoundingClientRect();
        this.picker.style.position = 'absolute';
        this.picker.style.top = `${rect.bottom + window.scrollY}px`;
        this.picker.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(this.picker);
        this.bindEvents();
    }

    hide() {
        if (this.picker) {
            this.picker.remove();
            this.picker = null;
        }
    }

    generateCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // 简化的日历生成
        return `
            <div class="date-picker-header">
                <button class="date-picker-prev">&lt;</button>
                <span class="date-picker-title">${year}年${month + 1}月</span>
                <button class="date-picker-next">&gt;</button>
            </div>
            <div class="date-picker-body">
                ${this.generateDays()}
            </div>
        `;
    }

    generateDays() {
        // 简化的日期生成
        let days = '';
        for (let i = 1; i <= 30; i++) {
            days += `<div class="date-picker-day" data-day="${i}">${i}</div>`;
        }
        return days;
    }

    bindEvents() {
        this.picker.querySelectorAll('.date-picker-day').forEach(day => {
            day.addEventListener('click', (e) => {
                const selectedDay = e.target.dataset.day;
                const now = new Date();
                this.input.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                this.hide();
            });
        });
    }
}

// ====================
// 表单验证组件
// ====================

class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.messages = {};
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onSubmit();
            }
        });

        // 实时验证
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    addRule(fieldName, rules, message) {
        this.rules[fieldName] = rules;
        this.messages[fieldName] = message;
    }

    validate() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const name = field.name;
        const value = field.value.trim();
        const rules = this.rules[name];

        if (!rules) return true;

        // 必填验证
        if (rules.required && !value) {
            this.showError(field, this.messages[name]?.required || '此字段必填');
            return false;
        }

        // 最小长度验证
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(field, this.messages[name]?.minLength || `最少${rules.minLength}个字符`);
            return false;
        }

        // 邮箱验证
        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.showError(field, this.messages[name]?.email || '请输入有效的邮箱地址');
            return false;
        }

        // 手机号验证
        if (rules.phone && !/^1[3-9]\d{9}$/.test(value)) {
            this.showError(field, this.messages[name]?.phone || '请输入有效的手机号');
            return false;
        }

        this.clearError(field);
        return true;
    }

    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            // 移除已有的错误信息
            const existingError = formGroup.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }

            // 添加错误信息
            const error = document.createElement('div');
            error.className = 'form-error';
            error.textContent = message;
            formGroup.appendChild(error);

            // 添加错误样式
            field.classList.add('error');
        }
    }

    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const error = formGroup.querySelector('.form-error');
            if (error) {
                error.remove();
            }
            field.classList.remove('error');
        }
    }

    onSubmit() {
        // 可以被重写
        console.log('表单验证通过');
    }
}

// ====================
// 标签页组件
// ====================

class Tabs {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.tabs = this.container.querySelectorAll('.tab-item');
        this.contents = this.container.querySelectorAll('.tab-content');

        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });

        // 激活第一个标签
        this.switchTab(0);
    }

    switchTab(index) {
        // 更新标签状态
        this.tabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // 更新内容显示
        this.contents.forEach((content, i) => {
            if (i === index) {
                content.style.display = 'block';
                content.classList.add('fade-in');
            } else {
                content.style.display = 'none';
            }
        });
    }
}

// ====================
// 懒加载组件
// ====================

class LazyLoad {
    constructor(selector = 'img[data-src]') {
        this.images = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            this.loadImages();
        }
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => this.observer.observe(img));
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}