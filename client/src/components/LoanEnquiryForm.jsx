import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../config";
import EnquirySummaryModal from "../components/EnquirySummaryModal";
import {
  FaHome,
  FaUser,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaUniversity,
  FaCar,
  FaGraduationCap,
  FaCreditCard,
  FaComments,
  FaArrowLeft,
  FaArrowRight,
  FaSyncAlt,
  FaRocket,
  FaEdit,
  FaCheckCircle,
  FaSave,
  FaTimes,
  FaCalendar,
  FaFileAlt,
} from "react-icons/fa";

const STEPS = ["Basic Info", "Loan Details", "Required Documents"];
const LOAN_TYPES = [
  { id: "personal", label: "Personal", icon: <FaCreditCard /> },
  { id: "home", label: "Home", icon: <FaHome /> },
  { id: "car", label: "New Car/Used Car", icon: <FaCar /> },
  { id: "education", label: "Education", icon: <FaGraduationCap /> },
];

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  employment: "",
  loanType: LOAN_TYPES[0].id,
  amount: 500000,
  tenureMonths: 60,
  enquiryType: "",
};

const container = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const Field = ({ label, children, error }) => (
  <div>
    <label className="font-semibold text-gray-700 flex items-center justify-between">
      <span>{label}</span>
      {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
    </label>
    <div className="mt-2">{children}</div>
  </div>
);

const LoanEnquiryForm = () => {
  const [step, setStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const mounted = useRef(false);

  useEffect(() => {
    const draft = localStorage.getItem("loan_enquiry_draft");
    if (draft) {
      try {
        setForm((f) => ({ ...f, ...JSON.parse(draft) }));
      } catch {}
    }
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    const id = setTimeout(() => {
      localStorage.setItem("loan_enquiry_draft", JSON.stringify(form));
    }, 800);
    return () => clearTimeout(id);
  }, [form]);

  const next = () => {
    const valid = validateStep(step);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && value < "6") return;
    if (value.length <= 10) {
      setForm((f) => ({
        ...f,
        phone: value,
      }));
    }
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!/^[6-9]\d{9}$/.test(form.phone)) {
        e.phone = "Mobile number must start with 6 and be 10 digits";
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.employment) e.employment = "Select employment status";
    }
    if (s === 1) {
      if (!form.loanType) e.loanType = "Choose a loan type";
      if (form.amount < 100000) e.amount = "Minimum amount is ₹1,00,000";
      if (form.tenureMonths < 6) e.tenureMonths = "Minimum tenure is 6 months";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    const allValid = validateStep(0) && validateStep(1);
    if (!allValid) {
      setStep(0);
      return;
    }
    setSaving(true);

    try {
      const loanMeta =
        LOAN_TYPES.find((l) => l.id === form.loanType) || LOAN_TYPES[0];

      const payload = {
        Name: form.name,
        MobileNumber: form.phone,
        Email: form.email,
        EmployeeStatus: form.employment,
        LoanType: loanMeta.label,
        LoanAmount: form.amount,
        TenureTime: `${form.tenureMonths} Months`,
        EnquireType: form.enquiryType || "General",
        CreatedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/api/leadGeneration`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.resCode === "100") {
        toast.success(response.data.msg, {
          duration: 4000,
          position: "top-right",
          icon: <FaCheckCircle className="text-green-500" />,
        });

        setSubmitted(true);
        setShowSummary(false);
        setForm(INITIAL_FORM);
        setStep(0);
        localStorage.removeItem("loan_enquiry_draft");
      } else {
        toast.error(
          response.data.msg || "Submission failed. Please try again.",
          {
            duration: 2000,
            position: "top-right",
            icon: <FaTimes className="text-red-500" />,
          }
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Server error. Please try later.");
    } finally {
      setSaving(false);
    }
  };

  const loanMeta = LOAN_TYPES.find((l) => l.id === form.loanType) || LOAN_TYPES[0];
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

  return (
    <>
      <section id="form" className="pt-20 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-4xl shadow-2xl p-6 md:p-10 border border-white/30 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  <FaUniversity className="text-3xl text-indigo-600" />
                  <span>Loan Enquiry</span>
                </h1>
                <p className="text-sm text-gray-600 mt-3">
                  Fast • Secure • Hassle-Free • Professional assistance
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 md:gap-4">
                {/* Progress text */}
                <div className="text-xs md:text-sm text-indigo-700 font-medium truncate max-w-[180px] md:max-w-none">
                  <span className="text-gray-500 md:hidden">Progress: </span>
                  {STEPS[step]}
                </div>

                {/* Preview button (desktop only) */}
                <button
                  onClick={() => setShowSummary(true)}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:scale-105 transition cursor-pointer"
                  aria-label="Preview summary"
                >
                  <FaEdit />
                  Preview
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between text-md text-gray-500 mb-3">
                {STEPS.map((label, i) => (
                  <span
                    key={label}
                    className={i <= step ? "text-indigo-600 font-semibold" : ""}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step1"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={
                          <span className="flex items-center gap-2">
                            <FaUser className="shrink-0" />
                            <span>Full Name</span>
                          </span>
                        }
                        error={errors.name}
                      >
                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Enter your full name"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all duration-300"
                          aria-label="Full name"
                        />
                      </Field>

                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaPhone className="shrink-0" />
                            <span>Mobile Number</span>
                          </span>
                        }
                        error={errors.phone}
                      >
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={handlePhoneChange}
                          placeholder="10-digit number (starts with 6-9)"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all duration-300"
                          inputMode="numeric"
                          aria-label="Mobile number"
                        />
                      </Field>

                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaEnvelope className="shrink-0" />
                            <span>Email Address</span>
                          </span>
                        }
                        error={errors.email}
                      >
                        <input
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="you@email.com"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all duration-300"
                          aria-label="Email address"
                        />
                      </Field>

                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaBriefcase className="shrink-0" />
                            <span>Employment Status</span>
                          </span>
                        }
                        error={errors.employment}
                      >
                        <select
                          value={form.employment}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              employment: e.target.value,
                            }))
                          }
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none cursor-pointer transition-all duration-300"
                          aria-label="Employment status"
                        >
                          <option value="">Select</option>
                          <option>Salaried</option>
                          <option>Self-Employed</option>
                          <option>Business Owner</option>
                          <option>Freelancer</option>
                        </select>
                      </Field>

                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendar className="shrink-0" />
                            <span>Enquiry Date</span>
                          </span>
                        }
                      >
                        <input
                          type="text"
                          value={formattedDate}
                          readOnly
                          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none transition-all duration-300"
                          aria-label="Enquiry date"
                        />
                      </Field>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step2"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="font-semibold text-gray-700 flex items-center gap-2">
                        <FaUniversity /> Loan Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1 place-items-center">
                        {LOAN_TYPES.map((t) => {
                          const active = t.id === form.loanType;

                          return (
                            <button
                              key={t.id}
                              onClick={() =>
                                setForm((f) => ({ ...f, loanType: t.id }))
                              }
                              className={`px-3 py-3 rounded-xl border transition-all duration-300 flex flex-col justify-center items-center gap-1
                              cursor-pointer hover:shadow-md w-full ${
                                active
                                  ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                                  : "bg-white"
                              }`}
                              aria-pressed={active}
                            >
                              <div className="text-lg leading-none">
                                {t.icon}
                              </div>
                              <div className="text-sm font-semibold text-center leading-tight">
                                {t.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {errors.loanType && (
                        <div className="text-sm text-red-500 mt-2">
                          {errors.loanType}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaCreditCard className="shrink-0" />
                            <span>Loan Amount</span>
                          </span>
                        }
                        error={errors.amount}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="font-medium">
                              {currency(form.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Min ₹1,00,000
                            </div>
                          </div>
                          <input
                            type="range"
                            min="100000"
                            max="10000000"
                            step="1000"
                            value={form.amount}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                amount: Number(e.target.value),
                              }))
                            }
                            className="w-full accent-indigo-500 cursor-pointer"
                            aria-label="Loan amount"
                          />
                        </div>
                      </Field>

                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaClock className="shrink-0" />
                            <span>Tenure (months)</span>
                          </span>
                        }
                        error={errors.tenureMonths}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="font-medium">
                              {form.tenureMonths} months
                            </div>
                            <div className="text-xs text-gray-500">
                              Shorter tenure = lower interest cost
                            </div>
                          </div>
                          <input
                            type="range"
                            min="6"
                            max="180"
                            step="1"
                            value={form.tenureMonths}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                tenureMonths: Number(e.target.value),
                              }))
                            }
                            className="w-full accent-purple-500 cursor-pointer"
                            aria-label="Tenure months"
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FaComments className="shrink-0" />
                            <span>Enquiry Type</span>
                          </span>
                        }
                      >
                        <select
                          value={form.enquiryType}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              enquiryType: e.target.value,
                            }))
                          }
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all duration-300 cursor-pointer"
                          aria-label="Enquiry type"
                        >
                          <option value="">Select</option>
                          <option>General Information</option>
                          <option>Eligibility Check</option>
                          <option>Interest Rates</option>
                          <option>Documentation</option>
                        </select>
                      </Field>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step3"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.45 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                        <FaFileAlt className="text-2xl text-indigo-600" />
                        Required Documents
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Below are the standard documents required for loan
                        processing. The exact list may vary based on your
                        employment status and loan type.
                      </p>

                      {/* Salaried */}
                      {form.employment === "Salaried" && (
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                            For Salaried Individuals
                          </h4>
                          <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                KYC Documents: Aadhaar Card, PAN Card,
                                Passport/Voter ID/Driving License (any one)
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>Latest 3 months Salary Slips</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                Form 16 or Latest Income Tax Return (ITR)
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                6 months Bank Statement (salary crediting
                                account)
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                Employment Proof: Appointment letter or Employee
                                ID card
                              </span>
                            </li>
                            {form.loanType === "home" && (
                              <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                <span>
                                  Property Documents: Sale Agreement, Title
                                  Deed, Encumbrance Certificate
                                </span>
                              </li>
                            )}
                            {form.loanType === "car" && (
                              <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                <span>
                                  Proforma Invoice / Quotation from Car Dealer
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Self-Employed / Business Owner / Freelancer */}
                      {(form.employment === "Self-Employed" ||
                        form.employment === "Business Owner" ||
                        form.employment === "Freelancer") && (
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                            For Self-Employed / Business Owners / Freelancers
                          </h4>
                          <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                KYC Documents: Aadhaar Card, PAN Card,
                                Passport/Voter ID (any one)
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                Last 2 years Income Tax Returns (ITR) with
                                Computation of Income
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                Last 2 years CA Audited Financials (Balance
                                Sheet & Profit Loss Statement)
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>12 months Business Bank Statement</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>
                                Proof of Business Existence (GST Certificate,
                                Shop Act License, Udyam Registration, etc.)
                              </span>
                            </li>
                            {form.loanType === "home" && (
                              <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                <span>
                                  Property Documents: Agreement to Sale, Title
                                  Deed, Approved Plan, etc.
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* General note */}
                      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                        <strong>Note:</strong> Additional documents may be
                        required depending on the loan type and profile. Our
                        loan expert will guide you through the exact
                        requirements after your enquiry.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10">
              <div className="w-full sm:w-auto">
                {step > 0 ? (
                  <button
                    onClick={prev}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl
                   border border-gray-200 bg-white/80 backdrop-blur
                   text-gray-700 font-medium
                   hover:bg-gray-100 hover:shadow-md
                   hover:-translate-y-[1px]
                   active:scale-95
                   focus:outline-none focus:ring-2 focus:ring-gray-300
                   transition-all duration-300 cursor-pointer flex items-center gap-2 justify-center"
                  >
                    <FaArrowLeft />
                    <span className="hidden xs:inline sm:inline">Back</span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>

              <div className="flex-1 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setStep(0);
                    setForm(INITIAL_FORM);
                    setErrors({});
                    setSubmitted(false);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                 bg-white/80 backdrop-blur border border-gray-200
                 text-gray-700 font-medium
                 hover:bg-gray-100 hover:shadow-md
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-gray-300
                 transition-all duration-300 cursor-pointer"
                >
                  <FaSyncAlt />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>

              <div className="w-full flex justify-center sm:justify-end gap-3">
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                    text-white font-semibold
                    shadow-lg shadow-indigo-500/30
                    hover:shadow-xl hover:shadow-purple-500/40
                    hover:-translate-y-[1px] hover:scale-[1.02]
                    active:scale-[0.97]
                    focus:outline-none focus:ring-2 focus:ring-purple-400
                    transition-all duration-300 cursor-pointer
                    flex items-center justify-center gap-2"
                  >
                    Next
                    <FaArrowRight className="hidden sm:inline" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSummary(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                    text-white font-semibold
                    shadow-lg shadow-purple-500/30
                    hover:shadow-xl hover:shadow-pink-500/40
                    hover:-translate-y-[2px] hover:scale-[1.03]
                    active:scale-[0.97]
                    focus:outline-none focus:ring-2 focus:ring-pink-400
                    transition-all duration-300 cursor-pointer
                    flex items-center justify-center gap-2"
                  >
                    <FaRocket /> Review & Submit
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-center text-green-700 font-semibold flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Thank you! Our loan expert will contact you
                  shortly.
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {saving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2"
                >
                  <FaSave className="animate-spin" /> Saving...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <EnquirySummaryModal
            open={showSummary}
            onClose={() => setShowSummary(false)}
            form={form}
            formattedDate={formattedDate}
            loanMeta={loanMeta}
            currency={currency}
            handleSubmit={handleSubmit}
            submitted={submitted}
          />

        </div>
      </section>
    </>
  );
};

export default LoanEnquiryForm;
