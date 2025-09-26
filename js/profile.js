/* ================================
   用户画像页面脚本 - 张大师智慧生活导航系统
   ================================ */

// ====================
// 页面初始化
// ====================

document.addEventListener('DOMContentLoaded', function() {
    // 初始化表单
    initProfileForm();

    // 加载已有数据
    loadExistingProfile();
});

// ====================
// 初始化表单
// ====================

function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    // 表单验证
    const validator = new FormValidator(form);

    // 添加验证规则
    validator.addRule('name', { required: true, minLength: 2 }, {
        required: '请输入姓名',
        minLength: '姓名至少2个字符'
    });

    validator.addRule('gender', { required: true }, {
        required: '请选择性别'
    });

    validator.addRule('birthDate', { required: true }, {
        required: '请选择出生日期'
    });

    validator.addRule('birthTime', { required: true }, {
        required: '请选择出生时辰'
    });

    // 重写提交方法
    validator.onSubmit = function() {
        saveProfile();
    };
}

// ====================
// 加载已有画像
// ====================

function loadExistingProfile() {
    const userData = Utils.storage.get('userData');
    if (userData && userData.profile) {
        const profile = userData.profile;
        const form = document.getElementById('profileForm');

        // 填充表单
        if (form) {
            form.name.value = profile.name || '';
            form.gender.value = profile.gender || '';
            form.birthDate.value = profile.birthDate || '';
            form.birthTime.value = profile.birthTime || '';
            form.birthPlace.value = profile.birthPlace || '';
            form.career.value = profile.career || '';
        }

        // 显示分析结果
        showAnalysis(profile);
    }
}

// ====================
// 保存画像
// ====================

function saveProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);

    const profile = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        birthDate: formData.get('birthDate'),
        birthTime: formData.get('birthTime'),
        birthPlace: formData.get('birthPlace'),
        career: formData.get('career'),
        updatedAt: new Date().toISOString()
    };

    // 计算命理信息
    calculateBaZi(profile);
    calculateWuXing(profile);
    analyzePersonality(profile);

    // 保存数据
    Utils.storage.set('userData', { profile });

    // 显示成功消息
    UIComponents.showNotification('画像保存成功！', 'success');

    // 显示分析结果
    showAnalysis(profile);
}

// ====================
// 计算八字
// ====================

function calculateBaZi(profile) {
    if (!profile.birthDate) return;

    const birthDate = new Date(profile.birthDate);
    const year = birthDate.getFullYear();

    // 简化的八字计算（实际应用需要精确算法）
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 年柱
    const yearGanIndex = (year - 4) % 10;
    const yearZhiIndex = (year - 4) % 12;
    profile.yearPillar = tianGan[yearGanIndex] + diZhi[yearZhiIndex];

    // 月柱（简化计算）
    const month = birthDate.getMonth();
    profile.monthPillar = tianGan[month % 10] + diZhi[month];

    // 日柱（简化计算）
    const day = birthDate.getDate();
    profile.dayPillar = tianGan[day % 10] + diZhi[day % 12];

    // 时柱
    const shiChenMap = {
        '子': '子', '丑': '丑', '寅': '寅', '卯': '卯',
        '辰': '辰', '巳': '巳', '午': '午', '未': '未',
        '申': '申', '酉': '酉', '戌': '戌', '亥': '亥'
    };
    const timeZhi = shiChenMap[profile.birthTime] || '子';
    profile.hourPillar = tianGan[Math.floor(Math.random() * 10)] + timeZhi;

    // 生肖
    profile.zodiac = LunarCalendar.getZodiac(year);
}

// ====================
// 计算五行
// ====================

function calculateWuXing(profile) {
    // 简化的五行计算
    const elements = {
        metal: Math.floor(Math.random() * 30) + 10,
        wood: Math.floor(Math.random() * 30) + 10,
        water: Math.floor(Math.random() * 30) + 10,
        fire: Math.floor(Math.random() * 30) + 10,
        earth: Math.floor(Math.random() * 30) + 10
    };

    // 归一化到100
    const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
    for (let key in elements) {
        elements[key] = Math.round((elements[key] / total) * 100);
    }

    profile.wuxing = elements;

    // 找出主导五行
    let maxElement = 'earth';
    let maxValue = 0;
    for (let [element, value] of Object.entries(elements)) {
        if (value > maxValue) {
            maxValue = value;
            maxElement = element;
        }
    }
    profile.dominantElement = maxElement;
}

