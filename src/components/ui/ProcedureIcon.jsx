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
  intracranial: (
    <>
      <path d="M8 40c4-8 8-12 16-12s12-4 16-12" />
      <rect x="17" y="23" width="14" height="7" rx="3.5" transform="rotate(-25 24 26.5)" />
      <circle cx="40" cy="16" r="2.5" />
    </>
  ),
  vertebral: (
    <>
      <path d="M17 44c0-10 2-20 7-32M31 44c0-10-2-20-7-32" />
      <path d="M14 18h20M14 26h20M15 34h18" strokeDasharray="2 3" />
    </>
  ),
  fistula: (
    <>
      <path d="M4 16h16c4 0 6 4 8 8s4 8 8 8h8" />
      <path d="M4 32h10c3 0 5-2 7-5" />
      <circle cx="24" cy="24" r="3" />
    </>
  ),
  embolization: (
    <>
      <path d="M6 40 22 24" />
      <circle cx="31" cy="17" r="11" />
      <path d="M27 13l8 8M35 13l-8 8" />
    </>
  ),
  venous: (
    <>
      <path d="M6 12c10 0 14 6 18 12s8 12 18 12" />
      <path d="M6 20c8 0 11 4 14 8" strokeDasharray="2 4" />
      <rect x="19" y="20" width="12" height="7" rx="3.5" transform="rotate(35 25 23.5)" />
    </>
  ),
  spinal: (
    <>
      <path d="M24 4v40" />
      <path d="M16 10h16M16 18h16M16 26h16M16 34h16" />
      <path d="M30 6c6 6 6 30 0 36" />
    </>
  ),
  vasospasm: (
    <>
      <path d="M4 24h10c3 0 4-3 6-3s3 6 4 6 2-6 4-6 3 3 6 3h10" />
      <path d="M20 14l4-4 4 4M20 34l4 4 4-4" />
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
