import { useMemo, useState } from 'react';
import { Phone, CheckCheck, CalendarPlus, Activity, FileImage } from 'lucide-react';
import { useLang } from '@/i18n';
import * as api from '@/lib/api';
import { useResource } from '../useResource';
import { useD, Card, Pill, DSelect, Btn, Segment, Empty, fmtDate, fmtTime, todayIso } from '../ui';
import { cn } from '@/lib/cn';

const LABELS = ['new', 'booking', 'cath_candidate', 'follow_up', 'referring_doctor'];
const KEYS = {
  relation: { ar: 'الحجز لمين', en: 'For' },
  reason: { ar: 'السبب', en: 'Reason' },
  preferred: { ar: 'اليوم المناسب', en: 'Preferred day' },
  notes: { ar: 'ملاحظات', en: 'Notes' },
  hasScans: { ar: 'معاه أشعة', en: 'Has scans' },
  specialty: { ar: 'التخصص', en: 'Specialty' },
  city: { ar: 'المدينة', en: 'City' },
  patient: { ar: 'المريض', en: 'Patient' },
  patientPhone: { ar: 'موبايل المريض', en: 'Patient phone' },
  summary: { ar: 'ملخص الحالة', en: 'Case summary' },
  urgency: { ar: 'الاستعجال', en: 'Urgency' },
};
const VALUES = {
  self: { ar: 'لنفسه', en: 'Self' },
  parent: { ar: 'لوالده / والدته', en: 'Parent' },
  other: { ar: 'حد من العيلة', en: 'Family member' },
  routine: { ar: 'عادى', en: 'Routine' },
  soon: { ar: 'خلال أسبوع', en: 'Within a week' },
  urgent: { ar: 'عاجل', en: 'Urgent' },
};

function ago(iso, lang) {
  const m = Math.round((Date.now() - new Date(iso)) / 6e4);
  if (m < 60) return lang === 'en' ? `${m} min` : `${m} دقيقة`;
  const h = Math.round(m / 60);
  if (h < 24) return lang === 'en' ? `${h} h` : `${h} ساعة`;
  return fmtDate(iso, lang);
}

/** Website requests with the same labels as WhatsApp Business, and response-time tracking (goal: 15 min). */
export default function InboxPage() {
  const d = useD();
  const { lang } = useLang();
  const { items, update } = useResource('leads');
  const [tab, setTab] = useState('open');
  const [sel, setSel] = useState(null);
  const [flash, setFlash] = useState('');

  const rows = useMemo(() => items.filter((l) => tab === 'all' || l.status === tab), [items, tab]);
  const cur = items.find((l) => l.id === sel) || rows[0];
  const p = cur?.payload || {};

  const done = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2200);
  };
  const markHandled = () => update(cur.id, { status: 'handled', responded_at: cur.responded_at || new Date().toISOString() });
  const toAppointment = async () => {
    await api.create('appointments', { patient_name: p.patient || cur.name, phone: p.patientPhone || cur.phone, date: p.preferred || todayIso(), time: '17:00', reason: p.reason || '', status: 'requested', source: cur.type === 'referral' ? 'referral' : 'website', notes: p.notes || '' });
    await update(cur.id, { label: 'booking' });
    done(d('saved'));
  };
  const toCase = async () => {
    await api.create('cases', { patient_name: p.patient || cur.name, phone: p.patientPhone || cur.phone, procedure: 'diagnostic-cerebral-angiography', stage: 'candidate', referring_doctor: cur.type === 'referral' ? cur.name : '', next_follow_up: todayIso(), notes: p.summary || p.notes || '' });
    await update(cur.id, { label: 'cath_candidate' });
    done(d('saved'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-deep">{d('inbox')}</h1>
        <Segment value={tab} onChange={setTab} options={[['open', d('open')], ['handled', d('handled')], ['all', d('all')]]} />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="!p-2 lg:col-span-2">
          {rows.length === 0 ? (
            <div className="p-4">
              <Empty>{d('empty')}</Empty>
            </div>
          ) : (
            <ul className="scroll-thin max-h-[70vh] overflow-y-auto">
              {rows.map((l) => (
                <li key={l.id}>
                  <button onClick={() => setSel(l.id)} className={cn('w-full rounded-2xl px-4 py-3.5 text-start transition-colors', cur?.id === l.id ? 'bg-mist/60' : 'hover:bg-[#F6F6F8]')}>
                    <div className="flex items-center gap-2">
                      {l.status === 'open' && <span className="h-2 w-2 rounded-full bg-amber" />}
                      <span className="flex-1 truncate font-medium text-deep">{l.name}</span>
                      <span className="text-xs text-slate">{ago(l.created_at, lang)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-slate">{d(`lt_${l.type}`)}</span>
                      <Pill className="!py-0.5 !text-[11px]">{d(`lb_${l.label}`)}</Pill>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        {cur && (
          <Card className="lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate">
                  {d(`lt_${cur.type}`)} · {fmtDate(cur.created_at, lang)} {fmtTime(cur.created_at, lang)}
                </p>
                <h2 className="font-display mt-1 text-2xl text-deep">{cur.name}</h2>
                <a href={`tel:${cur.phone}`} className="mt-1 inline-flex items-center gap-2 text-calm" dir="ltr">
                  <Phone size={14} /> {cur.phone}
                </a>
              </div>
              <Pill tone={cur.status}>
                {cur.status === 'handled' && cur.responded_at
                  ? `${d('repliedIn')} ${Math.round((new Date(cur.responded_at) - new Date(cur.created_at)) / 6e4)} ${d('min')}`
                  : `${d('waitingFor')} ${ago(cur.created_at, lang)}`}
              </Pill>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(p)
                .filter(([k, v]) => v !== '' && v != null && k !== 'lang')
                .map(([k, v]) => (
                  <div key={k} className={cn('rounded-2xl bg-[#F6F6F8] p-4', String(v).length > 40 && 'sm:col-span-2')}>
                    <dt className="text-xs text-slate">{KEYS[k]?.[lang] || k}</dt>
                    <dd className="mt-1 text-sm text-ink">{typeof v === 'boolean' ? (v ? <FileImage size={16} className="text-calm" /> : '—') : VALUES[v]?.[lang] || String(v)}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-6">
              <span className="mb-1.5 block text-[13px] font-medium text-deep/75">{lang === 'en' ? 'Label' : 'التصنيف'}</span>
              <DSelect value={cur.label} onChange={(e) => update(cur.id, { label: e.target.value })} className="!w-auto">
                {LABELS.map((x) => (
                  <option key={x} value={x}>
                    {d(`lb_${x}`)}
                  </option>
                ))}
              </DSelect>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-deep/[.07] pt-6">
              {cur.status === 'open' && (
                <Btn onClick={markHandled}>
                  <CheckCheck size={16} /> {d('markHandled')}
                </Btn>
              )}
              <Btn variant="outline" onClick={toAppointment}>
                <CalendarPlus size={16} /> {d('toAppointment')}
              </Btn>
              <Btn variant="outline" onClick={toCase}>
                <Activity size={16} /> {d('toCase')}
              </Btn>
              {flash && <span className="self-center text-sm text-[#2f6b49]">{flash} ✓</span>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
