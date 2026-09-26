import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

export const MarketingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-xl text-white shadow-md shadow-sky-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Medsync<span className="text-sky-400">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition">How it Works</a>
            <a href="#solutions" className="text-sm font-medium text-slate-300 hover:text-white transition">Solutions</a>
            <a href="#security" className="text-sm font-medium text-slate-300 hover:text-white transition">Security & AI</a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition">FAQ</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            How it Works
          </a>
          <a
            href="#solutions"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Solutions
          </a>
          <a
            href="#security"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Security & AI
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            FAQ
          </a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/login"
              className="text-center w-full py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-center w-full py-2.5 text-sm font-semibold text-white bg-sky-500 rounded-xl shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
