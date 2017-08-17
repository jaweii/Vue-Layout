<template>
    <section>
        <div v-for="c in components">
            <a @click="click(c.info.id)">
                <mu-icon @click="show=!show" :value="show?'keyboard_arrow_down':'keyboard_arrow_right'" style="vertical-align:middle;" />
                {{c.info.name}}</a>
            <div v-for="(slot,key) in c.slots" v-show="show">
                <componentTree :components="slotToComponents(c.slots[key])" v-if="Object.keys(c.slots).filter(slot=>c.slots[slot].length).length" />
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'componentTree',

    data() {
        return {
            show: true
        }
    },
    props: {
        components: {
            type: Array,
            default: null
        }
    },
    methods: {
        slotToComponents(slot) {
            return this.$store.state.components.filter(c => slot.findIndex(item => item.id === c.info.id) !== -1)
        },
        click(id) {
            let el = document.getElementById(id)
            el.click()
        }
    }
}
</script>
<style lang="css" scoped>
a {
    cursor: pointer;
}

section {
    margin-left: 20px;
}
</style>
