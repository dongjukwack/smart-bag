import React from 'react';


interface StatusCardProps {
  status: 'NORMAL' | 'WARNING' | 'ERROR';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  status, 
  title, 
  description, 
  icon,
  children,
  footer 
}) => {
  const isNormal = status === 'NORMAL';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Title section */}
      <div className="px-5 pt-5 pb-3">
        {status === 'ERROR' && (
          <div className="mb-2 text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        )}
        <h2 className={`text-xl font-bold ${isNormal ? 'text-gray-900' : 'text-red-600'}`}>{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      
      {/* Icon area */}
      {icon && (
        <div className="flex justify-center px-5 py-4">
          {icon}
        </div>
      )}
      
      {/* Children */}
      {children && <div className="px-5 pb-4">{children}</div>}
      
      {/* Footer */}
      {footer && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};
