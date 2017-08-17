import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            href: {
                type: 'text',
                value: '',
                describ: '相当于 a 标签的 href属性，设置之后会渲染成 a 标签，默认是使用div标签'
            },
            tag: {
                type: 'text',
                value: '',
                describ: '有时候想要 <router-link> 渲染成某种标签，例如 <li>。 于是我们使用 tag prop 类指定何种标签，同样它还是会监听点击，触发导航。'
            },
            activeClass: {
                type: 'text',
                value: '',
                describ: '设置 链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 linkActiveClass 来全局配置。'
            },
            exact: {
                type: 'text',
                value: '',
                describ: '"是否激活" 默认类名的依据是 inclusive match （全包含匹配）。 举个例子，如果当前的路径是 /a 开头的，那么 <router-link to="/a"> 也会被设置 CSS 类名。'
            },
            target: {
                type: 'text',
                value: '',
                items: ['_blank', 'self', '_parent', '_top'],
                describ: '相当于 a 标签的target属性'
            },
            title: {
                type: 'text',
                value: '',
                describ: 'listItem 的标题文字'
            },
            titleClass: {
                type: 'text',
                value: '',
                describ: '标题文字样式，同 class 绑定方式一致'
            },
            afterText: {
                type: 'text',
                value: '',
                describ: '标题行最右边的文字'
            },
            afterTextClass: {
                type: 'text',
                value: '',
                describ: '标题行最右边的文字样式，同 class 绑定方式一致'
            },
            describeText: {
                type: 'text',
                value: '',
                describ: '大段描述文字'
            },
            describeLine: {
                type: 'number',
                value: '',
                describ: '描述文字行数'
            },
            describeTextClass: {
                type: 'text',
                value: '',
                describ: '描述文字样式，同 class 绑定方式一致'
            },
            inset: {
                type: 'boolean',
                value: false,
                describ: '是否向内缩进, 会调整paddingLeft 为 72px'
            },
            disabled: {
                type: 'boolean',
                value: false,
                describ: '设置为 true ，则不会触发点击事件，没有 focusRipple 和 touchRipple 的效果'
            },
            disableRipple: {
                type: 'boolean',
                value: false,
                describ: '设置为 true , 没有 focusRipple 和 touchRipple 的效果, 但是会触发点击事件'
            },
            value: {
                type: 'text',
                value: '',
                describ: '当 value 和 list 组件的 value 值相等时，组件呈现被选择状态'
            },
            toggleNested: {
                type: 'boolean',
                value: false,
                describ: '是否可以自动切换嵌套列表的显示'
            },
            toggleIconClass: {
                type: 'text',
                value: '',
                describ: '切换显示的图标样式，同 class 绑定方式一致'
            },
            nestedListClass: {
                type: 'text',
                value: '',
                describ: '嵌套列表样式'
            },
            open: {
                type: 'boolean',
                value: false,
                describ: '设为true，显示嵌套的列表'
            }
        },
        slots = {
            left: [],
            leftAvatar: [],
            right: [],
            rightAvatar: [],
            title: [],
            after: [],
            describe: [],
            nested: [],
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots) || ''
        //设置当前组件的slot
    if (attributes.slot && attributes.slot!=='default') {
        attributes.slot = {
            type: 'text',
            value: attributes.slot
        }
    } else {
        attributes.slot = {
            type: 'text',
            value: ''
        }
    }

    //字符串模板操作
    let stringAttr = getStringTypeAttr(attributes)
    let template = `<mu-list-item 
                        ${stringAttr}>
                        ${subContent}
                    </mu-list-item>`

    return { template, attributes, slots }
}
export default handle
