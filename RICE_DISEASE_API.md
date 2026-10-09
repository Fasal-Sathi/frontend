# Rice disease API integration

The current FastAPI app has a crop-yield prediction route, but no rice-disease, explanation, or advisory route. The screen therefore reports analysis as unavailable until the variables below are configured; it does not create demo predictions.

Set these in the frontend runtime/build environment after agreeing the API contract:

```env
VITE_API_URL=http://localhost:8000/api
VITE_RICE_DISEASE_PREDICTION_ENDPOINT=/rice-disease/predict
VITE_RICE_DISEASE_IMAGE_FIELD=file
VITE_RICE_DISEASE_EXPLAIN_ENDPOINT=/rice-disease/explain
```

The endpoint examples above are illustrative only. Confirm the actual route and multipart field with the FastAPI implementation. Leave the prediction endpoint and image field empty until confirmed. The explanation endpoint is optional. The UI sends the selected image as `multipart/form-data` using the configured field name.

## Frontend response adapter

`src/utils/riceDiseaseResponse.js` is the only response mapping layer. It currently accepts this proposed envelope; align its property mappings with the backend response before connecting a different schema:

```json
{
  "status": "disease_detected",
  "prediction": {
    "class": "Brown Spot",
    "confidence": 0.82,
    "explanation": "A concise model explanation, if available."
  },
  "detections": [
    { "class": "Brown Spot", "confidence": 0.82, "bbox": [0.1, 0.2, 0.8, 0.9] }
  ],
  "images": { "annotated": "https://api.example.test/images/annotated.png" },
  "explainability": {
    "status": "available",
    "method": "Grad-CAM",
    "heatmap": "data:image/png;base64,..."
  },
  "advisory": {
    "description": "Verified description supplied by the agricultural service.",
    "practices": ["Verified practice supplied by the service."],
    "contactExpertWhen": "Verified guidance supplied by the service.",
    "detailsUrl": "https://agriculture.example.test/disease-info"
  }
}
```

Supported statuses are `disease_detected`, `no_disease_detected`, `uncertain`, `invalid_image`, and `error`. The supported classes are Bacterial Leaf Blight, Brown Spot, Healthy, and Rice Blast. Confidence may be sent as either a fraction from 0 to 1 or a percentage from 0 to 100. Bounding-box coordinates are intentionally not shown as raw values. `images.annotated` and `explainability.heatmap` may be absolute URLs, API-relative URLs, data URLs, or `{ "data": "...", "mimeType": "image/png" }` objects; adjust `resolveDiseaseImageSource` if the API uses another format.

The optional explanation request currently posts the same image field to the configured explanation endpoint. If the backend instead requires a prediction ID or other context, change only `requestRiceLeafExplanation` in `src/utils/riceDiseaseApi.js` and its response mapping. Disease descriptions, recommended practices, expert-contact guidance, and information links must come from verified backend advisory data; the frontend intentionally supplies none.
