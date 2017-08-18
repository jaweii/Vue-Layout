<template>
    <section class="preview" @dragover="dragOver" @drop="drop">
        <!-- CODE视图 -->
        <mu-paper class="preview-head">
            <div class="bar">
                <mu-sub-header style="display:inline;">{{showType}}</mu-sub-header>
                <mu-icon-button style="float:right;" icon="fullscreen" tooltip="全屏" @click="fullScreen" />
                <mu-icon-button style="float:right;" icon="delete" tooltip="清空" @click="empty" />
                <mu-icon-menu style="float:right;" icon="stay_current_portrait" tooltip="视图" :targetOrigin="{vertical: 'bottom',horizontal: 'left'}">
                    <mu-menu-item title="调整比例" @click="setWidth" />
                    <mu-menu-item :title="previewMode==='pc'?'手机模式':'PC模式'" @click="previewMode=previewMode==='pc'?'mobile':'pc'" />
                </mu-icon-menu>
                <mu-icon-button style="float:right;" icon=":iconfont icon-css" tooltip="编辑样式" @click="editStyle" />
                <mu-icon-button style="float:right;" icon="code" tooltip="查看代码" @click="showCode" />
                <mu-icon-button v-if="$store.state.backupComponents.length" style="float:right;" icon="undo" tooltip="撤销" @click="undo" />
            </div>
            <mu-content-block :class="{'content':true,'active':showType!=='预览'}">
                <pre v-show="showType==='CODE'" v-highlightjs="getSource(components)"><code class="html"></code></pre>
                <textarea v-show="showType==='编辑样式'" class="css-editor" placeholder=".vue-layout{ ... }" v-model="css"></textarea>
            </mu-content-block>
        </mu-paper>
        <!-- 预览视图 -->
        <div ref="preview" v-show="previewMode==='pc'" class="preview-area" @click="clickPreview" @contextmenu="rightClick" @keyup.delete="del">
            <div v-if="!item.parentId" :id="item.info.id" v-for="(item,index) in components"></div>
        </div>
        <iframe src="./#/preview/mobile" class="preview-mobile" v-if="previewMode==='mobile'"></iframe>
        <mu-content-block class="preview-tip" v-if="components.length===0">
            试试拖拽组件进来
        </mu-content-block>
        <!-- 组件拖动属于嵌套操作时，这个弹出框会弹出 -->
        <mu-popover v-if="current.info" :trigger="popover.trigger" :open="popover.open" @close="popover.open=false">
            <mu-menu @change="selectedSlot">
                <label>
                    &nbsp;&nbsp;嵌套到{{current.info.name}}:
                </label>
                <mu-menu-item v-for="(val,key,index) in current.slots" :title="key" :value="key" :key="index" />
            </mu-menu>
        </mu-popover>
        <!-- 右键菜单 -->
        <div ref="contextmenu" :style="contextmenu.style"></div>
        <mu-popover v-if="current.info" :anchorOrigin="{ 'vertical': 'top', 'horizontal': 'middle'}" :targetOrigin="{ 'vertical': 'top', 'horizontal': 'left'}" :trigger="contextmenu.trigger" :open="contextmenu.open" @close="contextmenu.open = false">
            <mu-content-block>{{this.current.info.name}}</mu-content-block>
            <mu-divider/>
            <mu-menu class="contextmenu" @itemClick="contextmenu.open=false" autoWidth>
                <mu-menu-item title="复制" @click="copyComponent" />
                <mu-menu-item title="粘贴" @click="pasteComponent" v-if="$store.state.copiedComponents.length" />
                <mu-menu-item title="删除" @click="del" />
            </mu-menu>
        </mu-popover>
    </section>
</template>
<script>
import mount from './mount'
// 代码高亮样式
import '@/assets/css/highlight/default.css'
import '@/assets/css/highlight/Atom-One-Light.css'

// scoped style插件 ，解决webkit不支持scoped的问题
import scopedCss from 'scopedcss'

