import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaShieldAlt, FaStar } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Features = () => {
  const features = [
    {
      icon: <FaUser />,
      title: "Personalized Advice",
      desc: "Tailored loan recommendations based on your profile.",
    },
    {
      icon: <FaClock />,
      title: "Quick Approval",
      desc: "Get responses in under 24 hours with our streamlined process.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Private",
      desc: "Your data is protected with bank-level encryption.",
    },
    {
      icon: <FaStar />,
      title: "Competitive Rates",
      desc: "Access the best interest rates from top lenders.",
    },
  ];

  return (
    <section id="features" className="pt-20 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Shadval Finance?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make borrowing simple, transparent, and rewarding.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-gradient-to-b from-indigo-50 to-purple-50 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="mx-auto mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-white text-4xl text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-110"
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
