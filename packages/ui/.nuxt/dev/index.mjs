import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, getResponseStatus, getCookie, setCookie, sanitizeStatusCode, removeResponseHeader, getRouterParam, getQuery as getQuery$1, getRequestWebStream, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, readBody, getResponseStatusText } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/h3@1.15.11/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/@vue+shared@3.5.40/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file:///D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/@nuxt+vite-builder@4.5.2_@b_ed685a7874dd5e7f8448680258b45183/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file:///D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/@nuxt+vite-builder@4.5.2_@b_ed685a7874dd5e7f8448680258b45183/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, joinRelativeURL, withTrailingSlash, withoutTrailingSlash, parsePath, withLeadingSlash, decodePath, encodePath } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/ufo@1.6.4/node_modules/ufo/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unhead@3.3.1_esbuild@0.28.1_3dc83f45a7afd3ea5d1f472002d30800/node_modules/unhead/dist/server.mjs';
import { isVNode, isRef, toValue } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/vue@3.5.41_typescript@7.0.2/node_modules/vue/index.mjs';
import { DeprecationsPlugin } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unhead@3.3.1_esbuild@0.28.1_3dc83f45a7afd3ea5d1f472002d30800/node_modules/unhead/dist/legacy.mjs';
import { PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unhead@3.3.1_esbuild@0.28.1_3dc83f45a7afd3ea5d1f472002d30800/node_modules/unhead/dist/plugins.mjs';
import { klona } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/klona@2.0.6/node_modules/klona/dist/index.mjs';
import defu, { defuFn, createDefu } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/scule@1.3.0/node_modules/scule/dist/index.mjs';
import { defineDiagnostics, createConsoleReporter } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/nostics@1.2.0/node_modules/nostics/dist/index.mjs';
import { ansiFormatter } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/nostics@1.2.0/node_modules/nostics/dist/formatters/ansi.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/vue-bundle-renderer@2.3.1/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { renderToString } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/vue@3.5.41_typescript@7.0.2/node_modules/vue/server-renderer/index.mjs';
import { stringify, uneval } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/devalue@5.9.0/node_modules/devalue/index.js';
import { createHooks } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/hookable@5.5.3/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/ofetch@1.5.1/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/node-mock-http@1.0.4/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1/node_modules/unstorage/drivers/fs.mjs';
import { digest, hash as hash$1 } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/radix3@1.1.2/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/consola@3.4.2/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/youch-core@0.3.3/node_modules/youch-core/build/index.js';
import { Youch } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/youch@4.1.1/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/source-map@0.7.6/node_modules/source-map/source-map.js';
import { createRouterMatcher } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/vue-router@5.2.0_@vue+compi_75a2c3ff7d6c78de2c07dbba0537e5b8/node_modules/vue-router/vue-router.node.mjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unctx@3.0.0_magic-string@1._a496494699e471740a5a112e620fda02/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/errx@0.1.2/node_modules/errx/dist/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/@nuxt+vite-builder@4.5.2_@b_ed685a7874dd5e7f8448680258b45183/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/pathe@2.0.3/node_modules/pathe/dist/index.mjs';
import { walkResolver } from 'file://D:/34938/Documents/github/QoQClashD/node_modules/.pnpm/unhead@3.3.1_esbuild@0.28.1_3dc83f45a7afd3ea5d1f472002d30800/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"D:/34938/Documents/github/QoQClashD/packages/ui/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage$1 = createStorage({});

storage$1.mount('/assets', assets$1);

storage$1.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/34938/Documents/github/QoQClashD/packages/ui","watchOptions":{"ignored":[null]}}));
storage$1.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/34938/Documents/github/QoQClashD/packages/ui/server","watchOptions":{"ignored":[null]}}));
storage$1.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/34938/Documents/github/QoQClashD/packages/ui/.nuxt"}));
storage$1.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/34938/Documents/github/QoQClashD/packages/ui/.nuxt/cache"}));
storage$1.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:/34938/Documents/github/QoQClashD/packages/ui/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage$1, base) : storage$1;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
      }
    }
  },
  "public": {
    "appVersion": "1.273.1",
    "mockMode": false,
    "defaultBackendURL": "",
    "githubToken": "",
    "i18n": {
      "baseUrl": "",
      "defaultLocale": "en",
      "rootRedirect": "",
      "redirectStatusCode": 302,
      "skipSettingLocaleOnNavigate": false,
      "locales": [
        {
          "code": "en",
          "name": "English",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "zh",
          "name": "简体中文",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "ru",
          "name": "Русский",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "ja",
          "name": "日本語",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "ko",
          "name": "한국어",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "fr",
          "name": "Français",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "fa",
          "name": "فارسی",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        }
      ],
      "detectBrowserLanguage": {
        "alwaysRedirect": false,
        "cookieCrossOrigin": false,
        "cookieDomain": "",
        "cookieKey": "metacubexd_lang",
        "cookieSecure": false,
        "fallbackLocale": "en",
        "redirectOn": "root",
        "useCookie": true
      },
      "experimental": {
        "localeDetector": "",
        "typedPages": true,
        "typedOptionsAndMessages": false,
        "alternateLinkCanonicalQueries": true,
        "devCache": false,
        "cacheLifetime": "",
        "stripMessagesPayload": false,
        "preload": false,
        "strictSeo": false,
        "nitroContextDetection": true,
        "httpCacheDuration": 10,
        "compactRoutes": false,
        "prerenderMessages": false,
        "optimizeMessageBundling": true
      },
      "domainLocales": {
        "en": {
          "domain": ""
        },
        "zh": {
          "domain": ""
        },
        "ru": {
          "domain": ""
        },
        "ja": {
          "domain": ""
        },
        "ko": {
          "domain": ""
        },
        "fr": {
          "domain": ""
        },
        "fa": {
          "domain": ""
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

//#region src/runtime/utils/error.ts
/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	if (hasReqHeader(event, "accept", "text/html")) return false;
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

//#region src/runtime/utils/dev.ts
const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

//#region src/runtime/handlers/error.ts
var error_default = async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) return;
	const defaultRes = await defaultHandler(error, event, { json: true });
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) defaultRes.body.stack = defaultRes.body.stack.join("\n");
	const errorObject = defaultRes.body;
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	const reqHeaders = getRequestHeaders(event);
	const res = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) return;
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		errorObject.description = errorObject.message;
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
	}
	return send(event, html);
};

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [error_default, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _1CuEGahg1q7vq82Xm79TuLeOXqgZDw_38ZkoAmXTqOk = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

/*!
  * shared v11.4.8
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */
/**
 * Original Utilities
 * written by kazuya kawaguchi
 */
const _create = Object.create;
const create = (obj = null) => _create(obj);
/* eslint-enable */
/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src, des) {
    // src and des should both be objects, and none of them can be a array
    if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
        throw new Error('Invalid value');
    }
    const stack = [{ src, des }];
    while (stack.length) {
        const { src, des } = stack.pop();
        // using `Object.keys` which skips prototype properties
        Object.keys(src).forEach(key => {
            if (key === '__proto__') {
                return;
            }
            // if src[key] is an object/array, set des[key]
            // to empty object/array to prevent setting by reference
            if (isObject(src[key]) && !isObject(des[key])) {
                des[key] = Array.isArray(src[key]) ? [] : create();
            }
            if (isNotObjectOrIsArray(des[key]) || isNotObjectOrIsArray(src[key])) {
                // replace with src[key] when:
                // src[key] or des[key] is not an object, or
                // src[key] or des[key] is an array
                des[key] = src[key];
            }
            else {
                // src[key] and des[key] are both objects, merge them
                stack.push({ src: src[key], des: des[key] });
            }
        });
    }
}

const __nuxtMock = { runWithContext: async (fn) => await fn() };
function cloneDeep(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  }
  const out = create(null);
  for (const key of Object.keys(value)) {
    out[key] = cloneDeep(value[key]);
  }
  return out;
}
function hasMessageFunction(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (isFunction(value)) {
    return true;
  }
  if (value == null || typeof value !== "object") {
    return false;
  }
  if (seen.has(value)) {
    return false;
  }
  seen.add(value);
  return Object.values(value).some((x) => hasMessageFunction(x, seen));
}
function warnMissedMessageFunctions(locale, messages) {
  const undeliverable = [];
  if (undeliverable.includes(locale) || !hasMessageFunction(messages)) {
    return;
  }
  console.warn(
    `[nuxt-i18n] Messages for locale "${locale}" contain message functions the build did not detect - they are dropped when messages are delivered as JSON. Write message functions literally in a locale file to make them detectable.`
  );
}
const merger = createDefu((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock;
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock;
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message, { cause: e });
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock;
  const messages = await Promise.all(
    loaders.map((loader) => nuxtApp.runWithContext(() => getLocaleMessages(locale, loader)))
  );
  const merged = {};
  for (const message of messages) {
    deepCopy(message, merged);
  }
  return merged;
}

const locale_en_46json_cce61557 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"A new version is available\",\"pwaUpdateReload\":\"Reload\",\"lastHour\":\"Last Hour\",\"lastDay\":\"Last Day\",\"lastWeek\":\"Last Week\",\"lastMonth\":\"Last Month\",\"customRange\":\"Custom Range\",\"forever\":\"Forever\",\"dataRetention\":\"Data Retention\",\"noDetailedData\":\"No detailed data available.\",\"home\":\"Home\",\"add\":\"Add\",\"collapse\":\"Collapse\",\"collapseAll\":\"Collapse All\",\"expandAll\":\"Expand All\",\"setup\":\"Setup\",\"setupDescription\":\"Connect to your Mihomo backend to get started\",\"overview\":\"Overview\",\"proxies\":\"Proxies\",\"proxiesSettings\":\"Proxies Settings\",\"backToTop\":\"Back to top\",\"rules\":\"Rules\",\"connections\":\"Connections\",\"connectionsSettings\":\"Connections Settings\",\"connectionsDetails\":\"Connections Details\",\"logs\":\"Logs\",\"logsSettings\":\"Logs Settings\",\"config\":\"Config\",\"controlCenter\":\"Control Center\",\"controlCenterDesc\":\"Manage the bundled kernel and host integration\",\"controlCenterKernel\":\"Kernel\",\"controlCenterSystem\":\"System Integration\",\"controlCenterConfig\":\"Configuration\",\"controlCenterBackup\":\"Backup\",\"controlCenterDesktop\":\"Desktop\",\"desktopBehavior\":\"Desktop Behavior\",\"desktopSilentUpdateCheck\":\"Check for updates automatically\",\"desktopSilentUpdateCheckDesc\":\"Notify when a new release is available (never installs anything)\",\"desktopTunAutoRestore\":\"Restore TUN mode at launch\",\"desktopTunAutoRestoreDesc\":\"Re-enable TUN on startup when the last session used it and the helper is installed\",\"desktopShowTraySpeed\":\"Show speed in tray\",\"desktopShowTraySpeedDesc\":\"Live upload/download rate in the menu bar / tray tooltip\",\"desktopHotkeys\":\"Global Hotkeys\",\"desktopHotkeysDesc\":\"System-wide shortcuts that work even when the window is closed\",\"desktopHotkeyToggleSystemProxy\":\"Toggle system proxy\",\"desktopHotkeyCycleProxyMode\":\"Cycle proxy mode\",\"desktopHotkeyToggleWindow\":\"Show / hide window\",\"desktopHotkeyPressKeys\":\"Press keys…\",\"desktopHotkeyDisabled\":\"Not set\",\"desktopHotkeyConflict\":\"Failed to register\",\"desktopHotkeyRecordHint\":\"Press a key combination with a modifier. Backspace clears, Esc cancels.\",\"desktopHotkeySave\":\"Save\",\"desktopHotkeyReset\":\"Reset to defaults\",\"upload\":\"Upload\",\"download\":\"Download\",\"uploadTotal\":\"Upload Total\",\"downloadTotal\":\"Download Total\",\"activeConnections\":\"Active Connections\",\"memoryUsage\":\"Memory Usage\",\"flow\":\"Flow\",\"traffic\":\"Traffic\",\"memory\":\"Memory\",\"down\":\"Down\",\"up\":\"Up\",\"proxyProviders\":\"Proxy Providers\",\"ruleProviders\":\"Rule Providers\",\"search\":\"Search\",\"inner\":\"Inner\",\"ID\":\"ID\",\"type\":\"Type\",\"name\":\"Name\",\"process\":\"Process\",\"host\":\"Host\",\"hostProcess\":\"Host / Process\",\"sniffHost\":\"Sniff Host\",\"chains\":\"Chains\",\"ruleChains\":\"Rule / Chains\",\"flowDirection\":\"Flow\",\"connectTime\":\"Time\",\"dlSpeed\":\"DL Speed\",\"ulSpeed\":\"UL Speed\",\"dl\":\"DL\",\"ul\":\"UL\",\"sourceIP\":\"Source IP\",\"sourcePort\":\"Source Port\",\"destination\":\"Destination\",\"inboundUser\":\"Inbound User\",\"user\":\"User\",\"close\":\"Close\",\"pause\":\"Pause\",\"resume\":\"Resume\",\"reset\":\"Reset\",\"resetSettings\":\"Reset Settings\",\"dnsQuery\":\"DNS Query\",\"save\":\"Save\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"Some DNS fields can be hot-applied. Others (such as the nameserver list) require a kernel reload — edit them in the config editor for full control.\",\"dnsEnhancedMode\":\"Enhanced Mode\",\"dnsNameserver\":\"Nameserver\",\"dnsNameserverPlaceholder\":\"One server per line\",\"dnsFallback\":\"Fallback\",\"dnsFallbackPlaceholder\":\"One server per line\",\"dnsFakeIpRange\":\"Fake IP Range\",\"dnsUseHosts\":\"Use Hosts\",\"dnsSettingsSaved\":\"DNS settings saved\",\"dnsSettingsSaveFailed\":\"Failed to save DNS settings\",\"dots\":\"Dots\",\"bar\":\"Bar\",\"auto\":\"Auto\",\"off\":\"Off\",\"proxiesPreviewType\":\"Proxies Preview Type\",\"proxiesPreviewAutoThreshold\":\"Auto Switch Threshold\",\"cardMode\":\"Card\",\"listMode\":\"List\",\"displayMode\":\"Display Mode\",\"tableMode\":\"Table\",\"masterDetailMode\":\"Master-detail\",\"none\":\"None\",\"urlForLatencyTest\":\"URL for Latency Test\",\"latencyTestUrlSource\":\"Latency Test URL Source\",\"latencyTestUrlSourceCore\":\"Core (per-group test URL)\",\"latencyTestUrlSourceDashboard\":\"Dashboard (single URL)\",\"autoCloseConns\":\"Automatically Close Connections\",\"autoSwitchEndpoint\":\"Automatically Switch Endpoint\",\"autoSwitchTheme\":\"Auto Switch Theme\",\"defaultPage\":\"Default Page\",\"favDayTheme\":\"Favorite Day Theme\",\"favNightTheme\":\"Favorite dark theme\",\"renderInTwoColumns\":\"Render In Two Columns\",\"proxiesCardSize\":\"Node Card Size\",\"cardSizeComfortable\":\"Comfortable\",\"cardSizeCompact\":\"Compact\",\"cardSizeTight\":\"Tight\",\"stickyGroupHeader\":\"Sticky Group Header\",\"updateGEODatabases\":\"Update GEO Databases\",\"restartCore\":\"Restart Core\",\"reloadConfigSuccess\":\"Config reloaded\",\"restartCoreConfirm\":\"Restart the core? This will interrupt all active connections.\",\"upgradeCore\":\"Upgrade Core\",\"upgradeUI\":\"Upgrade Dashboard\",\"upgradeUIConfirm\":\"Upgrade the dashboard? This downloads and replaces the current web dashboard files.\",\"upgradeCoreConfirm\":\"Upgrade the core? This downloads a new version and restarts the core, interrupting all connections.\",\"proxiesSorting\":\"Proxies Sorting\",\"orderNatural\":\"Original order in config file\",\"orderLatency_asc\":\"By latency from low to high\",\"orderLatency_desc\":\"By latency from high to low\",\"orderQuality_asc\":\"By quality from low to high\",\"orderQuality_desc\":\"By quality from high to low\",\"orderName_asc\":\"By name alphabetically (A-Z)\",\"orderName_desc\":\"By name alphabetically (Z-A)\",\"orderRuleType_asc\":\"By rule type (A-Z)\",\"orderRuleType_desc\":\"By rule type (Z-A)\",\"orderHitCount_desc\":\"Most matched first\",\"orderHitCount_asc\":\"Least matched first\",\"orderHitAt_desc\":\"Recently matched first\",\"ms\":\"ms\",\"updated\":\"Updated\",\"tableSize\":\"Table size\",\"logLevel\":\"Log Level\",\"info\":\"info\",\"silent\":\"silent\",\"debug\":\"debug\",\"warning\":\"warning\",\"error\":\"error\",\"logMaxRows\":\"Log Maximum Reserved Rows\",\"xs\":\"Extra small size\",\"sm\":\"Small size\",\"md\":\"Normal size\",\"lg\":\"Large size\",\"switchEndpoint\":\"Switch Endpoint\",\"switchLanguage\":\"Switch Language\",\"switchFont\":\"Switch Font\",\"enableTwemoji\":\"Enable Twemoji\",\"enableDataUsageTracking\":\"Track Data Usage\",\"enableDataUsageTrackingDesc\":\"Records per-connection traffic for the Data Usage page. Runs on every page; turn off to reduce CPU usage.\",\"latencyTestTimeoutDuration\":\"Latency Test Timeout Duration\",\"latencyMediumThreshold\":\"Latency Yellow Threshold\",\"latencyHighThreshold\":\"Latency Red Threshold\",\"thresholdAutoPlaceholder\":\"0 = auto (use defaults)\",\"all\":\"All\",\"sequence\":\"Sequence\",\"level\":\"Level\",\"payload\":\"Payload\",\"details\":\"Details\",\"endpointURL\":\"Endpoint URL\",\"secret\":\"Secret\",\"statusConnecting\":\"Connecting…\",\"statusProbing\":\"Probing default backend…\",\"statusUnreachable\":\"No backend detected\",\"statusError\":\"Backend unreachable\",\"statusAuthError\":\"Secret rejected\",\"statusBlocked\":\"Connection blocked\",\"statusIdle\":\"Enter your Mihomo backend\",\"secretHint\":\"Leave empty if your backend has no secret\",\"connect\":\"Connect\",\"connectPrompt\":\"Connect to your Mihomo backend to get started.\",\"runningMode\":\"Running Mode\",\"modeSwitchFailed\":\"Failed to switch mode\",\"global\":\"Global\",\"rule\":\"Rule\",\"direct\":\"Direct\",\"reject\":\"Reject\",\"rejectdrop\":\"Drop\",\"selector\":\"Selector\",\"urltest\":\"Urltest\",\"smart\":\"Smart\",\"loadbalance\":\"Balance\",\"fallback\":\"Fallback\",\"relay\":\"Relay\",\"pass\":\"Pass\",\"active\":\"Active\",\"closed\":\"Closed\",\"sort\":\"Sort\",\"hideUnavailableProxies\":\"Hide Unavailable Proxies\",\"reloadConfig\":\"Reload Config\",\"flushFakeIP\":\"Flush Fake-IP\",\"flushDNSCache\":\"Flush DNS Cache\",\"tagClientSourceIPWithName\":\"Tag Client Source IP With Name\",\"resolveClientHostname\":\"Resolve Hostnames (Reverse DNS)\",\"resolveClientHostnameDesc\":\"Show device names for LAN clients and names for raw-IP destinations via reverse DNS. Requires mihomo's DNS to resolve the relevant reverse zones.\",\"tag\":\"Tag\",\"coreConfig\":\"Core Config\",\"xdConfig\":\"XD Config\",\"version\":\"Version\",\"expire\":\"Expire\",\"noExpire\":\"Null\",\"allowLan\":\"Allow Lan\",\"enableTunDevice\":\"Enable TUN Device\",\"tunModeStack\":\"TUN Mode Stack\",\"tunDeviceName\":\"TUN Device Name\",\"tunLoadFailed\":\"Failed to load TUN status\",\"tunEnableSuccess\":\"TUN mode enabled\",\"tunEnableFailed\":\"Failed to enable TUN mode\",\"tunDisableSuccess\":\"TUN mode disabled — network restored\",\"tunDisableFailed\":\"Failed to disable TUN mode\",\"tunRecoverNetwork\":\"Recover Network\",\"tunInstallNote\":\"Enabling TUN installs a privileged helper and prompts for administrator authorization. An unsigned build will show an \\\"unknown publisher\\\" warning — this is expected.\",\"tunNeedsProfile\":\"Import a subscription before enabling TUN mode.\",\"tunStatusLabel\":\"Status\",\"tunStatusActive\":\"TUN active\",\"tunStatusSidecar\":\"Sidecar (system network unaffected)\",\"tunUninstallHelper\":\"Uninstall Helper Service\",\"tunUninstallSuccess\":\"Helper service uninstalled\",\"tunUninstallFailed\":\"Failed to uninstall the helper service\",\"tunUninstallConfirm\":\"Uninstall the privileged helper service? You'll be prompted to elevate again the next time you enable TUN.\",\"outboundInterfaceName\":\"Outbound Interface Name\",\"port\":\"{name} Port\",\"quickFilter\":\"Quick Filter\",\"iconHeight\":\"Icon Height\",\"iconMarginRight\":\"Icon Margin Right\",\"dataUsage\":\"Data Usage\",\"clearAll\":\"Clear All\",\"confirmClearAll\":\"Clear all data usage?\",\"devices\":\"Devices\",\"timeRange\":\"Time Range\",\"grandTotal\":\"Grand Total\",\"macAddress\":\"MAC Address\",\"ipAddress\":\"IP Address\",\"duration\":\"Duration\",\"total\":\"Total\",\"actions\":\"Actions\",\"remove\":\"Remove\",\"noDataUsageYet\":\"No data usage recorded yet\",\"noData\":\"No data\",\"noRules\":\"No rules\",\"noRuleProviders\":\"No rule providers\",\"disabled\":\"Disabled\",\"enabled\":\"Enabled\",\"status\":\"Status\",\"noMatchingRules\":\"No rules match your filters\",\"clearFilters\":\"Clear filters\",\"ruleMatched\":\"Matched\",\"ruleUnmatched\":\"Unmatched\",\"lastMatchedAt\":\"Last matched\",\"lastUnmatchedAt\":\"Last unmatched\",\"columns\":\"Columns\",\"sortBy\":\"Sort by\",\"sortOverriddenBySearch\":\"Sorted by search relevance while searching\",\"groupBy\":\"Group by\",\"rowsPerPage\":\"Rows per page\",\"ipShort\":\"IP\",\"na\":\"N/A\",\"show\":\"Show\",\"noLatencyHistory\":\"No latency history\",\"testLatency\":\"Test latency\",\"unfixProxy\":\"Restore automatic selection\",\"dataUsageInfo\":\"Data usage monitoring is performed on the client-side (browser). When the browser is closed, monitoring will likely not run.\",\"basic\":\"Basic\",\"start\":\"Start\",\"rulePayload\":\"Rule Payload\",\"metadata\":\"Metadata\",\"network\":\"Network\",\"dnsMode\":\"DNS Mode\",\"sourceAndDestination\":\"Source & Destination\",\"source\":\"Source\",\"remoteDestination\":\"Remote Destination\",\"inbound\":\"Inbound\",\"inboundName\":\"Inbound Name\",\"inboundIP\":\"Inbound IP\",\"processName\":\"Process Name\",\"processPath\":\"Process Path\",\"special\":\"Special\",\"specialProxy\":\"Special Proxy\",\"specialRules\":\"Special Rules\",\"connectionsChart\":\"Connections\",\"networkTypes\":\"Network Types\",\"topProxies\":\"Top Proxies\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"Latency\",\"other\":\"Other\",\"showTrafficIndicator\":\"Show Traffic Indicator\",\"hideTrafficIndicator\":\"Hide Traffic Indicator\",\"currentIP\":\"Current IP\",\"country\":\"Country\",\"city\":\"City\",\"organization\":\"Organization\",\"proxyDetection\":\"Proxy Detection\",\"clean\":\"Clean\",\"networkLatency\":\"Network Latency\",\"average\":\"Average\",\"timeout\":\"Timeout\",\"networkTopology\":\"Network Topology\",\"client\":\"Client\",\"destinations\":\"Destinations\",\"waitingForConnections\":\"Waiting for connections...\",\"conn\":\"conn\",\"more\":\"More\",\"connectedTo\":\"Connected to\",\"clients\":\"Clients\",\"groups\":\"Groups\",\"nodes\":\"Nodes\",\"proxyGroups\":\"Proxy Groups\",\"proxyNodes\":\"Proxy Nodes\",\"ruleType\":\"Rule Type\",\"useMobileBottomNav\":\"Use Bottom Navigation (Mobile)\",\"fetchRemoteConfig\":\"Fetch Remote Config\",\"remoteConfigURL\":\"Remote Config URL\",\"remoteConfigURLPlaceholder\":\"Enter config file URL\",\"shortcuts\":{\"title\":\"Keyboard Shortcuts\",\"category\":{\"navigation\":\"Navigation\",\"actions\":\"Actions\"},\"goToOverview\":\"Go to Overview\",\"goToProxies\":\"Go to Proxies\",\"goToConnections\":\"Go to Connections\",\"goToRules\":\"Go to Rules\",\"goToLogs\":\"Go to Logs\",\"goToConfig\":\"Go to Config\",\"refresh\":\"Refresh\",\"closeModal\":\"Close Modal\",\"showHelp\":\"Show Help\",\"pressKey\":\"Press a key...\",\"pressEscToClose\":\"Press Esc to close\",\"customized\":\"customized\",\"conflictWith\":\"Conflicts with\",\"forceApply\":\"Apply anyway\",\"resetToDefaults\":\"Reset to Defaults\"},\"connectionError\":\"Backend Unreachable\",\"connectionErrorDesc\":\"Cannot connect to the backend. Please check if the backend is running or switch to another endpoint.\",\"retry\":\"Retry\",\"recommendation\":{\"title\":\"Smart Recommendation\",\"recommended\":\"Recommended\",\"testAll\":\"Test All\",\"testAllGroups\":\"Test All Groups\",\"switchToRecommended\":\"Switch to Recommended\",\"testing\":\"Testing\",\"score\":\"Score\",\"latencyWeight\":\"Latency Weight\",\"stabilityWeight\":\"Stability Weight\",\"successRateWeight\":\"Success Rate Weight\",\"autoSwitch\":\"Auto Switch to Recommended\",\"autoSwitchDesc\":\"Automatically switch to the recommended node after testing\",\"minTestInterval\":\"Minimum Test Interval (min)\",\"excludedNodes\":\"Excluded Nodes\",\"clearHistory\":\"Clear History\",\"noScoreYet\":\"No score yet\"},\"themeColorTooltip\":\"Color order: Background, Accent, Text\",\"mixedContentError\":\"Cannot connect: this page is loaded over HTTPS but the backend URL is HTTP. Browsers block this for security. Please access the panel directly via your backend (e.g. http://127.0.0.1:9090/ui) or deploy the panel over HTTP.\",\"endpointConnectError\":\"Failed to connect to the backend. Please check the URL and ensure the backend is running.\",\"filterNodesByName\":\"Filter nodes by name\",\"jumpToCurrent\":\"Jump to current\",\"regionOther\":\"Other\",\"clear\":\"Clear\",\"copy\":\"Copy\",\"copyValue\":\"Copy value\",\"geoLocation\":\"Location\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"Saved Endpoints\",\"unifiedDelay\":\"Unified Delay\",\"appearance\":\"Appearance\",\"fontFamily\":\"Font\",\"backgroundImage\":\"Background\",\"backgroundCustomImage\":\"Custom Image\",\"backgroundImageUrlOption\":\"Image URL\",\"uploadImage\":\"Upload Image\",\"backgroundImageUrlPlaceholder\":\"Enter an image URL (e.g. a Bing daily wallpaper)\",\"backgroundBlur\":\"Background Blur\",\"backgroundOverlayOpacity\":\"Overlay Opacity\",\"customThemeColors\":\"Custom Theme Colors\",\"customThemeColorsDesc\":\"Override theme color tokens\",\"customCss\":\"Custom CSS\",\"customCssDesc\":\"Advanced: inject your own CSS to restyle the dashboard\",\"customCssPlaceholder\":\"/* e.g. .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"Settings Backup\",\"exportSettings\":\"Export\",\"importSettings\":\"Import\",\"kernelControl\":\"Kernel Control\",\"kernelStatus\":\"Status\",\"kernelVersion\":\"Version\",\"kernelUptime\":\"Uptime\",\"kernelPid\":\"PID\",\"kernelStart\":\"Start\",\"kernelStop\":\"Stop\",\"kernelRestart\":\"Restart\",\"kernelRollback\":\"Rollback config\",\"kernelRecover\":\"Reset to minimal\",\"kernelRollbackConfirm\":\"Restore the last-known-good config and restart the kernel?\",\"kernelRecoverConfirm\":\"Reset the active config to a minimal one and restart? Re-import a profile afterwards.\",\"kernelRollbackApplied\":\"Rolled back to the previous config\",\"kernelRecoverApplied\":\"Reset to a minimal config\",\"kernelRollbackFailed\":\"Rollback failed\",\"kernelRecoverFailed\":\"Recovery failed\",\"kernelLogs\":\"Kernel Logs\",\"kernelLogsConnected\":\"Streaming\",\"kernelLogsDisconnected\":\"Disconnected\",\"kernelLogsClear\":\"Clear\",\"systemProxy\":\"System Proxy\",\"systemProxyEnable\":\"Enable system proxy\",\"systemProxyDescription\":\"Route system traffic through the managed proxy on port {port}.\",\"systemProxyBypass\":\"Bypass / LAN whitelist\",\"systemProxyBypassPlaceholder\":\"One host or CIDR per line, e.g. localhost\",\"systemProxyApply\":\"Apply\",\"systemProxyLoadFailed\":\"Failed to load system proxy state\",\"systemProxyApplyFailed\":\"Failed to apply system proxy settings\",\"systemProxyApplied\":\"System proxy settings applied\",\"kernelVersionManager\":\"Kernel Version\",\"kernelVersionCurrent\":\"Current\",\"kernelVersionBundled\":\"Bundled\",\"kernelVersionSelect\":\"Switch to version\",\"kernelVersionActive\":\"active\",\"kernelVersionSwitch\":\"Switch & Restart\",\"kernelVersionSwitched\":\"Switched to {version}\",\"kernelVersionSwitchFailed\":\"Failed to switch kernel version\",\"kernelVersionLoadFailed\":\"Failed to load kernel versions\",\"geoAssets\":\"GEO Databases\",\"geoAssetsDescription\":\"Download the latest geoip / geosite / mmdb databases used for routing rules.\",\"geoUpdate\":\"Update GEO databases\",\"geoUpdateSuccess\":\"GEO databases updated\",\"geoUpdateFailed\":\"Failed to update GEO databases\",\"webdavBackup\":\"WebDAV Backup\",\"webdavBackupDescription\":\"Back up your profiles and dashboard settings to a WebDAV server and restore them on another device.\",\"webdavUrl\":\"Server URL\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"Username\",\"webdavPassword\":\"Password\",\"webdavDir\":\"Directory\",\"webdavDirPlaceholder\":\"metacubexd (optional)\",\"webdavBackupNow\":\"Backup now\",\"webdavRestore\":\"Restore\",\"webdavBackupSuccess\":\"Backup uploaded to WebDAV\",\"webdavBackupFailed\":\"WebDAV backup failed\",\"webdavRestoreSuccess\":\"Restored from WebDAV\",\"webdavRestoreCount\":\"{count} profiles restored\",\"webdavRestoreFailed\":\"WebDAV restore failed\",\"runtimeConfig\":\"Runtime Config\",\"runtimeConfigDescription\":\"Read-only view of the actual config file the kernel is running with (it carries the injected external-controller, secret and mixed-port).\",\"runtimeConfigEmpty\":\"No runtime config available yet.\",\"runtimeConfigLoadFailed\":\"Failed to load runtime config\",\"export\":\"Export\",\"exportCSV\":\"Export CSV\",\"exportJSON\":\"Export JSON\",\"healthCheckAllProviders\":\"Health-check all providers\",\"providerHealthCheckSuccess\":\"All providers health-checked\",\"providerHealthCheckFailed\":\"Failed to health-check some providers\",\"connectivityBoard\":\"Connectivity Board\",\"connectivityTargets\":\"Connectivity\",\"streamingUnlockTargets\":\"Streaming / AI\",\"reachabilityNode\":\"Node or group\",\"reachabilityNoNodes\":\"No nodes available\",\"reachabilityRunTest\":\"Run test\",\"reachabilityResults\":\"Reachability results\",\"reachabilityUnreachable\":\"Unreachable\",\"reachabilityUnlockLimitation\":\"This is proxy reachability (delay-test based), not full region-unlock detection. Region-level unlock requires response-body inspection, which is out of scope here.\",\"reachabilityHint\":\"Pick a node or group, then run the test to probe each target through it.\",\"reachabilityAllUnreachable\":\"All targets are unreachable through {node}\",\"profiles\":\"Profiles\",\"profilesNew\":\"New Profile\",\"profilesImport\":\"Import from URL\",\"profilesDuplicate\":\"Duplicate\",\"profilesDelete\":\"Delete\",\"profilesEdit\":\"Edit\",\"profilesActivate\":\"Activate\",\"profilesValidate\":\"Validate\",\"profilesActive\":\"Active\",\"profilesName\":\"Name\",\"profilesUrl\":\"Subscription URL\",\"profilesSave\":\"Save\",\"profilesCancel\":\"Cancel\",\"profilesValidationOk\":\"Configuration is valid\",\"profilesEmpty\":\"No profiles yet\",\"profilesMerges\":\"Merge overlays\",\"profilesMergesHelp\":\"Merge overlays are YAML fragments composed onto the active base profile. Enable the ones you want layered on top.\",\"profilesNewMerge\":\"New merge overlay\",\"profilesMergeEnabled\":\"Enabled\",\"profilesMergeNoActiveBase\":\"Activate a base profile to apply merge overlays.\",\"profilesMergeUpdateFailed\":\"Failed to update merge overlay\",\"profilesScripts\":\"Script transforms\",\"profilesScriptsHelp\":\"A script receives the config object and returns the modified config. Scripts run after merges during composition. Enable the ones you want to apply.\",\"profilesScriptsSafety\":\"Safety: scripts run with broad access — only run scripts you trust. Editing or toggling a script re-activates the active base to recompute.\",\"profilesNewScript\":\"New script\",\"profilesScriptEnabled\":\"Enabled\",\"profilesScriptUpdateFailed\":\"Failed to update script transform\",\"profilesShare\":\"Share QR\",\"profilesShareTitle\":\"Share subscription\",\"profilesShareUrl\":\"Subscription URL\",\"profilesShareCopy\":\"Copy URL\",\"profilesShareCopied\":\"Subscription URL copied\",\"editorReadOnly\":\"Read only\",\"editorDisableValidation\":\"Disable validation\",\"editRules\":\"Edit Rules\",\"editProxies\":\"Edit proxies and groups\",\"edit\":\"Edit\",\"moveUp\":\"Move up\",\"moveDown\":\"Move down\",\"proxyConfigEditorTitle\":\"Edit proxies and groups\",\"proxyConfigEditorHint\":\"Edit proxy nodes and groups from the active profile. Proxy Provider definitions remain managed in the full profile editor. Saving validates the complete configuration and restarts the kernel once.\",\"proxyConfigSaved\":\"Proxy configuration saved\",\"proxyConfigLoadFailed\":\"Failed to load proxy configuration\",\"proxyConfigSaveFailed\":\"Failed to save proxy configuration\",\"routingEditorNoActiveProfile\":\"No active profile is available to edit. Import or activate a profile first.\",\"routingEditorConflict\":\"The subscription has unresolved conflicts\",\"routingEditorConflictHint\":\"Resolve the conflicts in the full profile editor before editing this page.\",\"routingEditorResolveConflict\":\"Open full profile editor\",\"routingEditorDiscardConfirm\":\"Discard unsaved configuration changes?\",\"routingEditorRulePlaceholder\":\"Enter the complete Mihomo rule, for example DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"This resource is still referenced and cannot be deleted\",\"routingEditorNodes\":\"Local proxy nodes\",\"routingEditorMembers\":\"members\",\"routingEditorNameLocked\":\"The name of an existing resource is locked to preserve references.\",\"routingEditorNameTypeRequired\":\"Name and type are required.\",\"routingEditorDuplicateName\":\"A proxy or group named “{name}” already exists.\",\"routingEditorJsonObjectRequired\":\"Advanced JSON must be an object.\",\"routingEditorSelectMember\":\"Select a proxy or group\",\"routingEditorSelectProvider\":\"Select a Proxy Provider\",\"rulesEditorHint\":\"Add, edit, delete or drag to reorder rules. Saving restarts the kernel once.\",\"policy\":\"Policy\",\"reorder\":\"Drag to reorder\",\"delete\":\"Delete\",\"cancel\":\"Cancel\",\"rulesEditorSaved\":\"Rules saved\",\"rulesEditorLoadFailed\":\"Failed to load rules\",\"rulesEditorSaveFailed\":\"Failed to save rules\",\"rulesEditorInvalid\":\"Each rule needs a non-empty type, payload and policy\",\"networkConfig\":\"Network Config\",\"networkConfigHint\":\"Edit the active profile's network sections. Saving restarts the kernel once.\",\"networkConfigSaved\":\"Network config saved\",\"networkConfigLoadFailed\":\"Failed to load network config\",\"networkConfigSaveFailed\":\"Failed to save network config\",\"tunnels\":\"Tunnels\",\"tunnelsHint\":\"Forward a local listener to a remote target through the kernel.\",\"tunnelNetwork\":\"Network\",\"tunnelAddress\":\"Listen Address\",\"tunnelTarget\":\"Target\",\"noTunnels\":\"No tunnels\",\"sniffer\":\"Sniffer\",\"snifferEnable\":\"Enable Sniffer\",\"snifferOverrideDestination\":\"Override Destination\",\"externalController\":\"External Controller\",\"externalControllerManaged\":\"Managed by the app on desktop\",\"onboardingWelcomeTitle\":\"Welcome to MetaCubeXD\",\"onboardingWelcomeBody\":\"Paste your subscription and have a working proxy in under a minute.\",\"onboardingGetStarted\":\"Get started\",\"onboardingSkip\":\"Skip for now\",\"onboardingImportTitle\":\"Import your subscription\",\"onboardingImportSubtitle\":\"Paste a subscription URL, choose a file, or paste from your clipboard.\",\"onboardingImportSuccess\":\"Subscription imported and activated\",\"onboardingFileTooLarge\":\"File is too large\",\"onboardingClipboardEmpty\":\"Clipboard is empty\",\"onboardingClipboardDenied\":\"Clipboard access was denied\",\"onboardingSystemProxyTitle\":\"Enable system proxy\",\"onboardingSystemProxyBody\":\"Route all apps on this device through the proxy.\",\"onboardingDoneTitle\":\"You're all set\",\"onboardingDoneBody\":\"Your subscription is active. Pick a node to start browsing.\",\"onboardingGoToProxies\":\"Go to proxies\",\"onboardingFinish\":\"Finish\",\"onboardingBack\":\"Back\",\"onboardingNext\":\"Next\",\"onboardingStep\":\"Step {current} of {total}\",\"onboardingEmptyTitle\":\"No subscription yet\",\"onboardingEmptyBody\":\"Import a subscription to start using the proxy.\",\"onboardingEmptyImport\":\"Import subscription\",\"onboardingEmptyRunSetup\":\"Run setup again\",\"profilesImportTitle\":\"Import subscription\",\"profilesImportSubtitle\":\"Add a subscription by URL, file, or clipboard.\",\"profilesImportFile\":\"Import from file\",\"profilesImportClipboard\":\"Paste from clipboard\",\"profilesImportSuccess\":\"Subscription imported\",\"profilesImportFailed\":\"Failed to import subscription\",\"profilesAdvanced\":\"Advanced\",\"profilesRefresh\":\"Refresh\",\"profilesRefreshAndApply\":\"Refresh and apply\",\"profilesRefreshed\":\"Subscription refreshed\",\"profilesRefreshFailed\":\"Failed to refresh subscription\",\"profilesAutoUpdate\":\"Auto-update\",\"profilesAutoUpdateOff\":\"Off\",\"profilesAutoUpdateMinutes\":\"{n} min\",\"profilesAutoUpdateHours\":\"{n} h\",\"profilesUpdated\":\"Updated {time}\",\"profilesActivated\":\"Profile activated\",\"profilesActionFailed\":\"Action failed\",\"profilesDeleteConfirm\":\"Delete \\\"{name}\\\"? This cannot be undone.\",\"profilesDeleteActiveConfirm\":\"\\\"{name}\\\" is the active profile. Deleting it tears down the running config. Continue?\",\"profilesEditing\":\"Editing {name}\",\"visualEditor\":\"Visual editor\",\"visualEditorUnavailable\":\"The visual editor is available only with the Desktop or All-in-One Agent.\",\"visualEditorBack\":\"Back to profiles\",\"visualEditorUnsaved\":\"Unsaved\",\"visualEditorVisual\":\"Visual\",\"visualEditorSettings\":\"Settings\",\"visualEditorResources\":\"Resources\",\"visualEditorRouting\":\"Routing\",\"visualEditorSubRules\":\"Sub-rules\",\"visualEditorOperations\":\"operations\",\"visualEditorReset\":\"Reset overrides\",\"visualEditorResetConfirm\":\"Reset all visual overrides for this subscription?\",\"visualEditorProxy\":\"Proxy\",\"visualEditorGroup\":\"Group\",\"visualEditorUnnamed\":\"Unnamed\",\"visualEditorDropHint\":\"Drag proxies or providers here\",\"visualEditorResourceEdit\":\"Edit resource\",\"visualEditorAdvancedJson\":\"Advanced fields (JSON)\",\"visualEditorAddField\":\"Add a field\",\"visualEditorPreview\":\"Review changes\",\"visualEditorPreviewFailed\":\"Failed to prepare preview\",\"visualEditorApply\":\"Validate and apply\",\"visualEditorActivate\":\"Validate and activate\",\"visualEditorApplied\":\"Configuration applied\",\"visualEditorApplyFailed\":\"Failed to apply configuration\",\"visualEditorLeaveConfirm\":\"Discard unsaved visual editor changes?\",\"visualEditorConflicts\":\"Subscription conflicts\",\"visualEditorKeepLocal\":\"Keep local override\",\"visualEditorAcceptUpstream\":\"Accept subscription value\",\"visualEditorManualMerge\":\"Merge in YAML\",\"visualEditorDiagnostics\":\"Configuration diagnostics\",\"visualEditorManaged\":\"Managed\",\"quality\":\"Quality\",\"sortDefault\":\"Default\"}");

