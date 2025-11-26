#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const sharp = require("sharp");

/**
 * Downloads imageUrl to temp location, converts to JPG,
 * resizes to a reasonable max size, and writes outputImagePath
 *
 * @param {string} imageUrl - The image URL to download
 * @param {string} outputDir - Directory to write final JPG to
 * @param {string} outputName - Name of the output jpg, no extension needed
 * @returns {Promise<string>} full path to the output JPG
 */
async function downloadAndTranscodeImage(imageUrl, outputDir, outputName) {
  if (!imageUrl) {
    throw new Error("downloadAndTranscodeImage: imageUrl is required");
  }

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // 1. Create temp file path
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `img-${Date.now()}`);

  // 2. Download the file
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to download image: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(tempFile, buffer);

  // 3. Generate final output path
  const outputPath = path.join(outputDir, `${outputName}.jpg`);

  // 4. Use sharp to resize + convert to JPG
  // You can adjust size/quality here as needed
  await sharp(tempFile)
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 85,
      chromaSubsampling: "4:4:4",
    })
    .toFile(outputPath);

  // 5. Clean up temp file
  await fs.promises.unlink(tempFile);

  return outputPath;
}

function getDateString() {

    let date_time = new Date(Date.now());
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();

    // prints date & time in YYYY-MM-DD format
    return year + "-" + month + "-" + date;

}

async function processInput(inputFile) {
    if (!inputFile) {
        throw new Error(`Can not find inputFile: ${inputFile}`);
    }

    // Read and parse JSON
    let data;
    data = JSON.parse(fs.readFileSync(inputFile, "utf8"));
    

    // 1. Make name into a safe filename
    const safeName = data.name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-") // replace non alphanumerics with hyphens
    .replace(/^-+|-+$/g, "");    // trim starting/ending hyphens

    const outFile = `projects/${safeName}.json`

    let createdDate = getDateString()
    let image = ""

    try {
      if (fs.existsSync(outFile)) {
        let previous_data = JSON.parse(fs.readFileSync(outFile, "utf8"));
        if ("createdDate" in previous_data){
          createdDate = previous_data["createdDate"]     
        }
        if ("image" in previous_data){
          image = previous_data["image"]
        }
      }
    } catch (err) {

    }    

    // 2. Extract image URL from markdown string
    // Format: ![Alt](URL)
    const urlRegex = /\bhttps?:\/\/[^\s<>")\]]+/i;
    const urlMatch = data.image.match(urlRegex);
    if (urlMatch) {
        let imageUrl = urlMatch[0];
        await downloadAndTranscodeImage(imageUrl, "public/project_images/", safeName)
        image = `${safeName}.jpg`
    }

    // 3. Convert features string into array
    const featuresArray = data.features
        .split("\n")
        .map(f => f.replace(/^-/, "").trim()) // remove leading dash + space
        .filter(f => f.length > 0);


    const output = {
        ...data,
        image: image,
        updatedDate: getDateString(),
        createdDate: createdDate,
        features: featuresArray
    };

    
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf8");
    console.log(`Wrote processed data to ${outFile}`);
}


(async () => {
  const inputFile = process.argv[2];
  try {
    await processInput(inputFile);  
  } catch (err) {
    console.error("Issue processing failed:", err);
    process.exit(1);
  }

  process.exit(0);
})();