import {
    getTemplate
} from './template'
// 深度合并
import mergeDeep from '@/utils/mergeDeep'
//取随机id
import guid from '@/utils/guid'
export default {
    name: 'preview',
    data() {
        return {
            showType: '预览',
            contextmenu: {
                trigger: null,
                open: false,
                style: {}
            },
            popover: {
                trigger: null,
                open: false
            },
            insertPosition: {
                position: null,
                component: null
            },
            previewMode: 'pc'
        }
    },
    mounted() {
        //拖动放置位置的虚线框位置计算
        document.ondrag = e => {
            let {
                left,
                top
            } = this.$refs.preview.getBoundingClientRect()
                //鼠标在预览视图中的相对坐标
                // console.log(e.clientX,e.clientY)
            let preview = this.$refs.preview
            let x = e.clientX - left,
                y = e.clientY - top + preview.scrollTop
            this.components.filter(component => !component.parentId).forEach(component => {
                let {
                    offsetLeft,
                    offsetTop,
                    offsetRight,
                    offsetBottom
                } = component.position

                let offset = 5
                    //不在当前元素位置内
                if (!(x > offsetLeft && x < offsetRight && y > offsetTop && y < offsetBottom)) {
                    return
                }
                //上方
                if (y > offsetTop && y < offsetTop + offset) {
                    this.setPlaceholder('上方', component)
                    return
                }
                //右方
                if (x < offsetRight && x > offsetRight - offset) {
                    this.setPlaceholder('右方', component)
                    return
                }
                //下方
                if (y < offsetBottom && y > offsetBottom - offset) {
                    this.setPlaceholder('下方', component)
                    return
                }
                //左方
                if (x > offsetLeft && x < offsetLeft + offset) {
                    this.setPlaceholder('左方', component)
                    return
                }
            })
        }

        /*由于启用drag后的元素无法获取到mouseup事件，
        所以监听body的拖拽事件，以便在鼠标松开后，
        删除虚线框占位元素
        */
        document.body.ondragover = e => {
            e.preventDefault()
        }

        document.body.ondrop = e => {
            this.removePlaceholder()
            e.preventDefault()
        }

        //读取云端数据
        let id = this.$route.params.id
        let query = new this.$lean.Query('Share')
        if (id) {
            query.get(id).then(share => {
                let store = share.get('store')
                if (store) {
                    this.$store.commit('setState', store)
                        //dom没有渲染完成 window._Vue为undefined，加个延迟
                    setTimeout(() => {
                        this.mount()
                    }, 0)
                }
            })
        } else if (localStorage.store) {
            //读取本地数据
            let store = JSON.parse(localStorage.store)
            this.$store.commit('setState', store)
                //dom没有渲染完成 window._Vue为undefined，加个延迟
            setTimeout(() => {
                this.mount()
            }, 0)
        }

    },
    methods: {
        setWidth() { //调整各视图宽度比
            let width = this.width
            let end = width.shift()
            width.push(end)
            this.width = width
        },
        dragOver(e) {
            e.preventDefault()
        },
        drop(e) { //松开拖放,e是容器元素

            //CODE视图的文字拖动也会触发此事件，这里屏蔽掉
            if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                return

            let isNest = e.target.className.indexOf('preview') === -1 && e.target.id !== 'placeholder'
            let info = JSON.parse(e.dataTransfer.getData('info'))
            info.id = guid()
            let name = info.name //拖动的组件名字
            let component,
                template,
                attributes,
                slots

            //true:嵌套行为
            if (isNest) {
                //预览视图中选中组件后，current的值指向选中组件，为空{}就是未选
                if (!this.current.info)
                    return this.$toast('未选中嵌套目标')
                if (!Object.keys(this.current.slots).length)
                    return this.$toast('无可嵌套')
                this.popover.trigger = e.target
                this.popover.open = true
                let selectSlot = new Promise((resolve, reject) => {
                    this.selectedSlot = value => {
                        this.popover.open = false
                        resolve(value)
                    }
                })
                selectSlot.then(slot => {
                    let components = JSON.parse(JSON.stringify(this.components))
                    let index = components.findIndex(item => item.info.id === this.current.info.id)
                        //嵌套模板
                    let nestComponent = getTemplate(info, { //传入{slot}会给获取到的模板添加slot="xxx"
                        slot
                    })

                    nestComponent.attributes.slot = slot
                    nestComponent.parentId = components[index].info.id

                    //getTemplate中#可能#修改了components，所以重新获取
                    components = JSON.parse(JSON.stringify(this.components))
                    index = components.findIndex(item => item.info.id === this.current.info.id)

                    //设置组件的slots
                    let slots = components[index].slots || {}
                    slots[slot].push({
                        id: nestComponent.info.id
                    })

                    components.push(nestComponent)

                    //提交一次保存 避免getTemplate中获取nestComponent失败
                    this.components = components

                    //嵌套后的模板
                    component = getTemplate(this.current.info, this.current.attributes, slots)
                    if (!component.template)
                        throw '没有这个组件的模板'

                    //最父级模板
                    let topComponent = this.getParentComponent(this.current)
                    topComponent = getTemplate(topComponent.info, topComponent.attributes, topComponent.slots)
                    let topIndex = components.findIndex(c => c.info.id === topComponent.info.id)

                    components[topIndex] = topComponent
                    components[index] = mergeDeep(components[index], component)
                        //更新模板
                    this.components = components
                    this.mount()
                })

            } else { //非嵌套操作
                let id = guid()
                component = getTemplate(info)
                if (!component.template)
                    throw '没有这个组件的模板'

                let components = JSON.parse(JSON.stringify(this.components))
                if (!this.insertPosition.position) {

                    components.push(component)
                    this.components = components
                    this.mount()

                } else {
                    let index = components.findIndex(component => component.info.id === this.insertPosition.component.info.id)
                    let position = this.insertPosition.position
                    if (position === '下方' || position === '右方') {
                        index++
                    }
                    components.splice(index, 0, component)

                    //占位虚线框删除后，把这个也重置为null，为null时就是默认将拖动组件添加到components最后
                    this.insertPosition = {
                        component: null,
                        position: null
                    }
                    this.components = components
                    this.fresh()

                    /*  else end  */
                }

            }
        },
        fresh() {
            /*当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，
            它默认用 “就地复用” 策略。
            如果数据项的顺序被改变，
            Vue将不是移动 DOM 元素来匹配数据项的顺序，
             而是简单复用此处每个元素。
            出于此，每次components顺序变动后，只好使用清空再重新渲染的方式，否则不能成功渲染更新
             */
            let components = JSON.parse(JSON.stringify(this.components))
            this.components = []
            this.$refs.preview.innerHTML = ''

            //settimeout会等到dom重绘完成后在执行fn
            setTimeout(() => {
                this.components = components
                this.mount()
            }, 0)


        },
        getComponentNode(node) {
            if (node && node.getAttribute('data-component-active') !== null)
                return node
            else {
                if (node.parentElement)
                    return this.getComponentNode(node.parentElement)
                else
                    return false
            }

        },
        clickPreview(e) {
            let target = e.target
            e.preventDefault()
            let componentHTML = this.getComponentNode(target)
            if (componentHTML) {
                //添加选中效果
                let list = document.querySelectorAll('[data-component-active="true"]')
                list.forEach(el => {
                    el.setAttribute('data-component-active', '')
                })
                componentHTML.setAttribute('data-component-active', 'true')

                //保存到vuex
                let currentId = componentHTML.id
                let component = this.components.find(component => component.info.id === currentId)
                if (component)
                    this.$store.commit('setState', {
                        currentComponent: component
                    })
            }
        },
        mount() {
            //挂载及更新视图中组件的位置信息
            let components = JSON.parse(JSON.stringify(this.$store.state.components))
            components.filter(component => !component.parentId).forEach(component => {
                mount(component.info.id, component).then(vm => {
                    let el = document.getElementById(component.info.id)
                    component.position = {
                            offsetLeft: el.offsetLeft,
                            offsetRight: el.offsetLeft + el.clientWidth,
                            offsetTop: el.offsetTop,
                            offsetBottom: el.offsetTop + el.clientHeight
                        }
                        //每次重新挂载后dom变动，更新scoped style
                    this.addUserStyle()
                })
            })
            setTimeout(() => {
                this.components = components
            }, 0)
        },
        setPlaceholder(position, component) {
            //添加前删除
            this.removePlaceholder()
                //创建添加元素
            let placeholder = document.createElement('div')
            placeholder.id = 'placeholder'
                //当前悬停的组件元素
            let el = document.getElementById(component.info.id)
            switch (position) {
                case '上方':
                    this.$refs.preview.insertBefore(placeholder, el)
                    break
                case '右方':
                    placeholder.classList.add('inline')
                    this.$refs.preview.insertBefore(placeholder, el.nextSibling)
                    break
                case '下方':
                    this.$refs.preview.insertBefore(placeholder, el.nextSibling)
                    break
                case '左方':
                    placeholder.classList.add('inline')
                    this.$refs.preview.insertBefore(placeholder, el)
                    break
            }
            this.insertPosition = {
                position,
                component
            }
        },
        removePlaceholder() {
            let placeholder = document.getElementById('placeholder')
            if (placeholder)
                placeholder.parentElement.removeChild(placeholder)
        },
        selectedSlot() {
            // 必需，勿删，会在ondrop中被重写
        },
        getSource(components) { //预览视图中所有组件的代码
            let code = `<template><section>`
            components.filter(component => !component.parentId).forEach(component => {
                code += component.template
            })
            code += `\n</section></template>`
                //添加用户编辑的css
            let cssText = this.$store.state.css
            if (cssText) {
                cssText = '\n<style scoped>\n' + cssText
                cssText += '\n</style>\n'
                code += cssText
            }
            code = this.$prettyDom(code)

            /*把组件标签中包含的用户不需要的属性删掉，
              因为它只是为了适应预览视图，
              如，组件默认的“position:fixed”会使组件跑到预览视图外
            */
            code = code.replace(/ style=".*?"/g, '')
            code = code.replace(/ tabIndex=".*?"/g, '')
            code = code.replace(/ id=".*?"/g, '')
            code = code.replace(/ data-component-active/g, '')
            code = code.replace(/\n\n/g, '\n')

            return code
        },
        getParentComponent(component) {
            let components = JSON.parse(JSON.stringify(this.$store.state.components))
            if (component.parentId) {
                return this.getParentComponent(components.find(c => c.info.id === component.parentId))
            } else {
                return component
            }
        },
        del: async function() {
            let components = await this.$store.dispatch('delComponent', this.current.info.id)
            this.fresh()
        },
        showCode() {
            if (this.showType === 'CODE')
                this.showType = '预览'
            else
                this.showType = 'CODE'
        },
        editStyle() {
            if (this.showType === '编辑样式')
                this.showType = '预览'
            else
                this.showType = '编辑样式'
        },
        addUserStyle() {
            if (!this.css)
                return
                //添加用户编辑的css效果到预览视图
            let style = document.getElementById('custom-layout')
            if (!style) {
                style = document.createElement('style')
                style.id = 'custom-layout'
                style.setAttribute('scoped', '')
                style.type = 'text/css'
                this.$refs.preview.appendChild(style)
            }
            let cssText = document.createTextNode(this.css)
            style.innerHTML = ''
            style.appendChild(cssText)
                // let sysCssText=document.createTextNode(`\ndiv:last-child{margin-bottom:100px;}`)
                // style.appendChild(sysCssText)
                // 动态添加scoped style
            scopedCss.applyTo(this.$refs.preview)
        },
        rightClick(e) {
            this.clickPreview(e)
            this.contextmenu.open = false
            this.contextmenu.trigger = this.$refs.contextmenu
            this.contextmenu.style = {
                position: 'fixed',
                left: e.x + 10 + 'px',
                top: e.y - 10 + 'px'
            }
            this.contextmenu.open = true
        },
        fullScreen() {
            if (document.webkitIsFullScreen)
                return document.webkitCancelFullScreen()
            var el = document.body
                //Chrome
            if (el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen()
                el.style.width = window.screen.width + 'px'
                el.style.height = window.screen.height + 'px'
            }
            document.addEventListener("webkitfullscreenchange", function(e) {
                if (!document.webkitIsFullScreen) {
                    el.style.width = 'inherit'
                    el.style.height = 'inherit'
                }
            }, false)
        },
        undo() {
            let components = JSON.parse(JSON.stringify(this.$store.state.backupComponents))
            this.$store.commit('setState', {
                backupComponents: [],
                components
            })
            this.fresh()
        },
        copyComponent() {
            let copied = []
            let components = JSON.parse(JSON.stringify(this.components))
            let current = JSON.parse(JSON.stringify(this.current))
            let getCopiedComponents = (component = current) => {
                let hasChild = Object.keys(component.slots).filter(slot => component.slots[slot].length).length

                //修改id和parentId
                let parentId = guid()

                //局部的的components可能被child.info.id = guid()所改变，所以重新定义个
                let components = JSON.parse(JSON.stringify(this.components))

                //找到了就重新赋值id,并且能够说明有传component进来，因为被传进来的id都是被改变的，不会被找到
                if (components.find(c => c.info.id === component.info.id)) {
                    component.info.id = parentId
                        //被复制的组件的最父级组件
                    component.parentId = null
                }
                if (hasChild) {
                    let arr = []
                    Object.keys(component.slots).forEach(slot => {
                        component.slots[slot].forEach(item => {
                            let child = components.find(c => c.info.id === item.id)
                                //赋予新id
                            child.info.id = guid()
                            child.parentId = parentId
                            item.id = child.info.id
                            arr.push.apply(arr, getCopiedComponents(child))
                        })
                    })
                    return [component].concat(arr)
                } else {
                    return [component]
                }
            }
            let copiedComponents = getCopiedComponents()
            this.$store.commit('setState', {
                copiedComponents
            })
            this.$toast('复制成功')
        },
        pasteComponent() {
            let components = JSON.parse(JSON.stringify(this.components))
            let index = components.findIndex(c => c.info.id === this.current.info.id)
            this.popover.trigger = document.getElementById(this.current.info.id)
            this.popover.open = true
            let selectSlot = new Promise((resolve, reject) => {
                this.selectedSlot = value => {
                    this.popover.open = false
                    resolve(value)
                }
            })
            selectSlot.then(slot => {
                let copiedComponents = JSON.parse(JSON.stringify(this.$store.state.copiedComponents))
                let pasteComponent = copiedComponents.find(c => !c.parentId)
                components[index].slots[slot].push({
                    id: pasteComponent.info.id
                })
                pasteComponent.parentId = components[index].info.id
                pasteComponent.slot = slot
                components = components.concat(copiedComponents)
                this.$store.commit('setState', {
                    components,
                    copiedComponents: [] //粘贴后清除剪切板
                })
                let topComponent = this.getParentComponent(components[index])
                let topIndex = components.findIndex(c => c.info.id === topComponent.info.id)
                components[topIndex].template = getTemplate(components[topIndex].info, components[topIndex].attributes, components[topIndex].slots).template
                    //因为getTemplate中需要最新的components，所以提交两次状态
                this.$store.commit('setState', {
                    components,
                    copiedComponents: [] //粘贴后清除剪切板
                })
                this.fresh()
            })
        },
        empty() {
            //清空
            this.$store.commit('setState', {
                css: '', //用户编辑的自定义css字符串
                currentComponent: {}, //预览视图的选中组件
                components: [], //预览视图的组件树
                backupComponents: [],
                copiedComponents: []
            })
            this.fresh()
        }
    },
    computed: {
        width: { //各视图宽度比
            get() {
                return this.$store.state.width
            },
            set(width) {
                this.$store.commit('setState', {
                    width
                })
            }
        },
        components: { //组件树 ，预览视图中所有组件
            get() {
                return this.$store.state.components
            },
            set(components) {
                this.$store.commit('setState', {
                    components
                })
            }
        },
        current: { //当前选中组件
            get() {
                return this.$store.state.currentComponent
            }
        },
        css: {
            get() {
                return this.$store.state.css
            },
            set(val) {
                this.$store.commit('setState', {
                    css: val
                })
            }
        }
    },
    watch: {
        css(val, oldVal) {
            this.addUserStyle()
        }
    }
}
</script>
<style lang="less" scoped>
@import '~muse-ui/src/styles/colors.less';
.preview {
    height: inherit;
    position: relative;
    overflow: hidden;
    background: white;
}

.preview-area {
    overflow: auto;
    position: relative;
    height: inherit;
    z-index: 0;
    padding-bottom: 100px;
}

.preview-tip {
    text-align: center;
    color: @grey500;
    position: absolute;
    top: 40%;
    z-index: -1;
}

.preview-head {
    width: 100%;
    top: 0;
    z-index: 2;
    .bar {
        background-color: @grey100;
    }
    .content {
        height: 0;
        overflow: auto;
        transition: all .2s;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 0;
        background-color: @grey50;
        user-select: text;
        code {
            background: none;
            font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
        }
    }
    .content.active {
        height: 95vh;
    }
}

.css-editor {
    border: none;
    background: none;
    width: 100%;
    height: 100%;
    outline: none;
    overflow: auto;
}

.preview-mobile {
    position: absolute;
    width: 375px;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    border: none;
    box-shadow: 0 14px 45px rgba(0, 0, 0, .247059), 0 10px 18px rgba(0, 0, 0, .219608);
}

.contextmenu>div {
    width: 100%;
}
</style>

