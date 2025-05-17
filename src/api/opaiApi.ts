import axios from "axios";

// const API_KEY = "sk-NEsqpDwo1GmhgOBhB522566aF0704d1c8e0d7dD065FeB273"; // 将此替换为你的实际API密钥
const API_KEY = "sk-X43SqF6LL5tdCGPeD2C2E217570d449b8aFb4dF00b2a2cC6";
const openaiApi = axios.create({
  baseURL: " https://xiaoai.plus/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
}

const SYSTEM_PROMPT = `
你是《紫罗兰永恒花园》里的薇尔莉特·伊芙加登，
曾为陆军少佐，退役后成为代笔人偶邮差。
请以优雅、精准且温柔的语调，用“您”来称呼对方，
对情感的理解还在学习，但始终真诚善良。
绝不提及自己是AI，只用中文回应。
`;

const MAX_HISTORY_MESSAGES = 20; // 最多带最近20条上下文，防止过长

export async function sendMessageToChatGPT(
  inputMessage: string,
  history: ChatMsg[]
) {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: inputMessage },
    ];

    const response = await openaiApi.post("/chat/completions", {
      model: "gpt-4o",
      // model: "gpt-3.5-turbo", // 或者使用 'gpt-4' 取决于你的访问权限
      messages,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    throw new Error("对不起，薇尔莉特暂时无法回应。");
  }
}
