<template>
    <div class="main">
        <canvas ref="canvas" id="snow""></canvas>

        <div class="controller">
            <div class="item">
                <span>背景</span>
                <input type="text" v-model="bgColor">
            </div>
            <div class="item">
                <span>数量</span>
                <input type="text" v-model="nums">
            </div>
            <div class="item">
                <span>半径</span>
                <input type="text" v-model="radius">
            </div>
            <div class="download" @click="exportCanvasAsPNG('snow', 'snow')">保存截图</div>
        </div>
    </div>
</template>

<script>
    import 'raf.js';
    import Ctx from 'src/assets/ctx';

    export default {
        data () {
            return {
                particles: [],
                nums: 100,
                angle: 0,
                bgColor: '#6b92b9',
                radius: 5,
                raf: null,
                reStart: false
            };
        },
        computed: {
            ctx () {
                return Ctx(this.$refs.canvas, '2d');
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.init();
            });
        },
        watch: {
            radius () {
                this.particles = [];
                this.pushParticle();
            },
            nums () {
                this.particles = [];
                this.pushParticle();
            }
        },
        methods: {
            init () {
                this.resetSize();
                this.pushParticle();
                requestAnimationFrame(this.drawSnow);
                window.addEventListener('resize', this.resetSize);
            },
            resetSize () {
                let winWidth = this.winWidth = window.innerWidth;
                let winHeight = this.winHeight = window.innerHeight;
                this.$refs.canvas.width = winWidth;
                this.$refs.canvas.height = winHeight;
            },
            pushParticle () {
                for (let i = 0; i < this.nums; i++) {
                    this.particles.push({
                        x: Math.random() * this.winWidth,
                        y: Math.random() * this.winHeight,
                        r: Math.random() * this.radius,
                        d: Math.random() * this.nums
                    });
                }
            },
            drawSnow () {
                let ctx = this.ctx;
                // 清除画布
                ctx.clearRect(0, 0, this.winWidth, this.winHeight);

                // 绘制指定色值的背景
                ctx.fillStyle = this.bgColor;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.rect(0, 0, this.winWidth, this.winHeight);
                ctx.fill();

                // 遍历绘制雪花
                ctx.fillStyle = 'rgba(255, 255, 255, .8)';
                ctx.beginPath();

                for (let i = 0; i < this.nums; i++) {
                    let curParticle = this.particles[i];
                    ctx.moveTo(curParticle.x, curParticle.y);
                    ctx.arc(curParticle.x, curParticle.y, curParticle.r, 0, Math.PI * 2);
                }

                ctx.fill();
                this.updateCanvas();
            },
            /**
             * 更新雪花位置，处理边界情况
             * @return void
             */
            updateCanvas () {
                // 通过一个累加的参数，配合sin和cos函数，实现雪花依次左右飘的效果
                this.angle += .01;

                for(let i = 0; i < this.nums; i++) {
                    let curParticle = this.particles[i];
                    // 通过sin函数切换左右飘落方向
                    curParticle.x += Math.sin(this.angle) * 2;
                    // 通过cos函数配合半径，实现y轴飘落的错落效果，避免所有雪花y轴速度一样的诡异场景
                    curParticle.y += Math.cos(this.angle + curParticle.d) + 1 + curParticle.r / 2;
                    
                    // 边界判断
                    if (curParticle.x > this.winWidth + this.radius || curParticle.x < -this.radius || curParticle.y > this.winHeight) {

                        if (i % 3 > 0) { // 超出边界的雪花，先扔2/3到最顶部重新飘
                            this.particles[i] = {
                                x: Math.random() * this.winWidth,
                                y: -10,
                                r: curParticle.r,
                                d: curParticle.d
                            };
                        } else if (Math.sin(this.angle) > 0) { // 剩下的1/3，如果雪花正在往右边飘，把它放到左边窗口外的位置
                            this.particles[i] = {
                                x: -this.radius,
                                y: Math.random() * this.winHeight,
                                r: curParticle.r,
                                d: curParticle.d
                            };
                        } else { // 如果正在往左边飘，把它放到右边窗口外的位置
                            this.particles[i] = {
                                x: this.winWidth + this.radius,
                                y: Math.random() * this.winHeight,
                                r: curParticle.r,
                                d: curParticle.d
                            };
                        }
                    }
                }

                requestAnimationFrame(this.drawSnow);
            },
            /**
             * 对当前Canvas截图并下载至本地
             * @param  {String} id       要下载的canvas id
             * @param  {String} fileName 要保存到本地的file name
             * @return void
             */
            exportCanvasAsPNG (id, fileName) {
                let canvasElement = document.getElementById(id);
                let MIME_TYPE = 'image/png';
                let imgURL = canvasElement.toDataURL(MIME_TYPE);

                let dlLink = document.createElement('a');
                dlLink.download = fileName;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }
        }
    };
</script>

<style lang="scss">
    @import 'src/assets/base';
</style>
