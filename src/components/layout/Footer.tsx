import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { footerColumns } from '../../data/site';
import { Logo } from '../ui/Logo';

const socials = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Twitter', Icon: TwitterIcon },
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'YouTube', Icon: YoutubeIcon },
  { label: 'LinkedIn', Icon: LinkedinIcon }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-shell px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo to="/" size="lg" />
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              <strong>We sell clothes.</strong> First SHOP in Town Bigsize store Shopping. Located in Nyamirambo Biryogo.
            </p>

            {/* Quick Contact Badge */}
            <div className="mt-4 space-y-2 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-[12.5px] text-ink">
                <MapPinIcon className="h-4 w-4 shrink-0 text-accent" />
                <span>Location: <strong>Nyamirambo Biryogo</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[12.5px] text-ink">
                <PhoneIcon className="h-4 w-4 shrink-0 text-accent" />
                <span>More info: <strong>0784264931</strong> (Call &amp; WhatsApp)</span>
              </div>
              <div className="pt-1.5 flex gap-2">
                <a
                  href="https://wa.me/250784264931"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-accent py-1.5 text-center text-[11.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  WhatsApp Us
                </a>
                <a
                  href="tel:0784264931"
                  className="flex-1 rounded-full border border-line py-1.5 text-center text-[11.5px] font-semibold text-ink transition-colors hover:bg-canvas"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {footerColumns.map((column) =>
          <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink">{column.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) =>
              <li key={`${column.heading}-${link.label}`}>
                    <Link to={link.to} className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {socials.map(({ label, Icon }) =>
            <a
              key={label}
              href="#"
              aria-label={label}
              onClick={(event) => event.preventDefault()}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-charcoal transition-colors duration-200 hover:border-accent/40 hover:text-accent">
              
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <p className="text-[12.5px] text-muted">We sell clothes · Bigsize store Shopping · Fast Delivery across Kigali &amp; Rwanda</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Samedi design. All rights reserved. Nyamirambo Biryogo · Tel &amp; WhatsApp: 0784264931</p>
          <div className="flex gap-5">
            <Link to="/shop" className="transition-colors hover:text-ink">
              Built by DMD
            </Link>
            <Link to="/contact" className="transition-colors hover:text-ink">
              Dream Maker Developers
            </Link>
          </div>
        </div>
      </div>
    </footer>);

}