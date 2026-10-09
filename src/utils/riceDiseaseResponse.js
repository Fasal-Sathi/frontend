const allowedClasses = new Set([
  "Bacterial Leaf Blight",
  "Brown Spot",
  "Healthy",
  "Rice Blast"
]);

export function confidencePercent(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(100, number <= 1 ? number * 100 : number);
}

export function resolveDiseaseImageSource(value, apiBaseUrl = globalThis.location?.origin || "http://localhost") {
  if (value && typeof value === "object") {
    if (typeof value.url === "string") return resolveDiseaseImageSource(value.url, apiBaseUrl);
    if (typeof value.data === "string" && typeof value.mimeType === "string" && value.mimeType.startsWith("image/")) {
      return value.data.startsWith("data:image/") ? value.data : `data:${value.mimeType};base64,${value.data}`;
    }
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const source = value.trim();
  if (/^(data:image\/|blob:|https?:\/\/)/i.test(source)) return source;
  try {
    const base = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
    return new URL(source, base).toString();
  } catch {
    return null;
  }
}

function safeHttpUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, globalThis.location?.origin || "http://localhost");
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Backend response adapter. The current FastAPI app has no rice-disease route
 * or agreed response schema. Align these mappings when that contract is set.
 * Expected concepts: status, prediction { class, confidence, explanation },
 * detections [{ class, confidence, bbox }], images { annotated },
 * explainability { heatmap, method, status }, advisory { description,
 * practices, contactExpertWhen, detailsUrl }. Bounding-box coordinates are
 * deliberately omitted from the farmer-facing model.
 */
export function normalizeRiceDiseaseResponse(payload, apiBaseUrl) {
  const prediction = payload?.prediction ?? {};
  const images = payload?.images ?? {};
  const explainability = payload?.explainability ?? {};
  const advisory = payload?.advisory ?? null;
  const predictedClass = allowedClasses.has(prediction.class) ? prediction.class : null;
  const detections = Array.isArray(payload?.detections)
    ? payload.detections
        .filter(item => allowedClasses.has(item?.class))
        .map(item => ({ className: item.class, confidence: confidencePercent(item.confidence) }))
    : [];
  const practices = Array.isArray(advisory?.practices)
    ? advisory.practices.filter(item => typeof item === "string" && item.trim())
    : [];

  return {
    status: ["disease_detected", "no_disease_detected", "uncertain", "invalid_image", "error"].includes(payload?.status)
      ? payload.status
      : "uncertain",
    predictedClass,
    confidence: confidencePercent(prediction.confidence),
    explanation: typeof prediction.explanation === "string" ? prediction.explanation : "",
    detections,
    annotatedImage: resolveDiseaseImageSource(images.annotated, apiBaseUrl),
    heatmap: resolveDiseaseImageSource(explainability.heatmap, apiBaseUrl),
    explanationMethod: typeof explainability.method === "string" ? explainability.method : "",
    explanationStatus: typeof explainability.status === "string" ? explainability.status : "",
    advisory: advisory && typeof advisory === "object" ? {
      description: typeof advisory.description === "string" ? advisory.description : "",
      practices,
      contactExpertWhen: typeof advisory.contactExpertWhen === "string" ? advisory.contactExpertWhen : "",
      detailsUrl: safeHttpUrl(advisory.detailsUrl)
    } : null
  };
}
