import sharp from "sharp";
import fs from "fs";

// const imageBuffer = fs.readFileSync("./edited/photo.jpg");
fs.readdir("images", async (err, files) => {
  for (const file of files) {
    if (file.endsWith(".jpg")) {
      await sharp(`./images/${file}`)
        .webp({ quality: 70 })
        .toFile(`./compressed/${file}`);
      console.log(`Compressed: ${file}`);
    }
  }
});
