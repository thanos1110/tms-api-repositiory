import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    // Get absolute path correctly within Lambda bundle
    const filePath = path.join(process.env.LAMBDA_TASK_ROOT || process.cwd(), "data.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // Extract license key from path
    const licenseKey = event.path.split("/").pop();

    if (licenseKey && licenseKey !== "get") {
      const filtered = data.filter(item => item.LicenseKey === licenseKey);
      if (filtered.length) {
        return { statusCode: 200, headers: {"Content-Type": "application/json"}, body: JSON.stringify(filtered) };
      } else {
        return { statusCode: 404, headers: {"Content-Type": "application/json"}, body: JSON.stringify({message: "License key not found"}) };
      }
    }

    return { statusCode: 200, headers: {"Content-Type": "application/json"}, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, headers: {"Content-Type": "application/json"}, body: JSON.stringify({ error: error.message }) };
  }
}
