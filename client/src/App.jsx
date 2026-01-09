import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import LoanEnquiryForm from "./components/LoanEnquiryForm";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import CibilScoreCheck from "./components/CibilScoreCheck";
import EMICalculator from "./components/EMICalculator";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  return (
    <div className="bg-gray-50 overflow-x-hidden">

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#111",
          },
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" data-aos="fade-up">
        <Hero />
      </section>

      {/* Loan Enquiry Form */}
      <section id="loan-form" data-aos="zoom-out">
        <LoanEnquiryForm />
      </section>

      {/* EMI Calculator */}
      <section id="emi-calculator" data-aos="fade-out">
        <EMICalculator />
      </section>

      {/* CIBIL Score Check */}
      <section id="cibil-check" data-aos="fade-in">
        <CibilScoreCheck />
      </section>

      {/* Features */}
      <section id="features" data-aos="slide-up">
        <Features />
      </section>

      {/* Testimonials */}
      <section id="testimonials" data-aos="flip-up">
        <Testimonials />
      </section>

      {/* Chatbot (NO animation – UX tool) */}
      <Chatbot />

      {/* Footer */}
      <section id="footer" data-aos="fade-in">
        <Footer />
      </section>
    </div>
  );
}
