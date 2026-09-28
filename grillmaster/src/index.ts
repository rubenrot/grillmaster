import cors from '@fastify/cors';
import Fastify from 'fastify';
import { aiRoutes } from './routes/ai.js';

const PORT = Number(process.env.PORT ?? 8787);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((o) => o.trim()),
});

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'grillmaster',
  aiProvider: process.env.AI_PROVIDER ?? 'mock',
  timestamp: new Date().toISOString(),
}));

await app.register(aiRoutes);

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`GrillMaster API escuchando en http://localhost:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
