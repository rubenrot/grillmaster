import { db } from '@/db/GrillBookDB';
import type { AIConversation, AIMessage, AIMessageRole } from '@/models';

export const AIConversationRepository = {
  async create(title: string): Promise<AIConversation> {
    const now = new Date().toISOString();
    const conversation: AIConversation = {
      id: crypto.randomUUID(),
      title,
      createdAt: now,
      updatedAt: now,
    };
    await db.aiConversations.add(conversation);
    return conversation;
  },

  async listAll(): Promise<AIConversation[]> {
    return db.aiConversations.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<AIConversation | undefined> {
    return db.aiConversations.get(id);
  },

  async touch(id: string): Promise<void> {
    await db.aiConversations.update(id, { updatedAt: new Date().toISOString() });
  },

  async addMessage(conversationId: string, role: AIMessageRole, content: string): Promise<AIMessage> {
    const message: AIMessage = {
      id: crypto.randomUUID(),
      conversationId,
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    await db.aiMessages.add(message);
    await this.touch(conversationId);
    return message;
  },

  async listMessages(conversationId: string): Promise<AIMessage[]> {
    return db.aiMessages.where('conversationId').equals(conversationId).sortBy('createdAt');
  },
};
