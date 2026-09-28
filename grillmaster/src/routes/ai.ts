import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import {
  adaptRecipeBodySchema,
  askBodySchema,
  generateRecipeBodySchema,
  recommendBodySchema,
} from '../schemas/ai.js';
import { ServerMockAIProvider } from '../ai/ServerMockAIProvider.js';

/**
 * Rutas de IA de GrillMaster API. Todas siguen el mismo patrón:
 * validar body con Zod -> delegar en el proveedor -> devolver JSON.
 * El frontend nunca habla directamente con un proveedor de IA externo,
 * solo con estas rutas.
 */
export const aiRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/ai/generate-recipe', async (req, reply) => {
    try {
      const { request, context } = generateRecipeBodySchema.parse(req.body);
      const recipe = await ServerMockAIProvider.generateRecipe(request, context);
      return recipe;
    } catch (err) {
      return handleError(err, reply);
    }
  });

  app.post('/api/ai/adapt-recipe', async (req, reply) => {
    try {
      const { request } = adaptRecipeBodySchema.parse(req.body);
      const variant = await ServerMockAIProvider.adaptRecipe(request);
      return variant;
    } catch (err) {
      return handleError(err, reply);
    }
  });

  app.post('/api/ai/recommend', async (req, reply) => {
    try {
      const { request, context } = recommendBodySchema.parse(req.body);
      const recipes = await ServerMockAIProvider.recommendRecipes(request, context);
      return recipes;
    } catch (err) {
      return handleError(err, reply);
    }
  });

  app.post('/api/ai/ask', async (req, reply) => {
    try {
      const { request, context } = askBodySchema.parse(req.body);
      const answer = await ServerMockAIProvider.answerCookingQuestion(request.question, context);
      return answer;
    } catch (err) {
      return handleError(err, reply);
    }
  });
};

function handleError(err: unknown, reply: import('fastify').FastifyReply) {
  if (err instanceof ZodError) {
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: 'La petición no tiene un formato válido.',
      issues: err.issues,
    });
  }
  app_log(err);
  return reply.status(500).send({ code: 'INTERNAL_ERROR', message: 'Error interno del servidor.' });
}

function app_log(err: unknown) {
  // eslint-disable-next-line no-console
  console.error('[grillmaster] error', err);
}
