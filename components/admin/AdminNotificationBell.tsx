'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import type { NotificationItem, NotificationsPayload } from '@/app/api/admin/notifications/route';

const POLL_INTERVAL_MS = 60_000; // 1 minute
const LS_LAST_SEEN_KEY = 'admin_notifications_last_seen';

const TYPE_LABELS: Record<NotificationItem['type'], string> = {
  consultation: 'Consultation',
  inquiry: 'Inquiry',
  waitlist: 'Waitlist',
  member: 'New Member',
};

const TYPE_COLORS: Record<NotificationItem['type'], string> = {
  consultation: '#c17b5a',
  inquiry: '#7b8fc1',
  waitlist: '#6ba889',
  member: '#9b7bc1',
};

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminNotificationBell() {
  const [data, setData] = useState<NotificationsPayload | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load last-seen timestamp from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_LAST_SEEN_KEY);
      if (stored) setLastSeen(parseInt(stored, 10));
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      const payload: NotificationsPayload = await res.json();
      setData(payload);
    } catch {}
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  function handleBellClick() {
    if (!isOpen) {
      // Mark all as seen
      const now = Date.now();
      setLastSeen(now);
      try {
        localStorage.setItem(LS_LAST_SEEN_KEY, String(now));
      } catch {}
    }
    setIsOpen((prev) => !prev);
  }

  const unreadCount = data
    ? data.items.filter((item) => new Date(item.createdAt).getTime() > lastSeen).length
    : 0;

  const displayCount = unreadCount > 99 ? '99+' : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <button
        ref={buttonRef}
        onClick={handleBellClick}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--admin-border, #e5e0d8)',
          background: 'var(--admin-surface-muted, #f9f6f1)',
          color: 'var(--admin-color-text, #3d3530)',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--admin-surface, #fff)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            'var(--admin-surface-muted, #f9f6f1)';
        }}
      >
        <BellIcon className="h-[1.1rem] w-[1.1rem]" />
        {displayCount && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-0.35rem',
              right: '-0.35rem',
              minWidth: '1.1rem',
              height: '1.1rem',
              borderRadius: '999px',
              background: '#c0392b',
              color: '#fff',
              fontSize: '0.625rem',
              fontWeight: 700,
              lineHeight: '1.1rem',
              textAlign: 'center',
              padding: '0 0.25rem',
              border: '1.5px solid var(--admin-color-bg, #f5f0e8)',
              letterSpacing: '-0.01em',
            }}
          >
            {displayCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '22rem',
            maxHeight: '28rem',
            overflowY: 'auto',
            background: 'var(--admin-surface, #fff)',
            border: '1px solid var(--admin-border, #e5e0d8)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.875rem 1rem 0.625rem',
              borderBottom: '1px solid var(--admin-border, #e5e0d8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--admin-color-text-micro, #9b8e82)',
              }}
            >
              Activity
            </span>
            {data && data.counts.total > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--admin-color-text-micro, #9b8e82)',
                }}
              >
                {data.counts.total} pending
              </span>
            )}
          </div>

          {/* Items */}
          {!data ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--admin-color-text-micro, #9b8e82)',
              }}
            >
              Loading…
            </div>
          ) : data.items.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--admin-color-text-micro, #9b8e82)',
              }}
            >
              No pending items
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {data.items.map((item) => {
                const isUnread = new Date(item.createdAt).getTime() > lastSeen;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--admin-border, #e5e0d8)',
                        background: isUnread
                          ? 'color-mix(in srgb, var(--admin-color-accent, #c17b5a) 6%, transparent)'
                          : 'transparent',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background =
                          'var(--admin-surface-muted, #f9f6f1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = isUnread
                          ? 'color-mix(in srgb, var(--admin-color-accent, #c17b5a) 6%, transparent)'
                          : 'transparent';
                      }}
                    >
                      {/* Color dot */}
                      <span
                        style={{
                          flexShrink: 0,
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          background: TYPE_COLORS[item.type],
                          marginTop: '0.35rem',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: 'var(--admin-color-text, #3d3530)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </span>
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: '0.65rem',
                              color: 'var(--admin-color-text-micro, #9b8e82)',
                            }}
                          >
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginTop: '0.15rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: TYPE_COLORS[item.type],
                            }}
                          >
                            {TYPE_LABELS[item.type]}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--admin-color-text-micro, #9b8e82)',
                            }}
                          >
                            · {item.description}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer quick links */}
          {data && data.items.length > 0 && (
            <div
              style={{
                padding: '0.625rem 1rem',
                display: 'flex',
                gap: '1rem',
                borderTop: '1px solid var(--admin-border, #e5e0d8)',
              }}
            >
              {data.counts.consultations > 0 && (
                <Link
                  href="/admin/consultations"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '0.7rem',
                    color: TYPE_COLORS.consultation,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {data.counts.consultations} consult{data.counts.consultations !== 1 ? 's' : ''}
                </Link>
              )}
              {data.counts.inquiries > 0 && (
                <Link
                  href="/admin/inquiries"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '0.7rem',
                    color: TYPE_COLORS.inquiry,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {data.counts.inquiries} quer{data.counts.inquiries !== 1 ? 'ies' : 'y'}
                </Link>
              )}
              {data.counts.waitlist > 0 && (
                <Link
                  href="/admin/members"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '0.7rem',
                    color: TYPE_COLORS.waitlist,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {data.counts.waitlist} waitlist
                </Link>
              )}
              {data.counts.members > 0 && (
                <Link
                  href="/admin/members"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '0.7rem',
                    color: TYPE_COLORS.member,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {data.counts.members} new member{data.counts.members !== 1 ? 's' : ''}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
