let currentFilter = 'all';
let currentModule = 'all';
let currentImageIndex = 0;
let currentImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEventListeners();
    initCharts();
});

function initPage() {
    renderOverview();
    renderHighlights();
    renderIssues();
    renderStatistics();
    renderEvaluation();
    renderSummary();
}

function renderOverview() {
    const scoreCard = document.getElementById('scoreCard');
    const overviewText = document.getElementById('overviewText');

    const { overview } = reportData;
    const stars = '⭐'.repeat(overview.score) + '☆'.repeat(overview.maxScore - overview.score);

    scoreCard.innerHTML = `
        <div class="score">${overview.score}/${overview.maxScore}</div>
        <div class="stars">${stars}</div>
        <div style="margin-top: 1rem; opacity: 0.9;">
            版本: ${overview.version} | 测试日期: ${overview.date}
        </div>
    `;

    overviewText.textContent = '本次对平安证券10.6.3预发布版本进行了全面体验，覆盖选股功能、盯盘功能、持仓查询等核心模块。整体而言，该版本产品架构完整清晰，AI Agent能力迭代明显，用户体验基础扎实，是一个有潜力的AI金融助手雏形。';
}

function renderHighlights() {
    const highlightsList = document.getElementById('highlightsList');
    highlightsList.innerHTML = reportData.highlights.map(h => `
        <div class="highlight-card">
            <h3>${h.title}</h3>
            <ul>
                ${h.points.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderIssues() {
    const issuesList = document.getElementById('issuesList');
    let filteredIssues = reportData.issues;

    if (currentFilter !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.priority === currentFilter);
    }

    if (currentModule !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.module === currentModule);
    }

    issuesList.innerHTML = filteredIssues.map(issue => `
        <div class="issue-card" data-issue-id="${issue.id}">
            <div>
                <span class="severity-badge severity-${issue.priority}">${issue.priority} ${issue.severity}</span>
                <span class="module-tag">${issue.module}</span>
            </div>
            <h3 class="issue-title">${issue.title}</h3>
            <p>${issue.description}</p>
            ${issue.screenshots.length > 0 || issue.videos.length > 0 ? `
                <div class="screenshot-grid">
                    ${issue.screenshots.map((s, idx) => `
                        <img src="${s}" alt="截图${idx + 1}" class="screenshot-thumb"
                             onclick="openLightbox(${issue.id}, 'screenshots', ${idx})">
                    `).join('')}
                    ${issue.videos.map((v, idx) => `
                        <a href="${v}" target="_blank" class="video-link">
                            🎬 视频${idx + 1}
                        </a>
                    `).join('')}
                </div>
            ` : ''}
            <button class="toggle-btn" onclick="toggleIssue(${issue.id})">
                展开详情 ▼
            </button>
            <div class="issue-details">
                ${issue.time ? `<p><strong>时间:</strong> ${issue.time}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderStatistics() {
    const statsGrid = document.getElementById('statsGrid');
    const { statistics } = reportData;

    const total = Object.values(statistics.bySeverity).reduce((a, b) => a + b, 0);

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="number">${total}</div>
            <div class="label">问题总数</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #D32F2F, #B71C1C);">
            <div class="number">${statistics.bySeverity['严重']}</div>
            <div class="label">严重问题</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #F57C00, #E65100);">
            <div class="number">${statistics.bySeverity['重要']}</div>
            <div class="label">重要问题</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #1976D2, #0D47A1);">
            <div class="number">${statistics.bySeverity['一般'] + statistics.bySeverity['轻微']}</div>
            <div class="label">一般/轻微</div>
        </div>
    `;
}

function initCharts() {
    const { statistics } = reportData;

    const severityCtx = document.getElementById('severityChart').getContext('2d');
    new Chart(severityCtx, {
        type: 'pie',
        data: {
            labels: ['严重', '重要', '一般', '轻微'],
            datasets: [{
                data: [
                    statistics.bySeverity['严重'],
                    statistics.bySeverity['重要'],
                    statistics.bySeverity['一般'],
                    statistics.bySeverity['轻微']
                ],
                backgroundColor: ['#D32F2F', '#F57C00', '#1976D2', '#388E3C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '问题严重程度分布'
                }
            }
        }
    });

    const moduleCtx = document.getElementById('moduleChart').getContext('2d');
    new Chart(moduleCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(statistics.byModule),
            datasets: [{
                label: '问题数量',
                data: Object.values(statistics.byModule),
                backgroundColor: '#1E88E5'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '各模块问题分布'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderEvaluation() {
    const evaluationContent = document.getElementById('evaluationContent');
    evaluationContent.innerHTML = `
        <h3>评分原因</h3>
        <h4>加分项（4分基础）：</h4>
        <ul>
            <li>产品架构完整清晰，核心功能模块规划合理</li>
            <li>AI Agent能力迭代明显，从纯对话向可执行操作转型</li>
            <li>新增Skill功能支持下单等具体操作，实用性提升</li>
            <li>用户体验基础扎实，界面设计友好统一</li>
            <li>专业性方向明确，针对金融场景做了优化</li>
        </ul>
        <h4>扣分项（-1分）：</h4>
        <ul>
            <li><strong>稳定性问题（-0.5分）</strong>：存在点击引用来源导致APP闪退的严重问题</li>
            <li><strong>功能完整性（-0.3分）</strong>：个人持仓信息未接入数据源</li>
            <li><strong>数据准确性（-0.1分）</strong>：来源引用标注错误、历史消息跳转时间丢失</li>
            <li><strong>专业性细节（-0.1分）</strong>：金融专业术语发音不严谨</li>
        </ul>
        <h4>改进路线图建议</h4>
        <p><strong>第一阶段（紧急修复）</strong>：优先解决APP闪退问题，确保应用稳定性；修复来源引用标注错误，提高信息可信度</p>
        <p><strong>第二阶段（功能完善）</strong>：接入个人持仓数据源，支持个人持仓查询；修复历史消息跳转时间丢失问题；修复涨跌分布等数据展示问题；修复财小安回答样式渲染问题</p>
        <p><strong>第三阶段（体验优化）</strong>：语音播放增加句子高亮功能；支持从指定段落开始朗读；优化金融专业术语发音；增强五大选股功能头像辨识度</p>
    `;
}

function renderSummary() {
    const summaryText = document.getElementById('summaryText');
    summaryText.textContent = '平安证券10.6.3预发布版本整体完成度较高，是一个有潜力的AI金融助手雏形。产品架构完整清晰，AI Agent能力迭代明显，用户体验基础扎实，金融专业性方向明确。建议优先解决闪退等P0级别严重问题，再逐步完善功能和优化细节，有望达到5分水准。';
}

function initEventListeners() {
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    document.getElementById('backToTop').addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll);
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
    document.getElementById('prevImage').addEventListener('click', showPrevImage);
    document.getElementById('nextImage').addEventListener('click', showNextImage);
    document.getElementById('lightbox').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('lightbox').classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    const toggleIcon = document.getElementById('toggleIcon');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    toggleBtn.classList.toggle('collapsed');
    toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
}

function handleFilterClick(e) {
    const btn = e.target;
    const filter = btn.dataset.filter;
    const module = btn.dataset.module;

    if (filter !== undefined) {
        currentFilter = filter;
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    } else if (module !== undefined) {
        currentModule = module;
        document.querySelectorAll('[data-module]').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-module="${module}"]`).classList.add('active');
    }

    renderIssues();
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }
}

function toggleIssue(issueId) {
    const card = document.querySelector(`[data-issue-id="${issueId}"]`);
    const btn = card.querySelector('.toggle-btn');

    card.classList.toggle('expanded');
    btn.textContent = card.classList.contains('expanded') ? '收起详情 ▲' : '展开详情 ▼';
}

function openLightbox(issueId, type, index) {
    const issue = reportData.issues.find(i => i.id === issueId);
    currentImages = issue.screenshots;
    currentImageIndex = index;

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');

    img.src = currentImages[currentImageIndex];
    lightbox.classList.add('active');

    updateLightboxNav();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        document.getElementById('lightboxImage').src = currentImages[currentImageIndex];
        updateLightboxNav();
    }
}

function showNextImage() {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        document.getElementById('lightboxImage').src = currentImages[currentImageIndex];
        updateLightboxNav();
    }
}

function updateLightboxNav() {
    document.getElementById('prevImage').style.display = currentImageIndex > 0 ? 'block' : 'none';
    document.getElementById('nextImage').style.display = currentImageIndex < currentImages.length - 1 ? 'block' : 'none';
}

function handleScroll() {
    const backToTop = document.getElementById('backToTop');

    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    const sections = document.querySelectorAll('.section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
