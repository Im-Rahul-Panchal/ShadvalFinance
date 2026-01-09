import React, { useState, useRef, useEffect } from "react";
import { FaUniversity, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#form", label: "Apply Now" },
  { href: "#emi-calculator", label: "EMI Calculator" },
  { href: "#cibil", label: "Check Cibil" },
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="backdrop-blur-md bg-white/60 border-b border-white/30 shadow-lg">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand */}
              <a
                href="#home"
                className="flex items-center gap-3 group"
                aria-label="Shadval home"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{
                    // background:
                    //   "linear-gradient(135deg,#6366f1 0%,#8b5cf6 40%,#ec4899 100%)",
                    boxShadow: "0 6px 18px rgba(99,102,241,0.18)",
                    transform: "skewX(-2deg)",
                  }}
                >
                  <img src="/logo-icon.png" alt="" />
                </span>
                

                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                    SHADVAL FINANCE
                  </span>
                  <span className="text-s text-gray-500 -mt-0.5">
                    Fast • Secure • Trusted
                  </span>
                </div>
              </a>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-8">
                <div className="flex items-center gap-6">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="relative text-gray-700 hover:text-indigo-600 transition-colors duration-250 font-medium px-1"
                    >
                      <span className="relative z-10">{l.label}</span>
                      <span
                        aria-hidden
                        className="absolute left-0 right-0 -bottom-2 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </a>
                  ))}
                </div>

                <a
                  href="#form"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:scale-105 transform transition"
                >
                  Apply Now
                </a>
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setOpen((s) => !s)}
                  aria-expanded={open}
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition colors duration-200 cursor-pointer"
                >
                  {open ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden"
            >
              <div className="px-4 pt-4 pb-6 bg-white/95 border-b border-white/30 shadow-sm">
                <div className="flex flex-col gap-3">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 rounded-lg text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                      {l.label}
                    </a>
                  ))}

                  <a
                    href="#form"
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center justify-center w-full px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow"
                  >
                    Apply Now
                  </a>

                  <div className="mt-3 text-sm text-gray-500 px-1">
                    <div>Need help? Call us at <a href="tel:+91 9615001010" className="text-indigo-600 font-medium">+91 9615001010</a></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer so page content doesn't hide under fixed navbar */}
      <div className="h-16" />

      {/* Small inline styles for subtle animated underline on hover (optional) */}
      <style>{`
        /* Smooth underline reveal for desktop links */
        @media (min-width: 768px) {
          a[aria-label="Shadval home"] .w-11 { transition: transform .28s ease; }
          a[aria-label="Shadval home"]:hover .w-11 { transform: translateY(-2px) skewX(-6deg); }
        }
      `}</style>
    </>
  );
}