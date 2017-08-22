<!-- Muse-UI图标选择器 -->
<template>
    <section>
        <div class="form" style="display:flex;">
            <mu-text-field :hintText="name" v-model="iconName" @input="change" />
            <mu-flat-button label="图标" @click="openPopover" ref="button" />
        </div>
        <mu-popover :trigger="trigger" :open="open" @close="closePopover">
            <mu-menu ref="content" class="list-content" @change="changeMenu">
                <mu-content-block>
                    <mu-text-field hintText="搜索" v-model="searchValue" @input="search" fullWidth/>
                </mu-content-block>
                <mu-menu-item v-for="(icon,index) in iconList" :leftIcon="icon" :key="index" :title="icon" :value="icon" />
            </mu-menu>
        </mu-popover>
        <mu-infinite-scroll v-if="scroller" :scroller="scroller" :loading="loading" @load="loadMoreMaterialIcon" />
    </section>
</template>
<script>
import iconList from './iconList'
export default {
    name: 'iconPicker',
    data() {
        return {
            searchValue: '',
            iconName: this.value,
            open: false,
            trigger: null,
            iconList: iconList.slice(0, 50),
            scroller: null,
            loading: false

        }
    },
    mounted() {
        this.trigger = this.$refs.button.$el
    },
    props: {
        value: {
            default: {}
        },
        name: {
            default: ''
        }
    },
    watch:{
        value:{
            deep:true,
            handler(val,oldVal){
                this.iconName=this.value
            }
        }
    },
    methods: {
        search(value) {
            if (value === '')
                return this.iconList = iconList.slice(0, 50)
            this.iconList = iconList.filter(icon => {
                return icon.indexOf(value) !== -1
            })
        },
        changeMenu(value) {
            this.closePopover()
            this.iconName = value
            this.$emit('input', value)
            this.$emit('change', value)
        },
        change(value) {
            this.$emit('input', value)
            this.$emit('change', value)
        },
        loadMoreMaterialIcon() {
            if (this.searchValue === '')
                this.iconList.push.apply(this.iconList, iconList.slice(this.iconList.length - 1, this.iconList.length - 1 + 50))
        },
        openPopover() {
            this.open = !this.open
            if (this.open)
                setTimeout(() => {
                    this.scroller = this.$refs.content.$el
                }, 0)
        },
        closePopover() {
            this.open = false
            this.iconList = iconList.slice(0, 50)
        }
    }
}
</script>
<style scoped>
.list-content {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 300px;
}
</style>
