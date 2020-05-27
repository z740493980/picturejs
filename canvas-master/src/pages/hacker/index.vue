<template>
    <div class="main">
        <canvas ref="canvas" id="hacker"></canvas>
        <div class="controller">
            <div class="item">
                <span>颜色</span>
                <input type="text" v-model="color">
            </div>
            <div class="item">
                <span>字号</span>
                <input type="text" v-model="size">
            </div>
            <div class="item">
                <span>文字</span>
                <input type="text" v-model="fonts">
            </div>
            <div class="download" @click="exportCanvasAsPNG('hacker', 'hacker')">保存截图</div>
        </div>
    </div> 
</template>

<script>
    import 'raf.js';
    import Ctx from 'src/assets/ctx';

    export default {
        data () {
            return {
                winWidth: 0,
                winHeight: 0,
                fonts: '这是一段测试文字',
                size: 12,
                color: '#00d103'
            };
        },
        computed: {
            ctx () {
                return Ctx(this.$refs.canvas, '2d');
            },
            splitFonts () {
                return this.fonts.split('');
            },
            colNum () {
                return this.winWidth / this.size;
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
                requestAnimationFrame(this.reDrawFonts);
                window.addEventListener('resize', this.resetSize);
            },
            resetSize () {
                let ctx = this.ctx;
                let winWidth = this.winWidth = window.innerWidth;
                let winHeight = this.winHeight = window.innerHeight;
                this.$refs.canvas.width = winWidth;
                this.$refs.canvas.height = winHeight;
                
                ctx.clearRect(0, 0, this.winWidth, this.winHeight);

                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, this.winWidth, this.winHeight);
                this.resetPosition();
            },
            resetPosition () {
                this.position = [];
                for (let i = 0; i < this.colNum; i++) {
                    this.position[i] = 0;
                }
            },
            /**
             * 实现原理：
             * 重绘时不对画布做清空处理，使用一层透明度较高的浮层配合y轴移位的文字覆盖上去，形成文字拖尾的效果
             * 类似于每次绘制都新增一个图层
             */
            reDrawFonts () {
                let ctx = this.ctx;

                // 绘制新图层时，用较高透明度的背景来营造文字拖尾的效果
                ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
                ctx.fillRect(0, 0, this.winWidth, this.winHeight);

                ctx.fillStyle = this.color;
                ctx.font = `normal ${this.size}px serif`;

                this.position.forEach((item, index) => {
                    let curFont = this.splitFonts[Math.floor(Math.random() * this.splitFonts.length)];
                    ctx.fillText(curFont, index * this.size, item * this.size);

                    // 边界处理
                    // 为了避免出现同进同出这种比较生硬的动画，使用一个随机数进行筛选
                    if (item * this.size > this.winHeight && Math.random() > .95) {
                        this.position[index] = 0;
                    }

                    // 使文字下移一位，为下一次绘制的图层做准备
                    this.position[index] += 1;
                });

                requestAnimationFrame(this.reDrawFonts);
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
