// Platform: android
// 3.4.0
/*
 Licensed ...
*/
;(function() {
var CORDOVA_JS_BUILD_LABEL = '3.4.0';
// file: src/scripts/require.js

// 定义2个cordova.js内部使用的全局函数require/define
var require,
    define;

// 通过自调用的匿名函数来实例化全局函数require/define
(function () {
    // 全部模块
    var modules = {},
        // 正在build中的模块ID的栈
        requireStack = [],
        // 标示正在build中模块ID的Map
        inProgressModules = {},
        SEPARATOR = ".";

    // 模块build
    function build(module) {
        // 备份工厂方法  
        var factory = module.factory,
            // 对require对象进行特殊处理
            localRequire = function (id) {
                var resultantId = id;
                // 处理相对路径的调用
                if (id.charAt(0) === ".") {
                    resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
                }
                return require(resultantId);
            };
        // 给模块定义一个空的exports对象，防止工厂类方法中的空引用
        module.exports = {};
        // 删除工厂方法标示该模块是否build过
        delete module.factory;
        // 调用备份的工厂方法（参数必须是require,exports,module）
        factory(localRequire, module.exports, module);
        // 返回工厂方法中实现的module.exports对象
        return module.exports;
    }

    // 加载模块
    require = function (id) {
        // 如果模块不存在抛出异常  
        if (!modules[id]) {
            throw "module " + id + " not found";
            // 如果模块正在build中抛出异常  
        } else if (id in inProgressModules) {
            var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
            throw "Cycle in require graph: " + cycle;
        }
        // 如果模块存在工厂方法说明还未进行build（require嵌套）
        if (modules[id].factory) {
            try {
                // 标示该模块正在build
                inProgressModules[id] = requireStack.length;
                // 将该模块压入请求栈
                requireStack.push(id);
                // 模块build，成功后返回module.exports
                return build(modules[id]);
            } finally {
                // build完成后删除当前请求
                delete inProgressModules[id];
                requireStack.pop();
            }
        }
        // build完的模块直接返回module.exports
        return modules[id].exports;
    };

    // 定义模块
    define = function (id, factory) {
        // 如果已经存在抛出异常
        if (modules[id]) {
            throw "module " + id + " already defined";
        }
        // 模块以ID为索引包含ID和工厂方法
        modules[id] = {
            id: id,
            factory: factory
        };
    };

    // 移除模块
    define.remove = function (id) {
        delete modules[id];
    };

    // 返回所有模块
    define.moduleMap = modules;
})();

// 如果处于nodejs环境的话，把require/define暴露给外部
if (typeof module === "object" && typeof require === "function") {
    module.exports.require = require;
    module.exports.define = define;
}

// file: src/cordova.js
define("cordova", function(require, exports, module) {

// 调用通道和平台模块
var channel = require('cordova/channel');
var platform = require('cordova/platform');

// 备份document和window的事件监听器
var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

// 保存自定义的document和window的事件监听器
var documentEventHandlers = {},
    windowEventHandlers = {};

// 拦截document和window的事件监听器（addEventListener/removeEventListener）
// 存在自定义的事件监听器的话，使用自定义的；不存在的话调用备份document和window的事件监听器
document.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof documentEventHandlers[e] != 'undefined') {
        documentEventHandlers[e].subscribe(handler);
    } else {
        m_document_addEventListener.call(document, evt, handler, capture);
    }
};
window.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof windowEventHandlers[e] != 'undefined') {
        windowEventHandlers[e].subscribe(handler);
    } else {
        m_window_addEventListener.call(window, evt, handler, capture);
    }
};
document.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof documentEventHandlers[e] != "undefined") {
        documentEventHandlers[e].unsubscribe(handler);
    } else {
        m_document_removeEventListener.call(document, evt, handler, capture);
    }
};
window.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof windowEventHandlers[e] != "undefined") {
        windowEventHandlers[e].unsubscribe(handler);
    } else {
        m_window_removeEventListener.call(window, evt, handler, capture);
    }
};

// 创建一个指定type的事件。
// 参考：https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent#Notes
function createEvent(type, data) {
    var event = document.createEvent('Events');
    // 指定事件名、不可冒泡、不可取消
    event.initEvent(type, false, false);
    // 自定义数据
    if (data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                event[i] = data[i];
            }
        }
    }
    return event;
}

// 外部访问cordova.js的入口
var cordova = {
    // 模块系统
    define:define,
    require:require,
    // 版本号和平台名
    version:CORDOVA_JS_BUILD_LABEL,
    platformId:platform.id,

    // 为了拦截document和window的事件监听器,添加或删除自定义的事件监听器
    addWindowEventHandler:function(event) {
        return (windowEventHandlers[event] = channel.create(event));
    },
    // sticky 是指一旦被调用那么它以后都保持被调用的状态，所定义的监听器会被立即执行。
    // 比如： deviceready事件只触发一次，以后的所有监听都是立即执行的。
    addStickyDocumentEventHandler:function(event) { 
        return (documentEventHandlers[event] = channel.createSticky(event));
    },
    addDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.create(event));
    },
    removeWindowEventHandler:function(event) {
        delete windowEventHandlers[event];
    },
    removeDocumentEventHandler:function(event) {
        delete documentEventHandlers[event];
    },

    // 获取拦截前的document和window的事件监听器
    getOriginalHandlers: function() {
        return {'document': {'addEventListener': m_document_addEventListener, 'removeEventListener': m_document_removeEventListener},
        'window': {'addEventListener': m_window_addEventListener, 'removeEventListener': m_window_removeEventListener}};
    },

    // 调用document的事件
    fireDocumentEvent: function(type, data, bNoDetach) {
        var evt = createEvent(type, data);
        if (typeof documentEventHandlers[type] != 'undefined') {
            // 判断是否需要抛出事件异常
            if( bNoDetach ) {
                // 通过Channel的fire方法来调用事件（apply）
                documentEventHandlers[type].fire(evt);
            }
            else {
                // setTimeout(callback, 0) 的意思是DOM构成完毕、事件监听器执行完后立即执行
                setTimeout(function() {
                    // 调用加载cordova.js之前定义的那些deviceready事件
                    if (type == 'deviceready') {
                        document.dispatchEvent(evt);
                    }
                    // 通过Channel的fire方法来调用事件（apply）
                    documentEventHandlers[type].fire(evt);
                }, 0);
            }
        } else {
            // 直接调用事件
            document.dispatchEvent(evt);
        }
    },

    // 调用window的事件
    fireWindowEvent: function(type, data) {
        var evt = createEvent(type,data);
        if (typeof windowEventHandlers[type] != 'undefined') {
            setTimeout(function() {
                windowEventHandlers[type].fire(evt);
            }, 0);
        } else {
            window.dispatchEvent(evt);
        }
    },

    // 插件回调相关-------------------------------------

    // 回调ID中间的一个随机数(真正的ID：插件名+随机数)
    callbackId: Math.floor(Math.random() * 2000000000),
    // 回调函数对象，比如success,fail
    callbacks:  {},
    // 回调状态
    callbackStatus: {
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },

    // 以后使用callbackFromNative代替callbackSuccess和callbackError 
    callbackSuccess: function(callbackId, args) {
        try {
            cordova.callbackFromNative(callbackId, true, args.status, [args.message], args.keepCallback);
        } catch (e) {
            console.log("Error in error callback: " + callbackId + " = "+e);
        }
    },
    callbackError: function(callbackId, args) {
        try {
            cordova.callbackFromNative(callbackId, false, args.status, [args.message], args.keepCallback);
        } catch (e) {
            console.log("Error in error callback: " + callbackId + " = "+e);
        }
    },

    // 调用回调函数
    callbackFromNative: function(callbackId, success, status, args, keepCallback) {
        var callback = cordova.callbacks[callbackId];
        // 判断是否定义了回调函数
        if (callback) {
            if (success && status == cordova.callbackStatus.OK) {
                // 调用success函数
                callback.success && callback.success.apply(null, args);
            } else if (!success) {
                // 调用fail函数
                callback.fail && callback.fail.apply(null, args);
            }
            // 如果设置成不再保持回调，删除回调函数对象
            if (!keepCallback) {
                delete cordova.callbacks[callbackId];
            }
        }
    },

    // 没有地方用到！
    // 目的是把你自己的函数在注入到Cordova的生命周期中。
    addConstructor: function(func) {
        channel.onCordovaReady.subscribe(function() {
            try {
                func();
            } catch(e) {
                console.log("Failed to run constructor: " + e);
            }
        });
    }
};

