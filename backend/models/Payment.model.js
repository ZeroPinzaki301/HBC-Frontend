import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
  gcashNumber: { type: String, required: true }, // GCash number for refund
  proofImage: { type: String, required: true }, // File path of the proof
  createdAt: { type: Date, default: Date.now }, // Date of submission
});

const PaymentProof = mongoose.model("PaymentProof", paymentProofSchema);
export default PaymentProof;