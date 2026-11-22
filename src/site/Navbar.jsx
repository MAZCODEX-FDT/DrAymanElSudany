import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X, Globe } from 'lucide-react';
import { useLang, switchLangPath } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function Navbar() {
  const { t, to, lang } = useLang();
  const settings = useSettings();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef(null);
  const panel = useRef(null);

  const links = [
    ['/about', 'nav.about'],
    ['/procedures', 'nav.procedures'],
    ['/before-your-visit', 'nav.visit'],
    ['/articles', 'nav.blog'],
    ['/for-doctors', 'nav.doctors'],
    ['/faq', 'nav.faq'],
    ['/contact', 'nav.contact'],
  ];

  // Solid background once scrolled; hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (bar.current && !open) gsap.to(bar.current, { yPercent: y > last && y > 300 ? -110 : 0, duration: 0.45, ease: 'power3.out' });
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useGSAP(
    () => {
      if (!panel.current) return;
      if (open) {
        gsap.fromTo(panel.current, { clipPath: 'circle(0% at 90% 5%)' }, { clipPath: 'circle(150% at 90% 5%)', duration: 0.8, ease: 'power3.inOut' });
        gsap.fromTo('.m-link', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, delay: 0.25, duration: 0.6, ease: 'power3.out' });
      }
    },
    { dependencies: [open] }
  );

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 print:hidden">
        <nav
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6',
            scrolled ? 'bg-deep-900/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,.5)] backdrop-blur-xl' : 'bg-transparent'
          )}
        >
          <Link to={to('/')} aria-label={t('brand.name')}>
            <Logo light />
          </Link>
          <ul className="hidden items-center gap-0.5 xl:flex">
            {links.map(([href, key]) => (
              <li key={href}>
                <NavLink
                  to={to(href)}
                  className={({ isActive }) =>
                    cn('whitespace-nowrap rounded-full px-3 py-2 text-[15px] transition-colors 2xl:px-4', isActive ? 'bg-white/10 text-linen' : 'text-linen/70 hover:text-linen')
                  }
                >
                  {t(key)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link to={switchLangPath(pathname)} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-linen/70 hover:text-linen sm:inline-flex">
              <Globe size={15} /> {t('nav.switchLang')}
            </Link>
            <Button to={to('/book')} variant="amber" size="sm" className="hidden sm:inline-flex">
              {t('nav.book')}
            </Button>
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full text-linen hover:bg-white/10 xl:hidden" aria-label={t('nav.menu')}>
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div ref={panel} className="bg-deep-glow fixed inset-0 z-[60] flex flex-col px-6 pb-10 pt-6 text-linen xl:hidden overflow-y-auto" data-lenis-prevent>
          <div className="flex items-center justify-between">
            <Logo light />
            <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label={t('nav.close')}>
              <X size={22} />
            </button>
          </div>
          <ul className="mt-10 space-y-1">
            {[['/', 'nav.home'], ...links, ['/book', 'nav.book']].map(([href, key]) => (
              <li key={href} className="m-link">
                <Link to={to(href)} className="font-display block py-2 text-3xl sm:text-4xl">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="m-link mt-auto flex flex-col gap-3 pt-8">
            <Button href={whatsappHref(settings, lang)} onClick={() => track('whatsapp')} variant="amber" size="lg" target="_blank" rel="noopener">
              {t('cta.whatsapp')}
            </Button>
            <Button to={switchLangPath(pathname)} variant="ghostDark" size="lg">
              <Globe size={16} /> {t('nav.switchLang')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
