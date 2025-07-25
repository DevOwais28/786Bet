/* Home.tsx ---------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import { Link, Route } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Zap, Shield, Users, Coins, Trophy, TrendingUp,
  ArrowRight, Menu, X
} from 'lucide-react';

/* ---------- Reusable Button ---------- */
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' }
>(({ className, variant = 'solid', ...props }, ref) => {
  const base =
    'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900';
  const styles =
    variant === 'outline'
      ? 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
      : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow';
  return <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />;
});

/* ---------- Header with Hamburger ---------- */
const Header = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/game-room', label: 'Game Room' },
    { to: '/deposit', label: 'Deposit' },
    { to: '/withdraw', label: 'Withdraw' },
    { to: '/admin', label: 'Admin' }
  ];

  return (
    <header className="relative z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/">
          <span className="text-2xl font-bold tracking-tight text-yellow-400">786Bet</span>
        </Link>

        {/* desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.to} href={l.to} className="text-white/70 hover:text-yellow-400">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* mobile hamburger */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden sm:inline-flex">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="hidden sm:inline-flex">Sign Up</Button>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white md:hidden"
            aria-label="toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col gap-4 p-6">
              {links.map((l) => (
                <Link key={l.to} href={l.to}>
                  <a className="text-white/70 hover:text-yellow-400" onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </Link>
              ))}
              <Link href="/login">
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Sign Up
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


//* ---------- Hero – fully centered ---------- */
const Hero = () => (
  <section className="relative isolate flex items-center justify-center overflow-hidden px-6 pt-10 pb-16 min-h-[90vh]">  <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center justify-items-center gap-12 md:grid-cols-2 md:gap-20">   {/* left */}
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tighter text-white sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Aviator
          </span>{' '}
          <span className="block">Crash Game</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-lg text-lg text-gray-300 md:text-xl"
        >
          Premium gaming experiences with instant payouts and the most exciting crash games in the
          industry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/register">
            <Button className="group">
              Start Playing Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button variant="outline">Watch Demo</Button>
          </Link>
        </motion.div>
      </div>

      {/* right Lottie */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex justify-center"
      >
        <DotLottieReact
          src="https://lottie.host/1a620877-cb99-4b21-a064-5ea740fdde72/BaDc7bTvKs.lottie"
          loop
          autoplay
          className="h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
        />
      </motion.div>
    </div>
  </section>
);

/* ---------- Features ---------- */
const featuresData = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Instant deposits & withdrawals' },
  { icon: Shield, title: 'Secure Platform', desc: 'Military-grade encryption' },
  { icon: Users, title: 'Active Community', desc: 'Thousands of players online' },
  { icon: Coins, title: 'Low Fees', desc: 'Minimal transaction costs' },
  { icon: Trophy, title: 'Big Wins', desc: 'Massive jackpots daily' },
  { icon: TrendingUp, title: 'High Multipliers', desc: 'Up to 1000× payouts' },
];

const FeaturesSection = () => (
  <section className="bg-gray-950 py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Why Choose 786Bet?</h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          The ultimate platform for crash-game enthusiasts with unmatched features.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {featuresData.map((f, idx) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group rounded-2xl bg-white/2.5 p-8 ring-1 ring-white/10 backdrop-blur-sm"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400"
            >
              <f.icon className="h-6 w-6" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white">{f.title}</h3>
            <p className="mt-3 text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- How it Works ---------- */
const HowItWorks = () => (
  <section className="bg-black py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">How It Works</h2>
        <p className="mt-6 text-lg text-gray-300">Get started in minutes with our simple 3-step process.</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 sm:mt-20 lg:max-w-none lg:grid-cols-3">
        {['Create Account', 'Make Deposit', 'Start Playing'].map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="group relative rounded-2xl bg-gray-900 p-8"
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-400 opacity-0 blur transition duration-300 group-hover:opacity-75"></div>
            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold text-2xl">
                {i + 1}
              </div>
              <h3 className="text-2xl font-semibold text-white">{t}</h3>
              <p className="mt-3 text-gray-400">
                {i === 0 && 'Sign up in seconds with just your email'}
                {i === 1 && 'Add funds via crypto or traditional methods'}
                {i === 2 && 'Place bets and watch your profits multiply'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Stats ---------- */
const Stats = () => (
  <section className="bg-gradient-to-b from-black to-gray-900/50 py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {[
          { value: '50K+', label: 'Active Players' },
          { value: '$2.5M+', label: 'Total Payouts' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Support' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-bold text-yellow-400 sm:text-5xl"
            >
              {stat.value}
            </motion.div>
            <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- CTA ---------- */
const CTA = () => (
  <section className="bg-black py-24 sm:py-32">
    <div className="mx-auto max-w-4xl px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-12"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to experience the thrill?
        </h2>
        <p className="mt-6 text-lg text-gray-300">
          Join thousands of players winning big every day.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button>Get Started Free</Button>
          </Link>
          <Link href="#demo">
            <Button variant="outline">See How It Works</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------- Footer ---------- */
const Footer = () => (
  <footer className="border-t border-white/10 bg-gray-950 py-12">
    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-400 lg:px-8">
      <p>&copy; {new Date().getFullYear()} 786Bet. All rights reserved.</p>
      <div className="mt-4 flex justify-center gap-6">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
  </footer>
);

/* ---------- HomePage (default export) ---------- */
export default function HomePage() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute('href')?.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        const offset = 80;
        window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="bg-black text-white antialiased">
      <Header />
      <main>
        <Route path="/">
          <Hero />
          <FeaturesSection />
          <HowItWorks />
          <Stats />
          <CTA />
        </Route>
        {/* other routes */}
        <Route path="/game-room">{/* Game-room placeholder */}</Route>
        <Route path="/leaderboard">{/* Leaderboard placeholder */}</Route>
        <Route path="/promotions">{/* Promotions placeholder */}</Route>
        <Route path="/dashboard">{/* Dashboard placeholder */}</Route>
        <Route path="/login">{/* Login placeholder */}</Route>
        <Route path="/register">{/* Register placeholder */}</Route>
      </main>
      <Footer />
    </div>
  );
}