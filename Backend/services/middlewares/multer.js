import multer from "multer";
import { storage } from "../../root/cloudinaryConfig";

const parser = multer({ storage });

export default parser;
