import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Sender's name
    email: { type: String, required: true }, // Sender's email
    subject: { type: String, required: true }, // Subject of the message
    message: { type: String, required: true }, // Message content
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Message = mongoose.model("Message", messageSchema);
export default Message;