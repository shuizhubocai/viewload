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
```

# html中直接引入script

```html
<!--兼容pc使用-->
<script src="https://unpkg.com/viewload@1.0.0/viewload.js"></script>
<!--移动端使用-->
<script src="https://unpkg.com/viewload@1.0.0/viewload.shim.js"></script>
```
