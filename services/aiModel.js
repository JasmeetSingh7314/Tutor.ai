const OpenAI = require("openai");
const prompt = require("../utils/systemPrompt");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

const system_prompt = prompt;

async function initModel() {
  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content:
            "I am planning on going to Punjab in India, teach me 5 very basic phrase in punjabi that would come in handy and can you also include how to pronounce those phrase in english too",
        },
      ],
      model: "deepseek/deepseek-chat:free",
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.response?.status, error.message);
  }
}

module.exports = { initModel };
