import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const EXTERNAL_API_URL =
  `${BASE_URL}/api/leadGeneration/customerLeads`;

export const generateLead = async (req, res) => {
  try {
    const payload = {
      Name: req.body.Name,
      MobileNumber: req.body.MobileNumber,
      Email: req.body.Email,
      EmployeeStatus: req.body.EmployeeStatus,
      LoanType: req.body.LoanType,
      LoanAmount: req.body.LoanAmount,
      TenureTime: req.body.TenureTime,
      EnquireType: req.body.EnquireType,
      Message: req.body.Message,
      CreatedAt: new Date().toISOString()
    };

    const response = await axios.post(EXTERNAL_API_URL, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    return res.status(500).json({
      resCode: "500",
      msg: "Failed to submit enquiry",
      error: error.response?.data || error.message
    });
  }
};
