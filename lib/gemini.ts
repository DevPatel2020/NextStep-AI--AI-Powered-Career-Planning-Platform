const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateGeminiContent(
  prompt: string,
  systemInstruction?: string,
  json: boolean = false,
  maxRetries: number = 3
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody: any = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [
        {
          text: systemInstruction,
        },
      ],
    };
  }

  if (json) {
    requestBody.generationConfig = {
      responseMimeType: "application/json",
    };
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Exponential backoff: wait 2s, 4s, 8s before retrying
    if (attempt > 0) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Gemini API retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
      await sleep(delay);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Retry on 503 (overloaded) and 429 (rate limited)
    if (response.status === 503 || response.status === 429) {
      const errorText = await response.text();
      lastError = new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
      continue; // retry
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("No content returned in Gemini API response: " + JSON.stringify(data));
    }

    return content;
  }

  // All retries exhausted
  throw lastError ?? new Error("Gemini API failed after multiple retries.");
}
