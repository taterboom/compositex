```javascript
;(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "Tinypng",
      desc: "Compress via Tinypng",
      input: { type: "string" },
      output: { type: "any" },
      options: [
        {
          name: "apiKey",
          desc: "get your api key in https://tinypng.com/developers",
          type: "string",
        },
      ],
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
        .then((res) => res.json())
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
      input: { type: "string", desc: "expression" },
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
      desc: "Get Zeplin high precision img",
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
            .then((res) => res.json())
          const versionId = versionsRes.versions[0]._id
          const assetsUrlRes = await context
            .fetch(`${apiPrefix}${path}/versions/${versionId}/assets`, {
              headers: { "zeplin-token": token },
            })
            .then((res) => res.json())
          const asstesUrl = assetsUrlRes.url
          const layers = await context.fetch(asstesUrl).then((res) => res.json())
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
          .then((res) => res.json())
      }
      const { file, ext } = await context
        .fetch(input)
        .then((res) => res.blob())
        .then((res) => {
          const immetype = res.type
          let ext = immetype.split("/")[1]
          if (ext === "svg+xml") {
            ext = "svg"
          }
          console.log(ext, immetype)
          return {
            file: new File([res], "compositex-shanbay-oss." + ext, { type: immetype }),
            ext,
          }
        })
      const { data: token } = await context
        .fetch(
          `https://apiv3.shanbay.com/media/token?code=${options.code}&green_check=true&media_type=${ext}`
        )
        .then((res) => res.json())
      return upload(token, file)
    },
  }
  return nodeConfig
})()
```

```javascript
// folked color-string (https://github.com/Qix-/color-string)
;(function () {
  const colorNames = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  }
  var concat = Array.prototype.concat
  var slice = Array.prototype.slice
  function swizzle(args) {
    var results = []
    for (var i = 0, len = args.length; i < len; i++) {
      var arg = args[i]
      if (Array.isArray(arg)) {
        results = concat.call(results, slice.call(arg))
      } else {
        results.push(arg)
      }
    }
    return results
  }
  var hasOwnProperty = Object.hasOwnProperty,
    reverseNames = Object.create(null)
  for (var name in colorNames)
    hasOwnProperty.call(colorNames, name) && (reverseNames[colorNames[name]] = name)
  var cs = { to: {}, get: {} }
  function clamp(r, e, a) {
    return Math.min(Math.max(e, r), a)
  }
  function hexDouble(r) {
    var e = Math.round(r).toString(16).toUpperCase()
    return e.length < 2 ? "0" + e : e
  }
  ;(cs.get = function (r) {
    var e, a
    switch (r.substring(0, 3).toLowerCase()) {
      case "hsl":
        ;(e = cs.get.hsl(r)), (a = "hsl")
        break
      case "hwb":
        ;(e = cs.get.hwb(r)), (a = "hwb")
        break
      default:
        ;(e = cs.get.rgb(r)), (a = "rgb")
    }
    return e ? { model: a, value: e } : null
  }),
    (cs.get.rgb = function (r) {
      if (!r) return null
      var e,
        a,
        s,
        t = [0, 0, 0, 1]
      if ((e = r.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i))) {
        for (s = e[2], e = e[1], a = 0; a < 3; a++) {
          var n = 2 * a
          t[a] = parseInt(e.slice(n, n + 2), 16)
        }
        s && (t[3] = parseInt(s, 16) / 255)
      } else if ((e = r.match(/^#([a-f0-9]{3,4})$/i))) {
        for (s = (e = e[1])[3], a = 0; a < 3; a++) t[a] = parseInt(e[a] + e[a], 16)
        s && (t[3] = parseInt(s + s, 16) / 255)
      } else if (
        (e = r.match(
          /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/
        ))
      ) {
        for (a = 0; a < 3; a++) t[a] = parseInt(e[a + 1], 0)
        e[4] && (e[5] ? (t[3] = 0.01 * parseFloat(e[4])) : (t[3] = parseFloat(e[4])))
      } else {
        if (
          !(e = r.match(
            /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/
          ))
        )
          return (e = r.match(/^(\w+)$/))
            ? "transparent" === e[1]
              ? [0, 0, 0, 0]
              : hasOwnProperty.call(colorNames, e[1])
              ? (((t = colorNames[e[1]])[3] = 1), t)
              : null
            : null
        for (a = 0; a < 3; a++) t[a] = Math.round(2.55 * parseFloat(e[a + 1]))
        e[4] && (e[5] ? (t[3] = 0.01 * parseFloat(e[4])) : (t[3] = parseFloat(e[4])))
      }
      for (a = 0; a < 3; a++) t[a] = clamp(t[a], 0, 255)
      return (t[3] = clamp(t[3], 0, 1)), t
    }),
    (cs.get.hsl = function (r) {
      if (!r) return null
      var e = r.match(
        /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/
      )
      if (e) {
        var a = parseFloat(e[4])
        return [
          ((parseFloat(e[1]) % 360) + 360) % 360,
          clamp(parseFloat(e[2]), 0, 100),
          clamp(parseFloat(e[3]), 0, 100),
          clamp(isNaN(a) ? 1 : a, 0, 1),
        ]
      }
      return null
    }),
    (cs.get.hwb = function (r) {
      if (!r) return null
      var e = r.match(
        /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/
      )
      if (e) {
        var a = parseFloat(e[4])
        return [
          ((parseFloat(e[1]) % 360) + 360) % 360,
          clamp(parseFloat(e[2]), 0, 100),
          clamp(parseFloat(e[3]), 0, 100),
          clamp(isNaN(a) ? 1 : a, 0, 1),
        ]
      }
      return null
    }),
    (cs.to.hex = function () {
      var r = swizzle(arguments)
      return (
        "#" +
        hexDouble(r[0]) +
        hexDouble(r[1]) +
        hexDouble(r[2]) +
        (r[3] < 1 ? hexDouble(Math.round(255 * r[3])) : "")
      )
    }),
    (cs.to.rgb = function () {
      var r = swizzle(arguments)
      return r.length < 4 || 1 === r[3]
        ? "rgb(" + Math.round(r[0]) + ", " + Math.round(r[1]) + ", " + Math.round(r[2]) + ")"
        : "rgba(" +
            Math.round(r[0]) +
            ", " +
            Math.round(r[1]) +
            ", " +
            Math.round(r[2]) +
            ", " +
            r[3] +
            ")"
    }),
    (cs.to.rgb.percent = function () {
      var r = swizzle(arguments),
        e = Math.round((r[0] / 255) * 100),
        a = Math.round((r[1] / 255) * 100),
        s = Math.round((r[2] / 255) * 100)
      return r.length < 4 || 1 === r[3]
        ? "rgb(" + e + "%, " + a + "%, " + s + "%)"
        : "rgba(" + e + "%, " + a + "%, " + s + "%, " + r[3] + ")"
    }),
    (cs.to.hsl = function () {
      var r = swizzle(arguments)
      return r.length < 4 || 1 === r[3]
        ? "hsl(" + r[0] + ", " + r[1] + "%, " + r[2] + "%)"
        : "hsla(" + r[0] + ", " + r[1] + "%, " + r[2] + "%, " + r[3] + ")"
    }),
    (cs.to.hwb = function () {
      var r = swizzle(arguments),
        e = ""
      return (
        r.length >= 4 && 1 !== r[3] && (e = ", " + r[3]),
        "hwb(" + r[0] + ", " + r[1] + "%, " + r[2] + "%" + e + ")"
      )
    }),
    (cs.to.keyword = function (r) {
      return reverseNames[r.slice(0, 3)]
    })
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "Color",
      desc: "Color convert",
      input: { type: "string" },
      output: { type: "string" },
      options: [{ name: "format", type: "string", default: "hex" }],
    },
    run(input, options, context) {
      console.log(cs.to.hex([1, 2, 3, 1]))
      return cs.to[options.format](cs.get(input).value)
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
      name: "Base64",
      desc: "Base64 codec",
      input: { type: "string" },
      output: { type: "string" },
      options: [
        {
          name: "type",
          type: "enum",
          enumItems: [
            { name: "decode", value: "decode" },
            { name: "encode", value: "encode" },
          ],
          default: "decode",
        },
      ],
    },
    run(input, options, context) {
      if (options.type === "decode") {
        return window.atob(input)
      } else {
        return window.btoa(input)
      }
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
      name: "Pinyin",
      desc: "Pinyin convertion based on pinyin-api.vercel.app",
      input: { type: "string" },
      output: { type: "any" },
      options: [
        { name: "apiOptions", type: "json" },
        {
          name: "outputType",
          type: "enum",
          default: "list",
          enumItems: [
            { name: "text", value: "text" },
            { name: "list", value: "list" },
          ],
        },
      ],
    },
    async run(input, options, context) {
      const url = new URL("https://pinyin-api.vercel.app/api/generate")
      url.searchParams.append("wd", input)
      Object.entries(options.apiOptions || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
      const result = await context.fetch(url.toString()).then((res) => res.json())
      if (options.outputType === "text") {
        return result.join(" ")
      } else {
        return result
      }
    },
  }
  return nodeConfig
})()
```
