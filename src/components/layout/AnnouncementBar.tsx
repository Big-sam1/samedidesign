import React from 'react';
import { SparklesIcon, TagIcon, TruckIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const icons = [TruckIcon, TagIcon, SparklesIcon];

export function AnnouncementBar() {
  const { siteContent } = useData();
  const list = siteContent.announcements;

  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex w-full max-w-shell items-center justify-center gap-8 px-4 py-2 sm:px-6">
        {list.map((message, index) => {
          const Icon = icons[index % icons.length] ?? TruckIcon;
          return (
            <p
              key={message + index}
              className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-tight text-white/90 ${
                index === 0 ? '' : 'hidden sm:flex'
              }`}
            >
              <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {message}
            </p>
          );
        })}
      </div>
    </div>
  );
}