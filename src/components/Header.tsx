'use client';

import { usePathname, useRouter } from 'next/navigation';

/**
 * Header — structure converted VERBATIM from the provided HTML prototype.
 * Context-aware: the marketing nav shows only on the landing route; inside
 * the app (profile / discover / dashboard) it collapses to the wordmark so
 * the chrome matches where the user actually is.
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const links = ['How it works', 'For companies'];

  return (
    <header className="hdr">
      <div className="wrap hdr__inner">
        <a href="/" className="hdr__mark serif">
          TalentMatch
        </a>
        {isLanding ? (
          <nav className="hdr__nav">
            {links.map((l) => (
              <a key={l} href="#" className="hdr__link">
                {l}
              </a>
            ))}
            <a href="#" className="btn btn--ghost" onClick={() => router.push('/')}>
              Sign in
            </a>
            <button className="btn" onClick={() => router.push('/')}>
              Get started
            </button>
          </nav>
        ) : (
          <nav className="hdr__nav">
            <span className="t-fine" style={{ letterSpacing: '0.04em' }}>
              {pathname.startsWith('/dashboard') ? 'Hiring' : 'Candidate'}
            </span>
          </nav>
        )}
      </div>
    </header>
  );
}
