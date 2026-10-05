import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (item: any) => void;
  onOpenAlertsTab?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenAlertsTab,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'alert',
      title: 'PAGASA Emergency Advisory',
      description: 'Low Pressure Area approaching Eastern Seaboard. Heavy precipitation expected.',
      time: '15 mins ago',
      unread: true,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'notif-2',
      type: 'triage',
      title: 'Report CENRO-2026-0841 Dispatched',
      description: 'Eco-Warden Unit 2 dispatched to investigate clogged drainage culvert.',
      time: '2 hours ago',
      unread: true,
      icon: Clock,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      id: 'notif-3',
      type: 'reward',
      title: 'Eco-Points Awarded (+50 pts)',
      description: 'Your verified environmental report was accepted into municipal queue.',
      time: 'Yesterday',
      unread: false,
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'notif-4',
      type: 'activity',
      title: 'Upcoming Drive: Sihig Coastal Clean-up',
      description: 'Join the community this Saturday at 6:00 AM at Sibugay Boardwalk.',
      time: '2 days ago',
      unread: false,
      icon: CheckCircle2,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-base text-slate-900 font-display">
              Citizen Notifications & Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (n.type === 'alert' && onOpenAlertsTab) {
                    onClose();
                    onOpenAlertsTab();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all ${
                  n.type === 'alert' && onOpenAlertsTab ? 'cursor-pointer hover:border-rose-400' : ''
                } ${
                  n.unread ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs' : 'bg-slate-50 border-slate-200/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      {n.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Mark All As Read & Close
        </button>
      </div>
    </div>
  );
};
