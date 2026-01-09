import React from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const TermsModal = ({ open, onClose, onAccept }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Terms & Conditions
            </h2>

            <p className="text-gray-700 mb-4">
              These Terms & Conditions govern your access and use of the
              Shadval Finance Private Limited website (www.shadvalpay.co.in)
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Eligibility:</strong> You must be at least 18 years
                    old and provide accurate personal information to use Shadval
                    Finance services.
                  </li>
                  <li>
                    <strong>Account Information:</strong> You are responsible
                    for keeping your account credentials safe. Any activity on
                    your account is your responsibility.
                  </li>
                  <li>
                    <strong>Use of Services:</strong> You agree to use our
                    services only for lawful purposes and not for fraudulent or
                    illegal activities.
                  </li>
                  <li>
                    <strong>Consent to Data:</strong> By providing your personal
                    information, including PAN and mobile number, you consent to
                    Shadval Finance accessing credit information from authorized
                    credit bureaus.
                  </li>
                  <li>
                    <strong>Third-Party Services:</strong> Our services may
                    integrate with third-party platforms. Shadval Finance is not
                    responsible for third-party content or services.
                  </li>
                  <li>
                    <strong>Modification of Terms:</strong> Shadval Finance may
                    update or modify these Terms & Conditions at any time
                    without prior notice. Continued use of services indicates
                    acceptance.
                  </li>
                  <li>
                    <strong>Limitation of Liability:</strong> Shadval Finance is
                    not liable for indirect, incidental, or consequential losses
                    arising from use of our services.
                  </li>
                  <li>
                    <strong>Termination:</strong> Shadval Finance may suspend or
                    terminate your access for violation of these terms. You may
                    also terminate your use at any time.
                  </li>
                  <li>
                    <strong>Governing Law:</strong> These terms are governed by
                    the laws of India.
                  </li>
                </ul>

            <button
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg
              font-semibold hover:bg-indigo-700 transition cursor-pointer"
              onClick={onAccept}
            >
              Close & Accept
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById("modal-root")
  );
};

export default TermsModal;
