<template>
    <div class="main">
        <canvas id="flame" ref="canvas"></canvas>
    </div>
</template>

<script>
    import 'raf.js';
    import Ctx from 'src/assets/ctx';

    const MOUSE = {};

    class Particle {
        constructor (w, h) {
            this.speed = {
                x: -2.5 + Math.random() * 5,
                y: -15 + Math.random() * 10
            };
            this.radius = 10 + Math.random() * 20;
            this.life = 20 + Math.random() * 10;
            this.remainingLife = this.life;
            this.location = {
                x: MOUSE.x || w / 2,
                y: MOUSE.y || h / 2
            };
            this.r = Math.round(Math.random() * 255);
            this.g = Math.round(Math.random() * 255);
            this.b = Math.round(Math.random() * 255);
        }
    };

    export default {
        data () {
            return {
                particles: [],
                count: 100
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
                this.$refs.canvas.addEventListener('mousemove', this.moveTrack, false);
                this.$refs.canvas.addEventListener('touchmove', this.moveTrack, false);
            });
        },
        methods: {
            init () {
                this.resetSize();
                this.pushParticle();
                this.drawFlame();
                requestAnimationFrame(this.drawFlame);
            },
            resetSize () {
                let ctx = this.ctx;
                let winWidth = this.winWidth = window.innerWidth;
                let winHeight = this.winHeight = window.innerHeight;
                this.$refs.canvas.width = winWidth;
                this.$refs.canvas.height = winHeight;
            },
            pushParticle () {
                for (let i = 0; i < this.count; i++) {
                    this.particles.push(new Particle(this.winWidth, this.winHeight));
                }
            },
            drawFlame () {
                let ctx = this.ctx;

                // 绘制画布底色
                ctx.globalCompositeOperation = 'source-over'; // 绘制图层位于原图层上
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, this.winWidth, this.winHeight);

                // 绘制图层与原图层的重叠部分会进行色值叠加
                ctx.globalCompositeOperation = 'lighter';

                this.particles.forEach((item, index) => {
                    ctx.beginPath();

                    // 根据剩余生命周期设置当前🔥粒子透明度
                    item.opacity = Math.round(item.remainingLife / item.life * 100) / 100;

                    // 创建一个放射型渐变
                    // 参考地址：
                    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
                    let gradient = ctx.createRadialGradient(item.location.x, item.location.y, 0, item.location.x, item.location.y, item.radius);
                    gradient.addColorStop(0, `rgba(${item.r}, ${item.g}, ${item.b}, ${item.opacity})`);
                    gradient.addColorStop(1, `rgba(${item.r}, ${item.g}, ${item.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.arc(item.location.x, item.location.y, item.radius, Math.PI * 2, false);
                    ctx.fill();

                    // 每次绘制后对粒子参数做处理，使🔥粒子位置上升，生命周期减少，半径减小，模拟燃尽效果
                    item.remainingLife -= .2;
                    item.radius -= .2;
                    item.location.x += item.speed.x / 5;
                    item.location.y += item.speed.y / 5;

                    // 如果该🔥粒子生命周期减少为0或者半径减少到0，创建一个新粒子做补充
                    if (item.remainingLife < 0 || item.radius < 0) {
                        this.particles[index] = new Particle(this.winWidth, this.winHeight);
                    }
                });

                requestAnimationFrame(this.drawFlame);
            },
            moveTrack (e) {
                MOUSE.x = e.pageX || e.changedTouches[0].pageX;
                MOUSE.y = e.pageY || e.changedTouches[0].pageY;
            }
        }
    };
</script>

<style lang="scss">
    @import 'src/assets/base';
</style>
