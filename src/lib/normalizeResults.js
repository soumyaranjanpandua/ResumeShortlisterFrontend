// lib/normalizeResults.js
export function normalizeResults(rawData) {
  if (!rawData || !rawData.length) return [];

  return rawData.map((resultObj) => {
    const resultData = resultObj.result || {};

    // find the resume_vs_jd key inside "result"
    const key = Object.keys(resultData).find(k => k.includes("_vs_"));
    const details = key ? resultData[key] : {};

    return {
      resumeName: key?.split("_vs_")[0] || resultObj.resume || "-",
      jdName: key?.split("_vs_")[1] || resultObj.jd || "-",
      Skills: details?.Skills || null,
      Education: details?.Education || null,
      "Job Role": details?.["Job Role"] || null,
      Experience: details?.Experience || null,
      OverallMatchPercentage: details?.OverallMatchPercentage ?? null,
      AI_Generated_Estimate_Percentage: details?.AI_Generated_Estimate_Percentage ?? null,
      shortlisted: resultData.shortlisted === "yes", // ✅ fixed
      name: resultObj.name || null,
      email: resultObj.email || null,
    };
  });
}


// lib/normalizeHistory.js
export function normalizeHistory(rawData) {
  if (!rawData || !rawData.length) return [];

  return rawData.map((record) => {
    // pick the key that contains "_vs_"
    const key = Object.keys(record).find(k => k.includes("_vs_"));
    if (!key) return null;

    const details = record[key] || {};
    const [resumeName, jdName] = key.split("_vs_");

    return {
      resumeName: resumeName || "-",
      jdName: jdName || "-",
      Skills: details.Skills || null,
      Education: details.Education || null,
      "Job Role": details["Job Role"] || null,
      Experience: details.Experience || null,
      OverallMatchPercentage: details.OverallMatchPercentage ?? null,
      AI_Generated_Estimate_Percentage: details.AI_Generated_Estimate_Percentage ?? null,
      shortlisted: record.shortlisted === "yes",
    };
  }).filter(Boolean); // remove nulls if any
}