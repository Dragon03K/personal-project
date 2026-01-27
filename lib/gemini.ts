import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getEmbedding = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

export const getChatResponse = async (prompt: string, context: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const fullPrompt = `
System Role: You are a professional marketing consultant.
${context}

User Question: ${prompt}

Guidelines:
1. Use the "Current Database Context" provided to give accurate information about influencers and businesses.
2. When asked about suitability or matching, analyze the business category and compare it with influencer niches/content. Explain WHY an influencer is a good match based on their expertise.
3. If no relevant database information is found, answer based on your general knowledge but clearly state that you are doing so.
4. Keep responses professional, concise, and structured.
`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
};

export const getSummaryByUrl = async (url: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Please provide a brief, professional summary of the influencer profile at this URL: ${url}. Based on your internal knowledge, describe what kind of content they create and their general niche. If you don't know this specific URL, provide a general description of what might be found there based on the domain.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getAnswerFromUrl = async (prompt: string, url: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const fullPrompt = `The user is asking a question about this influencer URL: ${url}\n\nQuestion: ${prompt}\n\nBased on your internal knowledge, please answer the question. \n\nIMPORTANT: If this is an influencer profile, please format your response as follows:\n- **Name**: [Influencer Name]\n- **Content**: [Briefly describe the content they create]\n- **Category**: [Type of content and the category it falls into (e.g., Tech, Lifestyle, Gaming, etc.)]\n- **Interest**: [What are their primary interests or topics?]\n- **Niche**: [What is their specific niche?]\n\nIf the question is specific and doesn't fit this format perfectly, provide the specific answer first, followed by this structured profile if applicable. If you are unsure about the specific details for this URL, provide general context related to the domain or niche.`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
};
