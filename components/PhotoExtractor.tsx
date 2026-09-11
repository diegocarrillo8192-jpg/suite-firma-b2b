"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultOptions,
  extractInkToCanvas,
  loadImageFromSrc,
  readFileAsDataURL,
  type ExtractOptions,
} from "@/lib/processing";
import UploadDropzone from "@/components/photo/UploadDropzone";
import FilterControls from "@/components/photo/FilterControls";
import ResultPanel from "@/components/photo/ResultPanel";
import HowItWorks from "@/components/photo/HowItWorks";

export default function PhotoExtractor() {
  const [source, setSource] = useState<string | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [options, setOptions] = useState<ExtractOptions>(defaultOptions);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("El archivo no es una imagen válida.");
      return;
    }
    setError(null);
    try {
      const dataUrl = await readFileAsDataURL(file);
      const img = await loadImageFromSrc(dataUrl);
      setSource(dataUrl);
      setSourceImg(img);
    } catch {
      setError("No se pudo leer la imagen.");
    }
  }, []);

  useEffect(() => {
    if (!sourceImg) return;
    const timer = setTimeout(() => {
      setProcessing(true);
      try {
        setResult(extractInkToCanvas(sourceImg, options).toDataURL("image/png"));
      } catch {
        setError("No se pudo procesar la imagen.");
      } finally {
        setProcessing(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [sourceImg, options]);

  const displayResult = sourceImg ? result : null;

  const download = () => {
    if (!displayResult) return;
    const a = document.createElement("a");
    a.href = displayResult;
    const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
    a.download = `firma-png-transparente-${stamp}.png`;
    a.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const resetAll = () => {
    setSource(null);
    setSourceImg(null);
    setResult(null);
    setOptions(defaultOptions);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <UploadDropzone source={source} error={error} onFile={loadFile} />
        <FilterControls options={options} onChange={setOptions} />
      </div>

      <div className="space-y-6">
        <ResultPanel
          result={displayResult}
          processing={processing}
          saved={saved}
          source={source}
          width={sourceImg?.naturalWidth}
          height={sourceImg?.naturalHeight}
          onDownload={download}
          onReset={resetAll}
        />
        <HowItWorks />
      </div>
    </div>
  );
}
