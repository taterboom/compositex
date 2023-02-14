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

```javascript
;(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "ZeplinImg",
      desc: "Get Zeplin a desired img url by input img url",
      input: { type: "string" },
      output: { type: "string" },
      options: [
        { name: "format", type: "string", default: "png" },
        { name: "densityScale", type: "number", default: 3 },
      ],
    },
    run(input, options, context) {
      return (async function (existUrl, format, densityScale) {
        const mainWorldPath = await context.mainWorld("location.pathname")
        const path = mainWorldPath.replace("project", "projects").replace("screen", "screens")
        const mainWorldLayersCache = await context.mainWorld("window.__layers_cache__")
        const layerFromCache = mainWorldLayersCache?.find?.((item) =>
          item.contents.some((content) => content.url === existUrl)
        )
        let layer = layerFromCache
        if (!layer) {
          const apiPrefix = "https://api.zeplin.io/v2"
          const mainWorldCookie = await context.mainWorld("document.cookie")
          const token = mainWorldCookie
            .split(";")
            .find((item) => item.trim().startsWith("userToken="))
            .split("userToken=")[1]
          const versionsRes = await context
            .fetch(`${apiPrefix}${path}/versions`, { headers: { "zeplin-token": token } })
            .then((res) => res.data)
          const versionId = versionsRes.versions[0]._id
          const assetsUrlRes = await context
            .fetch(`${apiPrefix}${path}/versions/${versionId}/assets`, {
              headers: { "zeplin-token": token },
            })
            .then((res) => res.data)
          const asstesUrl = assetsUrlRes.url
          const layers = await context.fetch(asstesUrl).then((res) => res.data)
          context.mainWorld("window.__layers_cache__=" + JSON.stringify(layers))
          layer = layers.find((item) => item.contents.some((content) => content.url === existUrl))
        }
        if (!layer) throw new Error("cannot found layer")
        return layer.contents.find(
          (item) => item.format === format && item.densityScale === densityScale
        )
      })(input, options.format, options.densityScale)
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
      name: "ShanbayOSS",
      desc: "Upload img to shanbay OSS",
      input: { type: "string" },
      output: { type: "any" },
      options: [{ name: "code", type: "string", default: "storage_media_image" }],
    },
    async run(input, options, context) {
      async function cryptoSign(k, m) {
        const enc = new TextEncoder("utf-8")
        const key = await window.crypto.subtle.importKey(
          "raw",
          enc.encode(k),
          {
            name: "HMAC",
            hash: { name: "SHA-1" },
          },
          false,
          ["sign", "verify"]
        )
        const encodedText = enc.encode(m)
        const signature = await window.crypto.subtle.sign("HMAC", key, encodedText)
        const signatureText = btoa(String.fromCharCode(...new Uint8Array(signature)))
        return signatureText
      }

      async function upload(token, file) {
        const callback = {
          callbackUrl: token.callback_url,
          callbackBody: token.callback_body,
          callbackBodyType: "application/json",
        }
        const gmtStr = new Date().toGMTString()
        const aliHeaders = {
          "x-oss-callback": btoa(JSON.stringify(callback)),
          "x-oss-callback-var": btoa(JSON.stringify(token.callback_vars)),
          "x-oss-date": gmtStr,
          "x-oss-security-token": token.Credentials.SecurityToken,
        }
        let signatureStr = "PUT\n"
        signatureStr += "\n"
        signatureStr += file.type + "\n"
        signatureStr += gmtStr + "\n"
        signatureStr +=
          Object.entries(aliHeaders)
            .map(([k, v]) => `${k}:${v}`)
            .join("\n") + "\n"
        signatureStr += "/" + token.bucket_name + "/" + token.key
        const signature = await cryptoSign(token.Credentials.AccessKeySecret, signatureStr)
        const authorization = "OSS " + token.Credentials.AccessKeyId + ":" + signature
        const apiUrlObj = new URL(token.endpoint)
        apiUrlObj.host = token.bucket_name + "." + apiUrlObj.host
        apiUrlObj.pathname = token.key
        const apiUrl = apiUrlObj.toString()
        return context
          .fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
              Date: gmtStr,
              authorization: authorization,
              ...aliHeaders,
            },
            body: file,
          })
          .then((res) => res.data)
      }
      const { file, ext } = await context.fetch(input).then((res) => {
        const immetype = res.data.type
        let ext = immetype.split("/")[1]
        if (ext === "svg+xml") {
          ext = "svg"
        }
        console.log(ext, immetype)
        return {
          file: new File([res.data], "compositex-shanbay-oss." + ext, { type: immetype }),
          ext,
        }
      })
      const { data: token } = await context
        .fetch(
          `https://apiv3.shanbay.com/media/token?code=${options.code}&green_check=true&media_type=${ext}`
        )
        .then((res) => res.data)
      return upload(token, file)
    },
  }
  return nodeConfig
})()
```
