import React from 'react';
import { X, CheckCircle, Shield, FileText, ArrowRight, Share2 } from 'lucide-react';
import { ClimateTopic } from './ClimateInfoSection';

interface ClimateArticleModalProps {
  topic: ClimateTopic;
  onClose: () => void;
}

export const ClimateArticleModal: React.FC<ClimateArticleModalProps> = ({
  topic,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Hero image in modal */}
        <div className="relative h-48 w-full bg-slate-900 flex-shrink-0">
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100">
              {topic.category} · {topic.readTime}
            </span>
            <h2 className="text-xl font-extrabold font-display leading-tight mt-1 text-white">
              {topic.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Overview & Environmental Context
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {topic.summary}
            </p>
          </div>

          {/* Applicable Ordinance */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Governing Municipal Legal Framework</span>
            </div>
            <p className="text-emerald-900 font-semibold">{topic.ordinance}</p>
          </div>

          {/* Action Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Citizen Action Guidelines & Checklist
            </h4>
            <div className="space-y-2">
              {topic.actionItems.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Understood & Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
