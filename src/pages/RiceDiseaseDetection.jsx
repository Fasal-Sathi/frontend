import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Camera, FileImage, ImagePlus, LoaderCircle, RefreshCw, ScanLine, Sprout, Trash2, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { analyzeRiceLeaf, requestRiceLeafExplanation, riceDiseaseApiConfig } from "../utils/riceDiseaseApi";
import { validateRiceLeafFile } from "../utils/riceDiseaseValidation";

function Confidence({ value }) {
  if (value == null) return <span className="text-gray-500">Confidence not provided</span>;
  return <span>{value.toFixed(1)}% confidence</span>;
}

function Advisory({ advisory }) {
  return <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-gov sm:p-8">
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-govGreen"><Sprout size={23}/></span>
      <div><h2 className="text-2xl font-extrabold text-gray-900">Recommended Next Steps</h2><p className="mt-1 text-sm text-gray-600">Use verified guidance from the agricultural service.</p></div>
    </div>
    {advisory && (advisory.description || advisory.practices.length || advisory.contactExpertWhen || advisory.detailsUrl) ? <div className="mt-6 space-y-5 text-gray-700">
      {advisory.description && <p className="leading-7">{advisory.description}</p>}
      {advisory.practices.length > 0 && <div><h3 className="font-bold text-gray-900">Practices to consider</h3><ul className="mt-2 list-disc space-y-2 pl-5 leading-6">{advisory.practices.map((practice, index) => <li key={`${index}-${practice}`}>{practice}</li>)}</ul></div>}
      {advisory.contactExpertWhen && <div className="rounded-2xl bg-amber-50 p-4"><h3 className="font-bold text-amber-950">When to contact an agricultural expert</h3><p className="mt-1 leading-6 text-amber-950/80">{advisory.contactExpertWhen}</p></div>}
      {advisory.detailsUrl && <a href={advisory.detailsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-govGreen px-4 py-2 font-bold text-white hover:bg-green-800">View detailed guidance</a>}
    </div> : <p className="mt-5 rounded-2xl bg-gray-50 p-4 leading-6 text-gray-600">Verified advice is not available yet. No disease-specific treatment recommendations are provided here. Contact your local agricultural expert for guidance about your crop.</p>}
  </section>;
}

export default function RiceDiseaseDetection() {
  const browseRef = useRef(null);
  const cameraRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewReady, setPreviewReady] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [result, setResult] = useState(null);
  const [activeImage, setActiveImage] = useState("original");
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState("");

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl("");
    setPreviewReady(false);
    setResult(null);
    setAnalysisError("");
    setExplanationError("");
    setSelectionError("");
    setActiveImage("original");
    if (browseRef.current) browseRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const chooseFile = nextFile => {
    if (!nextFile) return;
    const validationMessage = validateRiceLeafFile(nextFile);
    setSelectionError(validationMessage);
    setAnalysisError("");
    setResult(null);
    setExplanationError("");
    setPreviewReady(false);
    setActiveImage("original");
    if (validationMessage) {
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  };

  const onInputChange = event => {
    chooseFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const analyze = async () => {
    if (!file || !previewReady || analyzing) return;
    setAnalyzing(true);
    setAnalysisError("");
    setResult(null);
    setExplanationError("");
    try {
      const prediction = await analyzeRiceLeaf(file);
      setResult(prediction);
      setActiveImage("original");
    } catch (error) {
      setAnalysisError(error.response?.data?.detail || error.response?.data?.message || error.message || "Analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const generateExplanation = async () => {
    if (!file || explanationLoading || !riceDiseaseApiConfig.explanationReady) return;
    setExplanationLoading(true);
    setExplanationError("");
    try {
      const explanation = await requestRiceLeafExplanation(file);
      if (!explanation.heatmap) throw new Error("The explanation service did not return a heatmap image.");
      setResult(current => current ? { ...current, heatmap: explanation.heatmap, explanationMethod: explanation.explanationMethod } : current);
      setActiveImage("heatmap");
    } catch (error) {
      setExplanationError(error.response?.data?.detail || error.response?.data?.message || error.message || "The explanation could not be loaded.");
    } finally {
      setExplanationLoading(false);
    }
  };

  const dropFile = event => {
    event.preventDefault();
    setDragActive(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const statusDetails = result?.status === "disease_detected"
    ? { title: result.predictedClass || "Disease detected", text: "The model marked this image for review. This is an AI screening result, not a confirmed diagnosis.", style: "border-amber-200 bg-amber-50 text-amber-950", Icon: AlertCircle }
    : result?.status === "no_disease_detected"
      ? { title: "No disease detected above the model threshold", text: "The model did not report a disease above its configured detection threshold. This does not guarantee the plant is disease-free.", style: "border-green-200 bg-green-50 text-green-950", Icon: CheckCircle2 }
      : result?.status === "invalid_image"
        ? { title: "The service could not use this image", text: result.explanation || "Try a clear, well-lit photo focused on one rice leaf.", style: "border-red-200 bg-red-50 text-red-950", Icon: AlertCircle }
        : result
          ? { title: "No reliable prediction", text: result.explanation || "The model did not return a reliable result for this image. Try a sharper photo in good light, or ask an agricultural expert to inspect the crop.", style: "border-slate-200 bg-slate-50 text-slate-900", Icon: AlertCircle }
          : null;

  const currentImage = activeImage === "annotated" ? result?.annotatedImage : activeImage === "heatmap" ? result?.heatmap : previewUrl;
  const annotatedAvailable = Boolean(result?.annotatedImage) && result?.status !== "no_disease_detected" && result?.predictedClass !== "Healthy";

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-4xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><ScanLine size={29}/></div>
      <p className="mt-5 text-sm font-extrabold uppercase tracking-[.16em] text-orange-700">Rice crop health</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">Rice Disease Detection</h1>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">Upload a photo of a rice leaf for AI-based disease screening. The model can look for Bacterial Leaf Blight, Brown Spot, Rice Blast, or a healthy appearance.</p>
    </div>

    {!riceDiseaseApiConfig.predictionReady && <div role="status" className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><AlertCircle className="mt-0.5 shrink-0" size={20}/><p className="leading-6"><strong>Analysis is not connected yet.</strong> Image selection and preview are available. Configure the FastAPI prediction endpoint and multipart image field before analysis can run.</p></div>}

    <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_.92fr]">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-gov sm:p-7" aria-labelledby="upload-title">
        <div><h2 id="upload-title" className="text-xl font-extrabold text-gray-900 sm:text-2xl">Upload a rice leaf photo</h2><p className="mt-2 text-sm leading-6 text-gray-600">Choose a focused, well-lit image with the leaf clearly visible. JPG, JPEG, PNG, or WEBP; maximum size 10 MB.</p></div>
        <div
          onDragEnter={event => { event.preventDefault(); setDragActive(true); }}
          onDragOver={event => event.preventDefault()}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragActive(false); }}
          onDrop={dropFile}
          className={`mt-5 rounded-3xl border-2 border-dashed p-4 transition sm:p-5 ${dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50/70"}`}
        >
          {previewUrl ? <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <img src={previewUrl} alt="Preview of selected rice leaf" onLoad={() => setPreviewReady(true)} onError={() => { setPreviewReady(false); setSelectionError("This file could not be opened as an image. Choose a valid JPG, PNG, or WEBP photo."); setFile(null); setPreviewUrl(""); }} className="mx-auto max-h-[360px] w-full object-contain" />
            <button type="button" onClick={clearSelection} aria-label="Remove selected image" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md hover:bg-white"><Trash2 size={19}/></button>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-white">
              <span className="min-w-0 truncate text-sm font-semibold">{file?.name}</span>
              <button type="button" onClick={() => browseRef.current?.click()} className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-sm font-bold backdrop-blur hover:bg-white/25">Replace</button>
            </div>
          </div> : <div className="flex min-h-[240px] flex-col items-center justify-center px-3 py-7 text-center sm:min-h-[280px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-700 shadow-sm"><FileImage size={29}/></div>
            <p className="mt-4 text-lg font-bold text-gray-800">Drop your leaf photo here</p>
            <p className="mt-1 text-sm text-gray-500">or browse files from your device</p>
            <button type="button" onClick={() => browseRef.current?.click()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"><Upload size={18}/>Browse images</button>
          </div>}
        </div>
        <input ref={browseRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={onInputChange} className="sr-only" aria-label="Browse for a rice leaf image" />
        <input ref={cameraRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" capture="environment" onChange={onInputChange} className="sr-only" aria-label="Take or choose a rice leaf photo" />
        <div className="mt-4 flex flex-col gap-3 min-[420px]:flex-row">
          <button type="button" onClick={() => cameraRef.current?.click()} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-bold text-orange-800 transition hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"><Camera size={19}/>Take or choose photo</button>
          <button type="button" onClick={analyze} disabled={!file || !previewReady || analyzing} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-extrabold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"><ScanLine size={19}/>{analyzing ? "Analyzing…" : "Analyze Leaf"}</button>
        </div>
        {selectionError && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800"><AlertCircle className="mt-0.5 shrink-0" size={18}/>{selectionError}</p>}
        {analysisError && <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 shrink-0" size={19}/><div><h3 className="font-bold">Analysis unavailable</h3><p className="mt-1 text-sm leading-6">{analysisError}</p></div></div>{file && <button type="button" onClick={analyze} disabled={analyzing || !previewReady} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-bold hover:bg-red-100 disabled:opacity-60"><RefreshCw size={16}/>Retry with this image</button>}</div>}
        {analyzing && <div role="status" aria-live="polite" className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-orange-950"><LoaderCircle className="animate-spin" size={22}/><div><p className="font-bold">AI is analyzing the image</p><p className="mt-0.5 text-sm">This can take a little while. Keep this page open.</p></div></div>}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-green-50 p-5 shadow-gov sm:p-7" aria-labelledby="result-title" aria-live="polite">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-govGreen shadow-sm"><Sprout size={23}/></div><div><h2 id="result-title" className="text-xl font-extrabold text-gray-900">Screening result</h2><p className="text-sm text-gray-600">AI support for an initial review</p></div></div>
        {analyzing ? <div className="flex min-h-[280px] flex-col items-center justify-center text-center"><LoaderCircle className="animate-spin text-orange-600" size={42}/><p className="mt-4 text-lg font-bold">Checking the leaf image…</p><p className="mt-1 max-w-xs text-sm leading-6 text-gray-600">The result and any available explanation will appear here.</p></div>
          : statusDetails ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
            <div className={`rounded-2xl border p-4 ${statusDetails.style}`}><div className="flex items-start gap-3"><statusDetails.Icon size={22} className="mt-0.5 shrink-0"/><div className="min-w-0"><h3 className="text-lg font-extrabold">{statusDetails.title}</h3><p className="mt-1 text-sm leading-6">{statusDetails.text}</p>{result.predictedClass && <p className="mt-2 font-semibold">Model class: {result.predictedClass}<span className="font-normal"> · <Confidence value={result.confidence}/></span></p>}</div></div></div>
            {result.explanation && <p className="leading-7 text-gray-700">{result.explanation}</p>}
            {result.detections.length > 0 && <div className="rounded-2xl border border-gray-200 bg-white p-4"><h3 className="font-bold text-gray-900">Classes reported by the model</h3><ul className="mt-3 space-y-2">{result.detections.map((detection, index) => <li key={`${detection.className}-${index}`} className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-gray-700">{detection.className}</span><span className="text-gray-500"><Confidence value={detection.confidence}/></span></li>)}</ul></div>}
            {result.status === "invalid_image" && <button type="button" onClick={clearSelection} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-bold text-gray-800 hover:bg-gray-50"><ImagePlus size={18}/>Choose another image</button>}
            <div className="overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-sm">
              <div className="mb-2 flex flex-wrap gap-2 p-1" role="group" aria-label="Choose image view">
                {[{ id: "original", label: "Original", available: Boolean(previewUrl) }, { id: "annotated", label: "Detections", available: annotatedAvailable }, { id: "heatmap", label: "AI heatmap", available: Boolean(result.heatmap) }].map(view => <button key={view.id} type="button" disabled={!view.available} aria-pressed={activeImage === view.id} onClick={() => setActiveImage(view.id)} className={`min-h-10 rounded-lg px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:text-gray-300 ${activeImage === view.id ? "bg-orange-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-orange-50"}`}>{view.label}</button>)}
              </div>
              {currentImage && <figure><img src={currentImage} alt={activeImage === "heatmap" ? "AI explanation heatmap for the rice leaf" : activeImage === "annotated" ? "Leaf image with model detection annotations" : "Original uploaded rice leaf"} className="max-h-[340px] w-full rounded-xl bg-gray-50 object-contain"/><figcaption className="px-2 py-2 text-xs leading-5 text-gray-500">{activeImage === "annotated" ? "Detection boxes show regions marked by the object detector." : activeImage === "heatmap" ? `The heatmap indicates image regions influencing the selected model output${result.explanationMethod ? ` (${result.explanationMethod})` : ""}. It is not proof of disease.` : "Original photo selected for screening."}</figcaption></figure>}
              {activeImage === "heatmap" && currentImage && <div className="mt-2 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"><div><p className="mb-1 text-xs font-bold text-gray-600">Original</p><img src={previewUrl} alt="Original rice leaf for comparison" className="max-h-40 w-full rounded-lg bg-gray-50 object-contain"/></div><div><p className="mb-1 text-xs font-bold text-gray-600">AI influence heatmap</p><img src={result.heatmap} alt="AI heatmap comparison" className="max-h-40 w-full rounded-lg bg-gray-50 object-contain"/></div></div>}
            </div>
            <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={clearSelection} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-700"><RefreshCw size={17}/>Analyze another image</button></div>
          </motion.div>
          : analysisError ? <div className="flex min-h-[280px] flex-col items-center justify-center px-3 text-center"><AlertCircle size={38} className="text-red-500"/><h3 className="mt-4 text-lg font-bold text-gray-900">No result was returned</h3><p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Your selected image is kept so you can retry after the analysis service is available.</p></div>
          : <div className="flex min-h-[280px] flex-col items-center justify-center px-3 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-orange-600 shadow-sm"><ImagePlus size={31}/></div><h3 className="mt-4 text-lg font-bold text-gray-900">Your screening result will appear here</h3><p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Select a clear rice leaf photo. Analysis becomes available when the FastAPI disease endpoint is configured.</p></div>}
      </section>
    </div>

    {result && <div className="mx-auto mt-6 grid max-w-6xl gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-gov sm:p-8" aria-labelledby="xai-title">
        <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><ScanLine size={23}/></div><div><h2 id="xai-title" className="text-2xl font-extrabold text-gray-900">Why did the AI make this prediction?</h2><p className="mt-2 leading-6 text-gray-600">An explanation image, when provided, highlights regions that influenced the model output. It is an aid to review—not proof that a disease is present.</p></div></div>
        {result.heatmap ? <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/60 p-4"><p className="text-sm font-bold text-orange-950">AI explanation available{result.explanationMethod ? ` · ${result.explanationMethod}` : ""}</p><p className="mt-1 text-sm leading-6 text-orange-950/80">Use the image comparison controls above to switch between the original photo, detector annotations, and the AI influence heatmap. Detection boxes and explanation heatmaps represent different things.</p></div>
          : <div className="mt-5 rounded-2xl bg-gray-50 p-4"><p className="font-semibold text-gray-800">An explanation heatmap was not returned.</p><p className="mt-1 text-sm leading-6 text-gray-600">The model can still provide a screening result without a heatmap. An explanation service can be connected separately.</p>{explanationError && <p role="alert" className="mt-2 text-sm text-red-700">{explanationError}</p>}{riceDiseaseApiConfig.explanationReady && <button type="button" onClick={generateExplanation} disabled={explanationLoading} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 font-bold text-orange-800 hover:bg-orange-50 disabled:opacity-60">{explanationLoading ? <><LoaderCircle className="animate-spin" size={18}/>Generating explanation…</> : <><ScanLine size={18}/>Generate explanation</>}</button>}</div>}
        {explanationLoading && <p role="status" className="mt-3 flex items-center gap-2 text-sm text-orange-800"><LoaderCircle className="animate-spin" size={17}/>Generating the image explanation…</p>}
      </section>
      <Advisory advisory={result.advisory}/>
    </div>}
    {!result && <div className="mx-auto mt-6 max-w-6xl"><Advisory advisory={null}/></div>}

    <p className="mx-auto mt-6 max-w-6xl rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 text-xs leading-5 text-gray-500">AI screening can miss signs or return an incorrect result. Check the crop in person and contact a local agricultural expert if plants look unwell. A healthy prediction is not a guarantee that a plant is disease-free.</p>
  </div>;
}