module.exports = cordova;

});

// file: src/android/android/nativeapiprovider.js
define("cordova/android/nativeapiprovider", function(require, exports, module) {

// WebView中是否通过addJavascriptInterface提供了访问ExposedJsApi.java的_cordovaNative对象
// 如果不存在选择prompt()形式的交互方式
var nativeApi = this._cordovaNative || require('cordova/android/promptbasednativeapi');
var currentApi = nativeApi;

module.exports = {
    // 获取当前交互方式
    get: function() { return currentApi; },

    // 设置使用prompt()交互方式
    // （true:prompt false:自动选择）
    setPreferPrompt: function(value) {
        currentApi = value ? require('cordova/android/promptbasednativeapi') : nativeApi;
    },

    // 直接设置交互方式对象（很少用到）
    set: function(value) {
        currentApi = value;
    }
};

});

// file: src/android/android/promptbasednativeapi.js
define("cordova/android/promptbasednativeapi", function(require, exports, module) {

// 由于Android2.3模拟器存在Bug，不支持addJavascriptInterface()
// 所以借助prompt()来和Native进行交互
// Native端会在CordovaChromeClient.onJsPrompt（）中拦截处理
module.exports = {
    // 调用Native API
    exec: function(service, action, callbackId, argsJson) {
        return prompt(argsJson, 'gap:'+JSON.stringify([service, action, callbackId]));
    },

    // 设置Native->JS的桥接模式
    setNativeToJsBridgeMode: function(value) {
        prompt(value, 'gap_bridge_mode:');
    },

    // 接收消息
    retrieveJsMessages: function(fromOnlineEvent) {
        return prompt(+fromOnlineEvent, 'gap_poll:');
    }
};

});

// file: src/common/argscheck.js
define("cordova/argscheck", function(require, exports, module) {

var exec = require('cordova/exec');
var utils = require('cordova/utils');

var moduleExports = module.exports;

var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};

function extractParamName(callee, argIndex) {
    return (/.*?\((.*?)\)/).exec(callee)[1].split(', ')[argIndex];
}

function checkArgs(spec, functionName, args, opt_callee) {
    if (!moduleExports.enableChecks) {
        return;
    }
    var errMsg = null;
    var typeName;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i),
            cUpper = c.toUpperCase(),
            arg = args[i];
        // Asterix means allow anything.
        if (c == '*') {
            continue;
        }
        typeName = utils.typeName(arg);
        if ((arg === null || arg === undefined) && c == cUpper) {
            continue;
        }
        if (typeName != typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
        }
    }
    if (errMsg) {
        errMsg += ', but got ' + typeName + '.';
        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
        // Don't log when running unit tests.
        if (typeof jasmine == 'undefined') {
            console.error(errMsg);
        }
        throw TypeError(errMsg);
    }
}

function getValue(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

moduleExports.checkArgs = checkArgs;
moduleExports.getValue = getValue;
moduleExports.enableChecks = true;


});

// file: src/common/base64.js
define("cordova/base64", function(require, exports, module) {

var base64 = exports;

base64.fromArrayBuffer = function(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    return uint8ToBase64(array);
};

//------------------------------------------------------------------------------

/* This code is based on the performance tests at http://jsperf.com/b64tests
 * This 12-bit-at-a-time algorithm was the best performing version on all
 * platforms tested.
 */

var b64_6bit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64_12bit;

var b64_12bitTable = function() {
    b64_12bit = [];
    for (var i=0; i<64; i++) {
        for (var j=0; j<64; j++) {
            b64_12bit[i*64+j] = b64_6bit[i] + b64_6bit[j];
        }
    }
    b64_12bitTable = function() { return b64_12bit; };
    return b64_12bit;
};

function uint8ToBase64(rawData) {
    var numBytes = rawData.byteLength;
    var output="";
    var segment;
    var table = b64_12bitTable();
    for (var i=0;i<numBytes-2;i+=3) {
        segment = (rawData[i] << 16) + (rawData[i+1] << 8) + rawData[i+2];
        output += table[segment >> 12];
        output += table[segment & 0xfff];
    }
    if (numBytes - i == 2) {
        segment = (rawData[i] << 16) + (rawData[i+1] << 8);
        output += table[segment >> 12];
        output += b64_6bit[(segment & 0xfff) >> 6];
        output += '=';
    } else if (numBytes - i == 1) {
        segment = (rawData[i] << 16);
        output += table[segment >> 12];
        output += '==';
    }
    return output;
}

});

// file: src/common/builder.js
define("cordova/builder", function(require, exports, module) {

var utils = require('cordova/utils');

function each(objects, func, context) {
    for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
        }
    }
}

