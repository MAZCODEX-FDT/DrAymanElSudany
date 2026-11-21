import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/i18n';

/** "Forward" arrow that points the reading direction (left in Arabic, right in English). */
export function ArrowForward({ diagonal, ...props }) {
  const { dir } = useLang();
  const Icon = diagonal ? (dir === 'rtl' ? ArrowUpLeft : ArrowUpRight) : dir === 'rtl' ? ArrowLeft : ArrowRight;
  return <Icon {...props} />;
}