const locale_zh_46json_db0649d0 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"发现新版本\",\"pwaUpdateReload\":\"刷新\",\"lastHour\":\"上一小时\",\"lastDay\":\"最近一天\",\"lastWeek\":\"最近一周\",\"lastMonth\":\"最近一月\",\"customRange\":\"自定义时间\",\"forever\":\"永久保存\",\"dataRetention\":\"数据保留\",\"noDetailedData\":\"暂无详细数据\",\"home\":\"首页\",\"add\":\"添加\",\"collapse\":\"收起\",\"collapseAll\":\"全部收起\",\"expandAll\":\"全部展开\",\"setup\":\"设置\",\"setupDescription\":\"连接到 Mihomo 后端以开始使用\",\"overview\":\"概览\",\"proxies\":\"代理\",\"proxiesSettings\":\"代理设置\",\"backToTop\":\"返回顶部\",\"rules\":\"规则\",\"connections\":\"连接\",\"connectionsSettings\":\"连接设置\",\"connectionsDetails\":\"连接详情\",\"logs\":\"日志\",\"logsSettings\":\"日志设置\",\"config\":\"配置\",\"controlCenter\":\"控制中心\",\"controlCenterDesc\":\"管理内置内核与系统集成\",\"controlCenterKernel\":\"内核\",\"controlCenterSystem\":\"系统集成\",\"controlCenterConfig\":\"配置\",\"controlCenterBackup\":\"备份\",\"controlCenterDesktop\":\"桌面端\",\"desktopBehavior\":\"桌面端行为\",\"desktopSilentUpdateCheck\":\"自动检查更新\",\"desktopSilentUpdateCheckDesc\":\"发现新版本时通知提醒（不会自动安装）\",\"desktopTunAutoRestore\":\"启动时恢复 TUN 模式\",\"desktopTunAutoRestoreDesc\":\"上次退出时处于 TUN 模式且 Helper 已安装时，启动后自动重新启用\",\"desktopShowTraySpeed\":\"托盘显示速率\",\"desktopShowTraySpeedDesc\":\"在菜单栏 / 托盘提示中显示实时上下行速率\",\"desktopHotkeys\":\"全局快捷键\",\"desktopHotkeysDesc\":\"系统级快捷键，窗口关闭后依然生效\",\"desktopHotkeyToggleSystemProxy\":\"开关系统代理\",\"desktopHotkeyCycleProxyMode\":\"切换代理模式\",\"desktopHotkeyToggleWindow\":\"显示 / 隐藏窗口\",\"desktopHotkeyPressKeys\":\"请按下按键…\",\"desktopHotkeyDisabled\":\"未设置\",\"desktopHotkeyConflict\":\"注册失败\",\"desktopHotkeyRecordHint\":\"请按下带修饰键的组合键；Backspace 清除，Esc 取消。\",\"desktopHotkeySave\":\"保存\",\"desktopHotkeyReset\":\"恢复默认\",\"upload\":\"上传\",\"download\":\"下载\",\"uploadTotal\":\"上传总量\",\"downloadTotal\":\"下载总量\",\"activeConnections\":\"活动连接\",\"memoryUsage\":\"内存使用情况\",\"flow\":\"流量\",\"traffic\":\"流量\",\"memory\":\"内存\",\"down\":\"下载\",\"up\":\"上传\",\"proxyProviders\":\"代理提供者\",\"ruleProviders\":\"规则提供者\",\"search\":\"搜索\",\"inner\":\"内部\",\"ID\":\"ID\",\"type\":\"类型\",\"name\":\"名字\",\"process\":\"进程\",\"host\":\"主机\",\"hostProcess\":\"主机 / 进程\",\"sniffHost\":\"嗅探域名\",\"chains\":\"链路\",\"ruleChains\":\"规则 / 链路\",\"flowDirection\":\"流向\",\"connectTime\":\"连接时间\",\"dlSpeed\":\"下载速度\",\"ulSpeed\":\"上传速度\",\"dl\":\"下载量\",\"ul\":\"上传量\",\"sourceIP\":\"源地址\",\"sourcePort\":\"源端口\",\"destination\":\"目标地址\",\"inboundUser\":\"入站用户\",\"user\":\"用户\",\"close\":\"关闭\",\"pause\":\"暂停\",\"resume\":\"继续\",\"reset\":\"重置\",\"resetSettings\":\"重置设置\",\"dnsQuery\":\"DNS 查询\",\"save\":\"保存\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"部分 DNS 字段可热更新。其它字段（如 nameserver 列表）需要重载内核才能生效——如需完整控制，请在配置编辑器中修改。\",\"dnsEnhancedMode\":\"增强模式\",\"dnsNameserver\":\"默认 DNS\",\"dnsNameserverPlaceholder\":\"每行一个服务器\",\"dnsFallback\":\"故障转移 DNS\",\"dnsFallbackPlaceholder\":\"每行一个服务器\",\"dnsFakeIpRange\":\"Fake IP 范围\",\"dnsUseHosts\":\"使用 Hosts\",\"dnsSettingsSaved\":\"DNS 设置已保存\",\"dnsSettingsSaveFailed\":\"保存 DNS 设置失败\",\"dots\":\"点阵\",\"bar\":\"条形\",\"auto\":\"自适应\",\"off\":\"关闭\",\"proxiesPreviewType\":\"节点组预览样式\",\"proxiesPreviewAutoThreshold\":\"自适应切换阈值\",\"cardMode\":\"卡片\",\"listMode\":\"列表\",\"displayMode\":\"显示模式\",\"tableMode\":\"表格\",\"masterDetailMode\":\"主从\",\"none\":\"无\",\"urlForLatencyTest\":\"测速链接\",\"latencyTestUrlSource\":\"测速链接来源\",\"latencyTestUrlSourceCore\":\"核心控制（各策略组测速链接）\",\"latencyTestUrlSourceDashboard\":\"面板控制（统一测速链接）\",\"autoCloseConns\":\"自动断开连接\",\"autoSwitchEndpoint\":\"自动切换后端\",\"autoSwitchTheme\":\"自动切换主题\",\"defaultPage\":\"默认页面\",\"favDayTheme\":\"浅色主题偏好\",\"favNightTheme\":\"深色主题偏好\",\"renderInTwoColumns\":\"双列渲染\",\"proxiesCardSize\":\"节点卡片大小\",\"cardSizeComfortable\":\"舒适\",\"cardSizeCompact\":\"紧凑\",\"cardSizeTight\":\"超紧凑\",\"stickyGroupHeader\":\"分组头部吸顶\",\"updateGEODatabases\":\"更新 GEO 数据库\",\"restartCore\":\"重启核心\",\"reloadConfigSuccess\":\"配置已重载\",\"restartCoreConfirm\":\"确定要重启核心吗？这将中断所有连接。\",\"upgradeCore\":\"更新核心\",\"upgradeUI\":\"更新控制面板\",\"upgradeUIConfirm\":\"更新控制面板？将下载并替换当前的 Web 控制面板文件。\",\"upgradeCoreConfirm\":\"更新核心？将下载新版本并重启核心，中断所有连接。\",\"proxiesSorting\":\"节点排序\",\"orderNatural\":\"原配置文件中的排序\",\"orderLatency_asc\":\"按延迟从低到高\",\"orderLatency_desc\":\"按延迟从高到低\",\"orderQuality_asc\":\"按质量从低到高\",\"orderQuality_desc\":\"按质量从高到低\",\"orderName_asc\":\"按名称字母排序 (A-Z)\",\"orderName_desc\":\"按名称字母排序 (Z-A)\",\"orderRuleType_asc\":\"按类型 (A-Z)\",\"orderRuleType_desc\":\"按类型 (Z-A)\",\"orderHitCount_desc\":\"命中次数最多优先\",\"orderHitCount_asc\":\"命中次数最少优先\",\"orderHitAt_desc\":\"最近命中优先\",\"ms\":\"毫秒\",\"updated\":\"更新于\",\"tableSize\":\"表格大小\",\"logLevel\":\"日志等级\",\"info\":\"信息\",\"silent\":\"静默\",\"debug\":\"调试\",\"warning\":\"警告\",\"error\":\"错误\",\"logMaxRows\":\"日志最大保留行数\",\"xs\":\"超小尺寸\",\"sm\":\"小尺寸\",\"md\":\"正常尺寸\",\"lg\":\"超大尺寸\",\"switchEndpoint\":\"切换后端\",\"switchLanguage\":\"切换语言\",\"switchFont\":\"切换字体\",\"enableTwemoji\":\"启用 Twemoji\",\"enableDataUsageTracking\":\"记录流量用量\",\"enableDataUsageTrackingDesc\":\"为「流量用量」页面按连接记录流量。该统计在所有页面后台运行,关闭可降低 CPU 占用。\",\"latencyTestTimeoutDuration\":\"测速超时时间\",\"latencyMediumThreshold\":\"延迟黄色阈值\",\"latencyHighThreshold\":\"延迟红色阈值\",\"thresholdAutoPlaceholder\":\"0 = 自动（使用默认值）\",\"all\":\"全部\",\"sequence\":\"序列号\",\"level\":\"等级\",\"payload\":\"内容\",\"details\":\"详情\",\"endpointURL\":\"后端地址\",\"secret\":\"密钥\",\"statusConnecting\":\"连接中…\",\"statusProbing\":\"正在探测默认后端…\",\"statusUnreachable\":\"未检测到后端\",\"statusError\":\"后端无法连接\",\"statusAuthError\":\"secret 被拒绝\",\"statusBlocked\":\"连接被阻止\",\"statusIdle\":\"输入你的 Mihomo 后端\",\"secretHint\":\"如果后端没有设置 secret，留空即可\",\"connect\":\"连接\",\"connectPrompt\":\"连接到你的 Mihomo 后端以开始使用。\",\"runningMode\":\"运行模式\",\"modeSwitchFailed\":\"切换模式失败\",\"global\":\"全局\",\"rule\":\"规则\",\"direct\":\"直连\",\"reject\":\"拒绝\",\"rejectdrop\":\"丢弃\",\"selector\":\"手动选择\",\"urltest\":\"自动选择\",\"smart\":\"智能选择\",\"loadbalance\":\"负载均衡\",\"fallback\":\"故障转移\",\"relay\":\"链式代理\",\"pass\":\"绕过\",\"active\":\"活动\",\"closed\":\"已关闭\",\"sort\":\"排序\",\"hideUnavailableProxies\":\"隐藏不可用节点\",\"reloadConfig\":\"重载配置\",\"flushFakeIP\":\"清空 Fake-IP\",\"flushDNSCache\":\"清空 DNS 缓存\",\"tagClientSourceIPWithName\":\"为客户端源 IP 地址添加名称标记\",\"resolveClientHostname\":\"通过反向 DNS 解析主机名\",\"resolveClientHostnameDesc\":\"通过反向 DNS 为局域网客户端和无 host 的目标 IP 显示名称。需要 mihomo 的 DNS 能解析相应的反向区域。\",\"tag\":\"标记\",\"coreConfig\":\"核心配置\",\"xdConfig\":\"XD 配置\",\"version\":\"版本\",\"expire\":\"到期时间\",\"noExpire\":\"不限时\",\"allowLan\":\"允许局域网访问\",\"enableTunDevice\":\"开启 TUN 转发\",\"tunModeStack\":\"TUN 模式堆栈\",\"tunDeviceName\":\"TUN 设备名称\",\"tunLoadFailed\":\"加载 TUN 状态失败\",\"tunEnableSuccess\":\"已开启 TUN 模式\",\"tunEnableFailed\":\"开启 TUN 模式失败\",\"tunDisableSuccess\":\"已关闭 TUN 模式 — 网络已恢复\",\"tunDisableFailed\":\"关闭 TUN 模式失败\",\"tunRecoverNetwork\":\"恢复网络\",\"tunInstallNote\":\"开启 TUN 会安装特权 helper 并弹出管理员授权请求。未签名的构建会显示“未知发布者”警告——这是正常现象。\",\"tunNeedsProfile\":\"启用 TUN 模式前请先导入订阅。\",\"tunStatusLabel\":\"状态\",\"tunStatusActive\":\"TUN 已启用\",\"tunStatusSidecar\":\"Sidecar（不影响系统网络）\",\"tunUninstallHelper\":\"卸载特权助手服务\",\"tunUninstallSuccess\":\"助手服务已卸载\",\"tunUninstallFailed\":\"卸载助手服务失败\",\"tunUninstallConfirm\":\"卸载特权助手服务？下次启用 TUN 时需要重新授权提权。\",\"outboundInterfaceName\":\"出站接口名称\",\"port\":\"{name} 端口\",\"quickFilter\":\"快速过滤\",\"iconHeight\":\"图标高度\",\"iconMarginRight\":\"图标右边距\",\"dataUsage\":\"用量\",\"clearAll\":\"清空全部\",\"confirmClearAll\":\"清除所有数据用量记录？\",\"devices\":\"设备\",\"timeRange\":\"时间范围\",\"grandTotal\":\"总计\",\"macAddress\":\"MAC 地址\",\"ipAddress\":\"IP 地址\",\"duration\":\"持续时长\",\"total\":\"总量\",\"actions\":\"操作\",\"remove\":\"移除\",\"noDataUsageYet\":\"暂无数据用量记录\",\"noData\":\"暂无数据\",\"noRules\":\"暂无规则\",\"noRuleProviders\":\"暂无规则提供者\",\"disabled\":\"已禁用\",\"enabled\":\"已启用\",\"status\":\"状态\",\"noMatchingRules\":\"没有符合筛选条件的规则\",\"clearFilters\":\"清除筛选\",\"ruleMatched\":\"命中\",\"ruleUnmatched\":\"未命中\",\"lastMatchedAt\":\"最近命中\",\"lastUnmatchedAt\":\"最近未命中\",\"columns\":\"列\",\"sortBy\":\"排序\",\"sortOverriddenBySearch\":\"搜索时按相关度排序\",\"groupBy\":\"分组\",\"rowsPerPage\":\"每页行数\",\"ipShort\":\"IP\",\"na\":\"无\",\"show\":\"显示\",\"noLatencyHistory\":\"暂无测速记录\",\"testLatency\":\"测试延迟\",\"unfixProxy\":\"恢复自动选择\",\"dataUsageInfo\":\"数据用量监控在客户端（浏览器）执行。当浏览器关闭时，监控可能不会运行。\",\"basic\":\"基本信息\",\"start\":\"开始时间\",\"rulePayload\":\"规则载荷\",\"metadata\":\"元数据\",\"network\":\"网络\",\"dnsMode\":\"DNS 模式\",\"sourceAndDestination\":\"源与目标\",\"source\":\"源\",\"remoteDestination\":\"远程目的地\",\"inbound\":\"入站\",\"inboundName\":\"入站名称\",\"inboundIP\":\"入站 IP\",\"processName\":\"进程名称\",\"processPath\":\"进程路径\",\"special\":\"特殊\",\"specialProxy\":\"特殊代理\",\"specialRules\":\"特殊规则\",\"connectionsChart\":\"连接数\",\"networkTypes\":\"网络类型\",\"topProxies\":\"热门代理\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"延迟\",\"other\":\"其他\",\"showTrafficIndicator\":\"显示流量指示器\",\"hideTrafficIndicator\":\"隐藏流量指示器\",\"currentIP\":\"当前 IP\",\"country\":\"国家\",\"city\":\"城市\",\"organization\":\"组织\",\"proxyDetection\":\"代理检测\",\"clean\":\"正常\",\"networkLatency\":\"网络延迟\",\"average\":\"平均\",\"timeout\":\"超时\",\"networkTopology\":\"网络拓扑\",\"client\":\"客户端\",\"destinations\":\"目标\",\"waitingForConnections\":\"等待连接...\",\"conn\":\"连接\",\"more\":\"更多\",\"connectedTo\":\"已连接到\",\"clients\":\"客户端\",\"groups\":\"代理组\",\"nodes\":\"节点\",\"proxyGroups\":\"代理组\",\"proxyNodes\":\"代理节点\",\"ruleType\":\"规则类型\",\"useMobileBottomNav\":\"使用底部导航栏 (移动端)\",\"fetchRemoteConfig\":\"拉取远程配置\",\"remoteConfigURL\":\"远程配置地址\",\"remoteConfigURLPlaceholder\":\"输入配置文件 URL\",\"shortcuts\":{\"title\":\"键盘快捷键\",\"category\":{\"navigation\":\"导航\",\"actions\":\"操作\"},\"goToOverview\":\"跳转到概览\",\"goToProxies\":\"跳转到代理\",\"goToConnections\":\"跳转到连接\",\"goToRules\":\"跳转到规则\",\"goToLogs\":\"跳转到日志\",\"goToConfig\":\"跳转到配置\",\"refresh\":\"刷新\",\"closeModal\":\"关闭弹窗\",\"showHelp\":\"显示帮助\",\"pressKey\":\"按下按键...\",\"pressEscToClose\":\"按 Esc 关闭\",\"customized\":\"已自定义\",\"conflictWith\":\"与以下冲突\",\"forceApply\":\"强制应用\",\"resetToDefaults\":\"重置为默认\"},\"connectionError\":\"后端不可达\",\"connectionErrorDesc\":\"无法连接到后端，请检查后端是否正在运行，或切换到其他后端。\",\"retry\":\"重试\",\"recommendation\":{\"title\":\"智能推荐\",\"recommended\":\"推荐\",\"testAll\":\"全部测速\",\"testAllGroups\":\"测试所有代理组\",\"switchToRecommended\":\"切换到推荐节点\",\"testing\":\"测试中\",\"score\":\"评分\",\"latencyWeight\":\"延迟权重\",\"stabilityWeight\":\"稳定性权重\",\"successRateWeight\":\"成功率权重\",\"autoSwitch\":\"自动切换到推荐节点\",\"autoSwitchDesc\":\"测试完成后自动切换到推荐的节点\",\"minTestInterval\":\"最小测试间隔（分钟）\",\"excludedNodes\":\"排除的节点\",\"clearHistory\":\"清除历史\",\"noScoreYet\":\"暂无评分\"},\"themeColorTooltip\":\"颜色顺序：背景、强调色、文字\",\"mixedContentError\":\"无法连接：当前页面通过 HTTPS 加载，但后端地址为 HTTP，浏览器会出于安全原因拦截此请求。请直接通过后端地址访问面板（如 http://127.0.0.1:9090/ui），或将面板部署在 HTTP 环境下。\",\"endpointConnectError\":\"无法连接后端，请检查地址是否正确以及后端是否正在运行。\",\"filterNodesByName\":\"按名称筛选节点\",\"jumpToCurrent\":\"跳到当前\",\"regionOther\":\"其他\",\"clear\":\"清除\",\"copy\":\"复制\",\"copyValue\":\"复制值\",\"geoLocation\":\"地理位置\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"已保存的端点\",\"unifiedDelay\":\"统一延迟\",\"appearance\":\"外观\",\"fontFamily\":\"字体\",\"backgroundImage\":\"背景\",\"backgroundCustomImage\":\"自定义图片\",\"backgroundImageUrlOption\":\"图片链接\",\"uploadImage\":\"上传图片\",\"backgroundImageUrlPlaceholder\":\"输入图片链接（如 Bing 每日壁纸）\",\"backgroundBlur\":\"背景模糊\",\"backgroundOverlayOpacity\":\"遮罩不透明度\",\"customThemeColors\":\"自定义主题色\",\"customThemeColorsDesc\":\"覆盖主题配色变量\",\"customCss\":\"自定义 CSS\",\"customCssDesc\":\"高级：注入自定义 CSS 以重新美化面板\",\"customCssPlaceholder\":\"/* 例如 .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"设置备份\",\"exportSettings\":\"导出\",\"importSettings\":\"导入\",\"kernelControl\":\"内核控制\",\"kernelStatus\":\"状态\",\"kernelVersion\":\"版本\",\"kernelUptime\":\"运行时长\",\"kernelPid\":\"进程 ID\",\"kernelStart\":\"启动\",\"kernelStop\":\"停止\",\"kernelRestart\":\"重启\",\"kernelRollback\":\"回滚配置\",\"kernelRecover\":\"重置为最小配置\",\"kernelRollbackConfirm\":\"恢复上一次可用的配置并重启内核吗？\",\"kernelRecoverConfirm\":\"将活动配置重置为最小配置并重启吗？之后请重新导入订阅。\",\"kernelRollbackApplied\":\"已回滚到上一次的配置\",\"kernelRecoverApplied\":\"已重置为最小配置\",\"kernelRollbackFailed\":\"回滚失败\",\"kernelRecoverFailed\":\"恢复失败\",\"kernelLogs\":\"内核日志\",\"kernelLogsConnected\":\"实时\",\"kernelLogsDisconnected\":\"已断开\",\"kernelLogsClear\":\"清空\",\"systemProxy\":\"系统代理\",\"systemProxyEnable\":\"启用系统代理\",\"systemProxyDescription\":\"将系统流量通过端口 {port} 上的受管代理转发。\",\"systemProxyBypass\":\"绕过 / 局域网白名单\",\"systemProxyBypassPlaceholder\":\"每行一个主机或 CIDR，例如 localhost\",\"systemProxyApply\":\"应用\",\"systemProxyLoadFailed\":\"加载系统代理状态失败\",\"systemProxyApplyFailed\":\"应用系统代理设置失败\",\"systemProxyApplied\":\"系统代理设置已应用\",\"kernelVersionManager\":\"内核版本\",\"kernelVersionCurrent\":\"当前\",\"kernelVersionBundled\":\"内置\",\"kernelVersionSelect\":\"切换到版本\",\"kernelVersionActive\":\"使用中\",\"kernelVersionSwitch\":\"切换并重启\",\"kernelVersionSwitched\":\"已切换到 {version}\",\"kernelVersionSwitchFailed\":\"切换内核版本失败\",\"kernelVersionLoadFailed\":\"加载内核版本失败\",\"geoAssets\":\"GEO 数据库\",\"geoAssetsDescription\":\"下载用于路由规则的最新 geoip / geosite / mmdb 数据库。\",\"geoUpdate\":\"更新 GEO 数据库\",\"geoUpdateSuccess\":\"GEO 数据库已更新\",\"geoUpdateFailed\":\"更新 GEO 数据库失败\",\"webdavBackup\":\"WebDAV 备份\",\"webdavBackupDescription\":\"将配置文件与面板设置备份到 WebDAV 服务器，并可在其他设备上恢复。\",\"webdavUrl\":\"服务器地址\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"用户名\",\"webdavPassword\":\"密码\",\"webdavDir\":\"目录\",\"webdavDirPlaceholder\":\"metacubexd（可选）\",\"webdavBackupNow\":\"立即备份\",\"webdavRestore\":\"恢复\",\"webdavBackupSuccess\":\"已上传备份到 WebDAV\",\"webdavBackupFailed\":\"WebDAV 备份失败\",\"webdavRestoreSuccess\":\"已从 WebDAV 恢复\",\"webdavRestoreCount\":\"已恢复 {count} 个配置文件\",\"webdavRestoreFailed\":\"WebDAV 恢复失败\",\"runtimeConfig\":\"运行时配置\",\"runtimeConfigDescription\":\"只读查看内核实际运行的配置文件（包含注入的 external-controller、secret 与 mixed-port）。\",\"runtimeConfigEmpty\":\"暂无运行时配置。\",\"runtimeConfigLoadFailed\":\"加载运行时配置失败\",\"export\":\"导出\",\"exportCSV\":\"导出 CSV\",\"exportJSON\":\"导出 JSON\",\"healthCheckAllProviders\":\"检测所有提供者\",\"providerHealthCheckSuccess\":\"已检测所有提供者\",\"providerHealthCheckFailed\":\"部分提供者检测失败\",\"connectivityBoard\":\"连通性面板\",\"connectivityTargets\":\"连通性\",\"streamingUnlockTargets\":\"流媒体 / AI\",\"reachabilityNode\":\"节点或分组\",\"reachabilityNoNodes\":\"暂无可用节点\",\"reachabilityRunTest\":\"开始测试\",\"reachabilityResults\":\"连通性结果\",\"reachabilityUnreachable\":\"不可达\",\"reachabilityUnlockLimitation\":\"这是基于延迟测试的代理连通性检测，并非完整的地区解锁检测。地区级解锁需要检查响应内容，超出本功能范围。\",\"reachabilityHint\":\"选择一个节点或分组，然后开始测试，逐个探测各目标的连通性。\",\"reachabilityAllUnreachable\":\"通过 {node} 无法连通任何目标\",\"profiles\":\"配置文件\",\"profilesNew\":\"新建配置\",\"profilesImport\":\"从 URL 导入\",\"profilesDuplicate\":\"复制\",\"profilesDelete\":\"删除\",\"profilesEdit\":\"编辑\",\"profilesActivate\":\"激活\",\"profilesValidate\":\"校验\",\"profilesActive\":\"当前激活\",\"profilesName\":\"名称\",\"profilesUrl\":\"订阅链接\",\"profilesSave\":\"保存\",\"profilesCancel\":\"取消\",\"profilesValidationOk\":\"配置有效\",\"profilesEmpty\":\"暂无配置文件\",\"profilesMerges\":\"合并覆盖\",\"profilesMergesHelp\":\"合并覆盖是叠加到当前激活基础配置上的 YAML 片段。启用你希望叠加的覆盖项。\",\"profilesNewMerge\":\"新建合并覆盖\",\"profilesMergeEnabled\":\"已启用\",\"profilesMergeNoActiveBase\":\"请先激活一个基础配置以应用合并覆盖。\",\"profilesMergeUpdateFailed\":\"更新合并覆盖失败\",\"profilesScripts\":\"脚本转换\",\"profilesScriptsHelp\":\"脚本接收配置对象并返回修改后的配置。脚本在合成期间于合并之后运行。启用你希望应用的脚本。\",\"profilesScriptsSafety\":\"安全提示：脚本以较高权限运行——请只运行你信任的脚本。编辑或切换脚本会重新激活当前基础配置以重新计算。\",\"profilesNewScript\":\"新建脚本\",\"profilesScriptEnabled\":\"已启用\",\"profilesScriptUpdateFailed\":\"更新脚本转换失败\",\"profilesShare\":\"分享二维码\",\"profilesShareTitle\":\"分享订阅\",\"profilesShareUrl\":\"订阅链接\",\"profilesShareCopy\":\"复制链接\",\"profilesShareCopied\":\"已复制订阅链接\",\"editorReadOnly\":\"只读\",\"editorDisableValidation\":\"关闭校验\",\"editRules\":\"编辑规则\",\"editProxies\":\"编辑代理与策略组\",\"edit\":\"编辑\",\"moveUp\":\"上移\",\"moveDown\":\"下移\",\"proxyConfigEditorTitle\":\"编辑代理与策略组\",\"proxyConfigEditorHint\":\"编辑当前活动配置中的本地代理节点与策略组。Proxy Provider 定义仍由完整配置编辑器管理。保存会校验完整配置，并且只重启一次内核。\",\"proxyConfigSaved\":\"代理配置已保存\",\"proxyConfigLoadFailed\":\"加载代理配置失败\",\"proxyConfigSaveFailed\":\"保存代理配置失败\",\"routingEditorNoActiveProfile\":\"当前没有可编辑的活动配置。请先导入或激活一个配置。\",\"routingEditorConflict\":\"订阅存在尚未解决的冲突\",\"routingEditorConflictHint\":\"请先在完整配置编辑器中解决冲突，再从此页面编辑。\",\"routingEditorResolveConflict\":\"打开完整配置编辑器\",\"routingEditorDiscardConfirm\":\"放弃尚未保存的配置更改吗？\",\"routingEditorRulePlaceholder\":\"输入完整的 Mihomo 规则，例如 DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"此资源仍被引用，无法删除\",\"routingEditorNodes\":\"本地代理节点\",\"routingEditorMembers\":\"个成员\",\"routingEditorNameLocked\":\"已有资源的名称已锁定，以免破坏引用。\",\"routingEditorNameTypeRequired\":\"名称和类型不能为空。\",\"routingEditorDuplicateName\":\"名为“{name}”的代理或策略组已存在。\",\"routingEditorJsonObjectRequired\":\"高级 JSON 必须是对象。\",\"routingEditorSelectMember\":\"选择代理或策略组\",\"routingEditorSelectProvider\":\"选择 Proxy Provider\",\"rulesEditorHint\":\"添加、编辑、删除或拖动排序规则。保存会重启一次内核。\",\"policy\":\"策略\",\"reorder\":\"拖动排序\",\"delete\":\"删除\",\"cancel\":\"取消\",\"rulesEditorSaved\":\"规则已保存\",\"rulesEditorLoadFailed\":\"加载规则失败\",\"rulesEditorSaveFailed\":\"保存规则失败\",\"rulesEditorInvalid\":\"每条规则的类型、匹配内容和策略都不能为空\",\"networkConfig\":\"网络配置\",\"networkConfigHint\":\"编辑当前配置文件的网络部分。保存会重启一次内核。\",\"networkConfigSaved\":\"网络配置已保存\",\"networkConfigLoadFailed\":\"加载网络配置失败\",\"networkConfigSaveFailed\":\"保存网络配置失败\",\"tunnels\":\"隧道\",\"tunnelsHint\":\"通过内核将本地监听转发到远程目标。\",\"tunnelNetwork\":\"网络\",\"tunnelAddress\":\"监听地址\",\"tunnelTarget\":\"目标\",\"noTunnels\":\"无隧道\",\"sniffer\":\"嗅探器\",\"snifferEnable\":\"启用嗅探器\",\"snifferOverrideDestination\":\"覆盖目标地址\",\"externalController\":\"外部控制器\",\"externalControllerManaged\":\"桌面端由应用管理\",\"onboardingWelcomeTitle\":\"欢迎使用 MetaCubeXD\",\"onboardingWelcomeBody\":\"粘贴你的订阅，不到一分钟即可用上代理。\",\"onboardingGetStarted\":\"开始使用\",\"onboardingSkip\":\"暂时跳过\",\"onboardingImportTitle\":\"导入你的订阅\",\"onboardingImportSubtitle\":\"粘贴订阅链接、选择文件，或从剪贴板粘贴。\",\"onboardingImportSuccess\":\"订阅已导入并启用\",\"onboardingFileTooLarge\":\"文件过大\",\"onboardingClipboardEmpty\":\"剪贴板为空\",\"onboardingClipboardDenied\":\"剪贴板访问被拒绝\",\"onboardingSystemProxyTitle\":\"启用系统代理\",\"onboardingSystemProxyBody\":\"让本设备上的所有应用都通过代理访问网络。\",\"onboardingDoneTitle\":\"全部就绪\",\"onboardingDoneBody\":\"订阅已生效，选择一个节点即可开始上网。\",\"onboardingGoToProxies\":\"前往代理\",\"onboardingFinish\":\"完成\",\"onboardingBack\":\"上一步\",\"onboardingNext\":\"下一步\",\"onboardingStep\":\"第 {current} / {total} 步\",\"onboardingEmptyTitle\":\"还没有订阅\",\"onboardingEmptyBody\":\"导入一个订阅即可开始使用代理。\",\"onboardingEmptyImport\":\"导入订阅\",\"onboardingEmptyRunSetup\":\"重新运行向导\",\"profilesImportTitle\":\"导入订阅\",\"profilesImportSubtitle\":\"通过链接、文件或剪贴板添加订阅。\",\"profilesImportFile\":\"从文件导入\",\"profilesImportClipboard\":\"从剪贴板粘贴\",\"profilesImportSuccess\":\"订阅已导入\",\"profilesImportFailed\":\"导入订阅失败\",\"profilesAdvanced\":\"高级\",\"profilesRefresh\":\"刷新\",\"profilesRefreshAndApply\":\"刷新并应用\",\"profilesRefreshed\":\"订阅已刷新\",\"profilesRefreshFailed\":\"刷新订阅失败\",\"profilesAutoUpdate\":\"自动更新\",\"profilesAutoUpdateOff\":\"关闭\",\"profilesAutoUpdateMinutes\":\"{n} 分钟\",\"profilesAutoUpdateHours\":\"{n} 小时\",\"profilesUpdated\":\"更新于 {time}\",\"profilesActivated\":\"配置已激活\",\"profilesActionFailed\":\"操作失败\",\"profilesDeleteConfirm\":\"删除「{name}」？此操作无法撤销。\",\"profilesDeleteActiveConfirm\":\"「{name}」是当前激活的配置，删除它会拆除正在运行的配置。是否继续？\",\"profilesEditing\":\"正在编辑 {name}\",\"visualEditor\":\"可视化编辑\",\"visualEditorUnavailable\":\"可视化编辑器仅在桌面版或 All-in-One Agent 中可用。\",\"visualEditorBack\":\"返回配置档案\",\"visualEditorUnsaved\":\"未保存\",\"visualEditorVisual\":\"可视化\",\"visualEditorSettings\":\"设置\",\"visualEditorResources\":\"资源\",\"visualEditorRouting\":\"路由编排\",\"visualEditorSubRules\":\"子规则\",\"visualEditorOperations\":\"项操作\",\"visualEditorReset\":\"重置覆盖\",\"visualEditorResetConfirm\":\"重置此订阅的全部可视化覆盖吗？\",\"visualEditorProxy\":\"代理\",\"visualEditorGroup\":\"策略组\",\"visualEditorUnnamed\":\"未命名\",\"visualEditorDropHint\":\"将代理或 Provider 拖到这里\",\"visualEditorResourceEdit\":\"编辑资源\",\"visualEditorAdvancedJson\":\"高级字段（JSON）\",\"visualEditorAddField\":\"添加字段\",\"visualEditorPreview\":\"检查变更\",\"visualEditorPreviewFailed\":\"无法生成变更预览\",\"visualEditorApply\":\"验证并应用\",\"visualEditorActivate\":\"验证并激活\",\"visualEditorApplied\":\"配置已应用\",\"visualEditorApplyFailed\":\"配置应用失败\",\"visualEditorLeaveConfirm\":\"放弃尚未保存的可视化编辑吗？\",\"visualEditorConflicts\":\"订阅冲突\",\"visualEditorKeepLocal\":\"保留本地覆盖\",\"visualEditorAcceptUpstream\":\"接受订阅值\",\"visualEditorManualMerge\":\"在 YAML 中合并\",\"visualEditorDiagnostics\":\"配置诊断\",\"visualEditorManaged\":\"托管\",\"quality\":\"质量\",\"sortDefault\":\"默认\"}");