function clobber(obj, key, value) {
    exports.replaceHookForTesting(obj, key);
    obj[key] = value;
    // Getters can only be overridden by getters.
    if (obj[key] !== value) {
        utils.defineGetter(obj, key, function() {
            return value;
        });
    }
}

function assignOrWrapInDeprecateGetter(obj, key, value, message) {
    if (message) {
        utils.defineGetter(obj, key, function() {
            console.log(message);
            delete obj[key];
            clobber(obj, key, value);
            return value;
        });
    } else {
        clobber(obj, key, value);
    }
}

function include(parent, objects, clobber, merge) {
    each(objects, function (obj, key) {
        try {
            var result = obj.path ? require(obj.path) : {};

            if (clobber) {
                // Clobber if it doesn't exist.
                if (typeof parent[key] === 'undefined') {
                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                } else if (typeof obj.path !== 'undefined') {
                    // If merging, merge properties onto parent, otherwise, clobber.
                    if (merge) {
                        recursiveMerge(parent[key], result);
                    } else {
                        assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                    }
                }
                result = parent[key];
            } else {
                // Overwrite if not currently defined.
                if (typeof parent[key] == 'undefined') {
                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                } else {
                    // Set result to what already exists, so we can build children into it if they exist.
                    result = parent[key];
                }
            }

            if (obj.children) {
                include(result, obj.children, clobber, merge);
            }
        } catch(e) {
            utils.alert('Exception building Cordova JS globals: ' + e + ' for key "' + key + '"');
        }
    });
}

/**
 * Merge properties from one object onto another recursively.  Properties from
 * the src object will overwrite existing target property.
 *
 * @param target Object to merge properties into.
 * @param src Object to merge properties from.
 */
function recursiveMerge(target, src) {
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            if (target.prototype && target.prototype.constructor === target) {
                // If the target object is a constructor override off prototype.
                clobber(target.prototype, prop, src[prop]);
            } else {
                if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
                    recursiveMerge(target[prop], src[prop]);
                } else {
                    clobber(target, prop, src[prop]);
                }
            }
        }
    }
}

exports.buildIntoButDoNotClobber = function(objects, target) {
    include(target, objects, false, false);
};
exports.buildIntoAndClobber = function(objects, target) {
    include(target, objects, true, false);
};
exports.buildIntoAndMerge = function(objects, target) {
    include(target, objects, true, true);
};
exports.recursiveMerge = recursiveMerge;
exports.assignOrWrapInDeprecateGetter = assignOrWrapInDeprecateGetter;
exports.replaceHookForTesting = function() {};

});

