import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildMasterPrompt } from "@/lib/prompt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Falta configurar OPENAI_API_KEY en Vercel Environment Variables." }, { status: 400 });
    }

    const payload = await req.json();
    const prompt = payload.prompt || buildMasterPrompt(payload);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

    const result = await openai.images.generate({
      model,
      prompt,
      size: payload.imageSize || "1536x1024",
      n: 1
    } as any);

    const item: any = result.data?.[0];
    const image = item?.b64_json ? `data:image/png;base64,${item.b64_json}` : item?.url;

    if (!image) {
      return NextResponse.json({ error: "OpenAI no devolvió imagen. Revisa modelo, permisos o tamaño solicitado." }, { status: 500 });
    }

    return NextResponse.json({ image, prompt });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al generar imagen" }, { status: 500 });
  }
}
