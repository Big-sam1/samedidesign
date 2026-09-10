import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPinIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { EASE_SMOOTH, fadeUp, staggerContainer } from '../../animations/variants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../utils/format';

const emptyDraft = { label: 'Home', name: '', street: '', city: '', postal: '', country: '' };

export function Addresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState<string | undefined>();

  const setField = (key: keyof typeof draft) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, [key]: event.target.value }));
    setError(undefined);
  };

  const save = () => {
    if (!draft.name.trim() || !draft.street.trim() || !draft.city.trim() || !draft.country.trim()) {
      setError('Name, street, city and country are required');
      return;
    }
    addAddress({ id: `addr-${Date.now()}`, ...draft, isDefault: addresses.length === 0 });
    setDraft(emptyDraft);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[20px] font-bold text-ink">Saved Addresses</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Add address
        </Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-6 grid gap-4 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {addresses.map((address) =>
          <motion.article
            key={address.id}
            layout
            variants={fadeUp}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.26, ease: EASE_SMOOTH }}
            className={cn(
              'rounded-2xl border bg-white p-5',
              address.isDefault ? 'border-accent/40 ring-1 ring-accent/15' : 'border-line'
            )}>
            
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-accent" aria-hidden="true" />
                  <p className="text-[14px] font-bold text-ink">{address.label}</p>
                  {address.isDefault &&
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-accent">
                      Default
                    </span>
                }
                </div>
                <button
                type="button"
                onClick={() => removeAddress(address.id)}
                aria-label={`Remove ${address.label} address`}
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-charcoal transition-colors duration-200 hover:text-red-500">
                
                  <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-3 text-[13.5px] font-semibold text-ink">{address.name}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {address.street}
                <br />
                {address.city}, {address.postal}
                <br />
                {address.country}
              </p>
              {!address.isDefault &&
            <button
              type="button"
              onClick={() => setDefaultAddress(address.id)}
              className="mt-4 text-[12.5px] font-semibold text-accent hover:underline">
              
                  Set as default
                </button>
            }
            </motion.article>
          )}
        </AnimatePresence>
      </motion.div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a new address"
        description="Used at checkout for shipping and billing."
        footer={
        <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save address</Button>
          </div>
        }>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Label" name="label" value={draft.label} onChange={setField('label')} placeholder="Home" />
          <Input label="Full Name" name="name" value={draft.name} onChange={setField('name')} placeholder="Samuel Mugisha" />
          <div className="sm:col-span-2">
            <Input label="Street" name="street" value={draft.street} onChange={setField('street')} placeholder="12 Rosewood Avenue" />
          </div>
          <Input label="City" name="city" value={draft.city} onChange={setField('city')} placeholder="Kampala" />
          <Input label="Postal Code" name="postal" value={draft.postal} onChange={setField('postal')} placeholder="10101" />
          <div className="sm:col-span-2">
            <Input label="Country" name="country" value={draft.country} onChange={setField('country')} placeholder="Uganda" error={error} />
          </div>
        </div>
      </Modal>
    </div>);

}