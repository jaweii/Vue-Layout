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
                <mu-list-item v-for="(icon,index) in ioniconList" :key="index" :title="icon" :value="icon">
                    <Icon :type="icon" :size="26" slot="left"/>
                </mu-list-item>
            </mu-menu>
        </mu-popover>
        <mu-infinite-scroll v-if="scroller" :scroller="scroller" :loading="loading" @load="loadMoreMaterialIcon" />
    </section>
</template>
<script>
import ioniconList from './ioniconList'
export default {
    name: 'iconPicker',
    data() {
        return {
            searchValue: '',
            iconName: this.value,
            open: false,
            trigger: null,
            ioniconList: ioniconList.slice(0, 50),
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
    watch: {
        value: {
            deep: true,
            handler(val, oldVal) {
                this.iconName = this.value
            }
        }
    },
    methods: {
        search(value) {
            if (value === '')
                return this.ioniconList = ioniconList.slice(0, 50)
            this.ioniconList = ioniconList.filter(icon => {
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
                this.ioniconList.push.apply(this.ioniconList, ioniconList.slice(this.ioniconList.length - 1, this.ioniconList.length - 1 + 50))
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
            this.ioniconList = ioniconList.slice(0, 50)
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
