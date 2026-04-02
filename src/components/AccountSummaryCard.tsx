import React from 'react';
import { Card } from 'antd-mobile';
import { UserRound } from 'lucide-react';

type Accent = 'blue' | 'emerald';

interface AccountSummaryCardProps {
  label: string;
  name: string;
  accent?: Accent;
}

const accentStyles: Record<Accent, React.CSSProperties> = {
  blue: {
    '--summary-accent-start': '#2563eb',
    '--summary-accent-end': '#60a5fa',
    '--summary-accent-soft': '#eff6ff',
    '--summary-accent-border': '#dbeafe',
  } as React.CSSProperties,
  emerald: {
    '--summary-accent-start': '#059669',
    '--summary-accent-end': '#34d399',
    '--summary-accent-soft': '#ecfdf5',
    '--summary-accent-border': '#d1fae5',
  } as React.CSSProperties,
};

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  label,
  name,
  accent = 'blue',
}) => {
  return (
    <Card
      style={{
        borderRadius: '24px',
        border: '1px solid var(--summary-accent-border)',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--summary-accent-soft) 88%, white) 0%, #ffffff 100%)',
        boxShadow: '0 14px 32px color-mix(in srgb, var(--summary-accent-start) 10%, transparent)',
      }}
      bodyStyle={{ padding: '20px 22px' }}
    >
      <div className="account-summary-card" style={accentStyles[accent]}>
        <div className="account-summary-card__identity">
          <div className="account-summary-card__avatar" aria-hidden="true">
            <UserRound size={24} />
          </div>
          <div className="account-summary-card__identity-copy">
            <p className="account-summary-card__label">{label}</p>
            <h2 className="account-summary-card__name">{name}</h2>
          </div>
        </div>
      </div>
    </Card>
  );
};
