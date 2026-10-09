import { api } from "./api";
import { normalizeRiceDiseaseResponse } from "./riceDiseaseResponse";

const predictionEndpoint = import.meta.env.VITE_RICE_DISEASE_PREDICTION_ENDPOINT?.trim();
const explanationEndpoint = import.meta.env.VITE_RICE_DISEASE_EXPLAIN_ENDPOINT?.trim();
const imageFieldName = import.meta.env.VITE_RICE_DISEASE_IMAGE_FIELD?.trim();
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const riceDiseaseApiConfig = {
  predictionReady: Boolean(predictionEndpoint && imageFieldName),
  explanationReady: Boolean(explanationEndpoint && imageFieldName)
};

function imageForm(file) {
  const form = new FormData();
  form.append(imageFieldName, file, file.name);
  return form;
}

function assertEndpoint(endpoint, label) {
  if (!endpoint || !imageFieldName) {
    throw new Error(`${label} is not available yet. The FastAPI endpoint and image field need to be configured.`);
  }
}

export async function analyzeRiceLeaf(file) {
  assertEndpoint(predictionEndpoint, "Rice disease analysis");
  const { data } = await api.post(predictionEndpoint, imageForm(file), { timeout: 60000 });
  const result = normalizeRiceDiseaseResponse(data, apiBaseUrl);
  if (result.status === "error") {
    throw new Error(data?.message || data?.detail || "The analysis service could not process this image.");
  }
  return result;
}

export async function requestRiceLeafExplanation(file) {
  assertEndpoint(explanationEndpoint, "AI explanation");
  const { data } = await api.post(explanationEndpoint, imageForm(file), { timeout: 60000 });
  const explanation = normalizeRiceDiseaseResponse(data, apiBaseUrl);
  if (explanation.status === "error") {
    throw new Error(data?.message || data?.detail || "The explanation service could not process this image.");
  }
  return explanation;
}
