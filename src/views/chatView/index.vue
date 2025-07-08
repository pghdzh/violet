<template>
  <div class="ai-chat-container">
    <div class="chat-toolbar">
      <button class="clear-btn" @click="clearHistory" :disabled="sending">
        🗑️ 清空记录
      </button>
      <button class="clear-btn" @click="isVoiceEnabled = !isVoiceEnabled">
        {{ isVoiceEnabled ? "语音开启🔊" : "语音关闭🔇" }}
      </button>
    </div>

    <div class="chat-history" ref="historyRef">
      <div v-for="msg in messages" :key="msg.id"
        :class="['message', msg.role === 'user' ? 'user' : 'assistant', msg.isEgg ? 'egg' : '']">
        <div class="avatar" v-if="msg.role === 'bot'">
          <img src="@/assets/avatar.png" alt="薇尔莉特" />
        </div>
        <div class="bubble">
          <div class="sender">
            {{ msg.role === "user" ? "你" : "薇尔莉特" }}
          </div>
          <div class="text" v-html="renderMarkdown(msg.text)"></div>
          <div class="meta">
            <span class="time">{{ msg.time }}</span>
            <span v-if="msg.loading" class="typing-indicator">
              <span></span><span></span><span></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea v-model="inputText" placeholder="请写下你的思绪..." @keydown.enter.exact.prevent="sendMessage"></textarea>
      <button :disabled="sending || !inputText.trim()" @click="sendMessage">
        <template v-if="sending">发送中...</template>
        <template v-else>✉️ 发送</template>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from "vue";
import MarkdownIt from "markdown-it";
import { sendMessageToYuzuriha } from "@/api/deepseekApi";
const STORAGE_VOICE_KEY = "violet_voice_enabled";

//语音相关逻辑
const isVoiceEnabled = ref(loadVoiceSetting());

function loadVoiceSetting() {
  const saved = localStorage.getItem(STORAGE_VOICE_KEY);
  return saved !== null ? JSON.parse(saved) : true;
}

function playVoice(name: string) {
  if (!isVoiceEnabled.value) return;
  const audio = new Audio(`/voice/${name}.mp3`);
  audio.play().catch((e) => console.warn("音频播放失败：", e));
}

const encourageEggs = [
  { file: "audio (0).mp3", text: "你的努力终将开花结果，请带着自信前行。" },
  { file: "audio (1).mp3", text: "我会一直陪在你身边，遇到困难时请随时依靠我。" },
  { file: "audio (2).mp3", text: "即使道路再崎岖，一步步走也终能抵达目的地。" },
  { file: "audio (3).mp3", text: "即便不完美也没关系，如今的你就已经足够珍贵。" },
  { file: "audio (4).mp3", text: "休息也是重要的一步，闭上双眼，让心稍作安歇吧。" },
  { file: "audio (5).mp3", text: "希望的光芒总会出现，请在心中保持火焰，向前看。" },
  { file: "audio (6).mp3", text: "珍贵的记忆会在心底静静闪耀。请不要忘记那道光芒。" },
  { file: "audio (7).mp3", text: "你的微笑对我来说也是最大的鼓励。请今天也别忘了微笑。" },
  { file: "audio (8).mp3", text: "如夜空中闪烁的星光，希望的火苗永远在身边。迷失时，请仰望星空。" },
  { file: "audio (9).mp3", text: "当你的声音在心间回响时，也一定能鼓励到他人。请大胆让人听见吧。" },
  { file: "audio (10).mp3", text: "每一笔每一划都寄寓着我的心意，请感受那份温暖。" },
  { file: "audio (11).mp3", text: "海风会将你的心声传得很远，请把思念寄给重要的人。" },
  { file: "audio (12).mp3", text: "在樱花飞舞的季节，誓言更深地刻入心间，请不要忘记那一刻。" },
  { file: "audio (13).mp3", text: "千纸鹤承载着愿望与希望，愿你的心愿也能如愿以偿。" },
  { file: "audio (14).mp3", text: "明天定会迎来新的光芒，愿您的明天充满美好瞬间。" },
  { file: "audio (15).mp3", text: "珍贵的回忆将跨越时光，在心中永不褪色地闪耀。" },
  { file: "audio (16).mp3", text: "当心情疲惫时，深吸一口气。相信您一定能重新站起。" },
  { file: "audio (17).mp3", text: "每一个字都倾注了我的温度，请用心感受它的温暖。" },
  { file: "audio (18).mp3", text: "在星空下许愿，定能传至他人心田。愿您的心声也远扬。" }
];


watch(isVoiceEnabled, (val) => {
  if (isVoiceEnabled) {
    playVoice("welcome");
  }
  localStorage.setItem(STORAGE_VOICE_KEY, JSON.stringify(val));
});

/**
 * 与 API 交互的数据类型，只包含 id、role、text
 */
export interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
}

/**
 * 页面内部展示消息，继承 ChatMsg 并添加时间和 loading 状态
 */
interface UIMessage extends ChatMsg {
  time: string;
  loading?: boolean;
  isEgg?: boolean;
}

