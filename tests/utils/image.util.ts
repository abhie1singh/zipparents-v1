/**
 * Image Upload Utility Functions
 *
 * Provides image upload helpers and test image generation for tests
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Test image paths
 */
export const TEST_IMAGE_PATHS = {
  validJpg: path.join(process.cwd(), 'tests/fixtures/images/test-image.jpg'),
  validPng: path.join(process.cwd(), 'tests/fixtures/images/test-image.png'),
  validWebp: path.join(process.cwd(), 'tests/fixtures/images/test-image.webp'),
  tooLarge: path.join(process.cwd(), 'tests/fixtures/images/large-image.jpg'),
  invalidFormat: path.join(process.cwd(), 'tests/fixtures/images/invalid.txt'),
  profilePic: path.join(process.cwd(), 'tests/fixtures/images/profile-pic.jpg'),
  eventPhoto: path.join(process.cwd(), 'tests/fixtures/images/event-photo.jpg'),
};

/**
 * Valid image MIME types
 */
export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Invalid file types for negative testing
 */
export const INVALID_FILE_TYPES = [
  'text/plain',
  'application/pdf',
  'video/mp4',
  'audio/mp3',
  'application/zip',
];

/**
 * Image size limits (in bytes)
 */
export const IMAGE_SIZE_LIMITS = {
  min: 1024, // 1 KB
  max: 5 * 1024 * 1024, // 5 MB
  profilePicMax: 2 * 1024 * 1024, // 2 MB
};

/**
 * Create test image buffer (1x1 pixel PNG)
 */
export function createTestImageBuffer(): Buffer {
  // 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
}

/**
 * Create test JPEG buffer
 */
export function createTestJpegBuffer(): Buffer {
  // Minimal JPEG header
  return Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
}

/**
 * Generate test image file
 */
export function generateTestImageFile(
  filename: string = 'test-image.png',
  sizeKB?: number
): string {
  const testDir = path.join(process.cwd(), 'tests/fixtures/images');

  // Ensure directory exists
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const filePath = path.join(testDir, filename);

  if (sizeKB) {
    // Create file of specific size
    const buffer = Buffer.alloc(sizeKB * 1024);
    fs.writeFileSync(filePath, buffer);
  } else {
    // Create minimal valid PNG
    const buffer = createTestImageBuffer();
    fs.writeFileSync(filePath, buffer);
  }

  return filePath;
}

/**
 * Generate large test image (for testing size limits)
 */
export function generateLargeTestImage(filename: string = 'large-image.jpg'): string {
  return generateTestImageFile(filename, 6 * 1024); // 6 MB
}

/**
 * Generate small test image
 */
export function generateSmallTestImage(filename: string = 'small-image.png'): string {
  return generateTestImageFile(filename, 10); // 10 KB
}

/**
 * Create invalid file (not an image)
 */
export function generateInvalidFile(filename: string = 'invalid.txt'): string {
  const testDir = path.join(process.cwd(), 'tests/fixtures/images');

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const filePath = path.join(testDir, filename);
  fs.writeFileSync(filePath, 'This is not an image file');

  return filePath;
}

/**
 * Validate image file type
 */
export function isValidImageType(mimeType: string): boolean {
  return VALID_IMAGE_TYPES.includes(mimeType);
}

/**
 * Validate image file size
 */
export function isValidImageSize(sizeBytes: number, type: 'general' | 'profile' = 'general'): boolean {
  const max = type === 'profile' ? IMAGE_SIZE_LIMITS.profilePicMax : IMAGE_SIZE_LIMITS.max;
  return sizeBytes >= IMAGE_SIZE_LIMITS.min && sizeBytes <= max;
}

/**
 * Get file size in bytes
 */
export function getFileSize(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size;
}

/**
 * Get file MIME type from extension
 */
export function getMimeTypeFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Clean up test images
 */
export function cleanupTestImages(): void {
  const testDir = path.join(process.cwd(), 'tests/fixtures/images');

  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(testDir, file));
    });
  }
}

/**
 * Image test fixtures
 */
export const IMAGE_FIXTURES = {
  validJpg: () => generateTestImageFile('valid.jpg'),
  validPng: () => generateTestImageFile('valid.png'),
  validWebp: () => generateTestImageFile('valid.webp'),
  tooLarge: () => generateLargeTestImage('too-large.jpg'),
  tooSmall: () => generateTestImageFile('too-small.jpg', 0.5), // 0.5 KB
  invalidType: () => generateInvalidFile('invalid.txt'),
  profilePic: () => generateTestImageFile('profile-pic.jpg', 500), // 500 KB
  eventPhoto: () => generateTestImageFile('event-photo.jpg', 1000), // 1 MB
};

/**
 * Generate multiple test images
 */
export function generateMultipleTestImages(count: number): string[] {
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(generateTestImageFile(`test-image-${i}.png`));
  }
  return images;
}

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Get image dimensions (mock - returns random dimensions)
 */
export function getImageDimensions(filePath: string): { width: number; height: number } {
  // In real implementation, would use image processing library
  // For testing, return mock dimensions
  return {
    width: 800 + Math.floor(Math.random() * 400),
    height: 600 + Math.floor(Math.random() * 400),
  };
}

/**
 * Validate image dimensions
 */
export function isValidImageDimensions(
  width: number,
  height: number,
  constraints?: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number }
): boolean {
  if (!constraints) return true;

  const { minWidth = 0, maxWidth = Infinity, minHeight = 0, maxHeight = Infinity } = constraints;

  return (
    width >= minWidth &&
    width <= maxWidth &&
    height >= minHeight &&
    height <= maxHeight
  );
}

/**
 * Image upload test scenarios
 */
export const IMAGE_UPLOAD_SCENARIOS = {
  validProfilePic: {
    file: () => generateTestImageFile('profile.jpg', 500),
    description: 'Valid profile picture upload',
    expectedResult: 'success',
  },
  validEventPhoto: {
    file: () => generateTestImageFile('event.jpg', 1000),
    description: 'Valid event photo upload',
    expectedResult: 'success',
  },
  tooLargeFile: {
    file: () => generateLargeTestImage('large.jpg'),
    description: 'File exceeds size limit',
    expectedResult: 'error',
    expectedError: 'File size exceeds maximum limit',
  },
  invalidFileType: {
    file: () => generateInvalidFile('document.txt'),
    description: 'Invalid file type',
    expectedResult: 'error',
    expectedError: 'Invalid file type',
  },
  multipleFiles: {
    files: () => generateMultipleTestImages(3),
    description: 'Multiple file upload',
    expectedResult: 'success',
  },
};

/**
 * Create base64 encoded image string
 */
export function createBase64Image(buffer?: Buffer): string {
  const imageBuffer = buffer || createTestImageBuffer();
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

/**
 * Validate base64 image string
 */
export function isValidBase64Image(base64String: string): boolean {
  const pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
  return pattern.test(base64String);
}

/**
 * Extract base64 data from data URL
 */
export function extractBase64Data(dataUrl: string): string {
  return dataUrl.split(',')[1];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().replace('.', '');
}

/**
 * Generate random filename
 */
export function generateRandomFilename(extension: string = 'jpg'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `image-${timestamp}-${random}.${extension}`;
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}
