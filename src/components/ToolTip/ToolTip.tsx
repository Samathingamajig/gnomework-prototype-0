import React, { ReactChild } from 'react';
import './ToolTip.scss';

interface ToolTipProps {
  children: ReactChild | ReactChild[] | string | string[];
  hoverText: string;
  onClick?: (any: any) => any;
  className?: string;
}

export default function ToolTip({ children, hoverText, onClick, className }: ToolTipProps): JSX.Element {
  return (
    <span className={`ToolTip ${className}`} onClick={onClick}>
      {children}
      <div className="ToolTipText">{hoverText}</div>
    </span>
  );
}
