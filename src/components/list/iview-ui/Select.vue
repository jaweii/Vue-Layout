<template>
    <Select v-model="model1">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<script>
export default {
    data() {
        return {
            cityList: [{
                value: '1',
                label: 'Select '
            }, {
                value: '2',
                label: 'Select 2'
            }, {
                value: '3',
                label: 'Select 3'
            }],
            model1: '1'
        }
    }
}
</script>
