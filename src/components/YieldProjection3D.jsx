import { useTranslation } from "react-i18next";

const CHART = { baseline: 226, top: 58, scale: (226 - 58) / 8, width: 68, depth: 28, depthRise: 16 };

function barGeometry(x, value) {
  const height = Math.max(0, Math.min(Number(value) || 0, 8)) * CHART.scale;
  const y = CHART.baseline - height;
  const { width, depth, depthRise } = CHART;
  return {
    y,
    frontPoints: `${x},${y} ${x + width},${y} ${x + width},${CHART.baseline} ${x},${CHART.baseline}`,
    sidePoints: `${x + width},${y} ${x + width + depth},${y - depthRise} ${x + width + depth},${CHART.baseline - depthRise} ${x + width},${CHART.baseline}`,
    topPoints: `${x},${y} ${x + depth},${y - depthRise} ${x + width + depth},${y - depthRise} ${x + width},${y}`,
  };
}

export default function YieldProjection3D({ predictedYield, optimizedYield }) {
  const { t } = useTranslation();
  const predicted = Number(predictedYield);
  const optimized = Number(optimizedYield);
  if (!Number.isFinite(predicted) || !Number.isFinite(optimized)) return null;

  const bars = [
    { label: t("prediction.chartPredicted"), value: predicted, x: 174, color: "#16834b", sideColor: "#0b6035", topColor: "#54bd7c" },
    { label: t("prediction.chartOptimized"), value: optimized, x: 348, color: "#e77918", sideColor: "#b64e0c", topColor: "#ffad52" },
  ].map((bar) => ({ ...bar, ...barGeometry(bar.x, bar.value) }));

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50 p-5 shadow-sm sm:p-7" aria-labelledby="yield-3d-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.15em] text-emerald-700">{t("prediction.chartEyebrow")}</p>
          <h2 id="yield-3d-title" className="mt-1 text-xl font-extrabold text-gray-900">{t("prediction.chartTitle")}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">{t("prediction.chartDescription")}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">{t("prediction.unitLong")}</span>
      </div>

      <div className="mt-3 overflow-hidden" role="img" aria-label={t("prediction.chartAria",{predicted:predicted.toFixed(2),optimized:optimized.toFixed(2)})}>
        <svg viewBox="0 0 540 300" className="mx-auto block w-full max-w-xl" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="yield-floor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#d9f1e2" />
            </linearGradient>
          </defs>
          <polygon points="102,235 443,235 477,216 136,216" fill="url(#yield-floor)" stroke="#c6e8d2" />
          {[0, 2, 4, 6, 8].map((tick) => {
            const y = CHART.baseline - tick * CHART.scale;
            return <g key={tick}>
              <line x1="125" y1={y} x2="451" y2={y - CHART.depthRise} stroke="#d6e5dc" strokeDasharray={tick ? "4 5" : undefined} />
              <text x="111" y={y + 4} textAnchor="end" fontSize="11" fill="#64746a">{tick}</text>
            </g>;
          })}
          {bars.map((bar) => <g key={bar.label}>
            <polygon points={bar.sidePoints} fill={bar.sideColor} />
            <polygon points={bar.topPoints} fill={bar.topColor} />
            <polygon points={bar.frontPoints} fill={bar.color} />
            <text x={bar.x + CHART.width / 2 + CHART.depth / 2} y={Math.max(38, bar.y - 9)} textAnchor="middle" fontSize="15" fontWeight="800" fill="#1f2937">{bar.value.toFixed(2)}</text>
            <text x={bar.x + CHART.width / 2 + CHART.depth / 2} y="266" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">{bar.label}</text>
          </g>)}
          <text x="120" y="42" fontSize="11" fill="#64746a">{t("prediction.chartAxis")}</text>
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-700" aria-hidden="true">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-700" />{t("prediction.chartPredicted")}</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-600" />{t("prediction.chartOptimized")}</span>
      </div>
      <p className="mt-4 text-xs leading-5 text-gray-500">{t("prediction.chartDisclaimer")}</p>
    </section>
  );
}
