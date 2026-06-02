# Infografía AI Studio

Aplicación Next.js lista para GitHub + Vercel. Genera prompts editoriales y llama a OpenAI Images API de forma segura desde backend.

## Instalación local

```bash
npm install
cp .env.example .env.local
# pega tu API key en .env.local
npm run dev
```

Abre: http://localhost:3000

## Vercel

1. Sube este proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Agrega variable de entorno:

```bash
OPENAI_API_KEY=tu_api_key
```

4. Deploy.

## Importante

La API Key nunca va en el frontend. Solo se usa dentro de `app/api/generate-image/route.ts`.
