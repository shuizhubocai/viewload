/**
 * viewload 视图加载无依赖兼容版。兼容ie，chrome，firefox等主流浏览器，建议在pc端使用
 * Author : 水煮菠菜 949395345@qq.com
 * Url : https://github.com/shuizhubocai
 * Date : 2017-4-17
 */

(function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function () {
            return factory(root);
        })
    } else if (typeof exports == 'object') {
        module.exports = factory(root);
    } else {
        root.Viewload = factory(root);
    }
})(this, function (root) {

    //工具函数
    var _util = {
        /**
         * extend 合并对象
         * @param target 被合并的对象
         * @param obj
         * @returns Object
         */
        extend: function (target, obj) {
            if (Object.assign) {
                target = Object.assign(target, obj);
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        target[key] = obj[key];
                    }
                }
            }
            return target;
        },
        /**
         * toArray 类数组转数组
         * @param elements
         * @returns Array
         */
        toArray: function (elements) {
            var arr;
            try {
                arr = Array.from(elements) || Array.prototype.slice.call(elements);
            } catch (e) {
                arr = [];
                for (var i = 0; i < elements.length; i++) {
                    arr.push(elements[i]);
                }
            }
            return arr;
        },
        /**
         * getEleById 通过id获取dom
         * @param id
         * @returns {Element}
         */
        getEleById: function (id) {
            return typeof id == 'object' && id.nodeType == 1 ? id : document.getElementById(id);
        },
        /**
         * getViewInfo 获取可视宽高，默认是window，html中没有doctype标签会导致结果不正确
         * @param contianer
         * @returns Object width是宽，height是高
         */
        getViewInfo: function (container) {
            var info = {};
            if (!container || container == window) {
                info.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                info.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            } else {
                container = this.getEleById(container);
                info.width = container.clientWidth;
                info.height = container.clientHeight;
            }
            return info;
        },
        /**
         * getScrollPosition 获取滚动条位置
         * @param container 容器
         * @returns Object top垂直方向，left水平方向
         */
        getScrollPosition: function (container) {
            var position = {};
            if (!container || container == window) {
                position.top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                position.left = window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft;
            } else {
                if (typeof container == 'string') {
                    position.top = document.getElementById(container).scrollTop;
                    position.left = document.getElementById(container).scrollLeft;
                }
                if (typeof container == 'object') {
                    position.top = container.scrollTop;
                    position.left = container.scrollLeft;
                }
            }
            return position;
        },
        /**
         * getElesByClassName 通过类名获取dom
         * @param className
         * @param parent 限定查找范围的id
         * @returns Array
         */
        getElesByClassName: function (className, parent) {
            var reg = new RegExp('\\b' + className + '\\b'),
                parent = typeof parent == 'string' ? document.getElementById(parent) : typeof parent == 'object' ? parent : null,
                _this = this,
                len,
                eles;
            if (document.getElementsByClassName) {
                eles = parent ? parent.getElementsByClassName(className) : document.getElementsByClassName(className);
                eles = _this.toArray(eles);
            } else {
                eles = parent ? parent.getElementsByTagName('*') : document.getElementsByTagName('*'),
                    eles = _this.toArray(eles),
                    len = eles.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (!reg.test(eles[i].className)) {
                        eles.splice(i, 1)
                    }
                }
            }
            return eles;
        },
        /**
         * getCSS 获取元素css样式值
         * @param ele
         * @param attr
         * @returns string
         */
        getCSS: function (ele, attr) {
            var ele = this.getEleById(ele),
                attr = attr.toLowerCase(),
                result;
            if (window.getComputedStyle) {
                result = window.getComputedStyle(ele, null)[attr];
            } else {
                result = ele.currentStyle[attr];
            }
            return result;
        },
        /**
         * offset 获取元素距离顶部值
         * @param ele
         * @returns {{top: number, left: number}}
         */
        offset: function (ele) {
            var result = {
                top: 0,
                left: 0
            };
            while (ele) {
                result.top += ele.offsetTop;
                result.left += ele.offsetLeft;
                ele = ele.offsetParent;
            }
            return result;
        },
        /**
         * addEvent 添加事件，修正this指向
         * @param ele
         * @param type
         * @param fn
         */
        addEvent: function (ele, type, fn) {
            if (ele.addEventListener) {
                ele.addEventListener(type, fn, false);
            } else if (ele.attachEvent) {
                ele[type + fn] = function () {
                    fn.call(ele, window.event);
                }
                ele.attachEvent('on' + type, ele[type + fn]);
            }
        },
        /**
         * removeEvent 删除事件
         * @param ele
         * @param type
         * @param fn
         */
        removeEvent: function (ele, type, fn) {
            if (ele.removeEventListener) {
                ele.removeEventListener(type, fn, false);
            } else if (ele.detachEvent) {
                ele.detachEvent('on' + type, ele[type + fn]);
                ele[type + fn] = null;
            }
        },
        /**
         * debounce 函数去抖
         * @param fn
         * @param delay
         */
        debounce: function (fn, delay) {
            var timer;
            return function () {
                var _this = this,
                    _arg = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(_this, _arg);
                }, delay);
            }
        },
        /**
         * bind 更改函数this指向
         * @param ele
         * @param fn
         * @returns function
         */
        bind: function (ele, fn) {
            var _this = this,
                result;
            if (fn.bind) {
                result = fn.bind(ele);
            } else {
                result = function () {
                    fn.apply(ele, _this.toArray(arguments).slice(1));
                }
            }
            return result;
        }
    };

    /**
     * Viewload 视图加载的构造函数
     * @param container        元素的容器id名称，类型string
     * @param selector         参与元素的样式名，类型string
     * @param loadAttr         要加载资源的属性
     * @param picPlaceholder   默认图片
     * @param threshold        距离可视范围偏移值，负值表示提前进入，正值表示延迟进入
     * @param callback         进入可视区域后的回调函数，接收两个个参数，ele元素，loadAttr加载资源
     */
    function Viewload(options) {
        this.options = {
            container: window,
            selector: 'viewload',
            loadAttr: 'data-original',
            picPlaceholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            threshold: 0,
            callback: function () {
            }
        };
        /**
         * inView 元素是否在可视范围内
         * @param ele
         * @returns {boolean}
         */
        this.inView = function (ele) {
            var isInView = false,
                scrollPosition = _util.getScrollPosition(this.options.container),
                viewInfo = _util.getViewInfo(this.options.container),
                offset = _util.offset(ele),
                threshold = parseFloat(this.options.threshold, 10),
                rect;
            if (ele.getBoundingClientRect) {
                rect = ele.getBoundingClientRect();
                if (rect.bottom > threshold && rect.top + threshold < viewInfo.height && rect.right > threshold && rect.left + threshold < viewInfo.width) {
                    isInView = true;
                }
            } else {
                if (offset.top + threshold < scrollPosition.top + viewInfo.height && offset.top + ele.offsetHeight > scrollPosition.top + threshold && offset.left + threshold < scrollPosition.left + viewInfo.width && offset.left + ele.offsetWidth > scrollPosition.left + threshold) {
                    isInView = true;
                }
            }
            return isInView;
        };
        /**
         * render 加载资源
         */
        this.render = function () {
            var _this = this,
                eles,
                len,
                loadAttr,
                i;
            if (this.options.eles.constructor !== Array) {
                this.options.eles = Array.from(this.options.eles);
            }
            eles = this.options.eles;
            len = eles.length;
            for (i = len - 1; i >= 0; i--) {
                //对display:none的元素不做处理
                if (_util.getCSS(eles[i], 'display') == 'none') {
                    eles.splice(i, 1);
                    continue;
                }
                if (this.inView(eles[i])) {
                    loadAttr = eles[i].getAttribute(this.options.loadAttr);
                    //加载元素是img元素
                    if (eles[i].nodeName.toLocaleLowerCase() == 'img') {
                        if (loadAttr) {
                            eles[i].src = loadAttr;
                            _util.addEvent(eles[i], 'error', function () {
                                this.src = _this.options.picPlaceholder;
                            })
                        }
                    }
                    this.options.callback(eles[i], loadAttr);
                    eles.splice(i, 1);
                }
            }
            if (!len) {
                _util.removeEvent(this.options.container, 'scroll', this.options.fn);
                _util.removeEvent(this.options.container, 'resize', this.options.fn);
            }
        };
        /**
         * bindUI 绑定事件
         */
        this.bindUI = function () {
            _util.addEvent(this.options.container, 'scroll', this.options.fn);
            _util.addEvent(this.options.container, 'resize', this.options.fn);
        };
        this.init(options);
    }

    /**
     * init 初始化函数
     * @param options
     */
    Viewload.prototype.init = function (options) {
        this.options = _util.extend(this.options, options || {});
        this.options.container = this.options.container == window ? window : _util.getEleById(this.options.container);
        this.options.eles = _util.getElesByClassName(this.options.selector, this.options.container == window ? '' : this.options.container);
        this.options.fn = _util.debounce(_util.bind(this, this.render), 100);
        this.render();
        this.bindUI();
    };

    return Viewload;
});