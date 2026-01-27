import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import Business from "@/models/Business";
import {
  getChatResponse,
  getSummaryByUrl,
  getAnswerFromUrl,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 1. Fetch all influencers and businesses for context
    const [allInfluencers, allBusinesses] = await Promise.all([
      Influencer.find({}, "name category niche url gender instagramId"),
      Business.find({}, "name category address contact"),
    ]);

    // 2. Check for specific influencer mention in the message
    let foundInfluencer = null;
    for (const influencer of allInfluencers) {
      if (
        message.toLowerCase().includes(influencer.name.toLowerCase()) ||
        message.toLowerCase().includes(influencer.url.toLowerCase())
      ) {
        foundInfluencer = influencer;
        break;
      }
    }

    if (foundInfluencer) {
      const aiResponse = await getAnswerFromUrl(message, foundInfluencer.url);
      return NextResponse.json({
        response: `[Reference: ${foundInfluencer.name} - ${foundInfluencer.url}]\n\n${aiResponse}`,
      });
    }

    // 3. Detect direct URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatch = message.match(urlRegex);

    if (urlMatch) {
      const url = urlMatch[0];
      const aiResponse = await getAnswerFromUrl(message, url);
      return NextResponse.json({ response: aiResponse });
    }

    // 4. General Chat with Business & Influencer Context
    const context = `
Current Database Context:
INFLUENCERS:
${allInfluencers.map((i: any) => `- ${i.name} (Instagram ID: ${i.instagramId}, Niche: ${i.niche}, Category: ${i.category}, Gender: ${i.gender}, URL: ${i.url})`).join("\n")}

BUSINESSES:
${allBusinesses.map((b: any) => `- ${b.name} (Category: ${b.category}, Contact: ${b.contact}, Address: ${b.address})`).join("\n")}

Instructions:
- Use the data above to answer user questions about influencers and businesses.
- When asked about suitability/matching, explain WHY an influencer is a good match based on their niche and the business category.
- Be precise and use the specific details (like Instagram ID or Contact) when relevant.
`;

    const aiResponse = await getChatResponse(message, context);
    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