const locale_ru_46json_489d78f3 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"Доступна новая версия\",\"pwaUpdateReload\":\"Обновить\",\"lastHour\":\"За час\",\"lastDay\":\"За день\",\"lastWeek\":\"За неделю\",\"lastMonth\":\"За месяц\",\"customRange\":\"Свой диапазон\",\"forever\":\"Всегда\",\"dataRetention\":\"Хранение данных\",\"noDetailedData\":\"Нет детальных данных.\",\"home\":\"Главная\",\"add\":\"Добавить\",\"collapse\":\"Свернуть\",\"collapseAll\":\"Свернуть все\",\"expandAll\":\"Развернуть все\",\"setup\":\"Настройка\",\"setupDescription\":\"Подключитесь к бэкенду Mihomo, чтобы начать\",\"overview\":\"Обзор\",\"proxies\":\"Прокси\",\"proxiesSettings\":\"Настройки прокси\",\"backToTop\":\"Наверх\",\"rules\":\"Правила\",\"connections\":\"Соединения\",\"connectionsSettings\":\"Настройки соединений\",\"connectionsDetails\":\"Детали соединения\",\"logs\":\"Журнал\",\"logsSettings\":\"Настройки журнала\",\"config\":\"Конфигурация\",\"controlCenter\":\"Центр управления\",\"controlCenterDesc\":\"Управление встроенным ядром и интеграцией с системой\",\"controlCenterKernel\":\"Ядро\",\"controlCenterSystem\":\"Интеграция с системой\",\"controlCenterConfig\":\"Конфигурация\",\"controlCenterBackup\":\"Резервное копирование\",\"controlCenterDesktop\":\"Рабочий стол\",\"desktopBehavior\":\"Поведение приложения\",\"desktopSilentUpdateCheck\":\"Автоматическая проверка обновлений\",\"desktopSilentUpdateCheckDesc\":\"Уведомлять о новых версиях (без автоматической установки)\",\"desktopTunAutoRestore\":\"Восстанавливать режим TUN при запуске\",\"desktopTunAutoRestoreDesc\":\"Снова включать TUN при запуске, если он был активен в прошлой сессии и хелпер установлен\",\"desktopShowTraySpeed\":\"Скорость в трее\",\"desktopShowTraySpeedDesc\":\"Текущая скорость загрузки/отдачи в строке меню / подсказке трея\",\"desktopHotkeys\":\"Глобальные горячие клавиши\",\"desktopHotkeysDesc\":\"Системные горячие клавиши, работающие даже при закрытом окне\",\"desktopHotkeyToggleSystemProxy\":\"Переключить системный прокси\",\"desktopHotkeyCycleProxyMode\":\"Сменить режим прокси\",\"desktopHotkeyToggleWindow\":\"Показать / скрыть окно\",\"desktopHotkeyPressKeys\":\"Нажмите клавиши…\",\"desktopHotkeyDisabled\":\"Не задано\",\"desktopHotkeyConflict\":\"Ошибка регистрации\",\"desktopHotkeyRecordHint\":\"Нажмите комбинацию с модификатором. Backspace — очистить, Esc — отмена.\",\"desktopHotkeySave\":\"Сохранить\",\"desktopHotkeyReset\":\"Сбросить к значениям по умолчанию\",\"upload\":\"Исходящий\",\"download\":\"Входящий\",\"uploadTotal\":\"Всего отдано\",\"downloadTotal\":\"Всего получено\",\"activeConnections\":\"Активные соединения\",\"memoryUsage\":\"Использование памяти\",\"flow\":\"Всего передано данных\",\"traffic\":\"Трафик\",\"memory\":\"Память\",\"down\":\"Входящий\",\"up\":\"Исходящий\",\"proxyProviders\":\"Провайдеры прокси\",\"ruleProviders\":\"Провайдеры правил\",\"search\":\"Поиск\",\"inner\":\"Внутренний\",\"ID\":\"ID\",\"type\":\"Тип\",\"name\":\"Имя\",\"process\":\"Процесс\",\"host\":\"Хост\",\"hostProcess\":\"Хост / Процесс\",\"sniffHost\":\"Sniff Host\",\"chains\":\"Цепочки\",\"ruleChains\":\"Правило / Цепочки\",\"flowDirection\":\"Поток\",\"connectTime\":\"Время\",\"dlSpeed\":\"Скорость входящего\",\"ulSpeed\":\"Скорость исходящего\",\"dl\":\"Входящий\",\"ul\":\"Исходящий\",\"sourceIP\":\"Исходный IP адрес\",\"sourcePort\":\"Исходный порт\",\"destination\":\"Назначение\",\"inboundUser\":\"Входящий пользователь\",\"user\":\"Пользователь\",\"close\":\"Закрыть\",\"pause\":\"Пауза\",\"resume\":\"Продолжить\",\"reset\":\"Сбросить\",\"resetSettings\":\"Сбросить настройки\",\"dnsQuery\":\"DNS запрос\",\"save\":\"Сохранить\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"Некоторые поля DNS применяются на лету. Другие (например, список nameserver) требуют перезагрузки ядра — для полного контроля изменяйте их в редакторе конфигурации.\",\"dnsEnhancedMode\":\"Расширенный режим\",\"dnsNameserver\":\"Сервер имён\",\"dnsNameserverPlaceholder\":\"По одному серверу в строке\",\"dnsFallback\":\"Резерв\",\"dnsFallbackPlaceholder\":\"По одному серверу в строке\",\"dnsFakeIpRange\":\"Диапазон Fake IP\",\"dnsUseHosts\":\"Использовать Hosts\",\"dnsSettingsSaved\":\"Настройки DNS сохранены\",\"dnsSettingsSaveFailed\":\"Не удалось сохранить настройки DNS\",\"dots\":\"Точки\",\"bar\":\"Полоса\",\"auto\":\"Авто\",\"off\":\"Выкл\",\"proxiesPreviewType\":\"Тип предпросмотра прокси\",\"proxiesPreviewAutoThreshold\":\"Порог автопереключения\",\"cardMode\":\"Карточки\",\"listMode\":\"Список\",\"displayMode\":\"Режим отображения\",\"tableMode\":\"Таблица\",\"masterDetailMode\":\"Мастер-деталь\",\"none\":\"Нет\",\"urlForLatencyTest\":\"URL для теста отклика\",\"latencyTestUrlSource\":\"Источник URL для теста отклика\",\"latencyTestUrlSourceCore\":\"Ядро (URL каждой группы)\",\"latencyTestUrlSourceDashboard\":\"Панель (единый URL)\",\"autoCloseConns\":\"Автоматически закрывать соединения\",\"autoSwitchEndpoint\":\"Автоматически переключать эндпоинт\",\"autoSwitchTheme\":\"Автоматически переключать тему\",\"defaultPage\":\"Страница по умолчанию\",\"favDayTheme\":\"Любимая светлая тема\",\"favNightTheme\":\"Любимая тёмная тема\",\"renderInTwoColumns\":\"Отображать в два столбца\",\"proxiesCardSize\":\"Размер карточек прокси\",\"cardSizeComfortable\":\"Просторный\",\"cardSizeCompact\":\"Компактный\",\"cardSizeTight\":\"Очень компактный\",\"stickyGroupHeader\":\"Закреплять заголовок группы\",\"updateGEODatabases\":\"Обновить базы GEO\",\"restartCore\":\"Перезапустить ядро\",\"reloadConfigSuccess\":\"Конфигурация перезагружена\",\"restartCoreConfirm\":\"Перезапустить ядро? Все активные соединения будут разорваны.\",\"upgradeCore\":\"Обновить ядро\",\"upgradeUI\":\"Обновить панель\",\"upgradeUIConfirm\":\"Обновить панель? Будут загружены и заменены текущие файлы веб-панели.\",\"upgradeCoreConfirm\":\"Обновить ядро? Будет загружена новая версия и перезапущено ядро, что прервёт все соединения.\",\"proxiesSorting\":\"Сортировка прокси\",\"orderNatural\":\"Оригинальный порядок из конфига\",\"orderLatency_asc\":\"По отклику (возр.)\",\"orderLatency_desc\":\"По отклику (убыв.)\",\"orderQuality_asc\":\"По качеству (возр.)\",\"orderQuality_desc\":\"По качеству (убыв.)\",\"orderName_asc\":\"По имени (A-Z)\",\"orderName_desc\":\"По имени (Z-A)\",\"orderRuleType_asc\":\"По типу (A-Z)\",\"orderRuleType_desc\":\"По типу (Z-A)\",\"orderHitCount_desc\":\"Сначала наиболее совпавшие\",\"orderHitCount_asc\":\"Сначала наименее совпавшие\",\"orderHitAt_desc\":\"Сначала недавно совпавшие\",\"ms\":\"мс\",\"updated\":\"Обновлено\",\"tableSize\":\"Размер таблицы\",\"logLevel\":\"Уровень журнала\",\"info\":\"инфо\",\"silent\":\"тихий\",\"debug\":\"отладка\",\"warning\":\"предупреждение\",\"error\":\"ошибка\",\"logMaxRows\":\"Макс. строк журнала\",\"xs\":\"Очень маленький\",\"sm\":\"Маленький\",\"md\":\"Нормальный\",\"lg\":\"Большой\",\"switchEndpoint\":\"Сменить эндпоинт\",\"switchLanguage\":\"Сменить язык\",\"switchFont\":\"Сменить шрифт\",\"enableTwemoji\":\"Включить Twemoji\",\"enableDataUsageTracking\":\"Отслеживать трафик\",\"enableDataUsageTrackingDesc\":\"Записывает трафик по каждому соединению для страницы «Использование данных». Работает на всех страницах; отключите, чтобы снизить нагрузку на ЦП.\",\"latencyTestTimeoutDuration\":\"Таймаут теста отклика\",\"latencyMediumThreshold\":\"Жёлтый порог отклика\",\"latencyHighThreshold\":\"Красный порог отклика\",\"thresholdAutoPlaceholder\":\"0 = авто (значение по умолчанию)\",\"all\":\"Все\",\"sequence\":\"Последовательность\",\"level\":\"Уровень\",\"payload\":\"Содержимое\",\"details\":\"Детали\",\"endpointURL\":\"URL эндпоинта\",\"secret\":\"Секрет\",\"statusConnecting\":\"Подключение…\",\"statusProbing\":\"Проверка бэкенда по умолчанию…\",\"statusUnreachable\":\"Бэкенд не найден\",\"statusError\":\"Бэкенд недоступен\",\"statusAuthError\":\"Секрет отклонён\",\"statusBlocked\":\"Соединение заблокировано\",\"statusIdle\":\"Введите ваш бэкенд Mihomo\",\"secretHint\":\"Оставьте пустым, если у бэкенда нет секрета\",\"connect\":\"Подключить\",\"connectPrompt\":\"Подключитесь к вашему бэкенду Mihomo, чтобы начать.\",\"runningMode\":\"Режим работы\",\"modeSwitchFailed\":\"Не удалось переключить режим\",\"global\":\"Глобальный\",\"rule\":\"Правило\",\"direct\":\"Прямой\",\"reject\":\"Отклонить\",\"rejectdrop\":\"Сбросить\",\"selector\":\"Селектор\",\"urltest\":\"URL-тест\",\"smart\":\"Умный выбор\",\"loadbalance\":\"Баланс\",\"fallback\":\"Резерв\",\"relay\":\"Ретранслятор\",\"pass\":\"Пропустить\",\"active\":\"Активные\",\"closed\":\"Закрытые\",\"sort\":\"Сортировать\",\"hideUnavailableProxies\":\"Скрыть недоступные прокси\",\"reloadConfig\":\"Перезагрузить конфиг\",\"flushFakeIP\":\"Очистить Fake-IP\",\"flushDNSCache\":\"Очистить кэш DNS\",\"tagClientSourceIPWithName\":\"Пометить IP клиента именем\",\"resolveClientHostname\":\"Определять имена по reverse DNS\",\"resolveClientHostnameDesc\":\"Показывать имена устройств LAN-клиентов и имена для destination без host через обратный DNS. Требует, чтобы DNS mihomo резолвил соответствующие обратные зоны.\",\"tag\":\"Метка\",\"coreConfig\":\"Конфиг ядра\",\"xdConfig\":\"Конфиг XD\",\"version\":\"Версия\",\"expire\":\"Истекает\",\"noExpire\":\"Без срока\",\"allowLan\":\"Разрешить LAN\",\"enableTunDevice\":\"Включить TUN устройство\",\"tunModeStack\":\"TUN Mode Stack\",\"tunDeviceName\":\"Имя TUN устройства\",\"tunLoadFailed\":\"Не удалось загрузить статус TUN\",\"tunEnableSuccess\":\"Режим TUN включён\",\"tunEnableFailed\":\"Не удалось включить режим TUN\",\"tunDisableSuccess\":\"Режим TUN отключён — сеть восстановлена\",\"tunDisableFailed\":\"Не удалось отключить режим TUN\",\"tunRecoverNetwork\":\"Восстановить сеть\",\"tunInstallNote\":\"Включение TUN устанавливает привилегированный помощник и запрашивает права администратора. Неподписанная сборка покажет предупреждение «неизвестный издатель» — это ожидаемо.\",\"tunNeedsProfile\":\"Импортируйте подписку перед включением режима TUN.\",\"tunStatusLabel\":\"Состояние\",\"tunStatusActive\":\"TUN активен\",\"tunStatusSidecar\":\"Sidecar (системная сеть не затронута)\",\"tunUninstallHelper\":\"Удалить привилегированную службу\",\"tunUninstallSuccess\":\"Служба-помощник удалена\",\"tunUninstallFailed\":\"Не удалось удалить службу-помощник\",\"tunUninstallConfirm\":\"Удалить привилегированную службу-помощник? При следующем включении TUN потребуется снова предоставить повышение прав.\",\"outboundInterfaceName\":\"Исходящий интерфейс\",\"port\":\"Порт {name}\",\"quickFilter\":\"Быстрый фильтр\",\"iconHeight\":\"Высота иконки\",\"iconMarginRight\":\"Отступ иконки справа\",\"dataUsage\":\"Использование\",\"clearAll\":\"Очистить всё\",\"confirmClearAll\":\"Очистить все данные использования?\",\"devices\":\"Устройства\",\"timeRange\":\"Временной диапазон\",\"grandTotal\":\"Общий итог\",\"macAddress\":\"MAC адрес\",\"ipAddress\":\"IP адрес\",\"duration\":\"Длительность\",\"total\":\"Всего\",\"actions\":\"Действия\",\"remove\":\"Удалить\",\"noDataUsageYet\":\"Данных пока нет\",\"noData\":\"Нет данных\",\"noRules\":\"Нет правил\",\"noRuleProviders\":\"Нет провайдеров правил\",\"disabled\":\"Отключено\",\"enabled\":\"Включено\",\"status\":\"Статус\",\"noMatchingRules\":\"Нет правил, соответствующих фильтрам\",\"clearFilters\":\"Сбросить фильтры\",\"ruleMatched\":\"Совпадения\",\"ruleUnmatched\":\"Промахи\",\"lastMatchedAt\":\"Последнее совпадение\",\"lastUnmatchedAt\":\"Последний промах\",\"columns\":\"Столбцы\",\"sortBy\":\"Сортировать по\",\"sortOverriddenBySearch\":\"При поиске сортировка по релевантности\",\"groupBy\":\"Группировать по\",\"rowsPerPage\":\"Строк на странице\",\"ipShort\":\"IP\",\"na\":\"Н/Д\",\"show\":\"Показать\",\"noLatencyHistory\":\"История откликов отсутствует\",\"testLatency\":\"Проверить отклик\",\"unfixProxy\":\"Восстановить автоматический выбор\",\"dataUsageInfo\":\"Мониторинг данных выполняется на стороне клиента (браузера). При закрытии браузера мониторинг может не работать.\",\"basic\":\"Основные\",\"start\":\"Начало\",\"rulePayload\":\"Правило Payload\",\"metadata\":\"Метаданные\",\"network\":\"Сеть\",\"dnsMode\":\"Режим DNS\",\"sourceAndDestination\":\"Источник и назначение\",\"source\":\"Источник\",\"remoteDestination\":\"Удалённое назначение\",\"inbound\":\"Входящий\",\"inboundName\":\"Имя входящего\",\"inboundIP\":\"IP входящего\",\"processName\":\"Имя процесса\",\"processPath\":\"Путь процесса\",\"special\":\"Специальные\",\"specialProxy\":\"Специальный прокси\",\"specialRules\":\"Специальные правила\",\"connectionsChart\":\"Подключения\",\"networkTypes\":\"Типы сети\",\"topProxies\":\"Топ прокси\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"Отклик\",\"other\":\"Другое\",\"showTrafficIndicator\":\"Показать индикатор трафика\",\"hideTrafficIndicator\":\"Скрыть индикатор трафика\",\"currentIP\":\"Текущий IP адрес\",\"country\":\"Страна\",\"city\":\"Город\",\"organization\":\"Организация\",\"proxyDetection\":\"Обнаружение прокси\",\"clean\":\"Чисто\",\"networkLatency\":\"Время отклика сети\",\"average\":\"Средняя\",\"timeout\":\"Таймаут\",\"networkTopology\":\"Топология сети\",\"client\":\"Клиент\",\"destinations\":\"Назначения\",\"waitingForConnections\":\"Ожидание соединений...\",\"conn\":\"соед\",\"more\":\"ещё\",\"connectedTo\":\"Подключено к\",\"clients\":\"Клиенты\",\"groups\":\"Группы\",\"nodes\":\"Узлы\",\"proxyGroups\":\"Группы прокси\",\"proxyNodes\":\"Узлы прокси\",\"ruleType\":\"Тип правила\",\"useMobileBottomNav\":\"Нижняя навигация (мобильный)\",\"fetchRemoteConfig\":\"Загрузить удалённую конфигурацию\",\"remoteConfigURL\":\"URL удалённой конфигурации\",\"remoteConfigURLPlaceholder\":\"Введите URL файла конфигурации\",\"themeColorTooltip\":\"Порядок цветов: Фон, Акцент, Текст\",\"mixedContentError\":\"Не удалось подключиться: страница загружена по HTTPS, а адрес бэкенда — HTTP. Браузер блокирует такие запросы. Откройте панель напрямую через адрес бэкенда (например, http://127.0.0.1:9090/ui) или разверните панель по HTTP.\",\"endpointConnectError\":\"Не удалось подключиться к бэкенду. Проверьте URL и убедитесь, что бэкенд запущен.\",\"filterNodesByName\":\"Фильтр узлов по имени\",\"jumpToCurrent\":\"К текущему\",\"regionOther\":\"Другое\",\"clear\":\"Очистить\",\"copy\":\"Копировать\",\"copyValue\":\"Копировать значение\",\"geoLocation\":\"Местоположение\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"Сохранённые конечные точки\",\"unifiedDelay\":\"Унифицированная задержка\",\"appearance\":\"Внешний вид\",\"fontFamily\":\"Шрифт\",\"backgroundImage\":\"Фон\",\"backgroundCustomImage\":\"Своё изображение\",\"backgroundImageUrlOption\":\"URL изображения\",\"uploadImage\":\"Загрузить изображение\",\"backgroundImageUrlPlaceholder\":\"Введите URL изображения (например, обои Bing)\",\"backgroundBlur\":\"Размытие фона\",\"backgroundOverlayOpacity\":\"Непрозрачность наложения\",\"customThemeColors\":\"Свои цвета темы\",\"customThemeColorsDesc\":\"Переопределить цвета темы\",\"customCss\":\"Свой CSS\",\"customCssDesc\":\"Для продвинутых: внедрите свой CSS для оформления панели\",\"customCssPlaceholder\":\"/* напр. .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"Резервная копия настроек\",\"exportSettings\":\"Экспорт\",\"importSettings\":\"Импорт\",\"kernelControl\":\"Управление ядром\",\"kernelStatus\":\"Статус\",\"kernelVersion\":\"Версия\",\"kernelUptime\":\"Время работы\",\"kernelPid\":\"PID\",\"kernelStart\":\"Запустить\",\"kernelStop\":\"Остановить\",\"kernelRestart\":\"Перезапустить\",\"kernelLogs\":\"Логи ядра\",\"kernelLogsConnected\":\"Поток\",\"kernelLogsDisconnected\":\"Отключено\",\"kernelLogsClear\":\"Очистить\",\"systemProxy\":\"Системный прокси\",\"systemProxyEnable\":\"Включить системный прокси\",\"systemProxyDescription\":\"Направлять системный трафик через управляемый прокси на порту {port}.\",\"systemProxyBypass\":\"Исключения / белый список LAN\",\"systemProxyBypassPlaceholder\":\"По одному хосту или CIDR в строке, например localhost\",\"systemProxyApply\":\"Применить\",\"systemProxyLoadFailed\":\"Не удалось загрузить состояние системного прокси\",\"systemProxyApplyFailed\":\"Не удалось применить настройки системного прокси\",\"systemProxyApplied\":\"Настройки системного прокси применены\",\"kernelVersionManager\":\"Версия ядра\",\"kernelVersionCurrent\":\"Текущая\",\"kernelVersionBundled\":\"Встроенная\",\"kernelVersionSelect\":\"Переключить на версию\",\"kernelVersionActive\":\"активна\",\"kernelVersionSwitch\":\"Переключить и перезапустить\",\"kernelVersionSwitched\":\"Переключено на {version}\",\"kernelVersionSwitchFailed\":\"Не удалось переключить версию ядра\",\"kernelVersionLoadFailed\":\"Не удалось загрузить список версий ядра\",\"geoAssets\":\"Базы GEO\",\"geoAssetsDescription\":\"Загрузить актуальные базы geoip / geosite / mmdb для правил маршрутизации.\",\"geoUpdate\":\"Обновить базы GEO\",\"geoUpdateSuccess\":\"Базы GEO обновлены\",\"geoUpdateFailed\":\"Не удалось обновить базы GEO\",\"webdavBackup\":\"Резервное копирование WebDAV\",\"webdavBackupDescription\":\"Сохраните профили и настройки панели на сервер WebDAV и восстановите их на другом устройстве.\",\"webdavUrl\":\"URL сервера\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"Имя пользователя\",\"webdavPassword\":\"Пароль\",\"webdavDir\":\"Каталог\",\"webdavDirPlaceholder\":\"metacubexd (необязательно)\",\"webdavBackupNow\":\"Создать резервную копию\",\"webdavRestore\":\"Восстановить\",\"webdavBackupSuccess\":\"Резервная копия загружена на WebDAV\",\"webdavBackupFailed\":\"Не удалось создать резервную копию WebDAV\",\"webdavRestoreSuccess\":\"Восстановлено из WebDAV\",\"webdavRestoreCount\":\"Восстановлено профилей: {count}\",\"webdavRestoreFailed\":\"Не удалось восстановить из WebDAV\",\"runtimeConfig\":\"Конфигурация ядра\",\"runtimeConfigDescription\":\"Просмотр (только чтение) фактического файла конфигурации, с которым запущено ядро (содержит внедрённые external-controller, secret и mixed-port).\",\"runtimeConfigEmpty\":\"Конфигурация ядра пока недоступна.\",\"runtimeConfigLoadFailed\":\"Не удалось загрузить конфигурацию ядра\",\"export\":\"Экспорт\",\"exportCSV\":\"Экспорт CSV\",\"exportJSON\":\"Экспорт JSON\",\"healthCheckAllProviders\":\"Проверить все провайдеры\",\"providerHealthCheckSuccess\":\"Все провайдеры проверены\",\"providerHealthCheckFailed\":\"Не удалось проверить некоторые провайдеры\",\"connectivityBoard\":\"Панель доступности\",\"connectivityTargets\":\"Доступность\",\"streamingUnlockTargets\":\"Стриминг / ИИ\",\"reachabilityNode\":\"Узел или группа\",\"reachabilityNoNodes\":\"Нет доступных узлов\",\"reachabilityRunTest\":\"Запустить тест\",\"reachabilityResults\":\"Результаты доступности\",\"reachabilityUnreachable\":\"Недоступно\",\"reachabilityUnlockLimitation\":\"Это проверка доступности прокси (по времени отклика), а не полноценное определение разблокировки региона. Для разблокировки на уровне региона требуется анализ содержимого ответа, что выходит за рамки этой функции.\",\"reachabilityHint\":\"Выберите узел или группу, затем запустите тест, чтобы проверить каждую цель через него.\",\"reachabilityAllUnreachable\":\"Все цели недоступны через {node}\",\"profiles\":\"Профили\",\"profilesNew\":\"Новый профиль\",\"profilesImport\":\"Импорт из URL\",\"profilesDuplicate\":\"Дублировать\",\"profilesDelete\":\"Удалить\",\"profilesEdit\":\"Изменить\",\"profilesActivate\":\"Активировать\",\"profilesValidate\":\"Проверить\",\"profilesActive\":\"Активный\",\"profilesName\":\"Имя\",\"profilesUrl\":\"URL подписки\",\"profilesSave\":\"Сохранить\",\"profilesCancel\":\"Отмена\",\"profilesValidationOk\":\"Конфигурация корректна\",\"profilesEmpty\":\"Пока нет профилей\",\"profilesMerges\":\"Слои слияния\",\"profilesMergesHelp\":\"Слои слияния — это фрагменты YAML, накладываемые на активный базовый профиль. Включите те, которые хотите наложить.\",\"profilesNewMerge\":\"Новый слой слияния\",\"profilesMergeEnabled\":\"Включён\",\"profilesMergeNoActiveBase\":\"Активируйте базовый профиль, чтобы применить слои слияния.\",\"profilesMergeUpdateFailed\":\"Не удалось обновить слой слияния\",\"profilesScripts\":\"Скриптовые преобразования\",\"profilesScriptsHelp\":\"Скрипт получает объект конфигурации и возвращает изменённую конфигурацию. Скрипты выполняются после слияний при сборке. Включите те, которые хотите применить.\",\"profilesScriptsSafety\":\"Безопасность: скрипты выполняются с широким доступом — запускайте только те скрипты, которым доверяете. Редактирование или переключение скрипта повторно активирует активный базовый профиль для пересчёта.\",\"profilesNewScript\":\"Новый скрипт\",\"profilesScriptEnabled\":\"Включён\",\"profilesScriptUpdateFailed\":\"Не удалось обновить скриптовое преобразование\",\"profilesShare\":\"Поделиться QR\",\"profilesShareTitle\":\"Поделиться подпиской\",\"profilesShareUrl\":\"URL подписки\",\"profilesShareCopy\":\"Копировать URL\",\"profilesShareCopied\":\"URL подписки скопирован\",\"editorReadOnly\":\"Только чтение\",\"editorDisableValidation\":\"Отключить проверку\",\"editRules\":\"Редактировать правила\",\"editProxies\":\"Редактировать прокси и группы\",\"edit\":\"Редактировать\",\"moveUp\":\"Переместить вверх\",\"moveDown\":\"Переместить вниз\",\"proxyConfigEditorTitle\":\"Редактировать прокси и группы\",\"proxyConfigEditorHint\":\"Редактируйте локальные прокси и группы активного профиля. Определения Proxy Provider остаются в полном редакторе профиля. При сохранении проверяется вся конфигурация, а ядро перезапускается один раз.\",\"proxyConfigSaved\":\"Конфигурация прокси сохранена\",\"proxyConfigLoadFailed\":\"Не удалось загрузить конфигурацию прокси\",\"proxyConfigSaveFailed\":\"Не удалось сохранить конфигурацию прокси\",\"routingEditorNoActiveProfile\":\"Нет активного профиля для редактирования. Сначала импортируйте или активируйте профиль.\",\"routingEditorConflict\":\"В подписке есть неразрешённые конфликты\",\"routingEditorConflictHint\":\"Разрешите конфликты в полном редакторе профиля перед редактированием на этой странице.\",\"routingEditorResolveConflict\":\"Открыть полный редактор профиля\",\"routingEditorDiscardConfirm\":\"Отменить несохранённые изменения конфигурации?\",\"routingEditorRulePlaceholder\":\"Введите правило Mihomo целиком, например DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"Ресурс всё ещё используется и не может быть удалён\",\"routingEditorNodes\":\"Локальные прокси\",\"routingEditorMembers\":\"участников\",\"routingEditorNameLocked\":\"Имя существующего ресурса заблокировано для сохранения ссылок.\",\"routingEditorNameTypeRequired\":\"Имя и тип обязательны.\",\"routingEditorDuplicateName\":\"Прокси или группа с именем «{name}» уже существует.\",\"routingEditorJsonObjectRequired\":\"Расширенный JSON должен быть объектом.\",\"routingEditorSelectMember\":\"Выберите прокси или группу\",\"routingEditorSelectProvider\":\"Выберите Proxy Provider\",\"rulesEditorHint\":\"Добавляйте, изменяйте, удаляйте или перетаскивайте правила. Сохранение перезапускает ядро один раз.\",\"policy\":\"Политика\",\"reorder\":\"Перетащите для сортировки\",\"delete\":\"Удалить\",\"cancel\":\"Отмена\",\"rulesEditorSaved\":\"Правила сохранены\",\"rulesEditorLoadFailed\":\"Не удалось загрузить правила\",\"rulesEditorSaveFailed\":\"Не удалось сохранить правила\",\"rulesEditorInvalid\":\"У каждого правила должны быть тип, значение и политика\",\"networkConfig\":\"Сетевая конфигурация\",\"networkConfigHint\":\"Измените сетевые разделы активного профиля. Сохранение перезапускает ядро один раз.\",\"networkConfigSaved\":\"Сетевая конфигурация сохранена\",\"networkConfigLoadFailed\":\"Не удалось загрузить сетевую конфигурацию\",\"networkConfigSaveFailed\":\"Не удалось сохранить сетевую конфигурацию\",\"tunnels\":\"Туннели\",\"tunnelsHint\":\"Переадресуйте локальный слушатель на удалённую цель через ядро.\",\"tunnelNetwork\":\"Сеть\",\"tunnelAddress\":\"Адрес прослушивания\",\"tunnelTarget\":\"Цель\",\"noTunnels\":\"Нет туннелей\",\"sniffer\":\"Сниффер\",\"snifferEnable\":\"Включить сниффер\",\"snifferOverrideDestination\":\"Переопределить назначение\",\"externalController\":\"Внешний контроллер\",\"externalControllerManaged\":\"Управляется приложением на десктопе\",\"onboardingWelcomeTitle\":\"Добро пожаловать в MetaCubeXD\",\"onboardingWelcomeBody\":\"Вставьте подписку и получите рабочий прокси меньше чем за минуту.\",\"onboardingGetStarted\":\"Начать\",\"onboardingSkip\":\"Пропустить\",\"onboardingImportTitle\":\"Импорт подписки\",\"onboardingImportSubtitle\":\"Вставьте URL подписки, выберите файл или вставьте из буфера обмена.\",\"onboardingImportSuccess\":\"Подписка импортирована и активирована\",\"onboardingFileTooLarge\":\"Файл слишком большой\",\"onboardingClipboardEmpty\":\"Буфер обмена пуст\",\"onboardingClipboardDenied\":\"Доступ к буферу обмена отклонён\",\"onboardingSystemProxyTitle\":\"Включить системный прокси\",\"onboardingSystemProxyBody\":\"Направлять трафик всех приложений на этом устройстве через прокси.\",\"onboardingDoneTitle\":\"Всё готово\",\"onboardingDoneBody\":\"Подписка активна. Выберите узел, чтобы начать работу.\",\"onboardingGoToProxies\":\"К прокси\",\"onboardingFinish\":\"Завершить\",\"onboardingBack\":\"Назад\",\"onboardingNext\":\"Далее\",\"onboardingStep\":\"Шаг {current} из {total}\",\"onboardingEmptyTitle\":\"Пока нет подписки\",\"onboardingEmptyBody\":\"Импортируйте подписку, чтобы начать пользоваться прокси.\",\"onboardingEmptyImport\":\"Импорт подписки\",\"onboardingEmptyRunSetup\":\"Запустить мастер заново\",\"profilesImportTitle\":\"Импорт подписки\",\"profilesImportSubtitle\":\"Добавьте подписку по URL, из файла или буфера обмена.\",\"profilesImportFile\":\"Импорт из файла\",\"profilesImportClipboard\":\"Вставить из буфера обмена\",\"profilesImportSuccess\":\"Подписка импортирована\",\"profilesImportFailed\":\"Не удалось импортировать подписку\",\"profilesAdvanced\":\"Дополнительно\",\"profilesRefresh\":\"Обновить\",\"profilesRefreshed\":\"Подписка обновлена\",\"profilesRefreshFailed\":\"Не удалось обновить подписку\",\"profilesUpdated\":\"Обновлено {time}\",\"profilesActivated\":\"Профиль активирован\",\"profilesActionFailed\":\"Не удалось выполнить действие\",\"profilesDeleteConfirm\":\"Удалить «{name}»? Это действие нельзя отменить.\",\"profilesDeleteActiveConfirm\":\"«{name}» — это активный профиль. Его удаление остановит работающую конфигурацию. Продолжить?\",\"profilesEditing\":\"Редактирование {name}\",\"visualEditor\":\"Визуальный редактор\",\"visualEditorUnavailable\":\"Визуальный редактор доступен только в приложении для ПК или All-in-One Agent.\",\"visualEditorBack\":\"Назад к профилям\",\"visualEditorUnsaved\":\"Не сохранено\",\"visualEditorVisual\":\"Визуально\",\"visualEditorSettings\":\"Настройки\",\"visualEditorResources\":\"Ресурсы\",\"visualEditorRouting\":\"Маршрутизация\",\"visualEditorSubRules\":\"Подправила\",\"visualEditorOperations\":\"операций\",\"visualEditorReset\":\"Сбросить переопределения\",\"visualEditorResetConfirm\":\"Сбросить все визуальные переопределения этой подписки?\",\"visualEditorProxy\":\"Прокси\",\"visualEditorGroup\":\"Группа\",\"visualEditorUnnamed\":\"Без имени\",\"visualEditorDropHint\":\"Перетащите сюда прокси или Provider\",\"visualEditorResourceEdit\":\"Изменить ресурс\",\"visualEditorAdvancedJson\":\"Дополнительные поля (JSON)\",\"visualEditorAddField\":\"Добавить поле\",\"visualEditorPreview\":\"Проверить изменения\",\"visualEditorPreviewFailed\":\"Не удалось подготовить предпросмотр\",\"visualEditorApply\":\"Проверить и применить\",\"visualEditorActivate\":\"Проверить и активировать\",\"visualEditorApplied\":\"Конфигурация применена\",\"visualEditorApplyFailed\":\"Не удалось применить конфигурацию\",\"visualEditorLeaveConfirm\":\"Отменить несохранённые изменения?\",\"visualEditorConflicts\":\"Конфликты подписки\",\"visualEditorKeepLocal\":\"Сохранить локальное переопределение\",\"visualEditorAcceptUpstream\":\"Принять значение подписки\",\"visualEditorManualMerge\":\"Объединить в YAML\",\"visualEditorDiagnostics\":\"Диагностика конфигурации\",\"visualEditorManaged\":\"Управляемый\",\"quality\":\"Качество\",\"sortDefault\":\"По умолчанию\"}");