// file: src/common/channel.js
define("cordova/channel", function(require, exports, module) {

var utils = require('cordova/utils'),
    nextGuid = 1;

// ①事件通道的构造函数
var Channel = function(type, sticky) {
    // 通道名称
    this.type = type;
    // 通道上的所有事件处理函数Map（索引为guid）
    this.handlers = {};
    // 通道的状态（0：非sticky, 1:sticky但未调用, 2:sticky已调用）
    this.state = sticky ? 1 : 0;
    // 对于sticky事件通道备份传给fire()的参数
    this.fireArgs = null;
    // 当前通道上的事件处理函数的个数
    this.numHandlers = 0;
    // 订阅第一个事件或者取消订阅最后一个事件时调用自定义的处理
    this.onHasSubscribersChange = null;
},

// ②事件通道外部接口
    channel = {

        // 把指定的函数h订阅到c的各个通道上，保证h在每个通道的最后被执行
        join: function(h, c) {
            var len = c.length,
                i = len,
                f = function() {
                    if (!(--i)) h();
                };
            // 把事件处理函数h订阅到c的各个事件通道上
            for (var j=0; j<len; j++) {
                // 必须是sticky事件通道
                if (c[j].state === 0) {
                    throw Error('Can only use join with sticky channels.');
                }
                c[j].subscribe(f);
            }
            // 执行h
            if (!len) h();
        },

        // 创建事件通道
        create: function(type) {
            return channel[type] = new Channel(type, false);
        },

        // 创建sticky事件通道
        createSticky: function(type) {
            return channel[type] = new Channel(type, true);
        },

        // 保存deviceready事件之前要调用的事件
        deviceReadyChannelsArray: [],
        deviceReadyChannelsMap: {},

        // 设置deviceready事件之前必须要完成的事件
        waitForInitialization: function(feature) {
            if (feature) {
                var c = channel[feature] || this.createSticky(feature);
                this.deviceReadyChannelsMap[feature] = c;
                this.deviceReadyChannelsArray.push(c);
            }
        },

        // 以前版本的代码，现在好像没有用！
        initializationComplete: function(feature) {
            var c = this.deviceReadyChannelsMap[feature];
            if (c) {
                c.fire();
            }
        }
    };

// 这个应该放入utils里，就是一个函数的判断
function forceFunction(f) {
    if (typeof f != 'function') throw "Function required as first argument!";
}

// ③修改函数原型共享实例方法-----------------------

// 向事件通道订阅事件处理函数(subscribe部分）
// f:事件处理函数 c:事件的上下文（可省略）
Channel.prototype.subscribe = function(f, c) {
    // 事件处理函数校验
    forceFunction(f);

    // 如果是被订阅过的sticky事件，就直接调用。
    if (this.state == 2) {
        f.apply(c || this, this.fireArgs);
        return;
    }

    var func = f,
        guid = f.observer_guid;

    // 如果事件有上下文，要先把事件函数包装一下带上上下文
    if (typeof c == "object") { func = utils.close(c, f); }

    // 自增长的ID
    if (!guid) {
        guid = '' + nextGuid++;
    }
    // 把自增长的ID反向设置给函数，以后撤消订阅或内部查找用
    func.observer_guid = guid;
    f.observer_guid = guid;

    // 判断该guid索引的事件处理函数是否存在（保证订阅一次）
    if (!this.handlers[guid]) {
        // 订阅到该通道上（索引为guid）
        this.handlers[guid] = func;
        // 通道上的事件处理函数的个数增1
        this.numHandlers++;
        if (this.numHandlers == 1) {
            // 订阅第一个事件时调用自定义的处理（比如：第一次按下返回按钮提示“再按一次...”）
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

// 撤消订阅通道上的某个函数（guid）
Channel.prototype.unsubscribe = function(f) {
    // 事件处理函数校验
    forceFunction(f);

    // 事件处理函数的guid索引
    var guid = f.observer_guid,
    // 事件处理函数
        handler = this.handlers[guid];
    if (handler) {
        // 从该通道上撤消订阅（索引为guid）
        delete this.handlers[guid];
        // 通道上的事件处理函数的个数减1
        this.numHandlers--;
        if (this.numHandlers === 0) {
            // 撤消订阅最后一个事件时调用自定义的处理
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

// 调用所有被发布到该通道上的函数
Channel.prototype.fire = function(e) {
    var fail = false,
        fireArgs = Array.prototype.slice.call(arguments);

    // sticky事件被调用时，标示为已经调用过。
    if (this.state == 1) {
        this.state = 2;
        this.fireArgs = fireArgs;
    }

    if (this.numHandlers) {
        // 把该通道上的所有事件处理函数拿出来放到一个数组中。
        var toCall = [];
        for (var item in this.handlers) {
            toCall.push(this.handlers[item]);
        }
        // 依次调用通道上的所有事件处理函数
        for (var i = 0; i < toCall.length; ++i) {
            toCall[i].apply(this, fireArgs);
        }
        // sticky事件是一次性全部被调用的，调用完成后就清空。
        if (this.state == 2 && this.numHandlers) {
            this.numHandlers = 0;
            this.handlers = {};
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

// ④创建事件通道（publish部分）-----------------------

// （内部事件通道）页面加载后DOM解析完成
channel.createSticky('onDOMContentLoaded');

// （内部事件通道）Cordova的native准备完成
channel.createSticky('onNativeReady');

// （内部事件通道）所有Cordova的JavaScript对象被创建完成可以开始加载插件
channel.createSticky('onCordovaReady');

// （内部事件通道）所有自动load的插件js已经被加载完成
channel.createSticky('onPluginsReady');

// Cordova全部准备完成
channel.createSticky('onDeviceReady');

// 应用重新返回前台
channel.create('onResume');

// 应用暂停退到后台
channel.create('onPause');

// （内部事件通道）应用被关闭（window.onunload）
channel.createSticky('onDestroy');

// ⑤设置deviceready事件之前必须要完成的事件
// ***onNativeReady和onPluginsReady是平台初期化之前要完成的。
channel.waitForInitialization('onCordovaReady');
channel.waitForInitialization('onDOMContentLoaded');

module.exports = channel;

});

// file: src/android/exec.js
define("cordova/exec", function(require, exports, module) {

var cordova = require('cordova'),
    nativeApiProvider = require('cordova/android/nativeapiprovider'),
    utils = require('cordova/utils'),
    base64 = require('cordova/base64'),

    // JS->Native的可选交互形式一览
    jsToNativeModes = {
        // 基于prompt()的交互 
        PROMPT: 0,
        // 基于JavascriptInterface的交互 
        JS_OBJECT: 1,
        // 基于URL的交互 
        // ***由于安全问题，默认已经设置成不可用的！！！
        // NativeToJsMessageQueue.ENABLE_LOCATION_CHANGE_EXEC_MODE=false
        LOCATION_CHANGE: 2
    },

    // Native->JS的可选交互形式一览
    nativeToJsModes = {
        // 轮询（JS->Native自助获取消息）
        POLLING: 0,
        // 使用 webView.loadUrl("javascript:") 来执行消息
        // 解决软键盘的Bug
        LOAD_URL: 1,
        // 拦截事件监听,使用online/offline事件来告诉JS获取消息
        // 默认值 NativeToJsMessageQueue.DEFAULT_BRIDGE_MODE=2
        ONLINE_EVENT: 2,
        // 反射Webview的私有API来执行JS（需要Android 3.2.4以上版本）
        PRIVATE_API: 3
    },

    // 当前JS->Native的交互形式
    jsToNativeBridgeMode,
    // 当前Native->JS的交互形式
    nativeToJsBridgeMode = nativeToJsModes.ONLINE_EVENT,
    pollEnabled = false,
    messagesFromNative = [];

// 执行Cordova提供的API
// 比如： exec(successCallback, errorCallback, "Camera", "takePicture", args);
function androidExec(success, fail, service, action, args) {
    // 默认采用JavascriptInterface交互方式
    if (jsToNativeBridgeMode === undefined) {
        androidExec.setJsToNativeBridgeMode(jsToNativeModes.JS_OBJECT);
    }

    // 如果参数中存在ArrayBuffer类型的参数，转化成字符串
    for (var i = 0; i < args.length; i++) {
        if (utils.typeName(args[i]) == 'ArrayBuffer') {
            args[i] = base64.fromArrayBuffer(args[i]);
        }
    }

    var callbackId = service + cordova.callbackId++,
        // 把所有参数转换成JSON串
        argsJson = JSON.stringify(args);

    // 设置回调函数
    if (success || fail) {
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }

    if (jsToNativeBridgeMode == jsToNativeModes.LOCATION_CHANGE) {
        // 基于URL的交互(需要手动修改NativeToJsMessageQueue.java的常量配置才能起效)
        // Native端会在CordovaWebViewClient.shouldOverrideUrlLoading()中拦截处理
        window.location = 'http://cdv_exec/' + service + '#' + action + '#' + callbackId + '#' + argsJson;
    } else {
        // 选择合适的交互方式和Native进行交互
        // 根据Native端NativeToJsMessageQueue.DISABLE_EXEC_CHAINING的配置，回传消息可以是同步或者异步
        // 默认是同步的，返回PluginResult对象的JSON串。异步的话messages为空。
        var messages = nativeApiProvider.get().exec(service, action, callbackId, argsJson);

        if (jsToNativeBridgeMode == jsToNativeModes.JS_OBJECT && messages === "@Null arguments.") {
            // 如果参数被传递到Java端，但是接收到的是null，切换交互方式到prompt()在执行一次
            // Galaxy S2在传递某些Unicode字符的时候少数情况下有问题，
            // 参考 https://issues.apache.org/jira/browse/CB-2666
            androidExec.setJsToNativeBridgeMode(jsToNativeModes.PROMPT);
            androidExec(success, fail, service, action, args);

            // 执行完成后，把交互方式再切回JavascriptInterface
            androidExec.setJsToNativeBridgeMode(jsToNativeModes.JS_OBJECT);
            return;
        } else {
            // 处理Native返回的消息
            androidExec.processMessages(messages);
        }
    }
}

function pollOnceFromOnlineEvent() {
    pollOnce(true);
}

// 从Native的消息队列中获取消息
function pollOnce(opt_fromOnlineEvent) {
    var msg = nativeApiProvider.get().retrieveJsMessages(!!opt_fromOnlineEvent);
    androidExec.processMessages(msg);
}

function pollingTimerFunc() {
    if (pollEnabled) {
        pollOnce();
        setTimeout(pollingTimerFunc, 50);
    }
}

function hookOnlineApis() {
    function proxyEvent(e) {
        cordova.fireWindowEvent(e.type);
    }
    window.addEventListener('online', pollOnceFromOnlineEvent, false);
    window.addEventListener('offline', pollOnceFromOnlineEvent, false);
    cordova.addWindowEventHandler('online');
    cordova.addWindowEventHandler('offline');
    document.addEventListener('online', proxyEvent, false);
    document.addEventListener('offline', proxyEvent, false);
}

// 添加online/offline事件
hookOnlineApis();

// 外部可以访问到交互方式的常量
androidExec.jsToNativeModes = jsToNativeModes;
androidExec.nativeToJsModes = nativeToJsModes;

// 设置JS->Native的交互方式
androidExec.setJsToNativeBridgeMode = function(mode) {
    // JavascriptInterface方式但是Native无法提供_cordovaNative对象的时候强制切到prompt（）
    if (mode == jsToNativeModes.JS_OBJECT && !window._cordovaNative) {
        console.log('Falling back on PROMPT mode since _cordovaNative is missing. Expected for Android 3.2 and lower only.');
        mode = jsToNativeModes.PROMPT;
    }
    nativeApiProvider.setPreferPrompt(mode == jsToNativeModes.PROMPT);
    jsToNativeBridgeMode = mode;
};

// 设置Native->JS的交互方式
androidExec.setNativeToJsBridgeMode = function(mode) {
    if (mode == nativeToJsBridgeMode) {
        return;
    }

    // 如果以前是Poll的方式,，先回置到非Poll
    if (nativeToJsBridgeMode == nativeToJsModes.POLLING) {
        pollEnabled = false;
    }

    nativeToJsBridgeMode = mode;

    // 告诉Native端，JS端获取消息的方式
    nativeApiProvider.get().setNativeToJsBridgeMode(mode);

·   // 如果是在JS端Poll的方式的话
    if (mode == nativeToJsModes.POLLING) {
        pollEnabled = true;
        // 停顿后执行exec获取消息message
        setTimeout(pollingTimerFunc, 1);
    }
};

// 处理从Native返回的一条消息
// 
// 回传消息的完整格式：
// （1）消息的长度+空格+J+JavaScript代码
// 44 Jcordova.callbackFromNative('InAppBrowser1478332075',true,1,[{"type":"loadstop","url":"http:\/\/www.baidu.com\/"}],true});
// （2）消息的长度+空格+成功失败标示（J/S/F）+keepCallback标示+具体的状态码+空格+回调ID+空格+回传数据
// 78 S11 InAppBrowser970748887 {"type":"loadstop","url":"http:\/\/www.baidu.com\/"}
// 28 S01 Notification970748888 n0
//
// 默认是关闭了返回Js代码，使用返回数据。
// NativeToJsMessageQueue.FORCE_ENCODE_USING_EVAL=false
function processMessage(message) {
    try {
        var firstChar = message.charAt(0);
        if (firstChar == 'J') {
            // 执行回传的JavaScript代码
            eval(message.slice(1));
        } else if (firstChar == 'S' || firstChar == 'F') {
            // S代表处理成功（包含没有数据），F代表处理失败
            var success = firstChar == 'S';
            var keepCallback = message.charAt(1) == '1';
            var spaceIdx = message.indexOf(' ', 2);
            var status = +message.slice(2, spaceIdx);
            var nextSpaceIdx = message.indexOf(' ', spaceIdx + 1);
            var callbackId = message.slice(spaceIdx + 1, nextSpaceIdx);
            // 回传值类型
            var payloadKind = message.charAt(nextSpaceIdx + 1);
            var payload;
            if (payloadKind == 's') {
                // 字符串:s+字符串
                payload = message.slice(nextSpaceIdx + 2);
            } else if (payloadKind == 't') {
                // 布尔值:t/f
                payload = true;
            } else if (payloadKind == 'f') {
                // 布尔值:t/f
                payload = false;
            } else if (payloadKind == 'N') {
                // Null:N
                payload = null;
            } else if (payloadKind == 'n') {
                // 数值：n+具体值
                payload = +message.slice(nextSpaceIdx + 2);
            } else if (payloadKind == 'A') {
                // ArrayBuffer：A+数据
                var data = message.slice(nextSpaceIdx + 2);
                var bytes = window.atob(data);
                var arraybuffer = new Uint8Array(bytes.length);
                for (var i = 0; i < bytes.length; i++) {
                    arraybuffer[i] = bytes.charCodeAt(i);
                }
                payload = arraybuffer.buffer;
            } else if (payloadKind == 'S') {
                // 二进制字符串：S+字符串
                payload = window.atob(message.slice(nextSpaceIdx + 2));
            } else {
                // JSON：JSON串
                payload = JSON.parse(message.slice(nextSpaceIdx + 1));
            }
            // 调用回调函数
            cordova.callbackFromNative(callbackId, success, status, [payload], keepCallback);
        } else {
            console.log("processMessage failed: invalid message:" + message);
        }
    } catch (e) {
        console.log("processMessage failed: Message: " + message);
        console.log("processMessage failed: Error: " + e);
        console.log("processMessage failed: Stack: " + e.stack);
    }
}

// 处理Native返回的消息
androidExec.processMessages = function(messages) {
    // 如果消息存在的话（异步没有直接返回）
    if (messages) {

        // 把传入的消息放到数组中
        messagesFromNative.push(messages);

        // messagesFromNative是全局的，而processMessages方法可重入，
        // 所以只需放到数组，后边循环处理即可
        if (messagesFromNative.length > 1) {
            return;
        }

        // 遍历从Native获得所有消息
        while (messagesFromNative.length) {
            // 处理完成后才可以从数组中删除
            messages = messagesFromNative[0];

            // Native返回星号代表消息需要等一会儿再取
            if (messages == '*') {
                // 删除数组的第一个元素
                messagesFromNative.shift();
                // 再次去获取消息
                window.setTimeout(pollOnce, 0);
                return;
            }

            // 获取消息的长度
            var spaceIdx = messages.indexOf(' ');
            var msgLen = +messages.slice(0, spaceIdx);
            // 获取第一个消息
            var message = messages.substr(spaceIdx + 1, msgLen);
            // 截取掉第一个消息
            messages = messages.slice(spaceIdx + msgLen + 1);

            // 处理第一个消息
            processMessage(message);

            // 如果消息包含多个，继续处理；单个的话删除本地消息数组中的数据
            if (messages) {
                messagesFromNative[0] = messages;
            } else {
                messagesFromNative.shift();
            }
        }
    }
};

module.exports = androidExec;

});

// file: src/common/exec/proxy.js
define("cordova/exec/proxy", function(require, exports, module) {


// internal map of proxy function
var CommandProxyMap = {};

module.exports = {

    // example: cordova.commandProxy.add("Accelerometer",{getCurrentAcceleration: function(successCallback, errorCallback, options) {...},...);
    add:function(id,proxyObj) {
        console.log("adding proxy for " + id);
        CommandProxyMap[id] = proxyObj;
        return proxyObj;
    },

    // cordova.commandProxy.remove("Accelerometer");
    remove:function(id) {
        var proxy = CommandProxyMap[id];
        delete CommandProxyMap[id];
        CommandProxyMap[id] = null;
        return proxy;
    },

    get:function(service,action) {
        return ( CommandProxyMap[service] ? CommandProxyMap[service][action] : null );
    }
};
});

// file: src/common/init.js
define("cordova/init", function(require, exports, module) {

var channel = require('cordova/channel');
var cordova = require('cordova');
var modulemapper = require('cordova/modulemapper');
var platform = require('cordova/platform');
var pluginloader = require('cordova/pluginloader');

// 定义平台初期化处理必须在onNativeReady和onPluginsReady之后进行
var platformInitChannelsArray = [channel.onNativeReady, channel.onPluginsReady];

// 输出事件通道名到日志
function logUnfiredChannels(arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].state != 2) {
            console.log('Channel not fired: ' + arr[i].type);
        }
    }
}

// 5秒之后deviceready事件还没有被调用将输出log提示
// 出现这个错误的情况比较复杂，比如，加载的plugin太多等等
window.setTimeout(function() {
    if (channel.onDeviceReady.state != 2) {
        console.log('deviceready has not fired after 5 seconds.');
        logUnfiredChannels(platformInitChannelsArray);
        logUnfiredChannels(channel.deviceReadyChannelsArray);
    }
}, 5000);

// 替换window.navigator
function replaceNavigator(origNavigator) {
    // 定义新的navigator，把navigator的原型链赋给新的navigator的原型链
    var CordovaNavigator = function() {};
    CordovaNavigator.prototype = origNavigator;
    var newNavigator = new CordovaNavigator();
    // 判断是否存在Function.bind函数
    if (CordovaNavigator.bind) {
        for (var key in origNavigator) {
            if (typeof origNavigator[key] == 'function') {
                // 通过bind创建一个新的函数（this指向navigator）后赋给新的navigator
                // 参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
                newNavigator[key] = origNavigator[key].bind(origNavigator);
            }
        }
    }
    return newNavigator;
}

// 替换webview的BOM对象navigator
// Cordova提供的接口基本都是：navigator.<plugin_name>.<action_name>
if (window.navigator) {
    window.navigator = replaceNavigator(window.navigator);
}

// 定义console.log()
if (!window.console) {
    window.console = {
        log: function(){}
    };
}

// 定义console.warn()
if (!window.console.warn) {
    window.console.warn = function(msg) {
        this.log("warn: " + msg);
    };
}

// 注册pause，resume，deviceready事件通道，并应用到Cordova自定义的事件拦截
// 这样页面定义的事件监听器就能订阅到相应的通道上了。
channel.onPause = cordova.addDocumentEventHandler('pause');
channel.onResume = cordova.addDocumentEventHandler('resume');
channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');

// 如果此时DOM加载完成，触发onDOMContentLoaded事件通道中的事件处理
if (document.readyState == 'complete' || document.readyState == 'interactive') {
    channel.onDOMContentLoaded.fire();
} else {
    // 如果此时DOM没有加载完成，定义一个监听器在DOM完成后触发事件通道的处理
    // 注意这里调用的webview的原生事件监听
    document.addEventListener('DOMContentLoaded', function() {
        channel.onDOMContentLoaded.fire();
    }, false);
}

// 以前版本是在CordovaLib中反向执行js把_nativeReady设置成true后触发事件通道
// 现在已经改成在平台启动处理中立即触发
// 参考：https://issues.apache.org/jira/browse/CB-3066
if (window._nativeReady) {
    channel.onNativeReady.fire();
}

// 给常用的模块起个别名
// 比如：就可以直接使用cordova.exec(...)来代替var exec = require('cordova/exec'); exec(...);
// 不过第一行第二个参数应该是“Cordova”，c应该大写！！！
modulemapper.clobbers('cordova', 'cordova');
modulemapper.clobbers('cordova/exec', 'cordova.exec');
modulemapper.clobbers('cordova/exec', 'Cordova.exec');

// 调用平台初始化启动处理
platform.bootstrap && platform.bootstrap();

// 所有插件加载完成后，触发onPluginsReady事件通道中的事件处理
pluginloader.load(function() {
    channel.onPluginsReady.fire();
});

// 一旦本地代码准备就绪，创建cordova所需的所有对象
channel.join(function() {
    // 把所有模块附加到window对象上
    modulemapper.mapModules(window);

    // 如果平台有特殊的初始化处理，调用它（目前来看都没有）
    platform.initialize && platform.initialize();

    // 触发onCordovaReady事件通道，标示cordova准备完成
    channel.onCordovaReady.fire();

    // 一切准备就绪后，执行deviceready事件通道上的所有事件。
    channel.join(function() {
        require('cordova').fireDocumentEvent('deviceready');
    }, channel.deviceReadyChannelsArray); // onCordovaReady、onDOMContentLoaded

}, platformInitChannelsArray); // onNativeReady、onPluginsReady


});

// file: src/common/modulemapper.js
define("cordova/modulemapper", function(require, exports, module) {

var builder = require('cordova/builder'),
    // define的所有模块Map
    moduleMap = define.moduleMap,
    symbolList,
    deprecationMap;

// 清空重置
exports.reset = function() {
    symbolList = [];
    deprecationMap = {};
};

function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
    if (!(moduleName in moduleMap)) {
        throw new Error('Module ' + moduleName + ' does not exist.');
    }
    symbolList.push(strategy, moduleName, symbolPath);
    if (opt_deprecationMessage) {
        deprecationMap[symbolPath] = opt_deprecationMessage;
    }
}

// Note: Android 2.3 does have Function.bind().
exports.clobbers = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
};

exports.merges = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
};

exports.defaults = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
};

exports.runs = function(moduleName) {
    addEntry('r', moduleName, null);
};

function prepareNamespace(symbolPath, context) {
    if (!symbolPath) {
        return context;
    }
    var parts = symbolPath.split('.');
    var cur = context;
    for (var i = 0, part; part = parts[i]; ++i) {
        cur = cur[part] = cur[part] || {};
    }
    return cur;
}

exports.mapModules = function(context) {
    var origSymbols = {};
    context.CDV_origSymbols = origSymbols;
    for (var i = 0, len = symbolList.length; i < len; i += 3) {
        var strategy = symbolList[i];
        var moduleName = symbolList[i + 1];
        var module = require(moduleName);
        // <runs/>
        if (strategy == 'r') {
            continue;
        }
        var symbolPath = symbolList[i + 2];
        var lastDot = symbolPath.lastIndexOf('.');
        var namespace = symbolPath.substr(0, lastDot);
        var lastName = symbolPath.substr(lastDot + 1);

        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
        var parentObj = prepareNamespace(namespace, context);
        var target = parentObj[lastName];

        if (strategy == 'm' && target) {
            // 递归合并对象属性
            builder.recursiveMerge(target, module);
        } else if ((strategy == 'd' && !target) || (strategy != 'd')) {
            if (!(symbolPath in origSymbols)) {
                origSymbols[symbolPath] = target;
            }
            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
        }
    }
};

exports.getOriginalSymbol = function(context, symbolPath) {
    var origSymbols = context.CDV_origSymbols;
    if (origSymbols && (symbolPath in origSymbols)) {
        return origSymbols[symbolPath];
    }
    var parts = symbolPath.split('.');
    var obj = context;
    for (var i = 0; i < parts.length; ++i) {
        obj = obj && obj[parts[i]];
    }
    return obj;
};

exports.reset();


});

// file: src/android/platform.js
define("cordova/platform", function(require, exports, module) {

module.exports = {
    id: 'android',
    // 平台启动处理(各个平台处理都不一样，比如ios就只需要触发onNativeReady)
    bootstrap: function() {
        var channel = require('cordova/channel'),
            cordova = require('cordova'),
            exec = require('cordova/exec'),
            modulemapper = require('cordova/modulemapper');

        // 把exec()的执行从WebCore线程变到UI线程上来
        // 后台PluginManager初始化的时候默认添加了一个'PluginManager的插件
        exec(null, null, 'PluginManager', 'startup', []);

        // 触发onNativeReady事件通道，告诉JS本地代码已经完成
        channel.onNativeReady.fire();

        // app插件。现在没有被单独抽出去，没找到合适的地方。
        modulemapper.clobbers('cordova/plugin/android/app', 'navigator.app');

        // 给返回按钮注意个监听器
        var backButtonChannel = cordova.addDocumentEventHandler('backbutton');
        backButtonChannel.onHasSubscribersChange = function() {
            // 如果只为返回按钮定义了1个事件监听器的话，通知后台覆盖默认行为
            exec(null, null, "App", "overrideBackbutton", [this.numHandlers == 1]);
        };

        // 添加菜单和搜素的事件监听
        cordova.addDocumentEventHandler('menubutton');
        cordova.addDocumentEventHandler('searchbutton');

        // 启动完成后，告诉本地代码显示WebView
        channel.onCordovaReady.subscribe(function() {
            exec(null, null, "App", "show", []);
        });
    }
};

});

// file: src/android/plugin/android/app.js
define("cordova/plugin/android/app", function(require, exports, module) {

var exec = require('cordova/exec');

module.exports = {
    /**
    * Clear the resource cache.
    */
    clearCache:function() {
        exec(null, null, "App", "clearCache", []);
    },

    /**
    * Load the url into the webview or into new browser instance.
    *
    * @param url           The URL to load
    * @param props         Properties that can be passed in to the activity:
    *      wait: int                           => wait msec before loading URL
    *      loadingDialog: "Title,Message"      => display a native loading dialog
    *      loadUrlTimeoutValue: int            => time in msec to wait before triggering a timeout error
    *      clearHistory: boolean              => clear webview history (default=false)
    *      openExternal: boolean              => open in a new browser (default=false)
    *
    * Example:
    *      navigator.app.loadUrl("http://server/myapp/index.html", {wait:2000, loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
    */
    loadUrl:function(url, props) {
        exec(null, null, "App", "loadUrl", [url, props]);
    },

    /**
    * Cancel loadUrl that is waiting to be loaded.
    */
    cancelLoadUrl:function() {
        exec(null, null, "App", "cancelLoadUrl", []);
    },

    /**
    * Clear web history in this web view.
    * Instead of BACK button loading the previous web page, it will exit the app.
    */
    clearHistory:function() {
        exec(null, null, "App", "clearHistory", []);
    },

    /**
    * Go to previous page displayed.
    * This is the same as pressing the backbutton on Android device.
    */
    backHistory:function() {
        exec(null, null, "App", "backHistory", []);
    },

    /**
    * Override the default behavior of the Android back button.
    * If overridden, when the back button is pressed, the "backKeyDown" JavaScript event will be fired.
    *
    * Note: The user should not have to call this method.  Instead, when the user
    *       registers for the "backbutton" event, this is automatically done.
    *
    * @param override        T=override, F=cancel override
    */
    overrideBackbutton:function(override) {
        exec(null, null, "App", "overrideBackbutton", [override]);
    },

    /**
    * Exit and terminate the application.
    */
    exitApp:function() {
        return exec(null, null, "App", "exitApp", []);
    }
};

});

// file: src/common/pluginloader.js
define("cordova/pluginloader", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');
var urlutil = require('cordova/urlutil');

// 创建<script>tag,把js文件动态添加到head中
function injectScript(url, onload, onerror) {
    var script = document.createElement("script");
    script.onload = onload;
    script.onerror = onerror || onload; // 出错的时候也执行onload处理
    script.src = url;
    document.head.appendChild(script);
}

// 加载到head中的插件js脚本定义如下：
//  cordova.define("org.apache.cordova.xxx", function(require, exports, module) { ... });
// 模块名称是cordova_plugins.js中定义的id，所以要把该id指向定义好的clobbers
function onScriptLoadingComplete(moduleList, finishPluginLoading) {

    for (var i = 0, module; module = moduleList[i]; i++) {
        if (module) {
            try {
                // 把该模块需要clobber的clobber到指定的clobbers里
                if (module.clobbers && module.clobbers.length) {
                    for (var j = 0; j < module.clobbers.length; j++) {
                        modulemapper.clobbers(module.id, module.clobbers[j]);
                    }
                }

                // 把该模块需要合并的部分合并到指定的模块里
                if (module.merges && module.merges.length) {
                    for (var k = 0; k < module.merges.length; k++) {
                        modulemapper.merges(module.id, module.merges[k]);
                    }
                }

                // 处理只希望require()的模块
                // <js-module src="www/xxx.js" name="Xxx">
                //    <runs />
                // </js-module>
                if (module.runs && !(module.clobbers && module.clobbers.length) && !(module.merges && module.merges.length)) {
                    modulemapper.runs(module.id);
                }
            }
            catch(err) {
            }
        }
    }

    // 插件js脚本加载完成后，执行回调!!!
    finishPluginLoading();
}

// 加载所有cordova_plugins.js中定义的js-module
function handlePluginsObject(path, moduleList, finishPluginLoading) {

    var scriptCounter = moduleList.length;

    // 没有插件,直接执行回调后返回
    if (!scriptCounter) {
        finishPluginLoading();
        return;
    }

    // 加载每个插件js的脚本的回调
    function scriptLoadedCallback() {
        // 加载完成一个就把计数器减1
        if (!--scriptCounter) {
            // 直到所有插件的js脚本都被加载完成后clobber
            onScriptLoadingComplete(moduleList, finishPluginLoading);
        }
    }

    // 依次把插件的js脚本添加到head中后加载
    for (var i = 0; i < moduleList.length; i++) {
        injectScript(path + moduleList[i].file, scriptLoadedCallback);
    }
}

// 注入插件的js脚本
function injectPluginScript(pathPrefix, finishPluginLoading) {
    var pluginPath = pathPrefix + 'cordova_plugins.js';

    // 根据cordova.js文件的路径首先把cordova_plugins.js添加到head中后加载
    injectScript(pluginPath, function() {
        try {
            // 导入cordova_plugins.jsz中定义的'cordova/plugin_list'模块
            // 这个文件的内容是根据所有插件的plugin.xml生成的。
            var moduleList = require("cordova/plugin_list");
            
            // 加载所有cordova_plugins.js中定义的js-module
            handlePluginsObject(pathPrefix, moduleList, finishPluginLoading);
        }
        catch (e) {
            // 忽略cordova_plugins.js记载失败、或者文件不存在等错误
            finishPluginLoading();
        }
    }, finishPluginLoading);
}

// 获取cordova.js文件的路径
function findCordovaPath() {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var term = 'cordova.js';
    for (var n = scripts.length-1; n>-1; n--) {
        var src = scripts[n].src;
        if (src.indexOf(term) == (src.length - term.length)) {
            path = src.substring(0, src.length - term.length);
            break;
        }
    }
    return path;
}

// 加载所有cordova_plugins.js中定义的js-module
// 执行完成后会触发onPluginsReady（异步执行）
exports.load = function(callback) {
    // 取cordova.js文件所在的路径
    var pathPrefix = findCordovaPath();
    if (pathPrefix === null) {
        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
        pathPrefix = '';
    }

    // 注入插件的js脚本，执行完成后回调onPluginsReady
    injectPluginScript(pathPrefix, callback);
};


});

// file: src/common/urlutil.js
define("cordova/urlutil", function(require, exports, module) {


/**
 * For already absolute URLs, returns what is passed in.
 * For relative URLs, converts them to absolute ones.
 */
exports.makeAbsolute = function makeAbsolute(url) {
    var anchorEl = document.createElement('a');
    anchorEl.href = url;
    return anchorEl.href;
};


});

// file: src/common/utils.js
define("cordova/utils", function(require, exports, module) {

var utils = exports;

/**
 * Defines a property getter / setter for obj[key].
 */
utils.defineGetterSetter = function(obj, key, getFunc, opt_setFunc) {
    if (Object.defineProperty) {
        var desc = {
            get: getFunc,
            configurable: true
        };
        if (opt_setFunc) {
            desc.set = opt_setFunc;
        }
        Object.defineProperty(obj, key, desc);
    } else {
        obj.__defineGetter__(key, getFunc);
        if (opt_setFunc) {
            obj.__defineSetter__(key, opt_setFunc);
        }
    }
};

/**
 * Defines a property getter for obj[key].
 */
utils.defineGetter = utils.defineGetterSetter;

utils.arrayIndexOf = function(a, item) {
    if (a.indexOf) {
        return a.indexOf(item);
    }
    var len = a.length;
    for (var i = 0; i < len; ++i) {
        if (a[i] == item) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns whether the item was found in the array.
 */
utils.arrayRemove = function(a, item) {
    var index = utils.arrayIndexOf(a, item);
    if (index != -1) {
        a.splice(index, 1);
    }
    return index != -1;
};

utils.typeName = function(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
};

/**
 * Returns an indication of whether the argument is an array or not
 */
utils.isArray = function(a) {
    return utils.typeName(a) == 'Array';
};

/**
 * Returns an indication of whether the argument is a Date or not
 */
utils.isDate = function(d) {
    return utils.typeName(d) == 'Date';
};

/**
 * Does a deep clone of the object.
 */
utils.clone = function(obj) {
    if(!obj || typeof obj == 'function' || utils.isDate(obj) || typeof obj != 'object') {
        return obj;
    }

    var retVal, i;

    if(utils.isArray(obj)){
        retVal = [];
        for(i = 0; i < obj.length; ++i){
            retVal.push(utils.clone(obj[i]));
        }
        return retVal;
    }

    retVal = {};
    for(i in obj){
        if(!(i in retVal) || retVal[i] != obj[i]) {
            retVal[i] = utils.clone(obj[i]);
        }
    }
    return retVal;
};

/**
 * Returns a wrapped version of the function
 */
utils.close = function(context, func, params) {
    if (typeof params == 'undefined') {
        return function() {
            return func.apply(context, arguments);
        };
    } else {
        return function() {
            return func.apply(context, params);
        };
    }
};

/**
 * Create a UUID
 */
utils.createUUID = function() {
    return UUIDcreatePart(4) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(6);
};

/**
 * Extends a child object from a parent object using classical inheritance
 * pattern.
 */
utils.extend = (function() {
    // proxy used to establish prototype chain
    var F = function() {};
    // extend Child from Parent
    return function(Child, Parent) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.__super__ = Parent.prototype;
        Child.prototype.constructor = Child;
    };
}());

/**
 * Alerts a message in any available way: alert or console.log.
 */
utils.alert = function(msg) {
    if (window.alert) {
        window.alert(msg);
    } else if (console && console.log) {
        console.log(msg);
    }
};


//------------------------------------------------------------------------------
function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}


});

window.cordova = require('cordova');
// file: src/scripts/bootstrap.js

require('cordova/init');

})();