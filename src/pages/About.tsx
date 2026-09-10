import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshakeIcon, LeafIcon, SparklesIcon, TruckIcon } from 'lucide-react';
import { IMG } from '../data/images';
import { companyStats, team, testimonials } from '../data/site';
import { EASE_SMOOTH, fadeUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from '../animations/variants';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TestimonialCard } from '../components/ui/TestimonialCard';

const reasons = [
{ Icon: SparklesIcon, title: 'Curated, not endless', detail: 'Every product is chosen by our buying team and tested before it goes live.' },
{ Icon: TruckIcon, title: 'Genuinely fast shipping', detail: 'Regional warehouses mean most orders arrive in two to five days.' },
{ Icon: HeartHandshakeIcon, title: 'Support that answers', detail: 'Real people, 24/7, with a median first-reply time under 20 minutes.' },
{ Icon: LeafIcon, title: 'Lower-waste packaging', detail: 'Recyclable, right-sized boxes with no plastic filler.' }];


export function About() {
  return (
    <div>
      <section className="bg-canvas" aria-label="About Samedi design">
        <div className="mx-auto grid w-full max-w-shell items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div variants={slideInLeft} initial="hidden" animate="visible">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">About Samedi design</p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] text-ink sm:text-[46px]">
              First SHOP in Town
              <br />
              Bigsize Store Shopping
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
              <strong>We sell clothes.</strong> Based in <strong>Nyamirambo Biryogo</strong>, Samedi design is Kigali&apos;s premier destination for trending fashion and premium Big Size collections. We ensure everyone finds the right fit, style, and confidence without compromise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop" size="lg">
                Shop the collection
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Talk to us
              </Button>
            </div>
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" animate="visible" className="overflow-hidden rounded-3xl">
            <img src={IMG.fashion} alt="A Samedi design customer wearing pieces from our big size fashion edit" className="aspect-[4/3] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-shell px-4 sm:px-6">
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 border-b border-line py-12 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Company statistics">
          
          {companyStats.map((stat) =>
          <motion.div key={stat.label} variants={fadeUp} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[32px] font-extrabold leading-none text-ink">{stat.value}</p>
              <p className="mt-2 text-[13px] text-muted">{stat.label}</p>
            </motion.div>
          )}
        </motion.section>

        <section className="grid gap-10 py-14 lg:grid-cols-2" aria-labelledby="story-heading">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <h2 id="story-heading" className="text-2xl font-bold text-ink">
              Our story
            </h2>
            <div className="mt-4 space-y-4 text-[14.5px] leading-relaxed text-muted">
              <p>
                We began with a clear mission in Nyamirambo Biryogo, Kigali: to become the first shop in town catering directly to modern clothing and big size fashion that you couldn't easily find elsewhere.
              </p>
              <p>
                Today, Samedi design serves thousands of delighted customers across Rwanda and beyond. Every garment is carefully hand-checked for fit, fabric quality, and lasting style before reaching our hangers.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="rounded-3xl border border-line bg-canvas p-8">
            <h2 className="text-2xl font-bold text-ink">Our mission</h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              To make buying well-made clothes straightforward — accurate sizing for all body types, honest descriptions, fair pricing, and personal service via Call &amp; WhatsApp.
            </p>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              If a product cannot earn a place in someone&apos;s daily rotation, it does not belong in our collection.
            </p>
          </motion.div>
        </section>

        <section className="py-6" aria-labelledby="why-heading">
          <div id="why-heading">
            <SectionHeading title="Why choose Samedi design" subtitle="Four things we hold ourselves to on every order." />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {reasons.map(({ Icon, title, detail }) =>
            <motion.div key={title} variants={fadeUp} className="rounded-2xl border border-line bg-white p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-ink">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{detail}</p>
              </motion.div>
            )}
          </motion.div>
        </section>

        <section className="py-14" aria-labelledby="team-heading">
          <div id="team-heading">
            <SectionHeading title="The team" subtitle="A small group of buyers, builders and support specialists." />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            
            {team.map((member) =>
            <motion.article key={member.name} variants={fadeUp} className="overflow-hidden rounded-2xl border border-line bg-white">
                <img src={IMG.team} alt={member.name} loading="lazy" className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <p className="text-[14px] font-bold text-ink">{member.name}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">{member.role}</p>
                </div>
              </motion.article>
            )}
          </motion.div>
        </section>

        <section className="pb-14" aria-labelledby="about-testimonials">
          <div id="about-testimonials">
            <SectionHeading title="Customer testimonials" subtitle="Straight from verified Samedi design customers." />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-3">
            
            {testimonials.map((testimonial) =>
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            )}
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          className="mb-6 rounded-3xl bg-ink px-8 py-12 text-center">
          
          <h2 className="text-[26px] font-extrabold text-white sm:text-[32px]">Ready to find your next favourite?</h2>
          <p className="mx-auto mt-3 max-w-lg text-[14.5px] text-white/70">
            Free shipping over $50, 30-day returns, and support that replies in minutes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="/shop" size="lg">
              Shop all products
            </Button>
            <Button to="/new-arrivals" variant="secondary" size="lg">
              See new arrivals
            </Button>
          </div>
        </motion.section>
      </div>
    </div>);

}