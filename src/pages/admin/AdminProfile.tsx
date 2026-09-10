import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, CheckIcon, UserCheckIcon, Loader2Icon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function AdminProfile() {
  const { adminUser, updateAdminProfile } = useStore();
  const { pushToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone,
    city: adminUser.city ?? 'Kigali',
    country: adminUser.country ?? 'Rwanda',
    avatar: adminUser.avatar ?? ''
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (adminUser) {
      setFields({
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        city: adminUser.city ?? 'Kigali',
        country: adminUser.country ?? 'Rwanda',
        avatar: adminUser.avatar ?? ''
      });
    }
  }, [adminUser]);

  const setField = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      pushToast('Please choose an image under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFields((prev) => ({ ...prev, avatar: base64 }));
      pushToast('Photo loaded. Click "Save Administrator Profile" to commit.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateAdminProfile({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      city: fields.city,
      country: fields.country,
      avatar: fields.avatar
    });
    setSaving(false);

    setStatusMsg('Admin personal information saved.');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const currentAvatar = fields.avatar || adminUser.avatar || '/samed-design-logo.png';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <UserCheckIcon className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-black text-slate-900">Administrator Profile</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Update your administrator name, contact phone, location, and upload profile photo saved directly into Supabase.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="h-4 w-4" />
          {statusMsg}
        </div>
      )}

      {/* Avatar Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center gap-6">
        <div className="relative group">
          <img
            src={currentAvatar}
            alt={fields.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 bg-blue-50 shadow-sm"
            style={{ borderRadius: '100%' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
            title="Upload photo"
          >
            <CameraIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
            Primary Administrator
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{fields.name}</h3>
          <p className="text-xs text-slate-500">{fields.email}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {fields.city}, {fields.country} · {fields.phone}
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs">
        <h4 className="font-bold text-slate-900 text-sm">Personal Information</h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={fields.name}
            onChange={setField('name')}
            placeholder="Admin Name"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={fields.email}
            onChange={setField('email')}
            placeholder="admin@samedidesign.com"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={fields.phone}
            onChange={setField('phone')}
            placeholder="0784264931"
          />
          <Input
            label="City"
            name="city"
            value={fields.city}
            onChange={setField('city')}
            placeholder="Kigali"
          />
          <Input
            label="Country"
            name="country"
            value={fields.country}
            onChange={setField('country')}
            placeholder="Rwanda"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving to Supabase…' : 'Save Administrator Profile'}
          </Button>
          {saving && <Loader2Icon className="h-4 w-4 animate-spin text-blue-600" />}
        </div>
      </form>
    </div>
  );
}
