import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useLang } from '@/i18n';
import { useResource } from '../useResource';
import { useD, Card, Kpi } from '../ui';
import { CHART } from './Overview';

const TYPES = ['whatsapp', 'call', 'map', 'form'];

export default function Analytics() {
  const d = useD();
  const { lang } = useLang();
  const { items } = useResource('events');
  const since = Date.now() - 30 * 864e5;
  const recent = useMemo(() => items.filter((e) => new Date(e.created_at) > since), [items, since]);

  const byDay = useMemo(() => {
    const out = [];
    for (let i = 29; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 864e5);
      const key = dt.toISOString().slice(0, 10);
      const row = { day: dt.toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { day: 'numeric', month: 'short' }) };
      TYPES.forEach((t) => (row[t] = recent.filter((e) => e.type === t && e.created_at.slice(0, 10) === key).length));
      out.push(row);
    }
    return out;
  }, [recent, lang]);

  const pages = useMemo(() => {
    const m = {};
    recent.forEach((e) => (m[e.page] = (m[e.page] || 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [recent]);
  const max = pages[0]?.[1] || 1;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-deep">{d('analytics')}</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TYPES.map((t) => (
          <Kpi key={t} label={d(`ev_${t}`)} value={recent.filter((e) => e.type === t).length} hint={lang === 'en' ? 'last 30 days' : 'آخر 30 يوم'} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title={d('clicksByDay')} className="xl:col-span-2">
          <div className="h-80" dir="ltr">
            <ResponsiveContainer>
              <BarChart data={byDay} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="#1B2D8F" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5B6275' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: '#5B6275' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 14, fontSize: 13 }} cursor={{ fill: 'rgba(15,59,87,.04)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {TYPES.map((t, i) => (
                  <Bar key={t} dataKey={t} name={d(`ev_${t}`)} stackId="a" fill={CHART[i]} radius={i === TYPES.length - 1 ? [6, 6, 0, 0] : 0} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={d('topPages')}>
          <ul className="space-y-3">
            {pages.map(([p, n]) => (
              <li key={p}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="truncate text-ink/80" dir="ltr">
                    {p}
                  </span>
                  <span className="font-mono text-slate">{n}</span>
                </div>
                <div className="h-1.5 rounded-full bg-deep/5">
                  <div className="h-full rounded-full bg-calm" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
