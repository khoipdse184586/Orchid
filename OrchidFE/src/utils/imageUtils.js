/**
 * Utility functions for handling image URLs from MinIO storage
 */

/**
 * Always return the public MinIO URL (http://localhost:9000/orchid-bucket/...) regardless of input format
 * @param {string} imageUrl - Original MinIO or presigned URL
 * @returns {string} - Public URL accessible from browser
 */
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  // If already correct public URL
  if (imageUrl.startsWith("http://localhost:9000/")) return imageUrl;

  // Extract path from minio:9000 or any host
  let path = "";
  try {
    // Try to parse as URL
    const urlObj = new URL(imageUrl, "http://localhost:9000");
    path = urlObj.pathname;
  } catch {
    // Fallback: try to extract after host manually
    const match = imageUrl.match(/minio:9000(\/.*)/);
    if (match) path = match[1];
  }
  if (!path.startsWith("/")) path = "/" + path;
  // Only allow /orchid-bucket/ path for safety
  if (!path.startsWith("/orchid-bucket/")) return "";
  return `http://localhost:9000${path}`;
};

export const getImageUrl = fixImageUrl;

/**
 * Get placeholder image URL for different sizes (not used, kept for reference)
 */
export const getPlaceholderUrl = (width = 400, height = 400) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#999" text-anchor="middle" dy=".3em">Orchid Image</text>
    </svg>
  `)}`;
};
