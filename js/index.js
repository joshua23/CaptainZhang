/* ================================
   首页脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// 页面初始化
// ====================

document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    createParticles();

    // 初始化交互效果
    initInteractiveEffects();

    // 更新日期时间
    updateDateTime();

    // 初始化每日智慧
    initDailyWisdom();

    // 检查用户状态
    checkUserStatus();
});

// ====================
// 创建粒子效果
// ====================

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';

        if (Math.random() > 0.5) {
            particle.style.background = 'linear-gradient(45deg, #8B00FF, #FFD700)';
        }

        particlesContainer.appendChild(particle);
    }
}

// ====================
// 交互效果
// ====================

function initInteractiveEffects() {
    // 大师形象发光效果
    const silhouette = document.querySelector('.master-silhouette');
    if (silhouette) {
        document.addEventListener('mousemove', (e) => {
            const rect = silhouette.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) +
                Math.pow(e.clientY - centerY, 2)
            );

            if (distance < 300) {
                const intensity = 1 - (distance / 300);
                silhouette.style.filter = `drop-shadow(0 0 ${30 + intensity * 20}px rgba(139, 0, 255, ${0.5 + intensity * 0.3}))`;
            }
        });
    }

    // 符号动画
    animateSymbols();

    // 点击效果
    const masterImage = document.querySelector('.master-image');
    if (masterImage) {
        masterImage.addEventListener('click', () => {
            masterImage.style.animation = 'none';
            void masterImage.offsetWidth;
            masterImage.style.animation = 'fadeInOut 4s ease-in-out infinite, pulse 0.5s ease-out';

            setTimeout(() => {
                masterImage.style.animation = 'fadeInOut 4s ease-in-out infinite';
            }, 500);
        });
    }
}

// ====================
// 符号动画
// ====================

function animateSymbols() {
    const symbols = document.querySelectorAll('.symbol');

    symbols.forEach((symbol, index) => {
        symbol.addEventListener('animationiteration', () => {
            const positions = [
                { top: '10%', left: '10%', right: 'auto', bottom: 'auto' },
                { top: '15%', right: '10%', left: 'auto', bottom: 'auto' },
                { bottom: '40%', left: '5%', top: 'auto', right: 'auto' },
                { bottom: '30%', right: '5%', top: 'auto', left: 'auto' },
                { bottom: '10%', left: '50%', top: 'auto', right: 'auto' }
            ];

            const randomPos = positions[Math.floor(Math.random() * positions.length)];
            Object.keys(randomPos).forEach(key => {
                symbol.style[key] = randomPos[key];
            });
        });
    });
}

// ====================
// 开始旅程
// ====================

function startJourney() {
    console.log('startJourney called');

    // 检查是否有用户数据
    const userData = Utils.storage.get('userData');
    console.log('userData:', userData);

    if (userData && userData.profile) {
        // 已有用户画像，直接进入主应用
        console.log('Has profile, entering main app');
        enterMainApp();
    } else {
        // 直接进入主应用（临时方案，让用户可以测试导航）
        console.log('No profile, entering main app anyway');
        enterMainApp();
        // 或者跳转到profile页面设置
        // window.location.href = 'profile.html';
    }
}

// ====================
// 显示登录
// ====================

function showLogin() {
    UIComponents.showModal('登录', `
        <div class="form-group">
            <label class="form-label">手机号/邮箱</label>
            <input type="text" class="form-input" placeholder="请输入手机号或邮箱">
        </div>
        <div class="form-group">
            <label class="form-label">密码</label>
            <input type="password" class="form-input" placeholder="请输入密码">
        </div>
        <div class="form-group">
            <label class="form-checkbox">
                <input type="checkbox">
                <span>记住我</span>
            </label>
        </div>
    `, () => {
        // 登录逻辑（模拟）
        UIComponents.showNotification('登录成功！', 'success');
        enterMainApp();
    });
}

// ====================
// 显示用户画像设置
// ====================

function showProfileSetup() {
    const content = `
        <form id="profileForm">
            <div class="form-group">
                <label class="form-label">姓名</label>
                <input type="text" name="name" class="form-input" placeholder="请输入您的姓名">
            </div>
            <div class="form-group">
                <label class="form-label">性别</label>
                <select name="gender" class="form-select">
                    <option value="male">男</option>
                    <option value="female">女</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">出生日期</label>
                <input type="date" name="birthDate" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">出生时间</label>
                <select name="birthTime" class="form-select">
                    ${BaZi.shiChen.map(sc =>
                        `<option value="${sc.value}">${sc.name} ${sc.time}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">出生地点</label>
                <input type="text" name="birthPlace" class="form-input" placeholder="省/市/区">
            </div>
        </form>
    `;

    UIComponents.showModal('设置您的画像', content, () => {
        const form = document.getElementById('profileForm');
        const formData = new FormData(form);

        const profile = {
            name: formData.get('name'),
            gender: formData.get('gender'),
            birthDate: formData.get('birthDate'),
            birthTime: formData.get('birthTime'),
            birthPlace: formData.get('birthPlace'),
            createdAt: new Date().toISOString()
        };

        // 计算五行属性
        const birthDate = new Date(profile.birthDate);
        profile.wuxing = BaZi.calculateWuXing(birthDate);
        profile.ganzhi = BaZi.calculateGanZhi(birthDate);
        profile.zodiac = LunarCalendar.getZodiac(birthDate.getFullYear());

        // 保存用户数据
        Utils.storage.set('userData', { profile });

        UIComponents.showNotification('画像设置成功！', 'success');
        enterMainApp();
    });
}

// ====================
// 进入主应用
// ====================

function enterMainApp() {
    console.log('enterMainApp called');

    const welcomePage = document.getElementById('welcomePage');
    const mainApp = document.getElementById('mainApp');

    console.log('welcomePage element:', welcomePage);
    console.log('mainApp element:', mainApp);

    if (welcomePage && mainApp) {
        console.log('Both elements found, transitioning...');
        // 淡出欢迎页
        welcomePage.style.opacity = '0';
        welcomePage.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            console.log('Hiding welcome page, showing main app');
            welcomePage.style.display = 'none';
            mainApp.style.display = 'block';

            // 初始化主应用
            initMainApp();
        }, 500);
    } else {
        console.error('Elements not found!', 'welcomePage:', !!welcomePage, 'mainApp:', !!mainApp);
        // 如果找不到元素，可能是因为页面结构不对，尝试直接跳转
        console.log('Attempting fallback navigation to index.html#main');
    }
}

// ====================
// 初始化主应用
// ====================

function initMainApp() {
    // 更新用户信息显示
    updateUserInfo();

    // 加载今日运势
    loadTodayFortune();

    // 启动定时更新
    startAutoUpdate();
}

// ====================
// 更新日期时间
// ====================

function updateDateTime() {
    const updateDisplay = () => {
        const now = new Date();

        // 更新当前日期
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) {
            currentDateEl.textContent = Utils.formatDate(now) + ' ' + Utils.getWeekday(now);
        }

        // 更新当前时间
        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) {
            const shiChen = BaZi.getCurrentShiChen();
            currentTimeEl.textContent = Utils.formatTime(now) + ' ' + shiChen.name;
        }

        // 更新日历显示
        const solarDateEl = document.getElementById('solarDate');
        if (solarDateEl) {
            solarDateEl.textContent = now.getDate();
        }

        const lunarDateEl = document.getElementById('lunarDate');
        if (lunarDateEl) {
            lunarDateEl.textContent = LunarCalendar.getLunarDate(now);
        }

        const solarTermEl = document.getElementById('solarTerm');
        if (solarTermEl) {
            solarTermEl.textContent = LunarCalendar.getSolarTerm(now);
        }
    };

    // 立即更新一次
    updateDisplay();

    // 每分钟更新
    setInterval(updateDisplay, 60000);
}

// ====================
// 更新用户信息
// ====================

function updateUserInfo() {
    const userData = Utils.storage.get('userData');
    if (userData && userData.profile) {
        // 可以在这里更新页面上的用户信息显示
        console.log('用户画像已加载:', userData.profile);
    }
}

// ====================
// 加载今日运势
// ====================

function loadTodayFortune() {
    const fortune = Almanac.getTodayFortune();

    // 更新运势显示
    const fortuneItems = document.querySelectorAll('.fortune-item');
    fortuneItems.forEach(item => {
        const label = item.querySelector('.fortune-label');
        if (label && label.textContent === '今日运势') {
            const stars = item.querySelector('.fortune-stars');
            if (stars) {
                let starDisplay = '';
                for (let i = 0; i < 5; i++) {
                    starDisplay += i < fortune.overall ? '★' : '☆';
                }
                stars.textContent = starDisplay;
            }
        }
    });

    // 更新幸运元素
    if (fortune.lucky) {
        const directionEl = document.querySelector('.fortune-value');
        if (directionEl) {
            directionEl.textContent = fortune.lucky.direction;
        }
    }
}

// ====================
// 页面导航
// ====================

function navigateTo(page) {
    console.log('navigateTo called with page:', page);

    const pages = {
        'profile-setup': 'profile.html',
        'today-fortune': 'fortune.html',
        'calendar': 'calendar.html',
        'lifestyle': 'lifestyle.html',
        'decision': 'decision.html',
        'knowledge': 'knowledge.html'
    };

    const url = pages[page];
    console.log('URL to navigate:', url);

    if (url) {
        // 直接跳转到对应页面
        console.log('Navigating to:', url);
        window.location.href = url;
    } else {
        console.error('Page not found:', page);
    }
}

// 将函数暴露到全局作用域
window.navigateTo = navigateTo;
window.startJourney = startJourney;
window.showLogin = showLogin;

// ====================
// 初始化每日智慧
// ====================

function initDailyWisdom() {
    const wisdoms = [
        { text: '天行健，君子以自强不息；地势坤，君子以厚德载物。', source: '《易经》' },
        { text: '上善若水，水善利万物而不争。', source: '《道德经》' },
        { text: '知人者智，自知者明；胜人者有力，自胜者强。', source: '《道德经》' },
        { text: '君子和而不同，小人同而不和。', source: '《论语》' },
        { text: '道生一，一生二，二生三，三生万物。', source: '《道德经》' },
        { text: '天时不如地利，地利不如人和。', source: '《孟子》' },
        { text: '祸兮福之所倚，福兮祸之所伏。', source: '《老子》' },
        { text: '千里之行，始于足下。', source: '《老子》' }
    ];

    const dailyQuoteEl = document.getElementById('dailyQuote');
    if (dailyQuoteEl) {
        const today = new Date().getDate();
        const wisdom = wisdoms[today % wisdoms.length];
        dailyQuoteEl.textContent = wisdom.text;

        const cite = dailyQuoteEl.nextElementSibling;
        if (cite) {
            cite.textContent = `—— ${wisdom.source}`;
        }
    }
}

// ====================
// 检查用户状态
// ====================

function checkUserStatus() {
    const userData = Utils.storage.get('userData');
    if (userData && userData.profile) {
        Config.user.isLoggedIn = true;
        Config.user.profile = userData.profile;
    }
}

// ====================
// 自动更新
// ====================

function startAutoUpdate() {
    // 每小时更新一次运势
    setInterval(() => {
        loadTodayFortune();
    }, 3600000);

    // 每天0点更新
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        // 0点刷新页面数据
        location.reload();
    }, msUntilMidnight);
}

// ====================
// 添加脉冲动画样式
// ====================

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);