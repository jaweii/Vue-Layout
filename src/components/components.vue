<template>
    <section>
        <mu-content-block style="display:flex;">
            <mu-select-field :value="activeTab" @change="handleTabChange" autoWidth>
                <mu-menu-item title="Muse-UI" value="Muse-UI">
                </mu-menu-item>
                <mu-menu-item title="Mint-UI" value="Mint-UI">
                </mu-menu-item>
                <mu-menu-item title="iView-UI" value="iView-UI">
                </mu-menu-item>
                <mu-menu-item title="Element-UI" value="Element-UI">
                </mu-menu-item>
                <mu-menu-item title="通用" value="Common">
                </mu-menu-item>
            </mu-select-field>
            <mu-sub-header style="white-space:nowrap;">- 组件</mu-sub-header>
        </mu-content-block>
        <div v-if="activeTab === 'Muse-UI'">
            <ul class="components-list">
                <!-- 导航栏 -->
                <li draggable="true" @dragstart="dragStart" data-name="App Bar">
                    <appbar />
                </li>
                <!-- 栅格布局 -->
                <li draggable="true" @dragstart="dragStart" data-name="Grid">
                    <shanGe />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Text Field">
                    <textField />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Flat Button">
                    <FlatButton />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Raised Button">
                    <RaisedButton />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Icon Button">
                    <iconButton />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Icon">
                    <icon />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Floating Action Button">
                    <floatingActionButton />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Avatar">
                    <avatar />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Chip">
                    <chip />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Card Header">
                    <cardHeader />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Sub Header">
                    <subHeader />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="List">
                    <list />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="List Item">
                    <listItem />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Table">
                    <grid />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Date Picker">
                    <datePicker />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Time Picker">
                    <timePicker/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Badge">
                    <badge/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Bottom Nav">
                    <navigation/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Tabs">
                    <tab/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Breadcrumb">
                    <breadcrumb/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Checkbox">
                    <checkBox />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Radio">
                    <radio/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Switch">
                    <swit/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Select Field">
                    <selectField/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Paper">
                    <paper/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Pagination">
                    <pagination/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Slider">
                    <slider/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Divider">
                    <divider/>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Linear Progress">
                    <linearProgress />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Circular Progress">
                    <circularProgress />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Card">
                    <card />
                </li>
                <!--                 
                <li draggable="true" @dragstart="dragStart" data-name="Back Top">
                    <backTop/>
                </li> 
                -->
            </ul>
        </div>
        <div v-if="activeTab === 'Mint-UI'">
            <ul class="components-list">
                <li draggable="true" @dragstart="dragStart" data-name="Header">
                    <mt-header fixed title="Header"></mt-header>
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Button">
                    <mt-button type="default">Button</mt-button>
                </li>
            </ul>
        </div>
        <div v-if="activeTab === 'iView-UI'">
            <ul class="components-list">
                <!--                 
                <li draggable="true" @dragstart="dragStart" data-name="Header">
                    <mt-header fixed title="Header"></mt-header>
                </li> 
                -->
            </ul>
        </div>
        <div v-if="activeTab === 'Element-UI'">
            <ul class="components-list">
                <!--                 
                <li draggable="true" @dragstart="dragStart" data-name="Header">
                    <mt-header fixed title="Header"></mt-header>
                </li> 
                -->
            </ul>
        </div>
        <div v-if="activeTab==='Common'">
            <ul class="components-list">
                <li draggable="true" @dragstart="dragStart" data-name="Text">
                    <mu-icon value="text_fields" style="vertical-align:middle;" /> 文本
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="A">
                    <mu-icon value="link" style="vertical-align:middle;" /> 链接
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Img">
                    <mu-icon value="image" /> 图片
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Br">
                    <mu-icon value="keyboard_return" /> 换行
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Div">
                    <mu-icon value="check_box_outline_blank" /> div
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
import museUiList from './list/muse-ui'
export default {
    name: 'components',
    data() {
        return {
            activeTab: 'Muse-UI'
        }
    },
    mounted() {

    },
    methods: {
        handleTabChange(val) {
            this.activeTab = val
        },
        getComponent(e) {
            if (!e)
                return
            if (e.localName !== 'li')
                return this.getComponent(e.parentElement)
            else
                return e
        },
        removeDom(e) {
            if (e && e.parentElement)
                e.parentElement.removeChild(e)
        },
        dragStart(e) {
            let componentName = e.target.getAttribute('data-name')
            let info = {
                name: componentName,
                ui: this.activeTab
            }
            e.dataTransfer.setData('info', JSON.stringify(info))
        }
    },
    components: {
        ...museUiList
    }
}
</script>
<style lang="less" scoped>
.components-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.components-list * {
    cursor: move!important;
}

.components-list>li {
    min-height: 36px;
    font-size: 18px;
    -webkit-user-select: none;
    transform: scale(0.7)translateX(-15%);
    padding-bottom: 10px;
    transition: transform .2s;
    &:hover {
        transform: scale(1)translateX(5%);
    }
    i {
        vertical-align: middle;
    }
}
</style>
