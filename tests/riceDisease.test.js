import test from "node:test";
import assert from "node:assert/strict";
import { validateRiceLeafFile, MAX_RICE_LEAF_BYTES } from "../src/utils/riceDiseaseValidation.js";
import { normalizeRiceDiseaseResponse, resolveDiseaseImageSource } from "../src/utils/riceDiseaseResponse.js";

const makeFile = (name, type, size = 1024) => ({ name, type, size });

test("accepts supported rice leaf image formats", () => {
  for (const [name, type] of [["leaf.jpg", "image/jpeg"], ["leaf.jpeg", "image/jpeg"], ["leaf.png", "image/png"], ["leaf.webp", "image/webp"]]) {
    assert.equal(validateRiceLeafFile(makeFile(name, type)), "");
  }
});

test("rejects unsupported, empty, and oversized image files", () => {
  assert.match(validateRiceLeafFile(makeFile("leaf.gif", "image/gif")), /Unsupported format/);
  assert.match(validateRiceLeafFile(makeFile("leaf.jpg", "image/jpeg", MAX_RICE_LEAF_BYTES + 1)), /too large/);
  assert.match(validateRiceLeafFile(makeFile("leaf.png", "image/png", 0)), /empty/);
});

test("normalizes disease results without exposing box coordinates", () => {
  const result = normalizeRiceDiseaseResponse({
    status: "disease_detected",
    prediction: { class: "Brown Spot", confidence: 0.82, explanation: "The model marked this leaf for review." },
    detections: [{ class: "Brown Spot", confidence: 82, bbox: [2, 3, 80, 90] }, { class: "Unknown", confidence: 0.2 }],
    images: { annotated: "/media/annotated.png" },
    advisory: { description: "Verified guidance", practices: ["Monitor the crop"], contactExpertWhen: "If symptoms spread", detailsUrl: "https://example.org/advice" }
  }, "https://farm.example/api");

  assert.equal(result.status, "disease_detected");
  assert.equal(result.predictedClass, "Brown Spot");
  assert.equal(result.confidence, 82);
  assert.deepEqual(result.detections, [{ className: "Brown Spot", confidence: 82 }]);
  assert.equal(result.annotatedImage, "https://farm.example/media/annotated.png");
  assert.deepEqual(result.advisory.practices, ["Monitor the crop"]);
});

test("preserves healthy/no-disease and uncertain result states", () => {
  const healthy = normalizeRiceDiseaseResponse({ status: "no_disease_detected", prediction: { class: "Healthy", confidence: 0.96 } });
  const uncertain = normalizeRiceDiseaseResponse({ status: "other", prediction: { class: "Unknown", confidence: null } });
  assert.equal(healthy.status, "no_disease_detected");
  assert.equal(healthy.predictedClass, "Healthy");
  assert.equal(healthy.confidence, 96);
  assert.equal(uncertain.status, "uncertain");
  assert.equal(uncertain.predictedClass, null);
  assert.equal(uncertain.confidence, null);
  assert.equal(uncertain.advisory, null);
});

test("accepts image data and safe URLs, and rejects unsafe advisory links", () => {
  const result = normalizeRiceDiseaseResponse({
    status: "uncertain",
    explainability: { heatmap: { data: "aGVhdG1hcA==", mimeType: "image/png" }, method: "Grad-CAM" },
    advisory: { detailsUrl: "javascript:alert(1)" }
  }, "https://farm.example/api");
  assert.equal(result.heatmap, "data:image/png;base64,aGVhdG1hcA==");
  assert.equal(result.explanationMethod, "Grad-CAM");
  assert.equal(result.advisory.detailsUrl, null);
  assert.equal(resolveDiseaseImageSource("relative/heatmap.webp", "https://farm.example/api"), "https://farm.example/api/relative/heatmap.webp");
});