const locale_ja_46json_cd12a199 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"新しいバージョンが利用可能です\",\"pwaUpdateReload\":\"再読み込み\",\"lastHour\":\"過去1時間\",\"lastDay\":\"過去1日\",\"lastWeek\":\"過去1週間\",\"lastMonth\":\"過去1ヶ月\",\"customRange\":\"カスタム範囲\",\"forever\":\"すべて\",\"dataRetention\":\"データ保持\",\"noDetailedData\":\"詳細なデータはありません。\",\"home\":\"ホーム\",\"add\":\"追加\",\"collapse\":\"折りたたむ\",\"collapseAll\":\"すべて折りたたむ\",\"expandAll\":\"すべて展開\",\"setup\":\"セットアップ\",\"setupDescription\":\"Mihomo バックエンドに接続して開始します\",\"overview\":\"概要\",\"proxies\":\"プロキシ\",\"proxiesSettings\":\"プロキシ設定\",\"backToTop\":\"ページ上部へ\",\"rules\":\"ルール\",\"connections\":\"接続\",\"connectionsSettings\":\"接続設定\",\"connectionsDetails\":\"接続の詳細\",\"logs\":\"ログ\",\"logsSettings\":\"ログ設定\",\"config\":\"設定\",\"controlCenter\":\"コントロールセンター\",\"controlCenterDesc\":\"同梱カーネルとホスト連携を管理します\",\"controlCenterKernel\":\"カーネル\",\"controlCenterSystem\":\"システム連携\",\"controlCenterConfig\":\"設定\",\"controlCenterBackup\":\"バックアップ\",\"controlCenterDesktop\":\"デスクトップ\",\"desktopBehavior\":\"デスクトップの動作\",\"desktopSilentUpdateCheck\":\"自動アップデート確認\",\"desktopSilentUpdateCheckDesc\":\"新しいリリースがあるときに通知します（自動インストールはしません）\",\"desktopTunAutoRestore\":\"起動時に TUN モードを復元\",\"desktopTunAutoRestoreDesc\":\"前回終了時に TUN モードで、ヘルパーがインストール済みの場合、起動後に自動で再有効化します\",\"desktopShowTraySpeed\":\"トレイに速度を表示\",\"desktopShowTraySpeedDesc\":\"メニューバー / トレイにリアルタイムの上り下り速度を表示します\",\"desktopHotkeys\":\"グローバルホットキー\",\"desktopHotkeysDesc\":\"ウィンドウを閉じても有効なシステム全体のショートカット\",\"desktopHotkeyToggleSystemProxy\":\"システムプロキシの切替\",\"desktopHotkeyCycleProxyMode\":\"プロキシモードの切替\",\"desktopHotkeyToggleWindow\":\"ウィンドウの表示 / 非表示\",\"desktopHotkeyPressKeys\":\"キーを押してください…\",\"desktopHotkeyDisabled\":\"未設定\",\"desktopHotkeyConflict\":\"登録に失敗\",\"desktopHotkeyRecordHint\":\"修飾キーを含む組み合わせを押してください。Backspace でクリア、Esc でキャンセル。\",\"desktopHotkeySave\":\"保存\",\"desktopHotkeyReset\":\"デフォルトに戻す\",\"upload\":\"アップロード\",\"download\":\"ダウンロード\",\"uploadTotal\":\"アップロード合計\",\"downloadTotal\":\"ダウンロード合計\",\"activeConnections\":\"アクティブな接続\",\"memoryUsage\":\"メモリ使用量\",\"flow\":\"フロー\",\"traffic\":\"トラフィック\",\"memory\":\"メモリ\",\"down\":\"下り\",\"up\":\"上り\",\"proxyProviders\":\"プロキシプロバイダー\",\"ruleProviders\":\"ルールプロバイダー\",\"search\":\"検索\",\"inner\":\"内部\",\"ID\":\"ID\",\"type\":\"種類\",\"name\":\"名前\",\"process\":\"プロセス\",\"host\":\"ホスト\",\"hostProcess\":\"ホスト / プロセス\",\"sniffHost\":\"スニフホスト\",\"chains\":\"チェーン\",\"ruleChains\":\"ルール / チェーン\",\"flowDirection\":\"フロー\",\"connectTime\":\"時間\",\"dlSpeed\":\"DL 速度\",\"ulSpeed\":\"UL 速度\",\"dl\":\"DL\",\"ul\":\"UL\",\"sourceIP\":\"送信元 IP\",\"sourcePort\":\"送信元ポート\",\"destination\":\"宛先\",\"inboundUser\":\"インバウンドユーザー\",\"user\":\"ユーザー\",\"close\":\"閉じる\",\"pause\":\"一時停止\",\"resume\":\"再開\",\"reset\":\"リセット\",\"resetSettings\":\"設定をリセット\",\"dnsQuery\":\"DNS クエリ\",\"save\":\"保存\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"一部の DNS フィールドはホット適用できます。その他（ネームサーバーリストなど）はカーネルの再読み込みが必要です。完全に制御するには設定エディターで編集してください。\",\"dnsEnhancedMode\":\"拡張モード\",\"dnsNameserver\":\"ネームサーバー\",\"dnsNameserverPlaceholder\":\"1行に1サーバー\",\"dnsFallback\":\"フォールバック\",\"dnsFallbackPlaceholder\":\"1行に1サーバー\",\"dnsFakeIpRange\":\"Fake IP 範囲\",\"dnsUseHosts\":\"Hosts を使用\",\"dnsSettingsSaved\":\"DNS 設定を保存しました\",\"dnsSettingsSaveFailed\":\"DNS 設定の保存に失敗しました\",\"dots\":\"ドット\",\"bar\":\"バー\",\"auto\":\"自動\",\"off\":\"オフ\",\"proxiesPreviewType\":\"プロキシプレビュータイプ\",\"proxiesPreviewAutoThreshold\":\"自動切替しきい値\",\"cardMode\":\"カード\",\"listMode\":\"リスト\",\"displayMode\":\"表示モード\",\"tableMode\":\"テーブル\",\"masterDetailMode\":\"マスター詳細\",\"none\":\"なし\",\"urlForLatencyTest\":\"レイテンシテスト用 URL\",\"latencyTestUrlSource\":\"レイテンシテスト URL のソース\",\"latencyTestUrlSourceCore\":\"コア（グループ別 URL）\",\"latencyTestUrlSourceDashboard\":\"ダッシュボード（単一 URL）\",\"autoCloseConns\":\"接続を自動的に閉じる\",\"autoSwitchEndpoint\":\"エンドポイントを自動的に切り替える\",\"autoSwitchTheme\":\"テーマを自動切替\",\"defaultPage\":\"デフォルトページ\",\"favDayTheme\":\"お気に入りの昼テーマ\",\"favNightTheme\":\"お気に入りのダークテーマ\",\"renderInTwoColumns\":\"2列で表示\",\"proxiesCardSize\":\"ノードカードサイズ\",\"cardSizeComfortable\":\"ゆったり\",\"cardSizeCompact\":\"コンパクト\",\"cardSizeTight\":\"タイト\",\"stickyGroupHeader\":\"グループヘッダーを固定\",\"updateGEODatabases\":\"GEO データベースを更新\",\"restartCore\":\"コアを再起動\",\"reloadConfigSuccess\":\"設定を再読み込みしました\",\"restartCoreConfirm\":\"コアを再起動しますか？すべての接続が切断されます。\",\"upgradeCore\":\"コアをアップグレード\",\"upgradeUI\":\"ダッシュボードをアップグレード\",\"upgradeUIConfirm\":\"ダッシュボードをアップグレードしますか？現在のウェブダッシュボードのファイルをダウンロードして置き換えます。\",\"upgradeCoreConfirm\":\"コアをアップグレードしますか？新しいバージョンをダウンロードしてコアを再起動し、すべての接続が切断されます。\",\"proxiesSorting\":\"プロキシの並び替え\",\"orderNatural\":\"設定ファイルの元の順序\",\"orderLatency_asc\":\"レイテンシの低い順\",\"orderLatency_desc\":\"レイテンシの高い順\",\"orderQuality_asc\":\"品質の低い順\",\"orderQuality_desc\":\"品質の高い順\",\"orderName_asc\":\"名前順（A-Z）\",\"orderName_desc\":\"名前順（Z-A）\",\"orderRuleType_asc\":\"ルールタイプ順（A-Z）\",\"orderRuleType_desc\":\"ルールタイプ順（Z-A）\",\"orderHitCount_desc\":\"一致数の多い順\",\"orderHitCount_asc\":\"一致数の少ない順\",\"orderHitAt_desc\":\"最近一致した順\",\"ms\":\"ms\",\"updated\":\"更新済み\",\"tableSize\":\"テーブルサイズ\",\"logLevel\":\"ログレベル\",\"info\":\"info\",\"silent\":\"silent\",\"debug\":\"debug\",\"warning\":\"warning\",\"error\":\"error\",\"logMaxRows\":\"ログ最大保持行数\",\"xs\":\"極小サイズ\",\"sm\":\"小サイズ\",\"md\":\"標準サイズ\",\"lg\":\"大サイズ\",\"switchEndpoint\":\"エンドポイントを切り替え\",\"switchLanguage\":\"言語を切り替え\",\"switchFont\":\"フォントを切り替え\",\"enableTwemoji\":\"Twemoji を有効化\",\"enableDataUsageTracking\":\"データ使用量を追跡\",\"enableDataUsageTrackingDesc\":\"データ使用量ページ用に接続ごとのトラフィックを記録します。すべてのページで実行されます。CPU 使用量を減らすにはオフにしてください。\",\"latencyTestTimeoutDuration\":\"レイテンシテストのタイムアウト時間\",\"latencyMediumThreshold\":\"レイテンシ黄色しきい値\",\"latencyHighThreshold\":\"レイテンシ赤色しきい値\",\"thresholdAutoPlaceholder\":\"0 = 自動（デフォルトを使用）\",\"all\":\"すべて\",\"sequence\":\"シーケンス\",\"level\":\"レベル\",\"payload\":\"ペイロード\",\"details\":\"詳細\",\"endpointURL\":\"エンドポイント URL\",\"secret\":\"シークレット\",\"statusConnecting\":\"接続中…\",\"statusProbing\":\"デフォルトのバックエンドを探索中…\",\"statusUnreachable\":\"バックエンドが見つかりません\",\"statusError\":\"バックエンドに接続できません\",\"statusAuthError\":\"シークレットが拒否されました\",\"statusBlocked\":\"接続がブロックされました\",\"statusIdle\":\"Mihomo バックエンドを入力してください\",\"secretHint\":\"バックエンドにシークレットがない場合は空欄のままにします\",\"connect\":\"接続\",\"connectPrompt\":\"Mihomo バックエンドに接続して始めましょう。\",\"runningMode\":\"実行モード\",\"modeSwitchFailed\":\"モードの切り替えに失敗しました\",\"global\":\"グローバル\",\"rule\":\"ルール\",\"direct\":\"ダイレクト\",\"reject\":\"拒否\",\"rejectdrop\":\"ドロップ\",\"selector\":\"セレクター\",\"urltest\":\"URL テスト\",\"smart\":\"スマート選択\",\"loadbalance\":\"負荷分散\",\"fallback\":\"フォールバック\",\"relay\":\"リレー\",\"pass\":\"パス\",\"active\":\"アクティブ\",\"closed\":\"クローズ\",\"sort\":\"並び替え\",\"hideUnavailableProxies\":\"利用不可のプロキシを非表示\",\"reloadConfig\":\"設定を再読み込み\",\"flushFakeIP\":\"Fake-IP をフラッシュ\",\"flushDNSCache\":\"DNS キャッシュをフラッシュ\",\"tagClientSourceIPWithName\":\"クライアント送信元 IP に名前をタグ付け\",\"resolveClientHostname\":\"ホスト名を解決（逆引き DNS）\",\"resolveClientHostnameDesc\":\"逆引き DNS により、LAN クライアントのデバイス名やホストのない宛先 IP の名前を表示します。mihomo の DNS が該当する逆引きゾーンを解決できる必要があります。\",\"tag\":\"タグ\",\"coreConfig\":\"コア設定\",\"xdConfig\":\"XD 設定\",\"version\":\"バージョン\",\"expire\":\"有効期限\",\"noExpire\":\"なし\",\"allowLan\":\"LAN を許可\",\"enableTunDevice\":\"TUN デバイスを有効化\",\"tunModeStack\":\"TUN モードスタック\",\"tunDeviceName\":\"TUN デバイス名\",\"tunLoadFailed\":\"TUN ステータスの読み込みに失敗しました\",\"tunEnableSuccess\":\"TUN モードを有効にしました\",\"tunEnableFailed\":\"TUN モードの有効化に失敗しました\",\"tunDisableSuccess\":\"TUN モードを無効にしました — ネットワークを復旧しました\",\"tunDisableFailed\":\"TUN モードの無効化に失敗しました\",\"tunRecoverNetwork\":\"ネットワークを復旧\",\"tunInstallNote\":\"TUN を有効にすると特権ヘルパーがインストールされ、管理者の承認を求められます。未署名のビルドでは「不明な発行元」の警告が表示されます — これは正常です。\",\"tunNeedsProfile\":\"TUN モードを有効にする前にサブスクリプションをインポートしてください。\",\"tunStatusLabel\":\"状態\",\"tunStatusActive\":\"TUN 有効\",\"tunStatusSidecar\":\"Sidecar（システムネットワークに影響なし）\",\"tunUninstallHelper\":\"ヘルパーサービスをアンインストール\",\"tunUninstallSuccess\":\"ヘルパーサービスをアンインストールしました\",\"tunUninstallFailed\":\"ヘルパーサービスのアンインストールに失敗しました\",\"tunUninstallConfirm\":\"特権ヘルパーサービスをアンインストールしますか？次に TUN を有効にする際、再度昇格を求められます。\",\"outboundInterfaceName\":\"アウトバウンドインターフェース名\",\"port\":\"{name} ポート\",\"quickFilter\":\"クイックフィルター\",\"iconHeight\":\"アイコンの高さ\",\"iconMarginRight\":\"アイコンの右マージン\",\"dataUsage\":\"データ使用量\",\"clearAll\":\"すべてクリア\",\"confirmClearAll\":\"すべてのデータ使用量をクリアしますか？\",\"devices\":\"デバイス\",\"timeRange\":\"期間\",\"grandTotal\":\"総計\",\"macAddress\":\"MAC アドレス\",\"ipAddress\":\"IP アドレス\",\"duration\":\"継続時間\",\"total\":\"合計\",\"actions\":\"操作\",\"remove\":\"削除\",\"noDataUsageYet\":\"まだデータ使用量が記録されていません\",\"noData\":\"データなし\",\"noRules\":\"ルールなし\",\"noRuleProviders\":\"ルールプロバイダーなし\",\"disabled\":\"無効\",\"enabled\":\"有効\",\"status\":\"ステータス\",\"noMatchingRules\":\"フィルターに一致するルールがありません\",\"clearFilters\":\"フィルターをクリア\",\"ruleMatched\":\"一致\",\"ruleUnmatched\":\"不一致\",\"lastMatchedAt\":\"最終一致\",\"lastUnmatchedAt\":\"最終不一致\",\"columns\":\"列\",\"sortBy\":\"並び替え基準\",\"sortOverriddenBySearch\":\"検索中は検索の関連度で並び替え\",\"groupBy\":\"グループ化\",\"rowsPerPage\":\"1ページあたりの行数\",\"ipShort\":\"IP\",\"na\":\"N/A\",\"show\":\"表示\",\"noLatencyHistory\":\"レイテンシ履歴なし\",\"testLatency\":\"遅延テスト\",\"unfixProxy\":\"自動選択に戻す\",\"dataUsageInfo\":\"データ使用量の監視はクライアント側（ブラウザ）で行われます。ブラウザを閉じると監視はおそらく実行されません。\",\"basic\":\"基本\",\"start\":\"開始\",\"rulePayload\":\"ルールペイロード\",\"metadata\":\"メタデータ\",\"network\":\"ネットワーク\",\"dnsMode\":\"DNS モード\",\"sourceAndDestination\":\"送信元と宛先\",\"source\":\"送信元\",\"remoteDestination\":\"リモート宛先\",\"inbound\":\"インバウンド\",\"inboundName\":\"インバウンド名\",\"inboundIP\":\"インバウンド IP\",\"processName\":\"プロセス名\",\"processPath\":\"プロセスパス\",\"special\":\"特殊\",\"specialProxy\":\"特殊プロキシ\",\"specialRules\":\"特殊ルール\",\"connectionsChart\":\"接続\",\"networkTypes\":\"ネットワークタイプ\",\"topProxies\":\"トッププロキシ\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"レイテンシ\",\"other\":\"その他\",\"showTrafficIndicator\":\"トラフィックインジケーターを表示\",\"hideTrafficIndicator\":\"トラフィックインジケーターを非表示\",\"currentIP\":\"現在の IP\",\"country\":\"国\",\"city\":\"都市\",\"organization\":\"組織\",\"proxyDetection\":\"プロキシ検出\",\"clean\":\"クリーン\",\"networkLatency\":\"ネットワークレイテンシ\",\"average\":\"平均\",\"timeout\":\"タイムアウト\",\"networkTopology\":\"ネットワークトポロジー\",\"client\":\"クライアント\",\"destinations\":\"宛先\",\"waitingForConnections\":\"接続を待機中...\",\"conn\":\"接続\",\"more\":\"もっと見る\",\"connectedTo\":\"接続先\",\"clients\":\"クライアント\",\"groups\":\"グループ\",\"nodes\":\"ノード\",\"proxyGroups\":\"プロキシグループ\",\"proxyNodes\":\"プロキシノード\",\"ruleType\":\"ルールタイプ\",\"useMobileBottomNav\":\"ボトムナビゲーションを使用（モバイル）\",\"fetchRemoteConfig\":\"リモート設定を取得\",\"remoteConfigURL\":\"リモート設定 URL\",\"remoteConfigURLPlaceholder\":\"設定ファイルの URL を入力\",\"shortcuts\":{\"title\":\"キーボードショートカット\",\"category\":{\"navigation\":\"ナビゲーション\",\"actions\":\"操作\"},\"goToOverview\":\"概要へ移動\",\"goToProxies\":\"プロキシへ移動\",\"goToConnections\":\"接続へ移動\",\"goToRules\":\"ルールへ移動\",\"goToLogs\":\"ログへ移動\",\"goToConfig\":\"設定へ移動\",\"refresh\":\"更新\",\"closeModal\":\"モーダルを閉じる\",\"showHelp\":\"ヘルプを表示\",\"pressKey\":\"キーを押してください...\",\"pressEscToClose\":\"Esc で閉じる\",\"customized\":\"カスタマイズ済み\",\"conflictWith\":\"競合:\",\"forceApply\":\"強制的に適用\",\"resetToDefaults\":\"デフォルトにリセット\"},\"connectionError\":\"バックエンドに到達できません\",\"connectionErrorDesc\":\"バックエンドに接続できません。バックエンドが実行中か確認するか、別のエンドポイントに切り替えてください。\",\"retry\":\"再試行\",\"recommendation\":{\"title\":\"スマートおすすめ\",\"recommended\":\"おすすめ\",\"testAll\":\"すべてテスト\",\"testAllGroups\":\"すべてのグループをテスト\",\"switchToRecommended\":\"おすすめに切り替え\",\"testing\":\"テスト中\",\"score\":\"スコア\",\"latencyWeight\":\"レイテンシの重み\",\"stabilityWeight\":\"安定性の重み\",\"successRateWeight\":\"成功率の重み\",\"autoSwitch\":\"おすすめに自動切替\",\"autoSwitchDesc\":\"テスト後におすすめのノードに自動的に切り替えます\",\"minTestInterval\":\"最小テスト間隔（分）\",\"excludedNodes\":\"除外ノード\",\"clearHistory\":\"履歴をクリア\",\"noScoreYet\":\"まだスコアがありません\"},\"themeColorTooltip\":\"色の順序: 背景、アクセント、テキスト\",\"mixedContentError\":\"接続できません: このページは HTTPS で読み込まれていますが、バックエンド URL は HTTP です。ブラウザはセキュリティのためこれをブロックします。バックエンド経由で直接パネルにアクセスするか（例: http://127.0.0.1:9090/ui）、HTTP でパネルをデプロイしてください。\",\"endpointConnectError\":\"バックエンドへの接続に失敗しました。URL を確認し、バックエンドが実行中であることを確認してください。\",\"filterNodesByName\":\"名前でノードをフィルター\",\"jumpToCurrent\":\"現在のノードへ\",\"regionOther\":\"その他\",\"clear\":\"クリア\",\"copy\":\"コピー\",\"copyValue\":\"値をコピー\",\"geoLocation\":\"位置\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"保存済みエンドポイント\",\"unifiedDelay\":\"統一遅延\",\"appearance\":\"外観\",\"fontFamily\":\"フォント\",\"backgroundImage\":\"背景\",\"backgroundCustomImage\":\"カスタム画像\",\"backgroundImageUrlOption\":\"画像 URL\",\"uploadImage\":\"画像をアップロード\",\"backgroundImageUrlPlaceholder\":\"画像 URL を入力（例: Bing の日替わり壁紙）\",\"backgroundBlur\":\"背景のぼかし\",\"backgroundOverlayOpacity\":\"オーバーレイの不透明度\",\"customThemeColors\":\"カスタムテーマカラー\",\"customThemeColorsDesc\":\"テーマカラートークンを上書き\",\"customCss\":\"カスタム CSS\",\"customCssDesc\":\"上級者向け：独自の CSS を注入してダッシュボードを再スタイルします\",\"customCssPlaceholder\":\"/* 例: .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"設定のバックアップ\",\"exportSettings\":\"エクスポート\",\"importSettings\":\"インポート\",\"kernelControl\":\"カーネル制御\",\"kernelStatus\":\"ステータス\",\"kernelVersion\":\"バージョン\",\"kernelUptime\":\"稼働時間\",\"kernelPid\":\"PID\",\"kernelStart\":\"開始\",\"kernelStop\":\"停止\",\"kernelRestart\":\"再起動\",\"kernelRollback\":\"設定をロールバック\",\"kernelRecover\":\"最小構成にリセット\",\"kernelRollbackConfirm\":\"前回の正常な設定を復元してカーネルを再起動しますか？\",\"kernelRecoverConfirm\":\"アクティブな設定を最小構成にリセットして再起動しますか？その後プロファイルを再インポートしてください。\",\"kernelRollbackApplied\":\"前回の設定にロールバックしました\",\"kernelRecoverApplied\":\"最小構成にリセットしました\",\"kernelRollbackFailed\":\"ロールバックに失敗しました\",\"kernelRecoverFailed\":\"復元に失敗しました\",\"kernelLogs\":\"カーネルログ\",\"kernelLogsConnected\":\"ストリーミング中\",\"kernelLogsDisconnected\":\"切断済み\",\"kernelLogsClear\":\"クリア\",\"systemProxy\":\"システムプロキシ\",\"systemProxyEnable\":\"システムプロキシを有効化\",\"systemProxyDescription\":\"ポート {port} の管理プロキシを通じてシステムトラフィックをルーティングします。\",\"systemProxyBypass\":\"バイパス / LAN ホワイトリスト\",\"systemProxyBypassPlaceholder\":\"1行に1つのホストまたは CIDR、例: localhost\",\"systemProxyApply\":\"適用\",\"systemProxyLoadFailed\":\"システムプロキシの状態の読み込みに失敗しました\",\"systemProxyApplyFailed\":\"システムプロキシ設定の適用に失敗しました\",\"systemProxyApplied\":\"システムプロキシ設定を適用しました\",\"kernelVersionManager\":\"カーネルバージョン\",\"kernelVersionCurrent\":\"現在\",\"kernelVersionBundled\":\"同梱\",\"kernelVersionSelect\":\"バージョンに切り替え\",\"kernelVersionActive\":\"アクティブ\",\"kernelVersionSwitch\":\"切り替えて再起動\",\"kernelVersionSwitched\":\"{version} に切り替えました\",\"kernelVersionSwitchFailed\":\"カーネルバージョンの切り替えに失敗しました\",\"kernelVersionLoadFailed\":\"カーネルバージョンの読み込みに失敗しました\",\"geoAssets\":\"GEO データベース\",\"geoAssetsDescription\":\"ルーティングルールに使用される最新の geoip / geosite / mmdb データベースをダウンロードします。\",\"geoUpdate\":\"GEO データベースを更新\",\"geoUpdateSuccess\":\"GEO データベースを更新しました\",\"geoUpdateFailed\":\"GEO データベースの更新に失敗しました\",\"webdavBackup\":\"WebDAV バックアップ\",\"webdavBackupDescription\":\"プロファイルとダッシュボード設定を WebDAV サーバーにバックアップし、別のデバイスで復元します。\",\"webdavUrl\":\"サーバー URL\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"ユーザー名\",\"webdavPassword\":\"パスワード\",\"webdavDir\":\"ディレクトリ\",\"webdavDirPlaceholder\":\"metacubexd（任意）\",\"webdavBackupNow\":\"今すぐバックアップ\",\"webdavRestore\":\"復元\",\"webdavBackupSuccess\":\"WebDAV にバックアップをアップロードしました\",\"webdavBackupFailed\":\"WebDAV バックアップに失敗しました\",\"webdavRestoreSuccess\":\"WebDAV から復元しました\",\"webdavRestoreCount\":\"{count} 件のプロファイルを復元しました\",\"webdavRestoreFailed\":\"WebDAV 復元に失敗しました\",\"runtimeConfig\":\"ランタイム設定\",\"runtimeConfigDescription\":\"カーネルが実際に実行している設定ファイルの読み取り専用ビュー（注入された external-controller、secret、mixed-port を含みます）。\",\"runtimeConfigEmpty\":\"まだランタイム設定が利用できません。\",\"runtimeConfigLoadFailed\":\"ランタイム設定の読み込みに失敗しました\",\"export\":\"エクスポート\",\"exportCSV\":\"CSV をエクスポート\",\"exportJSON\":\"JSON をエクスポート\",\"healthCheckAllProviders\":\"すべてのプロバイダーをヘルスチェック\",\"providerHealthCheckSuccess\":\"すべてのプロバイダーをヘルスチェックしました\",\"providerHealthCheckFailed\":\"一部のプロバイダーのヘルスチェックに失敗しました\",\"connectivityBoard\":\"接続性ボード\",\"connectivityTargets\":\"接続性\",\"streamingUnlockTargets\":\"ストリーミング / AI\",\"reachabilityNode\":\"ノードまたはグループ\",\"reachabilityNoNodes\":\"利用可能なノードがありません\",\"reachabilityRunTest\":\"テストを実行\",\"reachabilityResults\":\"接続性の結果\",\"reachabilityUnreachable\":\"到達不可\",\"reachabilityUnlockLimitation\":\"これは（遅延テストに基づく）プロキシ到達性であり、完全なリージョンアンロック検出ではありません。リージョンレベルのアンロックにはレスポンス本文の検査が必要で、対象外です。\",\"reachabilityHint\":\"ノードまたはグループを選択し、テストを実行して各ターゲットへの到達性を確認します。\",\"reachabilityAllUnreachable\":\"{node} 経由ではすべてのターゲットに到達できません\",\"profiles\":\"プロファイル\",\"profilesNew\":\"新規プロファイル\",\"profilesImport\":\"URL からインポート\",\"profilesDuplicate\":\"複製\",\"profilesDelete\":\"削除\",\"profilesEdit\":\"編集\",\"profilesActivate\":\"有効化\",\"profilesValidate\":\"検証\",\"profilesActive\":\"アクティブ\",\"profilesName\":\"名前\",\"profilesUrl\":\"サブスクリプション URL\",\"profilesSave\":\"保存\",\"profilesCancel\":\"キャンセル\",\"profilesValidationOk\":\"設定は有効です\",\"profilesEmpty\":\"プロファイルがまだありません\",\"profilesMerges\":\"マージオーバーレイ\",\"profilesMergesHelp\":\"マージオーバーレイは、アクティブなベースプロファイルに合成される YAML フラグメントです。重ねたいものを有効にしてください。\",\"profilesNewMerge\":\"新規マージオーバーレイ\",\"profilesMergeEnabled\":\"有効\",\"profilesMergeNoActiveBase\":\"マージオーバーレイを適用するにはベースプロファイルを有効化してください。\",\"profilesMergeUpdateFailed\":\"マージオーバーレイの更新に失敗しました\",\"profilesScripts\":\"スクリプト変換\",\"profilesScriptsHelp\":\"スクリプトは設定オブジェクトを受け取り、変更後の設定を返します。スクリプトは合成時にマージの後で実行されます。適用したいものを有効にしてください。\",\"profilesScriptsSafety\":\"安全性: スクリプトは広範なアクセス権で実行されます。信頼できるスクリプトのみを実行してください。スクリプトの編集または切り替えを行うと、再計算のためにアクティブなベースが再アクティブ化されます。\",\"profilesNewScript\":\"新しいスクリプト\",\"profilesScriptEnabled\":\"有効\",\"profilesScriptUpdateFailed\":\"スクリプト変換の更新に失敗しました\",\"profilesShare\":\"QRコードを共有\",\"profilesShareTitle\":\"サブスクリプションを共有\",\"profilesShareUrl\":\"サブスクリプションURL\",\"profilesShareCopy\":\"URLをコピー\",\"profilesShareCopied\":\"サブスクリプションURLをコピーしました\",\"editorReadOnly\":\"読み取り専用\",\"editorDisableValidation\":\"検証を無効化\",\"editRules\":\"ルールを編集\",\"editProxies\":\"プロキシとグループを編集\",\"edit\":\"編集\",\"moveUp\":\"上へ移動\",\"moveDown\":\"下へ移動\",\"proxyConfigEditorTitle\":\"プロキシとグループを編集\",\"proxyConfigEditorHint\":\"有効なプロファイルのローカルプロキシとグループを編集します。Proxy Provider の定義は完全版プロファイルエディターで管理します。保存時に設定全体を検証し、カーネルを一度だけ再起動します。\",\"proxyConfigSaved\":\"プロキシ設定を保存しました\",\"proxyConfigLoadFailed\":\"プロキシ設定の読み込みに失敗しました\",\"proxyConfigSaveFailed\":\"プロキシ設定の保存に失敗しました\",\"routingEditorNoActiveProfile\":\"編集できる有効なプロファイルがありません。先にプロファイルをインポートまたは有効化してください。\",\"routingEditorConflict\":\"サブスクリプションに未解決の競合があります\",\"routingEditorConflictHint\":\"このページで編集する前に、完全版プロファイルエディターで競合を解決してください。\",\"routingEditorResolveConflict\":\"完全版プロファイルエディターを開く\",\"routingEditorDiscardConfirm\":\"未保存の設定変更を破棄しますか？\",\"routingEditorRulePlaceholder\":\"Mihomo ルール全体を入力（例: DOMAIN-SUFFIX,example.com,DIRECT）\",\"routingEditorDeleteBlocked\":\"このリソースは参照されているため削除できません\",\"routingEditorNodes\":\"ローカルプロキシ\",\"routingEditorMembers\":\"メンバー\",\"routingEditorNameLocked\":\"参照を保つため、既存リソースの名前は変更できません。\",\"routingEditorNameTypeRequired\":\"名前と種類は必須です。\",\"routingEditorDuplicateName\":\"“{name}” というプロキシまたはグループは既に存在します。\",\"routingEditorJsonObjectRequired\":\"高度な JSON はオブジェクトである必要があります。\",\"routingEditorSelectMember\":\"プロキシまたはグループを選択\",\"routingEditorSelectProvider\":\"Proxy Provider を選択\",\"rulesEditorHint\":\"ルールの追加・編集・削除・ドラッグでの並べ替えができます。保存するとカーネルが一度再起動します。\",\"policy\":\"ポリシー\",\"reorder\":\"ドラッグで並べ替え\",\"delete\":\"削除\",\"cancel\":\"キャンセル\",\"rulesEditorSaved\":\"ルールを保存しました\",\"rulesEditorLoadFailed\":\"ルールの読み込みに失敗しました\",\"rulesEditorSaveFailed\":\"ルールの保存に失敗しました\",\"rulesEditorInvalid\":\"各ルールには種類・ペイロード・ポリシーが必要です\",\"networkConfig\":\"ネットワーク設定\",\"networkConfigHint\":\"有効なプロファイルのネットワーク設定を編集します。保存するとカーネルが一度再起動します。\",\"networkConfigSaved\":\"ネットワーク設定を保存しました\",\"networkConfigLoadFailed\":\"ネットワーク設定の読み込みに失敗しました\",\"networkConfigSaveFailed\":\"ネットワーク設定の保存に失敗しました\",\"tunnels\":\"トンネル\",\"tunnelsHint\":\"ローカルのリスナーをカーネル経由でリモートのターゲットへ転送します。\",\"tunnelNetwork\":\"ネットワーク\",\"tunnelAddress\":\"リッスンアドレス\",\"tunnelTarget\":\"ターゲット\",\"noTunnels\":\"トンネルなし\",\"sniffer\":\"スニファー\",\"snifferEnable\":\"スニファーを有効化\",\"snifferOverrideDestination\":\"宛先を上書き\",\"externalController\":\"外部コントローラー\",\"externalControllerManaged\":\"デスクトップではアプリが管理します\",\"onboardingWelcomeTitle\":\"MetaCubeXD へようこそ\",\"onboardingWelcomeBody\":\"サブスクリプションを貼り付ければ、1分もかからずにプロキシが使えます。\",\"onboardingGetStarted\":\"開始する\",\"onboardingSkip\":\"今はスキップ\",\"onboardingImportTitle\":\"サブスクリプションをインポート\",\"onboardingImportSubtitle\":\"サブスクリプション URL を貼り付けるか、ファイルを選択するか、クリップボードから貼り付けてください。\",\"onboardingImportSuccess\":\"サブスクリプションをインポートして有効化しました\",\"onboardingFileTooLarge\":\"ファイルが大きすぎます\",\"onboardingClipboardEmpty\":\"クリップボードが空です\",\"onboardingClipboardDenied\":\"クリップボードへのアクセスが拒否されました\",\"onboardingSystemProxyTitle\":\"システムプロキシを有効化\",\"onboardingSystemProxyBody\":\"このデバイスのすべてのアプリをプロキシ経由でルーティングします。\",\"onboardingDoneTitle\":\"準備完了\",\"onboardingDoneBody\":\"サブスクリプションが有効になりました。ノードを選んで利用を開始してください。\",\"onboardingGoToProxies\":\"プロキシへ移動\",\"onboardingFinish\":\"完了\",\"onboardingBack\":\"戻る\",\"onboardingNext\":\"次へ\",\"onboardingStep\":\"ステップ {current} / {total}\",\"onboardingEmptyTitle\":\"サブスクリプションがまだありません\",\"onboardingEmptyBody\":\"サブスクリプションをインポートしてプロキシの利用を開始してください。\",\"onboardingEmptyImport\":\"サブスクリプションをインポート\",\"onboardingEmptyRunSetup\":\"セットアップを再実行\",\"profilesImportTitle\":\"サブスクリプションをインポート\",\"profilesImportSubtitle\":\"URL・ファイル・クリップボードからサブスクリプションを追加します。\",\"profilesImportFile\":\"ファイルからインポート\",\"profilesImportClipboard\":\"クリップボードから貼り付け\",\"profilesImportSuccess\":\"サブスクリプションをインポートしました\",\"profilesImportFailed\":\"サブスクリプションのインポートに失敗しました\",\"profilesAdvanced\":\"詳細設定\",\"profilesRefresh\":\"更新\",\"profilesRefreshAndApply\":\"更新して適用\",\"profilesRefreshed\":\"サブスクリプションを更新しました\",\"profilesRefreshFailed\":\"サブスクリプションの更新に失敗しました\",\"profilesAutoUpdate\":\"自動更新\",\"profilesAutoUpdateOff\":\"オフ\",\"profilesAutoUpdateMinutes\":\"{n} 分\",\"profilesAutoUpdateHours\":\"{n} 時間\",\"profilesUpdated\":\"{time}に更新\",\"profilesActivated\":\"プロファイルを有効化しました\",\"profilesActionFailed\":\"操作に失敗しました\",\"profilesDeleteConfirm\":\"「{name}」を削除しますか？この操作は元に戻せません。\",\"profilesDeleteActiveConfirm\":\"「{name}」は現在有効なプロファイルです。削除すると実行中の設定が破棄されます。続行しますか？\",\"profilesEditing\":\"{name}を編集中\",\"visualEditor\":\"ビジュアルエディター\",\"visualEditorUnavailable\":\"ビジュアルエディターはデスクトップ版または All-in-One Agent でのみ利用できます。\",\"visualEditorBack\":\"プロファイルに戻る\",\"visualEditorUnsaved\":\"未保存\",\"visualEditorVisual\":\"ビジュアル\",\"visualEditorSettings\":\"設定\",\"visualEditorResources\":\"リソース\",\"visualEditorRouting\":\"ルーティング\",\"visualEditorSubRules\":\"サブルール\",\"visualEditorOperations\":\"件の操作\",\"visualEditorReset\":\"上書きをリセット\",\"visualEditorResetConfirm\":\"このサブスクリプションのビジュアル上書きをすべてリセットしますか？\",\"visualEditorProxy\":\"プロキシ\",\"visualEditorGroup\":\"グループ\",\"visualEditorUnnamed\":\"名前なし\",\"visualEditorDropHint\":\"プロキシまたは Provider をここにドラッグ\",\"visualEditorResourceEdit\":\"リソースを編集\",\"visualEditorAdvancedJson\":\"詳細フィールド（JSON）\",\"visualEditorAddField\":\"フィールドを追加\",\"visualEditorPreview\":\"変更を確認\",\"visualEditorPreviewFailed\":\"プレビューを作成できませんでした\",\"visualEditorApply\":\"検証して適用\",\"visualEditorActivate\":\"検証して有効化\",\"visualEditorApplied\":\"設定を適用しました\",\"visualEditorApplyFailed\":\"設定の適用に失敗しました\",\"visualEditorLeaveConfirm\":\"未保存の変更を破棄しますか？\",\"visualEditorConflicts\":\"サブスクリプションの競合\",\"visualEditorKeepLocal\":\"ローカルの上書きを維持\",\"visualEditorAcceptUpstream\":\"サブスクリプションの値を採用\",\"visualEditorManualMerge\":\"YAML でマージ\",\"visualEditorDiagnostics\":\"設定の診断\",\"visualEditorManaged\":\"管理対象\",\"quality\":\"品質\",\"sortDefault\":\"デフォルト\"}");

