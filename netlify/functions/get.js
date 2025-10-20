import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    const filePath = path.join(process.cwd(), "data.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    const licenseKey = event.queryStringParameters.license;

    // If license provided, filter results
    if (licenseKey) {
      const filtered = data.filter(item => item.LicenseKey === licenseKey);
      if (filtered.length === 0) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "License key not found" }),
        };
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtered),
      };
    }

    // No license param → return all
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
