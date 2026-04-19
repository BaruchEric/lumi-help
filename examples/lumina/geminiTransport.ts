/**
 * Example: wire an AI gateway as the AskLumi transport. The
 * @baruch-eric/lumi-help package only needs `(prompt: string) => Promise<string>`
 * — the specific provider is yours to choose.
 */
import type { AiTransport } from '@baruch-eric/lumi-help'

// Stubs — replace with your own gateway client and preferences.
declare function generateText(
  modelId: string,
  args: { prompt: string },
): Promise<{ text?: string }>
declare function getAiModelForTask(uid: string, task: string): Promise<string>
declare function getDefaultModelId(task: string): string

export function geminiTransport(uid: string | null): AiTransport {
  return async (prompt) => {
    const modelId = uid
      ? await getAiModelForTask(uid, 'Chatbot')
      : getDefaultModelId('Chatbot')
    const resp = await generateText(modelId, { prompt })
    return resp.text ?? ''
  }
}
