# GrillMaster API

Backend **opcional** y desacoplado de GrillBook. La PWA funciona completamente
sin este servicio (usando `MockAIProvider` en el navegador); GrillMaster API
existe para habilitar, en una versión distribuida, un proveedor de IA real
sin exponer nunca claves privadas en el frontend.

## Arquitectura

```text
GrillBook PWA (src/)
       │
       │  fetch (solo si VITE_AI_PROVIDER=remote)
       ▼
GrillMaster API (grillmaster/)
       │
       ▼
Proveedor de IA (mock por defecto)
```

El frontend sigue siendo local-first: todos los datos (recetas, barbacoas,
historial, preferencias...) se guardan en IndexedDB. GrillMaster API no
persiste nada por defecto; solo orquesta la generación de contenido IA a
partir del contexto que le envía el cliente en cada petición.

## Ejecutar en desarrollo

```bash
cd grillmaster
npm install
copy .env.example .env   # Windows PowerShell: cp .env.example .env
npm run dev
```

El servidor arranca en `http://localhost:8787` (configurable con `PORT`).

## Endpoints

- `GET /api/health`
- `POST /api/ai/ask`
- `POST /api/ai/generate-recipe`
- `POST /api/ai/adapt-recipe`
- `POST /api/ai/recommend`

Todos los bodies se validan con Zod (`src/schemas/ai.ts`). Las respuestas
inválidas del proveedor de IA nunca llegan al cliente sin validar.

## Variables de entorno

Ver `.env.example`. Con `AI_PROVIDER=mock` (por defecto) no se requiere
ninguna clave y el servicio es completamente funcional para desarrollo.

## Producción / distribución

Este backend es intencionadamente ligero (Fastify + Zod, sin base de
datos). Puede desplegarse de forma independiente del frontend (por ejemplo
en un contenedor o servicio serverless) sin que el resto de la arquitectura
de GrillBook cambie: el frontend solo necesita apuntar `VITE_API_URL` a la
URL pública de este servicio.
