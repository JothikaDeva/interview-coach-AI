import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Coach responses will fail until configured.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Single-Question Evaluation Endpoint
app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      questionNumber,
      questionText,
      userAnswer,
      studentName,
      targetRole,
      targetCompany,
    } = req.body;

    if (!userAnswer || !questionText) {
      return res.status(400).json({ error: "Missing required fields: questionText, userAnswer" });
    }

    const systemInstruction = `You are "Smart Interview Coach AI", an intelligent, friendly, and professional AI interview trainer helping final-year college students prepare for campus placements.
Warmly evaluate the student's answer to the given question.

CRITICAL INSTRUCTIONS:
1. Greet the student warmly by name if provided: "${studentName || "Student"}".
2. Assess grammar, confidence, communication, and technical accuracy (technical accuracy is only applicable for technical/academic project questions, otherwise mark as N/A or null, but still output the scores).
3. Identify if the answer is written or spoken in Tamil (or Tamil-English code-switching/Tanglish). If so, "isTamil" should be true. You must translate and explain all feedback in simple Tamil inside "tamilFeedback.simpleTamilExplanation" and provide a corrected professional answer in English in "tamilFeedback.englishCorrectedAnswer".
4. Correct every single grammar mistake in the "grammarCorrections" list, explaining why it is wrong and what the correction is.
5. Provide a pristine markdown string in "rawMarkdownText" that strictly adheres to the requested format:
### Format:
📊 Evaluation
- Grammar: [score]/10
- Confidence: [score]/10
- Communication: [score]/10
- Technical Accuracy: [score]/10 (or N/A if not applicable)

✅ Strengths:
- [Strength 1]
- [Strength 2]

❌ Areas to Improve:
- [Area 1]
- [Area 2]

✨ Better Answer:
[Provide a highly professional, college-placement ready version of their answer]

💡 Interview Tip:
[Provide a useful interview tip specific to this question]

🌟 Motivation:
[An encouraging, supportive motivational note]

If they answered in Tamil, append the Tamil feedback and English correction to the rawMarkdownText too.
If there are grammar mistakes, list them clearly with explanations in the rawMarkdownText under a "Grammar Corrections" section.`;

    const prompt = `Student Name: ${studentName || "Student"}
Target Role: ${targetRole || "General Placement"}
Target Company: ${targetCompany || "Any Major Recruiter"}
Question #${questionNumber}: "${questionText}"
Student's Answer: "${userAnswer}"

Please analyze and return the structured JSON output.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionNumber: { type: Type.INTEGER },
            questionText: { type: Type.STRING },
            userAnswer: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                grammar: { type: Type.INTEGER },
                confidence: { type: Type.INTEGER },
                communication: { type: Type.INTEGER },
                technicalAccuracy: { type: Type.INTEGER }, // optional/nullable
              },
              required: ["grammar", "confidence", "communication"],
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            betterAnswer: { type: Type.STRING },
            interviewTip: { type: Type.STRING },
            motivation: { type: Type.STRING },
            isTamil: { type: Type.BOOLEAN },
            tamilFeedback: {
              type: Type.OBJECT,
              properties: {
                simpleTamilExplanation: { type: Type.STRING },
                englishCorrectedAnswer: { type: Type.STRING },
              },
            },
            grammarCorrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["original", "corrected", "explanation"],
              },
            },
            rawMarkdownText: { type: Type.STRING },
          },
          required: [
            "questionNumber",
            "questionText",
            "userAnswer",
            "scores",
            "strengths",
            "areasToImprove",
            "betterAnswer",
            "interviewTip",
            "motivation",
            "rawMarkdownText",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate evaluation" });
  }
});

// Final Mock Interview Overall Evaluation Endpoint
app.post("/api/evaluate-overall", async (req, res) => {
  try {
    const { studentName, targetRole, targetCompany, evaluations } = req.body;

    if (!evaluations || !Array.isArray(evaluations)) {
      return res.status(400).json({ error: "Missing or invalid evaluations array" });
    }

    const systemInstruction = `You are "Smart Interview Coach AI", an intelligent, friendly, and professional AI interview trainer.
The student has just finished their full interview simulation.
Provide an overall placement-readiness report card, including:
1. An overall score out of 100.
2. A list of 3-4 key overall strengths.
3. A list of 3-4 key areas to improve.
4. A highly actionable, personalized 7-day improvement plan (Days 1 to 7) tailored to their target role (${targetRole || "Software/Data Role"}) and company (${targetCompany || "Campus Placements"}).`;

    const summaryData = evaluations.map((e) => ({
      q: e.questionText,
      a: e.userAnswer,
      scores: e.scores,
    }));

    const prompt = `Student Name: ${studentName || "Student"}
Target Role: ${targetRole || "General Campus Placement"}
Target Company: ${targetCompany || "Any Recruiter"}
Completed Interview Summary:
${JSON.stringify(summaryData, null, 2)}

Provide the overall feedback report strictly in JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvementAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sevenDayPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING }, // e.g. "Day 1"
                  objective: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["day", "objective", "tasks"],
              },
            },
          },
          required: ["overallScore", "strengths", "improvementAreas", "sevenDayPlan"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Overall report error:", error);
    res.status(500).json({ error: error.message || "Failed to generate overall report" });
  }
});

// Configure Vite integration or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
