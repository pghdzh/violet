<template>
    <div class="violet-timeline">

        <ul class="timeline">
            <li v-for="(e, i) in events" :key="i" :class="['item', i % 2 === 0 ? 'item--right' : 'item--left']">
                <div class="dot"></div>
                <div class="content">
                    <div class="date">{{ e.title }}</div>
                    <p class="desc">{{ e.desc }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
interface Event { title: string; desc: string; }


const events: Event[] = [
    {
        title: '第1话 「“我爱你”与自动手记人偶」',
        desc: '在战后床上醒来，双臂被义肢替换，无法理解少佐“我爱你”的含义，初识“自动手记人偶”工作。'
    },
    {
        title: '第2话 「回不来了」',
        desc: '与新人艾丽卡共事后，坚定在写信中“将每个人的心声音带达”的决心。'
    },
    {
        title: '第3话 「希望你成为出色的自动手记人偶」',
        desc: '在学校练习代写，首次将露库莉娅兄妹的真情实感准确写出，迈出人偶成长关键一步。'
    },
    {
        title: '第4话 「你将不再是道具 而是成为人如其名的人」',
        desc: '帮助爱丽丝向宾客、家人传达真挚歉意，展现写信能传递真实情感的力量。'
    },
    {
        title: '第5话 「写替人结缘的书信吗？」',
        desc: '为王国公主代写婚书，却让她用真心之笔写信，促成了她与王子的真诚誓言。'
    },
    {
        title: '第6话 「在某处的星空下」',
        desc: '在沙哈尔天文台，陪伴少年里昂观测阿里彗星，相互理解孤独与思念。'
    },
    {
        title: '第7话 「　　　　　　　　」',
        desc: '以“落叶承载记忆”飞渡湖面，让失去女儿的戏曲家重拾希望，深刻共鸣逝者与生者之情。'
    },
    {
        title: '第8话 「薇尔莉特·伊芙加登」',
        desc: '重温与少佐相遇初时的训练与战争画面，揭示她被命名为“薇尔莉特”的缘由。'
    },
    {
        title: '第9话 「薇尔莉特·伊芙加登」',
        desc: '在因坦斯圣地的决战中，护送基尔伯特逃脱被击中失臂，目睹少佐的“我爱你”与离别。'
    },
    {
        title: '第10话 「心爱的人 永远守护着你」',
        desc: '为病重母亲代写信件，被误解却温柔回应，送达战地士兵遗书并收集生与死的思考。'
    },
    {
        title: '第11话 「再也不想让任何人死去」',
        desc: '深入内战前线，救助士兵艾丹，替他写下“我爱你”与感谢，决心以笔代剑拯救更多生命。'
    },
    {
        title: '第12话 「自动手记人偶与‘爱’」',
        desc: '在和平象征的纵贯铁路列车上，拒绝被利用为武器，凭信念与行动赢得敌对者信任。'
    },
    {
        title: '第13话 「自动手记人偶与‘爱’」',
        desc: '在和平签字仪式上首次为自己写信，收到少佐母亲的鼓励，“爱”与责任最终融入灵魂。'
    },
    {
        title: '外传 剧场版「永恒与自动手记人偶」 (2019/09/06)',
        desc: '薇尔莉特辅导名媛伊莎贝拉·约克，揭示她与私生妹泰勒的身世，并在三年后助力泰勒成为信使，用亲手写的信传递爱与希望。'
    },
    {
        title: '正篇 剧场版「Violet Evergarden」 (2020/09/18)',
        desc: '薇尔莉特代笔病弱少年尤利乌斯遗书，赴艾卡特岛寻访生还的吉尔伯特少佐，信中重燃两人羁绊，最终辞职与少佐隐居岛上。'
    }
];

// 视图滚动时触发的动画
onMounted(() => {
    nextTick(() => {
        const items = document.querySelectorAll<HTMLElement>('.item');
        const opts = { threshold: 0.2 };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, opts);
        items.forEach(item => io.observe(item));
    });
});
</script>

<style lang="scss" scoped>
.violet-timeline {
    background: linear-gradient(#fffefc, #f3eff7);
    padding: 2rem;
    border-radius: 8px;
    font-family: 'Georgia', serif;
    color: #333;

    .timeline {
        position: relative;
        padding: 0;
        margin: 0;
        list-style: none;

        &:before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #cbb4d4;
            transform: translateX(-50%);
        }

        .item {
            position: relative;
            width: 50%;
            padding: 1rem 2rem;
            box-sizing: border-box;

            opacity: 0;
            transform: translateY(20px);
            /* 先定义动画时长和延迟由 JS 或 CSS 变量控制 */
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;

            &--left {
                left: 0;
                text-align: right;

                .content {
                    margin-right: 2rem;
                }

                .dot {
                    right: -6px;
                }
            }

            &--right {
                left: 50%;

                .content {
                    margin-left: 2rem;
                }

                .dot {
                    left: -6px;
                }
            }

            .dot {
                position: absolute;
                top: 1.5rem;
                width: 12px;
                height: 12px;
                background: #6f4e7c;
                border-radius: 50%;
            }

            .content {
                .date {
                    font-weight: bold;
                    color: #6f4e7c;
                    margin-bottom: 0.3rem;
                }

                .desc {
                    line-height: 1.6;
                }
            }
        }

        .visible {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 移动端（小于768px）时改回单列居中 */
    @media (max-width: 767px) {
        .timeline {
            &:before {
                left: 1rem;
            }

            .item {
                width: 100% !important;
                left: 0 !important;
                padding-left: 2.5rem;
                text-align: left !important;

                .content {
                    margin: 0 0 0 1.5rem !important;
                }

                .dot {
                    left: 0 !important;
                    right: auto !important;
                }
            }
        }
    }
}
</style>
