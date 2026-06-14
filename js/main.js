// 全局状态变量
let currentFilter = 'all';
let currentModule = 'all';
let currentImageIndex = 0;
let currentImages = [];
let currentMediaType = 'image'; // 'image' or 'video'
let currentVideos = [];

// 新增：图表实例存储 - 用于在切换版本时正确销毁
let severityChart = null;
let moduleChart = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initVersionSelector();
    initPage();
    initEventListeners();
    initCharts();
});

// 新增：初始化版本选择器
function initVersionSelector() {
    const selector = document.getElementById('versionSelector');
    const versions = getAvailableVersions();
    const currentVer = getCurrentVersion();

    // 填充选项
    selector.innerHTML = versions.map(function(v) {
        return '<option value="' + v + '"' + (v === currentVer ? ' selected' : '') + '>v' + v + '</option>';
    }).join('');

    // 更新占位提示徽章
    updatePlaceholderBadge();

    // 绑定切换事件
    selector.addEventListener('change', function(e) {
        switchVersion(e.target.value);
    });
}

// 新增：更新占位数据提示徽章
function updatePlaceholderBadge() {
    const badge = document.getElementById('placeholderBadge');
    if (isPlaceholderVersion()) {
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// 新增：切换版本核心逻辑
function switchVersion(version) {
    if (!setCurrentVersion(version)) {
        return;
    }

    // 1. 销毁现有图表实例（防止内存泄漏）
    destroyCharts();

    // 2. 重置筛选状态
    currentFilter = 'all';
    currentModule = 'all';

    // 3. 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. 更新占位提示徽章
    updatePlaceholderBadge();

    // 5. 重新初始化页面所有内容
    initPage();

    // 6. 重新初始化图表
    initCharts();
}

// 新增：销毁图表实例
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

// 新增：动态生成优先级筛选按钮
function renderPriorityFilters() {
    const container = document.getElementById('priority-filters');
    container.innerHTML = '';

    const priorities = ['all', 'P0', 'P1', 'P2', 'P3'];
    const labels = {
        'all': '全部',
        'P0': 'P0 亟待修复',
        'P1': 'P1 重要',
        'P2': 'P2 一般',
        'P3': 'P3 轻微'
    };

    priorities.forEach(function(p) {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (p === currentFilter ? ' active' : '');
        btn.dataset.filter = p;
        btn.textContent = labels[p];
        container.appendChild(btn);
    });
}

// 新增：动态生成模块筛选按钮
function renderModuleFilters() {
    const container = document.getElementById('module-filters');
    container.innerHTML = '';

    const data = getReportData();
    const modules = ['all'];
    if (data && data.statistics && data.statistics.byModule) {
        Object.keys(data.statistics.byModule).forEach(function(m) {
            modules.push(m);
        });
    }

    modules.forEach(function(m) {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (m === currentModule ? ' active' : '');
        btn.dataset.module = m;
        btn.textContent = m === 'all' ? '全部模块' : m;
        container.appendChild(btn);
    });
}

// 初始化页面所有内容
function initPage() {
    renderPriorityFilters();
    renderModuleFilters();
    renderOverview();
    renderHighlights();
    renderIssues();
    renderStatistics();
    renderEvaluation();
    renderSummary();
}

// 渲染概述 - 从数据中读取，移除硬编码
function renderOverview() {
    const data = getReportData();
    if (!data) return;

    const scoreCard = document.getElementById('scoreCard');
    const overviewText = document.getElementById('overviewText');
    const overview = data.overview;

    const stars = '⭐'.repeat(overview.score) + '☆'.repeat(overview.maxScore - overview.score);

    scoreCard.innerHTML = '' +
        '<div class="score-main">' +
        '<div class="score">' + overview.score + '/' + overview.maxScore + '</div>' +
        '<div class="stars">' + stars + '</div>' +
        '</div>' +
        '<div class="score-meta">' +
        '<div class="meta-item">' +
        '<span class="meta-label">📱 版本</span>' +
        '<span class="meta-value">' + overview.version + '</span>' +
        '</div>' +
        '<div class="meta-item">' +
        '<span class="meta-label">📅 体验日期</span>' +
        '<span class="meta-value">' + overview.date + '</span>' +
        '</div>' +
        '<div class="meta-item">' +
        '<span class="meta-label">✍️ 报告人</span>' +
        '<span class="meta-value">小貘</span>' +
        '</div>' +
        '</div>';

    // 从数据中读取概述文本，不再硬编码
    overviewText.textContent = data.summary ? data.summary.overviewText : '';
}

function renderHighlights() {
    const data = getReportData();
    if (!data) return;

    const highlightsList = document.getElementById('highlightsList');
    highlightsList.innerHTML = data.highlights.map(function(h) {
        return '' +
            '<div class="highlight-card">' +
            '<h3>' + h.title + '</h3>' +
            '<ul>' +
            h.points.map(function(p) { return '<li>' + p + '</li>'; }).join('') +
            '</ul>' +
            '</div>';
    }).join('');
}

function renderIssues() {
    const data = getReportData();
    if (!data) return;

    const issuesList = document.getElementById('issuesList');
    let filteredIssues = data.issues;

    if (currentFilter !== 'all') {
        filteredIssues = filteredIssues.filter(function(i) { return i.priority === currentFilter; });
    }

    if (currentModule !== 'all') {
        filteredIssues = filteredIssues.filter(function(i) { return i.module === currentModule; });
    }

    if (filteredIssues.length === 0) {
        issuesList.innerHTML = '' +
            '<div class="no-issues">' +
            '<div class="no-issues-icon">📋</div>' +
            '<p class="no-issues-text">暂无问题记录</p>' +
            '</div>';
        return;
    }

    issuesList.innerHTML = filteredIssues.map(function(issue) {
        return '' +
            '<div class="issue-card" data-issue-id="' + issue.id + '">' +
            '<div class="issue-header">' +
            '<span class="issue-number">问题' + issue.id + '</span>' +
            '<span class="severity-badge severity-' + issue.priority + '">' + issue.priority + ' ' + issue.severity + '</span>' +
            '<span class="module-tag">' + issue.module + '</span>' +
            '</div>' +
            '<h3 class="issue-title">' + issue.title + '</h3>' +
            (issue.time ? '' +
                '<div class="issue-time">' +
                '<span class="time-icon">🕐</span>' +
                '<span class="time-text">' + issue.time + '</span>' +
                '</div>' : '') +
            '<div class="issue-section">' +
            '<h4 class="issue-section-title">问题描述</h4>' +
            '<p class="issue-description">' + issue.description.replace(/\n/g, '<br>') + '</p>' +
            '</div>' +
            (issue.steps && issue.steps.length > 0 ? '' +
                '<div class="issue-section">' +
                '<h4 class="issue-section-title">复现步骤</h4>' +
                '<ol class="issue-steps">' +
                issue.steps.map(function(s) { return '<li>' + s + '</li>'; }).join('') +
                '</ol>' +
                '</div>' : '') +
            (issue.expectedResult ? '' +
                '<div class="issue-section">' +
                '<h4 class="issue-section-title">预期结果</h4>' +
                '<p class="issue-result">' + issue.expectedResult + '</p>' +
                '</div>' : '') +
            (issue.actualResult ? '' +
                '<div class="issue-section">' +
                '<h4 class="issue-section-title">实际结果</h4>' +
                '<p class="issue-result">' + issue.actualResult + '</p>' +
                '</div>' : '') +
            (issue.screenshots.length > 0 || issue.videos.length > 0 ? '' +
                '<div class="issue-section">' +
                '<h4 class="issue-section-title">附件</h4>' +
                '<div class="screenshot-grid">' +
                issue.screenshots.map(function(s, idx) {
                    return '<img src="' + s + '" alt="截图' + (idx + 1) + '" class="screenshot-thumb" onclick="openImageLightbox(' + issue.id + ', ' + idx + ')">';
                }).join('') +
                issue.videos.map(function(v, idx) {
                    return '' +
                        '<div class="video-thumb" onclick="openVideoLightbox(' + issue.id + ', ' + idx + ')">' +
                        '<span class="video-icon">🎬</span>' +
                        '<span class="video-label">视频' + (idx + 1) + '</span>' +
                        '<span class="play-overlay">▶</span>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' : '') +
            '</div>';
    }).join('');
}

function renderStatistics() {
    const data = getReportData();
    if (!data) return;

    const statsGrid = document.getElementById('statsGrid');
    const statistics = data.statistics;

    const total = Object.values(statistics.bySeverity).reduce(function(a, b) { return a + b; }, 0);

    statsGrid.innerHTML = '' +
        '<div class="stat-card">' +
        '<div class="number">' + total + '</div>' +
        '<div class="label">问题总数</div>' +
        '</div>' +
        '<div class="stat-card" style="background: linear-gradient(135deg, var(--severity-red), #b71c1c);">' +
        '<div class="number">' + (statistics.bySeverity['严重'] || 0) + '</div>' +
        '<div class="label">严重问题</div>' +
        '</div>' +
        '<div class="stat-card" style="background: linear-gradient(135deg, var(--severity-orange), #e65100);">' +
        '<div class="number">' + (statistics.bySeverity['重要'] || 0) + '</div>' +
        '<div class="label">重要问题</div>' +
        '</div>' +
        '<div class="stat-card" style="background: linear-gradient(135deg, var(--severity-blue), #0d47a1);">' +
        '<div class="number">' + ((statistics.bySeverity['一般'] || 0) + (statistics.bySeverity['轻微'] || 0)) + '</div>' +
        '<div class="label">一般/轻微</div>' +
        '</div>';
}

function initCharts() {
    const data = getReportData();
    if (!data) return;

    // 确保先销毁旧实例，防止内存泄漏
    destroyCharts();

    const statistics = data.statistics;

    const severityCtx = document.getElementById('severityChart').getContext('2d');
    severityChart = new Chart(severityCtx, {
        type: 'pie',
        data: {
            labels: ['严重', '重要', '一般', '轻微'],
            datasets: [{
                data: [
                    statistics.bySeverity['严重'] || 0,
                    statistics.bySeverity['重要'] || 0,
                    statistics.bySeverity['一般'] || 0,
                    statistics.bySeverity['轻微'] || 0
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
    const moduleLabels = Object.keys(statistics.byModule || {});
    moduleChart = new Chart(moduleCtx, {
        type: 'bar',
        data: {
            labels: moduleLabels,
            datasets: [{
                label: '问题数量',
                data: moduleLabels.map(function(l) { return statistics.byModule[l]; }),
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
    const data = getReportData();
    if (!data || !data.evaluation) return;

    const evaluation = data.evaluation;
    const evaluationContent = document.getElementById('evaluationContent');

    evaluationContent.innerHTML = '' +
        '<div class="evaluation-section">' +
        '<h3 class="evaluation-section-title">评分原因</h3>' +
        '<div class="evaluation-subsection">' +
        '<h4 class="evaluation-subtitle positive">加分项</h4>' +
        '<ul class="evaluation-list">' +
        evaluation.scoreReason.positives.map(function(p) { return '<li>' + p + '</li>'; }).join('') +
        '</ul>' +
        '</div>' +
        (evaluation.scoreReason.deductions.length > 0 ? '' +
            '<div class="evaluation-subsection">' +
            '<h4 class="evaluation-subtitle negative">扣分项</h4>' +
            '<ul class="evaluation-list deduction-list">' +
            evaluation.scoreReason.deductions.map(function(d) {
                return '' +
                    '<li>' +
                    '<span class="deduction-tag">' + d.reason + ' (' + d.score + '分)</span>' +
                    d.description +
                    '</li>';
            }).join('') +
            '</ul>' +
            '</div>' : '') +
        '</div>' +
        '<div class="evaluation-section">' +
        '<h3 class="evaluation-section-title">改进路线图建议</h3>' +
        evaluation.roadmap.map(function(r) {
            return '' +
                '<div class="roadmap-phase phase-' + r.type + '">' +
                '<div class="phase-header">' +
                '<span class="phase-badge ' + r.type + '">' + r.phase + '</span>' +
                '<span class="phase-title">' + r.title + '</span>' +
                '</div>' +
                '<p class="phase-content">' + r.content + '</p>' +
                '</div>';
        }).join('') +
        '</div>';
}

function renderSummary() {
    const data = getReportData();
    if (!data || !data.summary) return;

    const summary = data.summary;
    const summaryText = document.getElementById('summaryText');

    summaryText.innerHTML = '' +
        '<div class="summary-content">' +
        '<div class="summary-highlight">' +
        '<span class="summary-icon">✨</span>' +
        '<p class="summary-main">' + summary.highlight + '</p>' +
        '</div>' +
        '<div class="summary-points">' +
        summary.points.map(function(p) {
            return '' +
                '<div class="summary-point">' +
                '<span class="point-bullet">✓</span>' +
                '<span>' + p + '</span>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<div class="summary-footer">' +
        '<span class="footer-icon">🚀</span>' +
        '<p class="footer-text">' + summary.footer + '</p>' +
        '</div>' +
        '</div>';
}

function initEventListeners() {
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

    // 使用事件委托处理动态生成的筛选按钮
    document.getElementById('issues').addEventListener('click', function(e) {
        const btn = e.target.closest('.filter-btn');
        if (btn) {
            handleFilterClick(btn);
        }
    });

    document.querySelectorAll('.nav-link').forEach(function(link) {
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

function handleFilterClick(btn) {
    const filter = btn.dataset.filter;
    const module = btn.dataset.module;

    if (filter !== undefined) {
        currentFilter = filter;
        renderPriorityFilters();
    } else if (module !== undefined) {
        currentModule = module;
        renderModuleFilters();
    }

    renderIssues();
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }
}

function openImageLightbox(issueId, index) {
    const data = getReportData();
    if (!data) return;

    const issue = data.issues.find(function(i) { return i.id === issueId; });
    if (!issue) return;

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
    const data = getReportData();
    if (!data) return;

    const issue = data.issues.find(function(i) { return i.id === issueId; });
    if (!issue) return;

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
    const backToTop = document.getElementById('backToTop';

    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    const sections = document.querySelectorAll('.section');
    let current = '';

    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
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
