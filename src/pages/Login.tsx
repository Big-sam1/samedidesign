import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMG } from '../data/images';
import { useStore } from '../contexts/StoreContext';

import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    // Administrator access is handled exclusively at /admin/login.
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/account');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const ok = await loginWithGoogle();
    setLoading(false);
    if (ok) {
      navigate('/account');
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
          subtitle="Log in to your Samedi design account."
      image={IMG.headphones}
      imageHeadline="Better Fits, Brighter Days"
      imageCaption="Curated clothes, big size fashion and streetwear."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          placeholder="you@email.com"
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-charcoal">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-line accent-accent"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-[13px] font-semibold text-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </Button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[12px] text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={loading}
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
      </form>
    </AuthShell>
  );
}