import React from "react";
import { FaUniversity, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-10 pb-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10">
              <img src="/logo-icon-circle.png" alt="" />
            </div>
            <span className="text-xl font-bold">Shadval Finance</span>
          </div>
          <p className="text-gray-400">
            Empowering your financial dreams with ease.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#home" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
            </li>
            <li>
              <a href="#form" className="hover:text-white transition">
                Apply
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <FaPhone />
              <a
                href="tel:+919615001010"
                className="hover:text-white transition"
              >
                +91 9615001010
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope />
              <a
                href="mailto:support.finance@shadvalpay.co.in"
                className="hover:text-white transition break-words w-full max-w-xs leading-relaxed"
              >
                support.finance@shadvalpay.co.in
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} ShadvalFinance. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
