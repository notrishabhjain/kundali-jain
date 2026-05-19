import React, { useRef, useState } from 'react';
import { Printer, Download, Fingerprint, Sparkles, Loader2 } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import FullPrintableReport from './FullPrintableReport';

import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

interface PrintReportProps {
  profile: UserProfile;
}

async function captureWithRetry(element: HTMLElement, w: number, h: number, attempts = 3): Promise<string> {
  let lastError: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      // Slight wait before each attempt so layout/animations settle
      await new Promise(r => setTimeout(r, 200 + i * 300));
      const dataUrl = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 1.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: false,
        width: w,
        height: h,
        style: {
          // freeze any css animations during capture
          animationPlayState: 'paused',
        },
      });
      if (dataUrl && dataUrl !== 'data:,' && dataUrl.length > 100) {
        return dataUrl;
      }
    } catch (err) {
      lastError = err;
      // Continue to next attempt
    }
  }
  throw lastError || new Error('Capture failed after retries');
}

export default function PrintReport({ profile }: PrintReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setProgress({ done: 0, total: 0 });

    // Wait for React to render the 23-page export tree, then for fonts and images to load,
    // and finally for at least two animation frames so layout is fully settled.
    await new Promise(r => setTimeout(r, 1200));
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch { /* ignore */ }
    }
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await new Promise(r => setTimeout(r, 800));

    try {
      const pages = document.querySelectorAll('.pdf-page');
      if (!pages || pages.length === 0) throw new Error("No pages found");

      const A4_WIDTH_MM = 210;
      const captures: { dataUrl: string; heightMm: number }[] = [];
      setProgress({ done: 0, total: pages.length });

      for (let i = 0; i < pages.length; i++) {
        const element = pages[i] as HTMLElement;

        // Scroll element into the viewport area so layout is fully computed
        try { element.scrollIntoView({ block: 'start', behavior: 'auto' }); } catch { /* ignore */ }
        await new Promise(r => setTimeout(r, 150));

        const w = element.offsetWidth || 1024;
        const h = element.offsetHeight || 1448;
        const heightMm = Math.round((h / w) * A4_WIDTH_MM);

        try {
          const dataUrl = await captureWithRetry(element, w, h, 3);
          captures.push({ dataUrl, heightMm });
        } catch (err) {
          console.error(`Page ${i + 1} capture failed after retries`, err);
          // Add blank placeholder so PDF still has the page slot
          captures.push({ dataUrl: '', heightMm });
        }

        setProgress({ done: i + 1, total: pages.length });
      }

      // Filter out completely failed captures
      const successful = captures.filter(c => c.dataUrl);
      if (successful.length === 0) throw new Error('All page captures failed');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [A4_WIDTH_MM, successful[0].heightMm],
      });

      for (let i = 0; i < successful.length; i++) {
        if (i > 0) {
          pdf.addPage([A4_WIDTH_MM, successful[i].heightMm]);
        }
        pdf.addImage(successful[i].dataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, successful[i].heightMm);
      }

      const safeName = profile.name.replace(/[^a-zA-Z0-9ऀ-ॿ]+/g, '_');
      pdf.save(`Jain_Kundali_${safeName || 'Report'}.pdf`);

      if (successful.length < captures.length) {
        // Some pages failed
        alert(`PDF तैयार हुआ, परन्तु ${captures.length - successful.length} पृष्ठ कैप्चर नहीं हो सके। कृपया एक बार और प्रयास करें।`);
      }
    } catch (error) {
      console.error("PDF generation failed", error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. कृपया कुछ क्षण रुककर पुनः प्रयास करें।`);
    } finally {
      setIsGenerating(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Loading overlay spanning entire screen */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100000] bg-white flex flex-col items-center justify-center h-screen w-screen">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">PDF बन रहा है...</h3>
          <p className="text-slate-500 mb-4">संपूर्ण कुण्डली डाउनलोड होने में कुछ सेकंड लग सकते हैं। कृपया प्रतीक्षा करें।</p>
          {progress.total > 0 && (
            <div className="w-72">
              <div className="text-center text-sm text-slate-600 mb-2">
                पृष्ठ {progress.done} / {progress.total}
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main UI */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Printer className="w-6 h-6 text-slate-600" /> कुण्डली सारांश (Printable Report)
            </h2>
            <p className="text-slate-600 mt-1">अपनी सम्पूर्ण जैन आध्यात्मिक कुण्डली को PDF रूप में सुरक्षित करें।</p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGenerating ? 'PDF बन रहा है...' : 'सम्पूर्ण कुण्डली डाउनलोड करें'}
          </button>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-lg p-8 shadow-sm">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-200 pb-6 mb-8">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">जैन आत्मिक पत्रिका</h1>
            <p className="text-slate-500 font-medium tracking-widest uppercase">कर्म-विज्ञान आधारित पूर्ण कुण्डली डाउनलोड</p>
          </div>

          {/* Basic Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-500" /> जन्म विवरण
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500">नाम:</span> <span className="font-medium">{profile.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">जन्म-स्थान:</span> <span className="font-medium">{profile.formData?.place || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">जन्म-नक्षत्र:</span> <span className="font-medium text-indigo-700">{profile.birthNakshatraHindi || profile.birthNakshatra}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">वर्तमान महादशा:</span> <span className="font-medium text-amber-700">{profile.currentDasha?.lord_hindi || profile.currentDashaLegacy}</span></div>
              </div>
            </div>
            <div className="bg-rose-50 p-5 rounded-lg border border-rose-100">
              <h3 className="font-bold text-rose-900 border-b border-rose-200 pb-2 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" /> आध्यात्मिक सूचकांक
              </h3>
              <div className="space-y-2 text-sm text-rose-800">
                <div className="flex justify-between"><span className="text-rose-600">प्रबल कर्म:</span> <span className="font-bold">{profile.dominantKarma} कर्म</span></div>
                <div className="flex justify-between"><span className="text-rose-600">नक्षत्र स्वभाव:</span> <span className="font-medium">{profile.nakshatraNatureHindi || 'शुभ'}</span></div>
                <div className="flex justify-between"><span className="text-rose-600">अंतर्दशा:</span> <span className="font-medium">{profile.currentDasha?.antardashaInfo?.lord_hindi || '-'}</span></div>
                <div className="flex justify-between"><span className="text-rose-600">प्रत्यंतर्दशा:</span> <span className="font-medium">{profile.currentDasha?.pratyantardasha?.lord_hindi || '-'}</span></div>
                <div className="flex justify-between"><span className="text-rose-600">आराध्य तीर्थंकर:</span> <span className="font-medium">श्री {profile.tirthankarAffinity} भगवान</span></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 mb-4">
              <strong>नोट:</strong> अगर डाउनलोड बटन काम न करे तो आप सीधे ब्राउज़र से प्रिंट भी कर सकते हैं।
            </p>
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 px-6 py-3 rounded-lg font-bold transition-all border border-indigo-200"
            >
              <Printer className="w-5 h-5" /> विस्तृत कुण्डली (23 पेज) प्रिंट करें (Browser Print)
            </button>
          </div>
        </div>
      </div>

      {/*
        Printable element — rendered only while generating (or printing) to avoid
        keeping 23 heavy pages mounted at all times.
      */}
      <div
        className={isGenerating ? 'pdf-export-mode text-black' : 'hidden print:block text-black'}
        style={
          isGenerating
            ? {
                position: 'fixed',
                left: '0',
                top: '0',
                width: '1024px',
                zIndex: 99999,
                background: 'white',
              }
            : { width: '1024px', background: 'white' }
        }
        aria-hidden={!isGenerating}
      >
        <div ref={printContainerRef} className="bg-white" style={{ width: '1024px' }}>
          {isGenerating && <FullPrintableReport profile={profile} forExport={true} />}
        </div>
      </div>
    </div>
  );
}
