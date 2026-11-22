import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSettings } from '@/lib/settings';
import { captureAttribution, initAnalytics, pageView } from '@/lib/analytics';
import { SmoothScroll } from '@/lib/smooth';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ContactDock } from './ContactDock';
import { ContentProvider } from '@/lib/content';

export default function SiteLayout() {
  const s = useSettings();
  const { pathname } = useLocation();
  useEffect(captureAttribution, []);
  useEffect(() => initAnalytics(s), [s]);
  useEffect(() => pageView(pathname), [pathname]);
  return (
    <ContentProvider>
    <SmoothScroll>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ContactDock />
    </SmoothScroll>
    </ContentProvider>
  );
}
