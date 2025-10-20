import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    const filePath = path.join(process.cwd(), "data.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load JSON data" }),
    };
  }
}
