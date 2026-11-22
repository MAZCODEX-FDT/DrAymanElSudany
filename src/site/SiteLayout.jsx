import { Outlet } from 'react-router-dom';
import { SmoothScroll } from '@/lib/smooth';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ContactDock } from './ContactDock';
import { ContentProvider } from '@/lib/content';

export default function SiteLayout() {
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
