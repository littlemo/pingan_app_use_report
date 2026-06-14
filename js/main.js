let currentFilter = 'all';
let currentModule = 'all';
let currentImageIndex = 0;
let currentImages = [];
let currentMediaType = 'image'; // 'image' or 'video'
let currentVideos = [];
let severityChart = null;
let moduleChart = null;

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
        <div class="score-main">
            <div class="score">${overview.score}/${overview.maxScore}</div>
            <div class="stars">${stars}</div>
        </div>
        <div class="score-meta">
            <div class="meta-item">
                <span class="meta-label">📱 版本</span>
                <span class="meta-value">${overview.version}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">📅 体验日期</span>
                <span class="meta-value">${overview.date}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">✍️ 报告人</span>
                <span class="meta-value">小貘</span>
            </div>
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

    issuesList.innerHTML = filteredIssues.map((issue, index) => `
        <div class="issue-card" data-issue-id="${issue.id}">
            <div class="issue-header">
                <span class="issue-number">问题${issue.id}</span>
                <span class="severity-badge severity-${issue.priority}">${issue.priority} ${issue.severity}</span>
                <span class="module-tag">${issue.module}</span>
            </div>
            <h3 class="issue-title">${issue.title}</h3>
            ${issue.time ? `
            <div class="issue-time">
                <span class="time-icon">🕐</span>
                <span class="time-text">${issue.time}</span>
            </div>
            ` : ''}

            <div class="issue-section">
                <h4 class="issue-section-title">问题描述</h4>
                <p class="issue-description">${issue.description.replace(/\n/g, '<br>')}</p>
            </div>

            ${issue.steps && issue.steps.length > 0 ? `
            <div class="issue-section">
                <h4 class="issue-section-title">复现步骤</h4>
                <ol class="issue-steps">
                    ${issue.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            ` : ''}

            ${issue.expectedResult ? `
            <div class="issue-section">
                <h4 class="issue-section-title">预期结果</h4>
                <p class="issue-result">${issue.expectedResult}</p>
            </div>
            ` : ''}

            ${issue.actualResult ? `
            <div class="issue-section">
                <h4 class="issue-section-title">实际结果</h4>
                <p class="issue-result">${issue.actualResult}</p>
            </div>
            ` : ''}

            ${issue.screenshots.length > 0 || issue.videos.length > 0 ? `
            <div class="issue-section">
                <h4 class="issue-section-title">附件</h4>
                <div class="screenshot-grid">
                    ${issue.screenshots.map((s, idx) => `
                        <img src="${s}" alt="截图${idx + 1}" class="screenshot-thumb"
                             onclick="openImageLightbox(${issue.id}, ${idx})">
                    `).join('')}
                    ${issue.videos.map((v, idx) => `
                        <div class="video-thumb" onclick="openVideoLightbox(${issue.id}, ${idx})">
                            <span class="video-icon">🎬</span>
                            <span class="video-label">视频${idx + 1}</span>
                            <span class="play-overlay">▶</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
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
    // 确保先销毁旧实例，防止内存泄漏
    destroyCharts();

    const { statistics } = reportData;

    const severityCtx = document.getElementById('severityChart').getContext('2d');
    severityChart = new Chart(severityCtx, {
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
    moduleChart = new Chart(moduleCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(statistics.byModule),
            datasets: [{
                label: '问题数量',
                data: Object.values(statistics.byModule),
                backgroundColor: '#DB5C34'
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
        <div class="evaluation-section">
            <h3 class="evaluation-section-title">评分原因</h3>

            <div class="evaluation-subsection">
                <h4 class="evaluation-subtitle positive">加分项（4分基础）</h4>
                <ul class="evaluation-list">
                    <li>产品架构完整清晰，核心功能模块规划合理</li>
                    <li>AI Agent能力迭代明显，从纯对话向可执行操作转型</li>
                    <li>新增Skill功能支持下单等具体操作，实用性提升</li>
                    <li>用户体验基础扎实，界面设计友好统一</li>
                    <li>专业性方向明确，针对金融场景做了优化</li>
                </ul>
            </div>

            <div class="evaluation-subsection">
                <h4 class="evaluation-subtitle negative">扣分项（-1分）</h4>
                <ul class="evaluation-list deduction-list">
                    <li><span class="deduction-tag">稳定性问题（-0.5分）</span>存在点击引用来源导致APP闪退的严重问题</li>
                    <li><span class="deduction-tag">功能完整性（-0.3分）</span>个人持仓信息未接入数据源</li>
                    <li><span class="deduction-tag">数据准确性（-0.1分）</span>来源引用标注错误、历史消息跳转时间丢失</li>
                    <li><span class="deduction-tag">专业性细节（-0.1分）</span>金融专业术语发音不严谨</li>
                </ul>
            </div>
        </div>

        <div class="evaluation-section">
            <h3 class="evaluation-section-title">改进路线图建议</h3>

            <div class="roadmap-phase phase-urgent">
                <div class="phase-header">
                    <span class="phase-badge urgent">第一阶段</span>
                    <span class="phase-title">紧急修复</span>
                </div>
                <p class="phase-content">优先解决APP闪退问题，确保应用稳定性；修复来源引用标注错误，提高信息可信度</p>
            </div>

            <div class="roadmap-phase phase-improve">
                <div class="phase-header">
                    <span class="phase-badge improve">第二阶段</span>
                    <span class="phase-title">功能完善</span>
                </div>
                <p class="phase-content">接入个人持仓数据源，支持个人持仓查询；修复历史消息跳转时间丢失问题；修复涨跌分布等数据展示问题；修复财小安回答样式渲染问题</p>
            </div>

            <div class="roadmap-phase phase-optimize">
                <div class="phase-header">
                    <span class="phase-badge optimize">第三阶段</span>
                    <span class="phase-title">体验优化</span>
                </div>
                <p class="phase-content">语音播放增加句子高亮功能；支持从指定段落开始朗读；优化金融专业术语发音；增强五大选股功能头像辨识度</p>
            </div>
        </div>
    `;
}

function renderSummary() {
    const summaryText = document.getElementById('summaryText');
    summaryText.innerHTML = `
        <div class="summary-content">
            <div class="summary-highlight">
                <span class="summary-icon">✨</span>
                <p class="summary-main">平安证券10.6.3预发布版本整体完成度较高，是一个有潜力的AI金融助手雏形。</p>
            </div>
            <div class="summary-points">
                <div class="summary-point">
                    <span class="point-bullet">✓</span>
                    <span>产品架构完整清晰</span>
                </div>
                <div class="summary-point">
                    <span class="point-bullet">✓</span>
                    <span>AI Agent能力迭代明显</span>
                </div>
                <div class="summary-point">
                    <span class="point-bullet">✓</span>
                    <span>用户体验基础扎实</span>
                </div>
                <div class="summary-point">
                    <span class="point-bullet">✓</span>
                    <span>金融专业性方向明确</span>
                </div>
            </div>
            <div class="summary-footer">
                <span class="footer-icon">🚀</span>
                <p class="footer-text">建议优先解决闪退等P0级别严重问题，再逐步完善功能和优化细节，有望达到5分水准。</p>
            </div>
        </div>
    `;
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

function openImageLightbox(issueId, index) {
    const issue = reportData.issues.find(i => i.id === issueId);
    currentImages = issue.screenshots;
    currentImageIndex = index;
    currentMediaType = 'image';

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    const video = document.getElementById('lightboxVideo');

    video.style.display = 'none';
    video.pause();
    img.style.display = 'block';
    img.src = currentImages[currentImageIndex];
    lightbox.classList.add('active');

    updateLightboxNav();
}

function openVideoLightbox(issueId, index) {
    const issue = reportData.issues.find(i => i.id === issueId);
    currentVideos = issue.videos;
    currentImageIndex = index;
    currentMediaType = 'video';

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    const video = document.getElementById('lightboxVideo');

    img.style.display = 'none';
    video.style.display = 'block';
    video.src = currentVideos[currentImageIndex];
    lightbox.classList.add('active');

    video.onloadedmetadata = function() {
        video.play().catch(function(error) {
            console.log('自动播放被阻止，需用户手动点击播放:', error);
        });
    };

    updateLightboxNav();
}

function openLightbox(issueId, index) {
    openImageLightbox(issueId, index);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightboxVideo');

    video.pause();
    video.src = '';
    lightbox.classList.remove('active');
}

function showPrevImage() {
    if (currentMediaType === 'image' && currentImageIndex > 0) {
        currentImageIndex--;
        document.getElementById('lightboxImage').src = currentImages[currentImageIndex];
        updateLightboxNav();
    }
}

function showNextImage() {
    if (currentMediaType === 'image' && currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        document.getElementById('lightboxImage').src = currentImages[currentImageIndex];
        updateLightboxNav();
    }
}

function updateLightboxNav() {
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    if (currentMediaType === 'image' && currentImages.length > 1) {
        prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentImageIndex < currentImages.length - 1 ? 'block' : 'none';
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
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

function destroyCharts() {
    if (severityChart) {
        severityChart.destroy();
        severityChart = null;
    }
    if (moduleChart) {
        moduleChart.destroy();
        moduleChart = null;
    }
}
