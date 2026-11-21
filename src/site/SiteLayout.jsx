import { Outlet } from 'react-router-dom';
import { SmoothScroll } from '@/lib/smooth';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFab } from './WhatsAppFab';

export default function SiteLayout() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  );
}
