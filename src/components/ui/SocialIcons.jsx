// Simple brand glyphs (lucide no longer ships brand icons). currentColor, 24×24.
const paths = {
  facebook: 'M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.2h-2.6C11.6 2.2 10.4 4 10.4 6.4v2.1H8v3.3h2.4V22H14V11.8h2.6l.4-3.3z',
  instagram:
    'M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.1 5.7a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 3.6c2.7 0 3 0 4.1.1 2.7.1 3.9 1.4 4.1 4.1.1 1.1.1 1.4.1 4.2s0 3.1-.1 4.2c-.1 2.7-1.4 3.9-4.1 4.1-1.1.1-1.4.1-4.1.1s-3.1 0-4.1-.1c-2.7-.1-3.9-1.4-4.1-4.1C3.7 15.1 3.7 14.8 3.7 12s0-3.1.1-4.2C3.9 5.1 5.2 3.9 7.9 3.7c1-.1 1.4-.1 4.1-.1zM12 2c-2.7 0-3.1 0-4.2.1C4.2 2.2 2.2 4.2 2.1 7.8 2 8.9 2 9.3 2 12s0 3.1.1 4.2c.2 3.6 2.1 5.6 5.7 5.7 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c3.6-.2 5.6-2.1 5.7-5.7.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c-.2-3.6-2.1-5.6-5.7-5.7C15.1 2 14.7 2 12 2z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z',
  tiktok: 'M16.6 2h-3.3v13.2a2.8 2.8 0 1 1-2-2.7V9.1a6.1 6.1 0 1 0 5.3 6V8.4a7.6 7.6 0 0 0 4.4 1.4V6.5a4.4 4.4 0 0 1-4.4-4.5z',
};
export const SOCIAL_KEYS = ['facebook', 'instagram', 'youtube', 'tiktok'];
export const SOCIAL_NAMES = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok' };

export function SocialIcon({ name, size = 22, className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden className={className}>
      <path d={paths[name]} />
    </svg>
  );
}