const locale_ko_46json_5505bba7 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"새 버전을 사용할 수 있습니다\",\"pwaUpdateReload\":\"새로고침\",\"lastHour\":\"지난 1시간\",\"lastDay\":\"지난 1일\",\"lastWeek\":\"지난 1주\",\"lastMonth\":\"지난 1개월\",\"customRange\":\"사용자 지정 범위\",\"forever\":\"전체\",\"dataRetention\":\"데이터 보존\",\"noDetailedData\":\"사용 가능한 상세 데이터가 없습니다.\",\"home\":\"홈\",\"add\":\"추가\",\"collapse\":\"접기\",\"collapseAll\":\"모두 접기\",\"expandAll\":\"모두 펼치기\",\"setup\":\"설정\",\"setupDescription\":\"Mihomo 백엔드에 연결하여 시작하세요\",\"overview\":\"개요\",\"proxies\":\"프록시\",\"proxiesSettings\":\"프록시 설정\",\"backToTop\":\"맨 위로\",\"rules\":\"규칙\",\"connections\":\"연결\",\"connectionsSettings\":\"연결 설정\",\"connectionsDetails\":\"연결 세부정보\",\"logs\":\"로그\",\"logsSettings\":\"로그 설정\",\"config\":\"구성\",\"controlCenter\":\"제어 센터\",\"controlCenterDesc\":\"번들된 커널과 호스트 통합을 관리합니다\",\"controlCenterKernel\":\"커널\",\"controlCenterSystem\":\"시스템 통합\",\"controlCenterConfig\":\"구성\",\"controlCenterBackup\":\"백업\",\"controlCenterDesktop\":\"데스크톱\",\"desktopBehavior\":\"데스크톱 동작\",\"desktopSilentUpdateCheck\":\"자동 업데이트 확인\",\"desktopSilentUpdateCheckDesc\":\"새 버전이 있을 때 알림을 표시합니다 (자동 설치는 하지 않음)\",\"desktopTunAutoRestore\":\"시작 시 TUN 모드 복원\",\"desktopTunAutoRestoreDesc\":\"마지막 종료 시 TUN 모드였고 헬퍼가 설치된 경우 시작 후 자동으로 다시 활성화합니다\",\"desktopShowTraySpeed\":\"트레이에 속도 표시\",\"desktopShowTraySpeedDesc\":\"메뉴 바 / 트레이 툴팁에 실시간 업/다운 속도를 표시합니다\",\"desktopHotkeys\":\"전역 단축키\",\"desktopHotkeysDesc\":\"창을 닫아도 동작하는 시스템 전역 단축키\",\"desktopHotkeyToggleSystemProxy\":\"시스템 프록시 전환\",\"desktopHotkeyCycleProxyMode\":\"프록시 모드 순환\",\"desktopHotkeyToggleWindow\":\"창 표시 / 숨기기\",\"desktopHotkeyPressKeys\":\"키를 누르세요…\",\"desktopHotkeyDisabled\":\"설정 안 됨\",\"desktopHotkeyConflict\":\"등록 실패\",\"desktopHotkeyRecordHint\":\"보조 키가 포함된 조합 키를 누르세요. Backspace로 지우고 Esc로 취소합니다.\",\"desktopHotkeySave\":\"저장\",\"desktopHotkeyReset\":\"기본값 복원\",\"upload\":\"업로드\",\"download\":\"다운로드\",\"uploadTotal\":\"업로드 합계\",\"downloadTotal\":\"다운로드 합계\",\"activeConnections\":\"활성 연결\",\"memoryUsage\":\"메모리 사용량\",\"flow\":\"흐름\",\"traffic\":\"트래픽\",\"memory\":\"메모리\",\"down\":\"다운\",\"up\":\"업\",\"proxyProviders\":\"프록시 공급자\",\"ruleProviders\":\"규칙 공급자\",\"search\":\"검색\",\"inner\":\"내부\",\"ID\":\"ID\",\"type\":\"유형\",\"name\":\"이름\",\"process\":\"프로세스\",\"host\":\"호스트\",\"hostProcess\":\"호스트 / 프로세스\",\"sniffHost\":\"스니핑 호스트\",\"chains\":\"체인\",\"ruleChains\":\"규칙 / 체인\",\"flowDirection\":\"흐름\",\"connectTime\":\"시간\",\"dlSpeed\":\"DL 속도\",\"ulSpeed\":\"UL 속도\",\"dl\":\"DL\",\"ul\":\"UL\",\"sourceIP\":\"소스 IP\",\"sourcePort\":\"소스 포트\",\"destination\":\"대상\",\"inboundUser\":\"인바운드 사용자\",\"user\":\"사용자\",\"close\":\"닫기\",\"pause\":\"일시정지\",\"resume\":\"재개\",\"reset\":\"재설정\",\"resetSettings\":\"설정 재설정\",\"dnsQuery\":\"DNS 쿼리\",\"save\":\"저장\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"일부 DNS 필드는 즉시 적용할 수 있습니다. 다른 필드(예: 네임서버 목록)는 커널 다시 로드가 필요합니다. 완전한 제어를 위해 구성 편집기에서 편집하세요.\",\"dnsEnhancedMode\":\"향상된 모드\",\"dnsNameserver\":\"네임서버\",\"dnsNameserverPlaceholder\":\"한 줄에 서버 하나\",\"dnsFallback\":\"폴백\",\"dnsFallbackPlaceholder\":\"한 줄에 서버 하나\",\"dnsFakeIpRange\":\"Fake IP 범위\",\"dnsUseHosts\":\"Hosts 사용\",\"dnsSettingsSaved\":\"DNS 설정이 저장되었습니다\",\"dnsSettingsSaveFailed\":\"DNS 설정 저장에 실패했습니다\",\"dots\":\"점\",\"bar\":\"막대\",\"auto\":\"자동\",\"off\":\"꺼짐\",\"proxiesPreviewType\":\"프록시 미리보기 유형\",\"proxiesPreviewAutoThreshold\":\"자동 전환 임계값\",\"cardMode\":\"카드\",\"listMode\":\"목록\",\"displayMode\":\"표시 모드\",\"tableMode\":\"테이블\",\"masterDetailMode\":\"마스터-디테일\",\"none\":\"없음\",\"urlForLatencyTest\":\"지연 테스트 URL\",\"latencyTestUrlSource\":\"지연 테스트 URL 소스\",\"latencyTestUrlSourceCore\":\"코어 (그룹별 URL)\",\"latencyTestUrlSourceDashboard\":\"대시보드 (단일 URL)\",\"autoCloseConns\":\"연결 자동 닫기\",\"autoSwitchEndpoint\":\"엔드포인트 자동 전환\",\"autoSwitchTheme\":\"테마 자동 전환\",\"defaultPage\":\"기본 페이지\",\"favDayTheme\":\"선호하는 주간 테마\",\"favNightTheme\":\"선호하는 다크 테마\",\"renderInTwoColumns\":\"2열로 렌더링\",\"proxiesCardSize\":\"노드 카드 크기\",\"cardSizeComfortable\":\"넓게\",\"cardSizeCompact\":\"보통\",\"cardSizeTight\":\"좁게\",\"stickyGroupHeader\":\"그룹 헤더 고정\",\"updateGEODatabases\":\"GEO 데이터베이스 업데이트\",\"restartCore\":\"코어 재시작\",\"reloadConfigSuccess\":\"설정을 다시 불러왔습니다\",\"restartCoreConfirm\":\"코어를 다시 시작하시겠습니까? 모든 연결이 끊어집니다.\",\"upgradeCore\":\"코어 업그레이드\",\"upgradeUI\":\"대시보드 업그레이드\",\"upgradeUIConfirm\":\"대시보드를 업그레이드할까요? 현재 웹 대시보드 파일을 다운로드하여 교체합니다.\",\"upgradeCoreConfirm\":\"코어를 업그레이드할까요? 새 버전을 다운로드하고 코어를 재시작하여 모든 연결이 끊어집니다.\",\"proxiesSorting\":\"프록시 정렬\",\"orderNatural\":\"구성 파일의 원래 순서\",\"orderLatency_asc\":\"지연 낮은 순\",\"orderLatency_desc\":\"지연 높은 순\",\"orderQuality_asc\":\"품질 낮은 순\",\"orderQuality_desc\":\"품질 높은 순\",\"orderName_asc\":\"이름순 (A-Z)\",\"orderName_desc\":\"이름순 (Z-A)\",\"orderRuleType_asc\":\"규칙 유형순 (A-Z)\",\"orderRuleType_desc\":\"규칙 유형순 (Z-A)\",\"orderHitCount_desc\":\"가장 많이 일치한 순\",\"orderHitCount_asc\":\"가장 적게 일치한 순\",\"orderHitAt_desc\":\"최근 일치한 순\",\"ms\":\"ms\",\"updated\":\"업데이트됨\",\"tableSize\":\"테이블 크기\",\"logLevel\":\"로그 레벨\",\"info\":\"info\",\"silent\":\"silent\",\"debug\":\"debug\",\"warning\":\"warning\",\"error\":\"error\",\"logMaxRows\":\"로그 최대 보존 행 수\",\"xs\":\"아주 작은 크기\",\"sm\":\"작은 크기\",\"md\":\"보통 크기\",\"lg\":\"큰 크기\",\"switchEndpoint\":\"엔드포인트 전환\",\"switchLanguage\":\"언어 전환\",\"switchFont\":\"글꼴 전환\",\"enableTwemoji\":\"Twemoji 사용\",\"enableDataUsageTracking\":\"데이터 사용량 추적\",\"enableDataUsageTrackingDesc\":\"데이터 사용량 페이지를 위해 연결별 트래픽을 기록합니다. 모든 페이지에서 실행됩니다. CPU 사용량을 줄이려면 끄세요.\",\"latencyTestTimeoutDuration\":\"지연 테스트 시간 초과 기간\",\"latencyMediumThreshold\":\"지연 노란색 임계값\",\"latencyHighThreshold\":\"지연 빨간색 임계값\",\"thresholdAutoPlaceholder\":\"0 = 자동 (기본값 사용)\",\"all\":\"전체\",\"sequence\":\"순서\",\"level\":\"레벨\",\"payload\":\"페이로드\",\"details\":\"세부정보\",\"endpointURL\":\"엔드포인트 URL\",\"secret\":\"시크릿\",\"statusConnecting\":\"연결 중…\",\"statusProbing\":\"기본 백엔드 확인 중…\",\"statusUnreachable\":\"백엔드를 찾을 수 없음\",\"statusError\":\"백엔드에 연결할 수 없음\",\"statusAuthError\":\"시크릿이 거부됨\",\"statusBlocked\":\"연결이 차단됨\",\"statusIdle\":\"Mihomo 백엔드를 입력하세요\",\"secretHint\":\"백엔드에 시크릿이 없으면 비워 두세요\",\"connect\":\"연결\",\"connectPrompt\":\"Mihomo 백엔드에 연결하여 시작하세요.\",\"runningMode\":\"실행 모드\",\"modeSwitchFailed\":\"모드 전환에 실패했습니다\",\"global\":\"글로벌\",\"rule\":\"규칙\",\"direct\":\"다이렉트\",\"reject\":\"거부\",\"rejectdrop\":\"드롭\",\"selector\":\"셀렉터\",\"urltest\":\"URL 테스트\",\"smart\":\"스마트 선택\",\"loadbalance\":\"부하 분산\",\"fallback\":\"폴백\",\"relay\":\"릴레이\",\"pass\":\"패스\",\"active\":\"활성\",\"closed\":\"닫힘\",\"sort\":\"정렬\",\"hideUnavailableProxies\":\"사용 불가 프록시 숨기기\",\"reloadConfig\":\"구성 다시 로드\",\"flushFakeIP\":\"Fake-IP 비우기\",\"flushDNSCache\":\"DNS 캐시 비우기\",\"tagClientSourceIPWithName\":\"클라이언트 소스 IP에 이름 태그 지정\",\"resolveClientHostname\":\"호스트 이름 확인 (역방향 DNS)\",\"resolveClientHostnameDesc\":\"역방향 DNS를 통해 LAN 클라이언트의 기기 이름과 호스트가 없는 대상 IP의 이름을 표시합니다. mihomo의 DNS가 해당 역방향 영역을 확인할 수 있어야 합니다.\",\"tag\":\"태그\",\"coreConfig\":\"코어 구성\",\"xdConfig\":\"XD 구성\",\"version\":\"버전\",\"expire\":\"만료\",\"noExpire\":\"없음\",\"allowLan\":\"LAN 허용\",\"enableTunDevice\":\"TUN 장치 사용\",\"tunModeStack\":\"TUN 모드 스택\",\"tunDeviceName\":\"TUN 장치 이름\",\"tunLoadFailed\":\"TUN 상태를 불러오지 못했습니다\",\"tunEnableSuccess\":\"TUN 모드가 활성화되었습니다\",\"tunEnableFailed\":\"TUN 모드 활성화에 실패했습니다\",\"tunDisableSuccess\":\"TUN 모드가 비활성화되었습니다 — 네트워크가 복구되었습니다\",\"tunDisableFailed\":\"TUN 모드 비활성화에 실패했습니다\",\"tunRecoverNetwork\":\"네트워크 복구\",\"tunInstallNote\":\"TUN을 활성화하면 권한 있는 헬퍼가 설치되고 관리자 승인을 요청합니다. 서명되지 않은 빌드에서는 \\\"알 수 없는 게시자\\\" 경고가 표시됩니다 — 정상적인 동작입니다.\",\"tunNeedsProfile\":\"TUN 모드를 켜기 전에 구독을 가져오세요.\",\"tunStatusLabel\":\"상태\",\"tunStatusActive\":\"TUN 활성화됨\",\"tunStatusSidecar\":\"Sidecar (시스템 네트워크에 영향 없음)\",\"tunUninstallHelper\":\"도우미 서비스 제거\",\"tunUninstallSuccess\":\"도우미 서비스가 제거되었습니다\",\"tunUninstallFailed\":\"도우미 서비스 제거에 실패했습니다\",\"tunUninstallConfirm\":\"권한 도우미 서비스를 제거할까요? 다음에 TUN을 활성화할 때 다시 권한 상승을 요청합니다.\",\"outboundInterfaceName\":\"아웃바운드 인터페이스 이름\",\"port\":\"{name} 포트\",\"quickFilter\":\"빠른 필터\",\"iconHeight\":\"아이콘 높이\",\"iconMarginRight\":\"아이콘 오른쪽 여백\",\"dataUsage\":\"데이터 사용량\",\"clearAll\":\"모두 지우기\",\"confirmClearAll\":\"모든 데이터 사용량을 지우시겠습니까?\",\"devices\":\"장치\",\"timeRange\":\"기간\",\"grandTotal\":\"총합계\",\"macAddress\":\"MAC 주소\",\"ipAddress\":\"IP 주소\",\"duration\":\"지속 시간\",\"total\":\"합계\",\"actions\":\"작업\",\"remove\":\"제거\",\"noDataUsageYet\":\"아직 기록된 데이터 사용량이 없습니다\",\"noData\":\"데이터 없음\",\"noRules\":\"규칙 없음\",\"noRuleProviders\":\"규칙 공급자 없음\",\"disabled\":\"비활성화됨\",\"enabled\":\"활성화됨\",\"status\":\"상태\",\"noMatchingRules\":\"필터와 일치하는 규칙이 없습니다\",\"clearFilters\":\"필터 지우기\",\"ruleMatched\":\"일치함\",\"ruleUnmatched\":\"일치하지 않음\",\"lastMatchedAt\":\"마지막 일치\",\"lastUnmatchedAt\":\"마지막 불일치\",\"columns\":\"열\",\"sortBy\":\"정렬 기준\",\"sortOverriddenBySearch\":\"검색 중에는 검색 관련도순으로 정렬됨\",\"groupBy\":\"그룹화 기준\",\"rowsPerPage\":\"페이지당 행 수\",\"ipShort\":\"IP\",\"na\":\"N/A\",\"show\":\"표시\",\"noLatencyHistory\":\"지연 기록 없음\",\"testLatency\":\"지연 테스트\",\"unfixProxy\":\"자동 선택으로 복원\",\"dataUsageInfo\":\"데이터 사용량 모니터링은 클라이언트 측(브라우저)에서 수행됩니다. 브라우저를 닫으면 모니터링이 실행되지 않을 수 있습니다.\",\"basic\":\"기본\",\"start\":\"시작\",\"rulePayload\":\"규칙 페이로드\",\"metadata\":\"메타데이터\",\"network\":\"네트워크\",\"dnsMode\":\"DNS 모드\",\"sourceAndDestination\":\"소스 및 대상\",\"source\":\"소스\",\"remoteDestination\":\"원격 대상\",\"inbound\":\"인바운드\",\"inboundName\":\"인바운드 이름\",\"inboundIP\":\"인바운드 IP\",\"processName\":\"프로세스 이름\",\"processPath\":\"프로세스 경로\",\"special\":\"특수\",\"specialProxy\":\"특수 프록시\",\"specialRules\":\"특수 규칙\",\"connectionsChart\":\"연결\",\"networkTypes\":\"네트워크 유형\",\"topProxies\":\"상위 프록시\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"지연\",\"other\":\"기타\",\"showTrafficIndicator\":\"트래픽 표시기 보이기\",\"hideTrafficIndicator\":\"트래픽 표시기 숨기기\",\"currentIP\":\"현재 IP\",\"country\":\"국가\",\"city\":\"도시\",\"organization\":\"조직\",\"proxyDetection\":\"프록시 감지\",\"clean\":\"클린\",\"networkLatency\":\"네트워크 지연\",\"average\":\"평균\",\"timeout\":\"시간 초과\",\"networkTopology\":\"네트워크 토폴로지\",\"client\":\"클라이언트\",\"destinations\":\"대상\",\"waitingForConnections\":\"연결을 기다리는 중...\",\"conn\":\"연결\",\"more\":\"더보기\",\"connectedTo\":\"연결됨\",\"clients\":\"클라이언트\",\"groups\":\"그룹\",\"nodes\":\"노드\",\"proxyGroups\":\"프록시 그룹\",\"proxyNodes\":\"프록시 노드\",\"ruleType\":\"규칙 유형\",\"useMobileBottomNav\":\"하단 내비게이션 사용 (모바일)\",\"fetchRemoteConfig\":\"원격 구성 가져오기\",\"remoteConfigURL\":\"원격 구성 URL\",\"remoteConfigURLPlaceholder\":\"구성 파일 URL 입력\",\"shortcuts\":{\"title\":\"키보드 단축키\",\"category\":{\"navigation\":\"내비게이션\",\"actions\":\"작업\"},\"goToOverview\":\"개요로 이동\",\"goToProxies\":\"프록시로 이동\",\"goToConnections\":\"연결로 이동\",\"goToRules\":\"규칙으로 이동\",\"goToLogs\":\"로그로 이동\",\"goToConfig\":\"구성으로 이동\",\"refresh\":\"새로고침\",\"closeModal\":\"모달 닫기\",\"showHelp\":\"도움말 표시\",\"pressKey\":\"키를 누르세요...\",\"pressEscToClose\":\"Esc를 눌러 닫기\",\"customized\":\"사용자 지정됨\",\"conflictWith\":\"충돌:\",\"forceApply\":\"그래도 적용\",\"resetToDefaults\":\"기본값으로 재설정\"},\"connectionError\":\"백엔드에 연결할 수 없음\",\"connectionErrorDesc\":\"백엔드에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하거나 다른 엔드포인트로 전환하세요.\",\"retry\":\"재시도\",\"recommendation\":{\"title\":\"스마트 추천\",\"recommended\":\"추천됨\",\"testAll\":\"전체 테스트\",\"testAllGroups\":\"모든 그룹 테스트\",\"switchToRecommended\":\"추천으로 전환\",\"testing\":\"테스트 중\",\"score\":\"점수\",\"latencyWeight\":\"지연 가중치\",\"stabilityWeight\":\"안정성 가중치\",\"successRateWeight\":\"성공률 가중치\",\"autoSwitch\":\"추천으로 자동 전환\",\"autoSwitchDesc\":\"테스트 후 추천 노드로 자동 전환합니다\",\"minTestInterval\":\"최소 테스트 간격 (분)\",\"excludedNodes\":\"제외된 노드\",\"clearHistory\":\"기록 지우기\",\"noScoreYet\":\"아직 점수 없음\"},\"themeColorTooltip\":\"색상 순서: 배경, 강조, 텍스트\",\"mixedContentError\":\"연결할 수 없음: 이 페이지는 HTTPS로 로드되었지만 백엔드 URL은 HTTP입니다. 브라우저는 보안을 위해 이를 차단합니다. 백엔드를 통해 직접 패널에 접속하거나(예: http://127.0.0.1:9090/ui) HTTP로 패널을 배포하세요.\",\"endpointConnectError\":\"백엔드 연결에 실패했습니다. URL을 확인하고 백엔드가 실행 중인지 확인하세요.\",\"filterNodesByName\":\"이름으로 노드 필터링\",\"jumpToCurrent\":\"현재 노드로\",\"regionOther\":\"기타\",\"clear\":\"지우기\",\"copy\":\"복사\",\"copyValue\":\"값 복사\",\"geoLocation\":\"위치\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"저장된 엔드포인트\",\"unifiedDelay\":\"통합 지연\",\"appearance\":\"외관\",\"fontFamily\":\"글꼴\",\"backgroundImage\":\"배경\",\"backgroundCustomImage\":\"사용자 지정 이미지\",\"backgroundImageUrlOption\":\"이미지 URL\",\"uploadImage\":\"이미지 업로드\",\"backgroundImageUrlPlaceholder\":\"이미지 URL 입력 (예: Bing 일일 배경화면)\",\"backgroundBlur\":\"배경 흐림\",\"backgroundOverlayOpacity\":\"오버레이 불투명도\",\"customThemeColors\":\"사용자 지정 테마 색상\",\"customThemeColorsDesc\":\"테마 색상 토큰 재정의\",\"customCss\":\"사용자 지정 CSS\",\"customCssDesc\":\"고급: 직접 작성한 CSS를 주입하여 대시보드를 다시 스타일링합니다\",\"customCssPlaceholder\":\"/* 예: .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"설정 백업\",\"exportSettings\":\"내보내기\",\"importSettings\":\"가져오기\",\"kernelControl\":\"커널 제어\",\"kernelStatus\":\"상태\",\"kernelVersion\":\"버전\",\"kernelUptime\":\"가동 시간\",\"kernelPid\":\"PID\",\"kernelStart\":\"시작\",\"kernelStop\":\"중지\",\"kernelRestart\":\"재시작\",\"kernelRollback\":\"설정 롤백\",\"kernelRecover\":\"최소 구성으로 재설정\",\"kernelRollbackConfirm\":\"이전 정상 설정으로 복원하고 커널을 다시 시작할까요?\",\"kernelRecoverConfirm\":\"활성 설정을 최소 구성으로 재설정하고 다시 시작할까요? 이후 프로필을 다시 가져오세요.\",\"kernelRollbackApplied\":\"이전 설정으로 롤백했습니다\",\"kernelRecoverApplied\":\"최소 구성으로 재설정했습니다\",\"kernelRollbackFailed\":\"롤백 실패\",\"kernelRecoverFailed\":\"복구 실패\",\"kernelLogs\":\"커널 로그\",\"kernelLogsConnected\":\"스트리밍 중\",\"kernelLogsDisconnected\":\"연결 끊김\",\"kernelLogsClear\":\"지우기\",\"systemProxy\":\"시스템 프록시\",\"systemProxyEnable\":\"시스템 프록시 사용\",\"systemProxyDescription\":\"포트 {port}의 관리 프록시를 통해 시스템 트래픽을 라우팅합니다.\",\"systemProxyBypass\":\"우회 / LAN 화이트리스트\",\"systemProxyBypassPlaceholder\":\"한 줄에 호스트 또는 CIDR 하나, 예: localhost\",\"systemProxyApply\":\"적용\",\"systemProxyLoadFailed\":\"시스템 프록시 상태를 불러오지 못했습니다\",\"systemProxyApplyFailed\":\"시스템 프록시 설정을 적용하지 못했습니다\",\"systemProxyApplied\":\"시스템 프록시 설정이 적용되었습니다\",\"kernelVersionManager\":\"커널 버전\",\"kernelVersionCurrent\":\"현재\",\"kernelVersionBundled\":\"번들됨\",\"kernelVersionSelect\":\"버전으로 전환\",\"kernelVersionActive\":\"활성\",\"kernelVersionSwitch\":\"전환 후 재시작\",\"kernelVersionSwitched\":\"{version}(으)로 전환했습니다\",\"kernelVersionSwitchFailed\":\"커널 버전 전환에 실패했습니다\",\"kernelVersionLoadFailed\":\"커널 버전을 불러오지 못했습니다\",\"geoAssets\":\"GEO 데이터베이스\",\"geoAssetsDescription\":\"라우팅 규칙에 사용되는 최신 geoip / geosite / mmdb 데이터베이스를 다운로드합니다.\",\"geoUpdate\":\"GEO 데이터베이스 업데이트\",\"geoUpdateSuccess\":\"GEO 데이터베이스가 업데이트되었습니다\",\"geoUpdateFailed\":\"GEO 데이터베이스 업데이트에 실패했습니다\",\"webdavBackup\":\"WebDAV 백업\",\"webdavBackupDescription\":\"프로필과 대시보드 설정을 WebDAV 서버에 백업하고 다른 장치에서 복원합니다.\",\"webdavUrl\":\"서버 URL\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"사용자 이름\",\"webdavPassword\":\"비밀번호\",\"webdavDir\":\"디렉터리\",\"webdavDirPlaceholder\":\"metacubexd (선택 사항)\",\"webdavBackupNow\":\"지금 백업\",\"webdavRestore\":\"복원\",\"webdavBackupSuccess\":\"WebDAV에 백업을 업로드했습니다\",\"webdavBackupFailed\":\"WebDAV 백업에 실패했습니다\",\"webdavRestoreSuccess\":\"WebDAV에서 복원했습니다\",\"webdavRestoreCount\":\"{count}개의 프로필을 복원했습니다\",\"webdavRestoreFailed\":\"WebDAV 복원에 실패했습니다\",\"runtimeConfig\":\"런타임 구성\",\"runtimeConfigDescription\":\"커널이 실제로 실행 중인 구성 파일의 읽기 전용 보기입니다(주입된 external-controller, secret, mixed-port 포함).\",\"runtimeConfigEmpty\":\"아직 사용 가능한 런타임 구성이 없습니다.\",\"runtimeConfigLoadFailed\":\"런타임 구성을 불러오지 못했습니다\",\"export\":\"내보내기\",\"exportCSV\":\"CSV 내보내기\",\"exportJSON\":\"JSON 내보내기\",\"healthCheckAllProviders\":\"모든 공급자 상태 확인\",\"providerHealthCheckSuccess\":\"모든 공급자의 상태를 확인했습니다\",\"providerHealthCheckFailed\":\"일부 공급자의 상태 확인에 실패했습니다\",\"connectivityBoard\":\"연결성 보드\",\"connectivityTargets\":\"연결성\",\"streamingUnlockTargets\":\"스트리밍 / AI\",\"reachabilityNode\":\"노드 또는 그룹\",\"reachabilityNoNodes\":\"사용 가능한 노드 없음\",\"reachabilityRunTest\":\"테스트 실행\",\"reachabilityResults\":\"연결성 결과\",\"reachabilityUnreachable\":\"연결 불가\",\"reachabilityUnlockLimitation\":\"이것은 (지연 테스트 기반) 프록시 연결성이며 전체 지역 잠금 해제 감지가 아닙니다. 지역 수준 잠금 해제는 응답 본문 검사가 필요하며 범위를 벗어납니다.\",\"reachabilityHint\":\"노드 또는 그룹을 선택한 다음 테스트를 실행하여 각 대상의 연결성을 확인하세요.\",\"reachabilityAllUnreachable\":\"{node}을(를) 통해 모든 대상에 연결할 수 없습니다\",\"profiles\":\"프로필\",\"profilesNew\":\"새 프로필\",\"profilesImport\":\"URL에서 가져오기\",\"profilesDuplicate\":\"복제\",\"profilesDelete\":\"삭제\",\"profilesEdit\":\"편집\",\"profilesActivate\":\"활성화\",\"profilesValidate\":\"검증\",\"profilesActive\":\"활성\",\"profilesName\":\"이름\",\"profilesUrl\":\"구독 URL\",\"profilesSave\":\"저장\",\"profilesCancel\":\"취소\",\"profilesValidationOk\":\"구성이 유효합니다\",\"profilesEmpty\":\"아직 프로필이 없습니다\",\"profilesMerges\":\"병합 오버레이\",\"profilesMergesHelp\":\"병합 오버레이는 활성 베이스 프로필 위에 합성되는 YAML 조각입니다. 위에 겹치고 싶은 항목을 활성화하세요.\",\"profilesNewMerge\":\"새 병합 오버레이\",\"profilesMergeEnabled\":\"활성화됨\",\"profilesMergeNoActiveBase\":\"병합 오버레이를 적용하려면 베이스 프로필을 활성화하세요.\",\"profilesMergeUpdateFailed\":\"병합 오버레이 업데이트에 실패했습니다\",\"profilesScripts\":\"스크립트 변환\",\"profilesScriptsHelp\":\"스크립트는 설정 객체를 받아 수정된 설정을 반환합니다. 스크립트는 합성 중 병합 이후에 실행됩니다. 적용할 항목을 활성화하세요.\",\"profilesScriptsSafety\":\"안전: 스크립트는 광범위한 권한으로 실행됩니다. 신뢰하는 스크립트만 실행하세요. 스크립트를 편집하거나 전환하면 재계산을 위해 활성 베이스가 다시 활성화됩니다.\",\"profilesNewScript\":\"새 스크립트\",\"profilesScriptEnabled\":\"활성화됨\",\"profilesScriptUpdateFailed\":\"스크립트 변환 업데이트에 실패했습니다\",\"profilesShare\":\"QR 공유\",\"profilesShareTitle\":\"구독 공유\",\"profilesShareUrl\":\"구독 URL\",\"profilesShareCopy\":\"URL 복사\",\"profilesShareCopied\":\"구독 URL이 복사되었습니다\",\"editorReadOnly\":\"읽기 전용\",\"editorDisableValidation\":\"검증 비활성화\",\"editRules\":\"규칙 편집\",\"editProxies\":\"프록시 및 그룹 편집\",\"edit\":\"편집\",\"moveUp\":\"위로 이동\",\"moveDown\":\"아래로 이동\",\"proxyConfigEditorTitle\":\"프록시 및 그룹 편집\",\"proxyConfigEditorHint\":\"활성 프로필의 로컬 프록시 노드와 그룹을 편집합니다. Proxy Provider 정의는 전체 프로필 편집기에서 관리됩니다. 저장 시 전체 구성을 검증하고 커널을 한 번만 다시 시작합니다.\",\"proxyConfigSaved\":\"프록시 구성이 저장되었습니다\",\"proxyConfigLoadFailed\":\"프록시 구성을 불러오지 못했습니다\",\"proxyConfigSaveFailed\":\"프록시 구성을 저장하지 못했습니다\",\"routingEditorNoActiveProfile\":\"편집할 활성 프로필이 없습니다. 먼저 프로필을 가져오거나 활성화하세요.\",\"routingEditorConflict\":\"구독에 해결되지 않은 충돌이 있습니다\",\"routingEditorConflictHint\":\"이 페이지에서 편집하기 전에 전체 프로필 편집기에서 충돌을 해결하세요.\",\"routingEditorResolveConflict\":\"전체 프로필 편집기 열기\",\"routingEditorDiscardConfirm\":\"저장하지 않은 구성 변경을 버리시겠습니까?\",\"routingEditorRulePlaceholder\":\"전체 Mihomo 규칙을 입력하세요. 예: DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"이 리소스는 아직 참조 중이므로 삭제할 수 없습니다\",\"routingEditorNodes\":\"로컬 프록시 노드\",\"routingEditorMembers\":\"멤버\",\"routingEditorNameLocked\":\"참조를 유지하기 위해 기존 리소스의 이름은 잠겨 있습니다.\",\"routingEditorNameTypeRequired\":\"이름과 유형은 필수입니다.\",\"routingEditorDuplicateName\":\"“{name}” 이름의 프록시 또는 그룹이 이미 있습니다.\",\"routingEditorJsonObjectRequired\":\"고급 JSON은 객체여야 합니다.\",\"routingEditorSelectMember\":\"프록시 또는 그룹 선택\",\"routingEditorSelectProvider\":\"Proxy Provider 선택\",\"rulesEditorHint\":\"규칙을 추가, 편집, 삭제하거나 드래그하여 순서를 변경합니다. 저장하면 커널이 한 번 재시작됩니다.\",\"policy\":\"정책\",\"reorder\":\"드래그하여 순서 변경\",\"delete\":\"삭제\",\"cancel\":\"취소\",\"rulesEditorSaved\":\"규칙이 저장되었습니다\",\"rulesEditorLoadFailed\":\"규칙을 불러오지 못했습니다\",\"rulesEditorSaveFailed\":\"규칙을 저장하지 못했습니다\",\"rulesEditorInvalid\":\"각 규칙에는 비어 있지 않은 유형, 페이로드, 정책이 필요합니다\",\"networkConfig\":\"네트워크 설정\",\"networkConfigHint\":\"활성 프로필의 네트워크 섹션을 편집합니다. 저장하면 커널이 한 번 다시 시작됩니다.\",\"networkConfigSaved\":\"네트워크 설정이 저장되었습니다\",\"networkConfigLoadFailed\":\"네트워크 설정을 불러오지 못했습니다\",\"networkConfigSaveFailed\":\"네트워크 설정을 저장하지 못했습니다\",\"tunnels\":\"터널\",\"tunnelsHint\":\"커널을 통해 로컬 리스너를 원격 대상으로 전달합니다.\",\"tunnelNetwork\":\"네트워크\",\"tunnelAddress\":\"수신 주소\",\"tunnelTarget\":\"대상\",\"noTunnels\":\"터널 없음\",\"sniffer\":\"스니퍼\",\"snifferEnable\":\"스니퍼 활성화\",\"snifferOverrideDestination\":\"대상 덮어쓰기\",\"externalController\":\"외부 컨트롤러\",\"externalControllerManaged\":\"데스크톱에서는 앱이 관리합니다\",\"onboardingWelcomeTitle\":\"MetaCubeXD에 오신 것을 환영합니다\",\"onboardingWelcomeBody\":\"구독을 붙여넣으면 1분 안에 프록시를 사용할 수 있습니다.\",\"onboardingGetStarted\":\"시작하기\",\"onboardingSkip\":\"지금은 건너뛰기\",\"onboardingImportTitle\":\"구독 가져오기\",\"onboardingImportSubtitle\":\"구독 URL을 붙여넣거나 파일을 선택하거나 클립보드에서 붙여넣으세요.\",\"onboardingImportSuccess\":\"구독을 가져와 활성화했습니다\",\"onboardingFileTooLarge\":\"파일이 너무 큽니다\",\"onboardingClipboardEmpty\":\"클립보드가 비어 있습니다\",\"onboardingClipboardDenied\":\"클립보드 접근이 거부되었습니다\",\"onboardingSystemProxyTitle\":\"시스템 프록시 사용\",\"onboardingSystemProxyBody\":\"이 장치의 모든 앱을 프록시를 통해 라우팅합니다.\",\"onboardingDoneTitle\":\"모든 준비가 끝났습니다\",\"onboardingDoneBody\":\"구독이 활성화되었습니다. 노드를 선택하여 시작하세요.\",\"onboardingGoToProxies\":\"프록시로 이동\",\"onboardingFinish\":\"완료\",\"onboardingBack\":\"이전\",\"onboardingNext\":\"다음\",\"onboardingStep\":\"{total}단계 중 {current}단계\",\"onboardingEmptyTitle\":\"아직 구독이 없습니다\",\"onboardingEmptyBody\":\"구독을 가져와 프록시를 사용해 보세요.\",\"onboardingEmptyImport\":\"구독 가져오기\",\"onboardingEmptyRunSetup\":\"설정 다시 실행\",\"profilesImportTitle\":\"구독 가져오기\",\"profilesImportSubtitle\":\"URL, 파일 또는 클립보드로 구독을 추가합니다.\",\"profilesImportFile\":\"파일에서 가져오기\",\"profilesImportClipboard\":\"클립보드에서 붙여넣기\",\"profilesImportSuccess\":\"구독을 가져왔습니다\",\"profilesImportFailed\":\"구독 가져오기에 실패했습니다\",\"profilesAdvanced\":\"고급\",\"profilesRefresh\":\"새로고침\",\"profilesRefreshAndApply\":\"새로고침 후 적용\",\"profilesRefreshed\":\"구독을 새로고침했습니다\",\"profilesRefreshFailed\":\"구독 새로고침에 실패했습니다\",\"profilesAutoUpdate\":\"자동 업데이트\",\"profilesAutoUpdateOff\":\"꺼짐\",\"profilesAutoUpdateMinutes\":\"{n}분\",\"profilesAutoUpdateHours\":\"{n}시간\",\"profilesUpdated\":\"{time}에 업데이트됨\",\"profilesActivated\":\"프로필을 활성화했습니다\",\"profilesActionFailed\":\"작업에 실패했습니다\",\"profilesDeleteConfirm\":\"\\\"{name}\\\"을(를) 삭제할까요? 이 작업은 되돌릴 수 없습니다.\",\"profilesDeleteActiveConfirm\":\"\\\"{name}\\\"은(는) 현재 활성화된 프로필입니다. 삭제하면 실행 중인 설정이 해제됩니다. 계속할까요?\",\"profilesEditing\":\"{name} 편집 중\",\"visualEditor\":\"시각적 편집기\",\"visualEditorUnavailable\":\"시각적 편집기는 데스크톱 또는 All-in-One Agent에서만 사용할 수 있습니다.\",\"visualEditorBack\":\"프로필로 돌아가기\",\"visualEditorUnsaved\":\"저장되지 않음\",\"visualEditorVisual\":\"시각적\",\"visualEditorSettings\":\"설정\",\"visualEditorResources\":\"리소스\",\"visualEditorRouting\":\"라우팅\",\"visualEditorSubRules\":\"하위 규칙\",\"visualEditorOperations\":\"개 작업\",\"visualEditorReset\":\"덮어쓰기 초기화\",\"visualEditorResetConfirm\":\"이 구독의 모든 시각적 덮어쓰기를 초기화할까요?\",\"visualEditorProxy\":\"프록시\",\"visualEditorGroup\":\"그룹\",\"visualEditorUnnamed\":\"이름 없음\",\"visualEditorDropHint\":\"프록시 또는 Provider를 여기로 드래그하세요\",\"visualEditorResourceEdit\":\"리소스 편집\",\"visualEditorAdvancedJson\":\"고급 필드(JSON)\",\"visualEditorAddField\":\"필드 추가\",\"visualEditorPreview\":\"변경 사항 검토\",\"visualEditorPreviewFailed\":\"미리보기를 준비하지 못했습니다\",\"visualEditorApply\":\"검증 후 적용\",\"visualEditorActivate\":\"검증 후 활성화\",\"visualEditorApplied\":\"설정이 적용되었습니다\",\"visualEditorApplyFailed\":\"설정을 적용하지 못했습니다\",\"visualEditorLeaveConfirm\":\"저장되지 않은 변경 사항을 버릴까요?\",\"visualEditorConflicts\":\"구독 충돌\",\"visualEditorKeepLocal\":\"로컬 덮어쓰기 유지\",\"visualEditorAcceptUpstream\":\"구독 값 사용\",\"visualEditorManualMerge\":\"YAML에서 병합\",\"visualEditorDiagnostics\":\"설정 진단\",\"visualEditorManaged\":\"관리됨\",\"quality\":\"품질\",\"sortDefault\":\"기본\"}");

