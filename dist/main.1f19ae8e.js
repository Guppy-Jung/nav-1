// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
// console.log(jQuery)  可验证是否成功引入jQuery
var $siteList = $('.siteList'); //这里通过jquery获取到了选择器对应的元素

var $lastLi = $siteList.find('li.last'); //通过.find方法查找class为last的元素

var x = localStorage.getItem('x'); //用了localStorage后，hashMap的初始值应该是从setItem()中的x读出来，而不是提前写好（但是又需要保留hashMap初始的两个元素，所以下面hashMap用了||）

var xObject = JSON.parse(x); //JSON.parse()可以把string变Object。parse()是不能解析空字符串的，但是通过console.log(xObject)打出来发现会返回null，不会报错

var hashMap = xObject || [{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, //里面可以加logoType: 'text'来限定变量logo的类型
{
  logo: 'B',
  url: 'https://www.bilibili.com'
}];

var simplifyUrl = function simplifyUrl(url) {
  //该函数实现每个元素的url不完全显示，看起来更简洁
  return url.replace('https://', '').replace('http://', '').replace('www.', '') //.replace()只会产生一个新的字符串，不会改变原本的url,所以不能return url，因为url没有变
  .replace(/\/.*/, ''); //  \是转义，/.*表示/后面的任何东西
};

var render = function render() {
  $siteList.find('li:not(.last)').remove(); //唯独不要最后一个li。该句放在这是因为在渲染hashMap前，要把前面的两个会重复出现的元素删掉

  hashMap.forEach(function (node, index) {
    //node是接受的参数，即hashMap数组中的每一个索引值
    var $li = $("<li>\n        <div class=\"site\">\n        <div class=\"logo\">".concat(node.logo, "</div>\n        <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n        <div class=\"close\">\n        <svg class=\"icon\" >\n            <use xlink:href=\"#icon-close\"></use>\n        </svg>\n        </div>\n    </div>    \n            </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      //用.on()函数代替了原本包裹上面html元素的a标签
      window.open(node.url); //.open()打开一个新窗口
    });
    $li.on('click', '.close', function (e) {
      //e是拿到这个事件
      console.log('跳转了');
      e.stopPropagation(); //当点击.close时，就会阻止冒泡，即点击.close元素不会向上触发其祖先元素

      console.log(hashMap);
      hashMap.splice(index, 1); //该方法删掉数组中第几个。表示从index这里删掉1个，即删掉自身index值

      render(); //删掉自身索引值后要重新渲染
    }); //$li返回的就是jQuery()内部return的对象，这个对象中有很多方法可以操作$li获取到元素，.on()就是一个方法
  });
};

render();
$('.addButton') //本来jQuery代码是：window.jQuery = function('.xxx'){const elements = querySelector('.yyy');return{on(){}}}
.on('click', function () {
  var url = window.prompt('请问你要添加的网址是啥？'); //只需要定义变量，就可以拿到用户在prompt弹窗输入的网址

  if (url.indexOf('http') !== 0) {
    //如果url第一个字符是http
    url = 'https://' + url;
  }

  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    //实现每个新增元素的显示文字以网址[0]值开头
    url: url
  });
  render(); // hashMap.forEach(node => {//node是接受的参数，即hashMap数组中的每一个索引值
  //     const $li = $(`<li>
  //     <a href="${node.url}">
  //                     <div class="site">
  //                         <div class="logo">${node.logo[0]}</div>
  //                         <div class="link">${node.url}</div>
  //                     </div>
  //                 </a>
  //     </li>`).insertBefore($lastLi)
  // })
  // const $li = $(`<li>
  // <a href="${url}"> 
  //             <div class="site">
  //                 <div class="logo">${url[0]}</div>
  //                 <div class="link">${url}</div>
  //             </div>
  //         </a>
  // </li>`).insertBefore($lastLi)//.appendTo($siteList)//将jQuery获取到的$site插入$siteList
});

window.onbeforeunload = function () {
  //该APIjs用户在关闭页面前会触发，这里面就可以把变量hashMap存下来，即localStorage,但是localStorage只能存字符串，不能存对象
  // console.log('页面要关闭了') 验证该method是否管用
  var string = JSON.stringify(hashMap); //JSON.stringify可以把一个对象变字符串。因为localStorage只能存字符串

  window.localStorage.setItem('x', string); //localStorage是全局变量，window可以省略，setItem()接受两个值：key和value，key随便写。x表示存在x里。这句话的意思是：在本地存储中设置一个x,其值为string
}; // document.addEventListener()
// $(document).on('keypress', (e) => {
//     // const key = e.key 当变量名与属性名相同，可以简写为
//     const { key } = e
//     for (let i = 0; i <= hashMap.length; i++) {
//         if (hashMap[i].logo.toLowerCase() === key) {
//             window.open(hashMap[i].url)
//         }
//     }
// })  该代码有文本框也能接收到keypress事件的bug,删掉了
},{}],"C:/Users/蒋/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51159" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/蒋/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map