import { Phone, Mail, Globe, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { BranchSection } from '@/site/BranchCards';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import { SocialIcon, SOCIAL_KEYS, SOCIAL_NAMES } from '@/components/ui/SocialIcons';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { cn } from '@/lib/cn';

// Contact cards (WhatsApp, call, email, website) and social links come from dashboard Settings; places from Website > Branches.
export default function Contact() {
  const { t, lang } = useLang();
  const s = useSettings();
  const site = (s.website || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

  const cards = [
    { key: 'whatsapp', icon: <WhatsAppIcon size={24} />, label: t('contact.whatsapp'), hint: t('contact.whatsappHint'), value: s.whatsapp || t('contact.openChat'), href: whatsappHref(s, lang), ext: !!s.whatsapp, onClick: () => track('whatsapp'), tone: 'bg-[#1f9d55] text-white' },
    s.phone && { key: 'call', icon: <Phone size={22} />, label: t('contact.call'), hint: t('contact.callHint'), value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}`, onClick: () => track('call'), tone: 'bg-deep text-linen' },
    s.email && { key: 'email', icon: <Mail size={22} />, label: t('contact.email'), hint: t('contact.emailHint'), value: s.email, href: `mailto:${s.email}`, tone: 'bg-amber text-deep-900' },
    s.website && { key: 'website', icon: <Globe size={22} />, label: t('contact.website'), hint: t('contact.websiteHint'), value: site, href: s.website, ext: true, tone: 'bg-calm text-linen' },
  ].filter(Boolean);
  const socials = SOCIAL_KEYS.filter((k) => s[k]);

  return (
    <>
      <Seo title={t('nav.contact')} description={t('contact.sub')} />
      <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')} sub={t('contact.sub')} />

      <section className="bg-linen py-20 sm:py-24">
        <AnimatedContent stagger={0.1} className={cn('mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2', cards.length >= 4 ? 'lg:grid-cols-4' : cards.length === 3 && 'lg:grid-cols-3')}>
          {cards.map((c) => (
            <a
              key={c.key}
              href={c.href}
              onClick={c.onClick}
              {...(c.ext ? { target: '_blank', rel: 'noopener' } : {})}
              className="group flex flex-col rounded-3xl border border-deep/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(15,59,87,.55)]"
            >
              <div className="flex items-start justify-between">
                <span className={cn('grid h-14 w-14 place-items-center rounded-2xl', c.tone)}>{c.icon}</span>
                <ArrowUpRight size={20} className="text-slate transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-deep rtl:-scale-x-100" />
              </div>
              <p className="font-display mt-8 text-2xl text-deep">{c.label}</p>
              <p className="mt-1 text-sm text-slate">{c.hint}</p>
              <p className="mt-5 truncate font-medium text-deep" dir={c.key === 'whatsapp' && !s.whatsapp ? undefined : 'ltr'} style={{ textAlign: 'start' }}>
                {c.value}
              </p>
            </a>
          ))}
        </AnimatedContent>

        {socials.length > 0 && (
          <div className="mx-auto mt-14 max-w-7xl px-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-deep px-7 py-7 text-linen sm:flex-row sm:items-center sm:px-10">
              <p className="font-display text-2xl">{t('contact.social')}</p>
              <div className="flex flex-wrap gap-3">
                {socials.map((k) => (
                  <a key={k} href={s[k]} target="_blank" rel="noopener" aria-label={SOCIAL_NAMES[k]} className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 px-5 text-sm transition-colors hover:border-amber hover:bg-amber hover:text-deep-900">
                    <SocialIcon name={k} size={18} /> {SOCIAL_NAMES[k]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <BranchSection />
    </>
  );
}
