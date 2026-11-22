import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Inbox, Activity, Timer, MessageCircle, UserX } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useLang } from '@/i18n';
import { useSettings } from '@/lib/settings';
import { useProcedures } from '../useResource';
import { useResource } from '../useResource';
import { useD, Card, Kpi, Pill, fmtDate, todayIso } from '../ui';

export const CHART = ['#1B2D8F', '#2E7BEF', '#F26A2E', '#9DBBF7', '#F7B596', '#5B6275'];

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Overview() {
  const d = useD();
  const { get: getProcedure } = useProcedures();
  const { lang, L } = useLang();
  const settings = useSettings();
  const appts = useResource('appointments').items;
  const leads = useResource('leads').items;
  const cases = useResource('cases').items;
  const events = useResource('events').items;
  const today = todayIso();

  const k = useMemo(() => {
    const weekAgo = Date.now() - 7 * 864e5;
    const monthAgo = Date.now() - 30 * 864e5;
    const responded = leads.filter((l) => l.responded_at);
    const avg = responded.length ? Math.round(responded.reduce((s, l) => s + (new Date(l.responded_at) - new Date(l.created_at)) / 6e4, 0) / responded.length) : 0;
    const past = appts.filter((a) => a.date < today && ['completed', 'no_show'].includes(a.status));
    return {
      today: appts.filter((a) => a.date === today && a.status !== 'cancelled').length,
      newLeads: leads.filter((l) => new Date(l.created_at) > weekAgo).length,
      open: cases.filter((c) => !['done'].includes(c.stage)).length,
      avg,
      wa: events.filter((e) => e.type === 'whatsapp' && new Date(e.created_at) > monthAgo).length,
      noShow: past.length ? Math.round((past.filter((a) => a.status === 'no_show').length / past.length) * 100) : 0,
    };
  }, [appts, leads, cases, events, today]);

  const series = useMemo(() => {
    const out = [];
    for (let i = 29; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 864e5);
      const key = dayKey(dt);
      out.push({ day: dt.toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { day: 'numeric', month: 'short' }), visits: appts.filter((a) => a.date === key && a.status === 'completed').length, clicks: events.filter((e) => e.created_at.slice(0, 10) === key).length });
    }
    return out;
  }, [appts, events, lang]);

  const sources = useMemo(() => {
    const m = {};
    appts.forEach((a) => (m[a.source] = (m[a.source] || 0) + 1));
    return Object.entries(m).map(([k2, v]) => ({ name: d(`src_${k2}`), value: v }));
  }, [appts, d]);

  const schedule = appts.filter((a) => a.date === today && a.status !== 'cancelled').sort((a, b) => a.time.localeCompare(b.time));
  const followUps = cases.filter((c) => c.stage !== 'done' && c.next_follow_up && c.next_follow_up <= today);
  const reviews = Number(settings.google_reviews || 0);
  const goal = Number(settings.google_reviews_goal || 35);
  const funnel = [
    ['st_completed', appts.filter((a) => a.status === 'completed').length],
    ['sg_candidate', cases.length],
    ['sg_scheduled', cases.filter((c) => ['scheduled', 'done', 'follow_up'].includes(c.stage)).length],
    ['sg_done', cases.filter((c) => ['done', 'follow_up'].includes(c.stage)).length],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-deep">{d('overview')}</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={CalendarClock} label={d('kTodayAppts')} value={k.today} />
        <Kpi icon={Inbox} tone="amber" label={d('kNewLeads')} value={k.newLeads} />
        <Kpi icon={Activity} tone="calm" label={d('kPipeline')} value={k.open} />
        <Kpi icon={Timer} tone={k.avg <= 15 ? 'calm' : 'amber'} label={d('kResponse')} value={`${k.avg} ${d('min')}`} hint={d('kResponseGoal')} />
        <Kpi icon={MessageCircle} tone="sand" label={d('kWhatsapp')} value={k.wa} />
        <Kpi icon={UserX} tone="sand" label={d('kNoShow')} value={`${k.noShow}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title={d('visits30')} className="xl:col-span-2">
          <div className="h-72" dir="ltr">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="#1B2D8F" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5B6275' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: '#5B6275' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid rgba(15,59,87,.1)', fontSize: 13 }} />
                <Area type="monotone" dataKey="clicks" name={d('analytics')} stroke="#F26A2E" strokeWidth={2} fill="#F26A2E" fillOpacity={0.08} />
                <Area type="monotone" dataKey="visits" name={d('st_completed')} stroke="#1B2D8F" strokeWidth={2.2} fill="#1B2D8F" fillOpacity={0.08} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={d('sources')}>
          <div className="h-48" dir="ltr">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sources} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={3} stroke="none">
                  {sources.map((_, i) => (
                    <Cell key={i} fill={CHART[i % CHART.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 14, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {sources.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 rounded-xl bg-[#F6F6F8] px-3 py-2 text-ink/75">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CHART[i % CHART.length] }} />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="font-mono text-slate">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title={d('todaySchedule')} action={<Link to="/dashboard/appointments" className="text-sm text-calm hover:underline">{d('appointments')}</Link>}>
          <ul className="scroll-thin max-h-80 space-y-2 overflow-y-auto">
            {schedule.length === 0 && <li className="text-sm text-slate">{d('empty')}</li>}
            {schedule.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-2xl bg-[#F6F6F8] px-4 py-3">
                <span className="font-mono text-sm text-deep" dir="ltr">{a.time}</span>
                <span className="flex-1 truncate text-sm">{a.patient_name}</span>
                <Pill tone={a.status}>{d(`st_${a.status}`)}</Pill>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={d('followUpsDue')} action={<Link to="/dashboard/cases" className="text-sm text-calm hover:underline">{d('cases')}</Link>}>
          <ul className="scroll-thin max-h-80 space-y-2 overflow-y-auto">
            {followUps.length === 0 && <li className="text-sm text-slate">{d('empty')}</li>}
            {followUps.map((c) => (
              <li key={c.id} className="rounded-2xl border border-amber/30 bg-amber/5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-deep">{c.patient_name}</span>
                  <span className="text-xs text-[#B8461A]">{fmtDate(c.next_follow_up, lang)}</span>
                </div>
                <p className="mt-1 text-xs text-slate">
                  {L(getProcedure(c.procedure)?.title) || c.procedure} · {d(`sg_${c.stage}`)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-6">
          <Card title={d('reviewsGoal')}>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-deep">{reviews}</span>
              <span className="text-slate">/ {goal}</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-deep/5">
              <div className="h-full rounded-full bg-amber transition-all duration-1000" style={{ width: `${Math.min(100, (reviews / goal) * 100)}%` }} />
            </div>
          </Card>
          <Card title={d('funnel')}>
            <div className="space-y-3">
              {funnel.map(([key, v], i) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs text-slate">
                    <span>{d(key)}</span>
                    <span className="font-mono">{v}</span>
                  </div>
                  <div className="h-2 rounded-full bg-deep/5">
                    <div className="h-full rounded-full" style={{ width: `${funnel[0][1] ? Math.max(4, (v / funnel[0][1]) * 100) : 0}%`, background: CHART[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
