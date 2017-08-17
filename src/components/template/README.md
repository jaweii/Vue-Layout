如何拓展UI可视化组件？
==

 1. 如果是新增的UI，先在main.js中引入，然后在`./src/components/template`路径下，创建对应的UI的文件夹（如果没有）；
 2. copy已有的类似组件。假设你要拓展mint-ui的导航栏组件，你可以直接复制muse-ui的导航栏（`./src/components/template/Muse-UI/App Bar.js`）到Mint-UI目录中，修改文件名为Header.js、以及其中的部分代码即可：
 ![此处输入图片的描述][1]
  主要就是修改红框部分的内容，attributes和slots参照UI文档的API，template改成对应组件的标签名，当然每个UI、每个组件都不同，有的只需要稍作修改，有的则需要改很多。
每次属性视图上触发的属性更新，都会让handle函数执行一遍，并传入新的属性、嵌套以及组件的信息，然后返回拼凑的新模板，重新挂载到预览视图。**属性可视化编辑的功能就是这么实现的。**
 
 3. header.js完成后，在`./src/components/template/Mint-UI/index.js`中引入，
![此处输入图片的描述][2]
图中的键名的写法，是因为有的键名包含空格，比如"App Bar",为了直观和便于维护，命名都是与UI官方文档相同。
 
 4. 再将添加的Header组件添加到组件列表视图即可。

> 
                <li draggable="true" @dragstart="dragStart" data-name="Header">
                    <mt-header fixed title="Header"></mt-header>
                </li>


li标签包裹的元素，就是显示在组件列表视图的元素，其中li的data-name的值必须与上一步骤中保存的键名相同。

到此，一个mint-ui导航栏组件的可视化就拓展完成了。

完结，撒花。

 


  [1]: https://raw.githubusercontent.com/jaweii/Vue-Layout/master/docs/images/App%20Bar1.png
  [2]:  https://raw.githubusercontent.com/jaweii/Vue-Layout/master/docs/images/Header%201.png