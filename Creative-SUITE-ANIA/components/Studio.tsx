"use client";

import { useMemo, useState } from "react";
import { Download, ImagePlus, Layers, Loader2, Sparkles, Wand2 } from "lucide-react";
import { buildMasterPrompt, type InfographicPayload } from "@/lib/prompt";

const types = ["Clima", "Seguridad pública", "Salud preventiva", "Medio ambiente", "Sistema técnico", "Institucional", "Inmobiliaria", "Mapa / ruta", "Personalizada"];
const styles = ["Noticiero premium", "Gobierno institucional", "Cinematográfico editorial", "Infantil ilustrado", "Corporativo elegante", "Pizarra técnica / sistema operativo", "App futurista / clima premium", "Ficha inmobiliaria premium"];
const formats = ["16:9 horizontal", "1:1 cuadrado", "Vertical 9:16", "Tabloide / póster", "Historia redes"];

const initial: InfographicPayload = {
  infographicType: "Seguridad pública",
  visualStyle: "Noticiero premium",
  format: "16:9 horizontal",
  title: "Recomendaciones para evitar extorsiones telefónicas",
  subtitle: "Información preventiva para la ciudadanía",
  keyData: "No contestes números desconocidos. No proporciones datos personales. Reporta al 089 o 9-1-1.",
  recommendations: "1. Cuelga y bloquea. 2. Habla con tu familia. 3. No cedas ante amenazas. 4. Mantén tu celular prendido. 5. Denuncia inmediatamente.",
  palette: "Azul profundo, blanco, rojo de alerta, acentos cian, estilo editorial de televisión.",
  source: "Fuente: Información preventiva institucional",
  logoHint: "Reservar esquina superior derecha para logo del medio o institución.",
};

