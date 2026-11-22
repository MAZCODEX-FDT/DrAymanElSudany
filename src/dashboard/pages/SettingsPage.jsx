import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { SOCIAL_KEYS, SOCIAL_NAMES, SocialIcon } from '@/components/ui/SocialIcons';
import { useD, Card, DField, DInput, Btn } from '../ui';

const CLINIC = [
  ['phone', 'ltr'],
  ['whatsapp', 'ltr'],
  ['email', 'ltr'],
  ['website', 'ltr'],
  ['address_ar', 'rtl'],
  ['address_en', 'ltr'],
  ['hours_ar', 'rtl'],
  ['hours_en', 'ltr'],
  ['map_url', 'ltr'],
  ['review_url', 'ltr'],
  ['google_reviews', 'ltr'],
  ['google_reviews_goal', 'ltr'],
];
const SOCIAL = SOCIAL_KEYS;
const GROWTH = ['google_place_id', 'ga_id', 'meta_pixel_id', 'gsc_verification'];

export default function SettingsPage() {
  const d = useD();
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  const [pw, setPw] = useState({ current: '', next: '' });
  const [g, setG] = useState(null);
  const refresh = async () => {
    await api.saveSettings(s);
    setG(await api.refreshGoogle().catch(() => ({})));
  };
  useEffect(() => {
    api.getSettings().then(setS);
  }, []);
  if (!s) return null;
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });
  const save = async () => {
    await api.saveSettings(s);
    setMsg(d('saved'));
    setTimeout(() => setMsg(''), 2000);
  };
  const changePw = async () => {
    try {
      await api.create('password', pw);
      setPw({ current: '', next: '' });
      setMsg(d('saved'));
    } catch (e) {
      setMsg(e.message);
    }
  };
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-deep">{d('settings')}</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-[#2f6b49]">{msg} ✓</span>}
          <Btn onClick={save}>{d('save')}</Btn>
        </div>
      </div>
      <Card title={d('clinicInfo')}>
        <p className="-mt-2 mb-5 text-sm text-slate">{d('settingsHint')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CLINIC.map(([k, dir]) => (
            <DField key={k} label={d(`s_${k}`)}>
              <DInput dir={dir} value={s[k] ?? ''} onChange={set(k)} />
            </DField>
          ))}
        </div>
      </Card>
      <Card title={d('social')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL.map((k) => (
            <DField key={k} label={<span className="inline-flex items-center gap-2"><SocialIcon name={k} size={16} /> {SOCIAL_NAMES[k]}</span>}>
              <DInput dir="ltr" value={s[k] ?? ''} onChange={set(k)} placeholder="https://" />
            </DField>
          ))}
        </div>
      </Card>
      <Card title={d('growth')}>
        <p className="-mt-2 mb-5 text-sm text-slate">{d('growthHint')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {GROWTH.map((k) => (
            <DField key={k} label={d(`s_${k}`)}>
              <DInput dir="ltr" value={s[k] ?? ''} onChange={set(k)} placeholder={d(`ph_${k}`)} />
              <p className="mt-1.5 text-xs text-slate">{d(`h_${k}`)}</p>
            </DField>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Btn variant="outline" onClick={refresh}>
            {d('googleRefresh')}
          </Btn>
          {g && <span className="text-sm text-slate">{g.rating ? `★ ${Number(g.rating).toFixed(1)} · ${g.count}` : d('googleEmpty')}</span>}
        </div>
      </Card>
      {!api.isDemo() && (
        <Card title={d('password_change')}>
          <div className="grid gap-4 sm:grid-cols-3">
            <DInput type="password" dir="ltr" placeholder="current" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            <DInput type="password" dir="ltr" placeholder="new (10+)" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            <Btn variant="outline" onClick={changePw}>
              {d('save')}
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
