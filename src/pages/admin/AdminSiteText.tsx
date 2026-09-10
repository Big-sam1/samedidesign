import React, { useState } from 'react';
import { SettingsIcon, CheckIcon, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function AdminSiteText() {
  const { siteContent, updateSiteContent, resetToDefaults } = useData();
  const [announcements, setAnnouncements] = useState(siteContent.announcements.join('\n'));
  const [phone, setPhone] = useState(siteContent.contactPhone);
  const [location, setLocation] = useState(siteContent.contactLocation);
  const [heroHeadline, setHeroHeadline] = useState(siteContent.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(siteContent.heroSubheadline);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = announcements
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    await updateSiteContent({
      announcements: lines,
      contactPhone: phone,
      contactLocation: location,
      heroHeadline,
      heroSubheadline
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all edited content and products back to factory defaults?')) {
      resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <SettingsIcon className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900">Site Content &amp; Texts</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize announcements bar, store contacts, phone numbers, and hero banner messaging.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
          Reset to Factory Data
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="h-4 w-4" />
          Site text changes saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-xs">
        {/* Top Announcement Bar */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">
            Top Announcement Bar Messages (One announcement per line)
          </label>
          <textarea
            rows={4}
            value={announcements}
            onChange={(e) => setAnnouncements(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-slate-800 font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            These announcements cycle at the very top of the website.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Store WhatsApp &amp; Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Store Physical Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-semibold"
            />
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Hero Showcase Headline</h3>
          <div>
            <label className="block font-bold text-slate-800 mb-1">Main Heading</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Subheading / Description</label>
            <textarea
              rows={2}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <SaveIcon className="h-4 w-4" />
            Save All Content Updates
          </button>
        </div>
      </form>
    </div>
  );
}
