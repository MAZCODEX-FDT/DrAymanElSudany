import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LangProvider } from '@/i18n';
import { SettingsProvider } from '@/lib/settings';
import SiteLayout from '@/site/SiteLayout';
import Home from '@/pages/Home';

const About = lazy(() => import('@/pages/About'));
const ProceduresIndex = lazy(() => import('@/pages/ProceduresIndex'));
const Procedure = lazy(() => import('@/pages/Procedure'));
const ForDoctors = lazy(() => import('@/pages/ForDoctors'));
const Faq = lazy(() => import('@/pages/Faq'));
const Contact = lazy(() => import('@/pages/Contact'));
const Book = lazy(() => import('@/pages/Book'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Dashboard = lazy(() => import('@/dashboard/DashboardApp'));

const Loader = () => <div className="min-h-screen bg-deep-900" />;

function siteRoutes(prefix) {
  return (
    <Route path={prefix} element={<SiteLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="procedures" element={<ProceduresIndex />} />
      <Route path="procedures/:slug" element={<Procedure />} />
      <Route path="for-doctors" element={<ForDoctors />} />
      <Route path="faq" element={<Faq />} />
      <Route path="contact" element={<Contact />} />
      <Route path="book" element={<Book />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SettingsProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/dashboard/*" element={<Dashboard />} />
            {siteRoutes('/en')}
            {siteRoutes('/')}
          </Routes>
        </Suspense>
      </SettingsProvider>
    </LangProvider>
  );
}
