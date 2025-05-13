<template>
    <section class="home">
        <canvas ref="canvasEl" class="rose-canvas"></canvas>
        <div class="home__intro">
            <div class="decor-line"></div>
            <h1 class="title">欢迎来到薇尔莉特的世界</h1>
            <div class="decor-line"></div>
            <p class="subtitle">“我想知道‘我爱你’的含义。”</p>
            <div class="home__actions">
                <button class="btn btn--primary" @click="goToProfile">
                    开始探索
                </button>
            </div>
        </div>
        <div class="home__letter">
            <div class="envelope">
                <div class="seal"></div>
            </div>
            <transition name="fade-letter" mode="out-in">
                <div class="letter" key="letter">
                    <p>亲爱的读者，</p>
                    <p>在这片文字与色彩交织的天地里，我将倾诉——</p>
                    <em>“我爱你”，</em>
                    <p>——这句话背后的万千情感。</p>
                </div>
            </transition>
        </div>
    </section>
    <!-- 页脚波浪 -->
    <footer class="footer-wave-3">
        <svg class="wave wave1" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="waveGradViolet1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#d8c9f3" />
                    <stop offset="100%" stop-color="#a894d6" />
                </linearGradient>
            </defs>
            <path d="M0,40 C300,140 900,-20 1200,60 L1200,100 L0,100 Z" fill="url(#waveGradViolet1)" />
        </svg>
        <svg class="wave wave2" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 C400,0 800,150 1200,50 L1200,100 L0,100 Z" fill="rgba(197,174,229,0.5)" />
        </svg>
        <svg class="wave wave3" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,30 C200,80 1000,20 1200,70 L1200,100 L0,100 Z" fill="rgba(216,201,243,0.3)" />
        </svg>
    </footer>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue'
import violet from '@/assets/violet.png'

const router = useRouter();

function goToProfile() {
    router.push('/profile');
}

const canvasEl = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D
let animationId: number
let lastTime = 0
let elapsed = 0

interface Rose {
    baseX: number
    y: number
    size: number
    speed: number
    swayAmp: number
    swayFreq: number
    phase: number
    angle: number
    angularSpeed: number
}

const roses: Rose[] = []
const ROSE_COUNT_DESKTOP = 20
const ROSE_COUNT_MOBILE = 8
const ROSE_IMG = new Image()
ROSE_IMG.src = violet

function initRoses(count: number) {
    roses.length = 0
    const canvas = canvasEl.value!
    const w = canvas.width / (window.devicePixelRatio || 1)
    const h = canvas.height / (window.devicePixelRatio || 1)

    for (let i = 0; i < count; i++) {
        const baseX = Math.random() * w
        roses.push({
            baseX,
            y: Math.random() * -h,
            size: 30 + Math.random() * 40,
            speed: 30 + Math.random() * 70,
            swayAmp: 20 + Math.random() * 20,
            swayFreq: 0.5 + Math.random() * 1,
            phase: Math.random() * Math.PI * 2,
            angle: Math.random() * Math.PI * 2,
            angularSpeed: (Math.random() - 0.5) * 2
        })
    }
    elapsed = 0
}

let resizeTimeout: number
function resizeCanvas() {
    window.clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
        cancelAnimationFrame(animationId)
        const canvas = canvasEl.value!
        const parent = canvas.parentElement!
        const dpr = window.devicePixelRatio || 1
        const w = parent.clientWidth
        const h = parent.clientHeight

        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        canvas.width = w * dpr
        canvas.height = h * dpr

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)

        const isMobile = w < 768
        initRoses(isMobile ? ROSE_COUNT_MOBILE : ROSE_COUNT_DESKTOP)
        lastTime = 0
        animationId = requestAnimationFrame(tick)
    }, 200)
}

function tick(now: number) {
    if (!lastTime) lastTime = now
    const dt = (now - lastTime) / 1000
    lastTime = now
    elapsed += dt

    const canvas = canvasEl.value!
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    ctx.clearRect(0, 0, w, h)

    roses.forEach(r => {
        r.y += r.speed * dt
        const sway = r.swayAmp * Math.sin(r.phase + elapsed * r.swayFreq)
        const x = r.baseX + sway
        r.angle += r.angularSpeed * dt

        if (r.y > h + r.size) {
            r.y = -r.size
            r.baseX = Math.random() * w
            r.phase = Math.random() * Math.PI * 2
        }

        if (x > w + r.size || x < -r.size) return


        // 计算透明度
        const alpha = 1 - (r.y / h) * 0.5;
        // 限制 alpha 在 [0,1] 之间（可选）
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        ctx.save()
        ctx.globalAlpha = clampedAlpha;
        ctx.translate(x, r.y)
        ctx.rotate(r.angle)
        ctx.drawImage(ROSE_IMG, -r.size / 2, -r.size / 2, r.size, r.size)
        ctx.restore()
    })

    animationId = requestAnimationFrame(tick)
}

