'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  // Initialize state from localStorage during SSR to prevent hydration mismatch
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navMenuOpen');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  const toggleMenu = (state: boolean) => {
    setIsOpen(state);
    localStorage.setItem('navMenuOpen', JSON.stringify(state));
  };

  return (
    <nav className="glass-effect fixed w-full z-50 top-0 left-0 border-b border-white/5">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold text-gradient">Aiden</span>
        </Link>

        <button
          onClick={() => toggleMenu(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#87fafd]/50"
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            id="navbar-menu"
            className="w-full md:block md:w-auto"
            initial={isInitialRender ? false : { opacity: 0, height: 0 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              height: isOpen ? 'auto' : 0,
              display: isOpen ? 'block' : 'none',
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
              <li>
                <Link
                  href="/dashboard"
                  className="block py-2 pl-3 pr-4 text-white/90 rounded hover:text-accent md:p-0 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="block py-2 pl-3 pr-4 text-white/90 rounded hover:text-accent md:p-0 transition-colors"
                >
                  My Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="block py-2 pl-3 pr-4 text-white/90 rounded hover:text-accent md:p-0 transition-colors"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <button className="button-primary">Connect Wallet</button>
              </li>
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
