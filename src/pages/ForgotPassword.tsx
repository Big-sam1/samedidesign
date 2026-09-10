import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheckIcon } from 'lucide-react';
import { IMG } from '../data/images';
import { EASE_SMOOTH } from '../animations/variants';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ForgotPassword() {
  const { resetPassword } = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    await resetPassword(email);
    setSubmitting(false);
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset Your Password"
      subtitle="Enter the email on your account and we will send a secure reset link."
      image={IMG.serum}
      imageHeadline="Back to Shopping in Minutes"
      imageCaption="Reset links stay valid for 30 minutes."
      footer={
      <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Back to login
          </Link>
        </>
      }>
      
      {sent ?
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_SMOOTH }}
        className="rounded-2xl border border-line bg-canvas p-6"
        role="status">
        
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
            <MailCheckIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-[17px] font-bold text-ink">Check your inbox</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            We sent a password reset link to <span className="font-semibold text-ink">{email}</span>. It expires in 30
            minutes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/login" variant="secondary" size="sm">
              Back to login
            </Button>
            <Button size="sm" onClick={() => setSent(false)}>
              Use another email
            </Button>
          </div>
        </motion.div> :

      <form onSubmit={submit} className="space-y-4" noValidate>
          <Input
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
          }}
          error={error}
          placeholder="you@email.com"
          autoComplete="email" />
        
          <Button type="submit" size="lg" fullWidth>
            Send Reset Link
          </Button>
        </form>
      }
    </AuthShell>);

}