const locale_fr_46json_66bdb728 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"Une nouvelle version est disponible\",\"pwaUpdateReload\":\"Recharger\",\"lastHour\":\"Dernière heure\",\"lastDay\":\"Dernier jour\",\"lastWeek\":\"Dernière semaine\",\"lastMonth\":\"Dernier mois\",\"customRange\":\"Plage personnalisée\",\"forever\":\"Toujours\",\"dataRetention\":\"Conservation des données\",\"noDetailedData\":\"Aucune donnée détaillée disponible.\",\"home\":\"Accueil\",\"add\":\"Ajouter\",\"collapse\":\"Réduire\",\"collapseAll\":\"Tout réduire\",\"expandAll\":\"Tout développer\",\"setup\":\"Configuration\",\"setupDescription\":\"Connectez-vous à votre backend Mihomo pour commencer\",\"overview\":\"Aperçu\",\"proxies\":\"Proxies\",\"proxiesSettings\":\"Paramètres des proxies\",\"backToTop\":\"Retour en haut\",\"rules\":\"Règles\",\"connections\":\"Connexions\",\"connectionsSettings\":\"Paramètres des connexions\",\"connectionsDetails\":\"Détails des connexions\",\"logs\":\"Journaux\",\"logsSettings\":\"Paramètres des journaux\",\"config\":\"Configuration\",\"controlCenter\":\"Centre de contrôle\",\"controlCenterDesc\":\"Gérez le noyau intégré et l'intégration système\",\"controlCenterKernel\":\"Noyau\",\"controlCenterSystem\":\"Intégration système\",\"controlCenterConfig\":\"Configuration\",\"controlCenterBackup\":\"Sauvegarde\",\"controlCenterDesktop\":\"Bureau\",\"desktopBehavior\":\"Comportement du bureau\",\"desktopSilentUpdateCheck\":\"Vérifier automatiquement les mises à jour\",\"desktopSilentUpdateCheckDesc\":\"Notifie lorsqu'une nouvelle version est disponible (aucune installation automatique)\",\"desktopTunAutoRestore\":\"Restaurer le mode TUN au démarrage\",\"desktopTunAutoRestoreDesc\":\"Réactive le TUN au démarrage si la dernière session l'utilisait et que l'assistant est installé\",\"desktopShowTraySpeed\":\"Afficher le débit dans la barre\",\"desktopShowTraySpeedDesc\":\"Débit montant/descendant en temps réel dans la barre de menus / l'infobulle\",\"desktopHotkeys\":\"Raccourcis globaux\",\"desktopHotkeysDesc\":\"Raccourcis système actifs même lorsque la fenêtre est fermée\",\"desktopHotkeyToggleSystemProxy\":\"Basculer le proxy système\",\"desktopHotkeyCycleProxyMode\":\"Changer de mode proxy\",\"desktopHotkeyToggleWindow\":\"Afficher / masquer la fenêtre\",\"desktopHotkeyPressKeys\":\"Appuyez sur les touches…\",\"desktopHotkeyDisabled\":\"Non défini\",\"desktopHotkeyConflict\":\"Échec de l'enregistrement\",\"desktopHotkeyRecordHint\":\"Appuyez sur une combinaison avec un modificateur. Retour arrière efface, Échap annule.\",\"desktopHotkeySave\":\"Enregistrer\",\"desktopHotkeyReset\":\"Rétablir les valeurs par défaut\",\"upload\":\"Envoi\",\"download\":\"Téléchargement\",\"uploadTotal\":\"Total envoyé\",\"downloadTotal\":\"Total téléchargé\",\"activeConnections\":\"Connexions actives\",\"memoryUsage\":\"Utilisation mémoire\",\"flow\":\"Flux\",\"traffic\":\"Trafic\",\"memory\":\"Mémoire\",\"down\":\"Réception\",\"up\":\"Envoi\",\"proxyProviders\":\"Fournisseurs de proxy\",\"ruleProviders\":\"Fournisseurs de règles\",\"search\":\"Rechercher\",\"inner\":\"Interne\",\"ID\":\"ID\",\"type\":\"Type\",\"name\":\"Nom\",\"process\":\"Processus\",\"host\":\"Hôte\",\"hostProcess\":\"Hôte / Processus\",\"sniffHost\":\"Hôte détecté\",\"chains\":\"Chaînes\",\"ruleChains\":\"Règle / Chaînes\",\"flowDirection\":\"Flux\",\"connectTime\":\"Heure\",\"dlSpeed\":\"Vitesse DL\",\"ulSpeed\":\"Vitesse UL\",\"dl\":\"DL\",\"ul\":\"UL\",\"sourceIP\":\"IP source\",\"sourcePort\":\"Port source\",\"destination\":\"Destination\",\"inboundUser\":\"Utilisateur entrant\",\"user\":\"Utilisateur\",\"close\":\"Fermer\",\"pause\":\"Pause\",\"resume\":\"Reprendre\",\"reset\":\"Réinitialiser\",\"resetSettings\":\"Réinitialiser les paramètres\",\"dnsQuery\":\"Requête DNS\",\"save\":\"Enregistrer\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"Certains champs DNS peuvent être appliqués à chaud. D'autres (comme la liste des serveurs de noms) nécessitent un rechargement du noyau — modifiez-les dans l'éditeur de configuration pour un contrôle complet.\",\"dnsEnhancedMode\":\"Mode amélioré\",\"dnsNameserver\":\"Serveur de noms\",\"dnsNameserverPlaceholder\":\"Un serveur par ligne\",\"dnsFallback\":\"Repli\",\"dnsFallbackPlaceholder\":\"Un serveur par ligne\",\"dnsFakeIpRange\":\"Plage Fake IP\",\"dnsUseHosts\":\"Utiliser Hosts\",\"dnsSettingsSaved\":\"Paramètres DNS enregistrés\",\"dnsSettingsSaveFailed\":\"Échec de l'enregistrement des paramètres DNS\",\"dots\":\"Points\",\"bar\":\"Barre\",\"auto\":\"Auto\",\"off\":\"Désactivé\",\"proxiesPreviewType\":\"Type d'aperçu des proxies\",\"proxiesPreviewAutoThreshold\":\"Seuil de bascule automatique\",\"cardMode\":\"Carte\",\"listMode\":\"Liste\",\"displayMode\":\"Mode d'affichage\",\"tableMode\":\"Tableau\",\"masterDetailMode\":\"Maître-détail\",\"none\":\"Aucun\",\"urlForLatencyTest\":\"URL pour le test de latence\",\"latencyTestUrlSource\":\"Source de l'URL du test de latence\",\"latencyTestUrlSourceCore\":\"Cœur (URL par groupe)\",\"latencyTestUrlSourceDashboard\":\"Tableau de bord (URL unique)\",\"autoCloseConns\":\"Fermer automatiquement les connexions\",\"autoSwitchEndpoint\":\"Changer automatiquement de point de terminaison\",\"autoSwitchTheme\":\"Changer automatiquement de thème\",\"defaultPage\":\"Page par défaut\",\"favDayTheme\":\"Thème de jour favori\",\"favNightTheme\":\"Thème sombre favori\",\"renderInTwoColumns\":\"Afficher en deux colonnes\",\"proxiesCardSize\":\"Taille de carte de nœud\",\"cardSizeComfortable\":\"Confortable\",\"cardSizeCompact\":\"Compact\",\"cardSizeTight\":\"Serré\",\"stickyGroupHeader\":\"En-tête de groupe fixe\",\"updateGEODatabases\":\"Mettre à jour les bases GEO\",\"restartCore\":\"Redémarrer le noyau\",\"reloadConfigSuccess\":\"Configuration rechargée\",\"restartCoreConfirm\":\"Redémarrer le noyau ? Toutes les connexions actives seront interrompues.\",\"upgradeCore\":\"Mettre à niveau le noyau\",\"upgradeUI\":\"Mettre à niveau le tableau de bord\",\"upgradeUIConfirm\":\"Mettre à niveau le tableau de bord ? Cela télécharge et remplace les fichiers actuels du tableau de bord web.\",\"upgradeCoreConfirm\":\"Mettre à niveau le noyau ? Cela télécharge une nouvelle version et redémarre le noyau, interrompant toutes les connexions.\",\"proxiesSorting\":\"Tri des proxies\",\"orderNatural\":\"Ordre d'origine dans le fichier de configuration\",\"orderLatency_asc\":\"Par latence croissante\",\"orderLatency_desc\":\"Par latence décroissante\",\"orderQuality_asc\":\"Par qualité croissante\",\"orderQuality_desc\":\"Par qualité décroissante\",\"orderName_asc\":\"Par nom alphabétique (A-Z)\",\"orderName_desc\":\"Par nom alphabétique (Z-A)\",\"orderRuleType_asc\":\"Par type de règle (A-Z)\",\"orderRuleType_desc\":\"Par type de règle (Z-A)\",\"orderHitCount_desc\":\"Les plus correspondants d'abord\",\"orderHitCount_asc\":\"Les moins correspondants d'abord\",\"orderHitAt_desc\":\"Correspondance récente d'abord\",\"ms\":\"ms\",\"updated\":\"Mis à jour\",\"tableSize\":\"Taille du tableau\",\"logLevel\":\"Niveau de journal\",\"info\":\"info\",\"silent\":\"silent\",\"debug\":\"debug\",\"warning\":\"warning\",\"error\":\"error\",\"logMaxRows\":\"Nombre maximal de lignes de journal conservées\",\"xs\":\"Taille très petite\",\"sm\":\"Petite taille\",\"md\":\"Taille normale\",\"lg\":\"Grande taille\",\"switchEndpoint\":\"Changer de point de terminaison\",\"switchLanguage\":\"Changer de langue\",\"switchFont\":\"Changer de police\",\"enableTwemoji\":\"Activer Twemoji\",\"enableDataUsageTracking\":\"Suivre l'utilisation des données\",\"enableDataUsageTrackingDesc\":\"Enregistre le trafic par connexion pour la page d'utilisation des données. S'exécute sur chaque page ; désactivez pour réduire l'utilisation du CPU.\",\"latencyTestTimeoutDuration\":\"Délai d'expiration du test de latence\",\"latencyMediumThreshold\":\"Seuil jaune de latence\",\"latencyHighThreshold\":\"Seuil rouge de latence\",\"thresholdAutoPlaceholder\":\"0 = auto (utiliser les valeurs par défaut)\",\"all\":\"Tout\",\"sequence\":\"Séquence\",\"level\":\"Niveau\",\"payload\":\"Charge utile\",\"details\":\"Détails\",\"endpointURL\":\"URL du point de terminaison\",\"secret\":\"Secret\",\"statusConnecting\":\"Connexion…\",\"statusProbing\":\"Détection du backend par défaut…\",\"statusUnreachable\":\"Aucun backend détecté\",\"statusError\":\"Backend injoignable\",\"statusAuthError\":\"Secret rejeté\",\"statusBlocked\":\"Connexion bloquée\",\"statusIdle\":\"Saisissez votre backend Mihomo\",\"secretHint\":\"Laissez vide si votre backend n'a pas de secret\",\"connect\":\"Se connecter\",\"connectPrompt\":\"Connectez-vous à votre backend Mihomo pour commencer.\",\"runningMode\":\"Mode d'exécution\",\"modeSwitchFailed\":\"Échec du changement de mode\",\"global\":\"Global\",\"rule\":\"Règle\",\"direct\":\"Direct\",\"reject\":\"Rejeter\",\"rejectdrop\":\"Abandonner\",\"selector\":\"Sélecteur\",\"urltest\":\"Test d'URL\",\"smart\":\"Sélection intelligente\",\"loadbalance\":\"Équilibrage\",\"fallback\":\"Repli\",\"relay\":\"Relais\",\"pass\":\"Passer\",\"active\":\"Actif\",\"closed\":\"Fermé\",\"sort\":\"Trier\",\"hideUnavailableProxies\":\"Masquer les proxies indisponibles\",\"reloadConfig\":\"Recharger la configuration\",\"flushFakeIP\":\"Vider Fake-IP\",\"flushDNSCache\":\"Vider le cache DNS\",\"tagClientSourceIPWithName\":\"Étiqueter l'IP source du client avec un nom\",\"resolveClientHostname\":\"Résoudre les noms d'hôte (DNS inversé)\",\"resolveClientHostnameDesc\":\"Afficher les noms d'appareils des clients LAN et les noms des destinations en IP brute via le DNS inversé. Nécessite que le DNS de mihomo résolve les zones inversées concernées.\",\"tag\":\"Étiquette\",\"coreConfig\":\"Configuration du noyau\",\"xdConfig\":\"Configuration XD\",\"version\":\"Version\",\"expire\":\"Expiration\",\"noExpire\":\"Aucune\",\"allowLan\":\"Autoriser le LAN\",\"enableTunDevice\":\"Activer le périphérique TUN\",\"tunModeStack\":\"Pile de mode TUN\",\"tunDeviceName\":\"Nom du périphérique TUN\",\"tunLoadFailed\":\"Échec du chargement de l'état TUN\",\"tunEnableSuccess\":\"Mode TUN activé\",\"tunEnableFailed\":\"Échec de l'activation du mode TUN\",\"tunDisableSuccess\":\"Mode TUN désactivé — réseau restauré\",\"tunDisableFailed\":\"Échec de la désactivation du mode TUN\",\"tunRecoverNetwork\":\"Restaurer le réseau\",\"tunInstallNote\":\"L'activation de TUN installe un assistant privilégié et demande une autorisation administrateur. Une version non signée affichera un avertissement « éditeur inconnu » — c'est normal.\",\"tunNeedsProfile\":\"Importez un abonnement avant d'activer le mode TUN.\",\"tunStatusLabel\":\"État\",\"tunStatusActive\":\"TUN actif\",\"tunStatusSidecar\":\"Sidecar (réseau système non affecté)\",\"tunUninstallHelper\":\"Désinstaller le service d'assistance\",\"tunUninstallSuccess\":\"Service d'assistance désinstallé\",\"tunUninstallFailed\":\"Échec de la désinstallation du service d'assistance\",\"tunUninstallConfirm\":\"Désinstaller le service d'assistance privilégié ? Vous devrez à nouveau accorder l'élévation lors de la prochaine activation de TUN.\",\"outboundInterfaceName\":\"Nom de l'interface sortante\",\"port\":\"Port {name}\",\"quickFilter\":\"Filtre rapide\",\"iconHeight\":\"Hauteur de l'icône\",\"iconMarginRight\":\"Marge droite de l'icône\",\"dataUsage\":\"Utilisation des données\",\"clearAll\":\"Tout effacer\",\"confirmClearAll\":\"Effacer toute l'utilisation des données ?\",\"devices\":\"Appareils\",\"timeRange\":\"Plage horaire\",\"grandTotal\":\"Total général\",\"macAddress\":\"Adresse MAC\",\"ipAddress\":\"Adresse IP\",\"duration\":\"Durée\",\"total\":\"Total\",\"actions\":\"Actions\",\"remove\":\"Supprimer\",\"noDataUsageYet\":\"Aucune utilisation de données enregistrée pour le moment\",\"noData\":\"Aucune donnée\",\"noRules\":\"Aucune règle\",\"noRuleProviders\":\"Aucun fournisseur de règles\",\"disabled\":\"Désactivé\",\"enabled\":\"Activé\",\"status\":\"Statut\",\"noMatchingRules\":\"Aucune règle ne correspond à vos filtres\",\"clearFilters\":\"Effacer les filtres\",\"ruleMatched\":\"Correspondant\",\"ruleUnmatched\":\"Non correspondant\",\"lastMatchedAt\":\"Dernière correspondance\",\"lastUnmatchedAt\":\"Dernière non-correspondance\",\"columns\":\"Colonnes\",\"sortBy\":\"Trier par\",\"sortOverriddenBySearch\":\"Trié par pertinence de recherche pendant la recherche\",\"groupBy\":\"Grouper par\",\"rowsPerPage\":\"Lignes par page\",\"ipShort\":\"IP\",\"na\":\"N/D\",\"show\":\"Afficher\",\"noLatencyHistory\":\"Aucun historique de latence\",\"testLatency\":\"Tester la latence\",\"unfixProxy\":\"Restaurer la sélection automatique\",\"dataUsageInfo\":\"La surveillance de l'utilisation des données est effectuée côté client (navigateur). Lorsque le navigateur est fermé, la surveillance ne s'exécutera probablement pas.\",\"basic\":\"Basique\",\"start\":\"Démarrer\",\"rulePayload\":\"Charge utile de règle\",\"metadata\":\"Métadonnées\",\"network\":\"Réseau\",\"dnsMode\":\"Mode DNS\",\"sourceAndDestination\":\"Source et destination\",\"source\":\"Source\",\"remoteDestination\":\"Destination distante\",\"inbound\":\"Entrant\",\"inboundName\":\"Nom entrant\",\"inboundIP\":\"IP entrante\",\"processName\":\"Nom du processus\",\"processPath\":\"Chemin du processus\",\"special\":\"Spécial\",\"specialProxy\":\"Proxy spécial\",\"specialRules\":\"Règles spéciales\",\"connectionsChart\":\"Connexions\",\"networkTypes\":\"Types de réseau\",\"topProxies\":\"Meilleurs proxies\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"Latence\",\"other\":\"Autre\",\"showTrafficIndicator\":\"Afficher l'indicateur de trafic\",\"hideTrafficIndicator\":\"Masquer l'indicateur de trafic\",\"currentIP\":\"IP actuelle\",\"country\":\"Pays\",\"city\":\"Ville\",\"organization\":\"Organisation\",\"proxyDetection\":\"Détection de proxy\",\"clean\":\"Propre\",\"networkLatency\":\"Latence réseau\",\"average\":\"Moyenne\",\"timeout\":\"Délai d'expiration\",\"networkTopology\":\"Topologie réseau\",\"client\":\"Client\",\"destinations\":\"Destinations\",\"waitingForConnections\":\"En attente de connexions...\",\"conn\":\"conn\",\"more\":\"Plus\",\"connectedTo\":\"Connecté à\",\"clients\":\"Clients\",\"groups\":\"Groupes\",\"nodes\":\"Nœuds\",\"proxyGroups\":\"Groupes de proxy\",\"proxyNodes\":\"Nœuds de proxy\",\"ruleType\":\"Type de règle\",\"useMobileBottomNav\":\"Utiliser la navigation en bas (mobile)\",\"fetchRemoteConfig\":\"Récupérer la configuration distante\",\"remoteConfigURL\":\"URL de configuration distante\",\"remoteConfigURLPlaceholder\":\"Entrez l'URL du fichier de configuration\",\"shortcuts\":{\"title\":\"Raccourcis clavier\",\"category\":{\"navigation\":\"Navigation\",\"actions\":\"Actions\"},\"goToOverview\":\"Aller à l'aperçu\",\"goToProxies\":\"Aller aux proxies\",\"goToConnections\":\"Aller aux connexions\",\"goToRules\":\"Aller aux règles\",\"goToLogs\":\"Aller aux journaux\",\"goToConfig\":\"Aller à la configuration\",\"refresh\":\"Actualiser\",\"closeModal\":\"Fermer la fenêtre\",\"showHelp\":\"Afficher l'aide\",\"pressKey\":\"Appuyez sur une touche...\",\"pressEscToClose\":\"Appuyez sur Échap pour fermer\",\"customized\":\"personnalisé\",\"conflictWith\":\"En conflit avec\",\"forceApply\":\"Appliquer quand même\",\"resetToDefaults\":\"Réinitialiser aux valeurs par défaut\"},\"connectionError\":\"Backend injoignable\",\"connectionErrorDesc\":\"Impossible de se connecter au backend. Veuillez vérifier que le backend est en cours d'exécution ou changer de point de terminaison.\",\"retry\":\"Réessayer\",\"recommendation\":{\"title\":\"Recommandation intelligente\",\"recommended\":\"Recommandé\",\"testAll\":\"Tout tester\",\"testAllGroups\":\"Tester tous les groupes\",\"switchToRecommended\":\"Basculer vers le recommandé\",\"testing\":\"Test en cours\",\"score\":\"Score\",\"latencyWeight\":\"Poids de la latence\",\"stabilityWeight\":\"Poids de la stabilité\",\"successRateWeight\":\"Poids du taux de réussite\",\"autoSwitch\":\"Basculer automatiquement vers le recommandé\",\"autoSwitchDesc\":\"Basculer automatiquement vers le nœud recommandé après le test\",\"minTestInterval\":\"Intervalle de test minimum (min)\",\"excludedNodes\":\"Nœuds exclus\",\"clearHistory\":\"Effacer l'historique\",\"noScoreYet\":\"Pas encore de score\"},\"themeColorTooltip\":\"Ordre des couleurs : Arrière-plan, Accent, Texte\",\"mixedContentError\":\"Connexion impossible : cette page est chargée via HTTPS mais l'URL du backend est en HTTP. Les navigateurs bloquent cela pour des raisons de sécurité. Veuillez accéder au panneau directement via votre backend (par ex. http://127.0.0.1:9090/ui) ou déployer le panneau via HTTP.\",\"endpointConnectError\":\"Échec de la connexion au backend. Veuillez vérifier l'URL et vous assurer que le backend est en cours d'exécution.\",\"filterNodesByName\":\"Filtrer les nœuds par nom\",\"jumpToCurrent\":\"Aller à l'actuel\",\"regionOther\":\"Autre\",\"clear\":\"Effacer\",\"copy\":\"Copier\",\"copyValue\":\"Copier la valeur\",\"geoLocation\":\"Emplacement\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"Points de terminaison enregistrés\",\"unifiedDelay\":\"Délai unifié\",\"appearance\":\"Apparence\",\"fontFamily\":\"Police\",\"backgroundImage\":\"Arrière-plan\",\"backgroundCustomImage\":\"Image personnalisée\",\"backgroundImageUrlOption\":\"URL de l'image\",\"uploadImage\":\"Téléverser une image\",\"backgroundImageUrlPlaceholder\":\"Entrez une URL d'image (par ex. un fond d'écran quotidien Bing)\",\"backgroundBlur\":\"Flou d'arrière-plan\",\"backgroundOverlayOpacity\":\"Opacité de la superposition\",\"customThemeColors\":\"Couleurs de thème personnalisées\",\"customThemeColorsDesc\":\"Remplacer les jetons de couleur du thème\",\"customCss\":\"CSS personnalisé\",\"customCssDesc\":\"Avancé : injectez votre propre CSS pour restyliser le tableau de bord\",\"customCssPlaceholder\":\"/* ex. .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"Sauvegarde des paramètres\",\"exportSettings\":\"Exporter\",\"importSettings\":\"Importer\",\"kernelControl\":\"Contrôle du noyau\",\"kernelStatus\":\"Statut\",\"kernelVersion\":\"Version\",\"kernelUptime\":\"Temps de fonctionnement\",\"kernelPid\":\"PID\",\"kernelStart\":\"Démarrer\",\"kernelStop\":\"Arrêter\",\"kernelRestart\":\"Redémarrer\",\"kernelRollback\":\"Revenir à la config\",\"kernelRecover\":\"Réinitialiser (minimale)\",\"kernelRollbackConfirm\":\"Restaurer la dernière configuration connue et redémarrer le noyau ?\",\"kernelRecoverConfirm\":\"Réinitialiser la configuration active à une configuration minimale et redémarrer ? Réimportez un profil ensuite.\",\"kernelRollbackApplied\":\"Revenu à la configuration précédente\",\"kernelRecoverApplied\":\"Réinitialisé à une configuration minimale\",\"kernelRollbackFailed\":\"Échec du rollback\",\"kernelRecoverFailed\":\"Échec de la récupération\",\"kernelLogs\":\"Journaux du noyau\",\"kernelLogsConnected\":\"Diffusion en cours\",\"kernelLogsDisconnected\":\"Déconnecté\",\"kernelLogsClear\":\"Effacer\",\"systemProxy\":\"Proxy système\",\"systemProxyEnable\":\"Activer le proxy système\",\"systemProxyDescription\":\"Acheminer le trafic système via le proxy géré sur le port {port}.\",\"systemProxyBypass\":\"Contournement / Liste blanche LAN\",\"systemProxyBypassPlaceholder\":\"Un hôte ou CIDR par ligne, par ex. localhost\",\"systemProxyApply\":\"Appliquer\",\"systemProxyLoadFailed\":\"Échec du chargement de l'état du proxy système\",\"systemProxyApplyFailed\":\"Échec de l'application des paramètres du proxy système\",\"systemProxyApplied\":\"Paramètres du proxy système appliqués\",\"kernelVersionManager\":\"Version du noyau\",\"kernelVersionCurrent\":\"Actuelle\",\"kernelVersionBundled\":\"Intégrée\",\"kernelVersionSelect\":\"Basculer vers la version\",\"kernelVersionActive\":\"active\",\"kernelVersionSwitch\":\"Basculer et redémarrer\",\"kernelVersionSwitched\":\"Basculé vers {version}\",\"kernelVersionSwitchFailed\":\"Échec du changement de version du noyau\",\"kernelVersionLoadFailed\":\"Échec du chargement des versions du noyau\",\"geoAssets\":\"Bases de données GEO\",\"geoAssetsDescription\":\"Téléchargez les dernières bases de données geoip / geosite / mmdb utilisées pour les règles de routage.\",\"geoUpdate\":\"Mettre à jour les bases GEO\",\"geoUpdateSuccess\":\"Bases de données GEO mises à jour\",\"geoUpdateFailed\":\"Échec de la mise à jour des bases GEO\",\"webdavBackup\":\"Sauvegarde WebDAV\",\"webdavBackupDescription\":\"Sauvegardez vos profils et paramètres du tableau de bord sur un serveur WebDAV et restaurez-les sur un autre appareil.\",\"webdavUrl\":\"URL du serveur\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"Nom d'utilisateur\",\"webdavPassword\":\"Mot de passe\",\"webdavDir\":\"Répertoire\",\"webdavDirPlaceholder\":\"metacubexd (facultatif)\",\"webdavBackupNow\":\"Sauvegarder maintenant\",\"webdavRestore\":\"Restaurer\",\"webdavBackupSuccess\":\"Sauvegarde téléversée sur WebDAV\",\"webdavBackupFailed\":\"Échec de la sauvegarde WebDAV\",\"webdavRestoreSuccess\":\"Restauré depuis WebDAV\",\"webdavRestoreCount\":\"{count} profils restaurés\",\"webdavRestoreFailed\":\"Échec de la restauration WebDAV\",\"runtimeConfig\":\"Configuration d'exécution\",\"runtimeConfigDescription\":\"Vue en lecture seule du fichier de configuration réel avec lequel le noyau s'exécute (il contient les external-controller, secret et mixed-port injectés).\",\"runtimeConfigEmpty\":\"Aucune configuration d'exécution disponible pour le moment.\",\"runtimeConfigLoadFailed\":\"Échec du chargement de la configuration d'exécution\",\"export\":\"Exporter\",\"exportCSV\":\"Exporter en CSV\",\"exportJSON\":\"Exporter en JSON\",\"healthCheckAllProviders\":\"Vérifier l'état de tous les fournisseurs\",\"providerHealthCheckSuccess\":\"État de tous les fournisseurs vérifié\",\"providerHealthCheckFailed\":\"Échec de la vérification de l'état de certains fournisseurs\",\"connectivityBoard\":\"Tableau de connectivité\",\"connectivityTargets\":\"Connectivité\",\"streamingUnlockTargets\":\"Streaming / IA\",\"reachabilityNode\":\"Nœud ou groupe\",\"reachabilityNoNodes\":\"Aucun nœud disponible\",\"reachabilityRunTest\":\"Lancer le test\",\"reachabilityResults\":\"Résultats de connectivité\",\"reachabilityUnreachable\":\"Injoignable\",\"reachabilityUnlockLimitation\":\"Il sagit de la joignabilité du proxy (basée sur le test de latence), et non dune détection complète de déblocage régional. Le déblocage au niveau régional nécessite linspection du corps de la réponse, hors de portée ici.\",\"reachabilityHint\":\"Choisissez un nœud ou un groupe, puis lancez le test pour sonder chaque cible à travers lui.\",\"reachabilityAllUnreachable\":\"Toutes les cibles sont injoignables via {node}\",\"profiles\":\"Profils\",\"profilesNew\":\"Nouveau profil\",\"profilesImport\":\"Importer depuis une URL\",\"profilesDuplicate\":\"Dupliquer\",\"profilesDelete\":\"Supprimer\",\"profilesEdit\":\"Modifier\",\"profilesActivate\":\"Activer\",\"profilesValidate\":\"Valider\",\"profilesActive\":\"Actif\",\"profilesName\":\"Nom\",\"profilesUrl\":\"URL d'abonnement\",\"profilesSave\":\"Enregistrer\",\"profilesCancel\":\"Annuler\",\"profilesValidationOk\":\"La configuration est valide\",\"profilesEmpty\":\"Aucun profil pour le moment\",\"profilesMerges\":\"Superpositions de fusion\",\"profilesMergesHelp\":\"Les superpositions de fusion sont des fragments YAML composés sur le profil de base actif. Activez ceux que vous souhaitez superposer.\",\"profilesNewMerge\":\"Nouvelle superposition de fusion\",\"profilesMergeEnabled\":\"Activé\",\"profilesMergeNoActiveBase\":\"Activez un profil de base pour appliquer les superpositions de fusion.\",\"profilesMergeUpdateFailed\":\"Échec de la mise à jour de la superposition de fusion\",\"profilesScripts\":\"Transformations par script\",\"profilesScriptsHelp\":\"Un script reçoit l'objet de configuration et renvoie la configuration modifiée. Les scripts s'exécutent après les fusions lors de la composition. Activez ceux que vous souhaitez appliquer.\",\"profilesScriptsSafety\":\"Sécurité : les scripts s'exécutent avec un accès étendu — n'exécutez que des scripts de confiance. Modifier ou activer un script réactive la base active pour recalculer.\",\"profilesNewScript\":\"Nouveau script\",\"profilesScriptEnabled\":\"Activé\",\"profilesScriptUpdateFailed\":\"Échec de la mise à jour de la transformation par script\",\"profilesShare\":\"Partager le QR\",\"profilesShareTitle\":\"Partager l'abonnement\",\"profilesShareUrl\":\"URL d'abonnement\",\"profilesShareCopy\":\"Copier l'URL\",\"profilesShareCopied\":\"URL d'abonnement copiée\",\"editorReadOnly\":\"Lecture seule\",\"editorDisableValidation\":\"Désactiver la validation\",\"editRules\":\"Modifier les règles\",\"editProxies\":\"Modifier les proxys et groupes\",\"edit\":\"Modifier\",\"moveUp\":\"Monter\",\"moveDown\":\"Descendre\",\"proxyConfigEditorTitle\":\"Modifier les proxys et groupes\",\"proxyConfigEditorHint\":\"Modifiez les proxys locaux et les groupes du profil actif. Les définitions Proxy Provider restent gérées dans l’éditeur de profil complet. L’enregistrement valide toute la configuration et redémarre le noyau une seule fois.\",\"proxyConfigSaved\":\"Configuration des proxys enregistrée\",\"proxyConfigLoadFailed\":\"Échec du chargement de la configuration des proxys\",\"proxyConfigSaveFailed\":\"Échec de l’enregistrement de la configuration des proxys\",\"routingEditorNoActiveProfile\":\"Aucun profil actif ne peut être modifié. Importez ou activez d’abord un profil.\",\"routingEditorConflict\":\"L’abonnement contient des conflits non résolus\",\"routingEditorConflictHint\":\"Résolvez les conflits dans l’éditeur de profil complet avant de modifier cette page.\",\"routingEditorResolveConflict\":\"Ouvrir l’éditeur de profil complet\",\"routingEditorDiscardConfirm\":\"Ignorer les modifications de configuration non enregistrées ?\",\"routingEditorRulePlaceholder\":\"Saisissez la règle Mihomo complète, par exemple DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"Cette ressource est encore référencée et ne peut pas être supprimée\",\"routingEditorNodes\":\"Proxys locaux\",\"routingEditorMembers\":\"membres\",\"routingEditorNameLocked\":\"Le nom d’une ressource existante est verrouillé afin de préserver les références.\",\"routingEditorNameTypeRequired\":\"Le nom et le type sont obligatoires.\",\"routingEditorDuplicateName\":\"Un proxy ou groupe nommé « {name} » existe déjà.\",\"routingEditorJsonObjectRequired\":\"Le JSON avancé doit être un objet.\",\"routingEditorSelectMember\":\"Sélectionner un proxy ou un groupe\",\"routingEditorSelectProvider\":\"Sélectionner un Proxy Provider\",\"rulesEditorHint\":\"Ajoutez, modifiez, supprimez ou glissez pour réordonner les règles. L'enregistrement redémarre le noyau une fois.\",\"policy\":\"Politique\",\"reorder\":\"Glisser pour réordonner\",\"delete\":\"Supprimer\",\"cancel\":\"Annuler\",\"rulesEditorSaved\":\"Règles enregistrées\",\"rulesEditorLoadFailed\":\"Échec du chargement des règles\",\"rulesEditorSaveFailed\":\"Échec de l'enregistrement des règles\",\"rulesEditorInvalid\":\"Chaque règle nécessite un type, une charge utile et une politique non vides\",\"networkConfig\":\"Configuration réseau\",\"networkConfigHint\":\"Modifiez les sections réseau du profil actif. L'enregistrement redémarre le noyau une fois.\",\"networkConfigSaved\":\"Configuration réseau enregistrée\",\"networkConfigLoadFailed\":\"Échec du chargement de la configuration réseau\",\"networkConfigSaveFailed\":\"Échec de l'enregistrement de la configuration réseau\",\"tunnels\":\"Tunnels\",\"tunnelsHint\":\"Transférez un écouteur local vers une cible distante via le noyau.\",\"tunnelNetwork\":\"Réseau\",\"tunnelAddress\":\"Adresse d'écoute\",\"tunnelTarget\":\"Cible\",\"noTunnels\":\"Aucun tunnel\",\"sniffer\":\"Renifleur\",\"snifferEnable\":\"Activer le renifleur\",\"snifferOverrideDestination\":\"Remplacer la destination\",\"externalController\":\"Contrôleur externe\",\"externalControllerManaged\":\"Géré par l'application sur le bureau\",\"onboardingWelcomeTitle\":\"Bienvenue dans MetaCubeXD\",\"onboardingWelcomeBody\":\"Collez votre abonnement et obtenez un proxy fonctionnel en moins d'une minute.\",\"onboardingGetStarted\":\"Commencer\",\"onboardingSkip\":\"Ignorer pour l'instant\",\"onboardingImportTitle\":\"Importer votre abonnement\",\"onboardingImportSubtitle\":\"Collez une URL d'abonnement, choisissez un fichier ou collez depuis le presse-papiers.\",\"onboardingImportSuccess\":\"Abonnement importé et activé\",\"onboardingFileTooLarge\":\"Le fichier est trop volumineux\",\"onboardingClipboardEmpty\":\"Le presse-papiers est vide\",\"onboardingClipboardDenied\":\"Accès au presse-papiers refusé\",\"onboardingSystemProxyTitle\":\"Activer le proxy système\",\"onboardingSystemProxyBody\":\"Acheminer toutes les applications de cet appareil via le proxy.\",\"onboardingDoneTitle\":\"Tout est prêt\",\"onboardingDoneBody\":\"Votre abonnement est actif. Choisissez un nœud pour commencer à naviguer.\",\"onboardingGoToProxies\":\"Aller aux proxies\",\"onboardingFinish\":\"Terminer\",\"onboardingBack\":\"Précédent\",\"onboardingNext\":\"Suivant\",\"onboardingStep\":\"Étape {current} sur {total}\",\"onboardingEmptyTitle\":\"Aucun abonnement pour le moment\",\"onboardingEmptyBody\":\"Importez un abonnement pour commencer à utiliser le proxy.\",\"onboardingEmptyImport\":\"Importer un abonnement\",\"onboardingEmptyRunSetup\":\"Relancer la configuration\",\"profilesImportTitle\":\"Importer un abonnement\",\"profilesImportSubtitle\":\"Ajoutez un abonnement par URL, fichier ou presse-papiers.\",\"profilesImportFile\":\"Importer depuis un fichier\",\"profilesImportClipboard\":\"Coller depuis le presse-papiers\",\"profilesImportSuccess\":\"Abonnement importé\",\"profilesImportFailed\":\"Échec de l'importation de l'abonnement\",\"profilesAdvanced\":\"Avancé\",\"profilesRefresh\":\"Actualiser\",\"profilesRefreshAndApply\":\"Actualiser et appliquer\",\"profilesRefreshed\":\"Abonnement actualisé\",\"profilesRefreshFailed\":\"Échec de l'actualisation de l'abonnement\",\"profilesAutoUpdate\":\"Mise à jour auto.\",\"profilesAutoUpdateOff\":\"Désactivé\",\"profilesAutoUpdateMinutes\":\"{n} min\",\"profilesAutoUpdateHours\":\"{n} h\",\"profilesUpdated\":\"Mis à jour {time}\",\"profilesActivated\":\"Profil activé\",\"profilesActionFailed\":\"Échec de l'opération\",\"profilesDeleteConfirm\":\"Supprimer « {name} » ? Cette action est irréversible.\",\"profilesDeleteActiveConfirm\":\"« {name} » est le profil actif. Le supprimer démantèle la configuration en cours. Continuer ?\",\"profilesEditing\":\"Modification de {name}\",\"visualEditor\":\"Éditeur visuel\",\"visualEditorUnavailable\":\"L’éditeur visuel est disponible uniquement avec l’application de bureau ou l’Agent tout-en-un.\",\"visualEditorBack\":\"Retour aux profils\",\"visualEditorUnsaved\":\"Non enregistré\",\"visualEditorVisual\":\"Visuel\",\"visualEditorSettings\":\"Paramètres\",\"visualEditorResources\":\"Ressources\",\"visualEditorRouting\":\"Routage\",\"visualEditorSubRules\":\"Sous-règles\",\"visualEditorOperations\":\"opérations\",\"visualEditorReset\":\"Réinitialiser les remplacements\",\"visualEditorResetConfirm\":\"Réinitialiser tous les remplacements visuels de cet abonnement ?\",\"visualEditorProxy\":\"Proxy\",\"visualEditorGroup\":\"Groupe\",\"visualEditorUnnamed\":\"Sans nom\",\"visualEditorDropHint\":\"Faites glisser des proxys ou des Providers ici\",\"visualEditorResourceEdit\":\"Modifier la ressource\",\"visualEditorAdvancedJson\":\"Champs avancés (JSON)\",\"visualEditorAddField\":\"Ajouter un champ\",\"visualEditorPreview\":\"Vérifier les modifications\",\"visualEditorPreviewFailed\":\"Impossible de préparer l’aperçu\",\"visualEditorApply\":\"Valider et appliquer\",\"visualEditorActivate\":\"Valider et activer\",\"visualEditorApplied\":\"Configuration appliquée\",\"visualEditorApplyFailed\":\"Échec de l’application de la configuration\",\"visualEditorLeaveConfirm\":\"Ignorer les modifications non enregistrées ?\",\"visualEditorConflicts\":\"Conflits d’abonnement\",\"visualEditorKeepLocal\":\"Conserver le remplacement local\",\"visualEditorAcceptUpstream\":\"Accepter la valeur de l’abonnement\",\"visualEditorManualMerge\":\"Fusionner dans YAML\",\"visualEditorDiagnostics\":\"Diagnostic de la configuration\",\"visualEditorManaged\":\"Géré\",\"quality\":\"Qualité\",\"sortDefault\":\"Défaut\"}");

