import fs from "fs";
import path from "path";
import sharp from "sharp";

// Directories
const imagesDir = "images";
const compressedDir = "compressed";
const printDir = "print";

// Ensure necessary directories exist
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}
if (!fs.existsSync(printDir)) {
  fs.mkdirSync(printDir, { recursive: true });
}

async function compressImages() {
  try {
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
      if (file.endsWith(".jpg")) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(compressedDir, file);

        try {
          // Get original timestamps
          const stats = fs.statSync(inputPath);

          // Compress image
          await sharp(inputPath)
            .withMetadata()
            .jpeg({ quality: 70 })
            .toFile(outputPath);

          // Apply original timestamps
          fs.utimesSync(outputPath, stats.atime, stats.mtime);

          console.log(`Compressed: ${file}`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }

    // After all images are processed, randomly move 100 to print folder
    moveRandomImages();
  } catch (err) {
    console.error("Error reading images directory:", err);
  }
}

function moveRandomImages() {
  try {
    const files = fs
      .readdirSync(compressedDir)
      .filter((file) => file.endsWith(".jpg"));

    if (files.length === 0) {
      console.log("No images to move.");
      return;
    }

    // Shuffle and pick 100 images
    const selectedFiles = files.sort(() => Math.random() - 0.5).slice(0, 100);

    selectedFiles.forEach((file) => {
      const oldPath = path.join(compressedDir, file);
      const newPath = path.join(printDir, file);

      fs.renameSync(oldPath, newPath);
      console.log(`Moved: ${file}`);
    });

    console.log("Finished moving 100 images.");
  } catch (err) {
    console.error("Error moving images:", err);
  }
}

// Start the process
compressImages();
