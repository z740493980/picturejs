<template>
    <div class="main">
        <canvas id="block" ref="canvas"></canvas>
    </div>
</template>

<script>
    import Ctx from 'src/assets/ctx';

    export default {
        data () {
            return {
                radius: 150
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
        methods: {
            init () {
                this.resetSize();
                this.drawNowTime();
                setInterval(() => {
                    this.drawNowTime(false)
                }, 1000);
            },
            resetSize () {
                let ctx = this.ctx;
                let winWidth = this.winWidth = window.innerWidth;
                let winHeight = this.winHeight = window.innerHeight;
                this.$refs.canvas.width = winWidth;
                this.$refs.canvas.height = winHeight;
            },
            drawNowTime (isFirst = true) {
                let ctx = this.ctx;
                ctx.clearRect(0, 0, this.winWidth, this.winHeight);

                ctx.fillStyle = '#eee';
                ctx.fillRect(0, 0, this.winWidth, this.winHeight);

                // 获取当前时间
                let time = new Date();
                let s = time.getSeconds();
                let m = time.getMinutes();
                let h = time.getHours();
                console.log(`now time: ${h}:${m}:${s}`);

                // 获取当前时间对应的时针、分针、秒针旋转的角度
                let sDeg = Math.PI * 2 / 60 * s;
                let mDeg = Math.PI * 2 / (60 * 60) * (m * 60 + s);
                let hDeg = Math.PI * 2 / (60 * 60 * 12) * (h * 60 * 60 + m * 60 + s);

                // 绘制钟表
                if (isFirst) {
                    ctx.translate(this.winWidth / 2, this.winHeight / 2);
                }
                
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#666';
                ctx.save(); // 保存当前ctx状态，方便通过restore回滚到该状态

                ctx.beginPath();
                ctx.fillStyle = '#fff';
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#2af';
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore(); // 回滚ctx状态到上一次save处

                ctx.save();
                // 绘制60分线
                for (let i = 0; i < 60; i++) {
                    ctx.beginPath();
                    ctx.rotate(Math.PI * 2 / 60);

                    if ((i + 1) % 5 === 0) {
                        ctx.lineWidth = 4;
                        ctx.moveTo(0, this.radius - 20);
                        ctx.lineTo(0, this.radius - 10);
                    } else {
                        ctx.lineWidth = 4;
                        ctx.moveTo(0, this.radius - 15);
                        ctx.lineTo(0, this.radius - 10);
                    }

                    ctx.stroke();
                }
                ctx.restore();

                // 绘制时针
                ctx.save();
                ctx.beginPath();
                ctx.rotate(hDeg);
                ctx.lineWidth = 8;
                ctx.moveTo(0, 10);
                ctx.lineTo(0, -50);
                ctx.stroke();
                ctx.restore();

                // 绘制分针
                ctx.save();
                ctx.beginPath();
                ctx.rotate(mDeg);
                ctx.lineWidth = 4;
                ctx.moveTo(0, 10);
                ctx.lineTo(0, -80);
                ctx.stroke();
                ctx.restore();

                // 绘制秒针
                ctx.save();
                ctx.beginPath();
                ctx.rotate(sDeg);
                ctx.lineWidth = 2;
                ctx.moveTo(0, 10);
                ctx.lineTo(0, -120);
                ctx.stroke();
                ctx.restore();

                // 绘制中心点
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = '#fff';
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    };
</script>

<style lang="scss">
    @import 'src/assets/base';
</style>
