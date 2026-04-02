import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RowActionCardProps {
  title: string;
  description?: string;
  leading?: React.ReactNode;
  onClick?: () => void;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const RowActionCard: React.FC<RowActionCardProps> = ({
  title,
  description,
  leading,
  onClick,
  titleClassName = '',
  descriptionClassName = '',
}) => {
  const content = (
    <>
      {leading && <div className="row-action-card__leading">{leading}</div>}
      <div className="row-action-card__content">
        <div className={`row-action-card__title ${titleClassName}`.trim()}>{title}</div>
        {description && (
          <div className={`row-action-card__description ${descriptionClassName}`.trim()}>
            {description}
          </div>
        )}
      </div>
      <div className="row-action-card__trailing" aria-hidden="true">
        <ChevronRight size={18} />
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="row-action-card" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className="row-action-card">{content}</div>;
};
