import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import Magnet from '@/components/reactbits/Magnet';

export function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

/** Sticky WhatsApp button on every public page (plan requirement), with click tracking. */
export function WhatsAppFab() {
  const { t, lang } = useLang();
  const settings = useSettings();
  return (
    <div className="fixed bottom-5 end-5 z-40 sm:bottom-8 sm:end-8">
      <Magnet padding={60} magnetStrength={3}>
        <a
          href={whatsappHref(settings, lang)}
          target="_blank"
          rel="noopener"
          onClick={() => track('whatsapp')}
          aria-label={t('cta.whatsapp')}
          className="group flex items-center gap-3 rounded-full bg-[#1f9d55] p-4 text-white shadow-[0_18px_40px_-12px_rgba(31,157,85,.7)] transition-all hover:pe-6"
        >
          <span className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
            <WhatsAppIcon size={26} />
          </span>
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-40 sm:inline">
            {t('cta.whatsapp')}
          </span>
        </a>
      </Magnet>
    </div>
  );
}
