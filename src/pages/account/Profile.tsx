import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { IMG } from '../../data/images';
import { useStore } from '../../contexts/StoreContext';
import { useToast } from '../../contexts/ToastContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Profile() {
  const { user, updateUserProfile } = useStore();
  const { pushToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '0784264931',
    city: user?.city ?? 'Kigali',
    country: user?.country ?? 'Rwanda',
    avatar: user?.avatar ?? ''
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ orders: true, drops: true, offers: false });

  useEffect(() => {
    if (user) {
      setFields({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '0784264931',
        city: user.city ?? 'Kigali',
        country: user.country ?? 'Rwanda',
        avatar: user.avatar ?? ''
      });
    }
  }, [user]);

  const setField = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      pushToast('Please select an image under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFields((prev) => ({ ...prev, avatar: base64 }));
      pushToast('Photo uploaded! Click "Save Changes" to sync with Supabase.');
    };
    reader.readAsDataURL(file);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (fields.name.trim().length < 3) next.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Enter a valid email address';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    const ok = await updateUserProfile({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      city: fields.city,
      country: fields.country,
      avatar: fields.avatar
    });
    setSaving(false);
  };

  const currentAvatar = fields.avatar || user?.avatar || IMG.team;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative group">
            <img
              src={currentAvatar}
              alt={fields.name || 'User avatar'}
              className="h-20 w-20 rounded-full object-cover border-2 border-line bg-canvas shadow-xs"
              style={{ borderRadius: '100%' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-accent text-white shadow-md hover:bg-accent-hover transition"
              title="Upload photo"
            >
              <CameraIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-ink">{fields.name || 'User Profile'}</h2>
            <p className="mt-0.5 text-[13px] text-muted">{fields.email}</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5">
              Synced to Supabase Database · {fields.city}, {fields.country}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
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
              Change photo
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.form variants={fadeUp} onSubmit={submit} className="rounded-2xl border border-line bg-white p-6" noValidate>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-bold text-ink">Personal information</h3>
            <p className="text-xs text-muted">All profile changes are persisted directly to Supabase.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={fields.name}
            onChange={setField('name')}
            error={errors.name}
            placeholder="Samuel Mugisha"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={fields.email}
            onChange={setField('email')}
            error={errors.email}
            placeholder="you@email.com"
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

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving to Supabase…' : 'Save Changes'}
          </Button>
          {saving && <Loader2Icon className="h-4 w-4 animate-spin text-accent" />}
        </div>
      </motion.form>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white p-6">
        <h3 className="text-[16px] font-bold text-ink">Email preferences</h3>
        <div className="mt-4 space-y-3">
          {[
          { key: 'orders' as const, label: 'Order and delivery updates', detail: 'Receipts, dispatch and tracking notices' },
          { key: 'drops' as const, label: 'New arrivals', detail: 'A single email when a new collection lands' },
          { key: 'offers' as const, label: 'Sales and promotions', detail: 'Flash sales and seasonal discounts' }].
          map((option) =>
          <label key={option.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
              <input
              type="checkbox"
              checked={notifications[option.key]}
              onChange={(event) => setNotifications((prev) => ({ ...prev, [option.key]: event.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-line accent-accent" />
            
              <span>
                <span className="block text-[13.5px] font-semibold text-ink">{option.label}</span>
                <span className="block text-[12.5px] text-muted">{option.detail}</span>
              </span>
            </label>
          )}
        </div>
      </motion.section>
    </motion.div>);

}