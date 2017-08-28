<template>
    <div id="app">
        <mu-appbar>
            <div class="title">
                Vue-Layout
                <mu-badge class="description" content="可视化布局 " color="#f06292" />
            </div>
            <mu-icon-button icon="share" slot="right" @click="share.open=true" />
            <mu-icon-button icon="settings" slot="right" @click="setting.open=true" />
            <mu-icon-button icon=":iconfont icon-github" slot="right" href="https://github.com/jaweii/Vue-Layout" /> 
        </mu-appbar>
        <mu-row class="main-content">
            <mu-col class="attributes" :width="width.attr" :tablet="width.attr" :desktop="width.attr">
                <mu-sub-header class="header">
                    <mu-select-field class="select-field" autoWidth v-model="selectField.value">
                        <mu-menu-item title="属性" value="属性">
                        </mu-menu-item>
                        <mu-menu-item title="组件树" value="组件树">
                        </mu-menu-item>
                    </mu-select-field>
                    <span><a class="parent-component" v-if="parentComponent" @click="switchComponent">┡ {{parentComponent.info.name}}</a> {{current.info?' - '+current.info.name:''}}</span>
                </mu-sub-header>
                <attributes v-if="selectField.value==='属性'" class="attributes-content" />
                <component-tree v-if="selectField.value==='组件树'" class="component-tree" :components="$store.state.components.filter(c=>!c.parentId)" />
                <div class="attributes-bottom" v-if="current.info">
                    <mu-flat-button label="UI文档" @click="openUiDocument" />
                    <mu-flat-button label="操作" @click="oprate" />
                </div>
            </mu-col>
            <mu-col class="preview" :width="width.preview" :tablet="width.preview" :desktop="width.preview">
                <preview ref="preview" />
            </mu-col>
            <mu-col class="components" :width="width.components" :tablet="width.components" :desktop="width.components">
                <components ref="components" />
            </mu-col>
        </mu-row>
        <mu-dialog :open="setting.open" @close="setting.open=false" title="设置" scrollable>
            <br>
            <mu-checkbox label="选中边框效果" v-model="setting.selectEffect" @change="setSelectEffect" />
            <br/>
            <mu-flat-button primary label="关闭" @click="setting.open=false" slot="actions" />
        </mu-dialog>
        <mu-dialog :open="share.open" @close="share.open=false" title="分享当前布局" scrollable>
            <br>
            <mu-flat-button label="点击生成" @click="createShare" v-if="!share.url" />
            <br>
            <mu-text-field v-model="share.url" type="url" :disabled="true" hintText="分享地址" label="分享地址" fullWidth />
            <mu-text-field v-model="share.experience" type="url" :disabled="true" label="体验地址" hintText="体验地址" fullWidth />
            <br/>
            <mu-flat-button primary label="关闭" @click="share.open=false" slot="actions" />
        </mu-dialog>
    </div>
</template>
<script>
import attributes from './attributes'
import components from './components'
import preview from './preview'
import componentTree from './componentTree.vue'
export default {
    name: 'app',
    data() {
        return {
            setting: {
                open: false,
                selectEffect: true
            },
            share: {
                open: false,
                url: '',
                experience: ''
            },
            selectField: {
                value: '属性'
            }
        }
    },
    mounted() {
        this.setSelectEffect(this.setting.selectEffect)
    },
    computed: {
        current: { //预览视图中选中的组件
            get() {
                return this.$store.state.currentComponent
            }
        },
        width: { //三栏的宽度设置
            get() {
                return this.$store.state.width[0]
            }
        },
        parentComponent: {
            get() {
                let component
                if (this.current.parentId)
                    component = this.$store.state.components.find(c => c.info.id === this.current.parentId)
                else
                    component = null
                return component
            }
        },
        components: {
            get() {
                return this.$store.state.components
            }
        }
    },
    watch: {
        components: {
            deep: true,
            handler(val, oldVal) {
                //布局修改后将分享的url设为空
                this.share.url = ''
                this.share.experience = ''
            }
        }
    },
    methods: {
        switchComponent() {
            let el = document.getElementById(this.parentComponent.info.id)
            el.click()
        },
        oprate(e) {
            // let components = await this.$store.dispatch('delComponent', this.current.info.id)
            // this.$refs.preview.fresh()
            this.$refs.preview.rightClick(e)

        },
        openUiDocument() {
            switch (this.current.info.ui) {
                case 'Muse-UI':
                    return window.open('http://www.muse-ui.org/#/' + this.current.info.name.replace(' ', ''))
                case 'Mint-UI':
                    return window.open('https://mint-ui.github.io/docs/#/zh-cn/' + this.current.info.name.replace(' ', '-'))
                case 'iView-UI':
                    return window.open('https://www.iviewui.com/components/' + this.current.info.name)
                default:
                    return this.$toast('无文档页')
            }
        },
        setSelectEffect(val) {
            let head = document.head
            let style = document.getElementById('vue-layout-style')
            if (!style) {
                style = document.createElement('style')
                style.id = 'vue-layout-style'
                style.type = 'text/css'
                head.appendChild(style)
            }

            let cssText
            if (val) {
                cssText = `[data-component-active="true"] {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }
                          [data-component-active]:hover {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }
                          [data-component-active]:focus {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }`
            } else {
                cssText = `[data-component-active="true"] {
                              box-shadow: none;
                              outline:none;
                          }
                          [data-component-active]:hover {
                              box-shadow: none;
                          }
                          [data-component-active]:focus {
                              box-shadow: none;
                          }`
            }
            let textNode = document.createTextNode(cssText)
            style.innerHTML = ''
            style.appendChild(textNode)
        },
        createShare() {
            let share = new this.$lean.Object('Share')
            share.set('store', this.$store.state)
            share.save().then(res => {
                this.share.url = location.origin + location.pathname + '#/share/' + res.id
                this.share.experience = location.origin + location.pathname + '#/preview/pc/' + res.id
            })
        }
    },
    components: {
        components,
        preview,
        attributes,
        componentTree
    }
}
</script>
<style lang="less" scoped>
@import '~muse-ui/src/styles/colors.less';
@previewBG: @deepPurple50;
* {
    -webkit-user-select: none;
}

::-webkit-scrollbar {
    display: none;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.title {
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    .description {
        vertical-align: super;
    }
}

.main-content>div {
    transition: all .5s;
}

.client-height {
    height: 100vh;
    overflow: auto;
}

.attributes {
    .client-height;
    background-color: @previewBG;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    justify-item: center;
    .header {
        white-space: nowrap;
    }
    .select-field {
        width: 70px;
        vertical-align: top;
        text-align: center;
    }
}

.attributes-content {
    flex: 1;
}

.component-tree {
    flex: 1;
}

.attributes-bottom {
    position: relative;
    text-align: center;
    color: @grey500;
}

.preview {
    .client-height;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
    z-index: 1;
}

.components {
    .client-height;
    background-color: @previewBG;
    overflow-y: scroll;
}

.parent-component {
    cursor: pointer;
}
</style>