const locale_fa_46json_0dca54b7 = /* @__PURE__ */ JSON.parse("{\"pwaUpdateAvailable\":\"نسخه جدیدی در دسترس است\",\"pwaUpdateReload\":\"بارگذاری مجدد\",\"lastHour\":\"ساعت گذشته\",\"lastDay\":\"روز گذشته\",\"lastWeek\":\"هفته گذشته\",\"lastMonth\":\"ماه گذشته\",\"customRange\":\"بازه سفارشی\",\"forever\":\"همیشه\",\"dataRetention\":\"نگهداری داده\",\"noDetailedData\":\"داده تفصیلی در دسترس نیست.\",\"home\":\"خانه\",\"add\":\"افزودن\",\"collapse\":\"جمع کردن\",\"collapseAll\":\"جمع کردن همه\",\"expandAll\":\"باز کردن همه\",\"setup\":\"راه‌اندازی\",\"setupDescription\":\"برای شروع به بک‌اند Mihomo خود متصل شوید\",\"overview\":\"نمای کلی\",\"proxies\":\"پروکسی‌ها\",\"proxiesSettings\":\"تنظیمات پروکسی‌ها\",\"backToTop\":\"بازگشت به بالا\",\"rules\":\"قوانین\",\"connections\":\"اتصالات\",\"connectionsSettings\":\"تنظیمات اتصالات\",\"connectionsDetails\":\"جزئیات اتصالات\",\"logs\":\"گزارش‌ها\",\"logsSettings\":\"تنظیمات گزارش‌ها\",\"config\":\"پیکربندی\",\"controlCenter\":\"مرکز کنترل\",\"controlCenterDesc\":\"مدیریت هسته همراه و یکپارچگی با میزبان\",\"controlCenterKernel\":\"هسته\",\"controlCenterSystem\":\"یکپارچگی سیستم\",\"controlCenterConfig\":\"پیکربندی\",\"controlCenterBackup\":\"پشتیبان‌گیری\",\"controlCenterDesktop\":\"دسکتاپ\",\"desktopBehavior\":\"رفتار دسکتاپ\",\"desktopSilentUpdateCheck\":\"بررسی خودکار به‌روزرسانی\",\"desktopSilentUpdateCheckDesc\":\"هنگام انتشار نسخه جدید اعلان نمایش داده می‌شود (نصب خودکار انجام نمی‌شود)\",\"desktopTunAutoRestore\":\"بازیابی حالت TUN هنگام راه‌اندازی\",\"desktopTunAutoRestoreDesc\":\"اگر جلسه قبلی در حالت TUN بوده و کمک‌رسان نصب شده باشد، پس از راه‌اندازی خودکار فعال می‌شود\",\"desktopShowTraySpeed\":\"نمایش سرعت در سینی\",\"desktopShowTraySpeedDesc\":\"سرعت لحظه‌ای آپلود/دانلود در نوار منو / راهنمای سینی\",\"desktopHotkeys\":\"کلیدهای میانبر سراسری\",\"desktopHotkeysDesc\":\"میانبرهای سیستمی که حتی با پنجره بسته نیز کار می‌کنند\",\"desktopHotkeyToggleSystemProxy\":\"تغییر وضعیت پراکسی سیستم\",\"desktopHotkeyCycleProxyMode\":\"چرخش حالت پراکسی\",\"desktopHotkeyToggleWindow\":\"نمایش / پنهان کردن پنجره\",\"desktopHotkeyPressKeys\":\"کلیدها را فشار دهید…\",\"desktopHotkeyDisabled\":\"تنظیم نشده\",\"desktopHotkeyConflict\":\"ثبت ناموفق\",\"desktopHotkeyRecordHint\":\"یک ترکیب کلید با کلید تغییردهنده فشار دهید. Backspace پاک می‌کند، Esc لغو می‌کند.\",\"desktopHotkeySave\":\"ذخیره\",\"desktopHotkeyReset\":\"بازگرداندن به پیش‌فرض\",\"upload\":\"آپلود\",\"download\":\"دانلود\",\"uploadTotal\":\"مجموع آپلود\",\"downloadTotal\":\"مجموع دانلود\",\"activeConnections\":\"اتصالات فعال\",\"memoryUsage\":\"مصرف حافظه\",\"flow\":\"جریان\",\"traffic\":\"ترافیک\",\"memory\":\"حافظه\",\"down\":\"دانلود\",\"up\":\"آپلود\",\"proxyProviders\":\"ارائه‌دهندگان پروکسی\",\"ruleProviders\":\"ارائه‌دهندگان قوانین\",\"search\":\"جستجو\",\"inner\":\"داخلی\",\"ID\":\"شناسه\",\"type\":\"نوع\",\"name\":\"نام\",\"process\":\"فرآیند\",\"host\":\"میزبان\",\"hostProcess\":\"میزبان / فرآیند\",\"sniffHost\":\"میزبان شناسایی‌شده\",\"chains\":\"زنجیره‌ها\",\"ruleChains\":\"قانون / زنجیره‌ها\",\"flowDirection\":\"جریان\",\"connectTime\":\"زمان\",\"dlSpeed\":\"سرعت دانلود\",\"ulSpeed\":\"سرعت آپلود\",\"dl\":\"دانلود\",\"ul\":\"آپلود\",\"sourceIP\":\"IP مبدأ\",\"sourcePort\":\"پورت مبدأ\",\"destination\":\"مقصد\",\"inboundUser\":\"کاربر ورودی\",\"user\":\"کاربر\",\"close\":\"بستن\",\"pause\":\"مکث\",\"resume\":\"ازسرگیری\",\"reset\":\"بازنشانی\",\"resetSettings\":\"بازنشانی تنظیمات\",\"dnsQuery\":\"پرس‌وجوی DNS\",\"save\":\"ذخیره\",\"dnsSettings\":\"DNS\",\"dnsSettingsNote\":\"برخی فیلدهای DNS را می‌توان به‌صورت زنده اعمال کرد. سایر موارد (مانند فهرست نام‌سرورها) نیاز به بارگذاری مجدد هسته دارند — برای کنترل کامل آن‌ها را در ویرایشگر پیکربندی ویرایش کنید.\",\"dnsEnhancedMode\":\"حالت پیشرفته\",\"dnsNameserver\":\"نام‌سرور\",\"dnsNameserverPlaceholder\":\"هر سرور در یک خط\",\"dnsFallback\":\"جایگزین\",\"dnsFallbackPlaceholder\":\"هر سرور در یک خط\",\"dnsFakeIpRange\":\"بازه Fake IP\",\"dnsUseHosts\":\"استفاده از Hosts\",\"dnsSettingsSaved\":\"تنظیمات DNS ذخیره شد\",\"dnsSettingsSaveFailed\":\"ذخیره تنظیمات DNS ناموفق بود\",\"dots\":\"نقطه‌ها\",\"bar\":\"میله\",\"auto\":\"خودکار\",\"off\":\"خاموش\",\"proxiesPreviewType\":\"نوع پیش‌نمایش پروکسی‌ها\",\"proxiesPreviewAutoThreshold\":\"آستانه تغییر خودکار\",\"cardMode\":\"کارت\",\"listMode\":\"فهرست\",\"displayMode\":\"حالت نمایش\",\"tableMode\":\"جدول\",\"masterDetailMode\":\"اصلی-جزئیات\",\"none\":\"هیچ‌کدام\",\"urlForLatencyTest\":\"URL برای آزمایش تأخیر\",\"latencyTestUrlSource\":\"منبع URL آزمایش تأخیر\",\"latencyTestUrlSourceCore\":\"هسته (URL هر گروه)\",\"latencyTestUrlSourceDashboard\":\"پنل (URL واحد)\",\"autoCloseConns\":\"بستن خودکار اتصالات\",\"autoSwitchEndpoint\":\"تغییر خودکار نقطه پایانی\",\"autoSwitchTheme\":\"تغییر خودکار پوسته\",\"defaultPage\":\"صفحه پیش‌فرض\",\"favDayTheme\":\"پوسته روز مورد علاقه\",\"favNightTheme\":\"پوسته تیره مورد علاقه\",\"renderInTwoColumns\":\"نمایش در دو ستون\",\"proxiesCardSize\":\"اندازه کارت گره\",\"cardSizeComfortable\":\"راحت\",\"cardSizeCompact\":\"فشرده\",\"cardSizeTight\":\"تنگ\",\"stickyGroupHeader\":\"سربرگ گروه چسبان\",\"updateGEODatabases\":\"به‌روزرسانی پایگاه‌های داده GEO\",\"restartCore\":\"راه‌اندازی مجدد هسته\",\"reloadConfigSuccess\":\"پیکربندی دوباره بارگذاری شد\",\"restartCoreConfirm\":\"هسته دوباره راه‌اندازی شود؟ همه اتصال‌های فعال قطع خواهند شد.\",\"upgradeCore\":\"ارتقای هسته\",\"upgradeUI\":\"ارتقای داشبورد\",\"upgradeUIConfirm\":\"داشبورد ارتقا یابد؟ فایل‌های فعلی داشبورد وب دانلود و جایگزین می‌شوند.\",\"upgradeCoreConfirm\":\"هسته ارتقا یابد؟ نسخه جدیدی دانلود شده و هسته راه‌اندازی مجدد می‌شود و همه اتصالات قطع می‌شوند.\",\"proxiesSorting\":\"مرتب‌سازی پروکسی‌ها\",\"orderNatural\":\"ترتیب اصلی در فایل پیکربندی\",\"orderLatency_asc\":\"بر اساس تأخیر از کم به زیاد\",\"orderLatency_desc\":\"بر اساس تأخیر از زیاد به کم\",\"orderQuality_asc\":\"بر اساس کیفیت از کم به زیاد\",\"orderQuality_desc\":\"بر اساس کیفیت از زیاد به کم\",\"orderName_asc\":\"بر اساس نام الفبایی (A-Z)\",\"orderName_desc\":\"بر اساس نام الفبایی (Z-A)\",\"orderRuleType_asc\":\"بر اساس نوع قانون (A-Z)\",\"orderRuleType_desc\":\"بر اساس نوع قانون (Z-A)\",\"orderHitCount_desc\":\"بیشترین تطابق ابتدا\",\"orderHitCount_asc\":\"کمترین تطابق ابتدا\",\"orderHitAt_desc\":\"تطابق اخیر ابتدا\",\"ms\":\"میلی‌ثانیه\",\"updated\":\"به‌روزشده\",\"tableSize\":\"اندازه جدول\",\"logLevel\":\"سطح گزارش\",\"info\":\"info\",\"silent\":\"silent\",\"debug\":\"debug\",\"warning\":\"warning\",\"error\":\"error\",\"logMaxRows\":\"حداکثر تعداد سطرهای ذخیره‌شده گزارش\",\"xs\":\"اندازه خیلی کوچک\",\"sm\":\"اندازه کوچک\",\"md\":\"اندازه معمولی\",\"lg\":\"اندازه بزرگ\",\"switchEndpoint\":\"تغییر نقطه پایانی\",\"switchLanguage\":\"تغییر زبان\",\"switchFont\":\"تغییر فونت\",\"enableTwemoji\":\"فعال‌سازی Twemoji\",\"enableDataUsageTracking\":\"ردیابی مصرف داده\",\"enableDataUsageTrackingDesc\":\"ترافیک هر اتصال را برای صفحه مصرف داده ثبت می‌کند. روی هر صفحه اجرا می‌شود؛ برای کاهش مصرف CPU آن را خاموش کنید.\",\"latencyTestTimeoutDuration\":\"مدت زمان وقفه آزمایش تأخیر\",\"latencyMediumThreshold\":\"آستانه زرد تأخیر\",\"latencyHighThreshold\":\"آستانه قرمز تأخیر\",\"thresholdAutoPlaceholder\":\"۰ = خودکار (استفاده از پیش‌فرض‌ها)\",\"all\":\"همه\",\"sequence\":\"توالی\",\"level\":\"سطح\",\"payload\":\"بار\",\"details\":\"جزئیات\",\"endpointURL\":\"URL نقطه پایانی\",\"secret\":\"رمز\",\"statusConnecting\":\"در حال اتصال…\",\"statusProbing\":\"در حال بررسی بک‌اند پیش‌فرض…\",\"statusUnreachable\":\"بک‌اندی یافت نشد\",\"statusError\":\"بک‌اند در دسترس نیست\",\"statusAuthError\":\"رمز رد شد\",\"statusBlocked\":\"اتصال مسدود شد\",\"statusIdle\":\"بک‌اند Mihomo خود را وارد کنید\",\"secretHint\":\"اگر بک‌اند شما رمزی ندارد، خالی بگذارید\",\"connect\":\"اتصال\",\"connectPrompt\":\"برای شروع به بک‌اند Mihomo خود متصل شوید.\",\"runningMode\":\"حالت اجرا\",\"modeSwitchFailed\":\"تغییر حالت ناموفق بود\",\"global\":\"سراسری\",\"rule\":\"قانون\",\"direct\":\"مستقیم\",\"reject\":\"رد\",\"rejectdrop\":\"حذف\",\"selector\":\"انتخاب‌گر\",\"urltest\":\"آزمایش URL\",\"smart\":\"انتخاب هوشمند\",\"loadbalance\":\"متوازن‌سازی\",\"fallback\":\"جایگزین\",\"relay\":\"بازپخش\",\"pass\":\"عبور\",\"active\":\"فعال\",\"closed\":\"بسته\",\"sort\":\"مرتب‌سازی\",\"hideUnavailableProxies\":\"پنهان کردن پروکسی‌های در دسترس نبوده\",\"reloadConfig\":\"بارگذاری مجدد پیکربندی\",\"flushFakeIP\":\"پاک‌سازی Fake-IP\",\"flushDNSCache\":\"پاک‌سازی حافظه پنهان DNS\",\"tagClientSourceIPWithName\":\"برچسب‌گذاری IP مبدأ کلاینت با نام\",\"resolveClientHostname\":\"تفکیک نام میزبان (DNS معکوس)\",\"resolveClientHostnameDesc\":\"نمایش نام دستگاه‌های کلاینت‌های LAN و نام مقصدهای با IP خام از طریق DNS معکوس. نیازمند آن است که DNS مربوط به mihomo بتواند زون‌های معکوس مربوطه را تفکیک کند.\",\"tag\":\"برچسب\",\"coreConfig\":\"پیکربندی هسته\",\"xdConfig\":\"پیکربندی XD\",\"version\":\"نسخه\",\"expire\":\"انقضا\",\"noExpire\":\"ندارد\",\"allowLan\":\"اجازه LAN\",\"enableTunDevice\":\"فعال‌سازی دستگاه TUN\",\"tunModeStack\":\"پشته حالت TUN\",\"tunDeviceName\":\"نام دستگاه TUN\",\"tunLoadFailed\":\"بارگذاری وضعیت TUN ناموفق بود\",\"tunEnableSuccess\":\"حالت TUN فعال شد\",\"tunEnableFailed\":\"فعال‌سازی حالت TUN ناموفق بود\",\"tunDisableSuccess\":\"حالت TUN غیرفعال شد — شبکه بازیابی شد\",\"tunDisableFailed\":\"غیرفعال‌سازی حالت TUN ناموفق بود\",\"tunRecoverNetwork\":\"بازیابی شبکه\",\"tunInstallNote\":\"فعال‌سازی TUN یک کمک‌یار با دسترسی ویژه نصب می‌کند و درخواست مجوز مدیر را نمایش می‌دهد. نسخه‌ی امضانشده هشدار «ناشر ناشناس» را نشان می‌دهد — این طبیعی است.\",\"tunNeedsProfile\":\"پیش از فعال‌سازی حالت TUN یک اشتراک وارد کنید.\",\"tunStatusLabel\":\"وضعیت\",\"tunStatusActive\":\"TUN فعال\",\"tunStatusSidecar\":\"Sidecar (شبکه‌ی سیستم تحت تأثیر قرار نمی‌گیرد)\",\"tunUninstallHelper\":\"حذف سرویس کمکی\",\"tunUninstallSuccess\":\"سرویس کمکی حذف شد\",\"tunUninstallFailed\":\"حذف سرویس کمکی ناموفق بود\",\"tunUninstallConfirm\":\"سرویس کمکی ممتاز حذف شود؟ دفعه بعد که TUN را فعال کنید، دوباره از شما درخواست دسترسی می‌شود.\",\"outboundInterfaceName\":\"نام رابط خروجی\",\"port\":\"پورت {name}\",\"quickFilter\":\"فیلتر سریع\",\"iconHeight\":\"ارتفاع آیکون\",\"iconMarginRight\":\"حاشیه راست آیکون\",\"dataUsage\":\"مصرف داده\",\"clearAll\":\"پاک کردن همه\",\"confirmClearAll\":\"تمام مصرف داده پاک شود؟\",\"devices\":\"دستگاه‌ها\",\"timeRange\":\"بازه زمانی\",\"grandTotal\":\"مجموع کل\",\"macAddress\":\"آدرس MAC\",\"ipAddress\":\"آدرس IP\",\"duration\":\"مدت\",\"total\":\"مجموع\",\"actions\":\"اقدامات\",\"remove\":\"حذف\",\"noDataUsageYet\":\"هنوز مصرف داده‌ای ثبت نشده است\",\"noData\":\"داده‌ای نیست\",\"noRules\":\"قانونی نیست\",\"noRuleProviders\":\"ارائه‌دهنده قانونی نیست\",\"disabled\":\"غیرفعال\",\"enabled\":\"فعال\",\"status\":\"وضعیت\",\"noMatchingRules\":\"هیچ قانونی با فیلترهای شما مطابقت ندارد\",\"clearFilters\":\"پاک کردن فیلترها\",\"ruleMatched\":\"مطابق\",\"ruleUnmatched\":\"نامطابق\",\"lastMatchedAt\":\"آخرین تطابق\",\"lastUnmatchedAt\":\"آخرین عدم تطابق\",\"columns\":\"ستون‌ها\",\"sortBy\":\"مرتب‌سازی بر اساس\",\"sortOverriddenBySearch\":\"هنگام جستجو بر اساس ارتباط جستجو مرتب می‌شود\",\"groupBy\":\"گروه‌بندی بر اساس\",\"rowsPerPage\":\"ردیف در هر صفحه\",\"ipShort\":\"IP\",\"na\":\"نامشخص\",\"show\":\"نمایش\",\"noLatencyHistory\":\"تاریخچه تأخیری نیست\",\"testLatency\":\"تست تأخیر\",\"unfixProxy\":\"بازگردانی انتخاب خودکار\",\"dataUsageInfo\":\"نظارت بر مصرف داده در سمت کلاینت (مرورگر) انجام می‌شود. هنگام بسته شدن مرورگر، نظارت احتمالاً اجرا نخواهد شد.\",\"basic\":\"پایه\",\"start\":\"شروع\",\"rulePayload\":\"بار قانون\",\"metadata\":\"فراداده\",\"network\":\"شبکه\",\"dnsMode\":\"حالت DNS\",\"sourceAndDestination\":\"مبدأ و مقصد\",\"source\":\"مبدأ\",\"remoteDestination\":\"مقصد راه دور\",\"inbound\":\"ورودی\",\"inboundName\":\"نام ورودی\",\"inboundIP\":\"IP ورودی\",\"processName\":\"نام فرآیند\",\"processPath\":\"مسیر فرآیند\",\"special\":\"ویژه\",\"specialProxy\":\"پروکسی ویژه\",\"specialRules\":\"قوانین ویژه\",\"connectionsChart\":\"اتصالات\",\"networkTypes\":\"انواع شبکه\",\"topProxies\":\"پروکسی‌های برتر\",\"tcp\":\"TCP\",\"udp\":\"UDP\",\"latency\":\"تأخیر\",\"other\":\"سایر\",\"showTrafficIndicator\":\"نمایش نشانگر ترافیک\",\"hideTrafficIndicator\":\"پنهان کردن نشانگر ترافیک\",\"currentIP\":\"IP فعلی\",\"country\":\"کشور\",\"city\":\"شهر\",\"organization\":\"سازمان\",\"proxyDetection\":\"تشخیص پروکسی\",\"clean\":\"تمیز\",\"networkLatency\":\"تأخیر شبکه\",\"average\":\"میانگین\",\"timeout\":\"وقفه زمانی\",\"networkTopology\":\"توپولوژی شبکه\",\"client\":\"کلاینت\",\"destinations\":\"مقصدها\",\"waitingForConnections\":\"در انتظار اتصالات...\",\"conn\":\"اتصال\",\"more\":\"بیشتر\",\"connectedTo\":\"متصل به\",\"clients\":\"کلاینت‌ها\",\"groups\":\"گروه‌ها\",\"nodes\":\"گره‌ها\",\"proxyGroups\":\"گروه‌های پروکسی\",\"proxyNodes\":\"گره‌های پروکسی\",\"ruleType\":\"نوع قانون\",\"useMobileBottomNav\":\"استفاده از ناوبری پایین (موبایل)\",\"fetchRemoteConfig\":\"دریافت پیکربندی راه دور\",\"remoteConfigURL\":\"URL پیکربندی راه دور\",\"remoteConfigURLPlaceholder\":\"URL فایل پیکربندی را وارد کنید\",\"shortcuts\":{\"title\":\"میانبرهای صفحه‌کلید\",\"category\":{\"navigation\":\"ناوبری\",\"actions\":\"اقدامات\"},\"goToOverview\":\"رفتن به نمای کلی\",\"goToProxies\":\"رفتن به پروکسی‌ها\",\"goToConnections\":\"رفتن به اتصالات\",\"goToRules\":\"رفتن به قوانین\",\"goToLogs\":\"رفتن به گزارش‌ها\",\"goToConfig\":\"رفتن به پیکربندی\",\"refresh\":\"تازه‌سازی\",\"closeModal\":\"بستن پنجره\",\"showHelp\":\"نمایش راهنما\",\"pressKey\":\"یک کلید فشار دهید...\",\"pressEscToClose\":\"برای بستن Esc را فشار دهید\",\"customized\":\"سفارشی‌شده\",\"conflictWith\":\"تداخل با\",\"forceApply\":\"به‌هرحال اعمال شود\",\"resetToDefaults\":\"بازنشانی به پیش‌فرض‌ها\"},\"connectionError\":\"بک‌اند در دسترس نیست\",\"connectionErrorDesc\":\"اتصال به بک‌اند ممکن نیست. لطفاً بررسی کنید که بک‌اند در حال اجراست یا به نقطه پایانی دیگری تغییر دهید.\",\"retry\":\"تلاش مجدد\",\"recommendation\":{\"title\":\"پیشنهاد هوشمند\",\"recommended\":\"پیشنهادشده\",\"testAll\":\"آزمایش همه\",\"testAllGroups\":\"آزمایش همه گروه‌ها\",\"switchToRecommended\":\"تغییر به پیشنهادشده\",\"testing\":\"در حال آزمایش\",\"score\":\"امتیاز\",\"latencyWeight\":\"وزن تأخیر\",\"stabilityWeight\":\"وزن پایداری\",\"successRateWeight\":\"وزن نرخ موفقیت\",\"autoSwitch\":\"تغییر خودکار به پیشنهادشده\",\"autoSwitchDesc\":\"پس از آزمایش به‌طور خودکار به گره پیشنهادشده تغییر دهید\",\"minTestInterval\":\"حداقل فاصله آزمایش (دقیقه)\",\"excludedNodes\":\"گره‌های مستثنا\",\"clearHistory\":\"پاک کردن تاریخچه\",\"noScoreYet\":\"هنوز امتیازی نیست\"},\"themeColorTooltip\":\"ترتیب رنگ: پس‌زمینه، تأکید، متن\",\"mixedContentError\":\"اتصال ممکن نیست: این صفحه از طریق HTTPS بارگذاری شده اما URL بک‌اند HTTP است. مرورگرها این را به دلایل امنیتی مسدود می‌کنند. لطفاً مستقیماً از طریق بک‌اند خود به پنل دسترسی پیدا کنید (مثلاً http://127.0.0.1:9090/ui) یا پنل را روی HTTP مستقر کنید.\",\"endpointConnectError\":\"اتصال به بک‌اند ناموفق بود. لطفاً URL را بررسی کرده و مطمئن شوید بک‌اند در حال اجراست.\",\"filterNodesByName\":\"فیلتر گره‌ها بر اساس نام\",\"jumpToCurrent\":\"رفتن به فعلی\",\"regionOther\":\"سایر\",\"clear\":\"پاک کردن\",\"copy\":\"کپی\",\"copyValue\":\"کپی مقدار\",\"geoLocation\":\"موقعیت\",\"geoASN\":\"ASN\",\"savedEndpoints\":\"نقاط پایانی ذخیره‌شده\",\"unifiedDelay\":\"تأخیر یکپارچه\",\"appearance\":\"ظاهر\",\"fontFamily\":\"فونت\",\"backgroundImage\":\"پس‌زمینه\",\"backgroundCustomImage\":\"تصویر سفارشی\",\"backgroundImageUrlOption\":\"URL تصویر\",\"uploadImage\":\"آپلود تصویر\",\"backgroundImageUrlPlaceholder\":\"یک URL تصویر وارد کنید (مثلاً تصویر زمینه روزانه Bing)\",\"backgroundBlur\":\"محو پس‌زمینه\",\"backgroundOverlayOpacity\":\"شفافیت پوشش\",\"customThemeColors\":\"رنگ‌های پوسته سفارشی\",\"customThemeColorsDesc\":\"بازنویسی توکن‌های رنگ پوسته\",\"customCss\":\"CSS سفارشی\",\"customCssDesc\":\"پیشرفته: CSS دلخواه خود را برای تغییر ظاهر داشبورد تزریق کنید\",\"customCssPlaceholder\":\"/* مثلاً .navbar {'{'} backdrop-filter: blur(8px); {'}'} */\",\"settingsBackup\":\"پشتیبان‌گیری تنظیمات\",\"exportSettings\":\"خروجی\",\"importSettings\":\"ورودی\",\"kernelControl\":\"کنترل هسته\",\"kernelStatus\":\"وضعیت\",\"kernelVersion\":\"نسخه\",\"kernelUptime\":\"زمان فعالیت\",\"kernelPid\":\"PID\",\"kernelStart\":\"شروع\",\"kernelStop\":\"توقف\",\"kernelRestart\":\"راه‌اندازی مجدد\",\"kernelRollback\":\"بازگردانی پیکربندی\",\"kernelRecover\":\"بازنشانی به حداقل\",\"kernelRollbackConfirm\":\"آیا آخرین پیکربندی سالم بازگردانی شود و هسته راه‌اندازی مجدد شود؟\",\"kernelRecoverConfirm\":\"پیکربندی فعال به حالت حداقل بازنشانی و راه‌اندازی مجدد شود؟ سپس یک پروفایل دوباره وارد کنید.\",\"kernelRollbackApplied\":\"به پیکربندی قبلی بازگردانده شد\",\"kernelRecoverApplied\":\"به پیکربندی حداقلی بازنشانی شد\",\"kernelRollbackFailed\":\"بازگردانی ناموفق بود\",\"kernelRecoverFailed\":\"بازیابی ناموفق بود\",\"kernelLogs\":\"گزارش‌های هسته\",\"kernelLogsConnected\":\"در حال پخش\",\"kernelLogsDisconnected\":\"قطع‌شده\",\"kernelLogsClear\":\"پاک کردن\",\"systemProxy\":\"پروکسی سیستم\",\"systemProxyEnable\":\"فعال‌سازی پروکسی سیستم\",\"systemProxyDescription\":\"هدایت ترافیک سیستم از طریق پروکسی مدیریت‌شده روی پورت {port}.\",\"systemProxyBypass\":\"دور زدن / فهرست سفید LAN\",\"systemProxyBypassPlaceholder\":\"هر میزبان یا CIDR در یک خط، مثلاً localhost\",\"systemProxyApply\":\"اعمال\",\"systemProxyLoadFailed\":\"بارگذاری وضعیت پروکسی سیستم ناموفق بود\",\"systemProxyApplyFailed\":\"اعمال تنظیمات پروکسی سیستم ناموفق بود\",\"systemProxyApplied\":\"تنظیمات پروکسی سیستم اعمال شد\",\"kernelVersionManager\":\"نسخه هسته\",\"kernelVersionCurrent\":\"فعلی\",\"kernelVersionBundled\":\"همراه\",\"kernelVersionSelect\":\"تغییر به نسخه\",\"kernelVersionActive\":\"فعال\",\"kernelVersionSwitch\":\"تغییر و راه‌اندازی مجدد\",\"kernelVersionSwitched\":\"به {version} تغییر یافت\",\"kernelVersionSwitchFailed\":\"تغییر نسخه هسته ناموفق بود\",\"kernelVersionLoadFailed\":\"بارگذاری نسخه‌های هسته ناموفق بود\",\"geoAssets\":\"پایگاه‌های داده GEO\",\"geoAssetsDescription\":\"آخرین پایگاه‌های داده geoip / geosite / mmdb مورد استفاده برای قوانین مسیریابی را دانلود کنید.\",\"geoUpdate\":\"به‌روزرسانی پایگاه‌های داده GEO\",\"geoUpdateSuccess\":\"پایگاه‌های داده GEO به‌روزرسانی شد\",\"geoUpdateFailed\":\"به‌روزرسانی پایگاه‌های داده GEO ناموفق بود\",\"webdavBackup\":\"پشتیبان‌گیری WebDAV\",\"webdavBackupDescription\":\"پروفایل‌ها و تنظیمات داشبورد خود را روی یک سرور WebDAV پشتیبان‌گیری کرده و روی دستگاه دیگری بازیابی کنید.\",\"webdavUrl\":\"URL سرور\",\"webdavUrlPlaceholder\":\"https://dav.example.com/dav\",\"webdavUsername\":\"نام کاربری\",\"webdavPassword\":\"رمز عبور\",\"webdavDir\":\"پوشه\",\"webdavDirPlaceholder\":\"metacubexd (اختیاری)\",\"webdavBackupNow\":\"اکنون پشتیبان بگیر\",\"webdavRestore\":\"بازیابی\",\"webdavBackupSuccess\":\"پشتیبان روی WebDAV آپلود شد\",\"webdavBackupFailed\":\"پشتیبان‌گیری WebDAV ناموفق بود\",\"webdavRestoreSuccess\":\"از WebDAV بازیابی شد\",\"webdavRestoreCount\":\"{count} پروفایل بازیابی شد\",\"webdavRestoreFailed\":\"بازیابی WebDAV ناموفق بود\",\"runtimeConfig\":\"پیکربندی زمان اجرا\",\"runtimeConfigDescription\":\"نمای فقط‌خواندنی فایل پیکربندی واقعی که هسته با آن اجرا می‌شود (شامل external-controller، secret و mixed-port تزریق‌شده است).\",\"runtimeConfigEmpty\":\"هنوز پیکربندی زمان اجرایی در دسترس نیست.\",\"runtimeConfigLoadFailed\":\"بارگذاری پیکربندی زمان اجرا ناموفق بود\",\"export\":\"خروجی\",\"exportCSV\":\"خروجی CSV\",\"exportJSON\":\"خروجی JSON\",\"healthCheckAllProviders\":\"بررسی سلامت همه ارائه‌دهندگان\",\"providerHealthCheckSuccess\":\"سلامت همه ارائه‌دهندگان بررسی شد\",\"providerHealthCheckFailed\":\"بررسی سلامت برخی ارائه‌دهندگان ناموفق بود\",\"connectivityBoard\":\"تابلوی دسترسی‌پذیری\",\"connectivityTargets\":\"دسترسی‌پذیری\",\"streamingUnlockTargets\":\"استریم / هوش مصنوعی\",\"reachabilityNode\":\"گره یا گروه\",\"reachabilityNoNodes\":\"گرهی در دسترس نیست\",\"reachabilityRunTest\":\"اجرای آزمایش\",\"reachabilityResults\":\"نتایج دسترسی‌پذیری\",\"reachabilityUnreachable\":\"در دسترس نیست\",\"reachabilityUnlockLimitation\":\"این دسترسی‌پذیری پروکسی (بر پایه آزمایش تأخیر) است، نه تشخیص کامل باز کردن قفل منطقه‌ای. باز کردن قفل در سطح منطقه به بازرسی بدنه پاسخ نیاز دارد که خارج از محدوده است.\",\"reachabilityHint\":\"یک گره یا گروه را انتخاب کنید، سپس آزمایش را اجرا کنید تا هر هدف از طریق آن بررسی شود.\",\"reachabilityAllUnreachable\":\"همه اهداف از طریق {node} در دسترس نیستند\",\"profiles\":\"پروفایل‌ها\",\"profilesNew\":\"پروفایل جدید\",\"profilesImport\":\"ورود از URL\",\"profilesDuplicate\":\"تکثیر\",\"profilesDelete\":\"حذف\",\"profilesEdit\":\"ویرایش\",\"profilesActivate\":\"فعال‌سازی\",\"profilesValidate\":\"اعتبارسنجی\",\"profilesActive\":\"فعال\",\"profilesName\":\"نام\",\"profilesUrl\":\"URL اشتراک\",\"profilesSave\":\"ذخیره\",\"profilesCancel\":\"لغو\",\"profilesValidationOk\":\"پیکربندی معتبر است\",\"profilesEmpty\":\"هنوز پروفایلی نیست\",\"profilesMerges\":\"همپوشانی‌های ادغام\",\"profilesMergesHelp\":\"همپوشانی‌های ادغام قطعات YAML هستند که روی پروفایل پایه فعال ترکیب می‌شوند. مواردی را که می‌خواهید روی هم قرار بگیرند فعال کنید.\",\"profilesNewMerge\":\"همپوشانی ادغام جدید\",\"profilesMergeEnabled\":\"فعال\",\"profilesMergeNoActiveBase\":\"برای اعمال همپوشانی‌های ادغام، یک پروفایل پایه را فعال کنید.\",\"profilesMergeUpdateFailed\":\"به‌روزرسانی همپوشانی ادغام ناموفق بود\",\"profilesScripts\":\"تبدیل‌های اسکریپتی\",\"profilesScriptsHelp\":\"یک اسکریپت شیء پیکربندی را دریافت می‌کند و پیکربندی اصلاح‌شده را برمی‌گرداند. اسکریپت‌ها هنگام ترکیب پس از ادغام‌ها اجرا می‌شوند. مواردی را که می‌خواهید اعمال شوند فعال کنید.\",\"profilesScriptsSafety\":\"ایمنی: اسکریپت‌ها با دسترسی گسترده اجرا می‌شوند — فقط اسکریپت‌هایی را اجرا کنید که به آن‌ها اعتماد دارید. ویرایش یا تغییر وضعیت یک اسکریپت، پایه فعال را برای محاسبه مجدد دوباره فعال می‌کند.\",\"profilesNewScript\":\"اسکریپت جدید\",\"profilesScriptEnabled\":\"فعال\",\"profilesScriptUpdateFailed\":\"به‌روزرسانی تبدیل اسکریپتی ناموفق بود\",\"profilesShare\":\"اشتراک QR\",\"profilesShareTitle\":\"اشتراک‌گذاری اشتراک\",\"profilesShareUrl\":\"نشانی اشتراک\",\"profilesShareCopy\":\"کپی نشانی\",\"profilesShareCopied\":\"نشانی اشتراک کپی شد\",\"editorReadOnly\":\"فقط‌خواندنی\",\"editorDisableValidation\":\"غیرفعال‌سازی اعتبارسنجی\",\"editRules\":\"ویرایش قوانین\",\"editProxies\":\"ویرایش پروکسی‌ها و گروه‌ها\",\"edit\":\"ویرایش\",\"moveUp\":\"انتقال به بالا\",\"moveDown\":\"انتقال به پایین\",\"proxyConfigEditorTitle\":\"ویرایش پروکسی‌ها و گروه‌ها\",\"proxyConfigEditorHint\":\"پروکسی‌های محلی و گروه‌های نمایهٔ فعال را ویرایش کنید. تعریف‌های Proxy Provider در ویرایشگر کامل نمایه مدیریت می‌شوند. هنگام ذخیره کل پیکربندی اعتبارسنجی و هسته فقط یک‌بار راه‌اندازی مجدد می‌شود.\",\"proxyConfigSaved\":\"پیکربندی پروکسی ذخیره شد\",\"proxyConfigLoadFailed\":\"بارگذاری پیکربندی پروکسی ناموفق بود\",\"proxyConfigSaveFailed\":\"ذخیره پیکربندی پروکسی ناموفق بود\",\"routingEditorNoActiveProfile\":\"نمایهٔ فعالی برای ویرایش وجود ندارد. ابتدا یک نمایه وارد یا فعال کنید.\",\"routingEditorConflict\":\"اشتراک دارای تداخل‌های حل‌نشده است\",\"routingEditorConflictHint\":\"پیش از ویرایش این صفحه، تداخل‌ها را در ویرایشگر کامل نمایه حل کنید.\",\"routingEditorResolveConflict\":\"باز کردن ویرایشگر کامل نمایه\",\"routingEditorDiscardConfirm\":\"تغییرات ذخیره‌نشدهٔ پیکربندی کنار گذاشته شود؟\",\"routingEditorRulePlaceholder\":\"قانون کامل Mihomo را وارد کنید؛ برای نمونه DOMAIN-SUFFIX,example.com,DIRECT\",\"routingEditorDeleteBlocked\":\"این منبع همچنان ارجاع دارد و قابل حذف نیست\",\"routingEditorNodes\":\"پروکسی‌های محلی\",\"routingEditorMembers\":\"عضو\",\"routingEditorNameLocked\":\"نام منبع موجود برای حفظ ارجاع‌ها قفل است.\",\"routingEditorNameTypeRequired\":\"نام و نوع الزامی هستند.\",\"routingEditorDuplicateName\":\"پروکسی یا گروهی با نام «{name}» از قبل وجود دارد.\",\"routingEditorJsonObjectRequired\":\"JSON پیشرفته باید یک شیء باشد.\",\"routingEditorSelectMember\":\"انتخاب پروکسی یا گروه\",\"routingEditorSelectProvider\":\"انتخاب Proxy Provider\",\"rulesEditorHint\":\"قوانین را اضافه، ویرایش، حذف یا با کشیدن مرتب کنید. ذخیره یک‌بار هسته را راه‌اندازی مجدد می‌کند.\",\"policy\":\"سیاست\",\"reorder\":\"برای مرتب‌سازی بکشید\",\"delete\":\"حذف\",\"cancel\":\"لغو\",\"rulesEditorSaved\":\"قوانین ذخیره شد\",\"rulesEditorLoadFailed\":\"بارگذاری قوانین ناموفق بود\",\"rulesEditorSaveFailed\":\"ذخیره قوانین ناموفق بود\",\"rulesEditorInvalid\":\"هر قانون به نوع، محموله و سیاست غیرخالی نیاز دارد\",\"networkConfig\":\"پیکربندی شبکه\",\"networkConfigHint\":\"بخش‌های شبکه‌ی نمایه فعال را ویرایش کنید. ذخیره یک‌بار هسته را راه‌اندازی مجدد می‌کند.\",\"networkConfigSaved\":\"پیکربندی شبکه ذخیره شد\",\"networkConfigLoadFailed\":\"بارگذاری پیکربندی شبکه ناموفق بود\",\"networkConfigSaveFailed\":\"ذخیره پیکربندی شبکه ناموفق بود\",\"tunnels\":\"تونل‌ها\",\"tunnelsHint\":\"یک شنونده محلی را از طریق هسته به مقصد راه دور هدایت کنید.\",\"tunnelNetwork\":\"شبکه\",\"tunnelAddress\":\"آدرس شنونده\",\"tunnelTarget\":\"مقصد\",\"noTunnels\":\"بدون تونل\",\"sniffer\":\"اسنیفر\",\"snifferEnable\":\"فعال‌سازی اسنیفر\",\"snifferOverrideDestination\":\"بازنویسی مقصد\",\"externalController\":\"کنترل‌کننده خارجی\",\"externalControllerManaged\":\"در دسکتاپ توسط برنامه مدیریت می‌شود\",\"onboardingWelcomeTitle\":\"به MetaCubeXD خوش آمدید\",\"onboardingWelcomeBody\":\"اشتراک خود را بچسبانید و در کمتر از یک دقیقه پروکسی فعال داشته باشید.\",\"onboardingGetStarted\":\"شروع کنید\",\"onboardingSkip\":\"فعلاً رد شوید\",\"onboardingImportTitle\":\"اشتراک خود را وارد کنید\",\"onboardingImportSubtitle\":\"یک URL اشتراک بچسبانید، فایلی انتخاب کنید، یا از کلیپ‌بورد بچسبانید.\",\"onboardingImportSuccess\":\"اشتراک وارد و فعال شد\",\"onboardingFileTooLarge\":\"فایل بسیار بزرگ است\",\"onboardingClipboardEmpty\":\"کلیپ‌بورد خالی است\",\"onboardingClipboardDenied\":\"دسترسی به کلیپ‌بورد رد شد\",\"onboardingSystemProxyTitle\":\"فعال‌سازی پروکسی سیستم\",\"onboardingSystemProxyBody\":\"تمام برنامه‌های این دستگاه را از طریق پروکسی هدایت کنید.\",\"onboardingDoneTitle\":\"همه چیز آماده است\",\"onboardingDoneBody\":\"اشتراک شما فعال است. یک گره را انتخاب کنید تا مرور را آغاز کنید.\",\"onboardingGoToProxies\":\"رفتن به پروکسی‌ها\",\"onboardingFinish\":\"پایان\",\"onboardingBack\":\"قبلی\",\"onboardingNext\":\"بعدی\",\"onboardingStep\":\"مرحله {current} از {total}\",\"onboardingEmptyTitle\":\"هنوز اشتراکی نیست\",\"onboardingEmptyBody\":\"برای شروع استفاده از پروکسی یک اشتراک وارد کنید.\",\"onboardingEmptyImport\":\"ورود اشتراک\",\"onboardingEmptyRunSetup\":\"اجرای دوباره راه‌اندازی\",\"profilesImportTitle\":\"ورود اشتراک\",\"profilesImportSubtitle\":\"اشتراکی را از طریق URL، فایل یا کلیپ‌بورد اضافه کنید.\",\"profilesImportFile\":\"ورود از فایل\",\"profilesImportClipboard\":\"چسباندن از کلیپ‌بورد\",\"profilesImportSuccess\":\"اشتراک وارد شد\",\"profilesImportFailed\":\"ورود اشتراک ناموفق بود\",\"profilesAdvanced\":\"پیشرفته\",\"profilesRefresh\":\"به‌روزرسانی\",\"profilesRefreshAndApply\":\"به‌روزرسانی و اعمال\",\"profilesRefreshed\":\"اشتراک به‌روزرسانی شد\",\"profilesRefreshFailed\":\"به‌روزرسانی اشتراک ناموفق بود\",\"profilesAutoUpdate\":\"به‌روزرسانی خودکار\",\"profilesAutoUpdateOff\":\"خاموش\",\"profilesAutoUpdateMinutes\":\"{n} دقیقه\",\"profilesAutoUpdateHours\":\"{n} ساعت\",\"profilesUpdated\":\"به‌روزرسانی {time}\",\"profilesActivated\":\"نمایه فعال شد\",\"profilesActionFailed\":\"عملیات ناموفق بود\",\"profilesDeleteConfirm\":\"«{name}» حذف شود؟ این عمل قابل بازگشت نیست.\",\"profilesDeleteActiveConfirm\":\"«{name}» نمایه فعال است. حذف آن پیکربندی در حال اجرا را از کار می‌اندازد. ادامه می‌دهید؟\",\"profilesEditing\":\"در حال ویرایش {name}\",\"visualEditor\":\"ویرایشگر دیداری\",\"visualEditorUnavailable\":\"ویرایشگر دیداری فقط در نسخهٔ دسکتاپ یا عامل یکپارچه در دسترس است.\",\"visualEditorBack\":\"بازگشت به نمایه‌ها\",\"visualEditorUnsaved\":\"ذخیره‌نشده\",\"visualEditorVisual\":\"دیداری\",\"visualEditorSettings\":\"تنظیمات\",\"visualEditorResources\":\"منابع\",\"visualEditorRouting\":\"مسیریابی\",\"visualEditorSubRules\":\"زیرقانون‌ها\",\"visualEditorOperations\":\"عملیات\",\"visualEditorReset\":\"بازنشانی بازنویسی‌ها\",\"visualEditorResetConfirm\":\"همهٔ بازنویسی‌های دیداری این اشتراک بازنشانی شوند؟\",\"visualEditorProxy\":\"پروکسی\",\"visualEditorGroup\":\"گروه\",\"visualEditorUnnamed\":\"بدون نام\",\"visualEditorDropHint\":\"پروکسی یا Provider را اینجا بکشید\",\"visualEditorResourceEdit\":\"ویرایش منبع\",\"visualEditorAdvancedJson\":\"فیلدهای پیشرفته (JSON)\",\"visualEditorAddField\":\"افزودن فیلد\",\"visualEditorPreview\":\"بررسی تغییرات\",\"visualEditorPreviewFailed\":\"آماده‌سازی پیش‌نمایش ناموفق بود\",\"visualEditorApply\":\"اعتبارسنجی و اعمال\",\"visualEditorActivate\":\"اعتبارسنجی و فعال‌سازی\",\"visualEditorApplied\":\"پیکربندی اعمال شد\",\"visualEditorApplyFailed\":\"اعمال پیکربندی ناموفق بود\",\"visualEditorLeaveConfirm\":\"تغییرات ذخیره‌نشده کنار گذاشته شوند؟\",\"visualEditorConflicts\":\"تداخل‌های اشتراک\",\"visualEditorKeepLocal\":\"نگه‌داشتن بازنویسی محلی\",\"visualEditorAcceptUpstream\":\"پذیرفتن مقدار اشتراک\",\"visualEditorManualMerge\":\"ادغام در YAML\",\"visualEditorDiagnostics\":\"عیب‌یابی پیکربندی\",\"visualEditorManaged\":\"مدیریت‌شده\",\"quality\":\"کیفیت\",\"sortDefault\":\"پیش‌فرض\"}");

