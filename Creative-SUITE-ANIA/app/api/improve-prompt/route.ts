import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildMasterPrompt } from "@/lib/prompt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const basePrompt = buildMasterPrompt(payload);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ prompt: basePrompt, warning: "Falta OPENAI_API_KEY. Se devolvió prompt local." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Eres director creativo senior especializado en infografías premium para televisión, gobierno, clima, seguridad e instituciones. Mejora prompts para generación de imagen. Devuelve solo el prompt final en español." },
        { role: "user", content: basePrompt }
      ],
      temperature: 0.7
    });

    return NextResponse.json({ prompt: response.choices[0]?.message?.content || basePrompt });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al mejorar prompt" }, { status: 500 });
  }
}
