import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the folders exist
const uploadsPath = path.join(__dirname, "../uploads");
const profilePicturesPath = path.join(uploadsPath, "profile-pictures");

if (!fs.existsSync(profilePicturesPath)) {
  fs.mkdirSync(profilePicturesPath, { recursive: true });
}

// Multer storage for profile pictures
export const profileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, profilePicturesPath); // Save profile pictures to "uploads/profile-pictures"
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    }
  },
});

// Multer storage for product images (remain in "uploads")
export const productUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsPath); // Save product images directly in "uploads"
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    }
  },
});