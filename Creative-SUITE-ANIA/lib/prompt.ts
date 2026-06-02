export type InfographicPayload = {
  infographicType: string;
  visualStyle: string;
  format: string;
  title: string;
  subtitle: string;
  keyData: string;
  recommendations: string;
  palette: string;
  source: string;
  logoHint: string;
  editInstruction?: string;
};

export function buildMasterPrompt(payload: InfographicPayload) {
  const edit = payload.editInstruction ? `\nAJUSTE SOLICITADO POR EL USUARIO:\n${payload.editInstruction}\n` : "";

  return `Crea una infografía editorial profesional de alta calidad.

TIPO DE INFOGRAFÍA:
${payload.infographicType}

FORMATO:
${payload.format}

ESTILO VISUAL:
${payload.visualStyle}

PALETA / DIRECCIÓN DE COLOR:
${payload.palette || "Azul profundo, blanco, acentos cian y naranja, look premium de televisión."}

CONTENIDO:
Título principal: ${payload.title}
Subtítulo: ${payload.subtitle}
Datos clave: ${payload.keyData}
Recomendaciones / bloques informativos: ${payload.recommendations}
Fuente / nota: ${payload.source}
Logo o marca sugerida: ${payload.logoHint || "Reservar espacio discreto para logotipo."}
${edit}
DIRECCIÓN CREATIVA:
- Composición limpia, poderosa y editorial.
- Jerarquía visual clara: título grande, bloques secundarios, datos destacados e iconografía.
- Estética de broadcast design, infografía premium, comunicación institucional y dashboard editorial.
- Usar profundidad, brillos controlados, paneles, tarjetas, líneas finas, sombras y detalles modernos.
- La imagen debe sentirse lista para televisión, redes y presentación ejecutiva.
- Evitar saturación innecesaria. Debe verse profesional, no genérica.
- Si hay texto dentro de la imagen, debe ser legible, en español y con buena ortografía.
- Dejar suficiente aire visual para correcciones posteriores en un editor.

NO incluir marcas registradas ajenas. No copiar exactamente ninguna referencia; solo interpretar el nivel de calidad visual.`;
}
