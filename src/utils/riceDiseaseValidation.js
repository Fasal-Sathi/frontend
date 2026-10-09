export const MAX_RICE_LEAF_BYTES = 10 * 1024 * 1024;
const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_EXTENSION = /\.(jpe?g|png|webp)$/i;

export function validateRiceLeafFile(file) {
  if (!file) return "Choose a rice leaf image first.";
  if (!ACCEPTED_EXTENSION.test(file.name) || (file.type && !ACCEPTED_MIME.has(file.type.toLowerCase()))) {
    return "Unsupported format. Choose a JPG, JPEG, PNG, or WEBP image.";
  }
  if (file.size > MAX_RICE_LEAF_BYTES) return "This image is too large. Choose an image smaller than 10 MB.";
  if (file.size === 0) return "This image is empty. Choose another photo.";
  return "";
}
