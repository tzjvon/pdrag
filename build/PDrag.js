
(function (global, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    }else if (typeof define == "function" && define.amd) {
        define(function () {
            return factory();
        })
    }else {
        window['PDrag'] = factory();
    }
})(window, function () {

    function noop() { }
    function hasClass(el, cl) {
        return el.className.match(new RegExp('(\\s|^)(' + cl + ')(\\s|$)'));
    }
    function addClass(el, cl) {
        if (!hasClass(el, cl)) {
            el.className += (el.className ? ' ' : '') + cl;
        }
    }
    function removeClass(el, cl) {
        if (hasClass(el, cl)) {
            var arr = el.className.split(/\s+/);
            arr.splice( arr.indexOf(cl), 1 );
            el.className = arr.join(' ');
        }
    }

    function addEvent(el, type, fn, bubble) {
        el.addEventListener(type, fn, bubble);
    }
    function addEventOnce(el, type, fn, bubble) {
        el.addEventListener(type, function () {
            el.removeEventListener(type, arguments.callee);
            fn();
        }, bubble);
    }
    function removeEvent(el, type, fn){
        el.removeEventListener(type, fn)
    }
    function setAttrs(el, obj) {
        for (var key in obj) {
            el.setAttribute(key, obj[key]);
        }
    }
    function _A(a) {
        return Array.prototype.slice.apply(a, Array.prototype.slice.call(arguments,1));
    }
    function _bind(fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    }

    function PDrag(_calssName, options) {
        if (typeof _calssName == 'string') {
            this.cl = _calssName
        }else {
            this.cl = '.pdrag'
        }
        this.drags = document.querySelectorAll(this.cl);
        this.drags = Array.prototype.slice.call(this.drags);

        this.currDragEl = null;  /* 拖动的元素 */
        this.currDragElNextEl = null;   /* 拖动元素的下一个元素 */
        this.currDragElParent = null;  /* 拖动元素的父节点 */
        this.tEl = null;        /* 拖动到的目标元素 */

        this.opts = {
            dragenterClass: ''
        }

        if (options) {
            for (var key in options) {
                if (Object.prototype.hasOwnProperty.call(options, key)) {
                    this.opts[key] = options[key];
                }
            }
        }

        this._setting();
        this._init();
    }
    var PDp = PDrag.prototype;

    PDp._setting = function () {
        this.drags.forEach(function (el, i) {
            el.index = i;
            setAttrs(el, {
                "draggable": "true"
            });
        })
    }

    PDp._init = function () {
        this.bindEvent();
    }

    PDp.handleEvent = function (e) {
        var evt = e || window.event;

        switch (evt.type) {
            case 'dragstart':
                this._dragstart(evt);
                break;
            case 'dragenter':
                this._dragenter(evt);
                break;
            case 'dragover':
                evt.preventDefault();
                break;
            case 'dragleave':
                this._dragleave(evt);
                break;
            case 'drop':
                this._drop(evt);
                break;
        }

    }

    PDp.bindEvent = function () {
        var self = this;
        this.drags.forEach(function (el) {

            removeEvent(el, 'dragstart', self);
            removeEvent(el, 'dragenter', self);
            removeEvent(el, 'dragover', self);
            removeEvent(el, 'dragleave', self);
            removeEvent(el, 'drop', self);

            addEvent(el, 'dragstart', self);
            addEvent(el, 'dragenter', self);
            addEvent(el, 'dragover', self);
            addEvent(el, 'dragleave', self);
            addEvent(el, 'drop', self);

        });
    }

    PDp._drop = function (e) {
        this.moveCurrDragEl(e);
        this.moveTEl(e);

        var target = e.target;
        removeClass(target, this.opts.dragenterClass)
    }

    PDp._dragstart = function (e) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', e.target.index);

        this.currDragEl = e.target;
        this.currDragElNextEl = this.currDragEl.nextElementSibling;
        this.currDragElParent = this.currDragEl.parentElement;
    }

    PDp._dragenter = function (e) {
        var target = e.target;
        if (this.currDragEl == target) { return; }
        addClass(target, this.opts.dragenterClass);
    }

    PDp._dragleave = function (e) {
        var target = e.target;
        if (this.currDragEl == target) { return; }
        removeClass(target, this.opts.dragenterClass)
    }

    PDp.moveCurrDragEl = function (e) {
        if (this.currDragEl !== e.target) {
            var newItem = this.currDragEl,
                existingItem = e.target.nextElementSibling;
            if (e.target.nextElementSibling && e.target.nextElementSibling === newItem) {
                existingItem = e.target;
            }

            return e.target.parentElement.insertBefore(newItem, existingItem);
        }
    }
    PDp.moveTEl = function (e) {
        var newItem = e.target;
        return this.currDragElParent.insertBefore(newItem, this.currDragElNextEl)
    }

    PDp.update = function () {
        this.drags = document.querySelectorAll(this.cl);
        this.drags = Array.prototype.slice.call(this.drags);

        this._setting();
        this._init();
    }

    return PDrag;

})



