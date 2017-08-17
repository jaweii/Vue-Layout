<template>
    <section>
        <div class="form" style="display:flex;">
            <mu-text-field :hintText="name" v-model="color" @input="change" />
            <mu-flat-button label="颜色" @click="openPopover" ref="button" />
        </div>
        <mu-popover :trigger="trigger" :open="open" @close="closePopover">
            <mu-menu ref="content" class="list-content" @change="changeMenu">
                <mu-content-block>
                    <mu-text-field hintText="搜索" v-model="searchValue" @input="search" fullWidth/>
                </mu-content-block>
                <mu-menu-item v-for="(color,index) in colorList" :key="index" :title="color.name" :value="color.value">
                    <mu-icon slot="after" value="color_lens" :color="color.value" />
                </mu-menu-item>
            </mu-menu>
        </mu-popover>
        <mu-infinite-scroll v-if="scroller" :scroller="scroller" :loading="loading" @load="loadMoreMaterialIcon" />
    </section>
</template>
<script>
import colorList from './colorList'
export default {
    name: 'colorPicker',
    data() {
        return {
            searchValue: '',
            color: this.value,
            open: false,
            trigger: null,
            colorList: colorList.slice(0, 50),
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
                this.color=this.value
            }
        }
    },
    methods: {
        search(value) {
            if (value === '')
                return this.colorList = colorList.slice(0, 50)
            this.colorList = colorList.filter(color => {
                return color.name.indexOf(value) !== -1
            })
        },
        changeMenu(value) {
            this.closePopover()
            this.color = value
            this.$emit('input', value)
            this.$emit('change', value)
        },
        change(value) {
            this.$emit('input', value)
            this.$emit('change', value)
        },
        loadMoreMaterialIcon() {
            if (this.searchValue === '')
                this.colorList.push.apply(this.colorList, colorList.slice(this.colorList.length - 1, this.colorList.length - 1 + 50))
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
            this.colorList = colorList.slice(0, 50)
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
