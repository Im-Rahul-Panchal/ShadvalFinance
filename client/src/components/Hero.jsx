import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaShieldAlt } from "react-icons/fa";

const Hero = () => (
  <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-500 relative overflow-hidden">
    <div className="absolute inset-0">
      <img 
        src="/bg.jpg" 
        alt="Banking and finance" 
        className="w-full h-full object-cover opacity-20"
      />
    </div>
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <motion.div  
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}   
        viewport={{ once: true }}           
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-10 leading-tight">
          Unlock Your Financial Future
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Get personalized loan options tailored to your needs. Fast, secure, and hassle-free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#form" 
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <FaRocket /> Start Application
          </a>
          <a 
            href="#features" 
            className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <FaShieldAlt /> Learn More
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;