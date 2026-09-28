import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { AIService } from '@/services/AIService';
import { AIConversationRepository } from '@/repositories';
import type { AIMessage } from '@/models';
import { clsx } from '@/utils/clsx';

const SUGGESTED_QUESTIONS = [
  '¿Cómo hago un chuletón?',
  'Tengo pollo, ¿qué preparo?',
  '¿Qué madera uso con salmón?',
  'Adaptar una receta',
  'Recomiéndame algo',
];

export function AIPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ensureConversation = async (): Promise<string> => {
    if (conversationId) return conversationId;
    const conversation = await AIConversationRepository.create('Conversación con GrillBook AI');
    setConversationId(conversation.id);
    return conversation.id;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);
    const convId = await ensureConversation();

    const userMessage = await AIConversationRepository.addMessage(convId, 'user', content.trim());
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const answer = await AIService.answerCookingQuestion(content.trim());
      const assistantMessage = await AIConversationRepository.addMessage(convId, 'assistant', answer.content);
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="GrillBook AI" subtitle="Pregunta cualquier cosa sobre cocina a la brasa." />

      <div className="flex-1 flex flex-col gap-4 px-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ashMuted uppercase tracking-wide">Preguntas sugeridas</span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(q)}
                  className="text-xs px-3 py-2 rounded-full border border-border bg-graphite2 text-ash"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'max-w-[85%] rounded-xl2 px-4 py-3 text-sm',
                message.role === 'user'
                  ? 'self-end bg-ember text-carbon'
                  : 'self-start bg-graphite2 text-ash border border-border',
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="self-start flex items-center gap-2 text-xs text-ashMuted">
              <Sparkles size={14} className="animate-pulse" /> GrillBook AI está pensando…
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 flex gap-2 sticky bottom-0 bg-carbon">
        <input
          type="text"
          aria-label="Escribe tu pregunta"
          placeholder="Escribe tu pregunta sobre BBQ…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-12 rounded-xl2 border border-border bg-graphite2 px-4 text-ash placeholder:text-ashMuted/60 focus:outline-none focus:ring-2 focus:ring-ember/50"
        />
        <button
          type="submit"
          aria-label="Enviar"
          disabled={isLoading || !input.trim()}
          className="h-12 w-12 flex items-center justify-center rounded-xl2 bg-ember text-carbon disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