export default function Studio() {
  const [form, setForm] = useState<InfographicPayload>(initial);
  const [prompt, setPrompt] = useState(buildMasterPrompt(initial));
  const [image, setImage] = useState<string>("");
  const [history, setHistory] = useState<{ image: string; prompt: string; date: string }[]>([]);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");

  const size = useMemo(() => {
    if (form.format.includes("Vertical")) return "1024x1536";
    if (form.format.includes("1:1")) return "1024x1024";
    return "1536x1024";
  }, [form.format]);

  function update<K extends keyof InfographicPayload>(key: K, value: InfographicPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function localPrompt() {
    const next = buildMasterPrompt(form);
    setPrompt(next);
  }

  async function improvePrompt() {
    setError("");
    setLoadingPrompt(true);
    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo mejorar el prompt");
      setPrompt(data.prompt);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingPrompt(false);
    }
  }

  async function generateImage(editInstruction?: string) {
    setError("");
    setLoadingImage(true);
    try {
      const payload = editInstruction ? { ...form, editInstruction, prompt: `${prompt}\n\nCAMBIO SOLICITADO: ${editInstruction}` } : { ...form, prompt };
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, imageSize: size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar la imagen");
      setImage(data.image);
      setHistory((prev) => [{ image: data.image, prompt: data.prompt, date: new Date().toLocaleString() }, ...prev].slice(0, 8));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingImage(false);
    }
  }

  function downloadImage() {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `infografia-ania-${Date.now()}.png`;
    a.click();
  }

  return (
    <main className="min-h-screen bg-grid px-5 py-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-[1500px] flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">Creative Suite ANIA</p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">Infografías premium con IA</h1>
          <p className="mt-3 max-w-3xl text-slate-300">Formulario editorial + prompt maestro + OpenAI API + vista previa. Pensado para televisión, clima, seguridad, gobierno, inmobiliarias e instituciones.</p>
        </div>
        <div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">API protegida en Vercel. Nunca pongas tu llave en el frontend.</div>
      </header>

      <section className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[360px_1fr_420px]">
        <aside className="card space-y-4">
          <div className="flex items-center gap-2 text-lg font-black"><Layers className="h-5 w-5 text-blue-300" /> Dirección visual</div>
          <div>
            <label className="label">Tipo</label>
            <select className="field" value={form.infographicType} onChange={(e) => update("infographicType", e.target.value)}>{types.map((x) => <option key={x}>{x}</option>)}</select>
          </div>
          <div>
            <label className="label">Estilo</label>
            <select className="field" value={form.visualStyle} onChange={(e) => update("visualStyle", e.target.value)}>{styles.map((x) => <option key={x}>{x}</option>)}</select>
          </div>
          <div>
            <label className="label">Formato</label>
            <select className="field" value={form.format} onChange={(e) => update("format", e.target.value)}>{formats.map((x) => <option key={x}>{x}</option>)}</select>
          </div>
          <div>
            <label className="label">Paleta / color</label>
            <textarea className="field min-h-[90px]" value={form.palette} onChange={(e) => update("palette", e.target.value)} />
          </div>
          <div>
            <label className="label">Logo / marca</label>
            <input className="field" value={form.logoHint} onChange={(e) => update("logoHint", e.target.value)} />
          </div>
          <button className="btn-secondary w-full" onClick={localPrompt}>Generar prompt local</button>
          <button className="btn-primary flex w-full items-center justify-center gap-2" onClick={improvePrompt} disabled={loadingPrompt}>
            {loadingPrompt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Mejorar prompt con IA
          </button>
        </aside>

        <section className="card flex min-h-[680px] flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Vista previa</p>
              <h2 className="text-2xl font-black">Resultado generado</h2>
            </div>
            <button className="btn-secondary flex items-center gap-2" onClick={downloadImage} disabled={!image}><Download className="h-4 w-4" /> Descargar PNG</button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-4">
            {loadingImage && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur"><Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-300" /><p className="font-bold">Generando infografía...</p></div>}
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Infografía generada" className="max-h-full max-w-full rounded-2xl object-contain shadow-glow" />
            ) : (
              <div className="max-w-xl text-center text-slate-300">
                <ImagePlus className="mx-auto mb-5 h-16 w-16 text-blue-300" />
                <h3 className="mb-2 text-2xl font-black text-white">Aquí aparecerá tu infografía</h3>
                <p>Llena el brief, mejora el prompt y genera una imagen. Puedes crear variantes con instrucciones como “más televisiva”, “más premium” o “más institucional”.</p>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {history.map((item, i) => (
                <button key={i} onClick={() => { setImage(item.image); setPrompt(item.prompt); }} className="min-w-[120px] rounded-2xl border border-white/10 bg-white/5 p-2 text-left hover:bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="Historial" className="h-16 w-full rounded-xl object-cover" />
                  <p className="mt-2 truncate text-[11px] text-slate-400">{item.date}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="card space-y-4">
          <div className="flex items-center gap-2 text-lg font-black"><Sparkles className="h-5 w-5 text-orange-300" /> Contenido editorial</div>
          <div><label className="label">Título</label><textarea className="field min-h-[70px]" value={form.title} onChange={(e) => update("title", e.target.value)} /></div>
          <div><label className="label">Subtítulo</label><textarea className="field min-h-[70px]" value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} /></div>
          <div><label className="label">Datos clave</label><textarea className="field min-h-[100px]" value={form.keyData} onChange={(e) => update("keyData", e.target.value)} /></div>
          <div><label className="label">Recomendaciones / bloques</label><textarea className="field min-h-[120px]" value={form.recommendations} onChange={(e) => update("recommendations", e.target.value)} /></div>
          <div><label className="label">Fuente</label><input className="field" value={form.source} onChange={(e) => update("source", e.target.value)} /></div>

          {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}

          <button className="btn-primary flex w-full items-center justify-center gap-2" onClick={() => generateImage()} disabled={loadingImage}>
            {loadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generar imagen
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-secondary" onClick={() => generateImage("Hazla más premium, limpia, con mayor profundidad y look de televisión de alto nivel.")} disabled={loadingImage}>Más premium</button>
            <button className="btn-secondary" onClick={() => generateImage("Crea otra versión con mejor jerarquía visual, menos saturación y más claridad editorial.")} disabled={loadingImage}>Otra versión</button>
          </div>
          <div>
            <label className="label">Prompt maestro</label>
            <textarea className="field min-h-[220px] font-mono text-xs" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
        </aside>
      </section>
    </main>
  );
}
