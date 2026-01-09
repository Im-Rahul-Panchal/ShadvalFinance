import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsModal from "./TermsModal";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaArrowRight,
  FaSyncAlt,
} from "react-icons/fa";

const CibilScoreCheck = ({ onScoreFetched }) => {
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && value < "6") return;
    if (value.length <= 10) setPhone(value);
  };

  const isValidPan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  /* ---------------- Mock APIs ---------------- */

  const verifyMockPan = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        isValidPan(pan)
          ? resolve(true)
          : reject("PAN number not found or invalid");
      }, 1200);
    });

  const fetchMockScore = () => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * (900 - 650 + 1)) + 650;
      const status =
        score >= 750
          ? "Excellent"
          : score >= 700
          ? "Good"
          : score >= 650
          ? "Fair"
          : "Needs Improvement";

      const color =
        score >= 750
          ? "emerald"
          : score >= 700
          ? "blue"
          : score >= 650
          ? "yellow"
          : "red";

      setScoreData({ score, status, color });
      setLoading(false);

      if (onScoreFetched) onScoreFetched(score);
    }, 1500);
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (!pan) {
      setError("Please enter PAN number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyMockPan();
      fetchMockScore();
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  const getScoreColor = (color) => {
    switch (color) {
      case "emerald":
        return "from-emerald-500 to-green-600";
      case "blue":
        return "from-blue-500 to-indigo-600";
      case "yellow":
        return "from-yellow-500 to-amber-600";
      case "red":
        return "from-red-500 to-pink-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <section
      id="cibil"
      className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-4xl shadow-2xl border border-white/30 mx-auto overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 text-center rounded-t-3xl">
            <h2 className="text-3xl font-bold flex justify-center items-center gap-3">
              <FaShieldAlt /> Check Your CIBIL Score
            </h2>
            <p className="mt-2 opacity-90">
              Know your creditworthiness in seconds - Free & Secure
            </p>
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {!scoreData ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                  {/* LEFT SIDE */}
                  <div className="space-y-6">
                    <div>
                      <label className="font-semibold text-gray-800 flex items-center gap-2">
                        <FaStar className="text-yellow-500" /> Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        maxLength="10"
                        disabled
                        className="mt-3 w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-800 flex items-center gap-2">
                        <FaStar className="text-yellow-500" /> PAN Number
                      </label>
                      <input
                        type="text"
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        disabled
                        className="mt-3 w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                      />
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        disabled
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label
                        htmlFor="consent"
                        className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                      >
                        I hereby give my consent to fetch my credit information
                        from credit bureaus using my PAN and mobile number. I
                        agree to the{" "}
                        <span
                          className="text-indigo-600 font-medium underline cursor-pointer"
                          onClick={() => setShowTerms(true)}
                        >
                          Terms & Conditions
                        </span>
                        .
                      </label>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <FaExclamationTriangle /> {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !consent}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold flex items-center justify-center gap-3 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSyncAlt className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Check CIBIL Score <FaArrowRight />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                      <FaShieldAlt className="inline mr-1" />
                      Your data is safe and encrypted. No spam.
                    </p>
                  </div>

                  {/* RIGHT SIDE (PLACEHOLDER) */}
                  <div className="hidden md:flex items-center justify-center h-full text-center text-gray-500">
                    <p className="text-lg">
                      <span>
                        ⏳ Coming Soon😉: CIBIL score check will be available
                        shortly <br />
                        <br />
                      </span>
                      Your CIBIL meter will appear here
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                >
                  {/* LEFT SIDE */}
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-800">
                      Credit Score Result
                    </h3>

                    <div
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold bg-gradient-to-r ${getScoreColor(
                        scoreData.color
                      )}`}
                    >
                      <FaCheckCircle /> {scoreData.status}
                    </div>

                    <p className="text-gray-600 text-lg">
                      Based on your PAN and mobile verification, here is your
                      current CIBIL score.
                    </p>

                    <button
                      onClick={() => {
                        setScoreData(null);
                        setPhone("");
                        setPan("");
                      }}
                      className="px-8 py-3 rounded-xl border border-gray-300 font-semibold flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer"
                    >
                      Check Again
                    </button>
                  </div>

                  {/* RIGHT SIDE – METER */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-80 h-40">
                      {/* Arc */}
                      <div className="absolute inset-0 rounded-t-full border-[18px] border-gray-200 border-b-0" />
                      <div className="absolute inset-0 rounded-t-full border-[18px] border-transparent border-b-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 mask-speedometer" />

                      {/* NEEDLE */}
                      <motion.div
                        className="absolute left-1/2"
                        style={{
                          bottom: "18px",
                          transformOrigin: "50% 100%",
                        }}
                        initial={{ rotate: -90 }}
                        animate={{
                          rotate: ((scoreData.score - 300) / 600) * 180 - 90,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      >
                        <div className="w-1 h-32 bg-gray-800 -translate-x-1/2" />
                      </motion.div>

                      {/* CENTER DOT */}
                      <div className="absolute left-1/2 bottom-[18px] w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="mt-6 text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                      {scoreData.score}
                    </div>
                    <p className="text-gray-600">CIBIL Score</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setConsent(true);
          setShowTerms(false);
        }}
      />
    </section>
  );
};

export default CibilScoreCheck;
