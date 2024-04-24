const multer = require("multer");
const { storage } = require("../../root/cloudinaryConfig");

const parser = multer({ storage });

module.exports = parser;
