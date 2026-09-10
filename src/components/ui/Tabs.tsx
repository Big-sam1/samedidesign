import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SMOOTH } from '../../animations/variants';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="flex gap-6 overflow-x-auto border-b border-line no-scrollbar">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={tab.id === active.id}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`relative shrink-0 pb-3 text-sm font-semibold transition-colors duration-200 ease-smooth ${
          tab.id === active.id ? 'text-accent' : 'text-muted hover:text-ink'}`
          }>
          
            {tab.label}
            {tab.id === active.id &&
          <motion.span
            layoutId="tab-underline"
            className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-accent"
            transition={{ duration: 0.25, ease: EASE_SMOOTH }} />

          }
          </button>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: EASE_SMOOTH }}
          className="pt-6">
          
          {active.content}
        </motion.div>
      </AnimatePresence>
    </div>);

}