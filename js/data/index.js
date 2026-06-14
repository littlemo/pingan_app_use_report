// js/data/index.js
// 版本管理模块 - 统一管理所有版本数据

// 版本注册表 - key为版本号字符串，value为对应的数据对象
const versions = {
  '10.6.3': typeof v1063Data !== 'undefined' ? v1063Data : null,
  '10.6.7': typeof v1067Data !== 'undefined' ? v1067Data : null
};

// 当前选中的版本 - 默认显示完整的10.6.3报告
let currentVersion = '10.6.3';

// 获取当前版本的数据
function getReportData(version) {
  const ver = version || currentVersion;
  const data = versions[ver];
  if (!data) {
    console.error('版本 ' + ver + ' 的数据不存在');
    return null;
  }
  return data;
}

// 切换当前版本
function setCurrentVersion(version) {
  if (versions[version]) {
    currentVersion = version;
    return true;
  }
  console.error('无法切换到版本 ' + version + '：数据不存在');
  return false;
}

// 获取所有可用版本列表（按版本号降序排列）
function getAvailableVersions() {
  return Object.keys(versions)
    .filter(function(v) { return versions[v] !== null; })
    .sort(function(a, b) {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) {
          return bVal - aVal; // 降序排列
        }
      }
      return 0;
    });
}

// 获取当前版本号
function getCurrentVersion() {
  return currentVersion;
}

// 检查某个版本是否为占位数据
function isPlaceholderVersion(version) {
  const ver = version || currentVersion;
  const data = versions[ver];
  return data ? data.dataStatus === 'placeholder' : false;
}
