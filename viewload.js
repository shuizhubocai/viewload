/**
 * viewload 视图加载无依赖基础版。支持最新webkit浏览器，建议在移动端使用
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
        }
    };

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
    function Viewload(options) {
        this.options = {
            container: window,
            selector: 'viewload',
            loadAttr: 'data-original',
            picPlaceholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            threshold: 0,
            effectFadeIn: false,
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
                _this = this,
                scrollPosition = {
                    top: _this.options.container == window ? window.pageYOffset : _this.options.container.scrollTop,
                    left: _this.options.container == window ? window.pageXOffset : _this.options.container.scrollLeft
                },
                viewInfo = {
                    width: _this.options.container == window ? window.innerWidth : _this.options.container.clientWidth,
                    height: _this.options.container == window ? window.innerHeight : _this.options.container.clientHeight
                },
                threshold = this.options.threshold,
                rect = ele.getBoundingClientRect();
            if (rect.bottom > threshold && rect.top + threshold < viewInfo.height && rect.right > threshold && rect.left + threshold < viewInfo.width) {
                isInView = true;
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
                i,
                eleFadeIn;
            if (this.options.eles.constructor !== Array) {
                this.options.eles = Array.from(this.options.eles);
            }
            eles = this.options.eles;
            len = eles.length;
            eleFadeIn = function (ele) {
                if (ele.timer == undefined) {
                    ele.timer = setInterval(function () {
                        ele.style.opacity = parseFloat(ele.style.opacity, 10) + 0.1;
                        if (ele.style.opacity >= 1) {
                            clearInterval(ele.timer);
                        }
                    }, 100)
                }
            };
            for (i = len - 1; i >= 0; i--) {
                //对display:none的元素不做处理
                if (window.getComputedStyle(eles[i], null).display == 'none') {
                    eles.splice(i, 1);
                    continue;
                }
                if (this.inView(eles[i])) {
                    loadAttr = eles[i].getAttribute(this.options.loadAttr);
                    //加载元素是img元素
                    if (eles[i].nodeName.toLocaleLowerCase() == 'img') {
                        if (loadAttr) {
                            if (this.options.effectFadeIn) {
                                eles[i].img = new Image();
                                eles[i].img.src = loadAttr;
                                eles[i].img.ele = eles[i];
                                eles[i].img.addEventListener('error', function () {
                                    this.ele.src = _this.options.picPlaceholder;
                                }, false);
                                eles[i].img.addEventListener('load', function () {
                                    this.ele.src = loadAttr;
                                    this.ele.style.opacity = 0;
                                    eleFadeIn(this.ele);
                                }, false);
                            } else {
                                eles[i].src = loadAttr;
                                eles[i].addEventListener('error', function () {
                                    this.src = _this.options.picPlaceholder;
                                }, false);
                            }
                        }
                    }
                    this.options.callback(eles[i], loadAttr);
                    eles.splice(i, 1);
                }
            }
            if (!len) {
                this.options.container.removeEventListener('scroll', this.options.fn, false);
                this.options.container.removeEventListener('resize', this.options.fn, false);
            }
        };
        /**
         * bindUI 绑定事件
         */
        this.bindUI = function () {
            this.options.container.addEventListener('scroll', this.options.fn, false);
            this.options.container.addEventListener('resize', this.options.fn, false);
        };
        this.init(options);
    }

    /**
     * init 初始化函数
     * @param options
     */
    Viewload.prototype.init = function (options) {
        this.options = Object.assign(this.options, options || {});
        this.options.container = this.options.container == window ? window : document.getElementById(this.options.container);
        this.options.eles = this.options.container == window ? document.getElementsByClassName(this.options.selector) : this.options.container.getElementsByClassName(this.options.selector);
        this.options.fn = _util.debounce(this.render.bind(this), 100);
        this.render();
        this.bindUI();
    };

    return Viewload;
});