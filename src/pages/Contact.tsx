import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { EASE_SMOOTH, fadeUp, staggerContainer, viewportOnce } from '../animations/variants';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';

const details = [
  { Icon: PhoneIcon, label: 'Call & WhatsApp', value: '0784264931', detail: 'Instant reply for orders & sizing' },
  { Icon: MapPinIcon, label: 'Store Location', value: 'Nyamirambo Biryogo', detail: 'First SHOP in Town Bigsize store' },
  { Icon: MailIcon, label: 'Business & Sizing', value: 'We Sell Clothes', detail: 'Big size collections & modern fashion' },
  { Icon: ClockIcon, label: 'Opening hours', value: 'Mon–Sun 8am – 9pm', detail: 'Open 7 days a week in Biryogo' }
];


interface Fields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '79f796a9-2033-42f1-8bc5-5a17fedb219c';

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Fields> = {};
    if (fields.name.trim().length < 2) next.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Enter a valid email address';
    if (fields.message.trim().length < 5) next.message = 'Tell us a little more (5+ characters)';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('name', fields.name.trim());
      formData.append('email', fields.email.trim());
      if (fields.phone.trim()) formData.append('phone', fields.phone.trim());
      formData.append('message', fields.message.trim());
      formData.append('from_name', 'Samedi design Customer Inquiry');
      formData.append('subject', `New Message from ${fields.name.trim()} - Samedi design`);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        setFields({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitError(data.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setSubmitError('Failed to connect to form service. Please call or WhatsApp us on 0784264931.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Questions about an order, a product or a return? We answer fast."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
            className="rounded-3xl border border-line bg-white p-6 sm:p-8"
            aria-labelledby="contact-form-heading">
            
            <h2 id="contact-form-heading" className="text-[20px] font-bold text-ink">
              Send us a message
            </h2>
            <p className="mt-1.5 text-[13.5px] text-muted">We reply to every message, usually within the hour.</p>

            <AnimatePresence mode="wait" initial={false}>
              {sent ?
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_SMOOTH }}
                role="status"
                className="mt-7 rounded-2xl border border-line bg-canvas p-7 text-center">
                
                  <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 24, delay: 0.08 }}
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
                  
                    <CheckIcon className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                  <h3 className="mt-5 text-[18px] font-bold text-ink">Message sent</h3>
                  <p className="mt-2 text-[13.5px] text-muted">
                    Thanks for reaching out — a member of the support team will reply by email shortly.
                  </p>
                  <div className="mt-6">
                    <Button variant="secondary" size="sm" onClick={() => setSent(false)}>
                      Send another message
                    </Button>
                  </div>
                </motion.div> :

              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={submit}
                className="mt-7 space-y-4"
                noValidate>
                
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Name" name="name" value={fields.name} onChange={setField('name')} error={errors.name} placeholder="Your name" />
                    <Input label="Email" name="email" type="email" value={fields.email} onChange={setField('email')} error={errors.email} placeholder="your@email.com" />
                  </div>
                  <Textarea label="Message" name="message" value={fields.message} onChange={setField('message')} error={errors.message} placeholder="How can we help?" />
                  {submitError && (
                    <div className="rounded-xl bg-red-50 p-3.5 text-[13px] font-medium text-red-600 border border-red-200">
                      {submitError}
                    </div>
                  )}
                  <Button type="submit" size="lg" disabled={submitting}>
                    {submitting ? 'Sending....' : 'Submit Form'}
                  </Button>
                </motion.form>
              }
            </AnimatePresence>
          </motion.section>

          <div className="space-y-5">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid gap-4 sm:grid-cols-2">
              
              {details.map(({ Icon, label, value, detail }) =>
              <motion.div key={label} variants={fadeUp} className="rounded-2xl border border-line bg-white p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[11.5px] font-bold uppercase tracking-wider text-muted">{label}</p>
                  <p className="mt-1 text-[14px] font-semibold text-ink">{value}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">{detail}</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative overflow-hidden rounded-2xl border border-line bg-canvas p-6 text-center">
              
              <div className="flex flex-col items-center justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-accent shadow-card">
                  <MapPinIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[16px] font-bold text-ink">Samedi design Store</p>
                <p className="mt-1 text-[13px] font-semibold text-accent">First SHOP in Town Bigsize store Shopping</p>
                <p className="mt-0.5 text-[12.5px] text-muted">We sell clothes · Nyamirambo Biryogo, Kigali, Rwanda</p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <a
                    href="https://wa.me/250784264931"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-hover shadow-sm">
                    <PhoneIcon className="h-3.5 w-3.5" />
                    WhatsApp: 0784264931
                  </a>
                  <a
                    href="tel:0784264931"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[12.5px] font-semibold text-charcoal transition-colors hover:bg-canvas">
                    <PhoneIcon className="h-3.5 w-3.5" />
                    Call Direct
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>);

}