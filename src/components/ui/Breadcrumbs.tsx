import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: Crumb[];}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
        {items.map((item, index) =>
        <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.to ?
          <Link to={item.to} className="transition-colors duration-150 hover:text-ink">
                {item.label}
              </Link> :

          <span className="font-medium text-ink" aria-current="page">
                {item.label}
              </span>
          }
            {index < items.length - 1 && <ChevronRightIcon className="h-3.5 w-3.5 text-line" aria-hidden="true" />}
          </li>
        )}
      </ol>
    </nav>);

}