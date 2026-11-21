// Abstract line icons per procedure (paths and nodes, never a literal brain), per the brand rules.
const paths = {
  diagnostic: (
    <>
      <path d="M8 40c6-2 9-8 12-14s8-12 16-14" />
      <circle cx="36" cy="12" r="6" />
      <path d="M40.5 16.5 45 21" />
    </>
  ),
  carotid: (
    <>
      <path d="M18 44V26c0-6 3-10 6-14M30 44V26c0-6-3-10-6-14" />
      <path d="M24 12V4" />
      <rect x="15" y="27" width="18" height="8" rx="4" />
    </>
  ),
  aneurysm: (
    <>
      <path d="M4 34h14c4 0 6-3 6-6" />
      <path d="M24 28c0 3 2 6 6 6h14" />
      <circle cx="24" cy="19" r="8" />
      <path d="M20 17c1.5-2 3-3 5-3" />
    </>
  ),
  avm: (
    <>
      <path d="M4 14c8 0 10 10 20 10s12-10 20-10" />
      <path d="M4 34c8 0 10-10 20-10s12 10 20 10" />
      <circle cx="24" cy="24" r="4" />
    </>
  ),
  stroke: (
    <>
      <path d="M4 24h12l4-10 6 20 4-10h14" />
      <circle cx="40" cy="12" r="3" />
    </>
  ),
  subdural: (
    <>
      <path d="M8 30a16 16 0 0 1 32 0" />
      <path d="M13 30a11 11 0 0 1 22 0" strokeDasharray="2 4" />
      <path d="M24 30v12" />
    </>
  ),
};

export function ProcedureIcon({ name, className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name] || paths.diagnostic}
    </svg>
  );
}
