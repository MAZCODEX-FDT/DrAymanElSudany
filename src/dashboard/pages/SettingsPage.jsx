import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
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
const SOCIAL = ['facebook', 'instagram', 'youtube', 'tiktok'];

export default function SettingsPage() {
  const d = useD();
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  const [pw, setPw] = useState({ current: '', next: '' });
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
            <DField key={k} label={k}>
              <DInput dir="ltr" value={s[k] ?? ''} onChange={set(k)} placeholder="https://" />
            </DField>
          ))}
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
