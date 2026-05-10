import React, { useRef, useState } from 'react';
import { Printer, Download, Fingerprint, Sparkles, Loader2 } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import FullPrintableReport from './FullPrintableReport';

import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

interface PrintReportProps {
  profile: UserProfile;
}

export default function PrintReport({ profile }: PrintReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Fallback standard browser print
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;

    setIsGenerating(true);

    setTimeout(async () => {
      try {
        const pages = document.querySelectorAll('.pdf-page');
        if (!pages || pages.length === 0) throw new Error("No pages found");

        const A4_WIDTH_MM = 210;

        // Capture all pages first, then build PDF with variable-height pages.
        // IMPORTANT: always fill full A4 width — never scale down to fit height,
        // which would shrink width to ~60mm and make fonts appear 2-3pt.
        const captures: { dataUrl: string; heightMm: number }[] = [];

        for (let i = 0; i < pages.length; i++) {
          const element = pages[i] as HTMLElement;
          await new Promise(r => setTimeout(r, 80));

          const w = element.offsetWidth || 1024;
          const h = element.offsetHeight || 1448;
          const heightMm = Math.round((h / w) * A4_WIDTH_MM);

          const dataUrl = await toJpeg(element, {
            quality: 0.92,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            skipFonts: true,
            width: w,
            height: h,
          });

          if (!dataUrl || dataUrl === 'data:,') {
            console.error(`Page ${i} generated empty image, skipping`);
            continue;
          }

          captures.push({ dataUrl, heightMm });
        }

        if (captures.length === 0) throw new Error('No pages captured');

        // Initialize jsPDF with first page's exact dimensions (variable height).
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [A4_WIDTH_MM, captures[0].heightMm],
        });

        for (let i = 0; i < captures.length; i++) {
          if (i > 0) {
            pdf.addPage([A4_WIDTH_MM, captures[i].heightMm]);
          }
          // Fill page edge-to-edge — no centering, no scaling down.
          pdf.addImage(captures[i].dataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, captures[i].heightMm);
        }

        pdf.save(`Jain_Kundali_${profile.name}.pdf`);
      } catch (error) {
        console.error("PDF generation failed", error);
        alert("PDF generation failed. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Loading overlay spanning entire screen */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100000] bg-white flex flex-col items-center justify-center h-screen w-screen">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">PDF बन रहा है...</h3>
          <p className="text-slate-500">संपूर्ण कुण्डली डाउनलोड होने में कुछ सेकंड लग सकते हैं। कृपया प्रतीक्षा करें।</p>
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
              <strong>नोट:</strong> अगर डाउनलोड बटन काम न करे तो आप सीधे ब्राउज़र से प्रिंट भी कर सकते हैं।
            </p>
            <button 
              onClick={handlePrint}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 px-6 py-3 rounded-lg font-bold transition-all border border-indigo-200"
            >
              <Printer className="w-5 h-5" /> विस्तृत कुण्डली (7+ पेज) प्रिंट करें (Browser Print)
            </button>
          </div>
        </div>
      </div>

      {/* 
        The Printable Element 
        We show it absolutely positioned when generating so html-to-image can capture it. 
      */}
      <div 
        className={isGenerating ? "absolute top-0 left-0 text-black z-[99999] pdf-export-mode" : "hidden print:block text-black"} 
        style={{ width: '1024px', background: 'white' }}
      >
        <div ref={printContainerRef} className="bg-white w-full h-full" style={{ margin: '0 auto', width: '1024px' }}>
          {isGenerating && <FullPrintableReport profile={profile} forExport={true} />}
        </div>
      </div>
    </div>
  );
}