// ====================
// 分析性格
// ====================

function analyzePersonality(profile) {
    const traits = {
        metal: ['坚毅', '果断', '正直', '理性', '独立'],
        wood: ['仁慈', '进取', '创新', '灵活', '理想'],
        water: ['智慧', '柔顺', '包容', '敏感', '深沉'],
        fire: ['热情', '活力', '乐观', '冲动', '领导'],
        earth: ['稳重', '诚信', '务实', '忠厚', '包容']
    };

    // 根据主导五行选择性格特征
    const dominantTraits = traits[profile.dominantElement] || traits.earth;

    // 随机选择一些其他特征
    const allTraits = Object.values(traits).flat();
    const additionalTraits = [];
    for (let i = 0; i < 3; i++) {
        const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
        if (!dominantTraits.includes(randomTrait) && !additionalTraits.includes(randomTrait)) {
            additionalTraits.push(randomTrait);
        }
    }

    profile.personality = [...dominantTraits, ...additionalTraits];
}

// ====================
// 显示分析结果
// ====================

function showAnalysis(profile) {
    const analysisSection = document.getElementById('analysisSection');
    if (!analysisSection) return;

    // 显示分析区域
    analysisSection.style.display = 'block';

    // 显示八字
    if (profile.yearPillar) {
        document.getElementById('yearPillar').textContent = profile.yearPillar;
        document.getElementById('monthPillar').textContent = profile.monthPillar;
        document.getElementById('dayPillar').textContent = profile.dayPillar;
        document.getElementById('hourPillar').textContent = profile.hourPillar;
    }

    // 显示五行分析
    if (profile.wuxing) {
        showWuXingChart(profile.wuxing);
        showWuXingSummary(profile);
    }

    // 显示性格特征
    if (profile.personality) {
        showPersonalityTraits(profile.personality);
    }

    // 滚动到分析区域
    setTimeout(() => {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ====================
// 显示五行图表
// ====================

function showWuXingChart(wuxing) {
    const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
    const names = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };

    elements.forEach(element => {
        // 查找对应的五行项容器
        const wuxingItems = document.querySelectorAll('.wuxing-item');

        wuxingItems.forEach(item => {
            const fill = item.querySelector(`.element-fill[data-element="${element}"]`);
            if (fill) {
                // 设置进度条宽度
                const percentage = wuxing[element] || 0;
                setTimeout(() => {
                    fill.style.width = `${percentage}%`;
                }, 100);

                // 更新百分比显示
                const valueElement = item.querySelector('.element-value');
                if (valueElement) {
                    valueElement.textContent = `${percentage}%`;
                }
            }
        });
    });
}

// ====================
// 显示五行总结
// ====================

function showWuXingSummary(profile) {
    const summaryEl = document.getElementById('wuxingSummary');
    if (!summaryEl) return;

    const elementNames = {
        metal: '金',
        wood: '木',
        water: '水',
        fire: '火',
        earth: '土'
    };

    const elementDescriptions = {
        metal: '主义气，性格刚强果断',
        wood: '主仁德，性格温和向上',
        water: '主智慧，性格柔顺灵活',
        fire: '主礼节，性格热情开朗',
        earth: '主信用，性格稳重诚实'
    };

    const dominantName = elementNames[profile.dominantElement];
    const description = elementDescriptions[profile.dominantElement];

    summaryEl.innerHTML = `
        <p><strong>五行属性：</strong>${dominantName}命</p>
        <p>${description}</p>
        <p>建议多接触${getComplementElement(profile.dominantElement)}属性的事物以达到平衡。</p>
    `;
}

// ====================
// 获取互补五行
// ====================

function getComplementElement(element) {
    const complements = {
        metal: '水、木',
        wood: '火、土',
        water: '木、火',
        fire: '土、金',
        earth: '金、水'
    };
    return complements[element] || '水、木';
}

// ====================
// 显示性格特征
// ====================

function showPersonalityTraits(traits) {
    const traitsList = document.getElementById('traitsList');
    if (!traitsList) return;

    traitsList.innerHTML = traits.map(trait =>
        `<span class="trait-tag">${trait}</span>`
    ).join('');
}

// ====================
// 重置表单
// ====================

function resetForm() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.reset();

        // 隐藏分析结果
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            analysisSection.style.display = 'none';
        }
    }
}