onMounted(() => {
    const canvas = canvasEl.value!
    ctx = canvas.getContext('2d')!

    ROSE_IMG.onload = () => {
        resizeCanvas()
    }
    window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resizeCanvas)
})

</script>

<style lang="scss" scoped>
@keyframes seal-bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-6px);
    }

    60% {
        transform: translateY(-3px);
    }
}

@keyframes envelope-sway {

    0%,
    100% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(1deg);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.home {
   
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-start;
    padding: 4rem 2rem;
    height: calc(100vh - 48px);
    background:
        linear-gradient(135deg, rgba(255, 250, 245, .8), rgba(246, 239, 249, .8)),
        url('@/assets/textures/parchment.webp') center/cover;

    .rose-canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
    }

    &__intro {
        flex: 1 1 360px;
        max-width: 520px;
        text-align: center;
        margin-bottom: 3rem;
        animation: fade-in 1s ease-out;



        .decor-line {
            width: 80px;
            height: 1px;
            margin: .75rem auto;
            background: #C8B7D4;
            position: relative;

            &::before,
            &::after {
                content: '•';
                position: absolute;
                top: -6px;
                font-size: .75rem;
                color: #C8B7D4;
            }

            &::before {
                left: -12px;
            }

            &::after {
                right: -12px;
            }
        }

        .title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: #4A2961;
            line-height: 1.2;
            margin: 0;
        }

        .subtitle {
            font-family: 'Dancing Script', cursive;
            font-size: 1.25rem;
            color: #6D4875;
            margin: 1.5rem 0;
        }

        .home__actions {
            display: flex;
            justify-content: center;
            gap: 1.25rem;

            .btn {
                padding: .75rem 2rem;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
                transition:
                    transform .2s ease,
                    box-shadow .2s ease,
                    background .3s ease;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            }

            .btn--primary {
                background: linear-gradient(45deg, #7E59B0, #AC7FD2);
                // 建议增强边框或内阴影：
                box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 2px 8px rgba(126, 89, 176, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.4);
                backdrop-filter: blur(2px);
                font-family: "Orbitron", "Montserrat", sans-serif;
                font-weight: 600;
                font-size: 1.05rem;
                color: #ffffff;
                letter-spacing: 0.5px;
                text-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
            }

        }
    }

    &__letter {
        flex: 1 1 360px;
        max-width: 480px;
        display: flex;
        align-items: flex-start;
        animation: fade-in 1.2s ease-out;

        .envelope {
            width: 120px;
            height: 85px;
            background: linear-gradient(145deg, #fff, #f5f2f9);
            border: 2px solid #E0D5EB;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05), inset 0 0 4px rgba(200, 183, 212, 0.2);

            position: relative;
            margin-right: 2rem;

            animation: envelope-sway 3s ease-in-out infinite;

            .seal {
                width: 30px;
                height: 30px;
                background: #AC7FD2;
                border-radius: 50%;
                position: absolute;
                bottom: 12px;
                right: 12px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                animation: seal-bounce 4s ease-in-out infinite 1s;
            }
        }

        .letter {
            background: #FFF;
            padding: 1.5rem 2rem;
            border: 2px solid #D8C9E3;
            font-family: 'Kaushan Script', cursive;
            color: #4A2961;
            line-height: 1.8;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            position: relative;

            p {
                margin: 0 0 .75rem;
            }

            em {
                display: block;
                margin: 1rem 0;
                font-size: 1.125rem;
                font-weight: bold;
            }
        }

        .letter::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10%;
            height: 80%;
            width: 4px;
            background: linear-gradient(to bottom, #d8c9f3, #c8b7d4);
        }
    }

    @media (max-width: 768px) {

        &__intro,
        &__letter {
            max-width: 100%;
            margin-bottom: 2.5rem;
        }

        &__letter {
            flex-direction: column;
            align-items: center;

            .envelope {
                margin: 0 0 1.5rem;
            }
        }
    }
}



/* 信纸淡入过渡 */
.fade-letter-enter-active,
.fade-letter-leave-active {
    transition: opacity .8s ease, transform .8s ease;
}

.fade-letter-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-letter-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.footer-wave-3 {
    position: relative;
    width: 100%;
    height: 120px;
    margin-top: -120px;
    overflow: hidden;

    .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: 100%;
        transform: translateX(0);
        opacity: 0.9;
    }

    .wave1 {
        animation: waveMove 18s linear infinite;
        z-index: 1;
    }

    .wave2 {
        animation: waveMove 24s linear infinite;
        z-index: 2;
        animation-delay: -6s;
    }

    .wave3 {
        animation: waveMove 30s linear infinite;
        z-index: 3;
        animation-delay: -12s;
    }

    @keyframes waveMove {
        0% {
            transform: translateX(0);
        }

        50% {
            transform: translateX(-25%);
        }

        100% {
            transform: translateX(-50%);
        }
    }
}
</style>
