let currentFilter = "all";
let currentModule = "all";
let currentImageIndex = 0;
let currentImages = [];
let currentMediaType = "image";
let currentVideos = [];
let severityChart = null;
let moduleChart = null;
let currentScale = 1;
let currentTranslateX = 0;
let currentTranslateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

document.addEventListener("DOMContentLoaded", function() {
  initVersionSelector();
  initPage();
  initEventListeners();
  initCharts();
});

function initVersionSelector() {
  const selector = document.getElementById("versionSelector");
  const versions = getAvailableVersions();
  const currentVer = getCurrentVersion();

  selector.innerHTML = versions.map(function(v) {
    return '<option value="' + v + '"' + (v === currentVer ? ' selected' : '') + '>v' + v + '</option>';
  }).join('');

  selector.addEventListener("change", function(e) {
    switchVersion(e.target.value);
  });
}

function switchVersion(version) {
  if (!setCurrentVersion(version)) {
    return;
  }

  destroyCharts();

  currentFilter = "all";
  currentModule = "all";

  window.scrollTo({ top: 0, behavior: "smooth" });

  initPage();
  initCharts();
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

function resetFilterButtons() {
  currentFilter = "all";
  currentModule = "all";
}

function initPage() {
  resetFilterButtons();
  renderOverview();
  renderHighlights();
  renderFilters();
  renderIssues();
  renderFilterStatus();
  renderStatistics();
  renderEvaluation();
  renderSummary();
}

function renderFilters() {
  const data = getReportData();
  if (!data) return;

  // 统计优先级数量
  const priorityCounts = { all: data.issues.length };
  ['P0', 'P1', 'P2', 'P3'].forEach(function(p) {
    priorityCounts[p] = data.issues.filter(function(i) { return i.priority === p; }).length;
  });

  // 生成优先级筛选器
  const priorityFilters = document.getElementById('priorityFilters');
  const priorityLabels = { all: '全部', P0: 'P0 亟待修复', P1: 'P1 重要', P2: 'P2 一般', P3: 'P3 轻微' };
  priorityFilters.innerHTML = Object.keys(priorityLabels).map(function(p) {
    if (p !== 'all' && priorityCounts[p] === 0) return '';
    const isActive = (p === 'all' && currentFilter === 'all') || (p === currentFilter);
    return '<button class="filter-btn' + (isActive ? ' active' : '') + '" data-filter="' + p + '">' + priorityLabels[p] + '<span class="filter-count">(' + priorityCounts[p] + ')</span></button>';
  }).join('');

  // 统计模块数量
  const moduleCounts = { all: data.issues.length };
  const modules = {};
  data.issues.forEach(function(i) {
    if (!modules[i.module]) modules[i.module] = 0;
    modules[i.module]++;
  });
  Object.keys(modules).forEach(function(m) {
    moduleCounts[m] = modules[m];
  });

  // 生成模块筛选器
  const moduleFilters = document.getElementById('moduleFilters');
  let moduleHtml = '<button class="filter-btn' + (currentModule === 'all' ? ' active' : '') + '" data-module="all">全部模块<span class="filter-count">(' + moduleCounts.all + ')</span></button>';
  Object.keys(modules).sort().forEach(function(m) {
    moduleHtml += '<button class="filter-btn' + (currentModule === m ? ' active' : '') + '" data-module="' + m + '">' + m + '<span class="filter-count">(' + moduleCounts[m] + ')</span></button>';
  });
  moduleFilters.innerHTML = moduleHtml;
}

function renderOverview() {
  const data = getReportData();
  if (!data) return;

  const scoreCard = document.getElementById("scoreCard");
  const overviewText = document.getElementById("overviewText");
  const { overview } = data;
  const stars = "⭐".repeat(overview.score) + "☆".repeat(overview.maxScore - overview.score);

  let metaHtml = '<div class="score-meta"><div class="meta-item"><span class="meta-label">📱 APP版本</span><span class="meta-value">v' + overview.version + '</span></div><div class="meta-item"><span class="meta-label">📅 体验日期</span><span class="meta-value">' + overview.date + '</span></div>';

  if (overview.device && overview.os) {
    metaHtml += '<div class="meta-item"><span class="meta-label">📲 设备</span><span class="meta-value">' + overview.device + '</span></div><div class="meta-item"><span class="meta-label">🍎 系统</span><span class="meta-value">' + overview.os + '</span></div>';
  }

  metaHtml += '<div class="meta-item"><span class="meta-label">✍️ 报告人</span><span class="meta-value">小貘</span></div></div>';

  scoreCard.innerHTML = '<div class="score-main"><div class="score">' + overview.score + '/' + overview.maxScore + '</div><div class="stars">' + stars + '</div></div>' + metaHtml;

  overviewText.textContent = data.summary ? data.summary.overviewText : "";
}

function renderHighlights() {
  const data = getReportData();
  if (!data) return;

  const highlightsList = document.getElementById("highlightsList");
  highlightsList.innerHTML = data.highlights.map(function(h) {
    return '<div class="highlight-card"><h3>' + h.title + '</h3><ul>' + h.points.map(function(p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  }).join('');
}

function renderIssues() {
  const data = getReportData();
  if (!data) return;

  const issuesList = document.getElementById("issuesList");
  let filteredIssues = data.issues;

  if (currentFilter !== "all") {
    filteredIssues = filteredIssues.filter(function(i) { return i.priority === currentFilter; });
  }
  if (currentModule !== "all") {
    filteredIssues = filteredIssues.filter(function(i) { return i.module === currentModule; });
  }

  if (filteredIssues.length === 0) {
    issuesList.innerHTML = '<div class="no-issues"><div class="no-issues-icon">📋</div><p class="no-issues-text">暂无问题记录</p></div>';
    return;
  }

  issuesList.innerHTML = filteredIssues.map(function(issue) {
    return '<div class="issue-card" data-issue-id="' + issue.id + '"><div class="issue-header"><span class="issue-number">问题' + issue.id + '</span><span class="severity-badge severity-' + issue.priority + '">' + issue.priority + ' ' + issue.severity + '</span><span class="module-tag">' + issue.module + '</span></div><h3 class="issue-title">' + issue.title + '</h3>' + (issue.time ? '<div class="issue-time"><span class="time-icon">🕐</span><span class="time-text">' + issue.time + '</span></div>' : '') + '<div class="issue-section"><h4 class="issue-section-title">问题描述</h4><p class="issue-description">' + issue.description.replace(/\n/g, '<br>') + '</p></div>' + (issue.steps && issue.steps.length > 0 ? '<div class="issue-section"><h4 class="issue-section-title">复现步骤</h4><ol class="issue-steps">' + issue.steps.map(function(s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>' : '') + (issue.expectedResult ? '<div class="issue-section"><h4 class="issue-section-title">预期结果</h4><p class="issue-result">' + issue.expectedResult + '</p></div>' : '') + (issue.actualResult ? '<div class="issue-section"><h4 class="issue-section-title">实际结果</h4><p class="issue-result">' + issue.actualResult + '</p></div>' : '') + (issue.screenshots.length > 0 || issue.videos.length > 0 ? '<div class="issue-section"><h4 class="issue-section-title">附件</h4><div class="screenshot-grid">' + issue.screenshots.map(function(s, idx) {
      return '<img src="' + s + '" alt="截图' + (idx + 1) + '" class="screenshot-thumb" onclick="openImageLightbox(' + issue.id + ',' + idx + ')">';
    }).join('') + issue.videos.map(function(v, idx) {
      return '<div class="video-thumb" onclick="openVideoLightbox(' + issue.id + ',' + idx + ')"><span class="video-icon">🎬</span><span class="video-label">视频' + (idx + 1) + '</span><span class="play-overlay">▶</span></div>';
    }).join('') + '</div></div>' : '') + '</div>';
  }).join('');
}

function renderStatistics() {
  const data = getReportData();
  if (!data) return;

  const statsGrid = document.getElementById("statsGrid");
  const { statistics } = data;
  const total = Object.values(statistics.bySeverity).reduce(function(a, b) { return a + b; }, 0);

  statsGrid.innerHTML = '<div class="stat-card"><div class="number">' + total + '</div><div class="label">问题总数</div></div><div class="stat-card" style="background: linear-gradient(135deg, #D32F2F, #B71C1C);"><div class="number">' + (statistics.bySeverity['严重'] || 0) + '</div><div class="label">严重问题</div></div><div class="stat-card" style="background: linear-gradient(135deg, #F57C00, #E65100);"><div class="number">' + (statistics.bySeverity['重要'] || 0) + '</div><div class="label">重要问题</div></div><div class="stat-card" style="background: linear-gradient(135deg, #1976D2, #0D47A1);"><div class="number">' + ((statistics.bySeverity['一般'] || 0) + (statistics.bySeverity['轻微'] || 0)) + '</div><div class="label">一般/轻微</div></div>';
}

function initCharts() {
  destroyCharts();
  const data = getReportData();
  if (!data) return;

  const { statistics } = data;

  const severityCtx = document.getElementById("severityChart").getContext("2d");
  severityChart = new Chart(severityCtx, {
    type: "pie",
    data: {
      labels: ["严重", "重要", "一般", "轻微"],
      datasets: [{
        data: [
          statistics.bySeverity['严重'] || 0,
          statistics.bySeverity['重要'] || 0,
          statistics.bySeverity['一般'] || 0,
          statistics.bySeverity['轻微'] || 0
        ],
        backgroundColor: ["#D32F2F", "#F57C00", "#1976D2", "#388E3C"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "问题严重程度分布"
        }
      }
    }
  });

  const moduleCtx = document.getElementById("moduleChart").getContext("2d");
  const moduleLabels = Object.keys(statistics.byModule || {});
  moduleChart = new Chart(moduleCtx, {
    type: "bar",
    data: {
      labels: moduleLabels,
      datasets: [{
        label: "问题数量",
        data: moduleLabels.map(function(l) { return statistics.byModule[l]; }),
        backgroundColor: "#DB5C34"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "各模块问题分布"
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
  if (!data || !data.evaluation) {
    document.getElementById("evaluationContent").innerHTML = "";
    return;
  }

  const evaluation = data.evaluation;
  const evaluationContent = document.getElementById("evaluationContent");

  evaluationContent.innerHTML = '<div class="evaluation-section"><h3 class="evaluation-section-title">评分原因</h3><div class="evaluation-subsection"><h4 class="evaluation-subtitle positive">加分项</h4><ul class="evaluation-list">' + evaluation.scoreReason.positives.map(function(p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>' + (evaluation.scoreReason.deductions.length > 0 ? '<div class="evaluation-subsection"><h4 class="evaluation-subtitle negative">扣分项</h4><ul class="evaluation-list deduction-list">' + evaluation.scoreReason.deductions.map(function(d) {
    return '<li><span class="deduction-tag">' + d.reason + ' (' + d.score + '分)</span>' + d.description + '</li>';
  }).join('') + '</ul></div>' : '') + '</div><div class="evaluation-section"><h3 class="evaluation-section-title">改进路线图建议</h3>' + evaluation.roadmap.map(function(r) {
    return '<div class="roadmap-phase phase-' + r.type + '"><div class="phase-header"><span class="phase-badge ' + r.type + '">' + r.phase + '</span><span class="phase-title">' + r.title + '</span></div><p class="phase-content">' + r.content + '</p></div>';
  }).join('') + '</div>';
}

function renderSummary() {
  const data = getReportData();
  if (!data || !data.summary) {
    document.getElementById("summaryText").innerHTML = "";
    return;
  }

  const summary = data.summary;
  const summaryText = document.getElementById("summaryText");

  summaryText.innerHTML = '<div class="summary-content"><div class="summary-highlight"><span class="summary-icon">✨</span><p class="summary-main">' + summary.highlight + '</p></div><div class="summary-points">' + summary.points.map(function(p) {
    return '<div class="summary-point"><span class="point-bullet">✓</span><span>' + p + '</span></div>';
  }).join('') + '</div><div class="summary-footer"><span class="footer-icon">🚀</span><p class="footer-text">' + summary.footer + '</p></div></div>';
}

function initEventListeners() {
  document.getElementById("sidebarToggle").addEventListener("click", toggleSidebar);

  document.getElementById("issues").addEventListener("click", function(e) {
    const btn = e.target.closest('.filter-btn');
    if (btn) handleFilterClick(btn);
  });

  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', handleNavClick);
  });

  document.getElementById("backToTop").addEventListener("click", scrollToTop);
  window.addEventListener("scroll", handleScroll);
  document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
  document.getElementById("prevImage").addEventListener("click", showPrevImage);
  document.getElementById("nextImage").addEventListener("click", showNextImage);
  document.getElementById("lightbox").addEventListener("click", function(e) { if (e.target === this) closeLightbox(); });
  document.addEventListener("keydown", function(e) {
    if (document.getElementById("lightbox").classList.contains('active')) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    }
  });

  // 图片点击切换缩放
  const lightboxImg = document.getElementById("lightboxImage");
  lightboxImg.addEventListener("click", toggleZoom);
  // 滚轮滚动图片
  lightboxImg.addEventListener("wheel", handleScroll);
  // 拖拽
  lightboxImg.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const toggleIcon = document.getElementById("toggleIcon");
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
  toggleBtn.classList.toggle('collapsed');
  toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
}

function handleFilterClick(btn) {
  const filter = btn.dataset.filter;
  const module = btn.dataset.module;

  if (filter !== undefined) {
    currentFilter = filter;
  } else if (module !== undefined) {
    currentModule = module;
  }

  renderFilters();
  renderIssues();
  renderFilterStatus();
}

function renderFilterStatus() {
  const data = getReportData();
  if (!data) return;

  let filteredIssues = data.issues;
  if (currentFilter !== "all") {
    filteredIssues = filteredIssues.filter(function(i) { return i.priority === currentFilter; });
  }
  if (currentModule !== "all") {
    filteredIssues = filteredIssues.filter(function(i) { return i.module === currentModule; });
  }

  const priorityLabels = { all: '全部级别', P0: 'P0', P1: 'P1', P2: 'P2', P3: 'P3' };
  const priorityText = priorityLabels[currentFilter] || currentFilter;
  const moduleText = currentModule === "all" ? "全部模块" : currentModule;

  const statusEl = document.getElementById('filterStatus');
  if (currentFilter === "all" && currentModule === "all") {
    statusEl.innerHTML = '当前显示 <span class="status-count">' + filteredIssues.length + '</span> <span class="status-text">个全部问题</span>';
  } else {
    statusEl.innerHTML = '当前筛选：<span class="status-text">' + priorityText + '</span> + <span class="status-text">' + moduleText + '</span>，共 <span class="status-count">' + filteredIssues.length + '</span> 个问题';
  }
}

function handleNavClick(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href').substring(1);
  const targetSection = document.getElementById(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.nav-link').forEach(function(link) { link.classList.remove('active'); });
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
  currentMediaType = "image";

  // 重置缩放和位置
  resetZoom();

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImage");
  const video = document.getElementById("lightboxVideo");
  const hint = document.getElementById("zoomHint");

  video.style.display = "none";
  video.pause();
  img.style.display = "block";
  img.src = currentImages[currentImageIndex];
  img.style.cursor = "zoom-in";
  lightbox.classList.add('active');
  hint.style.display = "flex";

  // 防止背景滚动
  document.body.style.overflow = "hidden";

  // 3秒后隐藏提示
  setTimeout(function() {
    hint.style.opacity = "0";
    hint.style.transition = "opacity 0.5s";
    setTimeout(function() {
      hint.style.display = "none";
      hint.style.opacity = "1";
    }, 500);
  }, 3000);

  updateLightboxNav();
}

function openVideoLightbox(issueId, index) {
  const data = getReportData();
  if (!data) return;

  const issue = data.issues.find(function(i) { return i.id === issueId; });
  if (!issue) return;

  currentVideos = issue.videos;
  currentImageIndex = index;
  currentMediaType = "video";

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImage");
  const video = document.getElementById("lightboxVideo");

  img.style.display = "none";
  video.style.display = "block";
  video.src = currentVideos[currentImageIndex];
  lightbox.classList.add('active');

  video.onloadedmetadata = function() { video.play().catch(function(error) { console.log('自动播放被阻止，需用户手动点击播放:', error); }); };

  updateLightboxNav();
}

function openLightbox(issueId, index) {
  openImageLightbox(issueId, index);
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const video = document.getElementById("lightboxVideo");
  video.pause();
  video.src = "";
  lightbox.classList.remove('active');

  // 恢复背景滚动
  document.body.style.overflow = "";
}

function showPrevImage() {
  if (currentMediaType === "image" && currentImageIndex > 0) {
    currentImageIndex--;
    document.getElementById("lightboxImage").src = currentImages[currentImageIndex];
    updateLightboxNav();
  }
}

function showNextImage() {
  if (currentMediaType === "image" && currentImageIndex < currentImages.length - 1) {
    currentImageIndex++;
    document.getElementById("lightboxImage").src = currentImages[currentImageIndex];
    updateLightboxNav();
  }
}

function updateLightboxNav() {
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");

  if (currentMediaType === "image" && currentImages.length > 1) {
    prevBtn.style.display = currentImageIndex > 0 ? "block" : "none";
    nextBtn.style.display = currentImageIndex < currentImages.length - 1 ? "block" : "none";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function handleScroll() {
  const backToTop = document.getElementById("backToTop");
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  const sections = document.querySelectorAll('.section');
  let current = "";
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 100) current = section.getAttribute('id');
  });

  if (current) {
    document.querySelectorAll('.nav-link').forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 图片缩放和拖拽功能
function applyImageTransform() {
  const img = document.getElementById("lightboxImage");
  img.style.transform = 'scale(' + currentScale + ') translate(' + currentTranslateX + 'px, ' + currentTranslateY + 'px)';
}

function resetZoom() {
  currentScale = 1;
  currentTranslateX = 0;
  currentTranslateY = 0;
  const img = document.getElementById("lightboxImage");
  img.style.transform = 'scale(1) translate(0, 0)';
}

function zoomIn() {
  currentScale += 0.5;
  if (currentScale > 5) currentScale = 5;
  applyImageTransform();
}

function zoomOut() {
  currentScale -= 0.5;
  if (currentScale < 0.5) currentScale = 0.5;
  if (currentScale < 1) {
    currentScale = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
  }
  applyImageTransform();
}

function toggleZoom(e) {
  e.stopPropagation();
  const img = document.getElementById("lightboxImage");
  if (currentScale === 1) {
    currentScale = 3.5; // 点击放大到3.5倍
    img.style.cursor = "zoom-out";
  } else {
    currentScale = 1; // 点击缩小到原始大小
    currentTranslateX = 0;
    currentTranslateY = 0;
    img.style.cursor = "zoom-in";
  }
  applyImageTransform();
}

function handleScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  if (currentScale > 1) {
    // 放大状态下，滚轮移动图片
    currentTranslateY -= e.deltaY * 0.8;
    currentTranslateX -= e.deltaX * 0.8;
    applyImageTransform();
  } else {
    // 原始大小下，滚轮切换上一张/下一张
    if (e.deltaY < 0) {
      showPrevImage();
    } else {
      showNextImage();
    }
  }
}

function startDrag(e) {
  if (currentScale > 1) {
    isDragging = true;
    startX = e.clientX - currentTranslateX;
    startY = e.clientY - currentTranslateY;
    e.preventDefault();
  }
}

function drag(e) {
  if (isDragging) {
    currentTranslateX = e.clientX - startX;
    currentTranslateY = e.clientY - startY;
    applyImageTransform();
  }
}

function endDrag() {
  isDragging = false;
}