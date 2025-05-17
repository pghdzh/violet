<template>
  <div
    class="violet-board"
    @scroll.passive="handleScroll"
    ref="scrollContainer"
  >
    <h2 class="title">永恒花园留言板</h2>

    <ul class="messages">
      <li
        v-for="(msg, idx) in messages"
        :key="msg.id || idx"
        class="message-card"
      >
        <div class="header">
          <span class="author">{{ msg.name }}</span>
          <span class="time">{{ msg.time }}</span>
        </div>
        <p class="content">{{ msg.content }}</p>
      </li>
      <li v-if="!loading && messages.length === 0" class="empty">
        暂时还没有留言，写下你的心声吧～
      </li>
      <li v-if="loading" class="empty">加载中…</li>
    </ul>

    <div class="input-area">
      <input
        v-model="newAuthor"
        type="text"
        placeholder="您的名字"
        class="input-author"
      />
      <textarea
        v-model="newContent"
        placeholder="写下你的留言……"
        class="input-content"
      />
      <button @click="postMessage" :disabled="posting" class="btn-post">
        {{ posting ? "发布中…" : "发布留言" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getMessageList, createMessage } from "@/api/modules/message";

interface Message {
  id?: number;
  name: string;
  content: string;
  time: string;
}

const messages = ref<Message[]>([]);
const page = ref(1);
const pageSize = 20;
const total = ref(0);
const loading = ref(false);
const posting = ref(false);
const newAuthor = ref("");
const newContent = ref("");
const scrollContainer = ref<HTMLElement | null>(null);
const finished = ref(false);

async function fetchMessages() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    const res = await getMessageList({ page: page.value, pageSize });
    total.value = res.pagination.total;
    const list = res.data;
    const formatted = list.map((item: any) => ({
      id: item.id,
      name: item.name,
      content: item.content,
      time: new Date(item.created_at).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    messages.value.push(...formatted);

    if (messages.value.length >= total.value) finished.value = true;
    page.value++;
  } catch (err) {
    console.error(err);
    alert("留言加载失败，请稍后再试");
  } finally {
    loading.value = false;
  }
}

function handleScroll() {
  const container = scrollContainer.value;
  if (!container || loading.value || finished.value) return;

  const scrollThreshold = 100; // 离底部小于 100px 时加载
  if (
    container.scrollHeight - container.scrollTop - container.clientHeight <
    scrollThreshold
  ) {
    fetchMessages();
  }
}

async function postMessage() {
  if (!newAuthor.value.trim() || !newContent.value.trim()) {
    alert("请填写名字和留言内容 😊");
    return;
  }
  posting.value = true;
  try {
    const payload = {
      name: newAuthor.value.trim(),
      content: newContent.value.trim(),
    };
    await createMessage(payload);
    // 清空输入框
    newAuthor.value = "";
    newContent.value = "";
    // 重置列表
    page.value = 1;
    messages.value = [];
    finished.value = false;
    await fetchMessages();
  } catch (err) {
    console.error(err);
    alert("发布失败，请稍后再试");
  } finally {
    posting.value = false;
  }
}

onMounted(() => {
  fetchMessages();
});
</script>

<style lang="scss" scoped>
.violet-board {
  display: flex;
  overflow-y: auto; // 开启滚动
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 64px);
  padding: 2rem;
  background: rgba(255, 250, 248, 0.8);
  border: 1px solid #e4d5e8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: "Georgia", serif;
  color: #4a3f55;

  .title {
    text-align: center;
    font-size: 1.75rem;
    color: #6f4e7c;
    margin-bottom: 1.5rem;
    position: relative;
    &::before,
    &::after {
      content: "";
      display: block;
      width: 60px;
      height: 2px;
      background: #cbb4d4;
      position: absolute;
      top: 50%;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }

  .messages {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    overflow-y: auto;

    .message-card {
      background: rgba(223, 213, 226, 0.6);
      border: 1px solid #d8c6d9;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      backdrop-filter: blur(4px);

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        .author {
          font-weight: bold;
          color: #6f4e7c;
        }
        .time {
          color: #8a7b8e;
        }
      }

      .content {
        line-height: 1.6;
      }
    }

    .empty {
      text-align: center;
      color: #8a7b8e;
      font-style: italic;
    }
  }

  .input-area {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .input-author,
    .input-content {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e4d5e8;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      color: #4a3f55;
      &::placeholder {
        color: #b39cbc;
      }
    }

    .input-content {
      min-height: 80px;
      resize: vertical;
    }

    .btn-post {
      align-self: flex-end;
      padding: 0.6rem 1.2rem;
      background: #cbb4d4;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      color: #fff;
      cursor: pointer;
      transition: background 0.3s ease;
      &:hover {
        background: #b79ac0;
      }
    }
  }
}
</style>
