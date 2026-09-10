import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMG } from '../data/images';
import { useStore } from '../contexts/StoreContext';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Fields {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useStore();
  const [fields, setFields] = useState<Fields>({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Fields> = {};
    if (fields.name.trim().length < 3) next.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Enter a valid email address';
    if (fields.phone.trim().length < 7) next.phone = 'Enter a valid phone number';
    if (fields.password.length < 6) next.password = 'Use at least 6 characters';
    if (fields.confirm !== fields.password) next.confirm = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const ok = await register(fields.email, fields.password, fields.name, fields.phone);
    setLoading(false);
    if (ok) {
      navigate('/account');
    }
  };

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join Samedi design for faster checkout, saved sizes and early access to drops."
      image={IMG.sneakers}
      imageHeadline="Join Samedi design, Get the Best Deals"
      imageCaption="Members get first access to every sale."
      footer={
      <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Login
          </Link>
        </>
      }>
      
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Full Name" name="name" value={fields.name} onChange={setField('name')} error={errors.name} placeholder="Samuel Mugisha" autoComplete="name" />
        <Input label="Email Address" name="email" type="email" value={fields.email} onChange={setField('email')} error={errors.email} placeholder="you@email.com" autoComplete="email" />
        <Input label="Phone" name="phone" type="tel" value={fields.phone} onChange={setField('phone')} error={errors.phone} placeholder="+256 700 123 456" autoComplete="tel" />
        <Input label="Password" name="password" type="password" value={fields.password} onChange={setField('password')} error={errors.password} placeholder="••••••••" hint="At least 6 characters." autoComplete="new-password" />
        <Input label="Confirm Password" name="confirm" type="password" value={fields.confirm} onChange={setField('confirm')} error={errors.confirm} placeholder="••••••••" autoComplete="new-password" />

        <Button type="submit" size="lg" fullWidth>
          Create Account
        </Button>
      </form>
    </AuthShell>);

}