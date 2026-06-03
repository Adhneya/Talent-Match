'use client';

import { useMemo, useState } from 'react';
import { useForm } from '@/context/FormContext';
import { COMPANIES, type Company } from '@/lib/companies';
import { Heart, Cross, Cards, MapPin, Users, Spark } from '@/components/Icons';
import ChatModal from '@/components/ChatModal';
import { useChat } from '@/hooks/useChat';

type Tab = 'swipe' | 'matches';

export default function DiscoverPage() {
  const { liked, passed, update } = useForm();
  const [tab, setTab] = useState<Tab>('swipe');
  const { peer, messages, openChat, closeChat, send } = useChat();

  const deck = useMemo(
    () => COMPANIES.filter((c) => !liked.includes(c.id) && !passed.includes(c.id)),
    [liked, passed],
  );
  const current = deck[0];

  function decide(action: 'like' | 'pass') {
    if (!current) return;
    if (action === 'like') update({ liked: [...liked, current.id] });
    else update({ passed: [...passed, current.id] });
  }

  const matched = COMPANIES.filter((c) => liked.includes(c.id));

  return (
    <main className="wrap" style={{ paddingBottom: 120 }}>
      <section className="col" style={{ padding: '20px 0 40px' }}>
        <h1 className="t-h1" style={{ textAlign: 'center', marginBottom: 28 }}>
          {tab === 'swipe' ? 'Discover Companies' : 'Your Matches'}
        </h1>

        {tab === 'swipe' ? (
          current ? (
            <SwipeCard company={current} onDecide={decide} />
          ) : (
            <EmptyDeck count={matched.length} onSeeMatches={() => setTab('matches')} />
          )
        ) : (
          <MatchesList
            companies={matched}
            onBack={() => setTab('swipe')}
            hasDeck={!!current}
            onChat={(c) => openChat({ id: c.id, name: c.name, subtitle: c.tagline })}
          />
        )}
      </section>

      <ChatModal peer={peer} messages={messages} onSend={send} onClose={closeChat} />
      <BottomNav tab={tab} setTab={setTab} matchCount={matched.length} />
    </main>
  );
}

function SwipeCard({ company, onDecide }: { company: Company; onDecide: (a: 'like' | 'pass') => void }) {
  return (
    <div className="card reveal" style={{ padding: '34px 34px 26px' }}>
      <h2 className="t-h1">{company.name}</h2>
      <p className="t-lead" style={{ marginTop: 6 }}>
        {company.tagline}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
        <span className="pill">
          <MapPin /> {company.location}
        </span>
        <span className="pill">
          <Users /> {company.size}
        </span>
        <span className="pill">
          <Spark /> {company.stage}
        </span>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: '18px 22px',
          borderRadius: 14,
          background: 'var(--accent-tint)',
          border: '1px solid var(--accent-line)',
        }}
      >
        <span style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--accent-ink)' }}>{company.trial}</span>
      </div>

      <p className="t-body t-muted" style={{ marginTop: 22 }}>
        {company.brief}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 30 }}>
        <RoundBtn label="Pass" variant="pass" onClick={() => onDecide('pass')}>
          <Cross />
        </RoundBtn>
        <RoundBtn label="Like" variant="like" onClick={() => onDecide('like')}>
          <Heart size={26} />
        </RoundBtn>
      </div>
    </div>
  );
}

function RoundBtn({
  children,
  label,
  variant,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  variant: 'pass' | 'like';
  onClick: () => void;
}) {
  const like = variant === 'like';
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 62,
        height: 62,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: like ? 'none' : '1.5px solid var(--hairline)',
        background: like ? 'var(--accent-ink)' : 'rgba(26,26,26,0.04)',
        color: like ? '#fff' : 'var(--muted)',
        transition: 'transform 160ms ease',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );
}

function EmptyDeck({ count, onSeeMatches }: { count: number; onSeeMatches: () => void }) {
  return (
    <div className="card" style={{ padding: '48px 34px', textAlign: 'center' }}>
      <h2 className="t-h2">You&apos;ve seen everyone for now.</h2>
      <p className="t-body t-muted" style={{ marginTop: 12 }}>
        {count > 0
          ? `You matched with ${count} ${count === 1 ? 'company' : 'companies'}.`
          : 'No matches yet — check back as new companies join.'}
      </p>
      {count > 0 && (
        <button className="btn btn--primary btn--lg" style={{ marginTop: 24 }} onClick={onSeeMatches}>
          View matches
        </button>
      )}
    </div>
  );
}

function MatchesList({
  companies,
  onBack,
  hasDeck,
  onChat,
}: {
  companies: Company[];
  onBack: () => void;
  hasDeck: boolean;
  onChat: (c: Company) => void;
}) {
  if (companies.length === 0) {
    return (
      <div className="card" style={{ padding: '48px 34px', textAlign: 'center' }}>
        <h2 className="t-h2">No matches yet.</h2>
        <p className="t-body t-muted" style={{ marginTop: 12 }}>
          Swipe right on a company to start a conversation.
        </p>
        {hasDeck && (
          <button className="btn btn--primary btn--lg" style={{ marginTop: 24 }} onClick={onBack}>
            Back to swiping
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {companies.map((c) => (
        <div key={c.id} className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <h3 className="t-h3">{c.name}</h3>
            <span className="t-label" style={{ color: 'var(--accent-ink)', flex: '0 0 auto' }}>
              Matched
            </span>
          </div>
          <p className="t-body t-muted" style={{ marginTop: 4 }}>
            {c.tagline}
          </p>
          <p style={{ marginTop: 12, fontSize: '0.92rem', fontWeight: 600, color: 'var(--accent-ink)' }}>{c.trial}</p>
          <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={() => onChat(c)}>
            Open Chat
          </button>
        </div>
      ))}
    </div>
  );
}

function BottomNav({ tab, setTab, matchCount }: { tab: Tab; setTab: (t: Tab) => void; matchCount: number }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid var(--hairline)',
        display: 'flex',
        justifyContent: 'center',
        gap: 80,
        padding: '12px 0 calc(env(safe-area-inset-bottom, 0px) + 16px)',
      }}
    >
      <NavItem active={tab === 'swipe'} onClick={() => setTab('swipe')} label="Swipe">
        <Cards />
      </NavItem>
      <NavItem active={tab === 'matches'} onClick={() => setTab('matches')} label="Matches" badge={matchCount}>
        <Heart filled={tab === 'matches'} size={22} />
      </NavItem>
    </nav>
  );
}

function NavItem({
  active,
  onClick,
  label,
  children,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        background: 'transparent',
        border: 'none',
        color: active ? 'var(--accent-ink)' : 'var(--muted)',
        fontWeight: 600,
        fontSize: '0.8rem',
        position: 'relative',
      }}
    >
      {children}
      <span>{label}</span>
      {badge ? (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 999,
            background: 'var(--accent-ink)',
            color: '#fff',
            fontSize: '0.66rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
