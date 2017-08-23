<template>
    <div style="padding-left:10px;">
        <!-- 组件的attributes中包含了组件的属性，如：
             attributes = {
                label: {
                    type:'text',
                    value:'按钮'
                }
            }-->
        <div v-if="attr" v-for="(v,k,i) in attr">
            <!-- 文本型（text）属性 -->
            <mu-text-field v-if="v.type==='text'" :label="k" :name="k" v-model="v.value" @input.native="updateAttribute" type="text" fullWidth/>
            <!-- 数字型（number）属性 -->
            <mu-text-field v-if="v.type==='number'" :label="k" :name="k" v-model="v.value" @input.native="updateAttribute" type="number" fullWidth/>
            <!-- 滑块型 -->
            <small v-if="v.type==='slider'">{{k+': '+v.value}}</small>
            <mu-slider v-if="v.type==='slider'" v-model="v.value" :step="v.step" :max="v.max" :min="v.min" @mouseup.native="updateAttribute" />
            <!--  标签型（label）属性  -->
            <div v-if="v.type==='label'" class="mu-text-field-label">{{v.value}}</div>
            <!--  开关（boolean）属性   -->
            <mu-switch v-if="v.type==='boolean'" :label="k" v-model="v.value" @change="updateAttribute" labelLeft :style="{width:'100%',marginBottom:'10px'}" />
            <!--  选择型 (selection) 属性  -->
            <mu-select-field v-if="v.type==='selection'" v-model="v.value" :label="k" @input="updateAttribute" style="width:100%;">
                <mu-menu-item v-for="(item,index) in v.items" :value="item" :title="item" :key="index" />
            </mu-select-field>
            <!-- 图标型 (icon) 属性 Muse-UI专用 -->
            <iconPicker v-if="v.type==='icon'" @change="updateAttribute" v-model="v.value" :name="k"/>
            <!-- 图标型 (ionicon) 属性 iView-UI专用 -->
            <ioniconPicker v-if="v.type==='ionicon'" @change="updateAttribute" v-model="v.value" :name="k"/>
            <!-- 颜色型 (color) 属性 -->
            <colorPicker v-if="v.type==='color'" @change="updateAttribute" v-model="v.value" :name="k"/>
            <!-- 子属性 -->
            <subAttributes v-if="v.children" :keyOfAttr="k" :attributes="v.children" @update="subUpdate" />
        </div>
    </div>
</template>
<script>
import iconPicker from './iconPicker'
import colorPicker from './colorPicker'
import ioniconPicker from './ioniconPicker'
export default {
    name: 'subAttributes',
    data() {
        return {
            attr: {}
        }
    },
    props: {
        attributes: {
            type: Object,
            default: null
        },
        keyOfAttr: {
            type: String,
            default: null
        }
    },
    created() {
        this.attr = JSON.parse(JSON.stringify(this.attributes))
    },
    watch: {
        attributes: {
            deep: true,
            handler(val, oldVal) {
                this.attr = JSON.parse(JSON.stringify(val))
            }
        }
    },
    methods: {
        subUpdate(attr) { //收到了子组件的更新
            Object.assign(this.attr, attr)
            this.updateAttribute()

        },
        updateAttribute() { //提交更新到父组件
            if (this.keyOfAttr)
                this.$emit('update', {
                    [this.keyOfAttr]: {
                        children: this.attr
                    }
                })
            else this.$emit('update', this.attr)
        }
    },
    components: {
        iconPicker,colorPicker,ioniconPicker
    }
}
</script>
