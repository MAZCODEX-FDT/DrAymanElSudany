import { lazy, Suspense, useEffect, useState } from 'react';
import { NavLink, Route, Routes, Link } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Activity, Inbox, Stethoscope, Users, FileText, BarChart3, Settings, LogOut, Globe, ExternalLink, Menu, X, Database } from 'lucide-react';
import { LangProvider, useLang } from '@/i18n';
import * as api from '@/lib/api';
import { resetDemo } from '@/lib/demo';
import { LogoMark } from '@/components/ui/Logo';
import { cn, withBase } from '@/lib/cn';
import { useD, Btn, DInput, DField } from './ui';
import Overview from './pages/Overview';

const Appointments = lazy(() => import('./pages/Appointments'));
const Cases = lazy(() => import('./pages/Cases'));
const InboxPage = lazy(() => import('./pages/InboxPage'));
const Referrers = lazy(() => import('./pages/Referrers'));
const Patients = lazy(() => import('./pages/Patients'));
const Website = lazy(() => import('./pages/Website'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const NAV = [
  ['', 'overview', LayoutDashboard],
  ['appointments', 'appointments', CalendarClock],
  ['cases', 'cases', Activity],
  ['inbox', 'inbox', Inbox],
  ['referrers', 'referrers', Stethoscope],
  ['patients', 'patients', Users],
  ['content', 'content', Globe],
  ['analytics', 'analytics', BarChart3],
  ['settings', 'settings', Settings],
];

function Login({ onDone }) {
  const d = useD();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const r = await api.login(email, password);
      onDone(r.user);
    } catch {
      setErr(d('badLogin'));
    }
  };
  return (
    <div className="bg-deep-glow grain relative grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-[2rem] bg-linen p-8 shadow-2xl">
        <LogoMark className="h-12 w-12" />
        <h1 className="font-display mt-6 text-2xl text-deep">{d('login')}</h1>
        <p className="mt-1 text-sm text-slate">{d('title')}</p>
        <div className="mt-7 space-y-4">
          <DField label={d('email')}>
            <DInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" autoComplete="username" />
          </DField>
          <DField label={d('password')}>
            <DInput type="password" required value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" autoComplete="current-password" />
          </DField>
          {err && <p className="text-sm text-[#9a3b1e]">{err}</p>}
          <Btn className="h-12 w-full">{d('login')}</Btn>
          {api.isDemo() && <p className="text-center text-xs text-slate">{d('demoLogin')}</p>}
        </div>
      </form>
    </div>
  );
}

function Shell({ user, onLogout, lang, setLang }) {
  const d = useD();
  const [demo, setDemo] = useState(api.isDemo());
  const [open, setOpen] = useState(false);
  useEffect(() => api.onModeChange((m) => setDemo(m === 'demo')), []);

  const sidebar = (
    <aside className="flex h-full flex-col bg-deep-950 px-4 py-6 text-linen">
      <Link to="/dashboard" className="flex items-center gap-3 px-2">
        <LogoMark light className="h-9 w-9" />
        <span className="leading-tight">
          <span className="font-display block text-[15px]">{lang === 'en' ? 'Dr. Ayman El Sudany' : 'د. أيمن السودانى'}</span>
          <span className="block text-[11px] text-linen/50">{d('title')}</span>
        </span>
      </Link>
      <nav className="mt-10 flex-1 space-y-1">
        {NAV.map(([path, key, Icon]) => (
          <NavLink
            key={key}
            to={`/dashboard${path ? `/${path}` : ''}`}
            end={!path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition-all', isActive ? 'bg-white/10 text-linen shadow-inner' : 'text-linen/55 hover:bg-white/5 hover:text-linen')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-amber' : ''} />
                {d(key)}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-4">
        <a href={withBase(lang === 'en' ? '/en' : '/')} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-linen/55 hover:text-linen">
          <ExternalLink size={17} /> {d('viewSite')}
        </a>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-linen/55 hover:text-linen">
          <Globe size={17} /> {lang === 'ar' ? 'English' : 'العربية'}
        </button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-linen/55 hover:text-linen">
          <LogOut size={17} /> {d('logout')}
        </button>
        <p className="truncate px-3 pt-2 text-[11px] text-linen/30" dir="ltr">
          {user?.email}
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#ECECEC] text-ink">
      <div className="fixed inset-y-0 start-0 hidden w-64 lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-deep-950/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72">{sidebar}</div>
        </div>
      )}
      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-deep/[.06] bg-[#ECECEC]/85 px-4 py-3 backdrop-blur-xl sm:px-8">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-deep/5 lg:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-sm text-slate">{new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          {demo && (
            <div className="flex items-center gap-2">
              <span title={d('demoHint')} className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1.5 text-xs font-medium text-[#B8461A]">
                <Database size={13} /> {d('demo')}
              </span>
              <button
                onClick={() => {
                  resetDemo();
                  window.location.reload();
                }}
                className="hidden text-xs text-slate underline-offset-2 hover:underline sm:inline"
              >
                {d('resetDemo')}
              </button>
            </div>
          )}
        </header>
        <main className="px-4 py-8 sm:px-8">
          <Suspense fallback={<div className="h-96" />}>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="cases" element={<Cases />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="referrers" element={<Referrers />} />
              <Route path="patients" element={<Patients />} />
              <Route path="content" element={<Website />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function Gate({ lang, setLang }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    document.title = lang === 'en' ? 'Dashboard | Dr. Ayman El Sudany' : 'لوحة التحكم | د. أيمن السودانى';
    api.me().then((r) => setUser(r.user)).catch(() => setUser(null));
  }, [lang]);
  if (user === undefined) return <div className="min-h-screen bg-deep-950" />;
  if (!user) return <Login onDone={setUser} />;
  return (
    <Shell
      user={user}
      lang={lang}
      setLang={setLang}
      onLogout={async () => {
        await api.logout();
        setUser(null);
      }}
    />
  );
}

export default function DashboardApp() {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('aes-dash-lang') || 'ar';
    } catch {
      return 'ar';
    }
  });
  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem('aes-dash-lang', l);
    } catch {
      /* ignore */
    }
  };
  return (
    <LangProvider lang={lang}>
      <Gate lang={lang} setLang={setLang} />
    </LangProvider>
  );
}

export { useLang };
