/* =============================================
   COMPONENT: PageHeader
   PATH: src/components/common/PageHeader.tsx
   ============================================= */

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-zinc-400 mt-1">{description}</p>}
      </div>
      {children && <div className="mt-4 md:mt-0">{children}</div>}
    </div>
  );
}