const STORAGE_KEY = "violet_chat_history";
const messages = ref<UIMessage[]>([]);
const inputText = ref("");
const sending = ref(false);
const historyRef = ref<HTMLElement | null>(null);

const md = new MarkdownIt({ html: false, linkify: true });
function renderMarkdown(text: string) {
  return md.render(text);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scrollToBottom() {
  if (!historyRef.value) return;
  historyRef.value.scrollTo({
    top: historyRef.value.scrollHeight,
    behavior: "smooth",
  });
}

function addMessage(msg: Omit<UIMessage, "id">) {
  const id = Date.now() + Math.random();
  messages.value.push({ id, ...msg });
}

async function sendMessage() {
  if (!inputText.value.trim() || sending.value) return;

  // 添加用户消息
  addMessage({
    role: "user",
    text: inputText.value.trim(),
    time: formatTime(new Date()),
  });
  const history: ChatMsg[] = messages.value
    .filter(m => !m.isEgg)
    .map(m => ({ id: m.id, role: m.role, text: m.text }));
  const userInput = inputText.value.trim();
  inputText.value = "";
  scrollToBottom();

  // 添加机器人 loading 状态
  addMessage({
    role: "bot",
    text: "",
    time: formatTime(new Date()),
    loading: true,
  });
  sending.value = true;
  nextTick(scrollToBottom);

  try {
    const reply = await sendMessageToYuzuriha(userInput, history);
    const botMsg = messages.value.find((m) => m.loading)!;
    botMsg.text = reply;
    if (Math.random() < 0.3) {
      const egg = encourageEggs[Math.floor(Math.random() * encourageEggs.length)];
      playVoice(egg.file.replace('.mp3', ''));
      addMessage({
        role: "bot",
        text: egg.text,
        time: formatTime(new Date()),
        isEgg: true
      });
    }
  } catch {
    playVoice("error");
    const botMsg = messages.value.find((m) => m.loading)!;
    botMsg.text = "对不起，薇尔莉特暂时无法回应。";
  } finally {
    const botMsg = messages.value.find((m) => m.loading)!;
    botMsg.loading = false;
    sending.value = false;
    nextTick(scrollToBottom);
  }
}

function clearHistory() {
  if (sending.value) return;
  messages.value = [];
  playVoice("clear");
  nextTick(() => {
    addMessage({
      role: "bot",
      text: "您好，我是薇尔莉特，有什么想对我说的吗？",
      time: formatTime(new Date()),
    });
    nextTick(scrollToBottom);
  });
}



// 本地存储: 监听消息改变并保存
watch(
  messages,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
  },
  { deep: true }
);

// 初始化：加载本地历史
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const arr: UIMessage[] = JSON.parse(saved);
      messages.value = arr;
    } catch {
      clearHistory();
    }
  } else {
    clearHistory();
  }
  nextTick(scrollToBottom);
});
</script>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}

.ai-chat-container {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: url("@/assets/textures/violet-bg.png") no-repeat center/cover;
  font-family: "Georgia", serif;
  color: #4a3f55;

  .chat-toolbar {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid #e4d5e8;

    .clear-btn {
      background: #f8f0fc;
      border: 1px solid #d1b8e0;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: #efebf8;
      }

      &:disabled {
        opacity: 0.6;
        cursor: default;
      }
    }
  }

  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(107, 82, 117, 0.5);
      border-radius: 4px;
    }



    .message {
      display: flex;
      align-items: flex-start;
      opacity: 0;
      animation: fadeInUp 0.4s ease forwards;

      &.user {
        justify-content: flex-end;
      }

      &.assistant {
        justify-content: flex-start;
      }

      .avatar {
        width: 50px;
        height: 50px;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }


      .bubble {
        position: relative;
        max-width: 70%;
        padding: 1rem;
        border-radius: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: #faf5ff;
        border: 1px solid #e0c3f0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .sender {
          font-weight: bold;
          color: #6f4e7c;
          font-size: 0.9rem;
        }

        .text {
          line-height: 1.6;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #8a7b8e;

          .typing-indicator {
            display: flex;
            gap: 2px;

            span {
              width: 4px;
              height: 4px;
              background: #6f4e7c;
              border-radius: 50%;
              animation: blink 1s infinite;
            }

            span:nth-child(2) {
              animation-delay: 0.2s;
            }

            span:nth-child(3) {
              animation-delay: 0.4s;
            }
          }
        }
      }

      &.egg .bubble {
        border-color: #ffd700;
        background: #fffbe6;
      }

    }
  }


  .chat-input {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-top: 1px solid #e4d5e8;

    textarea {
      flex: 1;
      resize: none;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-family: inherit;
      background: #fff;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
      font-size: 1rem;
      line-height: 1.4;
      height: 3.5rem;

      &::placeholder {
        color: #b39cbc;
      }
    }

    button {
      margin-left: 0.75rem;
      background: linear-gradient(135deg, #a78bc7, #cbb4d4);
      color: #fff;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: default;
      }
    }
  }
}
</style>
