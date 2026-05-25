import React, { ReactNode } from 'react';
import VartamanTab from './VartamanTab';
import BirthChart from './BirthChart';
import KarmaProfile from './KarmaProfile';
import JaapSadhana from './JaapSadhana';
import YantraSadhana from './YantraSadhana';
import ViseshPujas from './ViseshPujas';
import TantraSadhana from './TantraSadhana';
import DharmaMarg from './DharmaMarg';
import VratCalendar from './VratCalendar';
import TirthaYatra from './TirthaYatra';
import MuhurtaCalculator from './MuhurtaCalculator';
import SadhanaDashboard from './SadhanaDashboard';
import { UserProfile } from '../lib/engineFacade';
import { getTodayContext } from '../lib/engineFacade';
import { calculateRuleScore } from '../lib/intelligence/ruleScoring';
import { composeNarrativeBundle } from '../lib/narrativeComposer';
import { getKarmaSadhana } from '../data/sadhana';
import { ShieldCheck } from 'lucide-react';
import DecisionTraceCard from './DecisionTraceCard';

interface Props {
  profile: UserProfile;
  forExport?: boolean;
}

const ReportPage = ({ children, pageNumber, totalPages }: { children: ReactNode, pageNumber?: number, totalPages?: number }) => (
  <div className="pdf-page bg-white relative flex flex-col mx-auto" style={{
    width: '1024px',
    minHeight: '1448px',
    padding: '3rem',
    pageBreakAfter: 'always',
    breakAfter: 'page',
    boxSizing: 'border-box',
  }}>
    <div className="border-4 border-amber-600/20 rounded-2xl p-8 relative flex flex-col shadow-sm" style={{ minHeight: '1330px' }}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600 rounded-br-xl" />
      
      {/* Header pattern or logo could go here */}
      <div className="w-full flex flex-col container-content relative z-10">
        {children}
      </div>

      {/* Footer */}
      {pageNumber && (
        <div className="absolute bottom-2 left-0 w-full flex justify-between px-8 text-amber-700/60 font-semibold text-sm">
          <span>दिगम्बर जैन कुण्डली रिपोर्ट</span>
          <span>पृष्ठ {pageNumber} {totalPages && `/ ${totalPages}`}</span>
        </div>
      )}
    </div>
  </div>
);

