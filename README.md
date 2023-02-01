```javascript
;(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "ShanbayOss",
      desc: "Shanbay Oss uploader",
      input: { type: "string" },
      output: { type: "string" },
      options: [{ name: "service", type: "string", default: "cms_comment_image" }],
    },
    run(input, options, context) {
      return context
        .fetch(input)
        .then((res) => {
          console.log(res)
          return new File([res], "??.png", { type: res.type })
        })
        .then((file) => context.alioss({ file, service: options.service }))
    },
  }
  return nodeConfig
})()
```

```javascript
;(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "Tinypng",
      desc: "Compress via Tinypng",
      input: { type: "string" },
      output: { type: "any" },
      options: [{ name: "apiKey", type: "string" }],
    },
    run(input, options, context) {
      return context
        .fetch("https://api.tinify.com/shrink", {
          method: "POST",
          headers: {
            Authorization: `Basic ${window.btoa(`api:${options.apiKey}`)}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: {
              url: input,
            },
          }),
        })
        .then((res) => res.data)
    },
  }
  return nodeConfig
})()
```

document.querySelector(".assetPreview img").src

```javascript
;(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "MainWorld",
      desc: "Get main world info",
      input: { type: "string" },
      output: { type: "any" },
      options: [{ name: "expression", type: "string" }],
    },
    run(input, options, context) {
      return context.mainWorld(input || options.expression)
    },
  }
  return nodeConfig
})()
```

```javascript
;(function () {
  const lodashGet = (function () {
    var FUNC_ERROR_TEXT = "Expected a function",
      HASH_UNDEFINED = "__lodash_hash_undefined__",
      INFINITY = 1 / 0,
      funcTag = "[object Function]",
      genTag = "[object GeneratorFunction]",
      symbolTag = "[object Symbol]",
      reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reEscapeChar = /\\(\\)?/g,
      reIsHostCtor = /^\[object .+?Constructor\]$/,
      freeGlobal = "object" == typeof global && global && global.Object === Object && global,
      freeSelf = "object" == typeof self && self && self.Object === Object && self,
      root = freeGlobal || freeSelf || Function("return this")()
    function getValue(t, e) {
      return null == t ? void 0 : t[e]
    }
    function isHostObject(t) {
      var e = !1
      if (null != t && "function" != typeof t.toString)
        try {
          e = !!(t + "")
        } catch (t) {}
      return e
    }
    var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype,
      coreJsData = root["__core-js_shared__"],
      maskSrcKey = (function () {
        var t = /[^.]+$/.exec((coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || "")
        return t ? "Symbol(src)_1." + t : ""
      })(),
      funcToString = funcProto.toString,
      hasOwnProperty = objectProto.hasOwnProperty,
      objectToString = objectProto.toString,
      reIsNative = RegExp(
        "^" +
          funcToString
            .call(hasOwnProperty)
            .replace(reRegExpChar, "\\$&")
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
          "$"
      ),
      Symbol = root.Symbol,
      splice = arrayProto.splice,
      Map = getNative(root, "Map"),
      nativeCreate = getNative(Object, "create"),
      symbolProto = Symbol ? Symbol.prototype : void 0,
      symbolToString = symbolProto ? symbolProto.toString : void 0
    function Hash(t) {
      var e = -1,
        r = t ? t.length : 0
      for (this.clear(); ++e < r; ) {
        var a = t[e]
        this.set(a[0], a[1])
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {}
    }
    function hashDelete(t) {
      return this.has(t) && delete this.__data__[t]
    }
    function hashGet(t) {
      var e = this.__data__
      if (nativeCreate) {
        var r = e[t]
        return r === HASH_UNDEFINED ? void 0 : r
      }
      return hasOwnProperty.call(e, t) ? e[t] : void 0
    }
    function hashHas(t) {
      var e = this.__data__
      return nativeCreate ? void 0 !== e[t] : hasOwnProperty.call(e, t)
    }
    function hashSet(t, e) {
      return (this.__data__[t] = nativeCreate && void 0 === e ? HASH_UNDEFINED : e), this
    }
    function ListCache(t) {
      var e = -1,
        r = t ? t.length : 0
      for (this.clear(); ++e < r; ) {
        var a = t[e]
        this.set(a[0], a[1])
      }
    }
    function listCacheClear() {
      this.__data__ = []
    }
    function listCacheDelete(t) {
      var e = this.__data__,
        r = assocIndexOf(e, t)
      return !(r < 0) && (r == e.length - 1 ? e.pop() : splice.call(e, r, 1), !0)
    }
    function listCacheGet(t) {
      var e = this.__data__,
        r = assocIndexOf(e, t)
      return r < 0 ? void 0 : e[r][1]
    }
    function listCacheHas(t) {
      return -1 < assocIndexOf(this.__data__, t)
    }
    function listCacheSet(t, e) {
      var r = this.__data__,
        a = assocIndexOf(r, t)
      return a < 0 ? r.push([t, e]) : (r[a][1] = e), this
    }
    function MapCache(t) {
      var e = -1,
        r = t ? t.length : 0
      for (this.clear(); ++e < r; ) {
        var a = t[e]
        this.set(a[0], a[1])
      }
    }
    function mapCacheClear() {
      this.__data__ = { hash: new Hash(), map: new (Map || ListCache)(), string: new Hash() }
    }
    function mapCacheDelete(t) {
      return getMapData(this, t).delete(t)
    }
    function mapCacheGet(t) {
      return getMapData(this, t).get(t)
    }
    function mapCacheHas(t) {
      return getMapData(this, t).has(t)
    }
    function mapCacheSet(t, e) {
      return getMapData(this, t).set(t, e), this
    }
    function assocIndexOf(t, e) {
      for (var r = t.length; r--; ) if (eq(t[r][0], e)) return r
      return -1
    }
    function baseGet(t, e) {
      for (var r = 0, a = (e = isKey(e, t) ? [e] : castPath(e)).length; null != t && r < a; )
        t = t[toKey(e[r++])]
      return r && r == a ? t : void 0
    }
    function baseIsNative(t) {
      return (
        !(!isObject(t) || isMasked(t)) &&
        (isFunction(t) || isHostObject(t) ? reIsNative : reIsHostCtor).test(toSource(t))
      )
    }
    function baseToString(t) {
      if ("string" == typeof t) return t
      if (isSymbol(t)) return symbolToString ? symbolToString.call(t) : ""
      var e = t + ""
      return "0" == e && 1 / t == -INFINITY ? "-0" : e
    }
    function castPath(t) {
      return isArray(t) ? t : stringToPath(t)
    }
    function getMapData(t, e) {
      var r = t.__data__
      return isKeyable(e) ? r["string" == typeof e ? "string" : "hash"] : r.map
    }
    function getNative(t, e) {
      var r = getValue(t, e)
      return baseIsNative(r) ? r : void 0
    }
    function isKey(t, e) {
      if (isArray(t)) return !1
      var r = typeof t
      return (
        !("number" != r && "symbol" != r && "boolean" != r && null != t && !isSymbol(t)) ||
        reIsPlainProp.test(t) ||
        !reIsDeepProp.test(t) ||
        (null != e && t in Object(e))
      )
    }
    function isKeyable(t) {
      var e = typeof t
      return "string" == e || "number" == e || "symbol" == e || "boolean" == e
        ? "__proto__" !== t
        : null === t
    }
    function isMasked(t) {
      return !!maskSrcKey && maskSrcKey in t
    }
    ;(Hash.prototype.clear = hashClear),
      (Hash.prototype.delete = hashDelete),
      (Hash.prototype.get = hashGet),
      (Hash.prototype.has = hashHas),
      (Hash.prototype.set = hashSet),
      (ListCache.prototype.clear = listCacheClear),
      (ListCache.prototype.delete = listCacheDelete),
      (ListCache.prototype.get = listCacheGet),
      (ListCache.prototype.has = listCacheHas),
      (ListCache.prototype.set = listCacheSet),
      (MapCache.prototype.clear = mapCacheClear),
      (MapCache.prototype.delete = mapCacheDelete),
      (MapCache.prototype.get = mapCacheGet),
      (MapCache.prototype.has = mapCacheHas),
      (MapCache.prototype.set = mapCacheSet)
    var stringToPath = memoize(function (t) {
      t = toString(t)
      var o = []
      return (
        reLeadingDot.test(t) && o.push(""),
        t.replace(rePropName, function (t, e, r, a) {
          o.push(r ? a.replace(reEscapeChar, "$1") : e || t)
        }),
        o
      )
    })
    function toKey(t) {
      if ("string" == typeof t || isSymbol(t)) return t
      var e = t + ""
      return "0" == e && 1 / t == -INFINITY ? "-0" : e
    }
    function toSource(t) {
      if (null != t) {
        try {
          return funcToString.call(t)
        } catch (t) {}
        try {
          return t + ""
        } catch (t) {}
      }
      return ""
    }
    function memoize(o, n) {
      if ("function" != typeof o || (n && "function" != typeof n))
        throw new TypeError(FUNC_ERROR_TEXT)
      var i = function () {
        var t = arguments,
          e = n ? n.apply(this, t) : t[0],
          r = i.cache
        if (r.has(e)) return r.get(e)
        var a = o.apply(this, t)
        return (i.cache = r.set(e, a)), a
      }
      return (i.cache = new (memoize.Cache || MapCache)()), i
    }
    function eq(t, e) {
      return t === e || (t != t && e != e)
    }
    memoize.Cache = MapCache
    var isArray = Array.isArray
    function isFunction(t) {
      var e = isObject(t) ? objectToString.call(t) : ""
      return e == funcTag || e == genTag
    }
    function isObject(t) {
      var e = typeof t
      return !!t && ("object" == e || "function" == e)
    }
    function isObjectLike(t) {
      return !!t && "object" == typeof t
    }
    function isSymbol(t) {
      return "symbol" == typeof t || (isObjectLike(t) && objectToString.call(t) == symbolTag)
    }
    function toString(t) {
      return null == t ? "" : baseToString(t)
    }
    function get(t, e, r) {
      var a = null == t ? void 0 : baseGet(t, e)
      return void 0 === a ? r : a
    }
    return get
  })()
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "LodashGet",
      desc: "Get element from an object via lodash.get",
      input: { type: "any" },
      output: { type: "any" },
      options: [{ name: "path", type: "string" }],
    },
    run(input, options, context) {
      return lodashGet(input, options.path)
    },
  }
  return nodeConfig
})()
```

```json
{
  "id": "c55f4c85-c848-492d-8bcb-1478ace69b86",
  "nodes": [
    {
      "id": "948c3d5a-0794-4b1a-bc93-f700f90bf697",
      "metaId": "mainWorld",
      "name": "Node-MainWorld",
      "options": { "expression": "document.querySelector(\".assetPreview img\").src" },
      "metaNode": {
        "_raw": "(function () {\n  /** @type {CompositeX.MetaNodeConfig} */\n  const nodeConfig = {\n    config: {\n      name: \"MainWorld\",\n      desc: \"Get main world info\",\n      input: { type: \"string\" },\n      output: { type: \"any\" },\n      options: [{ name: \"expression\", type: \"string\" }],\n    },\n    run(input, options, context) {\n      return context.mainWorld(input || options.expression)\n    },\n  }\n  return nodeConfig\n})()",
        "id": "mainWorld",
        "config": {
          "name": "MainWorld",
          "desc": "Get main world info",
          "input": { "type": "string" },
          "output": { "type": "any" },
          "options": [{ "name": "expression", "type": "string" }]
        }
      }
    },
    {
      "id": "60437753-3bbe-4ac0-92a0-65e6fc8865fd",
      "metaId": "a8a110d7-a7e4-468e-9d3e-144a72b4a745",
      "name": "Node-Tinypng",
      "options": { "apiKey": "PZB818tH4zLbrptt8dMgR5Hn0LZ4n7Ms" },
      "metaNode": {
        "_raw": "(function () {\n  /** @type {CompositeX.MetaNodeConfig} */\n  const nodeConfig = {\n    config: {\n      name: \"Tinypng\",\n      desc: \"Compress via Tinypng\",\n      input: { type: \"string\" },\n      output: { type: \"any\" },\n      options: [{ name: \"apiKey\", type: \"string\" }],\n    },\n    run(input, options, context) {\n      return context\n        .fetch(\"https://api.tinify.com/shrink\", {\n          method: \"POST\",\n          headers: {\n            Authorization: `Basic ${window.btoa(`api:${options.apiKey}`)}`,\n            \"Content-Type\": \"application/json\",\n          },\n          body: JSON.stringify({\n            source: {\n              url: input,\n            },\n          }),\n        })\n        .then((res) => res.data)\n    },\n  }\n  return nodeConfig\n})()",
        "id": "a8a110d7-a7e4-468e-9d3e-144a72b4a745",
        "config": {
          "name": "Tinypng",
          "desc": "Compress via Tinypng",
          "input": { "type": "string" },
          "output": { "type": "any" },
          "options": [{ "name": "apiKey", "type": "string" }]
        }
      }
    },
    {
      "id": "91dcf881-9ac1-43be-bd02-3391f0b054be",
      "metaId": "lodashGet",
      "name": "Node-LodashGet",
      "options": { "path": "output.url" },
      "metaNode": {
        "_raw": "(function () {\n        const lodashGet = (function () {\n          var FUNC_ERROR_TEXT = \"Expected a function\",\n            HASH_UNDEFINED = \"__lodash_hash_undefined__\",\n            INFINITY = 1 / 0,\n            funcTag = \"[object Function]\",\n            genTag = \"[object GeneratorFunction]\",\n            symbolTag = \"[object Symbol]\",\n            reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/,\n            reIsPlainProp = /^\\w*$/,\n            reLeadingDot = /^\\./,\n            rePropName =\n              /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g,\n            reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g,\n            reEscapeChar = /\\\\(\\\\)?/g,\n            reIsHostCtor = /^\\[object .+?Constructor\\]$/,\n            freeGlobal = \"object\" == typeof global && global && global.Object === Object && global,\n            freeSelf = \"object\" == typeof self && self && self.Object === Object && self,\n            root = freeGlobal || freeSelf || Function(\"return this\")()\n          function getValue(t, e) {\n            return null == t ? void 0 : t[e]\n          }\n          function isHostObject(t) {\n            var e = !1\n            if (null != t && \"function\" != typeof t.toString)\n              try {\n                e = !!(t + \"\")\n              } catch (t) {}\n            return e\n          }\n          var arrayProto = Array.prototype,\n            funcProto = Function.prototype,\n            objectProto = Object.prototype,\n            coreJsData = root[\"__core-js_shared__\"],\n            maskSrcKey = (function () {\n              var t = /[^.]+$/.exec((coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || \"\")\n              return t ? \"Symbol(src)_1.\" + t : \"\"\n            })(),\n            funcToString = funcProto.toString,\n            hasOwnProperty = objectProto.hasOwnProperty,\n            objectToString = objectProto.toString,\n            reIsNative = RegExp(\n              \"^\" +\n                funcToString\n                  .call(hasOwnProperty)\n                  .replace(reRegExpChar, \"\\\\$&\")\n                  .replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, \"$1.*?\") +\n                \"$\"\n            ),\n            Symbol = root.Symbol,\n            splice = arrayProto.splice,\n            Map = getNative(root, \"Map\"),\n            nativeCreate = getNative(Object, \"create\"),\n            symbolProto = Symbol ? Symbol.prototype : void 0,\n            symbolToString = symbolProto ? symbolProto.toString : void 0\n          function Hash(t) {\n            var e = -1,\n              r = t ? t.length : 0\n            for (this.clear(); ++e < r; ) {\n              var a = t[e]\n              this.set(a[0], a[1])\n            }\n          }\n          function hashClear() {\n            this.__data__ = nativeCreate ? nativeCreate(null) : {}\n          }\n          function hashDelete(t) {\n            return this.has(t) && delete this.__data__[t]\n          }\n          function hashGet(t) {\n            var e = this.__data__\n            if (nativeCreate) {\n              var r = e[t]\n              return r === HASH_UNDEFINED ? void 0 : r\n            }\n            return hasOwnProperty.call(e, t) ? e[t] : void 0\n          }\n          function hashHas(t) {\n            var e = this.__data__\n            return nativeCreate ? void 0 !== e[t] : hasOwnProperty.call(e, t)\n          }\n          function hashSet(t, e) {\n            return (this.__data__[t] = nativeCreate && void 0 === e ? HASH_UNDEFINED : e), this\n          }\n          function ListCache(t) {\n            var e = -1,\n              r = t ? t.length : 0\n            for (this.clear(); ++e < r; ) {\n              var a = t[e]\n              this.set(a[0], a[1])\n            }\n          }\n          function listCacheClear() {\n            this.__data__ = []\n          }\n          function listCacheDelete(t) {\n            var e = this.__data__,\n              r = assocIndexOf(e, t)\n            return !(r < 0) && (r == e.length - 1 ? e.pop() : splice.call(e, r, 1), !0)\n          }\n          function listCacheGet(t) {\n            var e = this.__data__,\n              r = assocIndexOf(e, t)\n            return r < 0 ? void 0 : e[r][1]\n          }\n          function listCacheHas(t) {\n            return -1 < assocIndexOf(this.__data__, t)\n          }\n          function listCacheSet(t, e) {\n            var r = this.__data__,\n              a = assocIndexOf(r, t)\n            return a < 0 ? r.push([t, e]) : (r[a][1] = e), this\n          }\n          function MapCache(t) {\n            var e = -1,\n              r = t ? t.length : 0\n            for (this.clear(); ++e < r; ) {\n              var a = t[e]\n              this.set(a[0], a[1])\n            }\n          }\n          function mapCacheClear() {\n            this.__data__ = { hash: new Hash(), map: new (Map || ListCache)(), string: new Hash() }\n          }\n          function mapCacheDelete(t) {\n            return getMapData(this, t).delete(t)\n          }\n          function mapCacheGet(t) {\n            return getMapData(this, t).get(t)\n          }\n          function mapCacheHas(t) {\n            return getMapData(this, t).has(t)\n          }\n          function mapCacheSet(t, e) {\n            return getMapData(this, t).set(t, e), this\n          }\n          function assocIndexOf(t, e) {\n            for (var r = t.length; r--; ) if (eq(t[r][0], e)) return r\n            return -1\n          }\n          function baseGet(t, e) {\n            for (var r = 0, a = (e = isKey(e, t) ? [e] : castPath(e)).length; null != t && r < a; )\n              t = t[toKey(e[r++])]\n            return r && r == a ? t : void 0\n          }\n          function baseIsNative(t) {\n            return (\n              !(!isObject(t) || isMasked(t)) &&\n              (isFunction(t) || isHostObject(t) ? reIsNative : reIsHostCtor).test(toSource(t))\n            )\n          }\n          function baseToString(t) {\n            if (\"string\" == typeof t) return t\n            if (isSymbol(t)) return symbolToString ? symbolToString.call(t) : \"\"\n            var e = t + \"\"\n            return \"0\" == e && 1 / t == -INFINITY ? \"-0\" : e\n          }\n          function castPath(t) {\n            return isArray(t) ? t : stringToPath(t)\n          }\n          function getMapData(t, e) {\n            var r = t.__data__\n            return isKeyable(e) ? r[\"string\" == typeof e ? \"string\" : \"hash\"] : r.map\n          }\n          function getNative(t, e) {\n            var r = getValue(t, e)\n            return baseIsNative(r) ? r : void 0\n          }\n          function isKey(t, e) {\n            if (isArray(t)) return !1\n            var r = typeof t\n            return (\n              !(\"number\" != r && \"symbol\" != r && \"boolean\" != r && null != t && !isSymbol(t)) ||\n              reIsPlainProp.test(t) ||\n              !reIsDeepProp.test(t) ||\n              (null != e && t in Object(e))\n            )\n          }\n          function isKeyable(t) {\n            var e = typeof t\n            return \"string\" == e || \"number\" == e || \"symbol\" == e || \"boolean\" == e\n              ? \"__proto__\" !== t\n              : null === t\n          }\n          function isMasked(t) {\n            return !!maskSrcKey && maskSrcKey in t\n          }\n          ;(Hash.prototype.clear = hashClear),\n            (Hash.prototype.delete = hashDelete),\n            (Hash.prototype.get = hashGet),\n            (Hash.prototype.has = hashHas),\n            (Hash.prototype.set = hashSet),\n            (ListCache.prototype.clear = listCacheClear),\n            (ListCache.prototype.delete = listCacheDelete),\n            (ListCache.prototype.get = listCacheGet),\n            (ListCache.prototype.has = listCacheHas),\n            (ListCache.prototype.set = listCacheSet),\n            (MapCache.prototype.clear = mapCacheClear),\n            (MapCache.prototype.delete = mapCacheDelete),\n            (MapCache.prototype.get = mapCacheGet),\n            (MapCache.prototype.has = mapCacheHas),\n            (MapCache.prototype.set = mapCacheSet)\n          var stringToPath = memoize(function (t) {\n            t = toString(t)\n            var o = []\n            return (\n              reLeadingDot.test(t) && o.push(\"\"),\n              t.replace(rePropName, function (t, e, r, a) {\n                o.push(r ? a.replace(reEscapeChar, \"$1\") : e || t)\n              }),\n              o\n            )\n          })\n          function toKey(t) {\n            if (\"string\" == typeof t || isSymbol(t)) return t\n            var e = t + \"\"\n            return \"0\" == e && 1 / t == -INFINITY ? \"-0\" : e\n          }\n          function toSource(t) {\n            if (null != t) {\n              try {\n                return funcToString.call(t)\n              } catch (t) {}\n              try {\n                return t + \"\"\n              } catch (t) {}\n            }\n            return \"\"\n          }\n          function memoize(o, n) {\n            if (\"function\" != typeof o || (n && \"function\" != typeof n))\n              throw new TypeError(FUNC_ERROR_TEXT)\n            var i = function () {\n              var t = arguments,\n                e = n ? n.apply(this, t) : t[0],\n                r = i.cache\n              if (r.has(e)) return r.get(e)\n              var a = o.apply(this, t)\n              return (i.cache = r.set(e, a)), a\n            }\n            return (i.cache = new (memoize.Cache || MapCache)()), i\n          }\n          function eq(t, e) {\n            return t === e || (t != t && e != e)\n          }\n          memoize.Cache = MapCache\n          var isArray = Array.isArray\n          function isFunction(t) {\n            var e = isObject(t) ? objectToString.call(t) : \"\"\n            return e == funcTag || e == genTag\n          }\n          function isObject(t) {\n            var e = typeof t\n            return !!t && (\"object\" == e || \"function\" == e)\n          }\n          function isObjectLike(t) {\n            return !!t && \"object\" == typeof t\n          }\n          function isSymbol(t) {\n            return \"symbol\" == typeof t || (isObjectLike(t) && objectToString.call(t) == symbolTag)\n          }\n          function toString(t) {\n            return null == t ? \"\" : baseToString(t)\n          }\n          function get(t, e, r) {\n            var a = null == t ? void 0 : baseGet(t, e)\n            return void 0 === a ? r : a\n          }\n          return get\n        })()\n        /** @type {CompositeX.MetaNodeConfig} */\n        const nodeConfig = {\n          config: {\n            name: \"LodashGet\",\n            desc: \"Get element from an object via lodash.get\",\n            input: { type: \"any\" },\n            output: { type: \"any\" },\n            options: [{ name: \"path\", type: \"string\" }],\n          },\n          run(input, options, context) {\n            return lodashGet(input, options.path)\n          },\n        }\n        return nodeConfig\n      })()",
        "id": "lodashGet",
        "config": {
          "name": "LodashGet",
          "desc": "Get element from an object via lodash.get",
          "input": { "type": "any" },
          "output": { "type": "any" },
          "options": [{ "name": "path", "type": "string" }]
        }
      }
    },
    {
      "id": "d7861cf1-90b6-4470-80cf-bb3bc0912700",
      "metaId": "ShanbayOss",
      "name": "Node-ShanbayOss",
      "metaNode": {
        "_raw": "(function () {\n  /** @type {CompositeX.MetaNodeConfig} */\n  const nodeConfig = {\n    config: {\n      name: \"ShanbayOss\",\n      desc: \"Shanbay Oss uploader\",\n      input: { type: \"string\" },\n      output: { type: \"string\" },\n      options: [{ name: \"service\", type: \"string\", default: \"cms_comment_image\" }],\n    },\n    run(input, options, context) {\n      return context\n        .fetch(input)\n        .then((res) => {\n          const immetype = res.data.type\n          const ext = immetype.split('/')[1]\n          return new File([res], \"compositex-shanbay-oss.\" + ext, { type: immetype })\n        })\n        .then((file) => context.ShanbayOss({ file, service: options.service }))\n    },\n  }\n  return nodeConfig\n})()",
        "id": "ShanbayOss",
        "config": {
          "name": "ShanbayOss",
          "desc": "Shanbay Oss uploader",
          "input": { "type": "string" },
          "output": { "type": "string" },
          "options": [{ "name": "service", "type": "string", "default": "cms_comment_image" }]
        }
      }
    }
  ],
  "name": "Zeplin",
  "desc": ""
}
```
