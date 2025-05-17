<template>
  <div class="ai-chat-container">
    <div class="chat-toolbar">
      <button class="clear-btn" @click="clearHistory" :disabled="sending">
        🗑️ 清空记录
      </button>
    </div>

    <div class="chat-history" ref="historyRef">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.role === 'user' ? 'user' : 'assistant']"
        @animationend="onMessageAnimationEnd(msg.id)"
      >
        <div class="avatar" v-if="msg.role === 'bot'">
          <img src="@/assets/images3/3 (3).png" alt="薇尔莉特" />
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
      <textarea
        v-model="inputText"
        placeholder="请写下你的思绪..."
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
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
import { sendMessageToChatGPT } from "@/api/opaiApi";

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
  const history: ChatMsg[] = messages.value.map((m) => ({
    id: m.id,
    role: m.role,
    text: m.text,
  }));
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
    const reply = await sendMessageToChatGPT(userInput, history);
    const botMsg = messages.value.find((m) => m.loading)!;
    botMsg.text = reply;
  } catch {
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
  nextTick(() => {
    addMessage({
      role: "bot",
      text: "您好，我是薇尔莉特，有什么想对我说的吗？",
      time: formatTime(new Date()),
    });
    nextTick(scrollToBottom);
  });
}

function onMessageAnimationEnd(id: number) {
  // 可用于触发动画后逻辑
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
    padding: 1rem 4rem;
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
