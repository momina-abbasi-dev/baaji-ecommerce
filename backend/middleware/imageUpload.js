import { randomUUID } from "node:crypto";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function createImageUpload({ files, fields, parts, allowedFields, parser }) {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files,
      fields,
      parts,
      fieldNameSize: 100,
      fieldSize: 256 * 1024,
      headerPairs: 100,
    },
  });
  const parse = parser(upload);
  const allowedTextFields = new Set(allowedFields);

  return (req, res, next) => {
    parse(req, res, (parseError) => {
      if (parseError) {
        if (parseError instanceof multer.MulterError) {
          if (parseError.code === "LIMIT_FILE_SIZE") {
            return res
              .status(413)
              .json({ message: "Each image must be 5 MB or smaller" });
          }

          if (parseError.code === "LIMIT_FIELD_VALUE") {
            return res
              .status(413)
              .json({ message: "A multipart field is too large" });
          }

          if (
            parseError.code === "LIMIT_FILE_COUNT" ||
            parseError.code === "LIMIT_UNEXPECTED_FILE"
          ) {
            return res
              .status(400)
              .json({ message: "Unexpected or too many uploaded files" });
          }

          return res
            .status(400)
            .json({ message: "Invalid or excessive multipart fields" });
        }

        console.error("Image upload parsing failed");
        return res.status(500).json({ message: "Image upload failed" });
      }

      const unexpectedField = Object.keys(req.body ?? {}).some(
        (field) => !allowedTextFields.has(field),
      );
      if (unexpectedField) {
        return res
          .status(400)
          .json({ message: "Unexpected multipart text field" });
      }

      const filesToValidate = req.file
        ? [req.file]
        : Object.values(req.files ?? {}).flat();

      Promise.all(
        filesToValidate.map(async (file) => {
          const detectedType = await fileTypeFromBuffer(file.buffer);
          if (!detectedType || !ALLOWED_IMAGE_MIMES.has(detectedType.mime)) {
            return false;
          }

          file.detectedExtension = detectedType.ext;
          return true;
        }),
      )
        .then((validFiles) => {
          if (validFiles.some((isValid) => !isValid)) {
            return res
              .status(415)
              .json({ message: "Only valid JPEG, PNG, or WebP images are allowed" });
          }

          return next();
        })
        .catch(() => {
          console.error("Image signature validation failed");
          return res
            .status(500)
            .json({ message: "Image upload validation failed" });
        });
    });
  };
}

export const categoryImageUpload = createImageUpload({
  files: 1,
  fields: 2,
  parts: 4,
  allowedFields: ["name", "isMenu"],
  parser: (upload) => upload.single("image"),
});

export const eventImageUpload = createImageUpload({
  files: 1,
  fields: 3,
  parts: 5,
  allowedFields: ["title", "date", "description"],
  parser: (upload) => upload.single("image"),
});

export const productImageUpload = createImageUpload({
  files: 11,
  fields: 9,
  parts: 21,
  allowedFields: [
    "title",
    "price",
    "shortDesc",
    "description",
    "category",
    "sizes",
    "sizeDesc",
    "shipping",
    "isTrend",
  ],
  parser: (upload) =>
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
});

export function createImageKitFilename(prefix, file) {
  return `${prefix}-${randomUUID()}.${file.detectedExtension}`;
}
