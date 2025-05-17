<template>
    <div class="character-page">
        <header class="header">
            <img src="@/assets/images1/4.png" alt="Violet Evergarden" class="header-bg" />
            <div class="overlay">
                <h1>薇尔莉特·伊芙加登</h1>
                <p>Violet Evergarden</p>
            </div>
        </header>

        <main class="content">
            <!-- 角色简介 -->
            <section class="profile">
                <div class="portrait">
                    <img src="@/assets/images1/1.png" alt="Violet Portrait" />
                </div>
                <div class="info">
                    <h2>角色简介</h2>
                    <p>
                        薇尔莉特·伊芙加登曾是一名战争兵器般的少女，战争结束后成为自动手记人偶，踏上寻找“爱”的意义的旅程。
                    </p>
                </div>
            </section>

            <!-- 背景与能力设定 -->
            <section class="settings">
                <h3>背景与能力设定</h3>
                <ul class="details">
                    <li><strong>出身背景：</strong>幼年时期被当作“兵器”抚养，缺乏正常的情感教育。</li>
                    <li><strong>战斗能力：</strong>拥有极强的近战格斗技巧与作战反应，曾独自歼灭一整支小队。</li>
                    <li><strong>义肢设定：</strong>双手为高度精密的金属义肢，可进行打字、写作等精细操作。</li>
                    <li><strong>情感成长：</strong>从最初的冷漠无感，到渐渐理解人类情感，尤其对“爱”有深刻探索。</li>
                    <li><strong>关键词：</strong>爱、战争的残酷、人性的温柔、自我认同、信件、治愈。</li>
                </ul>
            </section>

            <!-- 经典语录与心境片段 -->
            <section class="quotes">
                <h3>经典语录与心境片段</h3>
                <blockquote>
                    “我从少佐那里接受的命令是——活下去，然后从此去寻找‘我爱你’的含义。”
                </blockquote>
                <blockquote>
                    “即使我的双手不再完整，我依然可以将你的情感写进信里。”
                </blockquote>
                <blockquote>
                    “我现在能够理解，信件不仅仅是传递文字，它更是一份温柔的延续。”
                </blockquote>
            </section>

            <!-- 设定补充档案 -->
            <section class="profile-table">
                <h3>设定补充档案</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>姓名</th>
                            <td>薇尔莉特·伊芙加登（Violet Evergarden）</td>
                        </tr>
                        <tr>
                            <th>年龄</th>
                            <td>14～18（设定不明，战后约17岁）</td>
                        </tr>
                        <tr>
                            <th>身高</th>
                            <td>161 cm</td>
                        </tr>
                        <tr>
                            <th>配音</th>
                            <td>石川由依</td>
                        </tr>
                        <tr>
                            <th>初登场</th>
                            <td>《Violet Evergarden》TV动画第1集</td>
                        </tr>
                        <tr>
                            <th>所属机构</th>
                            <td>CH邮政公司</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
        <!-- 页脚波浪 -->
        <footer class="wave-footer">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
        </footer>
    </div>
</template>

<script setup lang="ts">
// 纯静态展示，无额外逻辑
</script>

<style lang="scss" scoped>
@keyframes glow {

    0%,
    100% {
        text-shadow: 0 0 10px #ffb3f3, 0 0 20px #ffb3f3;
    }

    50% {
        text-shadow: 0 0 20px #ffd6ff, 0 0 40px #ffccff;
    }
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.character-page {
    font-family: "Noto Serif SC", serif;
    color: #fdfdfd;
    background: linear-gradient(270deg,
            #1f1c2c,
            #928dab,
            #4b3b63,
            #1f1c2c);
    background-size: 800% 800%;
    animation: gradientShift 40s ease infinite;
    min-height: 100vh;

    .header {
        position: relative;
        height: 320px;

        .header-bg {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.6);
        }

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(31, 28, 44, 0.7), rgba(31, 28, 44, 0.1));
            z-index: 1;
        }

        .overlay {
            position: absolute;
            inset: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;

            h1 {
                font-size: 3rem;
                margin: 0;
                color: #ffecf6;
                animation: glow 4s ease-in-out infinite;
            }

            p {
                font-size: 1.4rem;
                margin-top: 0.5rem;
                color: #fceaff;
            }
        }
    }

    .content {
        max-width: 1000px;
        margin: 2.5rem auto;
        padding: 0 1.5rem;

        /* 通用卡片风格 */
        section {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
            padding: 2rem;
            margin-top: 2.5rem;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-4px);
            }

            h2,
            h3 {
                color: #ffdaf0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
            }
        }

        /* Profile 专用 */
        .profile {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(12px);

            .portrait {
                flex: 1 1 250px;
                max-width: 280px;
                align-self: center;

                img {
                    width: 100%;
                    border-radius: 16px;
                    border: 1px solid #ffffff30;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
                }
            }

            .info {
                flex: 2;
                display: flex;
                flex-direction: column;
                justify-content: center;

                h2 {
                    font-size: 2rem;
                }

                p {
                    line-height: 1.8;
                    font-size: 1.1rem;
                }
            }
        }

        /* 其他模块细节 */
        .settings {
            .details {
                list-style: none;
                padding-left: 0;

                li {
                    margin-bottom: 1rem;
                    line-height: 1.6;

                    strong {
                        color: #ffccff;
                        font-weight: 600;
                    }
                }
            }
        }

        .quotes {
            border-left: 4px solid #ffccff;

            blockquote {
                margin: 1rem 0;
                font-style: italic;
                color: #f5ddff;
                padding-left: 1rem;
                border-left: 3px solid #d8aaff;
            }
        }

        .profile-table {
            table {
                width: 100%;
                border-collapse: collapse;
                color: #fff;

                th,
                td {
                    text-align: left;
                    padding: 0.6rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }

                th {
                    width: 30%;
                    color: #ffccff;
                }
            }
        }
    }

    .wave-footer {
        position: relative;
        width: 100%;
        height: 100px;
        margin-top: 3rem;
        overflow: hidden;

        /* 通用 SVG 背景 */
        .wave {
            position: absolute;
            bottom: 0;
            width: 200%;
            height: 100px;
            background-repeat: repeat-x;
            background-size: 50% 100px;
        }

        /* 浅色前景波 */
        .wave1 {
            background-image: url("data:image/svg+xml,%3Csvg width='1600' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffc9f1' fill-opacity='0.4' d='M0 30 Q200 80 400 30 T800 30 T1200 30 T1600 30 V100 H0 Z'/%3E%3C/svg%3E");
            animation: waveMove 6s linear infinite;
            opacity: 0.6;
        }

        /* 深色背景波 */
        .wave2 {
            background-image: url("data:image/svg+xml,%3Csvg width='1600' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236d4b8c' fill-opacity='0.6' d='M0 40 Q200 10 400 40 T800 40 T1200 40 T1600 40 V100 H0 Z'/%3E%3C/svg%3E");
            animation: waveMove 10s linear infinite reverse;
            opacity: 0.8;
        }

        /* 波浪水平移动动画 */
        @keyframes waveMove {
            from {
                transform: translateX(0);
            }

            to {
                transform: translateX(-50%);
            }
        }
    }



}
</style>
