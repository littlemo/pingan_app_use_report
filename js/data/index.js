const versions = {
  "10.6.7": typeof v1067Data !== "undefined" ? v1067Data : null,
  "10.6.3": typeof v1063Data !== "undefined" ? v1063Data : null
};

let currentVersion = "10.6.7";

function getReportData(version) {
  const ver = version || currentVersion;
  const data = versions[ver];
  if (!data) {
    console.error("版本 " + ver + " 的数据不存在");
    return null;
  }
  return data;
}

function setCurrentVersion(version) {
  if (versions[version]) {
    currentVersion = version;
    return true;
  }
  console.error("无法切换到版本 " + version + "：数据不存在");
  return false;
}

function getAvailableVersions() {
  return Object.keys(versions)
    .filter(function(v) { return versions[v] !== null; })
    .sort(function(a, b) {
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) {
          return bVal - aVal;
        }
      }
      return 0;
    });
}

function getCurrentVersion() {
  return currentVersion;
}

function isPlaceholderVersion(version) {
  const ver = version || currentVersion;
  const data = versions[ver];
  return data ? data.dataStatus === "placeholder" : false;
}