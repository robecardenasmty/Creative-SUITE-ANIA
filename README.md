# Creative Suite ANIA

Aplicación Next.js para generar infografías premium con OpenAI API.

## Estructura correcta

El repositorio debe incluir estas carpetas en la raíz:

- `app/`
- `components/`
- `lib/`
- `public/`

Si falta `app/`, Vercel marcará este error:

```txt
Couldn't find any pages or app directory
```

## Deploy en Vercel

1. Sube todo el contenido de esta carpeta a GitHub.
2. Importa el repositorio en Vercel.
3. En Vercel ve a Settings > Environment Variables.
4. Agrega:

```txt
OPENAI_API_KEY=tu_api_key
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_TEXT_MODEL=gpt-4o-mini
```

5. Redeploy.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Nota

No pongas tu API key en el frontend ni en GitHub. Usa `.env.local` localmente y Environment Variables en Vercel.
