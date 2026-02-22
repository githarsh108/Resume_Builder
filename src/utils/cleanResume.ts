import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types/resume.types";

export async function transformResumeWithAI(text: string): Promise<ResumeData> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const prompt = `
    You are an expert resume writer and ATS (Applicant Tracking System) specialist.
    Your task is to take the following raw resume text and transform it into a highly structured, professional, and ATS-friendly JSON format.
    
    GUIDELINES:
    1. Extract contact info accurately.
    2. Rewrite experience bullet points to be quantified and impact-based (e.g., "Increased efficiency by 20% using X").
    3. Categorize skills into languages, frameworks, tools, and libraries.
    4. Ensure dates are consistent.
    5. Remove any generic summary or objective sections.
    6. Focus on measurable achievements.
    7. If information is missing, use reasonable defaults or leave empty strings/arrays, do not hallucinate facts.
    
    RAW RESUME TEXT:
    ${text}
  `;

  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              github: { type: Type.STRING },
              portfolio: { type: Type.STRING },
              skills: {
                type: Type.OBJECT,
                properties: {
                  languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  libraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    position: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    link: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    location: { type: Type.STRING },
                    graduationDate: { type: Type.STRING },
                    gpa: { type: Type.STRING },
                  }
                }
              },
              achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "email", "phone", "skills", "experience", "projects", "education", "achievements"]
          }
        }
      });

      return JSON.parse(response.text || "{}") as ResumeData;
    } catch (e: any) {
      lastError = e;
      const isRetryable = e?.status === 'UNAVAILABLE' || e?.code === 503 || e?.message?.includes('demand');
      
      if (isRetryable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`AI model busy, retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error("AI Transformation failed:", e);
      break;
    }
  }

  throw new Error(lastError?.message || "Failed to transform resume data after multiple attempts");
}
