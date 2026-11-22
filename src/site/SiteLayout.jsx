import { Outlet } from 'react-router-dom';
import { SmoothScroll } from '@/lib/smooth';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFab } from './WhatsAppFab';
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
      <WhatsAppFab />
    </SmoothScroll>
    </ContentProvider>
  );
}
