export type AiTransport = (prompt: string) => Promise<string>

export const noopTransport: AiTransport = async () =>
  "Ask Lumi isn't configured in this app. Pass an `aiTransport` prop to enable it."
