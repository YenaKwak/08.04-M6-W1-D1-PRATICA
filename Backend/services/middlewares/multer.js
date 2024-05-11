import multer from "multer";
import { storage } from "../../root/cloudinaryConfig.js";

const parser = multer({ storage });

export default parser;
