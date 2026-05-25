import React, { useState, useCallback } from 'react';
import { Calendar, Clock, MapPin, Navigation, User, Loader2 } from 'lucide-react';
import { BirthFormData } from '../lib/engineFacade';
import { getJainPanchang } from '../lib/calendarEngine';

interface BirthDataFormProps {
  onSubmit: (data: BirthFormData) => void;
}

// Nominatim (OpenStreetMap) geocoding — free, no API key required
async function geocodeCity(cityName: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'hi,en' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length > 0) {
      const lat = parseFloat(data[0].lat).toFixed(4);
      const lng = parseFloat(data[0].lon).toFixed(4);
      return { lat: `${lat}° N`, lng: `${lng}° E` };
    }
  } catch { /* network error — return null, user fills manually */ }
  return null;
}

export default function BirthDataForm({ onSubmit }: BirthDataFormProps) {
  const [formData, setFormData] = useState<BirthFormData>({
    fullName: '',
    dob: '',
    time: '',
    place: '',
    lat: '',
    lng: '',
    gender: 'पुरुष'
  });

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);

  const handlePlaceChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlace = e.target.value;
    setFormData(prev => ({ ...prev, place: newPlace, lat: '', lng: '' }));
    setGeocodeError(false);

    if (newPlace.trim().length < 3) return;

    // Debounce: geocode after user stops typing
    const timer = setTimeout(async () => {
      setGeocoding(true);
      const coords = await geocodeCity(newPlace.trim());
      setGeocoding(false);
      if (coords) {
        setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }));
        setShowManualCoords(false);
        setGeocodeError(false);
      } else {
        setGeocodeError(true);
        setShowManualCoords(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.dob && formData.time && formData.place && formData.gender) {
      // If no coords yet, use defaults for India center (Ujjain — traditional Jyotish meridian)
      const submitData: BirthFormData = {
        ...formData,
        lat: formData.lat || '23.1765° N',
        lng: formData.lng || '75.7885° E'
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFFBEB' }}>
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-xl overflow-hidden border border-orange-100">

        {/* Header */}
        <div className="bg-gradient-to-b from-orange-50 to-white pt-8 pb-6 px-8 text-center border-b border-orange-100">
          <h1 className="text-xl md:text-2xl font-bold text-red-900 mb-2 font-serif">॥ जय जिनेन्द्र ॥</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">दिगम्बर जैन ज्योतिष कुण्डली</h2>
          <p className="text-orange-900/70 font-medium">अपना जन्म विवरण भरें / Enter your birth details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Field 1: Full Name */}
          <div>
            <label className="block mb-1.5">
              <span className="text-gray-900 font-bold text-lg">पूरा नाम</span>
              <span className="text-gray-500 text-sm ml-2 font-normal">(Full Name)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-orange-400 w-5 h-5" />
              </div>
              <input
                type="text"
                required
                placeholder="आपका पूरा नाम"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          {/* Field 2: Date of Birth */}
          <div>
            <label className="block mb-1.5">
              <span className="text-gray-900 font-bold text-lg">जन्म तिथि</span>
              <span className="text-gray-500 text-sm ml-2 font-normal">(Date of Birth)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-orange-400 w-5 h-5" />
              </div>
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            {formData.dob && (() => {
              const panchang = getJainPanchang(new Date(formData.dob));
              return (
                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm">
                  <span className="block font-bold text-indigo-900 mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> जैन पंचांग (Live Preview)</span>
                  <div className="grid grid-cols-2 gap-2 text-indigo-800">
                    <div><strong>तिथि:</strong> {panchang.tithi}</div>
                    <div><strong>मास:</strong> {panchang.masa}</div>
                    <div><strong>वार:</strong> {panchang.vara}</div>
                    {panchang.jainFestival && <div className="col-span-2 text-rose-600 font-bold mt-1">✨ {panchang.jainFestival}</div>}
                  </div>
                </div>
              );
            })()}
            <p className="text-xs text-gray-400 mt-1 ml-1">सटीक नक्षत्र गणना के लिए सही तिथि आवश्यक है</p>
          </div>

          {/* Field 3: Time of Birth */}
          <div>
            <label className="block mb-1.5">
              <span className="text-gray-900 font-bold text-lg">जन्म समय</span>
              <span className="text-gray-500 text-sm ml-2 font-normal">(Time of Birth — IST)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="text-orange-400 w-5 h-5" />
              </div>
              <input
                type="time"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Field 4: Place of Birth */}
          <div>
            <label className="block mb-1.5">
              <span className="text-gray-900 font-bold text-lg">जन्म स्थान</span>
              <span className="text-gray-500 text-sm ml-2 font-normal">(Place of Birth)</span>
            </label>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {geocoding
                  ? <Loader2 className="text-orange-400 w-5 h-5 animate-spin" />
                  : <MapPin className="text-orange-400 w-5 h-5" />
                }
              </div>
              <input
                type="text"
                required
                placeholder="शहर का नाम (City, e.g. Mumbai)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800"
                value={formData.place}
                onChange={handlePlaceChange}
              />
            </div>

            {/* Geocoded coordinates display */}
            {formData.lat && formData.lng && !geocodeError && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <Navigation className="w-3 h-3 shrink-0" />
                अक्षांश: {formData.lat}, देशांतर: {formData.lng}
              </div>
            )}

            {/* Geocode error + manual input */}
            {geocodeError && (
              <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 mb-2">
                शहर नहीं मिला। नीचे अक्षांश/देशांतर मैन्युअल भरें (वैकल्पिक)।
              </div>
            )}
            {showManualCoords && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="अक्षांश (Lat, e.g. 19.076)"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-orange-400"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="देशांतर (Lng, e.g. 72.877)"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-orange-400"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Field 5: Gender */}
          <div>
            <label className="block mb-2">
              <span className="text-gray-900 font-bold text-lg">लिंग</span>
              <span className="text-gray-500 text-sm ml-2 font-normal">(Gender)</span>
            </label>
            <div className="flex gap-4">
              {['पुरुष', 'स्त्री', 'अन्य'].map(g => (
                <label
                  key={g}
                  className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center gap-2 transition-all ${
                    formData.gender === g
                      ? 'bg-orange-50 border-orange-500 text-orange-900'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-medium text-base">
                    {g} <span className="text-xs opacity-70 ml-1">({g === 'पुरुष' ? 'Male' : g === 'स्त्री' ? 'Female' : 'Other'})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
          >
            कुण्डली बनाएँ <span className="text-orange-100 text-lg font-normal ml-1">/ Generate Kundali</span>
          </button>
        </form>
      </div>
    </div>
  );
}
