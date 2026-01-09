import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCalculator, FaRupeeSign, FaPercent, FaClock } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* utils */
const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

/* EMI formulas */
const calcReducingEMI = (P, rate, months) => {
  const r = rate / 12 / 100;
  return Math.round(
    (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  );
};

const calcFlatEMI = (P, rate, months) => {
  const interest = (P * rate * (months / 12)) / 100;
  return Math.round((P + interest) / months);
};

const EMICalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(60);
  const [type, setType] = useState("reducing");

  const emi =
    type === "reducing"
      ? calcReducingEMI(amount, rate, tenure)
      : calcFlatEMI(amount, rate, tenure);

  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - amount;

  const chartData = [
    { name: "Principal", value: amount },
    { name: "Interest", value: totalInterest },
  ];

  const COLORS = ["#7C3AED", "#10B981"];

  return (
    <section
      id="emi-calculator"
      className="py-24 bg-gradient-to-br from-indigo-50 via-purple-200 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-4xl shadow-2xl border border-white/30 mx-auto overflow-hidden"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-5 text-center rounded-t-3xl">
            <h2 className="text-3xl md:text-3xl font-bold flex items-center justify-center gap-4">
              <FaCalculator className="text-3xl" />
              EMI Calculator
            </h2>
            <p className="mt-3 text-lg opacity-90">
              Calculate your monthly EMI instantly
            </p>
          </div>

          {/* BODY */}
          <div className="p-10">
            {/* EMI TYPE */}
            <div className="flex justify-center gap-4 mb-8">
              {["reducing", "flat"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                    type === t
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t === "reducing" ? "Reducing EMI" : "Flat EMI"}
                </button>
              ))}
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT INPUTS */}
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2 font-semibold mb-1">
                    <FaRupeeSign /> Loan Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border-2 border-indigo-200 focus:outline-none"
                  />
                  <input
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full mt-2 accent-indigo-600"
                  />
                  <div className="text-center mt-1">{currency(amount)}</div>
                </div>

                {/* Rate */}
                <div>
                  <label className="flex items-center gap-2 font-semibold mb-1">
                    <FaPercent /> Interest (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border-2 border-purple-200 focus:outline-none"
                  />
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full mt-2 accent-purple-600"
                  />
                </div>

                {/* Tenure */}
                <div>
                  <label className="flex items-center gap-2 font-semibold mb-1">
                    <FaClock /> Tenure (Months)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border-2 border-pink-200 focus:outline-none"
                  />
                  <input
                    type="range"
                    min="12"
                    max="360"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full mt-2 accent-pink-600"
                  />
                </div>
              </div>

              {/* RIGHT SUMMARY + CHART */}
              <div className="space-y-1">
                <div className="p-6 rounded-2xl border border-gray-300 bg-white">
                  <div className="flex justify-between mb-2">
                    <span>Monthly EMI</span>
                    <b>{currency(emi)}</b>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Payment</span>
                    <b>{currency(totalAmount)}</b>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Total Interest</span>
                    <b>{currency(totalInterest)}</b>
                  </div>
                </div>

                {/* DONUT */}
                <div className="w-full h-64">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                    minWidth={0}
                    minHeight={0}
                  >
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                      >
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex justify-center gap-6 text-sm mt-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-purple-600 rounded"></span>
                      Principal
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                      Interest
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              * Indicative calculation only
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EMICalculator;
