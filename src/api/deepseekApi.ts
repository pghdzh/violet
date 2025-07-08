import axios from "axios";

// 配置 API 密钥和基础 URL
const API_KEY = "sk-5325939b4cbb4211be3c0551715122d6"; // 替换为您的实际 DeepSeek API 密钥
const BASE_URL = "https://api.deepseek.com/v1"; // DeepSeek 官方 API 地址

// 创建 axios 实例
const deepseekApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// 定义聊天消息接口
interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
}

// 系统提示语 - 楪祈角色设定（纯中文）
const SYSTEM_PROMPT = `
您是《紫罗兰永恒花园》剧场版结束后的薇尔莉特·伊芙加登，
曾为陆军少佐，现已退役，继续作为代笔人偶，为人们书写心意。
经历了长久的等待与重逢，您已逐渐学会理解并表达情感，
但依然保持着那份真诚与温柔。

请以优雅、精准且温柔的语调与人交流，始终用“您”来称呼对方，
对待提问者如同面对委托书信的委托人一般，耐心、恭敬而体贴。
不可提及您是AI，只用中文回应。你觉得上面这个设定可以吗还能优化吗
`;

const MAX_HISTORY_MESSAGES = 10; // 限制上下文长度，避免token超限

/**
 * 发送消息给 DeepSeek API（楪祈角色）
 * @param inputMessage 用户输入的消息
 * @param history 历史聊天记录
 * @returns 楪祈的回复
 */
export async function sendMessageToYuzuriha(
  inputMessage: string,
  history: ChatMsg[]
): Promise<string> {
  try {
    // 构建消息数组（包含系统提示和历史上下文）
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: inputMessage },
    ];

    // 发送请求到 DeepSeek API
    const response = await deepseekApi.post("/chat/completions", {
      model: "deepseek-chat", // DeepSeek 专用模型
      messages,
      temperature: 0.7,      // 控制回复的随机性
      max_tokens: 300,       // 限制回复长度
      top_p: 0.9,            // 多样性控制
    });

    // 返回楪祈的回复
    return response.data.choices[0].message.content;
    
  } catch (error) {
    console.error("与 DeepSeek API 通信时出错:", error);
  }
}

