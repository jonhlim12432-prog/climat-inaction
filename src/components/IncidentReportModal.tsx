import React, { useState } from 'react';
import {
  X,
  Camera,
  MapPin,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity } from '../types';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incidentData: Partial<Incident>) => Promise<void>;
  initialCategory?: string;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCategory,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<IncidentCategory>(
    (initialCategory as IncidentCategory) || 'flooding'
  );
  const [title, setTitle] = useState('');
  const [barangay, setBarangay] = useState('Sanito');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const barangayOptions = [
    'Sanito',
    'Barangay Central',
    'Baluran',
    'Poblacion',
    'Upper Central Ridge',
    'Titay Coastal',
    'Don Andres',
  ];

  const categoryOptions: Array<{ key: IncidentCategory; label: string; icon: string }> = [
    { key: 'flooding', label: 'Flooding & Drainage', icon: '🌊' },
    { key: 'dumping', label: 'Illegal Dumping', icon: '🗑️' },
    { key: 'water_pollution', label: 'Water Pollution', icon: '🛢️' },
    { key: 'deforestation', label: 'Deforestation / Logging', icon: '🪓' },
    { key: 'air_hazard', label: 'Air Hazard / Open Burning', icon: '💨' },
    { key: 'other', label: 'Other Hazard', icon: '⚠️' },
  ];

  const handleSimulatePhoto = () => {
    // Generate a simulated civic photographic evidence preview
    setPhotoSelected(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23065f46"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="white" font-weight="bold">PHOTO ATTACHED (GEOTAGGED)</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="11" fill="%236ee7b7">ZAMBOANGA SIBUGAY CENRO AUDIT LOG</text></svg>'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        type: categoryOptions.find((c) => c.key === category)?.label || 'Environmental Incident',
        location: location.trim(),
        barangay,
        severity,
        description: description.trim() || 'Citizen reported municipal environmental hazard.',
        coordinates: {
          lat: 7.785 + (Math.random() - 0.5) * 0.03,
          lng: 122.585 + (Math.random() - 0.5) * 0.03,
        },
        imageUrl: photoSelected || undefined,
        reportedBy: isAnonymous ? 'Anonymous Citizen (Whistleblower Protected)' : 'Mark Kenneth Ulgasan',
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#15803d] text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
              Direct Municipal Intake
            </span>
            <h2 className="font-extrabold text-base font-display">
              File Environmental Incident Report
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-display">
              Incident Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your report has been entered into the CENRO digital triage queue. You earned{' '}
              <span className="font-bold text-emerald-700">+50 Eco-Points</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Hazard Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      category === cat.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                2. Incident Summary Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clogged drainage culvert overflowing onto main road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Barangay and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Barangay *
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  {barangayOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Specific Street / Purok *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Purok 3 near Bridge Outflow"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Hazard Severity Rating
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Moderate', 'High', 'Critical'] as IncidentSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      severity === sev
                        ? sev === 'Critical'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : sev === 'High'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload attachment simulation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Photographic Telemetry Evidence
              </label>
              {photoSelected ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 p-2 bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Evidence Photo Attached (Geotagged)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoSelected(null)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Attach Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Browse</span>
                  </button>
                </div>
              )}
            </div>

            {/* Narrative description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Field Observation Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the environmental impact, water color, debris volume, or immediate risk to residents..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
              />
            </div>

            {/* Whistleblower Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Submit as Whistleblower
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Conceal personal identity from public logs (RA 9003 protected)
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Submitting to CENRO...' : 'Transmit Incident Report (+50 Eco-Points)'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
