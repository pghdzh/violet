<!-- VioletAIChat.vue -->
<template>
  <div class="ai-chat-container">
    <!-- 聊天内容区 -->
    <div class="chat-history" ref="historyRef">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]"
        @animationend="onMessageAnimationEnd(idx)">
        <div class="avatar" v-if="msg.role === 'assistant'">
          <img src="@/assets/images1/4.png" alt="薇尔莉特" />
        </div>
        <div class="bubble">
          <div class="sender">{{ msg.role === 'user' ? '你' : '薇尔莉特' }}</div>
          <div class="text" v-html="renderMarkdown(msg.text)"></div>
          <div class="meta">
            <span class="time">{{ msg.time }}</span>
            <span v-if="msg.role === 'assistant' && msg.loading" class="typing-indicator">
              <span></span><span></span><span></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input">
      <textarea v-model="inputText" placeholder="请写下你的思绪..." @keydown.enter.exact.prevent="sendMessage"></textarea>
      <button :disabled="sending" @click="sendMessage">
        <template v-if="sending">发送中...</template>
        <template v-else>✉️ 发送</template>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import { sendMessageToChatGPT } from '@/api/opaiApi'

interface Msg { role: 'user' | 'assistant'; text: string; time: string; loading?: boolean }
const messages = ref<Msg[]>([])
const inputText = ref('')
const historyRef = ref<HTMLElement | null>(null)
const sending = ref(false)

const md = new MarkdownIt({ html: false, linkify: true })
function renderMarkdown(text: string) { return md.render(text) }

async function sendMessage() {
  if (!inputText.value.trim() || sending.value) return
  // 用户消息
  messages.value.push({ role: 'user', text: inputText.value, time: formatTime(new Date()) })
  const userInput = inputText.value
  inputText.value = ''
  scrollToBottom()

  // 助手 loading
  const idx = messages.value.length
  messages.value.push({ role: 'assistant', text: '', time: formatTime(new Date()), loading: true })
  sending.value = true
  nextTick(scrollToBottom)

  try {
    const reply = await sendMessageToChatGPT(userInput, messages.value)
    // 更新 loading 文本
    messages.value[idx].text = reply
  } catch {
    messages.value[idx].text = '对不起，薇尔莉特暂时无法回应。'
  } finally {
    messages.value[idx].loading = false
    sending.value = false
    nextTick(scrollToBottom)
  }
}

function scrollToBottom() {
  if (!historyRef.value) return
  historyRef.value.scrollTo({ top: historyRef.value.scrollHeight, behavior: 'smooth' })
}

function onMessageAnimationEnd(idx: number) {
  // 可触发语音或其他动画后事件
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  messages.value.push({ role: 'assistant', text: '您好，我是薇尔莉特，有什么想对我说的吗？', time: formatTime(new Date()), loading: false })
  nextTick(scrollToBottom)
})
</script>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px)
  }

  to {
    opacity: 1;
    transform: translateY(0)
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: .2
  }

  50% {
    opacity: 1
  }
}

.ai-chat-container {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: url('@/assets/textures/violet-bg.png') no-repeat;
  font-family: 'Georgia', serif;
  color: #4a3f55;

  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    backdrop-filter: blur(4px);
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

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
        width: 60px;
        height: 60px;
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
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        background: #f3eff7;
        border: 1px solid #cbb4d4;
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
    background: rgba(255, 255, 255, 0.85);
    border-top: 1px solid #e4d5e8;

    textarea {
      flex: 1;
      resize: none;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-family: inherit;
      background: #fffefc;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
      font-size: 1rem;
      line-height: 1.4;
      height: 3rem;

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

      &:hover {
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