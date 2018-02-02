
![banner][1]

Vue-Layout
==

基于UI组件的Vue可视化布局、生成.vue代码的工具。https://jaweii.github.io/Vue-Layout/dist/  

----------

演示
--

使用

![demo1][2]

效果


![demo2][3]

上图的后台布局例子，你可以进入这个页面访问其布局：https://jaweii.github.io/Vue-Layout/dist/#/share/5993d3b05c497d0057c6f2da  
也可以进入这个页面体验其布局效果：https://jaweii.github.io/Vue-Layout/dist/#/preview/pc/5993d3b05c497d0057c6f2da


源码结构
====

    ├─App.vue
    ├─main.js
    ├─utils
    |   ├─guid.js                        //返回一个唯一标识符，组件被拖入后的id就是调用此方法获得
    |   ├─leancloud storage.js           //分享功能，将Vuex数据保存到云端，使用leanCloud
    |   └mergeDeep.js                    //深度合并对象的方法
    ├─store
    |   └index.js                        //Vuex
    ├─router
    |   └index.js                        //Vue-Router
    ├─components
    |     ├─attributes.vue               //左侧的属性视图组件
    |     ├─colorList.js                 //颜色选择器中颜色的列表
    |     ├─colorPicker.vue              //颜色选择器组件
    |     ├─components.vue               //右侧的组件列表视图
    |     ├─componentTree.vue            //左侧的组件树
    |     ├─iconList.js                  //图标选择器中图标的列表
    |     ├─iconPicker.vue               //图标选择器
    |     ├─main.vue                     //主页面
    |     ├─mount.js                     //封装的挂载方法
    |     ├─preview.vue                  //预览视图的组件
    |     ├─preview_mobile.vue           //手机预览的组件
    |     ├─preview_product.vue          //体验拖拽完成的作品的页面
    |     ├─subAttribute.vue             //属性视图的子属性组件
    |     ├─template                     //UI组件的模板目录
    |     |    ├─index.js                //提供了三个方法，主要使用getTemplate来实现拖入控件后，得到一个组件对象并保存到vuex
    |     |    ├─README.md
    |     |    ├─Muse-UI                 //UI分类目录
    |     |    |    ├─App Bar.js         //UI组件之一
    |     |    |    ├─  ………
    |     |    |    ├─Time Picker.js
    |     |    |    └Tr.js
    |     |    ├─Mint-UI
    |     |    |    ├─Button.js
    |     |    |    ├─Header.js
    |     |    |    └index.js
    |     |    ├─Common
    |     |    |   ├─A.js
    |     |    |   ├─  ………
    |     |    |   └Text.js
    |     ├─list                         //右侧的组件列表视图中，所显示的组件的列表，由于有的行数太多，就提取了出来
    |     |  ├─muse-ui
    |     |  |    ├─appbar.vue
    |     |  |    ├─  ………
    |     |  |    └timePicker.vue
    ├─assets                             //所需资源
    |   ├─logo.png
    |   ├─css
    |   |  ├─global.css                  //全局样式
    |   |  ├─theme-dark.css              //Muse-UI的自定义主题（红色风格）
    |   |  ├─highlight                   //代码格式化后的高亮样式

 


  [1]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/static/banner.JPG
  [2]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/static/demo1.gif
  [3]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/static/demo2.gif

  [4]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/docs/images/App%20Bar1.png
  [5]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/docs/images/Header%201.png
  [6]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/docs/images/getTemplte.png
 
