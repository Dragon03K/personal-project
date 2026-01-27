import * as cheerio from "cheerio";

export const scrapeUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts and styles
    $("script, style").remove();

    // Get body text and clean it up
    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000); // Limit to 5k chars for token limits

    return text;
  } catch (error) {
    console.error("Scraping error:", error);
    return "";
  }
};
