const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, "../", 'projects');
const outputFile = path.join(__dirname, "../src" ,'projects.json');

// Where image paths should be resolved relative to:
const imageBasePath = path.join(__dirname, "../", "public"); // change if needed

var processingErrors = false 

// Validate JSON shape & image existence
async function validateProjectJson(obj, filePath) {
  const errors = [];

  // Required string fields
  const requiredStrings = ["image", "name", "description", "status"];
  for (const key of requiredStrings) {
    if (typeof obj[key] !== "string") {
      errors.push(`"${key}" must be a string`);
    }
  }

  // Validate features structure
  if (!Array.isArray(obj.features)) {
    errors.push(`"features" must be an array`);
  } else {
    obj.features.forEach((item, index) => {
      const prefix = `"features"[${index}]`;

      if (typeof item === "string") return;

      if (typeof item === "object" && item !== null) {
        if (typeof item.text !== "string") {
          errors.push(`${prefix}.text must be a string`);
        }
        if (typeof item.link !== "string") {
          errors.push(`${prefix}.link must be a string`);
        }
      } else {
        errors.push(`${prefix} must be a string or an object with { text, link }`);
      }
    });
  }

  // Validate image exists
  if (typeof obj.image === "string") {
    const imagePath = path.join(imageBasePath, obj.image);

    try {
      await fs.promises.access(imagePath, fs.constants.F_OK);
    } catch {
      errors.push(`Image file does not exist: ${obj.image}`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Validation failed for ${filePath}`);
    errors.forEach(e => console.error("   - " + e));
    processingErrors = true 
    return false 
  }

  return true;
}


// Recursively walk directories
async function getAllJsonFiles(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const sub = await getAllJsonFiles(fullPath);
      files.push(...sub);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}


// Main combine function
async function combineJsonFiles() {
  try {
    const jsonFilePaths = await getAllJsonFiles(rootDir);
    const combined = [];

    for (const filePath of jsonFilePaths) {
      try {
        const raw = await fs.promises.readFile(filePath, 'utf8');
        const parsed = JSON.parse(raw);

        if (await validateProjectJson(parsed, filePath)) {
          combined.push(parsed);
        }
      } catch (err) {
        console.error(`❌ Error reading/parsing ${filePath}:`, err.message);
        processingErrors = true 
      }
    }
    if(!processingErrors){
        await fs.promises.writeFile(outputFile, JSON.stringify(combined, null, 2));
        console.log(`\n✅ Combined ${combined.length} valid JSON files into ${outputFile}`);
    }
  } catch (err) {
    console.error('Error:', err);
    processingErrors = true 
  }
}

(async () => {
  await combineJsonFiles();

  if (processingErrors) {
    process.exit(1);
  }

  process.exit(0);
})();
