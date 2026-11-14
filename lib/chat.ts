export const MAX_CHAT_MESSAGES = 20;
export const MAX_CHAT_MESSAGE_LENGTH = 4000;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Sanitizes client-supplied chat history before it is forwarded to the LLM.
 * - Drops any role other than user/assistant, so clients cannot inject their
 *   own "system" messages and override the server's system prompt.
 * - Drops non-string / empty content and truncates very long messages.
 * - Keeps only the most recent MAX_CHAT_MESSAGES to bound token cost.
 */
export function sanitizeChatMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHAT_MESSAGE_LENGTH) }))
    .slice(-MAX_CHAT_MESSAGES);
}
