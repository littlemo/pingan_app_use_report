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
    return '<option value="' + v + '"' + (v === currentVer ? ' selected' : '') + '>APP v' + v + '</option>';
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
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  document.querySelectorAll('[data-module]').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-module="all"]').classList.add('active');
}

function initPage() {
  resetFilterButtons();
  renderOverview();
  renderHighlights();
  renderIssues();
  renderStatistics();
  renderEvaluation();
  renderSummary();
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

  // 图片缩放和拖拽
  const lightboxImg = document.getElementById("lightboxImage");
  lightboxImg.addEventListener("wheel", handleZoom);
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
  toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
}

function handleFilterClick(btn) {
  const filter = btn.dataset.filter;
  const module = btn.dataset.module;

  if (filter !== undefined) {
    currentFilter = filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  } else if (module !== undefined) {
    currentModule = module;
    document.querySelectorAll('[data-module]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  renderIssues();
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

  video.style.display = "none";
  video.pause();
  img.style.display = "block";
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
  currentScale += 0.1;
  if (currentScale > 5) currentScale = 5;
  applyImageTransform();
}

function zoomOut() {
  currentScale -= 0.1;
  if (currentScale < 0.5) currentScale = 0.5;
  applyImageTransform();
}

function handleZoom(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  currentScale += delta;
  if (currentScale > 5) currentScale = 5;
  if (currentScale < 0.5) currentScale = 0.5;
  applyImageTransform();
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