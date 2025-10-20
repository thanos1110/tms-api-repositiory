export async function handler(event, context) {
  try {
    const filePath = path.join(process.cwd(), "data.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Extract last segment from path
    const licenseKey = event.path.split("/").pop();

    const filtered = data.filter(item => item.LicenseKey === licenseKey);
    if (filtered.length > 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtered),
      };
    }

    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "License key not found" }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
