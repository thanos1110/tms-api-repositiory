import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    const filePath = path.join(process.env.LAMBDA_TASK_ROOT || process.cwd(), "data.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // Extract path for logic
    const pathSegments = event.path.split("/");
    
    // If the request is exactly /getall, return all data
    if (event.path === "/getall") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    // Otherwise handle /get/:license
    const licenseKey = pathSegments[pathSegments.length - 1];
    if (licenseKey && licenseKey !== "get") {
      const filtered = data.filter(item => item.LicenseKey === licenseKey);
      if (filtered.length) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filtered),
        };
      } else {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "License key not found" }),
        };
      }
    }

    // If nothing matched, return all data as a fallback
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