// @ts-nocheck
const localeCodes =  [
  "en",
  "zh",
  "ru",
  "ja",
  "ko",
  "fr",
  "fa"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_cce61557",
      load: () => Promise.resolve(locale_en_46json_cce61557),
      cache: true
    }
  ],
  zh: [
    {
      key: "locale_zh_46json_db0649d0",
      load: () => Promise.resolve(locale_zh_46json_db0649d0),
      cache: true
    }
  ],
  ru: [
    {
      key: "locale_ru_46json_489d78f3",
      load: () => Promise.resolve(locale_ru_46json_489d78f3),
      cache: true
    }
  ],
  ja: [
    {
      key: "locale_ja_46json_cd12a199",
      load: () => Promise.resolve(locale_ja_46json_cd12a199),
      cache: true
    }
  ],
  ko: [
    {
      key: "locale_ko_46json_5505bba7",
      load: () => Promise.resolve(locale_ko_46json_5505bba7),
      cache: true
    }
  ],
  fr: [
    {
      key: "locale_fr_46json_66bdb728",
      load: () => Promise.resolve(locale_fr_46json_66bdb728),
      cache: true
    }
  ],
  fa: [
    {
      key: "locale_fa_46json_0dca54b7",
      load: () => Promise.resolve(locale_fa_46json_0dca54b7),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    name: "English",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "zh",
    name: "简体中文",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "ru",
    name: "Русский",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "ja",
    name: "日本語",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "ko",
    name: "한국어",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "fr",
    name: "Français",
    language: undefined,
    domains: [],
    defaultForDomains: []
  },
  {
    code: "fa",
    name: "فارسی",
    language: undefined,
    domains: [],
    defaultForDomains: []
  }
];

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function parseAcceptLanguage(value) {
  return value.split(",").map((tag) => tag.split(";")[0]).filter(
    (tag) => !(tag === "*" || tag === "")
  );
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === "string" ? path : path.pathname;
    const normalizedPath = rawPath.split("?")[0];
    const parts = normalizedPath.split("/");
    if (parts[0] === "") {
      parts.shift();
    }
    return parts.length > index ? parts[index] || "" : "";
  };
}

function useRuntimeI18n(nuxtApp, event) {
  {
    const getRuntimeConfig = useRuntimeConfig;
    return getRuntimeConfig(event).public.i18n;
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0;
  }
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}

const normalizeDomain = (domain = "") => domain.replace(/^https?:\/\//i, "").toLowerCase();
function isLocaleOnHost(locale, host) {
  return !!locale?.domains.some((x) => normalizeDomain(x) === host);
}
function resolveLocaleReach(locales, host, locale) {
  const target = locales.find((l) => l.code === locale);
  if (!target?.domains.length || isLocaleOnHost(target, host)) {
    return "here";
  }
  return locales.some((l) => isLocaleOnHost(l, host)) ? "other-domain" : "off-host";
}
function isLocaleServedOnHost(locales, host, locale) {
  return resolveLocaleReach(locales, host, locale) !== "other-domain";
}
function matchDomainLocale(locales, host, pathLocale) {
  const matches = locales.filter((locale) => isLocaleOnHost(locale, host));
  return (
    // match by current path locale
    (matches.find((l) => l.code === pathLocale) || matches.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host)) || matches[0])?.code
  );
}
function cookieSpansDomains(locales, cookieDomain) {
  const scope = cookieDomain.replace(/^\./, "").replace(/:\d+$/, "").toLowerCase();
  return locales.every(
    (l) => l.domains.concat(l.domain || []).every((domain) => {
      const host = normalizeDomain(domain).replace(/:\d+$/, "");
      return host === scope || host.endsWith("." + scope);
    })
  );
}
function withRuntimeDomain(locale, domainLocales) {
  if (typeof locale === "string") {
    return locale;
  }
  const properties = locale;
  const domain = domainLocales[properties.code]?.domain;
  if (!domain || domain === properties.domain) {
    return locale;
  }
  return {
    ...properties,
    domain,
    domains: [domain],
    defaultForDomains: properties.defaultForDomains.length ? [domain] : []
  };
}

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {};
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale]);
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks);
    localeConfigs[locale] = { fallbacks, cacheable };
  }
  return localeConfigs;
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) {
    return [];
  }
  if (isArray(fallback)) {
    return fallback;
  }
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) {
      continue;
    }
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every((loader) => loader.cache !== false);
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every((fallbackLocale) => isLocaleCacheable(fallbackLocale));
}
function getDefaultLocaleForDomain(host, locales = normalizedLocales) {
  return locales.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host))?.code;
}
function resolveDefaultLocale(host, defaultLocale, locales = normalizedLocales) {
  const resolved = getDefaultLocaleForDomain(host, locales) || defaultLocale;
  if (resolved) {
    return resolved;
  }
  return (locales.some((l) => l.domains.length) ? locales[0]?.code : "") || "";
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");

const storage = prefixStorage(useStorage(), "i18n");
function deepFreeze(value) {
  if (value == null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return Object.freeze(value);
}
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts };
  const pending = {};
  async function get(key, resolver) {
    const isPending = pending[key];
    if (!isPending) {
      pending[key] = Promise.resolve(resolver());
    }
    try {
      return await pending[key];
    } finally {
      delete pending[key];
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(":").replace(/:\/$/, ":index");
    const maxAge = opts.maxAge ?? 1;
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0;
    const cache = isCacheable && await storage.getItemRaw(key);
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args));
      const value = await get(key, () => fn(...args));
      if (isCacheable) {
        deepFreeze(value);
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() });
      }
      return value;
    }
    return cache.value;
  };
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) };
};
cachedFunctionI18n(_getMessages, {
  name: "messages",
  maxAge: -1 ,
  getKey: (locale) => locale,
  shouldBypassCache: (locale) => !isLocaleCacheable(locale)
});
const getMessages = _getMessages ;
function appContextHint(e) {
  if (!/ is not defined|Nuxt instance unavailable/.test(e.message)) {
    return "";
  }
  return ". Locale loaders run outside the Nuxt app when the server produces messages, so Nuxt app composables (`useNuxtApp`, `useState`, `useCookie`, ...) are unavailable - call them in the locale file itself to have the build keep that locale in the app instead.";
}
const _getMergedMessages = async (locale, fallbackLocales) => {
  try {
    if (fallbackLocales.length === 0) {
      return await getMessages(locale) ?? {};
    }
    const merged = {};
    const messages = await Promise.all(fallbackLocales.map(getMessages));
    for (const message of messages) {
      deepCopy(message, merged);
    }
    deepCopy(await getMessages(locale), merged);
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message + appContextHint(e), { cause: e });
  }
};
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: "merged-single",
  maxAge: -1 ,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join("-")}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
});

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error("Nuxt I18n server context has not been set up yet.");
  }
  return event.context.nuxtI18n;
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n;
}
const getHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
async function initializeI18nContext(event) {
  const runtimeI18n = useRuntimeI18n(void 0, event);
  const defaultLocale = runtimeI18n.defaultLocale || "";
  const options = await setupVueI18nOptions(resolveDefaultLocale(getHost(event), defaultLocale));
  const localeConfigs = createLocaleConfigs(options.fallbackLocale);
  const ctx = createI18nContext();
  ctx.vueI18nOptions = options;
  ctx.localeConfigs = localeConfigs;
  event.context.nuxtI18n = ctx;
  return ctx;
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set();
      this.trackMap[locale].add(key);
    },
    async loadMessages(locale) {
      const messages = await getMergedMessages(locale, this.localeConfigs?.[locale]?.fallbacks ?? []) ?? {};
      return this.vueI18nOptions?.flatJson ? cloneDeep(messages) : messages;
    }
  };
}

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"},{"charset":"utf-8"},{"name":"theme-color","content":"#000000"}],"link":[{"rel":"icon","type":"image/svg+xml","href":"favicon.svg"},{"rel":"apple-touch-icon","sizes":"180x180","href":"apple-touch-icon-180x180.png"}],"style":[],"script":[{"src":"config.js","tagPosition":"head","defer":false,"async":false,"onerror":"window.__METACUBEXD_CONFIG__={defaultBackendURL:'',githubToken:''}"},{"innerHTML":"window.__METACUBEXD_CONFIG__ = window.__METACUBEXD_CONFIG__ || { defaultBackendURL: '', githubToken: '' }"}],"noscript":[],"charset":"utf-8","viewport":"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover","title":"MetaCubeXD"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const separator = "___";
const createTrailingSlashFormatter = (trailingSlash) => trailingSlash ? withTrailingSlash : withoutTrailingSlash;
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  if (input[0] === "/") {
    return getLocaleFromRoutePath(input);
  }
  const fromName = getLocaleFromRouteName(input);
  if (fromName) {
    return fromName;
  }
  if (typeof route === "object" && route?.path) {
    return getLocaleFromRoutePath(String(route.path));
  }
  return "";
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}

const getCookieLocale = (event, cookieName) => (getCookie(event, cookieName)) || void 0;
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
const getRequestHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
const getRefererHost = (event) => {
  const referer = getRequestHeader(event, "referer");
  try {
    return referer && new URL(referer).host || void 0;
  } catch {
    return void 0;
  }
};
const getDomainLocales = (domainLocales) => normalizedLocales.map((l) => withRuntimeDomain(l, domainLocales));
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n();
  let host;
  let locales;
  const getHost = () => host ??= getRequestHost(event);
  const getLocales = () => locales ??= getDomainLocales(runtimeI18n.domainLocales);
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event) ,
    navigator: () => void 0,
    host: (path) => matchDomainLocale(getLocales(), getHost(), getLocaleFromRoutePath(path)),
    route: (path) => getRouteLocale(event, path),
    /** Passes the locale through when the current host serves it, `undefined` otherwise */
    onHost: (locale) => !locale || isLocaleServedOnHost(getLocales(), getHost(), locale) ? locale : void 0,
    /** Whether the visitor arrived from one of the configured domains */
    fromOwnDomain: () => {
      const referer = getRefererHost(event);
      return !!referer && getLocales().some((l) => isLocaleOnHost(l, referer));
    },
    /** Whether a cookie scoped to the configured `cookieDomain` is readable on every domain */
    cookieSpans: () => !!config.cookieDomain && cookieSpansDomains(getLocales(), config.cookieDomain)
  };
};
function createLocaleDetector(config) {
  const { detection} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  function skipDetect(path, pathLocale) {
    {
      return false;
    }
  }
  return function detectLocale(detectors, route, initial) {
    const path = isString(route) ? parsePath(route).pathname : route.path;
    const pass = (locale) => locale;
    const onHost = pass;
    function* detect() {
      const detecting = initial && detection.enabled && !skipDetect(path, detectors.route(path));
      if (detecting) {
        const cookie = onHost;
        const browser = onHost;
        yield cookie(detectors.cookie());
        yield browser(detectors.header());
        yield browser(detectors.navigator());
      }
      if (detecting) {
        yield onHost(detection.fallbackLocale);
      }
    }
    for (const detected of detect()) {
      if (detected && isSupported(detected)) {
        return detected;
      }
    }
    return "";
  };
}

// Generated by @nuxtjs/i18n
const localizedPaths = [];
const pathToI18nConfig = {};
const i18nPathToPath = {};
const disabledPaths = [];

const emptyRoute = { path: "/", name: "", matched: [], params: {}, meta: {} };
function createPathMatcher(resources, config) {
  const matcher = createRouterMatcher([], {});
  for (const path of [...resources.localizedPaths, ...Object.keys(resources.i18nPathToPath)]) {
    matcher.addRoute({ path, component: () => "", meta: {} });
  }
  const disabledI18nMatcher = createRouterMatcher([], {});
  for (const path of resources.disabledPaths) {
    disabledI18nMatcher.addRoute({ path, component: () => "", meta: {} });
  }
  const formatTrailingSlash = createTrailingSlashFormatter(config.trailingSlash);
  const getI18nPathToI18nPath = (path, locale) => {
    if (!path || !locale) {
      return;
    }
    const plainPath = resources.i18nPathToPath[path] ?? path;
    const i18nConfig = resources.pathToI18nConfig[plainPath];
    if (i18nConfig == null || !(locale in i18nConfig)) {
      return plainPath;
    }
    return i18nConfig[locale] || void 0;
  };
  function isExistingNuxtRoute2(path) {
    if (path === "") {
      return;
    }
    if (path.endsWith("/__nuxt_error")) {
      return;
    }
    if (disabledI18nMatcher.resolve({ path }, emptyRoute).matched.length > 0) {
      return;
    }
    const resolvedMatch = matcher.resolve({ path }, emptyRoute);
    return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0;
  }
  function matchLocalized2(path, locale, defaultLocale) {
    if (path === "") {
      return;
    }
    const parsed = parsePath(path);
    const resolvedMatch = matcher.resolve({ path: parsed.pathname || "/" }, emptyRoute);
    if (resolvedMatch.matched.length === 0) {
      return;
    }
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale);
    if (!alternate) {
      return;
    }
    const match = matcher.resolve({ params: resolvedMatch.params }, { ...emptyRoute, path: alternate });
    return formatTrailingSlash(withLeadingSlash(joinURL("", match.path)), true);
  }
  return { isExistingNuxtRoute: isExistingNuxtRoute2, matchLocalized: matchLocalized2 };
}
const { isExistingNuxtRoute, matchLocalized } = createPathMatcher(
  { localizedPaths, i18nPathToPath, pathToI18nConfig, disabledPaths },
  { trailingSlash: false }
);

function createRedirectResolver(config) {
  const { detection, rootRedirect, matchLocalized} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  const detectLocale = createLocaleDetector({ detection, isSupportedLocale: isSupported});
  return function resolveRedirectPath(fullPath, path, pathLocale, defaultLocale, detectors, relocate) {
    let locale = detectLocale(detectors, fullPath, true) || defaultLocale;
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || "/", locale2, defaultLocale);
      if (res && res !== fullPath) {
        return res;
      }
    }
    let resolvedPath = void 0;
    let redirectCode = 302;
    const pathname = parsePath(fullPath).pathname;
    if (rootRedirect && pathname === "/") {
      locale = detection.enabled && locale || defaultLocale;
      resolvedPath = isSupported(detectors.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale, defaultLocale);
      redirectCode = rootRedirect.code;
    } else if (config.redirectStatusCode) {
      redirectCode = config.redirectStatusCode;
    }
    switch (detection.redirectOn) {
      case "root":
        if (pathname !== "/") {
          break;
        }
      // fallthrough (root has no prefix)
      case "no prefix":
        if (pathLocale) {
          break;
        }
      // fallthrough to resolve
      case "all":
        resolvedPath ??= getLocalizedMatch(locale);
        break;
    }
    return { path: resolvedPath, code: redirectCode, locale };
  };
}

function createRedirectResponse(event, dest, code) {
  event.node.res.setHeader("location", dest);
  event.node.res.statusCode = sanitizeStatusCode(code, event.node.res.statusCode);
  return {
    headers: event.node.res.getHeaders(),
    statusCode: event.node.res.statusCode,
    body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${dest.replace(/"/g, "%22")}"></head></html>`
  };
}
const _LKQGBfxhHYyxmF_LJbQvtWKeAjX7XaCsvzjEBArTl8 = defineNitroPlugin(async (nitro) => {
  const runtimeI18n = useRuntimeI18n();
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect);
  runtimeI18n.defaultLocale || "";
  try {
    const cacheStorage = useStorage("cache");
    const cachedKeys = await cacheStorage.getKeys("nitro:handlers:i18n");
    await Promise.all(cachedKeys.map((key) => cacheStorage.removeItem(key)));
  } catch {
  }
  const detection = useI18nDetection();
  const cookieOptions = {
    path: "/",
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: detection.cookieSecure
  };
  const legacyBaseUrl = isFunction(runtimeI18n.baseUrl);
  if (legacyBaseUrl) {
    console.warn("[nuxt-i18n] Configuring baseUrl as a function is deprecated and will be removed in v11.");
  }
  const baseUrlGetter = (event) => {
    return "";
  };
  const resolveRedirectPath = createRedirectResolver({
    detection,
    rootRedirect,
    redirectStatusCode: runtimeI18n.redirectStatusCode,
    matchLocalized});
  nitro.hooks.hook("request", async (event) => {
    await initializeI18nContext(event);
  });
  nitro.hooks.hook("render:before", async (context) => {
    const { event } = context;
    const ctx = useI18nContext(event);
    const url = getRequestURL(event);
    const detector = useDetectors(event, detection);
    const localeSegment = detector.route(event.path);
    const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0;
    const { pathname } = parsePath(event.path);
    const path = pathLocale ? pathname.slice(pathLocale.length + 1) || "/" : pathname;
    if (!url.pathname.includes("/_i18n") && !isExistingNuxtRoute(path)) {
      return;
    }
    const resolved = resolveRedirectPath(
      event.path,
      path,
      pathLocale,
      ctx.vueI18nOptions.defaultLocale,
      detector,
      void 0
    );
    if (resolved.path && (resolved.origin || resolved.path !== pathname)) {
      ctx.detectLocale = resolved.locale;
      detection.useCookie && (!resolved.origin || detection.cookieDomain) && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions);
      context.response = createRedirectResponse(
        event,
        // the resolved path is base-free (matched against base-free routes), re-add `app.baseURL`
        joinURL(
          resolved.origin || baseUrlGetter(),
          useRuntimeConfig(event).app.baseURL,
          resolved.path + url.search
        ),
        resolved.code
      );
      return;
    }
  });
  nitro.hooks.hook("render:html", (htmlContext, { event }) => {
    tryUseI18nContext(event);
  });
});

//#region src/runtime/diagnostics.ts
const ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
const colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
/**
* E8xxx
* Nitro server runtime (SSR rendering / dev server) diagnostics.
*/
const docsBase = (code) => `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
const serverDiagnostics = /* #__PURE__ */ defineDiagnostics({
	docsBase,
	reporters: [/* @__PURE__ */ createConsoleReporter({ formatter: ansiFormatter(colors) } )],
	codes: {
		NUXT_E8001: {
			why: (p) => `\`render:html\` mutated \`body\`/\`bodyAppend\` while streaming (\`${p.path}\`). These fields are silently dropped because the body is about to stream.`,
			fix: "Use the `render:html:close` hook instead.",
			docs: false
		},
		NUXT_E8002: {
			why: (p) => `SSR streaming committed the response before render completed (\`${p.path}\`). The following mutations did not reach the client and were dropped:\n  - ${p.mutations}`,
			fix: (p) => `Move the mutation into a plugin (which runs before the shell is flushed), or opt this route out of streaming with \`routeRules: { '${p.path}': { streaming: false } }\` or the \`render:route\` hook.`,
			docs: false
		},
		NUXT_E8003: {
			why: (p) => `Failed to stringify dev server logs.${p.error ? ` Received \`${p.error}\`.` : ""}`,
			fix: "You can define your own reducer/reviver for rich types following the instructions in `https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload`.",
			docs: false
		},
		NUXT_E8004: {
			why: "The server bundle is not available.",
			fix: "Ensure the Nuxt build completed successfully and the server entry was emitted by your builder.",
			docs: false
		},
		NUXT_E8005: {
			why: "Island props cannot contain a `template` key, which the Vue runtime compiler would compile and execute.",
			fix: "Rename the prop (e.g. `templateName`), or disable `vue.runtimeCompiler` if you do not need runtime template compilation.",
			docs: false
		}
	}
});

const rootDir = "D:/34938/Documents/github/QoQClashD/packages/ui";

//#region src/runtime/plugins/dev-server-logs.ts
const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : void 0,
	URL: (data) => data instanceof URL ? data.toString() : void 0,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : void 0
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
var dev_server_logs_default = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) return;
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) continue;
			if (EXCLUDE_TRACE_RE.test(entry.source)) continue;
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			filename,
			stack: trace
		};
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			serverDiagnostics.NUXT_E8003({
				error: e instanceof Error ? e.toString() : void 0,
				cause: e
			});
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const plugins = [
  _1CuEGahg1q7vq82Xm79TuLeOXqgZDw_38ZkoAmXTqOk,
_LKQGBfxhHYyxmF_LJbQvtWKeAjX7XaCsvzjEBArTl8,
dev_server_logs_default,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f11e-3Cp1+7RnTHA1G7UzZ6tKyqdkVNQ\"",
    "mtime": "2026-09-14T14:01:05.534Z",
    "size": 389406,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"9210f-/Sca/w2UIPVheA2C/Y7f44bKgZ0\"",
    "mtime": "2026-09-14T14:01:05.534Z",
    "size": 598287,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_fonts/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _ZH9LX7 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale");
  if (!locale) {
    throw createError({ status: 400, message: "Locale not specified." });
  }
  const ctx = useI18nContext(event);
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError({ status: 404, message: `Locale '${locale}' not found.` });
  }
  const messages = await ctx.loadMessages(locale);
  {
    for (const k of Object.keys(messages)) {
      warnMissedMessageFunctions(k, messages[k]);
    }
  }
  return messages;
});
const getCacheKey = (event) => [getRouterParam(event, "locale") ?? "null", getRouterParam(event, "hash") ?? "null"].join("-");
async function shouldBypassCache(event) {
  const locale = getRouterParam(event, "locale");
  if (locale == null) {
    return false;
  }
  const ctx = tryUseI18nContext(event) || await initializeI18nContext(event);
  return !ctx.localeConfigs?.[locale]?.cacheable;
}
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: "i18n:messages-internal",
  maxAge: -1 ,
  getKey: getCacheKey,
  shouldBypassCache
});
defineCachedEventHandler(_cachedMessageLoader, {
  name: "i18n:messages",
  maxAge: -1 ,
  swr: false,
  getKey: getCacheKey,
  shouldBypassCache
});
const _NyKhcl = _messagesHandler ;

//#region ../nuxt/src/app/island-hash.ts
/**
* Strip Vue scoped-style attributes (`data-v-*`) from island props before hashing
* or rendering. Scoped-id markers leak in from parent components and are not part
* of the logical island input.
*
* Used before island props are serialized and sent to the island handler.
*
* @internal
*/
function filterIslandProps(props) {
	if (!props) return {};
	const out = {};
	for (const key in props) if (!key.startsWith("data-v-")) out[key] = props[key];
	return out;
}
/**
* Compute the `hashId` segment embedded in an island URL (`/__nuxt_island/<Name>_<hashId>.json`).
*
* The hash binds the response to the requested `(name, props, context, source)` tuple, so the
* server can reject requests whose URL hash does not match the supplied query/body. Use this
* from island clients if you need to ensure a hash stays in step with Nuxt's implementation.
*
* `props` may be passed either as the raw props object or as the JSON string that will be sent
* over the wire; the two produce the same hash when the round-trip is identity.
*
* @since 4.5.0
*/
function getIslandHash(input) {
	const props = typeof input.props === "string" ? parseSerializedProps(input.props) : input.props ?? {};
	return hash$1([
		input.name,
		props,
		input.context ?? {},
		input.source
	]).replace(/[-_]/g, "");
}
function parseSerializedProps(serializedProps) {
	try {
		return JSON.parse(serializedProps);
	} catch {
		return serializedProps;
	}
}

//#region src/runtime/utils/island-props.ts
/** @internal */
const MAX_ISLAND_BODY_BYTES = 65536;
/**
* Whether the bracket nesting of a JSON-ish string exceeds `maxDepth`, in a single linear
* pass. Brackets inside string values are ignored.
*
* @internal
*/
function exceedsMaxDepth(raw, maxDepth = 64) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (inString) {
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === "\"") inString = false;
			continue;
		}
		if (ch === "\"") inString = true;
		else if (ch === "{" || ch === "[") {
			if (++depth > maxDepth) return true;
		} else if (ch === "}" || ch === "]") {
			if (depth > 0) depth--;
		}
	}
	return false;
}
/** @internal */
function exceedsMaxBytes(raw, maxBytes = MAX_ISLAND_BODY_BYTES) {
	return Buffer.byteLength(raw, "utf8") > maxBytes;
}

const NUXT_SSR_STREAMING = false;

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

const VueResolver = /* @__PURE__ */ Object.assign(
  (_, value) => isRef(value) ? toValue(value) : value,
  // identity for plain non-reactive values, so the SSR default init entry
  // keeps its precomputed fast path (see unhead/server createHead)
  { _static: true }
);

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const legacyPlugins = [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin];

const unheadOptions = {
  disableDefaults: true,
  plugins: legacyPlugins,
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) return encodePath(path);
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: true,
		head: createHead(unheadOptions),
		error: false,
		nuxt: void 0,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: /* @__PURE__ */ new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

//#region src/runtime/utils/renderer/cache.ts
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) res = fn().catch((err) => {
			res = null;
			throw err;
		});
		return res;
	};
}

//#region src/runtime/utils/renderer/build-files.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => Promise.resolve().then(function () { return entry; }).then((r) => r.default || r);
const getClientManifest = () => Promise.resolve().then(function () { return manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) throw serverDiagnostics.NUXT_E8004();
	const precomputed = void 0 ;
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		if (process.env.NUXT_VITE_NODE_OPTIONS) renderer.rendererContext.updateManifest(await getClientManifest());
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = void 0 ;
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			return APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG + (r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "");
		}
	});
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= /* @__PURE__ */ new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function getRenderer(ssrContext) {
	return getSPARenderer() ;
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

//#region src/runtime/utils/renderer/inline-styles.ts
async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = /* @__PURE__ */ new Set();
	const promises = [];
	for (const mod of usedModules) if (mod in styleMap && styleMap[mod]) promises.push(styleMap[mod]());
	for (const styles of await Promise.all(promises)) for (const style of styles) inlinedStyles.add(style);
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

//#region src/runtime/utils/renderer/islands.ts
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
/**
* remove the root node from the html body
*/
function getServerComponentHTML(body) {
	return body.match(ROOT_NODE_REGEX)?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) return;
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) response[name] = {
		...slot,
		fallback: ssrContext.teleports?.[`island-fallback=${name}`]
	};
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) return;
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		let html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		if (!html && ssrContext.teleports) for (const [key, value] of Object.entries(ssrContext.teleports)) {
			const [, , componentUid] = key.match(SSR_CLIENT_TELEPORT_MARKER) ?? [];
			if (componentUid === clientUid) {
				html = value.replaceAll("<!--teleport start anchor-->", "");
				break;
			}
		}
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) continue;
			slots[slot] = value;
		}
	}
	return slots;
}
const ISLAND_TELEPORT_ANCHOR_RE = / data-island-uid="([^"]*)" data-island-(component|slot)="([^"]*)"[^>]*>/g;
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) return html;
	const contentsByAnchor = /* @__PURE__ */ new Map();
	const uids = /* @__PURE__ */ new Set();
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) continue;
			contentsByAnchor.set(`${uid};component;${clientId}`, teleports[key]);
			uids.add(uid);
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) continue;
			contentsByAnchor.set(`${uid};slot;${slot}`, teleports[key]);
			uids.add(uid);
		}
	}
	if (!contentsByAnchor.size) return html;
	const stitch = (html) => {
		const anchorRE = new RegExp(ISLAND_TELEPORT_ANCHOR_RE);
		let out = "";
		let cursor = 0;
		let m;
		while (contentsByAnchor.size && (m = anchorRE.exec(html))) {
			if (!uids.has(m[1])) continue;
			const anchor = `${m[1]};${m[2]};${m[3]}`;
			const content = contentsByAnchor.get(anchor);
			if (content === void 0) continue;
			contentsByAnchor.delete(anchor);
			const end = m.index + m[0].length;
			out += html.slice(cursor, end) + stitch(content);
			cursor = end;
		}
		return cursor ? out + html.slice(cursor) : html;
	};
	return stitch(html);
}

//#region src/runtime/handlers/island.ts
const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	return toResponse(event, await renderIsland(event));
});
function toResponse(event, result) {
	return "raw" in result ? returnIslandResponse(event, result.raw) : result;
}
async function renderIsland(event) {
	const nitroApp = useNitroApp();
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	const renderer = await getSSRRenderer();
	const renderResult = await (renderer.renderToString(ssrContext)).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") return {};
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) throw createError({
			statusCode: response.statusCode,
			statusMessage: response.statusMessage
		});
		return { raw: response };
	}
	if (ssrContext.payload?.error) throw ssrContext.payload.error;
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			if ("inline" in getQuery(resource.file)) continue;
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) link.push({
				rel: "stylesheet",
				href: renderer.rendererContext.buildAssetsURL(resource.file),
				crossorigin: ""
			});
		}
		if (link.length) ssrContext.head.push({ link });
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) for (const [key, value] of Object.entries(walkResolver(entry.input, VueResolver))) {
		const currentValue = islandHead[key];
		if (Array.isArray(currentValue)) currentValue.push(...value);
		else islandHead[key] = value;
	}
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
}
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) setResponseHeader(event, header, response.headers[header]);
	if (response.statusCode) setResponseStatus(event, response.statusCode, response.statusMessage);
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function readGuardedIslandBody(event) {
	if (Number(getRequestHeader(event, "content-length")) > 65536) throw createError({
		statusCode: 413,
		statusMessage: "Island request body too large"
	});
	let received = 0;
	let raw = "";
	let overflowed = false;
	const stream = getRequestWebStream(event);
	if (stream) {
		const decoder = new TextDecoder();
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				received += value.byteLength;
				if (received > 65536) {
					overflowed = true;
					continue;
				}
				raw += decoder.decode(value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}
		raw += decoder.decode();
	}
	if (overflowed) throw createError({
		statusCode: 413,
		statusMessage: "Island request body too large"
	});
	if (!raw) return {};
	if (exceedsMaxDepth(raw)) throw createError({
		statusCode: 400,
		statusMessage: "Island request body too deeply nested"
	});
	return destr$1(raw) || {};
}
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request path"
	});
	const componentParts = url.substring(15).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island component name"
	});
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readGuardedIslandBody(event);
	const serializedProps = typeof rawContext?.props === "string" ? rawContext.props : "{}";
	if (exceedsMaxBytes(serializedProps)) throw createError({
		statusCode: 413,
		statusMessage: "Island request props too large"
	});
	if (exceedsMaxDepth(serializedProps)) throw createError({
		statusCode: 400,
		statusMessage: "Island request props too deeply nested"
	});
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) if (key !== "props") clientContext[key] = rawContext[key];
	}
	const parsed = destr$1(serializedProps);
	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request props"
	});
	const parsedProps = filterIslandProps(parsed);
	const expectedHash = getIslandHash({
		name: componentName,
		props: parsedProps,
		context: clientContext
	});
	if (!hashId || hashId !== expectedHash) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request hash"
	});
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: parsedProps,
		slots: {},
		components: {}
	};
}

const _lazy_gBqGdf = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _ZH9LX7, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_gBqGdf, lazy: true, middleware: false, method: undefined },
  { route: '/_i18n/:hash/:locale/messages.json', handler: _NyKhcl, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/_fonts/**', handler: _lazy_gBqGdf, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_gBqGdf, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

//#region src/runtime/templates/error-500.ts
const _messages = {
	"appName": "Nuxt",
	"status": 500,
	"statusText": "Internal server error",
	"description": "This page is temporarily unavailable.",
	"refresh": "Refresh this page"
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1,minimum-scale=1\" name=\"viewport\"><script>!function(){let e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(let e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(let t of e)if(\"childList\"===t.type)for(let e of t.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;let r=function(e){let r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),r.credentials=\"use-credentials\"===e.crossOrigin?\"include\":\"anonymous\"===e.crossOrigin?\"omit\":\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:after,:before{--un-content:\"\"}html{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 #0000;--un-ring-shadow:0 0 #0000;--un-shadow-inset: ;--un-shadow:0 0 #0000;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:#93c5fd80;--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2{padding-left:.5rem;padding-right:.5rem}.text-center{text-align:center}.text-\\[80px\\]{font-size:80px}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold{font-weight:600}.leading-none{line-height:1}.tracking-wide{letter-spacing:.025em}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (width>=640px){.sm\\:text-\\[110px\\]{font-size:110px}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}}</style></head><body class=\"antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide\"><div class=\"max-w-520px text-center\"><h1 class=\"font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]\">" + escapeHtml(messages.status) + "</h1><h2 class=\"font-semibold mb-2 sm:text-3xl text-2xl\">" + escapeHtml(messages.statusText) + "</h2><p class=\"mb-4 px-2 text-[#64748B] text-md\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const manifest = () => viteNodeFetch.getManifest();

const manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

//#region src/runtime/utils/renderer/payload.ts
function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const payload = {
		"type": "application/json",
		"innerHTML": opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "",
		"data-nuxt-data": appId,
		"data-ssr": false
	};
	payload.id = "__NUXT_DATA__";
	if (opts.src) payload["data-src"] = opts.src;
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
/**
* Encode forward slashes as unicode escape sequences to prevent
* Google from treating them as internal links and trying to crawl them.
* @see https://github.com/nuxt/nuxt/issues/24175
*/
function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, prefetchLinks, ...initial } = ssrContext.payload;
	const payload = {
		data,
		prerenderedAt
	};
	if (prefetchLinks?.length) payload.prefetchLinks = prefetchLinks;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

//#region src/runtime/handlers/renderer.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const PAYLOAD_BUILD_ID_PARAM = "_b";
const handler = defineRenderHandler((event) => {
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) throw createError({
		status: 404,
		statusText: "Page Not Found: /__nuxt_error",
		message: "Page Not Found: /__nuxt_error"
	});
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	const ssrContext = createSSRContext(event);
	ssrContext.head.push(appHead);
	if (ssrError) {
		const status = ssrError.status || ssrError.statusCode;
		if (status) ssrError.status = ssrError.statusCode = Number.parseInt(status);
		if (typeof ssrError.data === "string") try {
			ssrError.data = destr(ssrError.data);
		} catch {}
		setSSRError(ssrContext, ssrError);
	}
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) ssrContext.noSSR = true;
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && ((routeOptions.isr || routeOptions.cache));
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const payloadURL = new URL(ssrContext.url, "http://localhost");
		const url = payloadURL.pathname.slice(0, -`/${PAYLOAD_FILENAME}`.length) || "/";
		payloadURL.searchParams.delete(PAYLOAD_BUILD_ID_PARAM);
		ssrContext.url = url + payloadURL.search;
		event._path = event.node.req.url = ssrContext.url;
		getPayloadCacheKey(ssrContext.url);
	}
	_PAYLOAD_EXTRACTION ? buildPayloadURL(ssrContext) : void 0;
	const renderer = await getRenderer();
	const canStream = NUXT_SSR_STREAMING;
	const renderRouteContext = {
		canStream,
		prefersStream: false
	};
	await nitroApp.hooks.callHook("render:route", renderRouteContext, { event });
	const _rendered = await (renderer.renderToString(ssrContext)).catch(async (error) => {
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") return {};
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	if (ssrContext.payload?.error && !ssrError) throw ssrContext.payload.error;
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	const link = [];
	for (const resource of Object.values(styles)) {
		if ("inline" in getQuery(resource.file)) continue;
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) ssrContext.head.push({ link });
	if (!NO_SCRIPTS) {
		const dependencyOptions = ssrContext["~lazyHydratedModules"]?.size ? { exclude: ssrContext["~lazyHydratedModules"] } : void 0;
		const excludeHrefs = new Set(link.map((l) => l.href));
		for (const id of ssrContext["~neverHydratedModules"] ?? []) {
			const file = renderer.rendererContext.manifest?.[id]?.file;
			if (file) excludeHrefs.add(renderer.rendererContext.buildAssetsURL(file));
		}
		const hints = [];
		for (const l of getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
		for (const l of getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
		ssrContext.head.push({ link: hints });
		ssrContext.head.push({ script: renderPayloadJsonScript({
			ssrContext,
			data: stripInlineOnlyPayloadFields(ssrContext.payload)
		})   }, {
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) });
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function getPayloadCacheKey(url) {
	const { pathname, search } = new URL(url, "http://localhost");
	return (pathname === "/" ? "/" : pathname.replace(/\/$/, "")) + (search ? encodeURIComponent(search) : "") + ".json";
}
function buildPayloadURL(ssrContext) {
	const url = new URL(ssrContext.url, "http://localhost");
	const baseURL = ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL;
	const payloadURL = joinURL(baseURL, url.pathname, PAYLOAD_FILENAME);
	url.searchParams.set(PAYLOAD_BUILD_ID_PARAM, ssrContext.runtimeConfig.app.buildId);
	return payloadURL + url.search;
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) result.push(chunk);
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) return "";
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
function stripInlineOnlyPayloadFields(payload) {
	if (!payload.prefetchLinks) return payload;
	const { prefetchLinks: _, ...rest } = payload;
	return rest;
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
