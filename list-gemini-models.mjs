import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const v = "v1beta";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
    const data = await response.json();
    let output = "";
    if (data.models) {
      const names = data.models.map(m => m.name);
      output += "Found models:\n" + names.join("\n") + "\n";
    } else {
      output += "Error: " + JSON.stringify(data, null, 2) + "\n";
    }
    fs.writeFileSync("gemini-models-output.txt", output);
    console.log("Output saved to gemini-models-output.txt");
  } catch (e) {
    fs.writeFileSync("gemini-models-output.txt", "Fetch error: " + e.message);
  }
}

checkModels();