const FullPrintableReport = ({ profile, forExport }: Props) => {
  const today = getTodayContext();
  const decision = calculateRuleScore(profile, today, profile.dominantKarma);
  const narrative = composeNarrativeBundle(profile, today, decision);
  return (
    <div className={`${forExport ? 'flex' : 'hidden print:flex'} flex-col bg-white text-black font-sans text-left w-full mx-auto justify-center items-center`} style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', background: '#f1f5f9' }}>
      
      {/* Cover Page */}
      <ReportPage>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
          <div className="w-32 h-32 border-8 border-amber-100 rounded-full flex items-center justify-center bg-amber-50 mb-4 shadow-inner">
             {/* Simple Om/Swastik placeholder */}
             <span className="text-6xl text-amber-600 font-serif">ॐ</span>
          </div>
          <h1 className="text-7xl font-serif font-bold text-amber-900 mb-8 border-b-4 border-amber-200 pb-8 inline-block px-12">दिगम्बर जैन कुण्डली</h1>
          <p className="text-4xl text-amber-800 tracking-wide font-medium">आध्यात्मिक कर्म-विश्लेषण एवं साधना मार्ग</p>
          
          <div className="mt-24 w-full max-w-2xl bg-gradient-to-b from-amber-50 to-white px-12 py-10 rounded-2xl border border-amber-200 text-left shadow-lg">
             <h2 className="text-3xl font-bold text-amber-900 mb-8 border-b-2 border-amber-200 pb-4 flex items-center gap-4">
               <span className="bg-amber-100 p-2 rounded-lg text-amber-700">❖</span> जन्म विवरण
             </h2>
             <div className="space-y-6 text-2xl text-amber-950 font-medium">
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">नाम:</span> <span>{profile.name}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">जन्म-स्थान:</span> <span>{profile.formData?.place || '-'}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">जन्म-नक्षत्र:</span> <span>{profile.birthNakshatraHindi || profile.birthNakshatra}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">महादशा:</span> <span>{profile.currentDasha?.lord_hindi || profile.currentDashaLegacy}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">अंतर्दशा:</span> <span>{profile.currentDasha?.antardashaInfo?.lord_hindi || '-'}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">प्रत्यंतर्दशा:</span> <span>{profile.currentDasha?.pratyantardasha?.lord_hindi || '-'}</span></div>
               <div className="flex justify-between border-b border-amber-100 pb-3"><span className="text-amber-700">प्रमुख कर्म:</span> <span className="font-bold text-red-700">{profile.dominantKarma}</span></div>
               <div className="flex justify-between pb-2"><span className="text-amber-700">आराध्य:</span> <span>श्री {profile.tirthankarAffinity}</span></div>
             </div>
          </div>
          
          <p className="text-amber-700/60 mt-auto pt-20 text-lg font-serif">यह कुण्डली ज्योतिषीय नहीं, अपितु आध्यात्मिक साधना का मार्गदर्शक है।</p>
        </div>
      </ReportPage>

      {/* Index Page */}
      <ReportPage pageNumber={1} totalPages={23}>
        <div className="py-12 px-8 flex-1 flex flex-col">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-amber-900 inline-block border-b-4 border-amber-300 pb-4 px-12 relative">
               <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-2xl text-amber-400">❖</span>
               अनुक्रमणिका
               <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-2xl text-amber-400">❖</span>
            </h2>
          </div>
          <div className="w-full max-w-3xl mx-auto space-y-6">
            {[
              { num: '१', title: 'वर्तमान विश्लेषण', page: '2' },
              { num: '२', title: 'अष्ट-कर्म मंडल', page: '3' },
              { num: '३', title: 'जन्म-नक्षत्र विश्लेषण', page: '4' },
              { num: '४', title: 'ग्रह एवं योग', page: '5' },
              { num: '५', title: 'कर्म मण्डला', page: '6' },
              { num: '६', title: 'दैनिक चर्या एवं जाप', page: '7' },
              { num: '७', title: 'उन्नत जाप साधना भाग १', page: '8' },
              { num: '८', title: 'उन्नत जाप साधना भाग २', page: '9' },
              { num: '९', title: 'यंत्र साधना भाग १', page: '10' },
              { num: '१०', title: 'यंत्र साधना भाग २', page: '11' },
              { num: '११', title: 'पंच कल्याणक भाग १', page: '12' },
              { num: '१२', title: 'विशेष पूजा भाग २', page: '13' },
              { num: '१३', title: 'तंत्र साधना', page: '14' },
              { num: '१४', title: 'धर्ममार्ग भाग १', page: '15' },
              { num: '१५', title: 'धर्ममार्ग भाग २', page: '16' },
              { num: '१६', title: 'पाक्षिक व्रत', page: '17' },
              { num: '१७', title: 'तीर्थ यात्रा भाग १', page: '18' },
              { num: '१८', title: 'तीर्थ यात्रा भाग २', page: '19' },
              { num: '१९', title: 'मुहूर्त', page: '20' },
              { num: '२०', title: 'साधना ट्रैकर भाग १', page: '21' },
              { num: '२१', title: 'साधना ट्रैकर भाग २', page: '22' },
              { num: '२२', title: 'निष्कर्ष', page: '23' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <span className="text-xl font-bold text-amber-400 min-w-8">{item.num}.</span>
                <span className="text-xl font-bold text-amber-900">{item.title}</span>
                <div className="flex-1 border-b-2 border-dotted border-amber-200 mt-2 mx-2"></div>
                <span className="text-xl font-bold text-amber-600">{item.page}</span>
              </div>
            ))}
          </div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={2} totalPages={23}>
        <div className="w-full"><VartamanTab profile={profile} part={1} forExport={true} /></div>
      </ReportPage>

      <ReportPage pageNumber={3} totalPages={23}>
        <div className="w-full"><VartamanTab profile={profile} part={2} forExport={true} /></div>
      </ReportPage>

      <ReportPage pageNumber={4} totalPages={23}>
        <div className="w-full"><BirthChart profile={profile} part={1} /></div>
      </ReportPage>

      <ReportPage pageNumber={5} totalPages={23}>
        <div className="w-full"><BirthChart profile={profile} part={2} /></div>
      </ReportPage>

      <ReportPage pageNumber={6} totalPages={23}>
        <div className="w-full"><KarmaProfile profile={profile} /></div>
      </ReportPage>
      
      <ReportPage pageNumber={7} totalPages={23}>
        {(() => {
          const sadhana = getKarmaSadhana(profile.dominantKarmaEn);
          return (
            <div className="w-full">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold text-orange-900 border-b-2 border-orange-200 pb-4 inline-block px-8">४. उपाय एवं साधना</h2>
                <p className="text-xl text-orange-800 mt-4">आपके <strong>{profile.dominantKarma}</strong> कर्म के शमन हेतु अनुशंसित महा-साधनाएँ (विस्तृत)</p>
              </div>

              <div className="space-y-8">
                <div className="bg-orange-50 p-8 rounded-2xl border border-orange-200 shadow-sm">
                  <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-orange-600" /> दैनिक जैन जीवन-चर्या</h3>
                  <ul className="space-y-5 text-xl text-orange-950 ml-4">
                    <li className="flex gap-4"><span className="text-orange-500 font-bold">▶</span> <div><strong>प्रातः-नियम:</strong> {sadhana.pratahNiyam}</div></li>
                    <li className="flex gap-4"><span className="text-orange-500 font-bold">▶</span> <div><strong>देव-दर्शन:</strong> प्रतिदिन देव-दर्शन (यह नियम आपके {profile.dominantKarma} कर्म की तीव्रता घटाएगा)।</div></li>
                    <li className="flex gap-4"><span className="text-orange-500 font-bold">▶</span> <div><strong>सायं-नियम:</strong> {sadhana.saayamNiyam}</div></li>
                    <li className="flex gap-4"><span className="text-orange-500 font-bold">▶</span> <div><strong>सामान्य उपाय:</strong> {sadhana.samanyaUpaya}</div></li>
                    <li className="flex gap-4"><span className="text-orange-500 font-bold">▶</span> <div><strong>विशेष उपाय:</strong> {sadhana.visheshUpaya}</div></li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-3">आज का कर्म-प्रकटन</h3>
                  <p className="text-lg text-amber-800">{narrative.karmaManifestation}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-blue-900 text-base">{narrative.coreSummary}</p>
                  <DecisionTraceCard decision={decision} />
                </div>
              </div>
            </div>
          );
        })()}
      </ReportPage>

      <ReportPage pageNumber={8} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
            <div><JaapSadhana profile={profile} part={1} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={9} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
            <div><JaapSadhana profile={profile} part={2} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={10} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
          <h3 className="text-3xl font-bold text-orange-900 border-b-2 border-orange-200 pb-2 mb-4">उन्नत साधना एवं यंत्र स्थापना</h3>
          <div><YantraSadhana profile={profile} part={1} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={11} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
          <div><YantraSadhana profile={profile} part={2} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={12} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
          <div><ViseshPujas profile={profile} part={1} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={13} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
          <div><ViseshPujas profile={profile} part={2} /></div>
        </div>
      </ReportPage>

      <ReportPage pageNumber={14} totalPages={23}>
        <div className="w-full space-y-8 pt-2">
          <h3 className="text-3xl font-bold text-orange-900 border-b-2 border-orange-200 pb-2 mb-4">तंत्र साधना</h3>
          <div><TantraSadhana profile={profile} /></div>
        </div>
      </ReportPage>
      
      <ReportPage pageNumber={15} totalPages={23}>
        <div className="w-full"><DharmaMarg profile={profile} forExport={true} part={1} /></div>
      </ReportPage>

      <ReportPage pageNumber={16} totalPages={23}>
        <div className="w-full"><DharmaMarg profile={profile} forExport={true} part={2} /></div>
      </ReportPage>

      <ReportPage pageNumber={17} totalPages={23}>
        <div className="w-full"><VratCalendar profile={profile} /></div>
      </ReportPage>

      <ReportPage pageNumber={18} totalPages={23}>
        <div className="w-full"><TirthaYatra profile={profile} forExport={true} part={1} /></div>
      </ReportPage>

      <ReportPage pageNumber={19} totalPages={23}>
        <div className="w-full"><TirthaYatra profile={profile} forExport={true} part={2} /></div>
      </ReportPage>

      <ReportPage pageNumber={20} totalPages={23}>
        <div className="w-full"><MuhurtaCalculator profile={profile} /></div>
      </ReportPage>

      <ReportPage pageNumber={21} totalPages={23}>
        <div className="w-full"><SadhanaDashboard profile={profile} forExport={true} part={1} /></div>
      </ReportPage>

      <ReportPage pageNumber={22} totalPages={23}>
        <div className="w-full"><SadhanaDashboard profile={profile} forExport={true} part={2} /></div>
      </ReportPage>

      <ReportPage pageNumber={23} totalPages={23}>
        <div className="flex-1 w-full flex flex-col items-center justify-center text-center space-y-8 px-12">
          <h2 className="text-5xl font-bold text-amber-900">निष्कर्ष</h2>
          <p className="text-2xl text-amber-800 leading-relaxed">
            यह कुण्डली आपके जीवन के कार्मिक विश्लेषण और आत्म-उद्धार के मार्ग को दर्शाती है। निरंतर अभ्यास और साधना से {profile.dominantKarma} कर्म का क्षय अवश्य होगा। धर्म मार्ग पर दृढ़ संकल्पित रहें।
          </p>
          <div className="mt-12 text-amber-500">
            <span className="text-6xl font-serif">ॐ</span>
          </div>
        </div>
      </ReportPage>
      
    </div>
  );
};

export default FullPrintableReport;
