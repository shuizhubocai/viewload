# 视图加载

- viewload.js支持最新webkit浏览器，建议移动端使用

- viewload.shim.js支持全部浏览器，建议在pc端使用

# npm本地安装使用

```bash
npm install viewload --save-dev
```
- 文件中导入
```javascript
import Viewload from 'viewload'

/**
 * Viewload 视图加载的构造函数
 * @param container        元素的容器id名称，类型string
 * @param selector         参与元素的样式名，类型string
 * @param loadAttr         要加载资源的属性
 * @param picPlaceholder   默认图片
 * @param threshold        距离可视范围偏移值，负值表示提前进入，正值表示延迟进入
 * @param effectFadeIn     是否渐入显示，默认是false
 * @param callback         进入可视区域后的回调函数，接收两个个参数，ele元素，loadAttr加载资源
 */
     
new Viewload({
  selector: 'viewload',
  loadAttr: 'data-src',
  threshold: -100
})
```

# html中直接引入script

```html
<!--移动端使用-->
<script src="https://unpkg.com/viewload@1.0.0/viewload.js"></script>
<!--兼容pc使用-->
<script src="https://unpkg.com/viewload@1.0.0/viewload.shim.js"></script>
```
