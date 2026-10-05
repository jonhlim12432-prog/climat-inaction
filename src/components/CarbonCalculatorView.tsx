import React, { useState } from 'react';
import {
  Calculator,
  Zap,
  Car,
  Utensils,
  Trash2,
  TreeDeciduous,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { CarbonAuditResult } from '../types';

interface CarbonCalculatorViewProps {
  onAuditCompleted: (auditData: any) => Promise<CarbonAuditResult>;
}

export const CarbonCalculatorView: React.FC<CarbonCalculatorViewProps> = ({
  onAuditCompleted,
}) => {
  // Inputs
  const [electricityKWh, setElectricityKWh] = useState(160);
  const [hasSolar, setHasSolar] = useState(false);
  const [solarOffset, setSolarOffset] = useState(30);

  const [transportMode, setTransportMode] = useState('jeepney_tricycle');
  const [weeklyKm, setWeeklyKm] = useState(35);

  const [dietType, setDietType] = useState('balanced');
  const [wasteHabit, setWasteHabit] = useState('regular');
  const [lpgTanks, setLpgTanks] = useState(6);

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CarbonAuditResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await onAuditCompleted({
        monthlyElectricityKWh: electricityKWh,
        hasSolar,
        solarOffsetPercent: hasSolar ? solarOffset : 0,
        transportMode,
        weeklyTransportKm: weeklyKm,
        dietType,
        wasteSegregation: wasteHabit,
        lpgTanksPerYear: lpgTanks,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl font-display tracking-tight">
              Municipal Carbon Footprint Tool
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
              Calculate your household greenhouse gas emissions calibrated with Philippine DOE and DENR emission factors. Complete an audit to earn +30 Eco-Points.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Form Card (Responsive Grid on lg/xl) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-5">
          <form onSubmit={handleCalculate} className="space-y-6">
          {/* Section 1: Household Energy & Electricity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                1. Electricity & Grid Energy
              </h3>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-semibold">Monthly Electricity Consumption:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {electricityKWh} kWh/mo (~₱{(electricityKWh * 11.5).toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="600"
                step="10"
                value={electricityKWh}
                onChange={(e) => setElectricityKWh(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>40 kWh (Micro)</span>
                <span>200 kWh (Avg Household)</span>
                <span>600+ kWh (Heavy AC)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Rooftop Solar PV Installed?</span>
                <span className="text-[11px] text-slate-500">Net-metering or battery off-grid</span>
              </div>
              <input
                type="checkbox"
                checked={hasSolar}
                onChange={(e) => setHasSolar(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            {hasSolar && (
              <div className="pl-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Solar Grid Offset:</span>
                  <span className="font-bold text-emerald-700">{solarOffset}% clean energy</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={solarOffset}
                  onChange={(e) => setSolarOffset(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Section 2: Transportation & Commute */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Car className="w-4 h-4 text-sky-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                2. Daily Commute & Transportation
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Primary Mode of Transit:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'jeepney_tricycle', label: 'Jeepney / Tricycle', icon: '🛺' },
                  { id: 'motorcycle', label: 'Motorcycle / Scooter', icon: '🛵' },
                  { id: 'car_gasoline', label: 'Private Car (Gas)', icon: '🚗' },
                  { id: 'electric_bicycle', label: 'E-Bike / Bicycle', icon: '🚲' },
                  { id: 'walking_commute', label: 'Walking / Active', icon: '🚶' },
                  { id: 'mixed', label: 'Mixed Transit', icon: '🚌' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                      transportMode === mode.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base mr-1.5">{mode.icon}</span>
                    <span className="text-[11px]">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-semibold">Weekly Travel Distance:</span>
                <span className="font-mono font-bold text-emerald-800">{weeklyKm} km/week</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={weeklyKm}
                onChange={(e) => setWeeklyKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Diet & Food Sourcing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                3. Nutrition & Food Carbon Intensity
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'heavy_meat', label: 'Daily Meat & Beef', desc: 'Highest carbon footprint' },
                { id: 'balanced', label: 'Balanced Filipino Diet', desc: 'Pork, chicken & veggies' },
                { id: 'low_meat', label: 'Low Meat / Fish Heavy', desc: 'Pescatarian / seafood' },
                { id: 'vegetarian', label: 'Vegetarian', desc: 'Eggs & dairy only' },
                { id: 'plant_based', label: 'Plant-Based / Vegan', desc: 'Lowest footprint' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietType(d.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    dietType === d.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs block">{d.label}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Household Waste & Cooking LPG */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Trash2 className="w-4 h-4 text-purple-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                4. Solid Waste & Cooking Fuel
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Waste Segregation Habit (RA 9003):
                </label>
                <select
                  value={wasteHabit}
                  onChange={(e) => setWasteHabit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="none">No Segregation (All in one bag)</option>
                  <option value="partial">Partial (Separate cardboard/cans only)</option>
                  <option value="regular">Regular Segregation (Organics + Recyclables)</option>
                  <option value="zero_waste_compost">Zero-Waste (Backyard Composting + Segregated)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Cooking LPG Tanks (11kg) per Year:
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={lpgTanks}
                  onChange={(e) => setLpgTanks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={calculating}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{calculating ? 'Analyzing Telemetry & Computing...' : 'Run Carbon Footprint Audit (+30 Eco-Points)'}</span>
          </button>
        </form>
      </div>

      {/* Right Column: Audit Results Presentation (Sticky on Desktop) */}
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
        {result ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Your Annual Household Carbon Footprint
                </span>
                <span className="bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Audit
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-5xl font-extrabold font-display tabular-nums">
                  {result.totalKgCO2e.toLocaleString()}
                </span>
                <span className="text-emerald-200 text-sm font-bold">kg CO₂e / year</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-100 mb-4">
                <span>PH National Average: {result.nationalAvgKgCO2e.toLocaleString()} kg CO₂e</span>
                <span>·</span>
                <span className={result.comparisonPercentage <= 0 ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>
                  {result.comparisonPercentage <= 0
                    ? `${Math.abs(result.comparisonPercentage)}% Below Average ✓`
                    : `${result.comparisonPercentage}% Above Average ⚠`}
                </span>
              </div>

              {/* Trees Needed Card */}
              <div className="bg-emerald-800/80 rounded-2xl p-3 flex items-center gap-3 border border-emerald-700">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-200 flex-shrink-0">
                  <TreeDeciduous className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-white block text-sm">
                    {result.treesNeeded} Endemic Trees Needed
                  </span>
                  <span className="text-emerald-200">
                    To completely offset your household footprint in Zamboanga Sibugay.
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Emissions Breakdown by Sector
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>⚡ Electricity & Grid</span>
                    <span className="font-mono font-bold text-slate-800">
                      {result.breakdown.electricity} kg
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (result.breakdown.electricity / result.totalKgCO2e) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>🚗 Transportation</span>
                    <span className="font-mono font-bold text-slate-800">
                      {result.breakdown.transport} kg
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (result.breakdown.transport / result.totalKgCO2e) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>🍲 Diet & Food</span>
                    <span className="font-mono font-bold text-slate-800">
                      {result.breakdown.diet} kg
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.min(100, (result.breakdown.diet / result.totalKgCO2e) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>🔥 Cooking LPG & Waste</span>
                    <span className="font-mono font-bold text-slate-800">
                      {result.breakdown.lpg + result.breakdown.waste} kg
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((result.breakdown.lpg + result.breakdown.waste) / result.totalKgCO2e) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Tailored Climate Action Roadmap
              </h4>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Ready for Live Calculation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Adjust your household energy, transit, and waste parameters on the left to see your carbon emissions scorecard in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
