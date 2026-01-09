import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComments,
  FaTimes,
  FaEdit,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";

const SummaryRow = ({ label, value }) => (
  <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="mt-1 font-medium text-gray-800">{value}</div>
  </div>
);

const EnquirySummaryModal = ({
  open,
  onClose,
  form,
  formattedDate,
  loanMeta,
  currency,
  handleSubmit,
  submitted,
}) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4
        bg-black/40 backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
        onClick={onClose}
      >
        {/* OUTER MODAL (rounded, no scroll) */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border overflow-hidden"
        >
          {/* INNER SCROLL AREA */}
          <div className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaComments /> Enquiry Summary
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Review details before submitting
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-full text-sm font-medium
                text-gray-500 cursor-pointer
                hover:text-gray-800 hover:bg-gray-100
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-gray-300
                transition-all duration-200 flex items-center gap-1"
                aria-label="Close summary"
              >
                <FaTimes /> Close
              </button>
            </div>

            {/* SUMMARY GRID */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SummaryRow label="Name" value={form.name || "—"} />
              <SummaryRow label="Phone" value={form.phone || "—"} />
              <SummaryRow label="Email" value={form.email || "—"} />
              <SummaryRow
                label="Employment"
                value={form.employment || "—"}
              />
              <SummaryRow label="Enquiry Date" value={formattedDate} />
              <SummaryRow label="Loan Type" value={loanMeta.label} />
              <SummaryRow
                label="Amount"
                value={currency(form.amount)}
              />
              <SummaryRow
                label="Tenure"
                value={`${form.tenureMonths} months`}
              />
            </div>

            {/* FOOTER BUTTONS */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full
                bg-white border border-gray-200
                text-gray-700 font-medium cursor-pointer
                hover:bg-gray-100 hover:shadow-md
                hover:-translate-y-[1px]
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-gray-300
                transition-all duration-300 flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={handleSubmit}
                className="group px-6 py-2.5 rounded-full
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                text-white font-semibold cursor-pointer
                shadow-lg shadow-purple-500/30
                hover:shadow-xl hover:shadow-pink-500/40
                hover:-translate-y-[2px] hover:scale-[1.03]
                active:scale-[0.97]
                focus:outline-none focus:ring-2 focus:ring-purple-400
                transition-all duration-300 flex items-center gap-2"
              >
                {submitted ? <FaCheckCircle /> : <FaRocket />}
                {submitted ? "Submitted" : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById("modal-root")
  );
};

export default EnquirySummaryModal;
