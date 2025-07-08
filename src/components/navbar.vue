<template>
  <nav class="navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="navbar__container">
      <div class="navbar__logo">
        薇尔莉特电子设定集
      </div>
      <!-- 随机播放控件（在 logo 右侧） -->
      <div class="navbar__player">
        <div class="player__info" v-if="currentSongName">
          <span class="player__song">{{ currentSongName }}</span>
        </div>
        <button @click="togglePlay" class="player__btn">
          {{ playing ? '⏸️' : '▶️' }}
        </button>
        <button @click="playRandom" class="player__btn">🔀</button>
      </div>
      <button class="navbar__toggle" @click="open = !open">
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
      </button>
      <ul class="navbar__links" :class="{ 'is-open': open }">
        <li><router-link to="/" exact @click="open = !open">首页</router-link></li>
        <li><router-link to="/profile" @click="open = !open">角色设定</router-link></li>
        <li><router-link to="/experience" @click="open = !open">人物经历</router-link></li>
        <li><router-link to="/gallery" @click="open = !open">画廊</router-link></li>
        <li><router-link to="/message-board" @click="open = !open">留言板</router-link></li>
        <li><router-link to="/chat" @click="open = !open">与薇对话</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const open = ref(false);
const isScrolled = ref(false);
const playing = ref(false);
const currentSong = ref<string | null>(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 音频播放器
const audio = new Audio();
audio.preload = 'auto';

// 从 public/songs 目录下的文件名列表（需在构建时或通过接口获取）
const songList = [
  '邓壬鑫 - 这一秒只想在爱里沉溺.mp3',
  '結城アイラ - Believe in.mp3',
  '茅原実里 - エイミー.mp3',
  '茅原実里 - みちしるべ.mp3',
  '米津玄師 - 優しい人.mp3',
  '秋山裕和,むにょっ - 空虚的祈祷.mp3',
  '三亩地 - 城南花已开.mp3',
  'Aimer - Refrain.mp3',
  'Dawid Podsiadło - Let You Down.mp3',
  'DJ Okawari - Luv Letter.mp3',
  'Haru - Call of Silence.mp3',
  'Isaac Shepard - Felicity.mp3',
  'Kokoro-Igusa - Letter.mp3',
  'Noriチャ - Sincerely（钢琴版）.mp3',
  'Peak A Soul+ - 心揺.mp3',
  'sledg3r - Red Moon (2024 Edit).mp3',
  'TRUE - Sincerely.mp3',
  'TRUE - WILL.mp3',
  // ……
].map(name => `/songs/${name}`);

// 随机播放

function playRandom() {
  const idx = Math.floor(Math.random() * songList.length);
  currentSong.value = songList[idx];
  
  audio.src = currentSong.value;
  audio.play();
  playing.value = true;
}

// 播放/暂停 切换
function togglePlay() {
  if (!currentSong.value) {
    playRandom();
  } else if (playing.value) {
    audio.pause();
    playing.value = false;
  } else {
    audio.play();
    playing.value = true;
  }
}

// 监听音频播放结束，自动下一曲
audio.addEventListener('ended', () => {
  playRandom();
});



const currentSongName = computed(() => {
  if (!currentSong.value) return '';
  const parts = currentSong.value.split('/');
  return parts[parts.length - 1];
});
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(88, 52, 142, 0.8);
  backdrop-filter: blur(6px);
  transition: background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: none;

  &.is-scrolled {
    background: rgba(88, 52, 142, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  }

  /* 随机播放器样式 */
  &__player {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 1.5rem;
    backdrop-filter: blur(4px);

    .player__info {
      margin-right: 0.5rem;

      .player__song {
        color: #FFFFFF;
        font-size: 0.875rem;
        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .player__btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      margin: 0 0.25rem;
      cursor: pointer;
      color: #FFFFFF;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  &__toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 18px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &-line {
      width: 100%;
      height: 2px;
      background: #FFFFFF;
      transition: transform 0.3s;
    }
  }

  &__links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-left: 2rem;

      a {
        position: relative;
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        font-weight: 500;
        text-decoration: none;
        padding: 0.25rem 0;
        transition: color 0.3s;

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #FFFFFF;
          transition: width 0.3s;
        }

        &:hover {
          color: #FFFFFF;

          &::after {
            width: 100%;
          }
        }

        &.router-link-active {
          color: #FFFFFF;

          &::after {
            width: 100%;
          }
        }
      }
    }

    /* 小屏幕折叠菜单 */
    @media (max-width: 768px) {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(88, 52, 142, 0.95);
      flex-direction: column;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;

      &.is-open {
        max-height: 300px;

        li {
          margin: 1rem 0;
          text-align: center;
        }
      }

      li {
        margin: 1rem 0;
        text-align: center;
      }
    }
  }

  /* 小屏幕展示汉堡 */
  @media (max-width: 768px) {
    &__toggle {
      display: flex;
    }

    .navbar__logo {
      display: none;
    }
  }
}
</style>
