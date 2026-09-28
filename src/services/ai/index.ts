import { MockAIProvider } from './MockAIProvider';
import { RemoteAIProvider } from './RemoteAIProvider';
import type { AIProvider } from './AIProvider';

export * from './AIProvider';
export * from './MockAIProvider';
export * from './RemoteAIProvider';

/**
 * Punto único de configuración del proveedor de IA activo.
 *
 * - `mock` (por defecto): todo funciona en el navegador, sin servidor.
 * - `remote`: delega en GrillMaster API (`/grillmaster`), el backend
 *   opcional de la versión distribuida. Útil cuando se quiere conectar
 *   un proveedor de IA real sin exponer claves en el cliente.
 *
 * Cambiar de proveedor (incluyendo un futuro `SupabaseAIProvider`) nunca
 * requiere tocar componentes React ni `AIService`.
 */
const configuredProvider = (import.meta.env.VITE_AI_PROVIDER as string | undefined) ?? 'mock';

export const aiProvider: AIProvider = configuredProvider === 'remote' ? new RemoteAIProvider() : new MockAIProvider();
