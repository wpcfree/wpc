﻿/*
Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function() {
	if (window.CKEDITOR && window.CKEDITOR.dom) return;
	window.CKEDITOR || (window.CKEDITOR = function() {
		var a = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,
			d = {
				timestamp: "",
				version: "4.5.9",
				revision: "a35abfe",
				rnd: Math.floor(900 * Math.random()) + 100,
				_: {
					pending: [],
					basePathSrcPattern: a
				},
				status: "unloaded",
				basePath: function() {
					var b = window.CKEDITOR_BASEPATH || "";
					if (!b) for (var c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
						var k = c[d].src.match(a);
						if (k) {
							b = k[1];
							break
						}
					} - 1 == b.indexOf(":/") && "//" != b.slice(0, 2) && (b = 0 === b.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + b : location.href.match(/^[^\?]*\/(?:)/)[0] + b);
					if (!b) throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
					return b
				}(),
				getUrl: function(a) {
					-1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
					this.timestamp && "/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
					return a
				},
				domReady: function() {
					function a() {
						try {
							document.addEventListener ? (document.removeEventListener("DOMContentLoaded", a, !1), b()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), b())
						} catch (c) {}
					}

					function b() {
						for (var a; a = c.shift();) a()
					}
					var c = [];
					return function(b) {
						function d() {
							try {
								document.documentElement.doScroll("left")
							} catch (f) {
								setTimeout(d, 1);
								return
							}
							a()
						}
						c.push(b);
						"complete" === document.readyState && setTimeout(a, 1);
						if (1 == c.length) if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, !1), window.addEventListener("load", a, !1);
						else if (document.attachEvent) {
							document.attachEvent("onreadystatechange", a);
							window.attachEvent("onload", a);
							b = !1;
							try {
								b = !window.frameElement
							} catch (w) {}
							document.documentElement.doScroll && b && d()
						}
					}
				}()
			},
			b = window.CKEDITOR_GETURL;
		if (b) {
			var c = d.getUrl;
			d.getUrl = function(a) {
				return b.call(d, a) || c.call(d, a)
			}
		}
		return d
	}());
	CKEDITOR.event || (CKEDITOR.event = function() {}, CKEDITOR.event.implementOn = function(a) {
		var d = CKEDITOR.event.prototype,
			b;
		for (b in d) null == a[b] && (a[b] = d[b])
	}, CKEDITOR.event.prototype = function() {
		function a(a) {
			var e = d(this);
			return e[a] || (e[a] = new b(a))
		}
		var d = function(a) {
				a = a.getPrivate && a.getPrivate() || a._ || (a._ = {});
				return a.events || (a.events = {})
			},
			b = function(a) {
				this.name = a;
				this.listeners = []
			};
		b.prototype = {
			getListenerIndex: function(a) {
				for (var b = 0, d = this.listeners; b < d.length; b++) if (d[b].fn == a) return b;
				return -1
			}
		};
		return {
			define: function(b, d) {
				var g = a.call(this, b);
				CKEDITOR.tools.extend(g, d, !0)
			},
			on: function(b, d, g, l, k) {
				function q(a, f, y, k) {
					a = {
						name: b,
						sender: this,
						editor: a,
						data: f,
						listenerData: l,
						stop: y,
						cancel: k,
						removeListener: w
					};
					return !1 === d.call(g, a) ? !1 : a.data
				}

				function w() {
					y.removeListener(b, d)
				}
				var f = a.call(this, b);
				if (0 > f.getListenerIndex(d)) {
					f = f.listeners;
					g || (g = this);
					isNaN(k) && (k = 10);
					var y = this;
					q.fn = d;
					q.priority = k;
					for (var A = f.length - 1; 0 <= A; A--) if (f[A].priority <= k) return f.splice(A + 1, 0, q), {
						removeListener: w
					};
					f.unshift(q)
				}
				return {
					removeListener: w
				}
			},
			once: function() {
				var a = Array.prototype.slice.call(arguments),
					b = a[1];
				a[1] = function(a) {
					a.removeListener();
					return b.apply(this, arguments)
				};
				return this.on.apply(this, a)
			},
			capture: function() {
				CKEDITOR.event.useCapture = 1;
				var a = this.on.apply(this, arguments);
				CKEDITOR.event.useCapture = 0;
				return a
			},
			fire: function() {
				var a = 0,
					b = function() {
						a = 1
					},
					g = 0,
					l = function() {
						g = 1
					};
				return function(k, q, w) {
					var f = d(this)[k];
					k = a;
					var y = g;
					a = g = 0;
					if (f) {
						var A = f.listeners;
						if (A.length) for (var A = A.slice(0), t, D = 0; D < A.length; D++) {
							if (f.errorProof) try {
								t = A[D].call(this, w, q, b, l)
							} catch (p) {} else t = A[D].call(this, w, q, b, l);
							!1 === t ? g = 1 : "undefined" != typeof t && (q = t);
							if (a || g) break
						}
					}
					q = g ? !1 : "undefined" == typeof q ? !0 : q;
					a = k;
					g = y;
					return q
				}
			}(),
			fireOnce: function(a, b, g) {
				b = this.fire(a, b, g);
				delete d(this)[a];
				return b
			},
			removeListener: function(a, b) {
				var g = d(this)[a];
				if (g) {
					var l = g.getListenerIndex(b);
					0 <= l && g.listeners.splice(l, 1)
				}
			},
			removeAllListeners: function() {
				var a = d(this),
					b;
				for (b in a) delete a[b]
			},
			hasListeners: function(a) {
				return (a = d(this)[a]) && 0 < a.listeners.length
			}
		}
	}());
	CKEDITOR.editor || (CKEDITOR.editor = function() {
		CKEDITOR._.pending.push([this, arguments]);
		CKEDITOR.event.call(this)
	}, CKEDITOR.editor.prototype.fire = function(a, d) {
		a in {
			instanceReady: 1,
			loaded: 1
		} && (this[a] = !0);
		return CKEDITOR.event.prototype.fire.call(this, a, d, this)
	}, CKEDITOR.editor.prototype.fireOnce = function(a, d) {
		a in {
			instanceReady: 1,
			loaded: 1
		} && (this[a] = !0);
		return CKEDITOR.event.prototype.fireOnce.call(this, a, d, this)
	}, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype));
	CKEDITOR.env || (CKEDITOR.env = function() {
		var a = navigator.userAgent.toLowerCase(),
			d = a.match(/edge[ \/](\d+.?\d*)/),
			b = -1 < a.indexOf("trident/"),
			b = !(!d && !b),
			b = {
				ie: b,
				edge: !! d,
				webkit: !b && -1 < a.indexOf(" applewebkit/"),
				air: -1 < a.indexOf(" adobeair/"),
				mac: -1 < a.indexOf("macintosh"),
				quirks: "BackCompat" == document.compatMode && (!document.documentMode || 10 > document.documentMode),
				mobile: -1 < a.indexOf("mobile"),
				iOS: /(ipad|iphone|ipod)/.test(a),
				isCustomDomain: function() {
					if (!this.ie) return !1;
					var a = document.domain,
						b = window.location.hostname;
					return a != b && a != "[" + b + "]"
				},
				secure: "https:" == location.protocol
			};
		b.gecko = "Gecko" == navigator.product && !b.webkit && !b.ie;
		b.webkit && (-1 < a.indexOf("chrome") ? b.chrome = !0 : b.safari = !0);
		var c = 0;
		b.ie && (c = d ? parseFloat(d[1]) : b.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode, b.ie9Compat = 9 == c, b.ie8Compat = 8 == c, b.ie7Compat = 7 == c, b.ie6Compat = 7 > c || b.quirks);
		b.gecko && (d = a.match(/rv:([\d\.]+)/)) && (d = d[1].split("."), c = 1E4 * d[0] + 100 * (d[1] || 0) + 1 * (d[2] || 0));
		b.air && (c = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
		b.webkit && (c = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
		b.version = c;
		b.isCompatible = !(b.ie && 7 > c) && !(b.gecko && 4E4 > c) && !(b.webkit && 534 > c);
		b.hidpi = 2 <= window.devicePixelRatio;
		b.needsBrFiller = b.gecko || b.webkit || b.ie && 10 < c;
		b.needsNbspFiller = b.ie && 11 > c;
		b.cssClass = "cke_browser_" + (b.ie ? "ie" : b.gecko ? "gecko" : b.webkit ? "webkit" : "unknown");
		b.quirks && (b.cssClass += " cke_browser_quirks");
		b.ie && (b.cssClass += " cke_browser_ie" + (b.quirks ? "6 cke_browser_iequirks" : b.version));
		b.air && (b.cssClass += " cke_browser_air");
		b.iOS && (b.cssClass += " cke_browser_ios");
		b.hidpi && (b.cssClass += " cke_hidpi");
		return b
	}());
	"unloaded" == CKEDITOR.status &&
	function() {
		CKEDITOR.event.implementOn(CKEDITOR);
		CKEDITOR.loadFullCore = function() {
			if ("basic_ready" != CKEDITOR.status) CKEDITOR.loadFullCore._load = 1;
			else {
				delete CKEDITOR.loadFullCore;
				var a = document.createElement("script");
				a.type = "text/javascript";
				a.src = CKEDITOR.basePath + "ckeditor.js";
				document.getElementsByTagName("head")[0].appendChild(a)
			}
		};
		CKEDITOR.loadFullCoreTimeout = 0;
		CKEDITOR.add = function(a) {
			(this._.pending || (this._.pending = [])).push(a)
		};
		(function() {
			CKEDITOR.domReady(function() {
				var a = CKEDITOR.loadFullCore,
					d = CKEDITOR.loadFullCoreTimeout;
				a && (CKEDITOR.status = "basic_ready", a && a._load ? a() : d && setTimeout(function() {
					CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
				}, 1E3 * d))
			})
		})();
		CKEDITOR.status = "basic_loaded"
	}();
	"use strict";
	CKEDITOR.VERBOSITY_WARN = 1;
	CKEDITOR.VERBOSITY_ERROR = 2;
	CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR;
	CKEDITOR.warn = function(a, d) {
		CKEDITOR.verbosity & CKEDITOR.VERBOSITY_WARN && CKEDITOR.fire("log", {
			type: "warn",
			errorCode: a,
			additionalData: d
		})
	};
	CKEDITOR.error = function(a, d) {
		CKEDITOR.verbosity & CKEDITOR.VERBOSITY_ERROR && CKEDITOR.fire("log", {
			type: "error",
			errorCode: a,
			additionalData: d
		})
	};
	CKEDITOR.on("log", function(a) {
		if (window.console && window.console.log) {
			var d = console[a.data.type] ? a.data.type : "log",
				b = a.data.errorCode;
			if (a = a.data.additionalData) console[d]("[CKEDITOR] Error code: " + b + ".", a);
			else console[d]("[CKEDITOR] Error code: " + b + ".");
			console[d]("[CKEDITOR] For more information about this error go to http://docs.ckeditor.com/#!/guide/dev_errors-section-" + b)
		}
	}, null, null, 999);
	CKEDITOR.dom = {};
	(function() {
		var a = [],
			d = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "",
			b = /&/g,
			c = />/g,
			e = /</g,
			g = /"/g,
			l = /&(lt|gt|amp|quot|nbsp|shy|#\d{1,5});/g,
			k = {
				lt: "<",
				gt: ">",
				amp: "&",
				quot: '"',
				nbsp: " ",
				shy: "­"
			},
			q = function(a, f) {
				return "#" == f[0] ? String.fromCharCode(parseInt(f.slice(1), 10)) : k[f]
			};
		CKEDITOR.on("reset", function() {
			a = []
		});
		CKEDITOR.tools = {
			arrayCompare: function(a, f) {
				if (!a && !f) return !0;
				if (!a || !f || a.length != f.length) return !1;
				for (var b = 0; b < a.length; b++) if (a[b] != f[b]) return !1;
				return !0
			},
			getIndex: function(a, f) {
				for (var b = 0; b < a.length; ++b) if (f(a[b])) return b;
				return -1
			},
			clone: function(a) {
				var f;
				if (a && a instanceof Array) {
					f = [];
					for (var b = 0; b < a.length; b++) f[b] = CKEDITOR.tools.clone(a[b]);
					return f
				}
				if (null === a || "object" != typeof a || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp || a.nodeType || a.window === a) return a;
				f = new a.constructor;
				for (b in a) f[b] = CKEDITOR.tools.clone(a[b]);
				return f
			},
			capitalize: function(a, f) {
				return a.charAt(0).toUpperCase() + (f ? a.slice(1) : a.slice(1).toLowerCase())
			},
			extend: function(a) {
				var f = arguments.length,
					b, c;
				"boolean" == typeof(b = arguments[f - 1]) ? f-- : "boolean" == typeof(b = arguments[f - 2]) && (c = arguments[f - 1], f -= 2);
				for (var k = 1; k < f; k++) {
					var d = arguments[k],
						p;
					for (p in d) if (!0 === b || null == a[p]) if (!c || p in c) a[p] = d[p]
				}
				return a
			},
			prototypedCopy: function(a) {
				var f = function() {};
				f.prototype = a;
				return new f
			},
			copy: function(a) {
				var f = {},
					b;
				for (b in a) f[b] = a[b];
				return f
			},
			isArray: function(a) {
				return "[object Array]" == Object.prototype.toString.call(a)
			},
			isEmpty: function(a) {
				for (var f in a) if (a.hasOwnProperty(f)) return !1;
				return !0
			},
			cssVendorPrefix: function(a, f, b) {
				if (b) return d + a + ":" + f + ";" + a + ":" + f;
				b = {};
				b[a] = f;
				b[d + a] = f;
				return b
			},
			cssStyleToDomStyle: function() {
				var a = document.createElement("div").style,
					f = "undefined" != typeof a.cssFloat ? "cssFloat" : "undefined" != typeof a.styleFloat ? "styleFloat" : "float";
				return function(a) {
					return "float" == a ? f : a.replace(/-./g, function(a) {
						return a.substr(1).toUpperCase()
					})
				}
			}(),
			buildStyleHtml: function(a) {
				a = [].concat(a);
				for (var f, b = [], c = 0; c < a.length; c++) if (f = a[c]) / @import | [{}] / .test(f) ? b.push("<style>" + f + "</style>") : b.push('<link type="text/css" rel=stylesheet href="' + f + '">');
				return b.join("")
			},
			htmlEncode: function(a) {
				return void 0 === a || null === a ? "" : String(a).replace(b, "&amp;").replace(c, "&gt;").replace(e, "&lt;")
			},
			htmlDecode: function(a) {
				return a.replace(l, q)
			},
			htmlEncodeAttr: function(a) {
				return CKEDITOR.tools.htmlEncode(a).replace(g, "&quot;")
			},
			htmlDecodeAttr: function(a) {
				return CKEDITOR.tools.htmlDecode(a)
			},
			transformPlainTextToHtml: function(a, f) {
				var b = f == CKEDITOR.ENTER_BR,
					c = this.htmlEncode(a.replace(/\r\n/g, "\n")),
					c = c.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"),
					k = f == CKEDITOR.ENTER_P ? "p" : "div";
				if (!b) {
					var d = /\n{2}/g;
					if (d.test(c)) var p = "<" + k + ">",
						q = "</" + k + ">",
						c = p + c.replace(d, function() {
							return q + p
						}) + q
				}
				c = c.replace(/\n/g, "<br>");
				b || (c = c.replace(new RegExp("<br>(?=</" + k + ">)"), function(a) {
					return CKEDITOR.tools.repeat(a, 2)
				}));
				c = c.replace(/^ | $/g, "&nbsp;");
				return c = c.replace(/(>|\s) /g, function(a, f) {
					return f + "&nbsp;"
				}).replace(/ (?=<)/g, "&nbsp;")
			},
			getNextNumber: function() {
				var a = 0;
				return function() {
					return ++a
				}
			}(),
			getNextId: function() {
				return "cke_" + this.getNextNumber()
			},
			getUniqueId: function() {
				for (var a = "e", f = 0; 8 > f; f++) a += Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
				return a
			},
			override: function(a, f) {
				var b = f(a);
				b.prototype = a.prototype;
				return b
			},
			setTimeout: function(a, f, b, c, k) {
				k || (k = window);
				b || (b = k);
				return k.setTimeout(function() {
					c ? a.apply(b, [].concat(c)) : a.apply(b)
				}, f || 0)
			},
			trim: function() {
				var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
				return function(f) {
					return f.replace(a, "")
				}
			}(),
			ltrim: function() {
				var a = /^[ \t\n\r]+/g;
				return function(f) {
					return f.replace(a, "")
				}
			}(),
			rtrim: function() {
				var a = /[ \t\n\r]+$/g;
				return function(f) {
					return f.replace(a, "")
				}
			}(),
			indexOf: function(a, f) {
				if ("function" == typeof f) for (var b = 0, c = a.length; b < c; b++) {
					if (f(a[b])) return b
				} else {
					if (a.indexOf) return a.indexOf(f);
					b = 0;
					for (c = a.length; b < c; b++) if (a[b] === f) return b
				}
				return -1
			},
			search: function(a, f) {
				var b = CKEDITOR.tools.indexOf(a, f);
				return 0 <= b ? a[b] : null
			},
			bind: function(a, f) {
				return function() {
					return a.apply(f, arguments)
				}
			},
			createClass: function(a) {
				var f = a.$,
					b = a.base,
					c = a.privates || a._,
					k = a.proto;
				a = a.statics;
				!f && (f = function() {
					b && this.base.apply(this, arguments)
				});
				if (c) var d = f,
					f = function() {
						var a = this._ || (this._ = {}),
							b;
						for (b in c) {
							var f = c[b];
							a[b] = "function" == typeof f ? CKEDITOR.tools.bind(f, this) : f
						}
						d.apply(this, arguments)
					};
				b && (f.prototype = this.prototypedCopy(b.prototype), f.prototype.constructor = f, f.base = b, f.baseProto = b.prototype, f.prototype.base = function() {
					this.base = b.prototype.base;
					b.apply(this, arguments);
					this.base = arguments.callee
				});
				k && this.extend(f.prototype, k, !0);
				a && this.extend(f, a, !0);
				return f
			},
			addFunction: function(b, f) {
				return a.push(function() {
					return b.apply(f || this, arguments)
				}) - 1
			},
			removeFunction: function(b) {
				a[b] = null
			},
			callFunction: function(b) {
				var f = a[b];
				return f && f.apply(window, Array.prototype.slice.call(arguments, 1))
			},
			cssLength: function() {
				var a = /^-?\d+\.?\d*px$/,
					b;
				return function(c) {
					b = CKEDITOR.tools.trim(c + "") + "px";
					return a.test(b) ? b : c || ""
				}
			}(),
			convertToPx: function() {
				var a;
				return function(b) {
					a || (a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document), CKEDITOR.document.getBody().append(a));
					return /%$/.test(b) ? b : (a.setStyle("width", b), a.$.clientWidth)
				}
			}(),
			repeat: function(a, b) {
				return Array(b + 1).join(a)
			},
			tryThese: function() {
				for (var a, b = 0, c = arguments.length; b < c; b++) {
					var k = arguments[b];
					try {
						a = k();
						break
					} catch (d) {}
				}
				return a
			},
			genKey: function() {
				return Array.prototype.slice.call(arguments).join("-")
			},
			defer: function(a) {
				return function() {
					var b = arguments,
						c = this;
					window.setTimeout(function() {
						a.apply(c, b)
					}, 0)
				}
			},
			normalizeCssText: function(a, b) {
				var c = [],
					k, d = CKEDITOR.tools.parseCssText(a, !0, b);
				for (k in d) c.push(k + ":" + d[k]);
				c.sort();
				return c.length ? c.join(";") + ";" : ""
			},
			convertRgbToHex: function(a) {
				return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(a, b, c, k) {
					a = [b, c, k];
					for (b = 0; 3 > b; b++) a[b] = ("0" + parseInt(a[b], 10).toString(16)).slice(-2);
					return "#" + a.join("")
				})
			},
			parseCssText: function(a, b, c) {
				var k = {};
				c && (c = new CKEDITOR.dom.element("span"), c.setAttribute("style", a), a = CKEDITOR.tools.convertRgbToHex(c.getAttribute("style") || ""));
				if (!a || ";" == a) return k;
				a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, d) {
					b && (c = c.toLowerCase(), "font-family" == c && (d = d.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ",")), d = CKEDITOR.tools.trim(d));
					k[c] = d
				});
				return k
			},
			writeCssText: function(a, b) {
				var c, k = [];
				for (c in a) k.push(c + ":" + a[c]);
				b && k.sort();
				return k.join("; ")
			},
			objectCompare: function(a, b, c) {
				var k;
				if (!a && !b) return !0;
				if (!a || !b) return !1;
				for (k in a) if (a[k] != b[k]) return !1;
				if (!c) for (k in b) if (a[k] != b[k]) return !1;
				return !0
			},
			objectKeys: function(a) {
				var b = [],
					c;
				for (c in a) b.push(c);
				return b
			},
			convertArrayToObject: function(a, b) {
				var c = {};
				1 == arguments.length && (b = !0);
				for (var k = 0, d = a.length; k < d; ++k) c[a[k]] = b;
				return c
			},
			fixDomain: function() {
				for (var a;;) try {
					a = window.parent.document.domain;
					break
				} catch (b) {
					a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
					if (!a) break;
					document.domain = a
				}
				return !!a
			},
			eventsBuffer: function(a, b, c) {
				function k() {
					q = (new Date).getTime();
					d = !1;
					c ? b.call(c) : b()
				}
				var d, q = 0;
				return {
					input: function() {
						if (!d) {
							var b = (new Date).getTime() - q;
							b < a ? d = setTimeout(k, a - b) : k()
						}
					},
					reset: function() {
						d && clearTimeout(d);
						d = q = 0
					}
				}
			},
			enableHtml5Elements: function(a, b) {
				for (var c = "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video".split(" "), k = c.length, d; k--;) d = a.createElement(c[k]), b && a.appendChild(d)
			},
			checkIfAnyArrayItemMatches: function(a, b) {
				for (var c = 0, k = a.length; c < k; ++c) if (a[c].match(b)) return !0;
				return !1
			},
			checkIfAnyObjectPropertyMatches: function(a, b) {
				for (var c in a) if (c.match(b)) return !0;
				return !1
			},
			transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==",
			getCookie: function(a) {
				a = a.toLowerCase();
				for (var b = document.cookie.split(";"), c, k, d = 0; d < b.length; d++) if (c = b[d].split("="), k = decodeURIComponent(CKEDITOR.tools.trim(c[0]).toLowerCase()), k === a) return decodeURIComponent(1 < c.length ? c[1] : "");
				return null
			},
			setCookie: function(a, b) {
				document.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(b) + ";path=/"
			},
			getCsrfToken: function() {
				var a = CKEDITOR.tools.getCookie("ckCsrfToken");
				if (!a || 40 != a.length) {
					var a = [],
						b = "";
					if (window.crypto && window.crypto.getRandomValues) a = new Uint8Array(40), window.crypto.getRandomValues(a);
					else for (var c = 0; 40 > c; c++) a.push(Math.floor(256 * Math.random()));
					for (c = 0; c < a.length; c++) var k = "abcdefghijklmnopqrstuvwxyz0123456789".charAt(a[c] % 36),
						b = b + (.5 < Math.random() ? k.toUpperCase() : k);
					a = b;
					CKEDITOR.tools.setCookie("ckCsrfToken", a)
				}
				return a
			}
		}
	})();
	CKEDITOR.dtd = function() {
		var a = CKEDITOR.tools.extend,
			d = function(a, b) {
				for (var c = CKEDITOR.tools.clone(a), k = 1; k < arguments.length; k++) {
					b = arguments[k];
					for (var d in b) delete c[d]
				}
				return c
			},
			b = {},
			c = {},
			e = {
				address: 1,
				article: 1,
				aside: 1,
				blockquote: 1,
				details: 1,
				div: 1,
				dl: 1,
				fieldset: 1,
				figure: 1,
				footer: 1,
				form: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				header: 1,
				hgroup: 1,
				hr: 1,
				main: 1,
				menu: 1,
				nav: 1,
				ol: 1,
				p: 1,
				pre: 1,
				section: 1,
				table: 1,
				ul: 1
			},
			g = {
				command: 1,
				link: 1,
				meta: 1,
				noscript: 1,
				script: 1,
				style: 1
			},
			l = {},
			k = {
				"#": 1
			},
			q = {
				center: 1,
				dir: 1,
				noframes: 1
			};
		a(b, {
			a: 1,
			abbr: 1,
			area: 1,
			audio: 1,
			b: 1,
			bdi: 1,
			bdo: 1,
			br: 1,
			button: 1,
			canvas: 1,
			cite: 1,
			code: 1,
			command: 1,
			datalist: 1,
			del: 1,
			dfn: 1,
			em: 1,
			embed: 1,
			i: 1,
			iframe: 1,
			img: 1,
			input: 1,
			ins: 1,
			kbd: 1,
			keygen: 1,
			label: 1,
			map: 1,
			mark: 1,
			meter: 1,
			noscript: 1,
			object: 1,
			output: 1,
			progress: 1,
			q: 1,
			ruby: 1,
			s: 1,
			samp: 1,
			script: 1,
			select: 1,
			small: 1,
			span: 1,
			strong: 1,
			sub: 1,
			sup: 1,
			textarea: 1,
			time: 1,
			u: 1,
			"var": 1,
			video: 1,
			wbr: 1
		}, k, {
			acronym: 1,
			applet: 1,
			basefont: 1,
			big: 1,
			font: 1,
			isindex: 1,
			strike: 1,
			style: 1,
			tt: 1
		});
		a(c, e, b, q);
		d = {
			a: d(b, {
				a: 1,
				button: 1
			}),
			abbr: b,
			address: c,
			area: l,
			article: c,
			aside: c,
			audio: a({
				source: 1,
				track: 1
			}, c),
			b: b,
			base: l,
			bdi: b,
			bdo: b,
			blockquote: c,
			body: c,
			br: l,
			button: d(b, {
				a: 1,
				button: 1
			}),
			canvas: b,
			caption: c,
			cite: b,
			code: b,
			col: l,
			colgroup: {
				col: 1
			},
			command: l,
			datalist: a({
				option: 1
			}, b),
			dd: c,
			del: b,
			details: a({
				summary: 1
			}, c),
			dfn: b,
			div: c,
			dl: {
				dt: 1,
				dd: 1
			},
			dt: c,
			em: b,
			embed: l,
			fieldset: a({
				legend: 1
			}, c),
			figcaption: c,
			figure: a({
				figcaption: 1
			}, c),
			footer: c,
			form: c,
			h1: b,
			h2: b,
			h3: b,
			h4: b,
			h5: b,
			h6: b,
			head: a({
				title: 1,
				base: 1
			}, g),
			header: c,
			hgroup: {
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1
			},
			hr: l,
			html: a({
				head: 1,
				body: 1
			}, c, g),
			i: b,
			iframe: k,
			img: l,
			input: l,
			ins: b,
			kbd: b,
			keygen: l,
			label: b,
			legend: b,
			li: c,
			link: l,
			main: c,
			map: c,
			mark: b,
			menu: a({
				li: 1
			}, c),
			meta: l,
			meter: d(b, {
				meter: 1
			}),
			nav: c,
			noscript: a({
				link: 1,
				meta: 1,
				style: 1
			}, b),
			object: a({
				param: 1
			}, b),
			ol: {
				li: 1
			},
			optgroup: {
				option: 1
			},
			option: k,
			output: b,
			p: b,
			param: l,
			pre: b,
			progress: d(b, {
				progress: 1
			}),
			q: b,
			rp: b,
			rt: b,
			ruby: a({
				rp: 1,
				rt: 1
			}, b),
			s: b,
			samp: b,
			script: k,
			section: c,
			select: {
				optgroup: 1,
				option: 1
			},
			small: b,
			source: l,
			span: b,
			strong: b,
			style: k,
			sub: b,
			summary: a({
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1
			}, b),
			sup: b,
			table: {
				caption: 1,
				colgroup: 1,
				thead: 1,
				tfoot: 1,
				tbody: 1,
				tr: 1
			},
			tbody: {
				tr: 1
			},
			td: c,
			textarea: k,
			tfoot: {
				tr: 1
			},
			th: c,
			thead: {
				tr: 1
			},
			time: d(b, {
				time: 1
			}),
			title: k,
			tr: {
				th: 1,
				td: 1
			},
			track: l,
			u: b,
			ul: {
				li: 1
			},
			"var": b,
			video: a({
				source: 1,
				track: 1
			}, c),
			wbr: l,
			acronym: b,
			applet: a({
				param: 1
			}, c),
			basefont: l,
			big: b,
			center: c,
			dialog: l,
			dir: {
				li: 1
			},
			font: b,
			isindex: l,
			noframes: c,
			strike: b,
			tt: b
		};
		a(d, {
			$block: a({
				audio: 1,
				dd: 1,
				dt: 1,
				figcaption: 1,
				li: 1,
				video: 1
			}, e, q),
			$blockLimit: {
				article: 1,
				aside: 1,
				audio: 1,
				body: 1,
				caption: 1,
				details: 1,
				dir: 1,
				div: 1,
				dl: 1,
				fieldset: 1,
				figcaption: 1,
				figure: 1,
				footer: 1,
				form: 1,
				header: 1,
				hgroup: 1,
				main: 1,
				menu: 1,
				nav: 1,
				ol: 1,
				section: 1,
				table: 1,
				td: 1,
				th: 1,
				tr: 1,
				ul: 1,
				video: 1
			},
			$cdata: {
				script: 1,
				style: 1
			},
			$editable: {
				address: 1,
				article: 1,
				aside: 1,
				blockquote: 1,
				body: 1,
				details: 1,
				div: 1,
				fieldset: 1,
				figcaption: 1,
				footer: 1,
				form: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				header: 1,
				hgroup: 1,
				main: 1,
				nav: 1,
				p: 1,
				pre: 1,
				section: 1
			},
			$empty: {
				area: 1,
				base: 1,
				basefont: 1,
				br: 1,
				col: 1,
				command: 1,
				dialog: 1,
				embed: 1,
				hr: 1,
				img: 1,
				input: 1,
				isindex: 1,
				keygen: 1,
				link: 1,
				meta: 1,
				param: 1,
				source: 1,
				track: 1,
				wbr: 1
			},
			$inline: b,
			$list: {
				dl: 1,
				ol: 1,
				ul: 1
			},
			$listItem: {
				dd: 1,
				dt: 1,
				li: 1
			},
			$nonBodyContent: a({
				body: 1,
				head: 1,
				html: 1
			}, d.head),
			$nonEditable: {
				applet: 1,
				audio: 1,
				button: 1,
				embed: 1,
				iframe: 1,
				map: 1,
				object: 1,
				option: 1,
				param: 1,
				script: 1,
				textarea: 1,
				video: 1
			},
			$object: {
				applet: 1,
				audio: 1,
				button: 1,
				hr: 1,
				iframe: 1,
				img: 1,
				input: 1,
				object: 1,
				select: 1,
				table: 1,
				textarea: 1,
				video: 1
			},
			$removeEmpty: {
				abbr: 1,
				acronym: 1,
				b: 1,
				bdi: 1,
				bdo: 1,
				big: 1,
				cite: 1,
				code: 1,
				del: 1,
				dfn: 1,
				em: 1,
				font: 1,
				i: 1,
				ins: 1,
				label: 1,
				kbd: 1,
				mark: 1,
				meter: 1,
				output: 1,
				q: 1,
				ruby: 1,
				s: 1,
				samp: 1,
				small: 1,
				span: 1,
				strike: 1,
				strong: 1,
				sub: 1,
				sup: 1,
				time: 1,
				tt: 1,
				u: 1,
				"var": 1
			},
			$tabIndex: {
				a: 1,
				area: 1,
				button: 1,
				input: 1,
				object: 1,
				select: 1,
				textarea: 1
			},
			$tableContent: {
				caption: 1,
				col: 1,
				colgroup: 1,
				tbody: 1,
				td: 1,
				tfoot: 1,
				th: 1,
				thead: 1,
				tr: 1
			},
			$transparent: {
				a: 1,
				audio: 1,
				canvas: 1,
				del: 1,
				ins: 1,
				map: 1,
				noscript: 1,
				object: 1,
				video: 1
			},
			$intermediate: {
				caption: 1,
				colgroup: 1,
				dd: 1,
				dt: 1,
				figcaption: 1,
				legend: 1,
				li: 1,
				optgroup: 1,
				option: 1,
				rp: 1,
				rt: 1,
				summary: 1,
				tbody: 1,
				td: 1,
				tfoot: 1,
				th: 1,
				thead: 1,
				tr: 1
			}
		});
		return d
	}();
	CKEDITOR.dom.event = function(a) {
		this.$ = a
	};
	CKEDITOR.dom.event.prototype = {
		getKey: function() {
			return this.$.keyCode || this.$.which
		},
		getKeystroke: function() {
			var a = this.getKey();
			if (this.$.ctrlKey || this.$.metaKey) a += CKEDITOR.CTRL;
			this.$.shiftKey && (a += CKEDITOR.SHIFT);
			this.$.altKey && (a += CKEDITOR.ALT);
			return a
		},
		preventDefault: function(a) {
			var d = this.$;
			d.preventDefault ? d.preventDefault() : d.returnValue = !1;
			a && this.stopPropagation()
		},
		stopPropagation: function() {
			var a = this.$;
			a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
		},
		getTarget: function() {
			var a = this.$.target || this.$.srcElement;
			return a ? new CKEDITOR.dom.node(a) : null
		},
		getPhase: function() {
			return this.$.eventPhase || 2
		},
		getPageOffset: function() {
			var a = this.getTarget().getDocument().$;
			return {
				x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
				y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
			}
		}
	};
	CKEDITOR.CTRL = 1114112;
	CKEDITOR.SHIFT = 2228224;
	CKEDITOR.ALT = 4456448;
	CKEDITOR.EVENT_PHASE_CAPTURING = 1;
	CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
	CKEDITOR.EVENT_PHASE_BUBBLING = 3;
	CKEDITOR.dom.domObject = function(a) {
		a && (this.$ = a)
	};
	CKEDITOR.dom.domObject.prototype = function() {
		var a = function(a, b) {
				return function(c) {
					"undefined" != typeof CKEDITOR && a.fire(b, new CKEDITOR.dom.event(c))
				}
			};
		return {
			getPrivate: function() {
				var a;
				(a = this.getCustomData("_")) || this.setCustomData("_", a = {});
				return a
			},
			on: function(d) {
				var b = this.getCustomData("_cke_nativeListeners");
				b || (b = {}, this.setCustomData("_cke_nativeListeners", b));
				b[d] || (b = b[d] = a(this, d), this.$.addEventListener ? this.$.addEventListener(d, b, !! CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + d, b));
				return CKEDITOR.event.prototype.on.apply(this, arguments)
			},
			removeListener: function(a) {
				CKEDITOR.event.prototype.removeListener.apply(this, arguments);
				if (!this.hasListeners(a)) {
					var b = this.getCustomData("_cke_nativeListeners"),
						c = b && b[a];
					c && (this.$.removeEventListener ? this.$.removeEventListener(a, c, !1) : this.$.detachEvent && this.$.detachEvent("on" + a, c), delete b[a])
				}
			},
			removeAllListeners: function() {
				var a = this.getCustomData("_cke_nativeListeners"),
					b;
				for (b in a) {
					var c = a[b];
					this.$.detachEvent ? this.$.detachEvent("on" + b, c) : this.$.removeEventListener && this.$.removeEventListener(b, c, !1);
					delete a[b]
				}
				CKEDITOR.event.prototype.removeAllListeners.call(this)
			}
		}
	}();
	(function(a) {
		var d = {};
		CKEDITOR.on("reset", function() {
			d = {}
		});
		a.equals = function(a) {
			try {
				return a && a.$ === this.$
			} catch (c) {
				return !1
			}
		};
		a.setCustomData = function(a, c) {
			var e = this.getUniqueId();
			(d[e] || (d[e] = {}))[a] = c;
			return this
		};
		a.getCustomData = function(a) {
			var c = this.$["data-cke-expando"];
			return (c = c && d[c]) && a in c ? c[a] : null
		};
		a.removeCustomData = function(a) {
			var c = this.$["data-cke-expando"],
				c = c && d[c],
				e, g;
			c && (e = c[a], g = a in c, delete c[a]);
			return g ? e : null
		};
		a.clearCustomData = function() {
			this.removeAllListeners();
			var a = this.$["data-cke-expando"];
			a && delete d[a]
		};
		a.getUniqueId = function() {
			return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
		};
		CKEDITOR.event.implementOn(a)
	})(CKEDITOR.dom.domObject.prototype);
	CKEDITOR.dom.node = function(a) {
		return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
	};
	CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.NODE_ELEMENT = 1;
	CKEDITOR.NODE_DOCUMENT = 9;
	CKEDITOR.NODE_TEXT = 3;
	CKEDITOR.NODE_COMMENT = 8;
	CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;
	CKEDITOR.POSITION_IDENTICAL = 0;
	CKEDITOR.POSITION_DISCONNECTED = 1;
	CKEDITOR.POSITION_FOLLOWING = 2;
	CKEDITOR.POSITION_PRECEDING = 4;
	CKEDITOR.POSITION_IS_CONTAINED = 8;
	CKEDITOR.POSITION_CONTAINS = 16;
	CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
		appendTo: function(a, d) {
			a.append(this, d);
			return a
		},
		clone: function(a, d) {
			function b(c) {
				c["data-cke-expando"] && (c["data-cke-expando"] = !1);
				if (c.nodeType == CKEDITOR.NODE_ELEMENT || c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) if (d || c.nodeType != CKEDITOR.NODE_ELEMENT || c.removeAttribute("id", !1), a) {
					c = c.childNodes;
					for (var e = 0; e < c.length; e++) b(c[e])
				}
			}

			function c(b) {
				if (b.type == CKEDITOR.NODE_ELEMENT || b.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
					if (b.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
						var d = b.getName();
						":" == d[0] && b.renameNode(d.substring(1))
					}
					if (a) for (d = 0; d < b.getChildCount(); d++) c(b.getChild(d))
				}
			}
			var e = this.$.cloneNode(a);
			b(e);
			e = new CKEDITOR.dom.node(e);
			CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (this.type == CKEDITOR.NODE_ELEMENT || this.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) && c(e);
			return e
		},
		hasPrevious: function() {
			return !!this.$.previousSibling
		},
		hasNext: function() {
			return !!this.$.nextSibling
		},
		insertAfter: function(a) {
			a.$.parentNode.insertBefore(this.$, a.$.nextSibling);
			return a
		},
		insertBefore: function(a) {
			a.$.parentNode.insertBefore(this.$, a.$);
			return a
		},
		insertBeforeMe: function(a) {
			this.$.parentNode.insertBefore(a.$, this.$);
			return a
		},
		getAddress: function(a) {
			for (var d = [], b = this.getDocument().$.documentElement, c = this.$; c && c != b;) {
				var e = c.parentNode;
				e && d.unshift(this.getIndex.call({
					$: c
				}, a));
				c = e
			}
			return d
		},
		getDocument: function() {
			return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
		},
		getIndex: function(a) {
			function d(a, c) {
				var q = c ? a.nextSibling : a.previousSibling;
				return q && q.nodeType == CKEDITOR.NODE_TEXT ? b(q) ? d(q, c) : q : null
			}

			function b(a) {
				return !a.nodeValue || a.nodeValue == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE
			}
			var c = this.$,
				e = -1,
				g;
			if (!this.$.parentNode || a && c.nodeType == CKEDITOR.NODE_TEXT && b(c) && !d(c) && !d(c, !0)) return -1;
			do a && c != this.$ && c.nodeType == CKEDITOR.NODE_TEXT && (g || b(c)) || (e++, g = c.nodeType == CKEDITOR.NODE_TEXT);
			while (c = c.previousSibling);
			return e
		},
		getNextSourceNode: function(a, d, b) {
			if (b && !b.call) {
				var c = b;
				b = function(a) {
					return !a.equals(c)
				}
			}
			a = !a && this.getFirst && this.getFirst();
			var e;
			if (!a) {
				if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0)) return null;
				a = this.getNext()
			}
			for (; !a && (e = (e || this).getParent());) {
				if (b && !1 === b(e, !0)) return null;
				a = e.getNext()
			}
			return !a || b && !1 === b(a) ? null : d && d != a.type ? a.getNextSourceNode(!1, d, b) : a
		},
		getPreviousSourceNode: function(a, d, b) {
			if (b && !b.call) {
				var c = b;
				b = function(a) {
					return !a.equals(c)
				}
			}
			a = !a && this.getLast && this.getLast();
			var e;
			if (!a) {
				if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0)) return null;
				a = this.getPrevious()
			}
			for (; !a && (e = (e || this).getParent());) {
				if (b && !1 === b(e, !0)) return null;
				a = e.getPrevious()
			}
			return !a || b && !1 === b(a) ? null : d && a.type != d ? a.getPreviousSourceNode(!1, d, b) : a
		},
		getPrevious: function(a) {
			var d = this.$,
				b;
			do b = (d = d.previousSibling) && 10 != d.nodeType && new CKEDITOR.dom.node(d);
			while (b && a && !a(b));
			return b
		},
		getNext: function(a) {
			var d = this.$,
				b;
			do b = (d = d.nextSibling) && new CKEDITOR.dom.node(d);
			while (b && a && !a(b));
			return b
		},
		getParent: function(a) {
			var d = this.$.parentNode;
			return d && (d.nodeType == CKEDITOR.NODE_ELEMENT || a && d.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(d) : null
		},
		getParents: function(a) {
			var d = this,
				b = [];
			do b[a ? "push" : "unshift"](d);
			while (d = d.getParent());
			return b
		},
		getCommonAncestor: function(a) {
			if (a.equals(this)) return this;
			if (a.contains && a.contains(this)) return a;
			var d = this.contains ? this : this.getParent();
			do
			if (d.contains(a)) return d;
			while (d = d.getParent());
			return null
		},
		getPosition: function(a) {
			var d = this.$,
				b = a.$;
			if (d.compareDocumentPosition) return d.compareDocumentPosition(b);
			if (d == b) return CKEDITOR.POSITION_IDENTICAL;
			if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
				if (d.contains) {
					if (d.contains(b)) return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
					if (b.contains(d)) return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
				}
				if ("sourceIndex" in d) return 0 > d.sourceIndex || 0 > b.sourceIndex ? CKEDITOR.POSITION_DISCONNECTED : d.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
			}
			d = this.getAddress();
			a = a.getAddress();
			for (var b = Math.min(d.length, a.length), c = 0; c < b; c++) if (d[c] != a[c]) return d[c] < a[c] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
			return d.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
		},
		getAscendant: function(a, d) {
			var b = this.$,
				c, e;
			d || (b = b.parentNode);
			"function" == typeof a ? (e = !0, c = a) : (e = !1, c = function(b) {
				b = "string" == typeof b.nodeName ? b.nodeName.toLowerCase() : "";
				return "string" == typeof a ? b == a : b in a
			});
			for (; b;) {
				if (c(e ? new CKEDITOR.dom.node(b) : b)) return new CKEDITOR.dom.node(b);
				try {
					b = b.parentNode
				} catch (g) {
					b = null
				}
			}
			return null
		},
		hasAscendant: function(a, d) {
			var b = this.$;
			d || (b = b.parentNode);
			for (; b;) {
				if (b.nodeName && b.nodeName.toLowerCase() == a) return !0;
				b = b.parentNode
			}
			return !1
		},
		move: function(a, d) {
			a.append(this.remove(), d)
		},
		remove: function(a) {
			var d = this.$,
				b = d.parentNode;
			if (b) {
				if (a) for (; a = d.firstChild;) b.insertBefore(d.removeChild(a), d);
				b.removeChild(d)
			}
			return this
		},
		replace: function(a) {
			this.insertBefore(a);
			a.remove()
		},
		trim: function() {
			this.ltrim();
			this.rtrim()
		},
		ltrim: function() {
			for (var a; this.getFirst && (a = this.getFirst());) {
				if (a.type == CKEDITOR.NODE_TEXT) {
					var d = CKEDITOR.tools.ltrim(a.getText()),
						b = a.getLength();
					if (d) d.length < b && (a.split(b - d.length), this.$.removeChild(this.$.firstChild));
					else {
						a.remove();
						continue
					}
				}
				break
			}
		},
		rtrim: function() {
			for (var a; this.getLast && (a = this.getLast());) {
				if (a.type == CKEDITOR.NODE_TEXT) {
					var d = CKEDITOR.tools.rtrim(a.getText()),
						b = a.getLength();
					if (d) d.length < b && (a.split(d.length), this.$.lastChild.parentNode.removeChild(this.$.lastChild));
					else {
						a.remove();
						continue
					}
				}
				break
			}
			CKEDITOR.env.needsBrFiller && (a = this.$.lastChild) && 1 == a.type && "br" == a.nodeName.toLowerCase() && a.parentNode.removeChild(a)
		},
		isReadOnly: function(a) {
			var d = this;
			this.type != CKEDITOR.NODE_ELEMENT && (d = this.getParent());
			CKEDITOR.env.edge && d && d.is("textarea", "input") && (a = !0);
			if (!a && d && "undefined" != typeof d.$.isContentEditable) return !(d.$.isContentEditable || d.data("cke-editable"));
			for (; d;) {
				if (d.data("cke-editable")) return !1;
				if (d.hasAttribute("contenteditable")) return "false" == d.getAttribute("contenteditable");
				d = d.getParent()
			}
			return !0
		}
	});
	CKEDITOR.dom.window = function(a) {
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
		focus: function() {
			this.$.focus()
		},
		getViewPaneSize: function() {
			var a = this.$.document,
				d = "CSS1Compat" == a.compatMode;
			return {
				width: (d ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
				height: (d ? a.documentElement.clientHeight : a.body.clientHeight) || 0
			}
		},
		getScrollPosition: function() {
			var a = this.$;
			if ("pageXOffset" in a) return {
				x: a.pageXOffset || 0,
				y: a.pageYOffset || 0
			};
			a = a.document;
			return {
				x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
				y: a.documentElement.scrollTop || a.body.scrollTop || 0
			}
		},
		getFrame: function() {
			var a = this.$.frameElement;
			return a ? new CKEDITOR.dom.element.get(a) : null
		}
	});
	CKEDITOR.dom.document = function(a) {
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
		type: CKEDITOR.NODE_DOCUMENT,
		appendStyleSheet: function(a) {
			if (this.$.createStyleSheet) this.$.createStyleSheet(a);
			else {
				var d = new CKEDITOR.dom.element("link");
				d.setAttributes({
					rel: "stylesheet",
					type: "text/css",
					href: a
				});
				this.getHead().append(d)
			}
		},
		appendStyleText: function(a) {
			if (this.$.createStyleSheet) {
				var d = this.$.createStyleSheet("");
				d.cssText = a
			} else {
				var b = new CKEDITOR.dom.element("style", this);
				b.append(new CKEDITOR.dom.text(a, this));
				this.getHead().append(b)
			}
			return d || b.$.sheet
		},
		createElement: function(a, d) {
			var b = new CKEDITOR.dom.element(a, this);
			d && (d.attributes && b.setAttributes(d.attributes), d.styles && b.setStyles(d.styles));
			return b
		},
		createText: function(a) {
			return new CKEDITOR.dom.text(a, this)
		},
		focus: function() {
			this.getWindow().focus()
		},
		getActive: function() {
			var a;
			try {
				a = this.$.activeElement
			} catch (d) {
				return null
			}
			return new CKEDITOR.dom.element(a)
		},
		getById: function(a) {
			return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
		},
		getByAddress: function(a, d) {
			for (var b = this.$.documentElement, c = 0; b && c < a.length; c++) {
				var e = a[c];
				if (d) for (var g = -1, l = 0; l < b.childNodes.length; l++) {
					var k = b.childNodes[l];
					if (!0 !== d || 3 != k.nodeType || !k.previousSibling || 3 != k.previousSibling.nodeType) if (g++, g == e) {
						b = k;
						break
					}
				} else b = b.childNodes[e]
			}
			return b ? new CKEDITOR.dom.node(b) : null
		},
		getElementsByTag: function(a, d) {
			CKEDITOR.env.ie && 8 >= document.documentMode || !d || (a = d + ":" + a);
			return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
		},
		getHead: function() {
			var a = this.$.getElementsByTagName("head")[0];
			return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), !0)
		},
		getBody: function() {
			return new CKEDITOR.dom.element(this.$.body)
		},
		getDocumentElement: function() {
			return new CKEDITOR.dom.element(this.$.documentElement)
		},
		getWindow: function() {
			return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView)
		},
		write: function(a) {
			this.$.open("text/html", "replace");
			CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();</script>"));
			this.$.write(a);
			this.$.close()
		},
		find: function(a) {
			return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
		},
		findOne: function(a) {
			return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
		},
		_getHtml5ShivFrag: function() {
			var a = this.getCustomData("html5ShivFrag");
			a || (a = this.$.createDocumentFragment(), CKEDITOR.tools.enableHtml5Elements(a, !0), this.setCustomData("html5ShivFrag", a));
			return a
		}
	});
	CKEDITOR.dom.nodeList = function(a) {
		this.$ = a
	};
	CKEDITOR.dom.nodeList.prototype = {
		count: function() {
			return this.$.length
		},
		getItem: function(a) {
			return 0 > a || a >= this.$.length ? null : (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
		}
	};
	CKEDITOR.dom.element = function(a, d) {
		"string" == typeof a && (a = (d ? d.$ : document).createElement(a));
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.element.get = function(a) {
		return (a = "string" == typeof a ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
	};
	CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
	CKEDITOR.dom.element.createFromHtml = function(a, d) {
		var b = new CKEDITOR.dom.element("div", d);
		b.setHtml(a);
		return b.getFirst().remove()
	};
	CKEDITOR.dom.element.setMarker = function(a, d, b, c) {
		var e = d.getCustomData("list_marker_id") || d.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
			g = d.getCustomData("list_marker_names") || d.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
		a[e] = d;
		g[b] = 1;
		return d.setCustomData(b, c)
	};
	CKEDITOR.dom.element.clearAllMarkers = function(a) {
		for (var d in a) CKEDITOR.dom.element.clearMarkers(a, a[d], 1)
	};
	CKEDITOR.dom.element.clearMarkers = function(a, d, b) {
		var c = d.getCustomData("list_marker_names"),
			e = d.getCustomData("list_marker_id"),
			g;
		for (g in c) d.removeCustomData(g);
		d.removeCustomData("list_marker_names");
		b && (d.removeCustomData("list_marker_id"), delete a[e])
	};
	(function() {
		function a(a, b) {
			return -1 < (" " + a + " ").replace(g, " ").indexOf(" " + b + " ")
		}

		function d(a) {
			var b = !0;
			a.$.id || (a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber(), b = !1);
			return function() {
				b || a.removeAttribute("id")
			}
		}

		function b(a, b) {
			return "#" + a.$.id + " " + b.split(/,\s*/).join(", #" + a.$.id + " ")
		}

		function c(a) {
			for (var b = 0, c = 0, f = l[a].length; c < f; c++) b += parseInt(this.getComputedStyle(l[a][c]) || 0, 10) || 0;
			return b
		}
		var e = document.createElement("_").classList,
			e = "undefined" !== typeof e && null !== String(e.add).match(/\[Native code\]/gi),
			g = /[\n\t\r]/g;
		CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
			type: CKEDITOR.NODE_ELEMENT,
			addClass: e ?
			function(a) {
				this.$.classList.add(a);
				return this
			} : function(b) {
				var c = this.$.className;
				c && (a(c, b) || (c += " " + b));
				this.$.className = c || b;
				return this
			},
			removeClass: e ?
			function(a) {
				var b = this.$;
				b.classList.remove(a);
				b.className || b.removeAttribute("class");
				return this
			} : function(b) {
				var c = this.getAttribute("class");
				c && a(c, b) && ((c = c.replace(new RegExp("(?:^|\\s+)" + b + "(?=\\s|$)"), "").replace(/^\s+/, "")) ? this.setAttribute("class", c) : this.removeAttribute("class"));
				return this
			},
			hasClass: function(b) {
				return a(this.$.className, b)
			},
			append: function(a, b) {
				"string" == typeof a && (a = this.getDocument().createElement(a));
				b ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$);
				return a
			},
			appendHtml: function(a) {
				if (this.$.childNodes.length) {
					var b = new CKEDITOR.dom.element("div", this.getDocument());
					b.setHtml(a);
					b.moveChildren(this)
				} else this.setHtml(a)
			},
			appendText: function(a) {
				null != this.$.text && CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? this.$.text += a : this.append(new CKEDITOR.dom.text(a))
			},
			appendBogus: function(a) {
				if (a || CKEDITOR.env.needsBrFiller) {
					for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());) a = a.getPrevious();
					a && a.is && a.is("br") || (a = this.getDocument().createElement("br"), CKEDITOR.env.gecko && a.setAttribute("type", "_moz"), this.append(a))
				}
			},
			breakParent: function(a, b) {
				var c = new CKEDITOR.dom.range(this.getDocument());
				c.setStartAfter(this);
				c.setEndAfter(a);
				var f = c.extractContents(!1, b || !1);
				c.insertNode(this.remove());
				f.insertAfterNode(this)
			},
			contains: document.compareDocumentPosition ?
			function(a) {
				return !!(this.$.compareDocumentPosition(a.$) & 16)
			} : function(a) {
				var b = this.$;
				return a.type != CKEDITOR.NODE_ELEMENT ? b.contains(a.getParent().$) : b != a.$ && b.contains(a.$)
			},
			focus: function() {
				function a() {
					try {
						this.$.focus()
					} catch (b) {}
				}
				return function(b) {
					b ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
				}
			}(),
			getHtml: function() {
				var a = this.$.innerHTML;
				return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
			},
			getOuterHtml: function() {
				if (this.$.outerHTML) return this.$.outerHTML.replace(/<\?[^>]*>/, "");
				var a = this.$.ownerDocument.createElement("div");
				a.appendChild(this.$.cloneNode(!0));
				return a.innerHTML
			},
			getClientRect: function() {
				var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
				!a.width && (a.width = a.right - a.left);
				!a.height && (a.height = a.bottom - a.top);
				return a
			},
			setHtml: CKEDITOR.env.ie && 9 > CKEDITOR.env.version ?
			function(a) {
				try {
					var b = this.$;
					if (this.getParent()) return b.innerHTML = a;
					var c = this.getDocument()._getHtml5ShivFrag();
					c.appendChild(b);
					b.innerHTML = a;
					c.removeChild(b);
					return a
				} catch (f) {
					this.$.innerHTML = "";
					b = new CKEDITOR.dom.element("body", this.getDocument());
					b.$.innerHTML = a;
					for (b = b.getChildren(); b.count();) this.append(b.getItem(0));
					return a
				}
			} : function(a) {
				return this.$.innerHTML = a
			},
			setText: function() {
				var a = document.createElement("p");
				a.innerHTML = "x";
				a = a.textContent;
				return function(b) {
					this.$[a ? "textContent" : "innerText"] = b
				}
			}(),
			getAttribute: function() {
				var a = function(a) {
						return this.$.getAttribute(a, 2)
					};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
				function(a) {
					switch (a) {
					case "class":
						a = "className";
						break;
					case "http-equiv":
						a = "httpEquiv";
						break;
					case "name":
						return this.$.name;
					case "tabindex":
						return a = this.$.getAttribute(a, 2), 0 !== a && 0 === this.$.tabIndex && (a = null), a;
					case "checked":
						return a = this.$.attributes.getNamedItem(a), (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
					case "hspace":
					case "value":
						return this.$[a];
					case "style":
						return this.$.style.cssText;
					case "contenteditable":
					case "contentEditable":
						return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
					}
					return this.$.getAttribute(a, 2)
				} : a
			}(),
			getAttributes: function(a) {
				var b = {},
					c = this.$.attributes,
					f;
				a = CKEDITOR.tools.isArray(a) ? a : [];
				for (f = 0; f < c.length; f++) - 1 === CKEDITOR.tools.indexOf(a, c[f].name) && (b[c[f].name] = c[f].value);
				return b
			},
			getChildren: function() {
				return new CKEDITOR.dom.nodeList(this.$.childNodes)
			},
			getComputedStyle: document.defaultView && document.defaultView.getComputedStyle ?
			function(a) {
				var b = this.getWindow().$.getComputedStyle(this.$, null);
				return b ? b.getPropertyValue(a) : ""
			} : function(a) {
				return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
			},
			getDtd: function() {
				var a = CKEDITOR.dtd[this.getName()];
				this.getDtd = function() {
					return a
				};
				return a
			},
			getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
			getTabIndex: function() {
				var a = this.$.tabIndex;
				return 0 !== a || CKEDITOR.dtd.$tabIndex[this.getName()] || 0 === parseInt(this.getAttribute("tabindex"), 10) ? a : -1
			},
			getText: function() {
				return this.$.textContent || this.$.innerText || ""
			},
			getWindow: function() {
				return this.getDocument().getWindow()
			},
			getId: function() {
				return this.$.id || null
			},
			getNameAtt: function() {
				return this.$.name || null
			},
			getName: function() {
				var a = this.$.nodeName.toLowerCase();
				if (CKEDITOR.env.ie && 8 >= document.documentMode) {
					var b = this.$.scopeName;
					"HTML" != b && (a = b.toLowerCase() + ":" + a)
				}
				this.getName = function() {
					return a
				};
				return this.getName()
			},
			getValue: function() {
				return this.$.value
			},
			getFirst: function(a) {
				var b = this.$.firstChild;
				(b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getNext(a));
				return b
			},
			getLast: function(a) {
				var b = this.$.lastChild;
				(b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getPrevious(a));
				return b
			},
			getStyle: function(a) {
				return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
			},
			is: function() {
				var a = this.getName();
				if ("object" == typeof arguments[0]) return !!arguments[0][a];
				for (var b = 0; b < arguments.length; b++) if (arguments[b] == a) return !0;
				return !1
			},
			isEditable: function(a) {
				var b = this.getName();
				return this.isReadOnly() || "none" == this.getComputedStyle("display") || "hidden" == this.getComputedStyle("visibility") || CKEDITOR.dtd.$nonEditable[b] || CKEDITOR.dtd.$empty[b] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount() ? !1 : !1 !== a ? (a = CKEDITOR.dtd[b] || CKEDITOR.dtd.span, !(!a || !a["#"])) : !0
			},
			isIdentical: function(a) {
				var b = this.clone(0, 1);
				a = a.clone(0, 1);
				b.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
				a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
				if (b.$.isEqualNode) return b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText), a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText), b.$.isEqualNode(a.$);
				b = b.getOuterHtml();
				a = a.getOuterHtml();
				if (CKEDITOR.env.ie && 9 > CKEDITOR.env.version && this.is("a")) {
					var c = this.getParent();
					c.type == CKEDITOR.NODE_ELEMENT && (c = c.clone(), c.setHtml(b), b = c.getHtml(), c.setHtml(a), a = c.getHtml())
				}
				return b == a
			},
			isVisible: function() {
				var a = (this.$.offsetHeight || this.$.offsetWidth) && "hidden" != this.getComputedStyle("visibility"),
					b, c;
				a && CKEDITOR.env.webkit && (b = this.getWindow(), !b.equals(CKEDITOR.document.getWindow()) && (c = b.$.frameElement) && (a = (new CKEDITOR.dom.element(c)).isVisible()));
				return !!a
			},
			isEmptyInlineRemoveable: function() {
				if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return !1;
				for (var a = this.getChildren(), b = 0, c = a.count(); b < c; b++) {
					var f = a.getItem(b);
					if (f.type != CKEDITOR.NODE_ELEMENT || !f.data("cke-bookmark")) if (f.type == CKEDITOR.NODE_ELEMENT && !f.isEmptyInlineRemoveable() || f.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(f.getText())) return !1
				}
				return !0
			},
			hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
			function() {
				for (var a = this.$.attributes, b = 0; b < a.length; b++) {
					var c = a[b];
					switch (c.nodeName) {
					case "class":
						if (this.getAttribute("class")) return !0;
					case "data-cke-expando":
						continue;
					default:
						if (c.specified) return !0
					}
				}
				return !1
			} : function() {
				var a = this.$.attributes,
					b = a.length,
					c = {
						"data-cke-expando": 1,
						_moz_dirty: 1
					};
				return 0 < b && (2 < b || !c[a[0].nodeName] || 2 == b && !c[a[1].nodeName])
			},
			hasAttribute: function() {
				function a(b) {
					var c = this.$.attributes.getNamedItem(b);
					if ("input" == this.getName()) switch (b) {
					case "class":
						return 0 < this.$.className.length;
					case "checked":
						return !!this.$.checked;
					case "value":
						return b = this.getAttribute("type"), "checkbox" == b || "radio" == b ? "on" != this.$.value : !! this.$.value
					}
					return c ? c.specified : !1
				}
				return CKEDITOR.env.ie ? 8 > CKEDITOR.env.version ?
				function(b) {
					return "name" == b ? !! this.$.name : a.call(this, b)
				} : a : function(a) {
					return !!this.$.attributes.getNamedItem(a)
				}
			}(),
			hide: function() {
				this.setStyle("display", "none")
			},
			moveChildren: function(a, b) {
				var c = this.$;
				a = a.$;
				if (c != a) {
					var f;
					if (b) for (; f = c.lastChild;) a.insertBefore(c.removeChild(f), a.firstChild);
					else for (; f = c.firstChild;) a.appendChild(c.removeChild(f))
				}
			},
			mergeSiblings: function() {
				function a(b, c, f) {
					if (c && c.type == CKEDITOR.NODE_ELEMENT) {
						for (var d = []; c.data("cke-bookmark") || c.isEmptyInlineRemoveable();) if (d.push(c), c = f ? c.getNext() : c.getPrevious(), !c || c.type != CKEDITOR.NODE_ELEMENT) return;
						if (b.isIdentical(c)) {
							for (var k = f ? b.getLast() : b.getFirst(); d.length;) d.shift().move(b, !f);
							c.moveChildren(b, !f);
							c.remove();
							k && k.type == CKEDITOR.NODE_ELEMENT && k.mergeSiblings()
						}
					}
				}
				return function(b) {
					if (!1 === b || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) a(this, this.getNext(), !0), a(this, this.getPrevious())
				}
			}(),
			show: function() {
				this.setStyles({
					display: "",
					visibility: ""
				})
			},
			setAttribute: function() {
				var a = function(a, b) {
						this.$.setAttribute(a, b);
						return this
					};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
				function(b, c) {
					"class" == b ? this.$.className = c : "style" == b ? this.$.style.cssText = c : "tabindex" == b ? this.$.tabIndex = c : "checked" == b ? this.$.checked = c : "contenteditable" == b ? a.call(this, "contentEditable", c) : a.apply(this, arguments);
					return this
				} : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ?
				function(b, c) {
					if ("src" == b && c.match(/^http:\/\//)) try {
						a.apply(this, arguments)
					} catch (f) {} else a.apply(this, arguments);
					return this
				} : a
			}(),
			setAttributes: function(a) {
				for (var b in a) this.setAttribute(b, a[b]);
				return this
			},
			setValue: function(a) {
				this.$.value = a;
				return this
			},
			removeAttribute: function() {
				var a = function(a) {
						this.$.removeAttribute(a)
					};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
				function(a) {
					"class" == a ? a = "className" : "tabindex" == a ? a = "tabIndex" : "contenteditable" == a && (a = "contentEditable");
					this.$.removeAttribute(a)
				} : a
			}(),
			removeAttributes: function(a) {
				if (CKEDITOR.tools.isArray(a)) for (var b = 0; b < a.length; b++) this.removeAttribute(a[b]);
				else for (b in a = a || this.getAttributes(), a) a.hasOwnProperty(b) && this.removeAttribute(b)
			},
			removeStyle: function(a) {
				var b = this.$.style;
				if (b.removeProperty || "border" != a && "margin" != a && "padding" != a) b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a)), this.$.style.cssText || this.removeAttribute("style");
				else {
					var c = ["top", "left", "right", "bottom"],
						f;
					"border" == a && (f = ["color", "style", "width"]);
					for (var b = [], d = 0; d < c.length; d++) if (f) for (var e = 0; e < f.length; e++) b.push([a, c[d], f[e]].join("-"));
					else b.push([a, c[d]].join("-"));
					for (a = 0; a < b.length; a++) this.removeStyle(b[a])
				}
			},
			setStyle: function(a, b) {
				this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
				return this
			},
			setStyles: function(a) {
				for (var b in a) this.setStyle(b, a[b]);
				return this
			},
			setOpacity: function(a) {
				CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? (a = Math.round(100 * a), this.setStyle("filter", 100 <= a ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")) : this.setStyle("opacity", a)
			},
			unselectable: function() {
				this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
				if (CKEDITOR.env.ie) {
					this.setAttribute("unselectable", "on");
					for (var a, b = this.getElementsByTag("*"), c = 0, f = b.count(); c < f; c++) a = b.getItem(c), a.setAttribute("unselectable", "on")
				}
			},
			getPositionedAncestor: function() {
				for (var a = this;
				"html" != a.getName();) {
					if ("static" != a.getComputedStyle("position")) return a;
					a = a.getParent()
				}
				return null
			},
			getDocumentPosition: function(a) {
				var b = 0,
					c = 0,
					f = this.getDocument(),
					d = f.getBody(),
					e = "BackCompat" == f.$.compatMode;
				if (document.documentElement.getBoundingClientRect) {
					var t = this.$.getBoundingClientRect(),
						g = f.$.documentElement,
						p = g.clientTop || d.$.clientTop || 0,
						x = g.clientLeft || d.$.clientLeft || 0,
						l = !0;
					CKEDITOR.env.ie && (l = f.getDocumentElement().contains(this), f = f.getBody().contains(this), l = e && f || !e && l);
					l && (CKEDITOR.env.webkit || CKEDITOR.env.ie && 12 <= CKEDITOR.env.version ? (b = d.$.scrollLeft || g.scrollLeft, c = d.$.scrollTop || g.scrollTop) : (c = e ? d.$ : g, b = c.scrollLeft, c = c.scrollTop), b = t.left + b - x, c = t.top + c - p)
				} else for (p = this, x = null; p && "body" != p.getName() && "html" != p.getName();) {
					b += p.$.offsetLeft - p.$.scrollLeft;
					c += p.$.offsetTop - p.$.scrollTop;
					p.equals(this) || (b += p.$.clientLeft || 0, c += p.$.clientTop || 0);
					for (; x && !x.equals(p);) b -= x.$.scrollLeft, c -= x.$.scrollTop, x = x.getParent();
					x = p;
					p = (t = p.$.offsetParent) ? new CKEDITOR.dom.element(t) : null
				}
				a && (t = this.getWindow(), p = a.getWindow(), !t.equals(p) && t.$.frameElement && (a = (new CKEDITOR.dom.element(t.$.frameElement)).getDocumentPosition(a), b += a.x, c += a.y));
				document.documentElement.getBoundingClientRect || !CKEDITOR.env.gecko || e || (b += this.$.clientLeft ? 1 : 0, c += this.$.clientTop ? 1 : 0);
				return {
					x: b,
					y: c
				}
			},
			scrollIntoView: function(a) {
				var b = this.getParent();
				if (b) {
					do
					if ((b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1), b.is("html")) {
						var c = b.getWindow();
						try {
							var f = c.$.frameElement;
							f && (b = new CKEDITOR.dom.element(f))
						} catch (d) {}
					}
					while (b = b.getParent())
				}
			},
			scrollIntoParent: function(a, b, c) {
				var f, d, e, t;

				function g(b, c) {
					/body|html/.test(a.getName()) ? a.getWindow().$.scrollBy(b, c) : (a.$.scrollLeft += b, a.$.scrollTop += c)
				}

				function p(a, b) {
					var c = {
						x: 0,
						y: 0
					};
					if (!a.is(l ? "body" : "html")) {
						var f = a.$.getBoundingClientRect();
						c.x = f.left;
						c.y = f.top
					}
					f = a.getWindow();
					f.equals(b) || (f = p(CKEDITOR.dom.element.get(f.$.frameElement), b), c.x += f.x, c.y += f.y);
					return c
				}

				function x(a, b) {
					return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
				}!a && (a = this.getWindow());
				e = a.getDocument();
				var l = "BackCompat" == e.$.compatMode;
				a instanceof CKEDITOR.dom.window && (a = l ? e.getBody() : e.getDocumentElement());
				e = a.getWindow();
				d = p(this, e);
				var u = p(a, e),
					r = this.$.offsetHeight;
				f = this.$.offsetWidth;
				var h = a.$.clientHeight,
					n = a.$.clientWidth;
				e = d.x - x(this, "left") - u.x || 0;
				t = d.y - x(this, "top") - u.y || 0;
				f = d.x + f + x(this, "right") - (u.x + n) || 0;
				d = d.y + r + x(this, "bottom") - (u.y + h) || 0;
				(0 > t || 0 < d) && g(0, !0 === b ? t : !1 === b ? d : 0 > t ? t : d);
				c && (0 > e || 0 < f) && g(0 > e ? e : f, 0)
			},
			setState: function(a, b, c) {
				b = b || "cke";
				switch (a) {
				case CKEDITOR.TRISTATE_ON:
					this.addClass(b + "_on");
					this.removeClass(b + "_off");
					this.removeClass(b + "_disabled");
					c && this.setAttribute("aria-pressed", !0);
					c && this.removeAttribute("aria-disabled");
					break;
				case CKEDITOR.TRISTATE_DISABLED:
					this.addClass(b + "_disabled");
					this.removeClass(b + "_off");
					this.removeClass(b + "_on");
					c && this.setAttribute("aria-disabled", !0);
					c && this.removeAttribute("aria-pressed");
					break;
				default:
					this.addClass(b + "_off"), this.removeClass(b + "_on"), this.removeClass(b + "_disabled"), c && this.removeAttribute("aria-pressed"), c && this.removeAttribute("aria-disabled")
				}
			},
			getFrameDocument: function() {
				var a = this.$;
				try {
					a.contentWindow.document
				} catch (b) {
					a.src = a.src
				}
				return a && new CKEDITOR.dom.document(a.contentWindow.document)
			},
			copyAttributes: function(a, b) {
				var c = this.$.attributes;
				b = b || {};
				for (var f = 0; f < c.length; f++) {
					var d = c[f],
						e = d.nodeName.toLowerCase(),
						t;
					if (!(e in b)) if ("checked" == e && (t = this.getAttribute(e))) a.setAttribute(e, t);
					else if (!CKEDITOR.env.ie || this.hasAttribute(e)) t = this.getAttribute(e), null === t && (t = d.nodeValue), a.setAttribute(e, t)
				}
				"" !== this.$.style.cssText && (a.$.style.cssText = this.$.style.cssText)
			},
			renameNode: function(a) {
				if (this.getName() != a) {
					var b = this.getDocument();
					a = new CKEDITOR.dom.element(a, b);
					this.copyAttributes(a);
					this.moveChildren(a);
					this.getParent(!0) && this.$.parentNode.replaceChild(a.$, this.$);
					a.$["data-cke-expando"] = this.$["data-cke-expando"];
					this.$ = a.$;
					delete this.getName
				}
			},
			getChild: function() {
				function a(b, c) {
					var f = b.childNodes;
					if (0 <= c && c < f.length) return f[c]
				}
				return function(b) {
					var c = this.$;
					if (b.slice) for (b = b.slice(); 0 < b.length && c;) c = a(c, b.shift());
					else c = a(c, b);
					return c ? new CKEDITOR.dom.node(c) : null
				}
			}(),
			getChildCount: function() {
				return this.$.childNodes.length
			},
			disableContextMenu: function() {
				function a(b) {
					return b.type == CKEDITOR.NODE_ELEMENT && b.hasClass("cke_enable_context_menu")
				}
				this.on("contextmenu", function(b) {
					b.data.getTarget().getAscendant(a, !0) || b.data.preventDefault()
				})
			},
			getDirection: function(a) {
				return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
			},
			data: function(a, b) {
				a = "data-" + a;
				if (void 0 === b) return this.getAttribute(a);
				!1 === b ? this.removeAttribute(a) : this.setAttribute(a, b);
				return null
			},
			getEditor: function() {
				var a = CKEDITOR.instances,
					b, c;
				for (b in a) if (c = a[b], c.element.equals(this) && c.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) return c;
				return null
			},
			find: function(a) {
				var c = d(this);
				a = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(b(this, a)));
				c();
				return a
			},
			findOne: function(a) {
				var c = d(this);
				a = this.$.querySelector(b(this, a));
				c();
				return a ? new CKEDITOR.dom.element(a) : null
			},
			forEach: function(a, b, c) {
				if (!(c || b && this.type != b)) var f = a(this);
				if (!1 !== f) {
					c = this.getChildren();
					for (var d = 0; d < c.count(); d++) f = c.getItem(d), f.type == CKEDITOR.NODE_ELEMENT ? f.forEach(a, b) : b && f.type != b || a(f)
				}
			}
		});
		var l = {
			width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
			height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
		};
		CKEDITOR.dom.element.prototype.setSize = function(a, b, d) {
			"number" == typeof b && (!d || CKEDITOR.env.ie && CKEDITOR.env.quirks || (b -= c.call(this, a)), this.setStyle(a, b + "px"))
		};
		CKEDITOR.dom.element.prototype.getSize = function(a, b) {
			var d = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
			b && (d -= c.call(this, a));
			return d
		}
	})();
	CKEDITOR.dom.documentFragment = function(a) {
		a = a || CKEDITOR.document;
		this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a
	};
	CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
		type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
		insertAfterNode: function(a) {
			a = a.$;
			a.parentNode.insertBefore(this.$, a.nextSibling)
		},
		getHtml: function() {
			var a = new CKEDITOR.dom.element("div");
			this.clone(1, 1).appendTo(a);
			return a.getHtml().replace(/\s*data-cke-expando=".*?"/g, "")
		}
	}, !0, {
		append: 1,
		appendBogus: 1,
		clone: 1,
		getFirst: 1,
		getHtml: 1,
		getLast: 1,
		getParent: 1,
		getNext: 1,
		getPrevious: 1,
		appendTo: 1,
		moveChildren: 1,
		insertBefore: 1,
		insertAfterNode: 1,
		replace: 1,
		trim: 1,
		type: 1,
		ltrim: 1,
		rtrim: 1,
		getDocument: 1,
		getChildCount: 1,
		getChild: 1,
		getChildren: 1
	});
	(function() {
		function a(a, b) {
			var c = this.range;
			if (this._.end) return null;
			if (!this._.start) {
				this._.start = 1;
				if (c.collapsed) return this.end(), null;
				c.optimize()
			}
			var f, d = c.startContainer;
			f = c.endContainer;
			var e = c.startOffset,
				y = c.endOffset,
				r, h = this.guard,
				n = this.type,
				m = a ? "getPreviousSourceNode" : "getNextSourceNode";
			if (!a && !this._.guardLTR) {
				var z = f.type == CKEDITOR.NODE_ELEMENT ? f : f.getParent(),
					B = f.type == CKEDITOR.NODE_ELEMENT ? f.getChild(y) : f.getNext();
				this._.guardLTR = function(a, b) {
					return (!b || !z.equals(a)) && (!B || !a.equals(B)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
				}
			}
			if (a && !this._.guardRTL) {
				var E = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(),
					g = d.type == CKEDITOR.NODE_ELEMENT ? e ? d.getChild(e - 1) : null : d.getPrevious();
				this._.guardRTL = function(a, b) {
					return (!b || !E.equals(a)) && (!g || !a.equals(g)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
				}
			}
			var l = a ? this._.guardRTL : this._.guardLTR;
			r = h ?
			function(a, b) {
				return !1 === l(a, b) ? !1 : h(a, b)
			} : l;
			this.current ? f = this.current[m](!1, n, r) : (a ? f.type == CKEDITOR.NODE_ELEMENT && (f = 0 < y ? f.getChild(y - 1) : !1 === r(f, !0) ? null : f.getPreviousSourceNode(!0, n, r)) : (f = d, f.type == CKEDITOR.NODE_ELEMENT && ((f = f.getChild(e)) || (f = !1 === r(d, !0) ? null : d.getNextSourceNode(!0, n, r)))), f && !1 === r(f) && (f = null));
			for (; f && !this._.end;) {
				this.current = f;
				if (!this.evaluator || !1 !== this.evaluator(f)) {
					if (!b) return f
				} else if (b && this.evaluator) return !1;
				f = f[m](!1, n, r)
			}
			this.end();
			return this.current = null
		}

		function d(b) {
			for (var c, f = null; c = a.call(this, b);) f = c;
			return f
		}
		CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
			$: function(a) {
				this.range = a;
				this._ = {}
			},
			proto: {
				end: function() {
					this._.end = 1
				},
				next: function() {
					return a.call(this)
				},
				previous: function() {
					return a.call(this, 1)
				},
				checkForward: function() {
					return !1 !== a.call(this, 0, 1)
				},
				checkBackward: function() {
					return !1 !== a.call(this, 1, 1)
				},
				lastForward: function() {
					return d.call(this)
				},
				lastBackward: function() {
					return d.call(this, 1)
				},
				reset: function() {
					delete this.current;
					this._ = {}
				}
			}
		});
		var b = {
			block: 1,
			"list-item": 1,
			table: 1,
			"table-row-group": 1,
			"table-header-group": 1,
			"table-footer-group": 1,
			"table-row": 1,
			"table-column-group": 1,
			"table-column": 1,
			"table-cell": 1,
			"table-caption": 1
		},
			c = {
				absolute: 1,
				fixed: 1
			};
		CKEDITOR.dom.element.prototype.isBlockBoundary = function(a) {
			return "none" != this.getComputedStyle("float") || this.getComputedStyle("position") in c || !b[this.getComputedStyle("display")] ? !! (this.is(CKEDITOR.dtd.$block) || a && this.is(a)) : !0
		};
		CKEDITOR.dom.walker.blockBoundary = function(a) {
			return function(b) {
				return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
			}
		};
		CKEDITOR.dom.walker.listItemBoundary = function() {
			return this.blockBoundary({
				br: 1
			})
		};
		CKEDITOR.dom.walker.bookmark = function(a, b) {
			function c(a) {
				return a && a.getName && "span" == a.getName() && a.data("cke-bookmark")
			}
			return function(f) {
				var d, e;
				d = f && f.type != CKEDITOR.NODE_ELEMENT && (e = f.getParent()) && c(e);
				d = a ? d : d || c(f);
				return !!(b ^ d)
			}
		};
		CKEDITOR.dom.walker.whitespaces = function(a) {
			return function(b) {
				var c;
				b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE);
				return !!(a ^ c)
			}
		};
		CKEDITOR.dom.walker.invisible = function(a) {
			var b = CKEDITOR.dom.walker.whitespaces(),
				c = CKEDITOR.env.webkit ? 1 : 0;
			return function(f) {
				b(f) ? f = 1 : (f.type == CKEDITOR.NODE_TEXT && (f = f.getParent()), f = f.$.offsetWidth <= c);
				return !!(a ^ f)
			}
		};
		CKEDITOR.dom.walker.nodeType = function(a, b) {
			return function(c) {
				return !!(b ^ c.type == a)
			}
		};
		CKEDITOR.dom.walker.bogus = function(a) {
			function b(a) {
				return !g(a) && !l(a)
			}
			return function(c) {
				var f = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && e.test(c.getText());
				f && (f = c.getParent(), c = c.getNext(b), f = f.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary()));
				return !!(a ^ f)
			}
		};
		CKEDITOR.dom.walker.temp = function(a) {
			return function(b) {
				b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
				b = b && b.hasAttribute("data-cke-temp");
				return !!(a ^ b)
			}
		};
		var e = /^[\t\r\n ]*(?:&nbsp;| )$/,
			g = CKEDITOR.dom.walker.whitespaces(),
			l = CKEDITOR.dom.walker.bookmark(),
			k = CKEDITOR.dom.walker.temp(),
			q = function(a) {
				return l(a) || g(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty)
			};
		CKEDITOR.dom.walker.ignored = function(a) {
			return function(b) {
				b = g(b) || l(b) || k(b);
				return !!(a ^ b)
			}
		};
		var w = CKEDITOR.dom.walker.ignored();
		CKEDITOR.dom.walker.empty = function(a) {
			return function(b) {
				for (var c = 0, f = b.getChildCount(); c < f; ++c) if (!w(b.getChild(c))) return !!a;
				return !a
			}
		};
		var f = CKEDITOR.dom.walker.empty(),
			y = CKEDITOR.dom.walker.validEmptyBlockContainers = CKEDITOR.tools.extend(function(a) {
				var b = {},
					c;
				for (c in a) CKEDITOR.dtd[c]["#"] && (b[c] = 1);
				return b
			}(CKEDITOR.dtd.$block), {
				caption: 1,
				td: 1,
				th: 1
			});
		CKEDITOR.dom.walker.editable = function(a) {
			return function(b) {
				b = w(b) ? !1 : b.type == CKEDITOR.NODE_TEXT || b.type == CKEDITOR.NODE_ELEMENT && (b.is(CKEDITOR.dtd.$inline) || b.is("hr") || "false" == b.getAttribute("contenteditable") || !CKEDITOR.env.needsBrFiller && b.is(y) && f(b)) ? !0 : !1;
				return !!(a ^ b)
			}
		};
		CKEDITOR.dom.element.prototype.getBogus = function() {
			var a = this;
			do a = a.getPreviousSourceNode();
			while (q(a));
			return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && e.test(a.getText())) ? a : !1
		}
	})();
	CKEDITOR.dom.range = function(a) {
		this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
		this.collapsed = !0;
		var d = a instanceof CKEDITOR.dom.document;
		this.document = d ? a : a.getDocument();
		this.root = d ? a.getBody() : a
	};
	(function() {
		function a(a) {
			a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
		}

		function d(a, b, c, d, e) {
			function p(a, b, c, f) {
				var d = c ? a.getPrevious() : a.getNext();
				if (f && k) return d;
				h || f ? b.append(a.clone(!0, e), c) : (a.remove(), r && b.append(a));
				return d
			}

			function g() {
				var a, b, c, f = Math.min(v.length, I.length);
				for (a = 0; a < f; a++) if (b = v[a], c = I[a], !b.equals(c)) return a;
				return a - 1
			}

			function l() {
				var b = J - 1,
					c = H && w && !n.equals(m);
				b < F - 1 || b < L - 1 || c ? (c ? a.moveToPosition(m, CKEDITOR.POSITION_BEFORE_START) : L == b + 1 && C ? a.moveToPosition(I[b], CKEDITOR.POSITION_BEFORE_END) : a.moveToPosition(I[b + 1], CKEDITOR.POSITION_BEFORE_START), d && (b = v[b + 1]) && b.type == CKEDITOR.NODE_ELEMENT && (c = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document), c.insertAfter(b), b.mergeSiblings(!1), a.moveToBookmark({
					startNode: c
				}))) : a.collapse(!0)
			}
			a.optimizeBookmark();
			var k = 0 === b,
				r = 1 == b,
				h = 2 == b;
			b = h || r;
			var n = a.startContainer,
				m = a.endContainer,
				z = a.startOffset,
				B = a.endOffset,
				E, C, H, w, q, Q;
			if (h && m.type == CKEDITOR.NODE_TEXT && n.equals(m)) n = a.document.createText(n.substring(z, B)), c.append(n);
			else {
				m.type == CKEDITOR.NODE_TEXT ? h ? Q = !0 : m = m.split(B) : 0 < m.getChildCount() ? B >= m.getChildCount() ? (m = m.getChild(B - 1), C = !0) : m = m.getChild(B) : w = C = !0;
				n.type == CKEDITOR.NODE_TEXT ? h ? q = !0 : n.split(z) : 0 < n.getChildCount() ? 0 === z ? (n = n.getChild(z), E = !0) : n = n.getChild(z - 1) : H = E = !0;
				for (var v = n.getParents(), I = m.getParents(), J = g(), F = v.length - 1, L = I.length - 1, K = c, ba, Z, V, fa = -1, N = J; N <= F; N++) {
					Z = v[N];
					V = Z.getNext();
					for (N != F || Z.equals(I[N]) && F < L ? b && (ba = K.append(Z.clone(0, e))) : E ? p(Z, K, !1, H) : q && K.append(a.document.createText(Z.substring(z))); V;) {
						if (V.equals(I[N])) {
							fa = N;
							break
						}
						V = p(V, K)
					}
					K = ba
				}
				K = c;
				for (N = J; N <= L; N++) if (c = I[N], V = c.getPrevious(), c.equals(v[N])) b && (K = K.getChild(0));
				else {
					N != L || c.equals(v[N]) && L < F ? b && (ba = K.append(c.clone(0, e))) : C ? p(c, K, !1, w) : Q && K.append(a.document.createText(c.substring(0, B)));
					if (N > fa) for (; V;) V = p(V, K, !0);
					K = ba
				}
				h || l()
			}
		}

		function b() {
			var a = !1,
				b = CKEDITOR.dom.walker.whitespaces(),
				c = CKEDITOR.dom.walker.bookmark(!0),
				d = CKEDITOR.dom.walker.bogus();
			return function(e) {
				return c(e) || b(e) ? !0 : d(e) && !a ? a = !0 : e.type == CKEDITOR.NODE_TEXT && (e.hasAscendant("pre") || CKEDITOR.tools.trim(e.getText()).length) || e.type == CKEDITOR.NODE_ELEMENT && !e.is(g) ? !1 : !0
			}
		}

		function c(a) {
			var b = CKEDITOR.dom.walker.whitespaces(),
				c = CKEDITOR.dom.walker.bookmark(1);
			return function(d) {
				return c(d) || b(d) ? !0 : !a && l(d) || d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty)
			}
		}

		function e(a) {
			return function() {
				var b;
				return this[a ? "getPreviousNode" : "getNextNode"](function(a) {
					!b && w(a) && (b = a);
					return q(a) && !(l(a) && a.equals(b))
				})
			}
		}
		var g = {
			abbr: 1,
			acronym: 1,
			b: 1,
			bdo: 1,
			big: 1,
			cite: 1,
			code: 1,
			del: 1,
			dfn: 1,
			em: 1,
			font: 1,
			i: 1,
			ins: 1,
			label: 1,
			kbd: 1,
			q: 1,
			samp: 1,
			small: 1,
			span: 1,
			strike: 1,
			strong: 1,
			sub: 1,
			sup: 1,
			tt: 1,
			u: 1,
			"var": 1
		},
			l = CKEDITOR.dom.walker.bogus(),
			k = /^[\t\r\n ]*(?:&nbsp;| )$/,
			q = CKEDITOR.dom.walker.editable(),
			w = CKEDITOR.dom.walker.ignored(!0);
		CKEDITOR.dom.range.prototype = {
			clone: function() {
				var a = new CKEDITOR.dom.range(this.root);
				a._setStartContainer(this.startContainer);
				a.startOffset = this.startOffset;
				a._setEndContainer(this.endContainer);
				a.endOffset = this.endOffset;
				a.collapsed = this.collapsed;
				return a
			},
			collapse: function(a) {
				a ? (this._setEndContainer(this.startContainer), this.endOffset = this.startOffset) : (this._setStartContainer(this.endContainer), this.startOffset = this.endOffset);
				this.collapsed = !0
			},
			cloneContents: function(a) {
				var b = new CKEDITOR.dom.documentFragment(this.document);
				this.collapsed || d(this, 2, b, !1, "undefined" == typeof a ? !0 : a);
				return b
			},
			deleteContents: function(a) {
				this.collapsed || d(this, 0, null, a)
			},
			extractContents: function(a, b) {
				var c = new CKEDITOR.dom.documentFragment(this.document);
				this.collapsed || d(this, 1, c, a, "undefined" == typeof b ? !0 : b);
				return c
			},
			createBookmark: function(a) {
				var b, c, d, e, p = this.collapsed;
				b = this.document.createElement("span");
				b.data("cke-bookmark", 1);
				b.setStyle("display", "none");
				b.setHtml("&nbsp;");
				a && (d = "cke_bm_" + CKEDITOR.tools.getNextNumber(), b.setAttribute("id", d + (p ? "C" : "S")));
				p || (c = b.clone(), c.setHtml("&nbsp;"), a && c.setAttribute("id", d + "E"), e = this.clone(), e.collapse(), e.insertNode(c));
				e = this.clone();
				e.collapse(!0);
				e.insertNode(b);
				c ? (this.setStartAfter(b), this.setEndBefore(c)) : this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
				return {
					startNode: a ? d + (p ? "C" : "S") : b,
					endNode: a ? d + "E" : c,
					serializable: a,
					collapsed: p
				}
			},
			createBookmark2: function() {
				function a(b) {
					var f = b.container,
						d = b.offset,
						e;
					e = f;
					var g = d;
					e = e.type != CKEDITOR.NODE_ELEMENT || 0 === g || g == e.getChildCount() ? 0 : e.getChild(g - 1).type == CKEDITOR.NODE_TEXT && e.getChild(g).type == CKEDITOR.NODE_TEXT;
					e && (f = f.getChild(d - 1), d = f.getLength());
					if (f.type == CKEDITOR.NODE_ELEMENT && 0 < d) {
						a: {
							for (e = f; d--;) if (g = e.getChild(d).getIndex(!0), 0 <= g) {
								d = g;
								break a
							}
							d = -1
						}
						d += 1
					}
					if (f.type == CKEDITOR.NODE_TEXT) {
						e = f;
						for (g = 0;
						(e = e.getPrevious()) && e.type == CKEDITOR.NODE_TEXT;) g += e.getText().replace(CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE, "").length;
						e = g;
						f.getText() ? d += e : (g = f.getPrevious(c), e ? (d = e, f = g ? g.getNext() : f.getParent().getFirst()) : (f = f.getParent(), d = g ? g.getIndex(!0) + 1 : 0))
					}
					b.container = f;
					b.offset = d
				}

				function b(a, c) {
					var f = c.getCustomData("cke-fillingChar");
					if (f) {
						var d = a.container;
						f.equals(d) && (a.offset -= CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE.length, 0 >= a.offset && (a.offset = d.getIndex(), a.container = d.getParent()))
					}
				}
				var c = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_TEXT, !0);
				return function(c) {
					var d = this.collapsed,
						e = {
							container: this.startContainer,
							offset: this.startOffset
						},
						g = {
							container: this.endContainer,
							offset: this.endOffset
						};
					c && (a(e), b(e, this.root), d || (a(g), b(g, this.root)));
					return {
						start: e.container.getAddress(c),
						end: d ? null : g.container.getAddress(c),
						startOffset: e.offset,
						endOffset: g.offset,
						normalized: c,
						collapsed: d,
						is2: !0
					}
				}
			}(),
			moveToBookmark: function(a) {
				if (a.is2) {
					var b = this.document.getByAddress(a.start, a.normalized),
						c = a.startOffset,
						d = a.end && this.document.getByAddress(a.end, a.normalized);
					a = a.endOffset;
					this.setStart(b, c);
					d ? this.setEnd(d, a) : this.collapse(!0)
				} else b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode, a = c ? this.document.getById(a.endNode) : a.endNode, this.setStartBefore(b), b.remove(), a ? (this.setEndBefore(a), a.remove()) : this.collapse(!0)
			},
			getBoundaryNodes: function() {
				var a = this.startContainer,
					b = this.endContainer,
					c = this.startOffset,
					d = this.endOffset,
					e;
				if (a.type == CKEDITOR.NODE_ELEMENT) if (e = a.getChildCount(), e > c) a = a.getChild(c);
				else if (1 > e) a = a.getPreviousSourceNode();
				else {
					for (a = a.$; a.lastChild;) a = a.lastChild;
					a = new CKEDITOR.dom.node(a);
					a = a.getNextSourceNode() || a
				}
				if (b.type == CKEDITOR.NODE_ELEMENT) if (e = b.getChildCount(), e > d) b = b.getChild(d).getPreviousSourceNode(!0);
				else if (1 > e) b = b.getPreviousSourceNode();
				else {
					for (b = b.$; b.lastChild;) b = b.lastChild;
					b = new CKEDITOR.dom.node(b)
				}
				a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
				return {
					startNode: a,
					endNode: b
				}
			},
			getCommonAncestor: function(a, b) {
				var c = this.startContainer,
					d = this.endContainer,
					c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
				return b && !c.is ? c.getParent() : c
			},
			optimize: function() {
				var a = this.startContainer,
					b = this.startOffset;
				a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) : this.setStartBefore(a));
				a = this.endContainer;
				b = this.endOffset;
				a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
			},
			optimizeBookmark: function() {
				var a = this.startContainer,
					b = this.endContainer;
				a.is && a.is("span") && a.data("cke-bookmark") && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
				b && b.is && b.is("span") && b.data("cke-bookmark") && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
			},
			trim: function(a, b) {
				var c = this.startContainer,
					d = this.startOffset,
					e = this.collapsed;
				if ((!a || e) && c && c.type == CKEDITOR.NODE_TEXT) {
					if (d) if (d >= c.getLength()) d = c.getIndex() + 1, c = c.getParent();
					else {
						var p = c.split(d),
							d = c.getIndex() + 1,
							c = c.getParent();
						this.startContainer.equals(this.endContainer) ? this.setEnd(p, this.endOffset - this.startOffset) : c.equals(this.endContainer) && (this.endOffset += 1)
					} else d = c.getIndex(), c = c.getParent();
					this.setStart(c, d);
					if (e) {
						this.collapse(!0);
						return
					}
				}
				c = this.endContainer;
				d = this.endOffset;
				b || e || !c || c.type != CKEDITOR.NODE_TEXT || (d ? (d >= c.getLength() || c.split(d), d = c.getIndex() + 1) : d = c.getIndex(), c = c.getParent(), this.setEnd(c, d))
			},
			enlarge: function(a, b) {
				function c(a) {
					return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
				}
				var d = new RegExp(/[^\s﻿]/);
				switch (a) {
				case CKEDITOR.ENLARGE_INLINE:
					var e = 1;
				case CKEDITOR.ENLARGE_ELEMENT:
					var p = function(a, b) {
							var c = new CKEDITOR.dom.range(l);
							c.setStart(a, b);
							c.setEndAt(l, CKEDITOR.POSITION_BEFORE_END);
							var c = new CKEDITOR.dom.walker(c),
								f;
							for (c.guard = function(a) {
								return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
							}; f = c.next();) {
								if (f.type != CKEDITOR.NODE_TEXT) return !1;
								E = f != a ? f.getText() : f.substring(b);
								if (d.test(E)) return !1
							}
							return !0
						};
					if (this.collapsed) break;
					var g = this.getCommonAncestor(),
						l = this.root,
						k, r, h, n, m, z = !1,
						B, E;
					B = this.startContainer;
					var C = this.startOffset;
					B.type == CKEDITOR.NODE_TEXT ? (C && (B = !CKEDITOR.tools.trim(B.substring(0, C)).length && B, z = !! B), B && ((n = B.getPrevious()) || (h = B.getParent()))) : (C && (n = B.getChild(C - 1) || B.getLast()), n || (h = B));
					for (h = c(h); h || n;) {
						if (h && !n) {
							!m && h.equals(g) && (m = !0);
							if (e ? h.isBlockBoundary() : !l.contains(h)) break;
							z && "inline" == h.getComputedStyle("display") || (z = !1, m ? k = h : this.setStartBefore(h));
							n = h.getPrevious()
						}
						for (; n;) if (B = !1, n.type == CKEDITOR.NODE_COMMENT) n = n.getPrevious();
						else {
							if (n.type == CKEDITOR.NODE_TEXT) E = n.getText(), d.test(E) && (n = null), B = /[\s﻿]$/.test(E);
							else if ((n.$.offsetWidth > (CKEDITOR.env.webkit ? 1 : 0) || b && n.is("br")) && !n.data("cke-bookmark")) if (z && CKEDITOR.dtd.$removeEmpty[n.getName()]) {
								E = n.getText();
								if (d.test(E)) n = null;
								else for (var C = n.$.getElementsByTagName("*"), H = 0, w; w = C[H++];) if (!CKEDITOR.dtd.$removeEmpty[w.nodeName.toLowerCase()]) {
									n = null;
									break
								}
								n && (B = !! E.length)
							} else n = null;
							B && (z ? m ? k = h : h && this.setStartBefore(h) : z = !0);
							if (n) {
								B = n.getPrevious();
								if (!h && !B) {
									h = n;
									n = null;
									break
								}
								n = B
							} else h = null
						}
						h && (h = c(h.getParent()))
					}
					B = this.endContainer;
					C = this.endOffset;
					h = n = null;
					m = z = !1;
					B.type == CKEDITOR.NODE_TEXT ? CKEDITOR.tools.trim(B.substring(C)).length ? z = !0 : (z = !B.getLength(), C == B.getLength() ? (n = B.getNext()) || (h = B.getParent()) : p(B, C) && (h = B.getParent())) : (n = B.getChild(C)) || (h = B);
					for (; h || n;) {
						if (h && !n) {
							!m && h.equals(g) && (m = !0);
							if (e ? h.isBlockBoundary() : !l.contains(h)) break;
							z && "inline" == h.getComputedStyle("display") || (z = !1, m ? r = h : h && this.setEndAfter(h));
							n = h.getNext()
						}
						for (; n;) {
							B = !1;
							if (n.type == CKEDITOR.NODE_TEXT) E = n.getText(), p(n, 0) || (n = null), B = /^[\s﻿]/.test(E);
							else if (n.type == CKEDITOR.NODE_ELEMENT) {
								if ((0 < n.$.offsetWidth || b && n.is("br")) && !n.data("cke-bookmark")) if (z && CKEDITOR.dtd.$removeEmpty[n.getName()]) {
									E = n.getText();
									if (d.test(E)) n = null;
									else for (C = n.$.getElementsByTagName("*"), H = 0; w = C[H++];) if (!CKEDITOR.dtd.$removeEmpty[w.nodeName.toLowerCase()]) {
										n = null;
										break
									}
									n && (B = !! E.length)
								} else n = null
							} else B = 1;
							B && z && (m ? r = h : this.setEndAfter(h));
							if (n) {
								B = n.getNext();
								if (!h && !B) {
									h = n;
									n = null;
									break
								}
								n = B
							} else h = null
						}
						h && (h = c(h.getParent()))
					}
					k && r && (g = k.contains(r) ? r : k, this.setStartBefore(g), this.setEndAfter(g));
					break;
				case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
				case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
					h = new CKEDITOR.dom.range(this.root);
					l = this.root;
					h.setStartAt(l, CKEDITOR.POSITION_AFTER_START);
					h.setEnd(this.startContainer, this.startOffset);
					h = new CKEDITOR.dom.walker(h);
					var q, Q, v = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
						br: 1
					} : null),
						I = null,
						J = function(a) {
							if (a.type == CKEDITOR.NODE_ELEMENT && "false" == a.getAttribute("contenteditable")) if (I) {
								if (I.equals(a)) {
									I = null;
									return
								}
							} else I = a;
							else if (I) return;
							var b = v(a);
							b || (q = a);
							return b
						},
						e = function(a) {
							var b = J(a);
							!b && a.is && a.is("br") && (Q = a);
							return b
						};
					h.guard = J;
					h = h.lastBackward();
					q = q || l;
					this.setStartAt(q, !q.is("br") && (!h && this.checkStartOfBlock() || h && q.contains(h)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
					if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
						h = this.clone();
						h = new CKEDITOR.dom.walker(h);
						var F = CKEDITOR.dom.walker.whitespaces(),
							L = CKEDITOR.dom.walker.bookmark();
						h.evaluator = function(a) {
							return !F(a) && !L(a)
						};
						if ((h = h.previous()) && h.type == CKEDITOR.NODE_ELEMENT && h.is("br")) break
					}
					h = this.clone();
					h.collapse();
					h.setEndAt(l, CKEDITOR.POSITION_BEFORE_END);
					h = new CKEDITOR.dom.walker(h);
					h.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? e : J;
					q = I = Q = null;
					h = h.lastForward();
					q = q || l;
					this.setEndAt(q, !h && this.checkEndOfBlock() || h && q.contains(h) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
					Q && this.setEndAfter(Q)
				}
			},
			shrink: function(a, b, c) {
				if (!this.collapsed) {
					a = a || CKEDITOR.SHRINK_TEXT;
					var d = this.clone(),
						e = this.startContainer,
						p = this.endContainer,
						g = this.startOffset,
						l = this.endOffset,
						k = 1,
						r = 1;
					e && e.type == CKEDITOR.NODE_TEXT && (g ? g >= e.getLength() ? d.setStartAfter(e) : (d.setStartBefore(e), k = 0) : d.setStartBefore(e));
					p && p.type == CKEDITOR.NODE_TEXT && (l ? l >= p.getLength() ? d.setEndAfter(p) : (d.setEndAfter(p), r = 0) : d.setEndBefore(p));
					var d = new CKEDITOR.dom.walker(d),
						h = CKEDITOR.dom.walker.bookmark();
					d.evaluator = function(b) {
						return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
					};
					var n;
					d.guard = function(b, d) {
						if (h(b)) return !0;
						if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || d && b.equals(n) || !1 === c && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")) return !1;
						d || b.type != CKEDITOR.NODE_ELEMENT || (n = b);
						return !0
					};
					k && (e = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(e, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
					r && (d.reset(), (d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END));
					return !(!k && !r)
				}
			},
			insertNode: function(a) {
				this.optimizeBookmark();
				this.trim(!1, !0);
				var b = this.startContainer,
					c = b.getChild(this.startOffset);
				c ? a.insertBefore(c) : b.append(a);
				a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
				this.setStartBefore(a)
			},
			moveToPosition: function(a, b) {
				this.setStartAt(a, b);
				this.collapse(!0)
			},
			moveToRange: function(a) {
				this.setStart(a.startContainer, a.startOffset);
				this.setEnd(a.endContainer, a.endOffset)
			},
			selectNodeContents: function(a) {
				this.setStart(a, 0);
				this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
			},
			setStart: function(b, c) {
				b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()] && (c = b.getIndex(), b = b.getParent());
				this._setStartContainer(b);
				this.startOffset = c;
				this.endContainer || (this._setEndContainer(b), this.endOffset = c);
				a(this)
			},
			setEnd: function(b, c) {
				b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()] && (c = b.getIndex() + 1, b = b.getParent());
				this._setEndContainer(b);
				this.endOffset = c;
				this.startContainer || (this._setStartContainer(b), this.startOffset = c);
				a(this)
			},
			setStartAfter: function(a) {
				this.setStart(a.getParent(), a.getIndex() + 1)
			},
			setStartBefore: function(a) {
				this.setStart(a.getParent(), a.getIndex())
			},
			setEndAfter: function(a) {
				this.setEnd(a.getParent(), a.getIndex() + 1)
			},
			setEndBefore: function(a) {
				this.setEnd(a.getParent(), a.getIndex())
			},
			setStartAt: function(b, c) {
				switch (c) {
				case CKEDITOR.POSITION_AFTER_START:
					this.setStart(b, 0);
					break;
				case CKEDITOR.POSITION_BEFORE_END:
					b.type == CKEDITOR.NODE_TEXT ? this.setStart(b, b.getLength()) : this.setStart(b, b.getChildCount());
					break;
				case CKEDITOR.POSITION_BEFORE_START:
					this.setStartBefore(b);
					break;
				case CKEDITOR.POSITION_AFTER_END:
					this.setStartAfter(b)
				}
				a(this)
			},
			setEndAt: function(b, c) {
				switch (c) {
				case CKEDITOR.POSITION_AFTER_START:
					this.setEnd(b, 0);
					break;
				case CKEDITOR.POSITION_BEFORE_END:
					b.type == CKEDITOR.NODE_TEXT ? this.setEnd(b, b.getLength()) : this.setEnd(b, b.getChildCount());
					break;
				case CKEDITOR.POSITION_BEFORE_START:
					this.setEndBefore(b);
					break;
				case CKEDITOR.POSITION_AFTER_END:
					this.setEndAfter(b)
				}
				a(this)
			},
			fixBlock: function(a, b) {
				var c = this.createBookmark(),
					d = this.document.createElement(b);
				this.collapse(a);
				this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
				this.extractContents().appendTo(d);
				d.trim();
				this.insertNode(d);
				var e = d.getBogus();
				e && e.remove();
				d.appendBogus();
				this.moveToBookmark(c);
				return d
			},
			splitBlock: function(a, b) {
				var c = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
					d = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
					e = c.block,
					p = d.block,
					g = null;
				if (!c.blockLimit.equals(d.blockLimit)) return null;
				"br" != a && (e || (e = this.fixBlock(!0, a), p = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block), p || (p = this.fixBlock(!1, a)));
				c = e && this.checkStartOfBlock();
				d = p && this.checkEndOfBlock();
				this.deleteContents();
				e && e.equals(p) && (d ? (g = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(p, CKEDITOR.POSITION_AFTER_END), p = null) : c ? (g = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START), e = null) : (p = this.splitElement(e, b || !1), e.is("ul", "ol") || e.appendBogus()));
				return {
					previousBlock: e,
					nextBlock: p,
					wasStartOfBlock: c,
					wasEndOfBlock: d,
					elementPath: g
				}
			},
			splitElement: function(a, b) {
				if (!this.collapsed) return null;
				this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
				var c = this.extractContents(!1, b || !1),
					d = a.clone(!1, b || !1);
				c.appendTo(d);
				d.insertAfter(a);
				this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
				return d
			},
			removeEmptyBlocksAtEnd: function() {
				function a(d) {
					return function(a) {
						return b(a) || c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable() || d.is("table") && a.is("caption") ? !1 : !0
					}
				}
				var b = CKEDITOR.dom.walker.whitespaces(),
					c = CKEDITOR.dom.walker.bookmark(!1);
				return function(b) {
					for (var c = this.createBookmark(), d = this[b ? "endPath" : "startPath"](), e = d.block || d.blockLimit, g; e && !e.equals(d.root) && !e.getFirst(a(e));) g = e.getParent(), this[b ? "setEndAt" : "setStartAt"](e, CKEDITOR.POSITION_AFTER_END), e.remove(1), e = g;
					this.moveToBookmark(c)
				}
			}(),
			startPath: function() {
				return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
			},
			endPath: function() {
				return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
			},
			checkBoundaryOfElement: function(a, b) {
				var d = b == CKEDITOR.START,
					e = this.clone();
				e.collapse(d);
				e[d ? "setStartAt" : "setEndAt"](a, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
				e = new CKEDITOR.dom.walker(e);
				e.evaluator = c(d);
				return e[d ? "checkBackward" : "checkForward"]()
			},
			checkStartOfBlock: function() {
				var a = this.startContainer,
					c = this.startOffset;
				CKEDITOR.env.ie && c && a.type == CKEDITOR.NODE_TEXT && (a = CKEDITOR.tools.ltrim(a.substring(0, c)), k.test(a) && this.trim(0, 1));
				this.trim();
				a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
				c = this.clone();
				c.collapse(!0);
				c.setStartAt(a.block || a.blockLimit, CKEDITOR.POSITION_AFTER_START);
				a = new CKEDITOR.dom.walker(c);
				a.evaluator = b();
				return a.checkBackward()
			},
			checkEndOfBlock: function() {
				var a = this.endContainer,
					c = this.endOffset;
				CKEDITOR.env.ie && a.type == CKEDITOR.NODE_TEXT && (a = CKEDITOR.tools.rtrim(a.substring(c)), k.test(a) && this.trim(1, 0));
				this.trim();
				a = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
				c = this.clone();
				c.collapse(!1);
				c.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
				a = new CKEDITOR.dom.walker(c);
				a.evaluator = b();
				return a.checkForward()
			},
			getPreviousNode: function(a, b, c) {
				var d = this.clone();
				d.collapse(1);
				d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
				c = new CKEDITOR.dom.walker(d);
				c.evaluator = a;
				c.guard = b;
				return c.previous()
			},
			getNextNode: function(a, b, c) {
				var d = this.clone();
				d.collapse();
				d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
				c = new CKEDITOR.dom.walker(d);
				c.evaluator = a;
				c.guard = b;
				return c.next()
			},
			checkReadOnly: function() {
				function a(b, c) {
					for (; b;) {
						if (b.type == CKEDITOR.NODE_ELEMENT) {
							if ("false" == b.getAttribute("contentEditable") && !b.data("cke-editable")) return 0;
							if (b.is("html") || "true" == b.getAttribute("contentEditable") && (b.contains(c) || b.equals(c))) break
						}
						b = b.getParent()
					}
					return 1
				}
				return function() {
					var b = this.startContainer,
						c = this.endContainer;
					return !(a(b, c) && a(c, b))
				}
			}(),
			moveToElementEditablePosition: function(a, b) {
				if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(!1)) return this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START), !0;
				for (var c = 0; a;) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						b && this.endContainer && this.checkEndOfBlock() && k.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
						c = 1;
						break
					}
					if (a.type == CKEDITOR.NODE_ELEMENT) if (a.isEditable()) this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START), c = 1;
					else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
					else if ("false" == a.getAttribute("contenteditable") && a.is(CKEDITOR.dtd.$block)) return this.setStartBefore(a), this.setEndAfter(a), !0;
					var d = a,
						e = c,
						p = void 0;
					d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(!1) && (p = d[b ? "getLast" : "getFirst"](w));
					e || p || (p = d[b ? "getPrevious" : "getNext"](w));
					a = p
				}
				return !!c
			},
			moveToClosestEditablePosition: function(a, b) {
				var c, d = 0,
					e, p, g = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
				a ? (c = new CKEDITOR.dom.range(this.root), c.moveToPosition(a, g[b ? 0 : 1])) : c = this.clone();
				if (a && !a.is(CKEDITOR.dtd.$block)) d = 1;
				else if (e = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) d = 1, (p = e.type == CKEDITOR.NODE_ELEMENT) && e.is(CKEDITOR.dtd.$block) && "false" == e.getAttribute("contenteditable") ? (c.setStartAt(e, CKEDITOR.POSITION_BEFORE_START), c.setEndAt(e, CKEDITOR.POSITION_AFTER_END)) : !CKEDITOR.env.needsBrFiller && p && e.is(CKEDITOR.dom.walker.validEmptyBlockContainers) ? (c.setEnd(e, 0), c.collapse()) : c.moveToPosition(e, g[b ? 1 : 0]);
				d && this.moveToRange(c);
				return !!d
			},
			moveToElementEditStart: function(a) {
				return this.moveToElementEditablePosition(a)
			},
			moveToElementEditEnd: function(a) {
				return this.moveToElementEditablePosition(a, !0)
			},
			getEnclosedNode: function() {
				var a = this.clone();
				a.optimize();
				if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT) return null;
				var a = new CKEDITOR.dom.walker(a),
					b = CKEDITOR.dom.walker.bookmark(!1, !0),
					c = CKEDITOR.dom.walker.whitespaces(!0);
				a.evaluator = function(a) {
					return c(a) && b(a)
				};
				var d = a.next();
				a.reset();
				return d && d.equals(a.previous()) ? d : null
			},
			getTouchedStartNode: function() {
				var a = this.startContainer;
				return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
			},
			getTouchedEndNode: function() {
				var a = this.endContainer;
				return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
			},
			getNextEditableNode: e(),
			getPreviousEditableNode: e(1),
			scrollIntoView: function() {
				var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document),
					b, c, d, e = this.clone();
				e.optimize();
				(d = e.startContainer.type == CKEDITOR.NODE_TEXT) ? (c = e.startContainer.getText(), b = e.startContainer.split(e.startOffset), a.insertAfter(e.startContainer)) : e.insertNode(a);
				a.scrollIntoView();
				d && (e.startContainer.setText(c), b.remove());
				a.remove()
			},
			_setStartContainer: function(a) {
				this.startContainer = a
			},
			_setEndContainer: function(a) {
				this.endContainer = a
			}
		}
	})();
	CKEDITOR.POSITION_AFTER_START = 1;
	CKEDITOR.POSITION_BEFORE_END = 2;
	CKEDITOR.POSITION_BEFORE_START = 3;
	CKEDITOR.POSITION_AFTER_END = 4;
	CKEDITOR.ENLARGE_ELEMENT = 1;
	CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;
	CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;
	CKEDITOR.ENLARGE_INLINE = 4;
	CKEDITOR.START = 1;
	CKEDITOR.END = 2;
	CKEDITOR.SHRINK_ELEMENT = 1;
	CKEDITOR.SHRINK_TEXT = 2;
	"use strict";
	(function() {
		function a(a) {
			1 > arguments.length || (this.range = a, this.forceBrBreak = 0, this.enlargeBr = 1, this.enforceRealBlocks = 0, this._ || (this._ = {}))
		}

		function d(a) {
			var b = [];
			a.forEach(function(a) {
				if ("true" == a.getAttribute("contenteditable")) return b.push(a), !1
			}, CKEDITOR.NODE_ELEMENT, !0);
			return b
		}

		function b(a, c, e, g) {
			a: {
				null == g && (g = d(e));
				for (var l; l = g.shift();) if (l.getDtd().p) {
					g = {
						element: l,
						remaining: g
					};
					break a
				}
				g = null
			}
			if (!g) return 0;
			if ((l = CKEDITOR.filter.instances[g.element.data("cke-filter")]) && !l.check(c)) return b(a, c, e, g.remaining);
			c = new CKEDITOR.dom.range(g.element);
			c.selectNodeContents(g.element);
			c = c.createIterator();
			c.enlargeBr = a.enlargeBr;
			c.enforceRealBlocks = a.enforceRealBlocks;
			c.activeFilter = c.filter = l;
			a._.nestedEditable = {
				element: g.element,
				container: e,
				remaining: g.remaining,
				iterator: c
			};
			return 1
		}

		function c(a, b, c) {
			if (!b) return !1;
			a = a.clone();
			a.collapse(!c);
			return a.checkBoundaryOfElement(b, c ? CKEDITOR.START : CKEDITOR.END)
		}
		var e = /^[\r\n\t ]+$/,
			g = CKEDITOR.dom.walker.bookmark(!1, !0),
			l = CKEDITOR.dom.walker.whitespaces(!0),
			k = function(a) {
				return g(a) && l(a)
			},
			q = {
				dd: 1,
				dt: 1,
				li: 1
			};
		a.prototype = {
			getNextParagraph: function(a) {
				var d, l, A, t, D;
				a = a || "p";
				if (this._.nestedEditable) {
					if (d = this._.nestedEditable.iterator.getNextParagraph(a)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, d;
					this.activeFilter = this.filter;
					if (b(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, this._.nestedEditable.iterator.getNextParagraph(a);
					this._.nestedEditable = null
				}
				if (!this.range.root.getDtd()[a]) return null;
				if (!this._.started) {
					var p = this.range.clone();
					l = p.startPath();
					var x = p.endPath(),
						G = !p.collapsed && c(p, l.block),
						u = !p.collapsed && c(p, x.block, 1);
					p.shrink(CKEDITOR.SHRINK_ELEMENT, !0);
					G && p.setStartAt(l.block, CKEDITOR.POSITION_BEFORE_END);
					u && p.setEndAt(x.block, CKEDITOR.POSITION_AFTER_START);
					l = p.endContainer.hasAscendant("pre", !0) || p.startContainer.hasAscendant("pre", !0);
					p.enlarge(this.forceBrBreak && !l || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					p.collapsed || (l = new CKEDITOR.dom.walker(p.clone()), x = CKEDITOR.dom.walker.bookmark(!0, !0), l.evaluator = x, this._.nextNode = l.next(), l = new CKEDITOR.dom.walker(p.clone()), l.evaluator = x, l = l.previous(), this._.lastNode = l.getNextSourceNode(!0, null, p.root), this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary() && (x = this.range.clone(), x.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END), x.checkEndOfBlock() && (x = new CKEDITOR.dom.elementPath(x.endContainer, x.root), this._.lastNode = (x.block || x.blockLimit).getNextSourceNode(!0))), this._.lastNode && p.root.contains(this._.lastNode) || (this._.lastNode = this._.docEndMarker = p.document.createText(""), this._.lastNode.insertAfter(l)), p = null);
					this._.started = 1;
					l = p
				}
				x = this._.nextNode;
				p = this._.lastNode;
				for (this._.nextNode = null; x;) {
					var G = 0,
						u = x.hasAscendant("pre"),
						r = x.type != CKEDITOR.NODE_ELEMENT,
						h = 0;
					if (r) x.type == CKEDITOR.NODE_TEXT && e.test(x.getText()) && (r = 0);
					else {
						var n = x.getName();
						if (CKEDITOR.dtd.$block[n] && "false" == x.getAttribute("contenteditable")) {
							d = x;
							b(this, a, d);
							break
						} else if (x.isBlockBoundary(this.forceBrBreak && !u && {
							br: 1
						})) {
							if ("br" == n) r = 1;
							else if (!l && !x.getChildCount() && "hr" != n) {
								d = x;
								A = x.equals(p);
								break
							}
							l && (l.setEndAt(x, CKEDITOR.POSITION_BEFORE_START), "br" != n && (this._.nextNode = x));
							G = 1
						} else {
							if (x.getFirst()) {
								l || (l = this.range.clone(), l.setStartAt(x, CKEDITOR.POSITION_BEFORE_START));
								x = x.getFirst();
								continue
							}
							r = 1
						}
					}
					r && !l && (l = this.range.clone(), l.setStartAt(x, CKEDITOR.POSITION_BEFORE_START));
					A = (!G || r) && x.equals(p);
					if (l && !G) for (; !x.getNext(k) && !A;) {
						n = x.getParent();
						if (n.isBlockBoundary(this.forceBrBreak && !u && {
							br: 1
						})) {
							G = 1;
							r = 0;
							A || n.equals(p);
							l.setEndAt(n, CKEDITOR.POSITION_BEFORE_END);
							break
						}
						x = n;
						r = 1;
						A = x.equals(p);
						h = 1
					}
					r && l.setEndAt(x, CKEDITOR.POSITION_AFTER_END);
					x = this._getNextSourceNode(x, h, p);
					if ((A = !x) || G && l) break
				}
				if (!d) {
					if (!l) return this._.docEndMarker && this._.docEndMarker.remove(), this._.nextNode = null;
					d = new CKEDITOR.dom.elementPath(l.startContainer, l.root);
					x = d.blockLimit;
					G = {
						div: 1,
						th: 1,
						td: 1
					};
					d = d.block;
					!d && x && !this.enforceRealBlocks && G[x.getName()] && l.checkStartOfBlock() && l.checkEndOfBlock() && !x.equals(l.root) ? d = x : !d || this.enforceRealBlocks && d.is(q) ? (d = this.range.document.createElement(a), l.extractContents().appendTo(d), d.trim(), l.insertNode(d), t = D = !0) : "li" != d.getName() ? l.checkStartOfBlock() && l.checkEndOfBlock() || (d = d.clone(!1), l.extractContents().appendTo(d), d.trim(), D = l.splitBlock(), t = !D.wasStartOfBlock, D = !D.wasEndOfBlock, l.insertNode(d)) : A || (this._.nextNode = d.equals(p) ? null : this._getNextSourceNode(l.getBoundaryNodes().endNode, 1, p))
				}
				t && (t = d.getPrevious()) && t.type == CKEDITOR.NODE_ELEMENT && ("br" == t.getName() ? t.remove() : t.getLast() && "br" == t.getLast().$.nodeName.toLowerCase() && t.getLast().remove());
				D && (t = d.getLast()) && t.type == CKEDITOR.NODE_ELEMENT && "br" == t.getName() && (!CKEDITOR.env.needsBrFiller || t.getPrevious(g) || t.getNext(g)) && t.remove();
				this._.nextNode || (this._.nextNode = A || d.equals(p) || !p ? null : this._getNextSourceNode(d, 1, p));
				return d
			},
			_getNextSourceNode: function(a, b, c) {
				function d(a) {
					return !(a.equals(c) || a.equals(e))
				}
				var e = this.range.root;
				for (a = a.getNextSourceNode(b, null, d); !g(a);) a = a.getNextSourceNode(b, null, d);
				return a
			}
		};
		CKEDITOR.dom.range.prototype.createIterator = function() {
			return new a(this)
		}
	})();
	CKEDITOR.command = function(a, d) {
		this.uiItems = [];
		this.exec = function(b) {
			if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) return !1;
			this.editorFocus && a.focus();
			return !1 === this.fire("exec") ? !0 : !1 !== d.exec.call(this, a, b)
		};
		this.refresh = function(a, b) {
			if (!this.readOnly && a.readOnly) return !0;
			if (this.context && !b.isContextFor(this.context) || !this.checkAllowed(!0)) return this.disable(), !0;
			this.startDisabled || this.enable();
			this.modes && !this.modes[a.mode] && this.disable();
			return !1 === this.fire("refresh", {
				editor: a,
				path: b
			}) ? !0 : d.refresh && !1 !== d.refresh.apply(this, arguments)
		};
		var b;
		this.checkAllowed = function(c) {
			return c || "boolean" != typeof b ? b = a.activeFilter.checkFeature(this) : b
		};
		CKEDITOR.tools.extend(this, d, {
			modes: {
				wysiwyg: 1
			},
			editorFocus: 1,
			contextSensitive: !! d.context,
			state: CKEDITOR.TRISTATE_DISABLED
		});
		CKEDITOR.event.call(this)
	};
	CKEDITOR.command.prototype = {
		enable: function() {
			this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(this.preserveState && "undefined" != typeof this.previousState ? this.previousState : CKEDITOR.TRISTATE_OFF)
		},
		disable: function() {
			this.setState(CKEDITOR.TRISTATE_DISABLED)
		},
		setState: function(a) {
			if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) return !1;
			this.previousState = this.state;
			this.state = a;
			this.fire("state");
			return !0
		},
		toggleState: function() {
			this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
		}
	};
	CKEDITOR.event.implementOn(CKEDITOR.command.prototype);
	CKEDITOR.ENTER_P = 1;
	CKEDITOR.ENTER_BR = 2;
	CKEDITOR.ENTER_DIV = 3;
	CKEDITOR.config = {
		customConfig: "/static/plugins/ckeditor/config.js",
		autoUpdateElement: !0,
		language: "",
		defaultLanguage: "en",
		contentsLangDirection: "",
		enterMode: CKEDITOR.ENTER_P,
		forceEnterMode: !1,
		shiftEnterMode: CKEDITOR.ENTER_BR,
		docType: "<!DOCTYPE html>",
		bodyId: "",
		bodyClass: "",
		fullPage: !1,
		height: 200,
		contentsCss: CKEDITOR.getUrl("contents.css"),
		extraPlugins: "",
		removePlugins: "",
		protectedSource: [],
		tabIndex: 0,
		width: "",
		baseFloatZIndex: 1E4,
		blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
	};
	(function() {
		function a(a, b, c, d, e) {
			var h, n;
			a = [];
			for (h in b) {
				n = b[h];
				n = "boolean" == typeof n ? {} : "function" == typeof n ? {
					match: n
				} : H(n);
				"$" != h.charAt(0) && (n.elements = h);
				c && (n.featureName = c.toLowerCase());
				var m = n;
				m.elements = l(m.elements, /\s+/) || null;
				m.propertiesOnly = m.propertiesOnly || !0 === m.elements;
				var f = /\s*,\s*/,
					p = void 0;
				for (p in Q) {
					m[p] = l(m[p], f) || null;
					var F = m,
						r = v[p],
						g = l(m[v[p]], f),
						z = m[p],
						E = [],
						B = !0,
						L = void 0;
					g ? B = !1 : g = {};
					for (L in z)"!" == L.charAt(0) && (L = L.slice(1), E.push(L), g[L] = !0, B = !1);
					for (; L = E.pop();) z[L] = z["!" + L], delete z["!" + L];
					F[r] = (B ? !1 : g) || null
				}
				m.match = m.match || null;
				d.push(n);
				a.push(n)
			}
			b = e.elements;
			e = e.generic;
			var k;
			c = 0;
			for (d = a.length; c < d; ++c) {
				h = H(a[c]);
				n = !0 === h.classes || !0 === h.styles || !0 === h.attributes;
				m = h;
				p = r = f = void 0;
				for (f in Q) m[f] = G(m[f]);
				F = !0;
				for (p in v) {
					f = v[p];
					r = m[f];
					g = [];
					z = void 0;
					for (z in r) - 1 < z.indexOf("*") ? g.push(new RegExp("^" + z.replace(/\*/g, ".*") + "$")) : g.push(z);
					r = g;
					r.length && (m[f] = r, F = !1)
				}
				m.nothingRequired = F;
				m.noProperties = !(m.attributes || m.classes || m.styles);
				if (!0 === h.elements || null === h.elements) e[n ? "unshift" : "push"](h);
				else for (k in m = h.elements, delete h.elements, m) if (b[k]) b[k][n ? "unshift" : "push"](h);
				else b[k] = [h]
			}
		}

		function d(a, c, d, h) {
			if (!a.match || a.match(c)) if (h || k(a, c)) if (a.propertiesOnly || (d.valid = !0), d.allAttributes || (d.allAttributes = b(a.attributes, c.attributes, d.validAttributes)), d.allStyles || (d.allStyles = b(a.styles, c.styles, d.validStyles)), !d.allClasses) {
				a = a.classes;
				c = c.classes;
				h = d.validClasses;
				if (a) if (!0 === a) a = !0;
				else {
					for (var n = 0, e = c.length, m; n < e; ++n) m = c[n], h[m] || (h[m] = a(m));
					a = !1
				} else a = !1;
				d.allClasses = a
			}
		}

		function b(a, b, c) {
			if (!a) return !1;
			if (!0 === a) return !0;
			for (var d in b) c[d] || (c[d] = a(d));
			return !1
		}

		function c(a, b, c) {
			if (!a.match || a.match(b)) {
				if (a.noProperties) return !1;
				c.hadInvalidAttribute = e(a.attributes, b.attributes) || c.hadInvalidAttribute;
				c.hadInvalidStyle = e(a.styles, b.styles) || c.hadInvalidStyle;
				a = a.classes;
				b = b.classes;
				if (a) {
					for (var d = !1, h = !0 === a, n = b.length; n--;) if (h || a(b[n])) b.splice(n, 1), d = !0;
					a = d
				} else a = !1;
				c.hadInvalidClass = a || c.hadInvalidClass
			}
		}

		function e(a, b) {
			if (!a) return !1;
			var c = !1,
				d = !0 === a,
				h;
			for (h in b) if (d || a(h)) delete b[h], c = !0;
			return c
		}

		function g(a, b, c) {
			if (a.disabled || a.customConfig && !c || !b) return !1;
			a._.cachedChecks = {};
			return !0
		}

		function l(a, b) {
			if (!a) return !1;
			if (!0 === a) return a;
			if ("string" == typeof a) return a = R(a), "*" == a ? !0 : CKEDITOR.tools.convertArrayToObject(a.split(b));
			if (CKEDITOR.tools.isArray(a)) return a.length ? CKEDITOR.tools.convertArrayToObject(a) : !1;
			var c = {},
				d = 0,
				h;
			for (h in a) c[h] = a[h], d++;
			return d ? c : !1
		}

		function k(a, b) {
			if (a.nothingRequired) return !0;
			var c, d, h, n;
			if (h = a.requiredClasses) for (n = b.classes, c = 0; c < h.length; ++c) if (d = h[c], "string" == typeof d) {
				if (-1 == CKEDITOR.tools.indexOf(n, d)) return !1
			} else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(n, d)) return !1;
			return q(b.styles, a.requiredStyles) && q(b.attributes, a.requiredAttributes)
		}

		function q(a, b) {
			if (!b) return !0;
			for (var c = 0, d; c < b.length; ++c) if (d = b[c], "string" == typeof d) {
				if (!(d in a)) return !1
			} else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, d)) return !1;
			return !0
		}

		function w(a) {
			if (!a) return {};
			a = a.split(/\s*,\s*/).sort();
			for (var b = {}; a.length;) b[a.shift()] = "cke-test";
			return b
		}

		function f(a) {
			var b, c, d, h, n = {},
				e = 1;
			for (a = R(a); b = a.match(I);)(c = b[2]) ? (d = y(c, "styles"), h = y(c, "attrs"), c = y(c, "classes")) : d = h = c = null, n["$" + e++] = {
				elements: b[1],
				classes: c,
				styles: d,
				attributes: h
			}, a = a.slice(b[0].length);
			return n
		}

		function y(a, b) {
			var c = a.match(J[b]);
			return c ? R(c[1]) : null
		}

		function A(a) {
			var b = a.styleBackup = a.attributes.style,
				c = a.classBackup = a.attributes["class"];
			a.styles || (a.styles = CKEDITOR.tools.parseCssText(b || "", 1));
			a.classes || (a.classes = c ? c.split(/\s+/) : [])
		}

		function t(a, b, h, e) {
			var m = 0,
				f;
			e.toHtml && (b.name = b.name.replace(F, "$1"));
			if (e.doCallbacks && a.elementCallbacks) {
				a: {
					f = a.elementCallbacks;
					for (var g = 0, r = f.length, z; g < r; ++g) if (z = f[g](b)) {
						f = z;
						break a
					}
					f = void 0
				}
				if (f) return f
			}
			if (e.doTransform && (f = a._.transformations[b.name])) {
				A(b);
				for (g = 0; g < f.length; ++g) n(a, b, f[g]);
				p(b)
			}
			if (e.doFilter) {
				a: {
					g = b.name;
					r = a._;
					a = r.allowedRules.elements[g];
					f = r.allowedRules.generic;
					g = r.disallowedRules.elements[g];
					r = r.disallowedRules.generic;
					z = e.skipRequired;
					var E = {
						valid: !1,
						validAttributes: {},
						validClasses: {},
						validStyles: {},
						allAttributes: !1,
						allClasses: !1,
						allStyles: !1,
						hadInvalidAttribute: !1,
						hadInvalidClass: !1,
						hadInvalidStyle: !1
					},
						v, l;
					if (a || f) {
						A(b);
						if (g) for (v = 0, l = g.length; v < l; ++v) if (!1 === c(g[v], b, E)) {
							a = null;
							break a
						}
						if (r) for (v = 0, l = r.length; v < l; ++v) c(r[v], b, E);
						if (a) for (v = 0, l = a.length; v < l; ++v) d(a[v], b, E, z);
						if (f) for (v = 0, l = f.length; v < l; ++v) d(f[v], b, E, z);
						a = E
					} else a = null
				}
				if (!a || !a.valid) return h.push(b),
				1;
				l = a.validAttributes;
				var B = a.validStyles;
				f = a.validClasses;
				var g = b.attributes,
					k = b.styles,
					r = b.classes;
				z = b.classBackup;
				var J = b.styleBackup,
					C, I, K = [],
					E = [],
					H = /^data-cke-/;
				v = !1;
				delete g.style;
				delete g["class"];
				delete b.classBackup;
				delete b.styleBackup;
				if (!a.allAttributes) for (C in g) l[C] || (H.test(C) ? C == (I = C.replace(/^data-cke-saved-/, "")) || l[I] || (delete g[C], v = !0) : (delete g[C], v = !0));
				if (!a.allStyles || a.hadInvalidStyle) {
					for (C in k) a.allStyles || B[C] ? K.push(C + ":" + k[C]) : v = !0;
					K.length && (g.style = K.sort().join("; "))
				} else J && (g.style = J);
				if (!a.allClasses || a.hadInvalidClass) {
					for (C = 0; C < r.length; ++C)(a.allClasses || f[r[C]]) && E.push(r[C]);
					E.length && (g["class"] = E.sort().join(" "));
					z && E.length < z.split(/\s+/).length && (v = !0)
				} else z && (g["class"] = z);
				v && (m = 1);
				if (!e.skipFinalValidation && !x(b)) return h.push(b), 1
			}
			e.toHtml && (b.name = b.name.replace(L, "cke:$1"));
			return m
		}

		function D(a) {
			var b = [],
				c;
			for (c in a) - 1 < c.indexOf("*") && b.push(c.replace(/\*/g, ".*"));
			return b.length ? new RegExp("^(?:" + b.join("|") + ")$") : null
		}

		function p(a) {
			var b = a.attributes,
				c;
			delete b.style;
			delete b["class"];
			if (c = CKEDITOR.tools.writeCssText(a.styles, !0)) b.style = c;
			a.classes.length && (b["class"] = a.classes.sort().join(" "))
		}

		function x(a) {
			switch (a.name) {
			case "a":
				if (!(a.children.length || a.attributes.name || a.attributes.id)) return !1;
				break;
			case "img":
				if (!a.attributes.src) return !1
			}
			return !0
		}

		function G(a) {
			if (!a) return !1;
			if (!0 === a) return !0;
			var b = D(a);
			return function(c) {
				return c in a || b && c.match(b)
			}
		}

		function u() {
			return new CKEDITOR.htmlParser.element("br")
		}

		function r(a) {
			return a.type == CKEDITOR.NODE_ELEMENT && ("br" == a.name || C.$block[a.name])
		}

		function h(a, b, c) {
			var d = a.name;
			if (C.$empty[d] || !a.children.length)"hr" == d && "br" == b ? a.replaceWith(u()) : (a.parent && c.push({
				check: "it",
				el: a.parent
			}), a.remove());
			else if (C.$block[d] || "tr" == d) if ("br" == b) a.previous && !r(a.previous) && (b = u(), b.insertBefore(a)), a.next && !r(a.next) && (b = u(), b.insertAfter(a)), a.replaceWithChildren();
			else {
				var d = a.children,
					h;
				b: {
					h = C[b];
					for (var n = 0, e = d.length, m; n < e; ++n) if (m = d[n], m.type == CKEDITOR.NODE_ELEMENT && !h[m.name]) {
						h = !1;
						break b
					}
					h = !0
				}
				if (h) a.name = b,
				a.attributes = {},
				c.push({
					check: "parent-down",
					el: a
				});
				else {
					h = a.parent;
					for (var n = h.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || "body" == h.name, f, g, e = d.length; 0 < e;) m = d[--e], n && (m.type == CKEDITOR.NODE_TEXT || m.type == CKEDITOR.NODE_ELEMENT && C.$inline[m.name]) ? (f || (f = new CKEDITOR.htmlParser.element(b), f.insertAfter(a), c.push({
						check: "parent-down",
						el: f
					})), f.add(m, 0)) : (f = null, g = C[h.name] || C.span, m.insertAfter(a), h.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || m.type != CKEDITOR.NODE_ELEMENT || g[m.name] || c.push({
						check: "el-up",
						el: m
					}));
					a.remove()
				}
			} else d in {
				style: 1,
				script: 1
			} ? a.remove() : (a.parent && c.push({
				check: "it",
				el: a.parent
			}), a.replaceWithChildren())
		}

		function n(a, b, c) {
			var d, h;
			for (d = 0; d < c.length; ++d) if (h = c[d], !(h.check && !a.check(h.check, !1) || h.left && !h.left(b))) {
				h.right(b, K);
				break
			}
		}

		function m(a, b) {
			var c = b.getDefinition(),
				d = c.attributes,
				h = c.styles,
				n, e, m, f;
			if (a.name != c.element) return !1;
			for (n in d) if ("class" == n) for (c = d[n].split(/\s+/), m = a.classes.join("|"); f = c.pop();) {
				if (-1 == m.indexOf(f)) return !1
			} else if (a.attributes[n] != d[n]) return !1;
			for (e in h) if (a.styles[e] != h[e]) return !1;
			return !0
		}

		function z(a, b) {
			var c, d;
			"string" == typeof a ? c = a : a instanceof CKEDITOR.style ? d = a : (c = a[0], d = a[1]);
			return [{
				element: c,
				left: d,
				right: function(a, c) {
					c.transform(a, b)
				}
			}]
		}

		function B(a) {
			return function(b) {
				return m(b, a)
			}
		}

		function E(a) {
			return function(b, c) {
				c[a](b)
			}
		}
		var C = CKEDITOR.dtd,
			H = CKEDITOR.tools.copy,
			R = CKEDITOR.tools.trim,
			T = ["", "p", "br", "div"];
		CKEDITOR.FILTER_SKIP_TREE = 2;
		CKEDITOR.filter = function(a) {
			this.allowedContent = [];
			this.disallowedContent = [];
			this.elementCallbacks = null;
			this.disabled = !1;
			this.editor = null;
			this.id = CKEDITOR.tools.getNextNumber();
			this._ = {
				allowedRules: {
					elements: {},
					generic: []
				},
				disallowedRules: {
					elements: {},
					generic: []
				},
				transformations: {},
				cachedTests: {}
			};
			CKEDITOR.filter.instances[this.id] = this;
			if (a instanceof CKEDITOR.editor) {
				a = this.editor = a;
				this.customConfig = !0;
				var b = a.config.allowedContent;
				!0 === b ? this.disabled = !0 : (b || (this.customConfig = !1), this.allow(b, "config", 1), this.allow(a.config.extraAllowedContent, "extra", 1), this.allow(T[a.enterMode] + " " + T[a.shiftEnterMode], "default", 1), this.disallow(a.config.disallowedContent))
			} else this.customConfig = !1, this.allow(a, "default", 1)
		};
		CKEDITOR.filter.instances = {};
		CKEDITOR.filter.prototype = {
			allow: function(b, c, d) {
				if (!g(this, b, d)) return !1;
				var h, n;
				if ("string" == typeof b) b = f(b);
				else if (b instanceof CKEDITOR.style) {
					if (b.toAllowedContentRules) return this.allow(b.toAllowedContentRules(this.editor), c, d);
					h = b.getDefinition();
					b = {};
					d = h.attributes;
					b[h.element] = h = {
						styles: h.styles,
						requiredStyles: h.styles && CKEDITOR.tools.objectKeys(h.styles)
					};
					d && (d = H(d), h.classes = d["class"] ? d["class"].split(/\s+/) : null, h.requiredClasses = h.classes, delete d["class"], h.attributes = d, h.requiredAttributes = d && CKEDITOR.tools.objectKeys(d))
				} else if (CKEDITOR.tools.isArray(b)) {
					for (h = 0; h < b.length; ++h) n = this.allow(b[h], c, d);
					return n
				}
				a(this, b, c, this.allowedContent, this._.allowedRules);
				return !0
			},
			applyTo: function(a, b, c, d) {
				if (this.disabled) return !1;
				var n = this,
					e = [],
					m = this.editor && this.editor.config.protectedSource,
					f, g = !1,
					p = {
						doFilter: !c,
						doTransform: !0,
						doCallbacks: !0,
						toHtml: b
					};
				a.forEach(function(a) {
					if (a.type == CKEDITOR.NODE_ELEMENT) {
						if ("off" == a.attributes["data-cke-filter"]) return !1;
						if (!b || "span" != a.name || !~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-")) if (f = t(n, a, e, p), f & 1) g = !0;
						else if (f & 2) return !1
					} else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
						var c;
						a: {
							var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
							c = [];
							var h, r, z;
							if (m) for (r = 0; r < m.length; ++r) if ((z = d.match(m[r])) && z[0].length == d.length) {
								c = !0;
								break a
							}
							d = CKEDITOR.htmlParser.fragment.fromHtml(d);
							1 == d.children.length && (h = d.children[0]).type == CKEDITOR.NODE_ELEMENT && t(n, h, c, p);
							c = !c.length
						}
						c || e.push(a)
					}
				}, null, !0);
				e.length && (g = !0);
				var r;
				a = [];
				d = T[d || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
				for (var z; c = e.pop();) c.type == CKEDITOR.NODE_ELEMENT ? h(c, d, a) : c.remove();
				for (; r = a.pop();) if (c = r.el, c.parent) switch (z = C[c.parent.name] || C.span, r.check) {
				case "it":
					C.$removeEmpty[c.name] && !c.children.length ? h(c, d, a) : x(c) || h(c, d, a);
					break;
				case "el-up":
					c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || z[c.name] || h(c, d, a);
					break;
				case "parent-down":
					c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || z[c.name] || h(c.parent, d, a)
				}
				return g
			},
			checkFeature: function(a) {
				if (this.disabled || !a) return !0;
				a.toFeature && (a = a.toFeature(this.editor));
				return !a.requiredContent || this.check(a.requiredContent)
			},
			disable: function() {
				this.disabled = !0
			},
			disallow: function(b) {
				if (!g(this, b, !0)) return !1;
				"string" == typeof b && (b = f(b));
				a(this, b, null, this.disallowedContent, this._.disallowedRules);
				return !0
			},
			addContentForms: function(a) {
				if (!this.disabled && a) {
					var b, c, d = [],
						h;
					for (b = 0; b < a.length && !h; ++b) c = a[b], ("string" == typeof c || c instanceof CKEDITOR.style) && this.check(c) && (h = c);
					if (h) {
						for (b = 0; b < a.length; ++b) d.push(z(a[b], h));
						this.addTransformations(d)
					}
				}
			},
			addElementCallback: function(a) {
				this.elementCallbacks || (this.elementCallbacks = []);
				this.elementCallbacks.push(a)
			},
			addFeature: function(a) {
				if (this.disabled || !a) return !0;
				a.toFeature && (a = a.toFeature(this.editor));
				this.allow(a.allowedContent, a.name);
				this.addTransformations(a.contentTransformations);
				this.addContentForms(a.contentForms);
				return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : !0
			},
			addTransformations: function(a) {
				var b, c;
				if (!this.disabled && a) {
					var d = this._.transformations,
						h;
					for (h = 0; h < a.length; ++h) {
						b = a[h];
						var n = void 0,
							e = void 0,
							m = void 0,
							f = void 0,
							g = void 0,
							r = void 0;
						c = [];
						for (e = 0; e < b.length; ++e) m = b[e], "string" == typeof m ? (m = m.split(/\s*:\s*/), f = m[0], g = null, r = m[1]) : (f = m.check, g = m.left, r = m.right), n || (n = m, n = n.element ? n.element : f ? f.match(/^([a-z0-9]+)/i)[0] : n.left.getDefinition().element), g instanceof CKEDITOR.style && (g = B(g)), c.push({
							check: f == n ? null : f,
							left: g,
							right: "string" == typeof r ? E(r) : r
						});
						b = n;
						d[b] || (d[b] = []);
						d[b].push(c)
					}
				}
			},
			check: function(a, b, c) {
				if (this.disabled) return !0;
				if (CKEDITOR.tools.isArray(a)) {
					for (var d = a.length; d--;) if (this.check(a[d], b, c)) return !0;
					return !1
				}
				var h, e;
				if ("string" == typeof a) {
					e = a + "<" + (!1 === b ? "0" : "1") + (c ? "1" : "0") + ">";
					if (e in this._.cachedChecks) return this._.cachedChecks[e];
					d = f(a).$1;
					h = d.styles;
					var m = d.classes;
					d.name = d.elements;
					d.classes = m = m ? m.split(/\s*,\s*/) : [];
					d.styles = w(h);
					d.attributes = w(d.attributes);
					d.children = [];
					m.length && (d.attributes["class"] = m.join(" "));
					h && (d.attributes.style = CKEDITOR.tools.writeCssText(d.styles));
					h = d
				} else d = a.getDefinition(), h = d.styles, m = d.attributes || {}, h && !CKEDITOR.tools.isEmpty(h) ? (h = H(h), m.style = CKEDITOR.tools.writeCssText(h, !0)) : h = {}, h = {
					name: d.element,
					attributes: m,
					classes: m["class"] ? m["class"].split(/\s+/) : [],
					styles: h,
					children: []
				};
				var m = CKEDITOR.tools.clone(h),
					g = [],
					r;
				if (!1 !== b && (r = this._.transformations[h.name])) {
					for (d = 0; d < r.length; ++d) n(this, h, r[d]);
					p(h)
				}
				t(this, m, g, {
					doFilter: !0,
					doTransform: !1 !== b,
					skipRequired: !c,
					skipFinalValidation: !c
				});
				b = 0 < g.length ? !1 : CKEDITOR.tools.objectCompare(h.attributes, m.attributes, !0) ? !0 : !1;
				"string" == typeof a && (this._.cachedChecks[e] = b);
				return b
			},
			getAllowedEnterMode: function() {
				var a = ["p", "div", "br"],
					b = {
						p: CKEDITOR.ENTER_P,
						div: CKEDITOR.ENTER_DIV,
						br: CKEDITOR.ENTER_BR
					};
				return function(c, d) {
					var h = a.slice(),
						n;
					if (this.check(T[c])) return c;
					for (d || (h = h.reverse()); n = h.pop();) if (this.check(n)) return b[n];
					return CKEDITOR.ENTER_BR
				}
			}(),
			destroy: function() {
				delete CKEDITOR.filter.instances[this.id];
				delete this._;
				delete this.allowedContent;
				delete this.disallowedContent
			}
		};
		var Q = {
			styles: 1,
			attributes: 1,
			classes: 1
		},
			v = {
				styles: "requiredStyles",
				attributes: "requiredAttributes",
				classes: "requiredClasses"
			},
			I = /^([a-z0-9\-*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
			J = {
				styles: /{([^}]+)}/,
				attrs: /\[([^\]]+)\]/,
				classes: /\(([^\)]+)\)/
			},
			F = /^cke:(object|embed|param)$/,
			L = /^(object|embed|param)$/,
			K;
		K = CKEDITOR.filter.transformationsTools = {
			sizeToStyle: function(a) {
				this.lengthToStyle(a, "width");
				this.lengthToStyle(a, "height")
			},
			sizeToAttribute: function(a) {
				this.lengthToAttribute(a, "width");
				this.lengthToAttribute(a, "height")
			},
			lengthToStyle: function(a, b, c) {
				c = c || b;
				if (!(c in a.styles)) {
					var d = a.attributes[b];
					d && (/^\d+$/.test(d) && (d += "px"), a.styles[c] = d)
				}
				delete a.attributes[b]
			},
			lengthToAttribute: function(a, b, c) {
				c = c || b;
				if (!(c in a.attributes)) {
					var d = a.styles[b],
						h = d && d.match(/^(\d+)(?:\.\d*)?px$/);
					h ? a.attributes[c] = h[1] : "cke-test" == d && (a.attributes[c] = "cke-test")
				}
				delete a.styles[b]
			},
			alignmentToStyle: function(a) {
				if (!("float" in a.styles)) {
					var b = a.attributes.align;
					if ("left" == b || "right" == b) a.styles["float"] = b
				}
				delete a.attributes.align
			},
			alignmentToAttribute: function(a) {
				if (!("align" in a.attributes)) {
					var b = a.styles["float"];
					if ("left" == b || "right" == b) a.attributes.align = b
				}
				delete a.styles["float"]
			},
			matchesStyle: m,
			transform: function(a, b) {
				if ("string" == typeof b) a.name = b;
				else {
					var c = b.getDefinition(),
						d = c.styles,
						h = c.attributes,
						n, m, e, f;
					a.name = c.element;
					for (n in h) if ("class" == n) for (c = a.classes.join("|"), e = h[n].split(/\s+/); f = e.pop();) - 1 == c.indexOf(f) && a.classes.push(f);
					else a.attributes[n] = h[n];
					for (m in d) a.styles[m] = d[m]
				}
			}
		}
	})();
	(function() {
		CKEDITOR.focusManager = function(a) {
			if (a.focusManager) return a.focusManager;
			this.hasFocus = !1;
			this.currentActive = null;
			this._ = {
				editor: a
			};
			return this
		};
		CKEDITOR.focusManager._ = {
			blurDelay: 200
		};
		CKEDITOR.focusManager.prototype = {
			focus: function(a) {
				this._.timer && clearTimeout(this._.timer);
				a && (this.currentActive = a);
				this.hasFocus || this._.locked || ((a = CKEDITOR.currentInstance) && a.focusManager.blur(1), this.hasFocus = !0, (a = this._.editor.container) && a.addClass("cke_focus"), this._.editor.fire("focus"))
			},
			lock: function() {
				this._.locked = 1
			},
			unlock: function() {
				delete this._.locked
			},
			blur: function(a) {
				function d() {
					if (this.hasFocus) {
						this.hasFocus = !1;
						var a = this._.editor.container;
						a && a.removeClass("cke_focus");
						this._.editor.fire("blur")
					}
				}
				if (!this._.locked) {
					this._.timer && clearTimeout(this._.timer);
					var b = CKEDITOR.focusManager._.blurDelay;
					a || !b ? d.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function() {
						delete this._.timer;
						d.call(this)
					}, b, this)
				}
			},
			add: function(a, d) {
				var b = a.getCustomData("focusmanager");
				if (!b || b != this) {
					b && b.remove(a);
					var b = "focus",
						c = "blur";
					d && (CKEDITOR.env.ie ? (b = "focusin", c = "focusout") : CKEDITOR.event.useCapture = 1);
					var e = {
						blur: function() {
							a.equals(this.currentActive) && this.blur()
						},
						focus: function() {
							this.focus(a)
						}
					};
					a.on(b, e.focus, this);
					a.on(c, e.blur, this);
					d && (CKEDITOR.event.useCapture = 0);
					a.setCustomData("focusmanager", this);
					a.setCustomData("focusmanager_handlers", e)
				}
			},
			remove: function(a) {
				a.removeCustomData("focusmanager");
				var d = a.removeCustomData("focusmanager_handlers");
				a.removeListener("blur", d.blur);
				a.removeListener("focus", d.focus)
			}
		}
	})();
	CKEDITOR.keystrokeHandler = function(a) {
		if (a.keystrokeHandler) return a.keystrokeHandler;
		this.keystrokes = {};
		this.blockedKeystrokes = {};
		this._ = {
			editor: a
		};
		return this
	};
	(function() {
		var a, d = function(b) {
				b = b.data;
				var d = b.getKeystroke(),
					g = this.keystrokes[d],
					l = this._.editor;
				a = !1 === l.fire("key", {
					keyCode: d,
					domEvent: b
				});
				a || (g && (a = !1 !== l.execCommand(g, {
					from: "keystrokeHandler"
				})), a || (a = !! this.blockedKeystrokes[d]));
				a && b.preventDefault(!0);
				return !a
			},
			b = function(b) {
				a && (a = !1, b.data.preventDefault(!0))
			};
		CKEDITOR.keystrokeHandler.prototype = {
			attach: function(a) {
				a.on("keydown", d, this);
				if (CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this)
			}
		}
	})();
	(function() {
		CKEDITOR.lang = {
			languages: {
				af: 1,
				ar: 1,
				bg: 1,
				bn: 1,
				bs: 1,
				ca: 1,
				cs: 1,
				cy: 1,
				da: 1,
				de: 1,
				"de-ch": 1,
				el: 1,
				"en-au": 1,
				"en-ca": 1,
				"en-gb": 1,
				en: 1,
				eo: 1,
				es: 1,
				et: 1,
				eu: 1,
				fa: 1,
				fi: 1,
				fo: 1,
				"fr-ca": 1,
				fr: 1,
				gl: 1,
				gu: 1,
				he: 1,
				hi: 1,
				hr: 1,
				hu: 1,
				id: 1,
				is: 1,
				it: 1,
				ja: 1,
				ka: 1,
				km: 1,
				ko: 1,
				ku: 1,
				lt: 1,
				lv: 1,
				mk: 1,
				mn: 1,
				ms: 1,
				nb: 1,
				nl: 1,
				no: 1,
				pl: 1,
				"pt-br": 1,
				pt: 1,
				ro: 1,
				ru: 1,
				si: 1,
				sk: 1,
				sl: 1,
				sq: 1,
				"sr-latn": 1,
				sr: 1,
				sv: 1,
				th: 1,
				tr: 1,
				tt: 1,
				ug: 1,
				uk: 1,
				vi: 1,
				"zh-cn": 1,
				zh: 1
			},
			rtl: {
				ar: 1,
				fa: 1,
				he: 1,
				ku: 1,
				ug: 1
			},
			load: function(a, d, b) {
				a && CKEDITOR.lang.languages[a] || (a = this.detect(d, a));
				var c = this;
				d = function() {
					c[a].dir = c.rtl[a] ? "rtl" : "ltr";
					b(a, c[a])
				};
				this[a] ? d() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), d, this)
			},
			detect: function(a, d) {
				var b = this.languages;
				d = d || navigator.userLanguage || navigator.language || a;
				var c = d.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
					e = c[1],
					c = c[2];
				b[e + "-" + c] ? e = e + "-" + c : b[e] || (e = null);
				CKEDITOR.lang.detect = e ?
				function() {
					return e
				} : function(a) {
					return a
				};
				return e || a
			}
		}
	})();
	CKEDITOR.scriptLoader = function() {
		var a = {},
			d = {};
		return {
			load: function(b, c, e, g) {
				var l = "string" == typeof b;
				l && (b = [b]);
				e || (e = CKEDITOR);
				var k = b.length,
					q = [],
					w = [],
					f = function(a) {
						c && (l ? c.call(e, a) : c.call(e, q, w))
					};
				if (0 === k) f(!0);
				else {
					var y = function(a, b) {
							(b ? q : w).push(a);
							0 >= --k && (g && CKEDITOR.document.getDocumentElement().removeStyle("cursor"), f(b))
						},
						A = function(b, c) {
							a[b] = 1;
							var e = d[b];
							delete d[b];
							for (var f = 0; f < e.length; f++) e[f](b, c)
						},
						t = function(b) {
							if (a[b]) y(b, !0);
							else {
								var e = d[b] || (d[b] = []);
								e.push(y);
								if (!(1 < e.length)) {
									var f = new CKEDITOR.dom.element("script");
									f.setAttributes({
										type: "text/javascript",
										src: b
									});
									c && (CKEDITOR.env.ie && 11 > CKEDITOR.env.version ? f.$.onreadystatechange = function() {
										if ("loaded" == f.$.readyState || "complete" == f.$.readyState) f.$.onreadystatechange = null, A(b, !0)
									} : (f.$.onload = function() {
										setTimeout(function() {
											A(b, !0)
										}, 0)
									}, f.$.onerror = function() {
										A(b, !1)
									}));
									f.appendTo(CKEDITOR.document.getHead())
								}
							}
						};
					g && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
					for (var D = 0; D < k; D++) t(b[D])
				}
			},
			queue: function() {
				function a() {
					var b;
					(b = c[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0)
				}
				var c = [];
				return function(d, g) {
					var l = this;
					c.push({
						scriptUrl: d,
						callback: function() {
							g && g.apply(this, arguments);
							c.shift();
							a.call(l)
						}
					});
					1 == c.length && a.call(this)
				}
			}()
		}
	}();
	CKEDITOR.resourceManager = function(a, d) {
		this.basePath = a;
		this.fileName = d;
		this.registered = {};
		this.loaded = {};
		this.externals = {};
		this._ = {
			waitingList: {}
		}
	};
	CKEDITOR.resourceManager.prototype = {
		add: function(a, d) {
			if (this.registered[a]) throw Error('[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.');
			var b = this.registered[a] = d || {};
			b.name = a;
			b.path = this.getPath(a);
			CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
			return this.get(a)
		},
		get: function(a) {
			return this.registered[a] || null
		},
		getPath: function(a) {
			var d = this.externals[a];
			return CKEDITOR.getUrl(d && d.dir || this.basePath + a + "/")
		},
		getFilePath: function(a) {
			var d = this.externals[a];
			return CKEDITOR.getUrl(this.getPath(a) + (d ? d.file : this.fileName + ".js"))
		},
		addExternal: function(a, d, b) {
			a = a.split(",");
			for (var c = 0; c < a.length; c++) {
				var e = a[c];
				b || (d = d.replace(/[^\/]+$/, function(a) {
					b = a;
					return ""
				}));
				this.externals[e] = {
					dir: d,
					file: b || this.fileName + ".js"
				}
			}
		},
		load: function(a, d, b) {
			CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
			for (var c = this.loaded, e = this.registered, g = [], l = {}, k = {}, q = 0; q < a.length; q++) {
				var w = a[q];
				if (w) if (c[w] || e[w]) k[w] = this.get(w);
				else {
					var f = this.getFilePath(w);
					g.push(f);
					f in l || (l[f] = []);
					l[f].push(w)
				}
			}
			CKEDITOR.scriptLoader.load(g, function(a, e) {
				if (e.length) throw Error('[CKEDITOR.resourceManager.load] Resource name "' + l[e[0]].join(",") + '" was not found at "' + e[0] + '".');
				for (var f = 0; f < a.length; f++) for (var g = l[a[f]], p = 0; p < g.length; p++) {
					var x = g[p];
					k[x] = this.get(x);
					c[x] = 1
				}
				d.call(b, k)
			}, this)
		}
	};
	CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
	CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(a) {
		var d = {};
		return function(b, c, e) {
			var g = {},
				l = function(b) {
					a.call(this, b, function(a) {
						CKEDITOR.tools.extend(g, a);
						var b = [],
							f;
						for (f in a) {
							var k = a[f],
								A = k && k.requires;
							if (!d[f]) {
								if (k.icons) for (var t = k.icons.split(","), D = t.length; D--;) CKEDITOR.skin.addIcon(t[D], k.path + "icons/" + (CKEDITOR.env.hidpi && k.hidpi ? "hidpi/" : "") + t[D] + ".png");
								d[f] = 1
							}
							if (A) for (A.split && (A = A.split(",")), k = 0; k < A.length; k++) g[A[k]] || b.push(A[k])
						}
						if (b.length) l.call(this, b);
						else {
							for (f in g) k = g[f], k.onLoad && !k.onLoad._called && (!1 === k.onLoad() && delete g[f], k.onLoad._called = 1);
							c && c.call(e || window, g)
						}
					}, this)
				};
			l.call(this, b)
		}
	});
	CKEDITOR.plugins.setLang = function(a, d, b) {
		var c = this.get(a);
		a = c.langEntries || (c.langEntries = {});
		c = c.lang || (c.lang = []);
		c.split && (c = c.split(",")); - 1 == CKEDITOR.tools.indexOf(c, d) && c.push(d);
		a[d] = b
	};
	CKEDITOR.ui = function(a) {
		if (a.ui) return a.ui;
		this.items = {};
		this.instances = {};
		this.editor = a;
		this._ = {
			handlers: {}
		};
		return this
	};
	CKEDITOR.ui.prototype = {
		add: function(a, d, b) {
			b.name = a.toLowerCase();
			var c = this.items[a] = {
				type: d,
				command: b.command || null,
				args: Array.prototype.slice.call(arguments, 2)
			};
			CKEDITOR.tools.extend(c, b)
		},
		get: function(a) {
			return this.instances[a]
		},
		create: function(a) {
			var d = this.items[a],
				b = d && this._.handlers[d.type],
				c = d && d.command && this.editor.getCommand(d.command),
				b = b && b.create.apply(this, d.args);
			this.instances[a] = b;
			c && c.uiItems.push(b);
			b && !b.type && (b.type = d.type);
			return b
		},
		addHandler: function(a, d) {
			this._.handlers[a] = d
		},
		space: function(a) {
			return CKEDITOR.document.getById(this.spaceId(a))
		},
		spaceId: function(a) {
			return this.editor.id + "_" + a
		}
	};
	CKEDITOR.event.implementOn(CKEDITOR.ui);
	(function() {
		function a(a, e, f) {
			CKEDITOR.event.call(this);
			a = a && CKEDITOR.tools.clone(a);
			if (void 0 !== e) {
				if (!(e instanceof CKEDITOR.dom.element)) throw Error("Expect element of type CKEDITOR.dom.element.");
				if (!f) throw Error("One of the element modes must be specified.");
				if (CKEDITOR.env.ie && CKEDITOR.env.quirks && f == CKEDITOR.ELEMENT_MODE_INLINE) throw Error("Inline element mode is not supported on IE quirks.");
				if (!b(e, f)) throw Error('The specified element mode is not supported on element: "' + e.getName() + '".');
				this.element = e;
				this.elementMode = f;
				this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (e.getId() || e.getNameAtt())
			} else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
			this._ = {};
			this.commands = {};
			this.templates = {};
			this.name = this.name || d();
			this.id = CKEDITOR.tools.getNextId();
			this.status = "unloaded";
			this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
			this.ui = new CKEDITOR.ui(this);
			this.focusManager = new CKEDITOR.focusManager(this);
			this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
			this.on("readOnly", c);
			this.on("selectionChange", function(a) {
				g(this, a.data.path)
			});
			this.on("activeFilterChange", function() {
				g(this, this.elementPath(), !0)
			});
			this.on("mode", c);
			this.on("instanceReady", function() {
				this.config.startupFocus && this.focus()
			});
			CKEDITOR.fire("instanceCreated", null, this);
			CKEDITOR.add(this);
			CKEDITOR.tools.setTimeout(function() {
				"destroyed" !== this.status ? k(this, a) : CKEDITOR.warn("editor-incorrect-destroy")
			}, 0, this)
		}

		function d() {
			do
			var a = "editor" + ++t;
			while (CKEDITOR.instances[a]);
			return a
		}

		function b(a, b) {
			return b == CKEDITOR.ELEMENT_MODE_INLINE ? a.is(CKEDITOR.dtd.$editable) || a.is("textarea") : b == CKEDITOR.ELEMENT_MODE_REPLACE ? !a.is(CKEDITOR.dtd.$nonBodyContent) : 1
		}

		function c() {
			var a = this.commands,
				b;
			for (b in a) e(this, a[b])
		}

		function e(a, b) {
			b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
		}

		function g(a, b, c) {
			if (b) {
				var d, e, h = a.commands;
				for (e in h) d = h[e], (c || d.contextSensitive) && d.refresh(a, b)
			}
		}

		function l(a) {
			var b = a.config.customConfig;
			if (!b) return !1;
			var b = CKEDITOR.getUrl(b),
				c = D[b] || (D[b] = {});
			c.fn ? (c.fn.call(a, a.config), CKEDITOR.getUrl(a.config.customConfig) != b && l(a) || a.fireOnce("customConfigLoaded")) : CKEDITOR.scriptLoader.queue(b, function() {
				c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
				l(a)
			});
			return !0
		}

		function k(a, b) {
			a.on("customConfigLoaded", function() {
				if (b) {
					if (b.on) for (var c in b.on) a.on(c, b.on[c]);
					CKEDITOR.tools.extend(a.config, b, !0);
					delete a.config.on
				}
				c = a.config;
				a.readOnly = c.readOnly ? !0 : a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") || a.element.hasAttribute("readonly") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? a.element.hasAttribute("disabled") || a.element.hasAttribute("readonly") : !1;
				a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : !1;
				a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
				a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
				a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
				c.skin && (CKEDITOR.skinName = c.skin);
				a.fireOnce("configLoaded");
				a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
				a.filter = a.activeFilter = new CKEDITOR.filter(a);
				q(a)
			});
			b && null != b.customConfig && (a.config.customConfig = b.customConfig);
			l(a) || a.fireOnce("customConfigLoaded")
		}

		function q(a) {
			CKEDITOR.skin.loadPart("editor", function() {
				w(a)
			})
		}

		function w(a) {
			CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
				var d = a.config.title;
				a.langCode = b;
				a.lang = CKEDITOR.tools.prototypedCopy(c);
				a.title = "string" == typeof d || !1 === d ? d : [a.lang.editor, a.name].join(", ");
				a.config.contentsLangDirection || (a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir);
				a.fire("langLoaded");
				f(a)
			})
		}

		function f(a) {
			a.getStylesSet(function(b) {
				a.once("loaded", function() {
					a.fire("stylesSet", {
						styles: b
					})
				}, null, null, 1);
				y(a)
			})
		}

		function y(a) {
			var b = a.config,
				c = b.plugins,
				d = b.extraPlugins,
				e = b.removePlugins;
			if (d) var h = new RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
				c = c.replace(h, ""),
				c = c + ("," + d);
			if (e) var n = new RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
				c = c.replace(n, "");
			CKEDITOR.env.air && (c += ",adobeair");
			CKEDITOR.plugins.load(c.split(","), function(c) {
				var d = [],
					h = [],
					e = [];
				a.plugins = c;
				for (var f in c) {
					var g = c[f],
						r = g.lang,
						l = null,
						k = g.requires,
						v;
					CKEDITOR.tools.isArray(k) && (k = k.join(","));
					if (k && (v = k.match(n))) for (; k = v.pop();) CKEDITOR.error("editor-plugin-required", {
						plugin: k.replace(",", ""),
						requiredBy: f
					});
					r && !a.lang[f] && (r.split && (r = r.split(",")), 0 <= CKEDITOR.tools.indexOf(r, a.langCode) ? l = a.langCode : (l = a.langCode.replace(/-.*/, ""), l = l != a.langCode && 0 <= CKEDITOR.tools.indexOf(r, l) ? l : 0 <= CKEDITOR.tools.indexOf(r, "en") ? "en" : r[0]), g.langEntries && g.langEntries[l] ? (a.lang[f] = g.langEntries[l], l = null) : e.push(CKEDITOR.getUrl(g.path + "lang/" + l + ".js")));
					h.push(l);
					d.push(g)
				}
				CKEDITOR.scriptLoader.load(e, function() {
					for (var c = ["beforeInit", "init", "afterInit"], e = 0; e < c.length; e++) for (var n = 0; n < d.length; n++) {
						var m = d[n];
						0 === e && h[n] && m.lang && m.langEntries && (a.lang[m.name] = m.langEntries[h[n]]);
						if (m[c[e]]) m[c[e]](a)
					}
					a.fireOnce("pluginsLoaded");
					b.keystrokes && a.setKeystroke(a.config.keystrokes);
					for (n = 0; n < a.config.blockedKeystrokes.length; n++) a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[n]] = 1;
					a.status = "loaded";
					a.fireOnce("loaded");
					CKEDITOR.fire("instanceLoaded", null, a)
				})
			})
		}

		function A() {
			var a = this.element;
			if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
				var b = this.getData();
				this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
				a.is("textarea") ? a.setValue(b) : a.setHtml(b);
				return !0
			}
			return !1
		}
		a.prototype = CKEDITOR.editor.prototype;
		CKEDITOR.editor = a;
		var t = 0,
			D = {};
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			addCommand: function(a, b) {
				b.name = a.toLowerCase();
				var c = new CKEDITOR.command(this, b);
				this.mode && e(this, c);
				return this.commands[a] = c
			},
			_attachToForm: function() {
				function a(b) {
					c.updateElement();
					c._.required && !d.getValue() && !1 === c.fire("required") && b.data.preventDefault()
				}

				function b(a) {
					return !!(a && a.call && a.apply)
				}
				var c = this,
					d = c.element,
					e = new CKEDITOR.dom.element(d.$.form);
				d.is("textarea") && e && (e.on("submit", a), b(e.$.submit) && (e.$.submit = CKEDITOR.tools.override(e.$.submit, function(b) {
					return function() {
						a();
						b.apply ? b.apply(this) : b()
					}
				})), c.on("destroy", function() {
					e.removeListener("submit", a)
				}))
			},
			destroy: function(a) {
				this.fire("beforeDestroy");
				!a && A.call(this);
				this.editable(null);
				this.filter && (this.filter.destroy(), delete this.filter);
				delete this.activeFilter;
				this.status = "destroyed";
				this.fire("destroy");
				this.removeAllListeners();
				CKEDITOR.remove(this);
				CKEDITOR.fire("instanceDestroyed", null, this)
			},
			elementPath: function(a) {
				if (!a) {
					a = this.getSelection();
					if (!a) return null;
					a = a.getStartElement()
				}
				return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
			},
			createRange: function() {
				var a = this.editable();
				return a ? new CKEDITOR.dom.range(a) : null
			},
			execCommand: function(a, b) {
				var c = this.getCommand(a),
					d = {
						name: a,
						commandData: b,
						command: c
					};
				return c && c.state != CKEDITOR.TRISTATE_DISABLED && !1 !== this.fire("beforeCommandExec", d) && (d.returnValue = c.exec(d.commandData), !c.async && !1 !== this.fire("afterCommandExec", d)) ? d.returnValue : !1
			},
			getCommand: function(a) {
				return this.commands[a]
			},
			getData: function(a) {
				!a && this.fire("beforeGetData");
				var b = this._.data;
				"string" != typeof b && (b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "");
				b = {
					dataValue: b
				};
				!a && this.fire("getData", b);
				return b.dataValue
			},
			getSnapshot: function() {
				var a = this.fire("getSnapshot");
				"string" != typeof a && (a = (a = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? a.is("textarea") ? a.getValue() : a.getHtml() : "");
				return a
			},
			loadSnapshot: function(a) {
				this.fire("loadSnapshot", a)
			},
			setData: function(a, b, c) {
				var d = !0,
					e = b;
				b && "object" == typeof b && (c = b.internal, e = b.callback, d = !b.noSnapshot);
				!c && d && this.fire("saveSnapshot");
				if (e || !c) this.once("dataReady", function(a) {
					!c && d && this.fire("saveSnapshot");
					e && e.call(a.editor)
				});
				a = {
					dataValue: a
				};
				!c && this.fire("setData", a);
				this._.data = a.dataValue;
				!c && this.fire("afterSetData", a)
			},
			setReadOnly: function(a) {
				a = null == a || a;
				this.readOnly != a && (this.readOnly = a, this.keystrokeHandler.blockedKeystrokes[8] = +a, this.editable().setReadOnly(a), this.fire("readOnly"))
			},
			insertHtml: function(a, b, c) {
				this.fire("insertHtml", {
					dataValue: a,
					mode: b,
					range: c
				})
			},
			insertText: function(a) {
				this.fire("insertText", a)
			},
			insertElement: function(a) {
				this.fire("insertElement", a)
			},
			getSelectedHtml: function(a) {
				var b = this.editable(),
					c = this.getSelection(),
					c = c && c.getRanges();
				if (!b || !c || 0 === c.length) return null;
				for (var d = new CKEDITOR.dom.documentFragment, e, h, n, m = 0; m < c.length; m++) {
					var f = c[m],
						g = f.startContainer;
					g.getName && "tr" == g.getName() ? (e || (e = g.getAscendant("table").clone(), e.append(g.getAscendant("tbody").clone()), d.append(e), e = e.findOne("tbody")), h && h.equals(g) || (h = g, n = g.clone(), e.append(n)), n.append(f.cloneContents())) : d.append(f.cloneContents())
				}
				b = e ? d : b.getHtmlFromRange(c[0]);
				return a ? b.getHtml() : b
			},
			extractSelectedHtml: function(a, b) {
				var c = this.editable(),
					d = this.getSelection().getRanges();
				if (!c || 0 === d.length) return null;
				d = d[0];
				c = c.extractHtmlFromRange(d, b);
				b || this.getSelection().selectRanges([d]);
				return a ? c.getHtml() : c
			},
			focus: function() {
				this.fire("beforeFocus")
			},
			checkDirty: function() {
				return "ready" == this.status && this._.previousValue !== this.getSnapshot()
			},
			resetDirty: function() {
				this._.previousValue = this.getSnapshot()
			},
			updateElement: function() {
				return A.call(this)
			},
			setKeystroke: function() {
				for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
					[].slice.call(arguments, 0)], c, d, e = b.length; e--;) c = b[e], d = 0, CKEDITOR.tools.isArray(c) && (d = c[1], c = c[0]), d ? a[c] = d : delete a[c]
			},
			addFeature: function(a) {
				return this.filter.addFeature(a)
			},
			setActiveFilter: function(a) {
				a || (a = this.filter);
				this.activeFilter !== a && (this.activeFilter = a, this.fire("activeFilterChange"), a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, !0)))
			},
			setActiveEnterMode: function(a, b) {
				a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
				b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode;
				if (this.activeEnterMode != a || this.activeShiftEnterMode != b) this.activeEnterMode = a, this.activeShiftEnterMode = b, this.fire("activeEnterModeChange")
			},
			showNotification: function(a) {
				alert(a)
			}
		})
	})();
	CKEDITOR.ELEMENT_MODE_NONE = 0;
	CKEDITOR.ELEMENT_MODE_REPLACE = 1;
	CKEDITOR.ELEMENT_MODE_APPENDTO = 2;
	CKEDITOR.ELEMENT_MODE_INLINE = 3;
	CKEDITOR.htmlParser = function() {
		this._ = {
			htmlPartsRegex: /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g
		}
	};
	(function() {
		var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
			d = {
				checked: 1,
				compact: 1,
				declare: 1,
				defer: 1,
				disabled: 1,
				ismap: 1,
				multiple: 1,
				nohref: 1,
				noresize: 1,
				noshade: 1,
				nowrap: 1,
				readonly: 1,
				selected: 1
			};
		CKEDITOR.htmlParser.prototype = {
			onTagOpen: function() {},
			onTagClose: function() {},
			onText: function() {},
			onCDATA: function() {},
			onComment: function() {},
			parse: function(b) {
				for (var c, e, g = 0, l; c = this._.htmlPartsRegex.exec(b);) {
					e = c.index;
					if (e > g) if (g = b.substring(g, e), l) l.push(g);
					else this.onText(g);
					g = this._.htmlPartsRegex.lastIndex;
					if (e = c[1]) if (e = e.toLowerCase(), l && CKEDITOR.dtd.$cdata[e] && (this.onCDATA(l.join("")), l = null), !l) {
						this.onTagClose(e);
						continue
					}
					if (l) l.push(c[0]);
					else if (e = c[3]) {
						if (e = e.toLowerCase(), !/="/.test(e)) {
							var k = {},
								q, w = c[4];
							c = !! c[5];
							if (w) for (; q = a.exec(w);) {
								var f = q[1].toLowerCase();
								q = q[2] || q[3] || q[4] || "";
								k[f] = !q && d[f] ? f : CKEDITOR.tools.htmlDecodeAttr(q)
							}
							this.onTagOpen(e, k, c);
							!l && CKEDITOR.dtd.$cdata[e] && (l = [])
						}
					} else if (e = c[2]) this.onComment(e)
				}
				if (b.length > g) this.onText(b.substring(g, b.length))
			}
		}
	})();
	CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
		$: function() {
			this._ = {
				output: []
			}
		},
		proto: {
			openTag: function(a) {
				this._.output.push("<", a)
			},
			openTagClose: function(a, d) {
				d ? this._.output.push(" />") : this._.output.push(">")
			},
			attribute: function(a, d) {
				"string" == typeof d && (d = CKEDITOR.tools.htmlEncodeAttr(d));
				this._.output.push(" ", a, '="', d, '"')
			},
			closeTag: function(a) {
				this._.output.push("</", a, ">")
			},
			text: function(a) {
				this._.output.push(a)
			},
			comment: function(a) {
				this._.output.push("<!--", a, "-->")
			},
			write: function(a) {
				this._.output.push(a)
			},
			reset: function() {
				this._.output = [];
				this._.indent = !1
			},
			getHtml: function(a) {
				var d = this._.output.join("");
				a && this.reset();
				return d
			}
		}
	});
	"use strict";
	(function() {
		CKEDITOR.htmlParser.node = function() {};
		CKEDITOR.htmlParser.node.prototype = {
			remove: function() {
				var a = this.parent.children,
					d = CKEDITOR.tools.indexOf(a, this),
					b = this.previous,
					c = this.next;
				b && (b.next = c);
				c && (c.previous = b);
				a.splice(d, 1);
				this.parent = null
			},
			replaceWith: function(a) {
				var d = this.parent.children,
					b = CKEDITOR.tools.indexOf(d, this),
					c = a.previous = this.previous,
					e = a.next = this.next;
				c && (c.next = a);
				e && (e.previous = a);
				d[b] = a;
				a.parent = this.parent;
				this.parent = null
			},
			insertAfter: function(a) {
				var d = a.parent.children,
					b = CKEDITOR.tools.indexOf(d, a),
					c = a.next;
				d.splice(b + 1, 0, this);
				this.next = a.next;
				this.previous = a;
				a.next = this;
				c && (c.previous = this);
				this.parent = a.parent
			},
			insertBefore: function(a) {
				var d = a.parent.children,
					b = CKEDITOR.tools.indexOf(d, a);
				d.splice(b, 0, this);
				this.next = a;
				(this.previous = a.previous) && (a.previous.next = this);
				a.previous = this;
				this.parent = a.parent
			},
			getAscendant: function(a) {
				var d = "function" == typeof a ? a : "string" == typeof a ?
				function(b) {
					return b.name == a
				} : function(b) {
					return b.name in a
				}, b = this.parent;
				for (; b && b.type == CKEDITOR.NODE_ELEMENT;) {
					if (d(b)) return b;
					b = b.parent
				}
				return null
			},
			wrapWith: function(a) {
				this.replaceWith(a);
				a.add(this);
				return a
			},
			getIndex: function() {
				return CKEDITOR.tools.indexOf(this.parent.children, this)
			},
			getFilterContext: function(a) {
				return a || {}
			}
		}
	})();
	"use strict";
	CKEDITOR.htmlParser.comment = function(a) {
		this.value = a;
		this._ = {
			isBlockLike: !1
		}
	};
	CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
		type: CKEDITOR.NODE_COMMENT,
		filter: function(a, d) {
			var b = this.value;
			if (!(b = a.onComment(d, b, this))) return this.remove(), !1;
			if ("string" != typeof b) return this.replaceWith(b), !1;
			this.value = b;
			return !0
		},
		writeHtml: function(a, d) {
			d && this.filter(d);
			a.comment(this.value)
		}
	});
	"use strict";
	(function() {
		CKEDITOR.htmlParser.text = function(a) {
			this.value = a;
			this._ = {
				isBlockLike: !1
			}
		};
		CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_TEXT,
			filter: function(a, d) {
				if (!(this.value = a.onText(d, this.value, this))) return this.remove(), !1
			},
			writeHtml: function(a, d) {
				d && this.filter(d);
				a.text(this.value)
			}
		})
	})();
	"use strict";
	(function() {
		CKEDITOR.htmlParser.cdata = function(a) {
			this.value = a
		};
		CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_TEXT,
			filter: function() {},
			writeHtml: function(a) {
				a.write(this.value)
			}
		})
	})();
	"use strict";
	CKEDITOR.htmlParser.fragment = function() {
		this.children = [];
		this.parent = null;
		this._ = {
			isBlockLike: !0,
			hasInlineStarted: !1
		}
	};
	(function() {
		function a(a) {
			return a.attributes["data-cke-survive"] ? !1 : "a" == a.name && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
		}
		var d = CKEDITOR.tools.extend({
			table: 1,
			ul: 1,
			ol: 1,
			dl: 1
		}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl),
			b = {
				ol: 1,
				ul: 1
			},
			c = CKEDITOR.tools.extend({}, {
				html: 1
			}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
				style: 1,
				script: 1
			}),
			e = {
				ul: "li",
				ol: "li",
				dl: "dd",
				table: "tbody",
				tbody: "tr",
				thead: "tr",
				tfoot: "tr",
				tr: "td"
			};
		CKEDITOR.htmlParser.fragment.fromHtml = function(g, l, k) {
			function q(a) {
				var b;
				if (0 < x.length) for (var c = 0; c < x.length; c++) {
					var d = x[c],
						h = d.name,
						e = CKEDITOR.dtd[h],
						f = u.name && CKEDITOR.dtd[u.name];
					f && !f[h] || a && e && !e[a] && CKEDITOR.dtd[a] ? h == u.name && (y(u, u.parent, 1), c--) : (b || (w(), b = 1), d = d.clone(), d.parent = u, u = d, x.splice(c, 1), c--)
				}
			}

			function w() {
				for (; G.length;) y(G.shift(), u)
			}

			function f(a) {
				if (a._.isBlockLike && "pre" != a.name && "textarea" != a.name) {
					var b = a.children.length,
						c = a.children[b - 1],
						d;
					c && c.type == CKEDITOR.NODE_TEXT && ((d = CKEDITOR.tools.rtrim(c.value)) ? c.value = d : a.children.length = b - 1)
				}
			}

			function y(b, c, d) {
				c = c || u || p;
				var e = u;
				void 0 === b.previous && (A(c, b) && (u = c, D.onTagOpen(k, {}), b.returnPoint = c = u), f(b), a(b) && !b.children.length || c.add(b), "pre" == b.name && (h = !1), "textarea" == b.name && (r = !1));
				b.returnPoint ? (u = b.returnPoint, delete b.returnPoint) : u = d ? c : e
			}

			function A(a, b) {
				if ((a == p || "body" == a.name) && k && (!a.name || CKEDITOR.dtd[a.name][k])) {
					var c, d;
					return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
				}
			}

			function t(a, b) {
				return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || "dt" == a && "dd" == b || "dd" == a && "dt" == b : !1
			}
			var D = new CKEDITOR.htmlParser,
				p = l instanceof CKEDITOR.htmlParser.element ? l : "string" == typeof l ? new CKEDITOR.htmlParser.element(l) : new CKEDITOR.htmlParser.fragment,
				x = [],
				G = [],
				u = p,
				r = "textarea" == p.name,
				h = "pre" == p.name;
			D.onTagOpen = function(e, m, f, g) {
				m = new CKEDITOR.htmlParser.element(e, m);
				m.isUnknown && f && (m.isEmpty = !0);
				m.isOptionalClose = g;
				if (a(m)) x.push(m);
				else {
					if ("pre" == e) h = !0;
					else {
						if ("br" == e && h) {
							u.add(new CKEDITOR.htmlParser.text("\n"));
							return
						}
						"textarea" == e && (r = !0)
					}
					if ("br" == e) G.push(m);
					else {
						for (; !(g = (f = u.name) ? CKEDITOR.dtd[f] || (u._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c, m.isUnknown || u.isUnknown || g[e]);) if (u.isOptionalClose) D.onTagClose(f);
						else if (e in b && f in b) f = u.children, (f = f[f.length - 1]) && "li" == f.name || y(f = new CKEDITOR.htmlParser.element("li"), u), !m.returnPoint && (m.returnPoint = u), u = f;
						else if (e in CKEDITOR.dtd.$listItem && !t(e, f)) D.onTagOpen("li" == e ? "ul" : "dl", {}, 0, 1);
						else if (f in d && !t(e, f))!m.returnPoint && (m.returnPoint = u), u = u.parent;
						else if (f in CKEDITOR.dtd.$inline && x.unshift(u), u.parent) y(u, u.parent, 1);
						else {
							m.isOrphan = 1;
							break
						}
						q(e);
						w();
						m.parent = u;
						m.isEmpty ? y(m) : u = m
					}
				}
			};
			D.onTagClose = function(a) {
				for (var b = x.length - 1; 0 <= b; b--) if (a == x[b].name) {
					x.splice(b, 1);
					return
				}
				for (var c = [], d = [], h = u; h != p && h.name != a;) h._.isBlockLike || d.unshift(h), c.push(h), h = h.returnPoint || h.parent;
				if (h != p) {
					for (b = 0; b < c.length; b++) {
						var e = c[b];
						y(e, e.parent)
					}
					u = h;
					h._.isBlockLike && w();
					y(h, h.parent);
					h == u && (u = u.parent);
					x = x.concat(d)
				}
				"body" == a && (k = !1)
			};
			D.onText = function(a) {
				if (!(u._.hasInlineStarted && !G.length || h || r) && (a = CKEDITOR.tools.ltrim(a), 0 === a.length)) return;
				var b = u.name,
					f = b ? CKEDITOR.dtd[b] || (u._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c;
				if (!r && !f["#"] && b in d) D.onTagOpen(e[b] || ""), D.onText(a);
				else {
					w();
					q();
					h || r || (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
					a = new CKEDITOR.htmlParser.text(a);
					if (A(u, a)) this.onTagOpen(k, {}, 0, 1);
					u.add(a)
				}
			};
			D.onCDATA = function(a) {
				u.add(new CKEDITOR.htmlParser.cdata(a))
			};
			D.onComment = function(a) {
				w();
				q();
				u.add(new CKEDITOR.htmlParser.comment(a))
			};
			D.parse(g);
			for (w(); u != p;) y(u, u.parent, 1);
			f(p);
			return p
		};
		CKEDITOR.htmlParser.fragment.prototype = {
			type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
			add: function(a, b) {
				isNaN(b) && (b = this.children.length);
				var c = 0 < b ? this.children[b - 1] : null;
				if (c) {
					if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT && (c.value = CKEDITOR.tools.rtrim(c.value), 0 === c.value.length)) {
						this.children.pop();
						this.add(a);
						return
					}
					c.next = a
				}
				a.previous = c;
				a.parent = this;
				this.children.splice(b, 0, a);
				this._.hasInlineStarted || (this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike)
			},
			filter: function(a, b) {
				b = this.getFilterContext(b);
				a.onRoot(b, this);
				this.filterChildren(a, !1, b)
			},
			filterChildren: function(a, b, c) {
				if (this.childrenFilteredBy != a.id) {
					c = this.getFilterContext(c);
					if (b && !this.parent) a.onRoot(c, this);
					this.childrenFilteredBy = a.id;
					for (b = 0; b < this.children.length; b++)!1 === this.children[b].filter(a, c) && b--
				}
			},
			writeHtml: function(a, b) {
				b && this.filter(b);
				this.writeChildrenHtml(a)
			},
			writeChildrenHtml: function(a, b, c) {
				var d = this.getFilterContext();
				if (c && !this.parent && b) b.onRoot(d, this);
				b && this.filterChildren(b, !1, d);
				b = 0;
				c = this.children;
				for (d = c.length; b < d; b++) c[b].writeHtml(a)
			},
			forEach: function(a, b, c) {
				if (!(c || b && this.type != b)) var d = a(this);
				if (!1 !== d) {
					c = this.children;
					for (var e = 0; e < c.length; e++) d = c[e], d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : b && d.type != b || a(d)
				}
			},
			getFilterContext: function(a) {
				return a || {}
			}
		}
	})();
	"use strict";
	(function() {
		function a() {
			this.rules = []
		}

		function d(b, c, d, g) {
			var l, k;
			for (l in c)(k = b[l]) || (k = b[l] = new a), k.add(c[l], d, g)
		}
		CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
			$: function(b) {
				this.id = CKEDITOR.tools.getNextNumber();
				this.elementNameRules = new a;
				this.attributeNameRules = new a;
				this.elementsRules = {};
				this.attributesRules = {};
				this.textRules = new a;
				this.commentRules = new a;
				this.rootRules = new a;
				b && this.addRules(b, 10)
			},
			proto: {
				addRules: function(a, c) {
					var e;
					"number" == typeof c ? e = c : c && "priority" in c && (e = c.priority);
					"number" != typeof e && (e = 10);
					"object" != typeof c && (c = {});
					a.elementNames && this.elementNameRules.addMany(a.elementNames, e, c);
					a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, e, c);
					a.elements && d(this.elementsRules, a.elements, e, c);
					a.attributes && d(this.attributesRules, a.attributes, e, c);
					a.text && this.textRules.add(a.text, e, c);
					a.comment && this.commentRules.add(a.comment, e, c);
					a.root && this.rootRules.add(a.root, e, c)
				},
				applyTo: function(a) {
					a.filter(this)
				},
				onElementName: function(a, c) {
					return this.elementNameRules.execOnName(a, c)
				},
				onAttributeName: function(a, c) {
					return this.attributeNameRules.execOnName(a, c)
				},
				onText: function(a, c, d) {
					return this.textRules.exec(a, c, d)
				},
				onComment: function(a, c, d) {
					return this.commentRules.exec(a, c, d)
				},
				onRoot: function(a, c) {
					return this.rootRules.exec(a, c)
				},
				onElement: function(a, c) {
					for (var d = [this.elementsRules["^"], this.elementsRules[c.name], this.elementsRules.$], g, l = 0; 3 > l; l++) if (g = d[l]) {
						g = g.exec(a, c, this);
						if (!1 === g) return null;
						if (g && g != c) return this.onNode(a, g);
						if (c.parent && !c.name) break
					}
					return c
				},
				onNode: function(a, c) {
					var d = c.type;
					return d == CKEDITOR.NODE_ELEMENT ? this.onElement(a, c) : d == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, c.value)) : d == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, c.value)) : null
				},
				onAttribute: function(a, c, d, g) {
					return (d = this.attributesRules[d]) ? d.exec(a, g, c, this) : g
				}
			}
		});
		CKEDITOR.htmlParser.filterRulesGroup = a;
		a.prototype = {
			add: function(a, c, d) {
				this.rules.splice(this.findIndex(c), 0, {
					value: a,
					priority: c,
					options: d
				})
			},
			addMany: function(a, c, d) {
				for (var g = [this.findIndex(c), 0], l = 0, k = a.length; l < k; l++) g.push({
					value: a[l],
					priority: c,
					options: d
				});
				this.rules.splice.apply(this.rules, g)
			},
			findIndex: function(a) {
				for (var c = this.rules, d = c.length - 1; 0 <= d && a < c[d].priority;) d--;
				return d + 1
			},
			exec: function(a, c) {
				var d = c instanceof CKEDITOR.htmlParser.node || c instanceof CKEDITOR.htmlParser.fragment,
					g = Array.prototype.slice.call(arguments, 1),
					l = this.rules,
					k = l.length,
					q, w, f, y;
				for (y = 0; y < k; y++) if (d && (q = c.type, w = c.name), f = l[y], !(a.nonEditable && !f.options.applyToAll || a.nestedEditable && f.options.excludeNestedEditable)) {
					f = f.value.apply(null, g);
					if (!1 === f || d && f && (f.name != w || f.type != q)) return f;
					null != f && (g[0] = c = f)
				}
				return c
			},
			execOnName: function(a, c) {
				for (var d = 0, g = this.rules, l = g.length, k; c && d < l; d++) k = g[d], a.nonEditable && !k.options.applyToAll || a.nestedEditable && k.options.excludeNestedEditable || (c = c.replace(k.value[0], k.value[1]));
				return c
			}
		}
	})();
	(function() {
		function a(a, d) {
			function m(a) {
				return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
					"data-cke-bogus": 1
				})
			}

			function n(a, d) {
				return function(h) {
					if (h.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
						var e = [],
							n = b(h),
							r, F;
						if (n) for (f(n, 1) && e.push(n); n;) g(n) && (r = c(n)) && f(r) && ((F = c(r)) && !g(F) ? e.push(r) : (m(v).insertAfter(r), r.remove())), n = n.previous;
						for (n = 0; n < e.length; n++) e[n].remove();
						if (e = !a || !1 !== ("function" == typeof d ? d(h) : d)) v || CKEDITOR.env.needsBrFiller || h.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT ? v || CKEDITOR.env.needsBrFiller || !(7 < document.documentMode || h.name in CKEDITOR.dtd.tr || h.name in CKEDITOR.dtd.$listItem) ? (e = b(h), e = !e || "form" == h.name && "input" == e.name) : e = !1 : e = !1;
						e && h.add(m(a))
					}
				}
			}

			function f(a, b) {
				if ((!v || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && "br" == a.name && !a.attributes["data-cke-eol"]) return !0;
				var c;
				return a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(x)) && (c.index && ((new CKEDITOR.htmlParser.text(a.value.substring(0, c.index))).insertBefore(a), a.value = c[0]), !CKEDITOR.env.needsBrFiller && v && (!b || a.parent.name in z) || !v && ((c = a.previous) && "br" == c.name || !c || g(c))) ? !0 : !1
			}
			var r = {
				elements: {}
			},
				v = "html" == d,
				z = CKEDITOR.tools.extend({}, h),
				E;
			for (E in z)"#" in u[E] || delete z[E];
			for (E in z) r.elements[E] = n(v, a.config.fillEmptyBlocks);
			r.root = n(v, !1);
			r.elements.br = function(a) {
				return function(b) {
					if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
						var d = b.attributes;
						if ("data-cke-bogus" in d || "data-cke-eol" in d) delete d["data-cke-bogus"];
						else {
							for (d = b.next; d && e(d);) d = d.next;
							var h = c(b);
							!d && g(b.parent) ? l(b.parent, m(a)) : g(d) && h && !g(h) && m(a).insertBefore(d)
						}
					}
				}
			}(v);
			return r
		}

		function d(a, b) {
			return a != CKEDITOR.ENTER_BR && !1 !== b ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : !1
		}

		function b(a) {
			for (a = a.children[a.children.length - 1]; a && e(a);) a = a.previous;
			return a
		}

		function c(a) {
			for (a = a.previous; a && e(a);) a = a.previous;
			return a
		}

		function e(a) {
			return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
		}

		function g(a) {
			return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in h || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
		}

		function l(a, b) {
			var c = a.children[a.children.length - 1];
			a.children.push(b);
			b.parent = a;
			c && (c.next = b, b.previous = c)
		}

		function k(a) {
			a = a.attributes;
			"false" != a.contenteditable && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
			a.contenteditable = "false"
		}

		function q(a) {
			a = a.attributes;
			switch (a["data-cke-editable"]) {
			case "true":
				a.contenteditable = "true";
				break;
			case "1":
				delete a.contenteditable
			}
		}

		function w(a) {
			return a.replace(E, function(a, b, c) {
				return "<" + b + c.replace(C, function(a, b) {
					return H.test(b) && -1 == c.indexOf("data-cke-saved-" + b) ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
				}) + ">"
			})
		}

		function f(a, b) {
			return a.replace(b, function(a, b, c) {
				0 === a.indexOf("<textarea") && (a = b + t(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
				return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
			})
		}

		function y(a) {
			return a.replace(Q, function(a, b) {
				return decodeURIComponent(b)
			})
		}

		function A(a) {
			return a.replace(/<!--(?!{cke_protected})[\s\S]+?-->/g, function(a) {
				return "<!--" + G + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "-->"
			})
		}

		function t(a) {
			return a.replace(/<!--\{cke_protected\}\{C\}([\s\S]+?)-->/g, function(a, b) {
				return decodeURIComponent(b)
			})
		}

		function D(a, b) {
			var c = b._.dataStore;
			return a.replace(/<!--\{cke_protected\}([\s\S]+?)-->/g, function(a, b) {
				return decodeURIComponent(b)
			}).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
				return c && c[b] || ""
			})
		}

		function p(a, b) {
			var c = [],
				d = b.config.protectedSource,
				h = b._.dataStore || (b._.dataStore = {
					id: 1
				}),
				e = /<\!--\{cke_temp(comment)?\}(\d*?)-->/g,
				d = [/<script[\s\S]*?(<\/script>|$)/gi, /<noscript[\s\S]*?<\/noscript>/gi, /<meta[\s\S]*?\/?>/gi].concat(d);
			a = a.replace(/<!--[\s\S]*?-->/g, function(a) {
				return "<!--{cke_tempcomment}" + (c.push(a) - 1) + "-->"
			});
			for (var m = 0; m < d.length; m++) a = a.replace(d[m], function(a) {
				a = a.replace(e, function(a, b, d) {
					return c[d]
				});
				return /cke_temp(comment)?/.test(a) ? a : "<!--{cke_temp}" + (c.push(a) - 1) + "-->"
			});
			a = a.replace(e, function(a, b, d) {
				return "<!--" + G + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") + "-->"
			});
			a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=\/>]+))+\s*\/?>/g, function(a) {
				return a.replace(/<!--\{cke_protected\}([^>]*)-->/g, function(a, b) {
					h[h.id] = decodeURIComponent(b);
					return "{cke_protected_" + h.id+++"}"
				})
			});
			return a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(a, c, d, h) {
				return "<" + c + d + ">" + D(t(h), b) + "</" + c + ">"
			})
		}
		CKEDITOR.htmlDataProcessor = function(b) {
			var c, h, e = this;
			this.editor = b;
			this.dataFilter = c = new CKEDITOR.htmlParser.filter;
			this.htmlFilter = h = new CKEDITOR.htmlParser.filter;
			this.writer = new CKEDITOR.htmlParser.basicWriter;
			c.addRules(n);
			c.addRules(m, {
				applyToAll: !0
			});
			c.addRules(a(b, "data"), {
				applyToAll: !0
			});
			h.addRules(z);
			h.addRules(B, {
				applyToAll: !0
			});
			h.addRules(a(b, "html"), {
				applyToAll: !0
			});
			b.on("toHtml", function(a) {
				a = a.data;
				var c = a.dataValue,
					h, c = p(c, b),
					c = f(c, T),
					c = w(c),
					c = f(c, R),
					c = c.replace(v, "$1cke:$2"),
					c = c.replace(J, "<cke:$1$2></cke:$1>"),
					c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
					c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2");
				h = a.context || b.editable().getName();
				var e;
				CKEDITOR.env.ie && 9 > CKEDITOR.env.version && "pre" == h && (h = "div", c = "<pre>" + c + "</pre>", e = 1);
				h = b.document.createElement(h);
				h.setHtml("a" + c);
				c = h.getHtml().substr(1);
				c = c.replace(new RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
				e && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
				c = c.replace(I, "$1$2");
				c = y(c);
				c = t(c);
				h = !1 === a.fixForBody ? !1 : d(a.enterMode, b.config.autoParagraph);
				c = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, h);
				h && (e = c, !e.children.length && CKEDITOR.dtd[e.name][h] && (h = new CKEDITOR.htmlParser.element(h), e.add(h)));
				a.dataValue = c
			}, null, null, 5);
			b.on("toHtml", function(a) {
				a.data.filter.applyTo(a.data.dataValue, !0, a.data.dontFilter, a.data.enterMode) && b.fire("dataFiltered")
			}, null, null, 6);
			b.on("toHtml", function(a) {
				a.data.dataValue.filterChildren(e.dataFilter, !0)
			}, null, null, 10);
			b.on("toHtml", function(a) {
				a = a.data;
				var b = a.dataValue,
					c = new CKEDITOR.htmlParser.basicWriter;
				b.writeChildrenHtml(c);
				b = c.getHtml(!0);
				a.dataValue = A(b)
			}, null, null, 15);
			b.on("toDataFormat", function(a) {
				var c = a.data.dataValue;
				a.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
				a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, d(a.data.enterMode, b.config.autoParagraph))
			}, null, null, 5);
			b.on("toDataFormat", function(a) {
				a.data.dataValue.filterChildren(e.htmlFilter, !0)
			}, null, null, 10);
			b.on("toDataFormat", function(a) {
				a.data.filter.applyTo(a.data.dataValue, !1, !0)
			}, null, null, 11);
			b.on("toDataFormat", function(a) {
				var c = a.data.dataValue,
					d = e.writer;
				d.reset();
				c.writeChildrenHtml(d);
				c = d.getHtml(!0);
				c = t(c);
				c = D(c, b);
				a.data.dataValue = c
			}, null, null, 15)
		};
		CKEDITOR.htmlDataProcessor.prototype = {
			toHtml: function(a, b, c, d) {
				var h = this.editor,
					e, m, n, f;
				b && "object" == typeof b ? (e = b.context, c = b.fixForBody, d = b.dontFilter, m = b.filter, n = b.enterMode, f = b.protectedWhitespaces) : e = b;
				e || null === e || (e = h.editable().getName());
				return h.fire("toHtml", {
					dataValue: a,
					context: e,
					fixForBody: c,
					dontFilter: d,
					filter: m || h.filter,
					enterMode: n || h.enterMode,
					protectedWhitespaces: f
				}).dataValue
			},
			toDataFormat: function(a, b) {
				var c, d, h;
				b && (c = b.context, d = b.filter, h = b.enterMode);
				c || null === c || (c = this.editor.editable().getName());
				return this.editor.fire("toDataFormat", {
					dataValue: a,
					filter: d || this.editor.filter,
					context: c,
					enterMode: h || this.editor.enterMode
				}).dataValue
			}
		};
		var x = /(?:&nbsp;| )$/,
			G = "{cke_protected}",
			u = CKEDITOR.dtd,
			r = "caption colgroup col thead tfoot tbody".split(" "),
			h = CKEDITOR.tools.extend({}, u.$blockLimit, u.$block),
			n = {
				elements: {
					input: k,
					textarea: k
				}
			},
			m = {
				attributeNames: [
					[/^on/, "data-cke-pa-on"],
					[/^data-cke-expando$/, ""]
				]
			},
			z = {
				elements: {
					embed: function(a) {
						var b = a.parent;
						if (b && "object" == b.name) {
							var c = b.attributes.width,
								b = b.attributes.height;
							c && (a.attributes.width = c);
							b && (a.attributes.height = b)
						}
					},
					a: function(a) {
						var b = a.attributes;
						if (!(a.children.length || b.name || b.id || a.attributes["data-cke-saved-name"])) return !1
					}
				}
			},
			B = {
				elementNames: [
					[/^cke:/, ""],
					[/^\?xml:namespace$/, ""]
				],
				attributeNames: [
					[/^data-cke-(saved|pa)-/, ""],
					[/^data-cke-.*/, ""],
					["hidefocus", ""]
				],
				elements: {
					$: function(a) {
						var b = a.attributes;
						if (b) {
							if (b["data-cke-temp"]) return !1;
							for (var c = ["name", "href", "src"], d, h = 0; h < c.length; h++) d = "data-cke-saved-" + c[h], d in b && delete b[c[h]]
						}
						return a
					},
					table: function(a) {
						a.children.slice(0).sort(function(a, b) {
							var c, d;
							a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type && (c = CKEDITOR.tools.indexOf(r, a.name), d = CKEDITOR.tools.indexOf(r, b.name)); - 1 < c && -1 < d && c != d || (c = a.parent ? a.getIndex() : -1, d = b.parent ? b.getIndex() : -1);
							return c > d ? 1 : -1
						})
					},
					param: function(a) {
						a.children = [];
						a.isEmpty = !0;
						return a
					},
					span: function(a) {
						"Apple-style-span" == a.attributes["class"] && delete a.name
					},
					html: function(a) {
						delete a.attributes.contenteditable;
						delete a.attributes["class"]
					},
					body: function(a) {
						delete a.attributes.spellcheck;
						delete a.attributes.contenteditable
					},
					style: function(a) {
						var b = a.children[0];
						b && b.value && (b.value = CKEDITOR.tools.trim(b.value));
						a.attributes.type || (a.attributes.type = "text/css")
					},
					title: function(a) {
						var b = a.children[0];
						!b && l(a, b = new CKEDITOR.htmlParser.text);
						b.value = a.attributes["data-cke-title"] || ""
					},
					input: q,
					textarea: q
				},
				attributes: {
					"class": function(a) {
						return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || !1
					}
				}
			};
		CKEDITOR.env.ie && (B.attributes.style = function(a) {
			return a.replace(/(^|;)([^\:]+)/g, function(a) {
				return a.toLowerCase()
			})
		});
		var E = /<(a|area|img|input|source)\b([^>]*)>/gi,
			C = /([\w-:]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
			H = /^(href|src|name)$/i,
			R = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
			T = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
			Q = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
			v = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
			I = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
			J = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
	})();
	"use strict";
	CKEDITOR.htmlParser.element = function(a, d) {
		this.name = a;
		this.attributes = d || {};
		this.children = [];
		var b = a || "",
			c = b.match(/^cke:(.*)/);
		c && (b = c[1]);
		b = !! (CKEDITOR.dtd.$nonBodyContent[b] || CKEDITOR.dtd.$block[b] || CKEDITOR.dtd.$listItem[b] || CKEDITOR.dtd.$tableContent[b] || CKEDITOR.dtd.$nonEditable[b] || "br" == b);
		this.isEmpty = !! CKEDITOR.dtd.$empty[a];
		this.isUnknown = !CKEDITOR.dtd[a];
		this._ = {
			isBlockLike: b,
			hasInlineStarted: this.isEmpty || !b
		}
	};
	CKEDITOR.htmlParser.cssStyle = function(a) {
		var d = {};
		((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, e) {
			"font-family" == c && (e = e.replace(/["']/g, ""));
			d[c.toLowerCase()] = e
		});
		return {
			rules: d,
			populate: function(a) {
				var c = this.toString();
				c && (a instanceof CKEDITOR.dom.element ? a.setAttribute("style", c) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = c : a.style = c)
			},
			toString: function() {
				var a = [],
					c;
				for (c in d) d[c] && a.push(c, ":", d[c], ";");
				return a.join("")
			}
		}
	};
	(function() {
		function a(a) {
			return function(b) {
				return b.type == CKEDITOR.NODE_ELEMENT && ("string" == typeof a ? b.name == a : b.name in a)
			}
		}
		var d = function(a, b) {
				a = a[0];
				b = b[0];
				return a < b ? -1 : a > b ? 1 : 0
			},
			b = CKEDITOR.htmlParser.fragment.prototype;
		CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_ELEMENT,
			add: b.add,
			clone: function() {
				return new CKEDITOR.htmlParser.element(this.name, this.attributes)
			},
			filter: function(a, b) {
				var d = this,
					l, k;
				b = d.getFilterContext(b);
				if (b.off) return !0;
				if (!d.parent) a.onRoot(b, d);
				for (;;) {
					l = d.name;
					if (!(k = a.onElementName(b, l))) return this.remove(), !1;
					d.name = k;
					if (!(d = a.onElement(b, d))) return this.remove(), !1;
					if (d !== this) return this.replaceWith(d), !1;
					if (d.name == l) break;
					if (d.type != CKEDITOR.NODE_ELEMENT) return this.replaceWith(d), !1;
					if (!d.name) return this.replaceWithChildren(), !1
				}
				l = d.attributes;
				var q, w;
				for (q in l) {
					for (k = l[q];;) if (w = a.onAttributeName(b, q)) if (w != q) delete l[q], q = w;
					else break;
					else {
						delete l[q];
						break
					}
					w && (!1 === (k = a.onAttribute(b, d, w, k)) ? delete l[w] : l[w] = k)
				}
				d.isEmpty || this.filterChildren(a, !1, b);
				return !0
			},
			filterChildren: b.filterChildren,
			writeHtml: function(a, b) {
				b && this.filter(b);
				var g = this.name,
					l = [],
					k = this.attributes,
					q, w;
				a.openTag(g, k);
				for (q in k) l.push([q, k[q]]);
				a.sortAttributes && l.sort(d);
				q = 0;
				for (w = l.length; q < w; q++) k = l[q], a.attribute(k[0], k[1]);
				a.openTagClose(g, this.isEmpty);
				this.writeChildrenHtml(a);
				this.isEmpty || a.closeTag(g)
			},
			writeChildrenHtml: b.writeChildrenHtml,
			replaceWithChildren: function() {
				for (var a = this.children, b = a.length; b;) a[--b].insertAfter(this);
				this.remove()
			},
			forEach: b.forEach,
			getFirst: function(b) {
				if (!b) return this.children.length ? this.children[0] : null;
				"function" != typeof b && (b = a(b));
				for (var d = 0, g = this.children.length; d < g; ++d) if (b(this.children[d])) return this.children[d];
				return null
			},
			getHtml: function() {
				var a = new CKEDITOR.htmlParser.basicWriter;
				this.writeChildrenHtml(a);
				return a.getHtml()
			},
			setHtml: function(a) {
				a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children;
				for (var b = 0, d = a.length; b < d; ++b) a[b].parent = this
			},
			getOuterHtml: function() {
				var a = new CKEDITOR.htmlParser.basicWriter;
				this.writeHtml(a);
				return a.getHtml()
			},
			split: function(a) {
				for (var b = this.children.splice(a, this.children.length - a), d = this.clone(), l = 0; l < b.length; ++l) b[l].parent = d;
				d.children = b;
				b[0] && (b[0].previous = null);
				0 < a && (this.children[a - 1].next = null);
				this.parent.add(d, this.getIndex() + 1);
				return d
			},
			addClass: function(a) {
				if (!this.hasClass(a)) {
					var b = this.attributes["class"] || "";
					this.attributes["class"] = b + (b ? " " : "") + a
				}
			},
			removeClass: function(a) {
				var b = this.attributes["class"];
				b && ((b = CKEDITOR.tools.trim(b.replace(new RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"])
			},
			hasClass: function(a) {
				var b = this.attributes["class"];
				return b ? (new RegExp("(?:^|\\s)" + a + "(?=\\s|$)")).test(b) : !1
			},
			getFilterContext: function(a) {
				var b = [];
				a || (a = {
					off: !1,
					nonEditable: !1,
					nestedEditable: !1
				});
				a.off || "off" != this.attributes["data-cke-processor"] || b.push("off", !0);
				a.nonEditable || "false" != this.attributes.contenteditable ? a.nonEditable && !a.nestedEditable && "true" == this.attributes.contenteditable && b.push("nestedEditable", !0) : b.push("nonEditable", !0);
				if (b.length) {
					a = CKEDITOR.tools.copy(a);
					for (var d = 0; d < b.length; d += 2) a[b[d]] = b[d + 1]
				}
				return a
			}
		}, !0)
	})();
	(function() {
		var a = {},
			d = /{([^}]+)}/g,
			b = /([\\'])/g,
			c = /\n/g,
			e = /\r/g;
		CKEDITOR.template = function(g) {
			if (a[g]) this.output = a[g];
			else {
				var l = g.replace(b, "\\$1").replace(c, "\\n").replace(e, "\\r").replace(d, function(a, b) {
					return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
				});
				this.output = a[g] = Function("data", "buffer", "return buffer?buffer.push('" + l + "'):['" + l + "'].join('');")
			}
		}
	})();
	delete CKEDITOR.loadFullCore;
	CKEDITOR.instances = {};
	CKEDITOR.document = new CKEDITOR.dom.document(document);
	CKEDITOR.add = function(a) {
		CKEDITOR.instances[a.name] = a;
		a.on("focus", function() {
			CKEDITOR.currentInstance != a && (CKEDITOR.currentInstance = a, CKEDITOR.fire("currentInstance"))
		});
		a.on("blur", function() {
			CKEDITOR.currentInstance == a && (CKEDITOR.currentInstance = null, CKEDITOR.fire("currentInstance"))
		});
		CKEDITOR.fire("instance", null, a)
	};
	CKEDITOR.remove = function(a) {
		delete CKEDITOR.instances[a.name]
	};
	(function() {
		var a = {};
		CKEDITOR.addTemplate = function(d, b) {
			var c = a[d];
			if (c) return c;
			c = {
				name: d,
				source: b
			};
			CKEDITOR.fire("template", c);
			return a[d] = new CKEDITOR.template(c.source)
		};
		CKEDITOR.getTemplate = function(d) {
			return a[d]
		}
	})();
	(function() {
		var a = [];
		CKEDITOR.addCss = function(d) {
			a.push(d)
		};
		CKEDITOR.getCss = function() {
			return a.join("\n")
		}
	})();
	CKEDITOR.on("instanceDestroyed", function() {
		CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
	});
	CKEDITOR.TRISTATE_ON = 1;
	CKEDITOR.TRISTATE_OFF = 2;
	CKEDITOR.TRISTATE_DISABLED = 0;
	(function() {
		CKEDITOR.inline = function(a, d) {
			if (!CKEDITOR.env.isCompatible) return null;
			a = CKEDITOR.dom.element.get(a);
			if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
			var b = new CKEDITOR.editor(d, a, CKEDITOR.ELEMENT_MODE_INLINE),
				c = a.is("textarea") ? a : null;
			c ? (b.setData(c.getValue(), null, !0), a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !! b.readOnly + '" class="cke_textarea_inline">' + c.getValue() + "</div>", CKEDITOR.document), a.insertAfter(c), c.hide(), c.$.form && b._attachToForm()) : b.setData(a.getHtml(), null, !0);
			b.on("loaded", function() {
				b.fire("uiReady");
				b.editable(a);
				b.container = a;
				b.ui.contentsElement = a;
				b.setData(b.getData(1));
				b.resetDirty();
				b.fire("contentDom");
				b.mode = "wysiwyg";
				b.fire("mode");
				b.status = "ready";
				b.fireOnce("instanceReady");
				CKEDITOR.fire("instanceReady", null, b)
			}, null, null, 1E4);
			b.on("destroy", function() {
				c && (b.container.clearCustomData(), b.container.remove(), c.show());
				b.element.clearCustomData();
				delete b.element
			});
			return b
		};
		CKEDITOR.inlineAll = function() {
			var a, d, b;
			for (b in CKEDITOR.dtd.$editable) for (var c = CKEDITOR.document.getElementsByTag(b), e = 0, g = c.count(); e < g; e++) a = c.getItem(e), "true" == a.getAttribute("contenteditable") && (d = {
				element: a,
				config: {}
			}, !1 !== CKEDITOR.fire("inline", d) && CKEDITOR.inline(a, d.config))
		};
		CKEDITOR.domReady(function() {
			!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
		})
	})();
	CKEDITOR.replaceClass = "ckeditor";
	(function() {
		function a(a, e, g, l) {
			if (!CKEDITOR.env.isCompatible) return null;
			a = CKEDITOR.dom.element.get(a);
			if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
			var k = new CKEDITOR.editor(e, a, l);
			l == CKEDITOR.ELEMENT_MODE_REPLACE && (a.setStyle("visibility", "hidden"), k._.required = a.hasAttribute("required"), a.removeAttribute("required"));
			g && k.setData(g, null, !0);
			k.on("loaded", function() {
				b(k);
				l == CKEDITOR.ELEMENT_MODE_REPLACE && k.config.autoUpdateElement && a.$.form && k._attachToForm();
				k.setMode(k.config.startupMode, function() {
					k.resetDirty();
					k.status = "ready";
					k.fireOnce("instanceReady");
					CKEDITOR.fire("instanceReady", null, k)
				})
			});
			k.on("destroy", d);
			return k
		}

		function d() {
			var a = this.container,
				b = this.element;
			a && (a.clearCustomData(), a.remove());
			b && (b.clearCustomData(), this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (b.show(), this._.required && b.setAttribute("required", "required")), delete this.element)
		}

		function b(a) {
			var b = a.name,
				d = a.element,
				l = a.elementMode,
				k = a.fire("uiSpace", {
					space: "top",
					html: ""
				}).html,
				q = a.fire("uiSpace", {
					space: "bottom",
					html: ""
				}).html,
				w = new CKEDITOR.template('<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : "") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : "") + '<{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'),
				b = CKEDITOR.dom.element.createFromHtml(w.output({
					id: a.id,
					name: b,
					langDir: a.lang.dir,
					langCode: a.langCode,
					voiceLabel: a.title,
					topHtml: k ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + k + "</span>" : "",
					contentId: a.ui.spaceId("contents"),
					bottomHtml: q ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + q + "</span>" : "",
					outerEl: CKEDITOR.env.ie ? "span" : "div"
				}));
			l == CKEDITOR.ELEMENT_MODE_REPLACE ? (d.hide(), b.insertAfter(d)) : d.append(b);
			a.container = b;
			a.ui.contentsElement = a.ui.space("contents");
			k && a.ui.space("top").unselectable();
			q && a.ui.space("bottom").unselectable();
			d = a.config.width;
			l = a.config.height;
			d && b.setStyle("width", CKEDITOR.tools.cssLength(d));
			l && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(l));
			b.disableContextMenu();
			CKEDITOR.env.webkit && b.on("focus", function() {
				a.focus()
			});
			a.fireOnce("uiReady")
		}
		CKEDITOR.replace = function(b, d) {
			return a(b, d, null, CKEDITOR.ELEMENT_MODE_REPLACE)
		};
		CKEDITOR.appendTo = function(b, d, g) {
			return a(b, d, g, CKEDITOR.ELEMENT_MODE_APPENDTO)
		};
		CKEDITOR.replaceAll = function() {
			for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
				var d = null,
					l = a[b];
				if (l.name || l.id) {
					if ("string" == typeof arguments[0]) {
						if (!(new RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)")).test(l.className)) continue
					} else if ("function" == typeof arguments[0] && (d = {}, !1 === arguments[0](l, d))) continue;
					this.replace(l, d)
				}
			}
		};
		CKEDITOR.editor.prototype.addMode = function(a, b) {
			(this._.modes || (this._.modes = {}))[a] = b
		};
		CKEDITOR.editor.prototype.setMode = function(a, b) {
			var d = this,
				l = this._.modes;
			if (a != d.mode && l && l[a]) {
				d.fire("beforeSetMode", a);
				if (d.mode) {
					var k = d.checkDirty(),
						l = d._.previousModeData,
						q, w = 0;
					d.fire("beforeModeUnload");
					d.editable(0);
					d._.previousMode = d.mode;
					d._.previousModeData = q = d.getData(1);
					"source" == d.mode && l == q && (d.fire("lockSnapshot", {
						forceUpdate: !0
					}), w = 1);
					d.ui.space("contents").setHtml("");
					d.mode = ""
				} else d._.previousModeData = d.getData(1);
				this._.modes[a](function() {
					d.mode = a;
					void 0 !== k && !k && d.resetDirty();
					w ? d.fire("unlockSnapshot") : "wysiwyg" == a && d.fire("saveSnapshot");
					setTimeout(function() {
						d.fire("mode");
						b && b.call(d)
					}, 0)
				})
			}
		};
		CKEDITOR.editor.prototype.resize = function(a, b, d, l) {
			var k = this.container,
				q = this.ui.space("contents"),
				w = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement;
			l = l ? this.container.getFirst(function(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
			}) : k;
			l.setSize("width", a, !0);
			w && (w.style.width = "1%");
			var f = (l.$.offsetHeight || 0) - (q.$.clientHeight || 0),
				k = Math.max(b - (d ? 0 : f), 0);
			b = d ? b + f : b;
			q.setStyle("height", k + "px");
			w && (w.style.width = "100%");
			this.fire("resize", {
				outerHeight: b,
				contentsHeight: k,
				outerWidth: a || l.getSize("width")
			})
		};
		CKEDITOR.editor.prototype.getResizable = function(a) {
			return a ? this.ui.space("contents") : this.container
		};
		CKEDITOR.domReady(function() {
			CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
		})
	})();
	CKEDITOR.config.startupMode = "wysiwyg";
	(function() {
		function a(a) {
			var b = a.editor,
				e = a.data.path,
				m = e.blockLimit,
				f = a.data.selection,
				g = f.getRanges()[0],
				E;
			if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) if (f = d(f, e)) f.appendBogus(), E = CKEDITOR.env.ie;
			l(b, e.block, m) && g.collapsed && !g.getCommonAncestor().isReadOnly() && (e = g.clone(), e.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS), m = new CKEDITOR.dom.walker(e), m.guard = function(a) {
				return !c(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
			}, !m.checkForward() || e.checkStartOfBlock() && e.checkEndOfBlock()) && (b = g.fixBlock(!0, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p"), CKEDITOR.env.needsBrFiller || (b = b.getFirst(c)) && b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;| )$/) && b.remove(), E = 1, a.cancel());
			E && g.select()
		}

		function d(a, b) {
			if (a.isFake) return 0;
			var d = b.block || b.blockLimit,
				e = d && d.getLast(c);
			if (!(!d || !d.isBlockBoundary() || e && e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary() || d.is("pre") || d.getBogus())) return d
		}

		function b(a) {
			var b = a.data.getTarget();
			b.is("input") && (b = b.getAttribute("type"), "submit" != b && "reset" != b || a.data.preventDefault())
		}

		function c(a) {
			return f(a) && y(a)
		}

		function e(a, b) {
			return function(c) {
				var d = c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget;
				(d = d && d.nodeType == CKEDITOR.NODE_ELEMENT ? new CKEDITOR.dom.element(d) : null) && (b.equals(d) || b.contains(d)) || a.call(this, c)
			}
		}

		function g(a) {
			function b(a) {
				return function(b, h) {
					h && b.type == CKEDITOR.NODE_ELEMENT && b.is(f) && (d = b);
					if (!(h || !c(b) || a && t(b))) return !1
				}
			}
			var d, e = a.getRanges()[0];
			a = a.root;
			var f = {
				table: 1,
				ul: 1,
				ol: 1,
				dl: 1
			};
			if (e.startPath().contains(f)) {
				var g = e.clone();
				g.collapse(1);
				g.setStartAt(a, CKEDITOR.POSITION_AFTER_START);
				a = new CKEDITOR.dom.walker(g);
				a.guard = b();
				a.checkBackward();
				if (d) return g = e.clone(), g.collapse(), g.setEndAt(d, CKEDITOR.POSITION_AFTER_END), a = new CKEDITOR.dom.walker(g), a.guard = b(!0), d = !1, a.checkForward(), d
			}
			return null
		}

		function l(a, b, c) {
			return !1 !== a.config.autoParagraph && a.activeEnterMode != CKEDITOR.ENTER_BR && (a.editable().equals(c) && !b || b && "true" == b.getAttribute("contenteditable"))
		}

		function k(a) {
			return a.activeEnterMode != CKEDITOR.ENTER_BR && !1 !== a.config.autoParagraph ? a.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : !1
		}

		function q(a) {
			var b = a.editor;
			b.getSelection().scrollIntoView();
			setTimeout(function() {
				b.fire("saveSnapshot")
			}, 0)
		}

		function w(a, b, c) {
			var d = a.getCommonAncestor(b);
			for (b = a = c ? b : a;
			(a = a.getParent()) && !d.equals(a) && 1 == a.getChildCount();) b = a;
			b.remove()
		}
		var f, y, A, t, D, p, x, G, u;
		CKEDITOR.editable = CKEDITOR.tools.createClass({
			base: CKEDITOR.dom.element,
			$: function(a, b) {
				this.base(b.$ || b);
				this.editor = a;
				this.status = "unloaded";
				this.hasFocus = !1;
				this.setup()
			},
			proto: {
				focus: function() {
					var a;
					if (CKEDITOR.env.webkit && !this.hasFocus && (a = this.editor._.previousActive || this.getDocument().getActive(), this.contains(a))) {
						a.focus();
						return
					}
					try {
						this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]()
					} catch (b) {
						if (!CKEDITOR.env.ie) throw b;
					}
					CKEDITOR.env.safari && !this.isInline() && (a = CKEDITOR.document.getActive(), a.equals(this.getWindow().getFrame()) || this.getWindow().focus())
				},
				on: function(a, b) {
					var c = Array.prototype.slice.call(arguments, 0);
					CKEDITOR.env.ie && /^focus|blur$/.exec(a) && (a = "focus" == a ? "focusin" : "focusout", b = e(b, this), c[0] = a, c[1] = b);
					return CKEDITOR.dom.element.prototype.on.apply(this, c)
				},
				attachListener: function(a) {
					!this._.listeners && (this._.listeners = []);
					var b = Array.prototype.slice.call(arguments, 1),
						b = a.on.apply(a, b);
					this._.listeners.push(b);
					return b
				},
				clearListeners: function() {
					var a = this._.listeners;
					try {
						for (; a.length;) a.pop().removeListener()
					} catch (b) {}
				},
				restoreAttrs: function() {
					var a = this._.attrChanges,
						b, c;
					for (c in a) a.hasOwnProperty(c) && (b = a[c], null !== b ? this.setAttribute(c, b) : this.removeAttribute(c))
				},
				attachClass: function(a) {
					var b = this.getCustomData("classes");
					this.hasClass(a) || (!b && (b = []), b.push(a), this.setCustomData("classes", b), this.addClass(a))
				},
				changeAttr: function(a, b) {
					var c = this.getAttribute(a);
					b !== c && (!this._.attrChanges && (this._.attrChanges = {}), a in this._.attrChanges || (this._.attrChanges[a] = c), this.setAttribute(a, b))
				},
				insertText: function(a) {
					this.editor.focus();
					this.insertHtml(this.transformPlainTextToHtml(a), "text")
				},
				transformPlainTextToHtml: function(a) {
					var b = this.editor.getSelection().getStartElement().hasAscendant("pre", !0) ? CKEDITOR.ENTER_BR : this.editor.activeEnterMode;
					return CKEDITOR.tools.transformPlainTextToHtml(a, b)
				},
				insertHtml: function(a, b, c) {
					var d = this.editor;
					d.focus();
					d.fire("saveSnapshot");
					c || (c = d.getSelection().getRanges()[0]);
					p(this, b || "html", a, c);
					c.select();
					q(this);
					this.editor.fire("afterInsertHtml", {})
				},
				insertHtmlIntoRange: function(a, b, c) {
					p(this, c || "html", a, b);
					this.editor.fire("afterInsertHtml", {
						intoRange: b
					})
				},
				insertElement: function(a, b) {
					var d = this.editor;
					d.focus();
					d.fire("saveSnapshot");
					var e = d.activeEnterMode,
						d = d.getSelection(),
						f = a.getName(),
						f = CKEDITOR.dtd.$block[f];
					b || (b = d.getRanges()[0]);
					this.insertElementIntoRange(a, b) && (b.moveToPosition(a, CKEDITOR.POSITION_AFTER_END), f && ((f = a.getNext(function(a) {
						return c(a) && !t(a)
					})) && f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block) ? f.getDtd()["#"] ? b.moveToElementEditStart(f) : b.moveToElementEditEnd(a) : f || e == CKEDITOR.ENTER_BR || (f = b.fixBlock(!0, e == CKEDITOR.ENTER_DIV ? "div" : "p"), b.moveToElementEditStart(f))));
					d.selectRanges([b]);
					q(this)
				},
				insertElementIntoSelection: function(a) {
					this.insertElement(a)
				},
				insertElementIntoRange: function(a, b) {
					var c = this.editor,
						d = c.config.enterMode,
						e = a.getName(),
						f = CKEDITOR.dtd.$block[e];
					if (b.checkReadOnly()) return !1;
					b.deleteContents(1);
					b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
						tr: 1,
						table: 1,
						tbody: 1,
						thead: 1,
						tfoot: 1
					}) && x(b);
					var g, l;
					if (f) for (;
					(g = b.getCommonAncestor(0, 1)) && (l = CKEDITOR.dtd[g.getName()]) && (!l || !l[e]);) g.getName() in CKEDITOR.dtd.span ? b.splitElement(g) : b.checkStartOfBlock() && b.checkEndOfBlock() ? (b.setStartBefore(g), b.collapse(!0), g.remove()) : b.splitBlock(d == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
					b.insertNode(a);
					return !0
				},
				setData: function(a, b) {
					b || (a = this.editor.dataProcessor.toHtml(a));
					this.setHtml(a);
					this.fixInitialSelection();
					"unloaded" == this.status && (this.status = "ready");
					this.editor.fire("dataReady")
				},
				getData: function(a) {
					var b = this.getHtml();
					a || (b = this.editor.dataProcessor.toDataFormat(b));
					return b
				},
				setReadOnly: function(a) {
					this.setAttribute("contenteditable", !a)
				},
				detach: function() {
					this.removeClass("cke_editable");
					this.status = "detached";
					var a = this.editor;
					this._.detach();
					delete a.document;
					delete a.window
				},
				isInline: function() {
					return this.getDocument().equals(CKEDITOR.document)
				},
				fixInitialSelection: function() {
					function a() {
						var b = c.getDocument().$,
							d = b.getSelection(),
							h;
						a: if (d.anchorNode && d.anchorNode == c.$) h = !0;
						else {
							if (CKEDITOR.env.webkit && (h = c.getDocument().getActive()) && h.equals(c) && !d.anchorNode) {
								h = !0;
								break a
							}
							h = void 0
						}
						h && (h = new CKEDITOR.dom.range(c), h.moveToElementEditStart(c), b = b.createRange(), b.setStart(h.startContainer.$, h.startOffset), b.collapse(!0), d.removeAllRanges(), d.addRange(b))
					}

					function b() {
						var a = c.getDocument().$,
							d = a.selection,
							h = c.getDocument().getActive();
						"None" == d.type && h.equals(c) && (d = new CKEDITOR.dom.range(c), a = a.body.createTextRange(), d.moveToElementEditStart(c), d = d.startContainer, d.type != CKEDITOR.NODE_ELEMENT && (d = d.getParent()), a.moveToElementText(d.$), a.collapse(!0), a.select())
					}
					var c = this;
					if (CKEDITOR.env.ie && (9 > CKEDITOR.env.version || CKEDITOR.env.quirks)) this.hasFocus && (this.focus(), b());
					else if (this.hasFocus) this.focus(), a();
					else this.once("focus", function() {
						a()
					}, null, null, -999)
				},
				getHtmlFromRange: function(a) {
					if (a.collapsed) return new CKEDITOR.dom.documentFragment(a.document);
					a = {
						doc: this.getDocument(),
						range: a.clone()
					};
					G.eol.detect(a, this);
					G.bogus.exclude(a);
					G.cell.shrink(a);
					a.fragment = a.range.cloneContents();
					G.tree.rebuild(a, this);
					G.eol.fix(a, this);
					return new CKEDITOR.dom.documentFragment(a.fragment.$)
				},
				extractHtmlFromRange: function(a, b) {
					var c = u,
						d = {
							range: a,
							doc: a.document
						},
						e = this.getHtmlFromRange(a);
					if (a.collapsed) return a.optimize(), e;
					a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
					c.table.detectPurge(d);
					d.bookmark = a.createBookmark();
					delete d.range;
					var f = this.editor.createRange();
					f.moveToPosition(d.bookmark.startNode, CKEDITOR.POSITION_BEFORE_START);
					d.targetBookmark = f.createBookmark();
					c.list.detectMerge(d, this);
					c.table.detectRanges(d, this);
					c.block.detectMerge(d, this);
					d.tableContentsRanges ? (c.table.deleteRanges(d), a.moveToBookmark(d.bookmark), d.range = a) : (a.moveToBookmark(d.bookmark), d.range = a, a.extractContents(c.detectExtractMerge(d)));
					a.moveToBookmark(d.targetBookmark);
					a.optimize();
					c.fixUneditableRangePosition(a);
					c.list.merge(d, this);
					c.table.purge(d, this);
					c.block.merge(d, this);
					if (b) {
						c = a.startPath();
						if (d = a.checkStartOfBlock() && a.checkEndOfBlock() && c.block && !a.root.equals(c.block)) {
							a: {
								var d = c.block.getElementsByTag("span"),
									f = 0,
									g;
								if (d) for (; g = d.getItem(f++);) if (!y(g)) {
									d = !0;
									break a
								}
								d = !1
							}
							d = !d
						}
						d && (a.moveToPosition(c.block, CKEDITOR.POSITION_BEFORE_START), c.block.remove())
					} else c.autoParagraph(this.editor, a), A(a.startContainer) && a.startContainer.appendBogus();
					a.startContainer.mergeSiblings();
					return e
				},
				setup: function() {
					var a = this.editor;
					this.attachListener(a, "beforeGetData", function() {
						var b = this.getData();
						this.is("textarea") || !1 !== a.config.ignoreEmptyParagraph && (b = b.replace(D, function(a, b) {
							return b
						}));
						a.setData(b, null, 1)
					}, this);
					this.attachListener(a, "getSnapshot", function(a) {
						a.data = this.getData(1)
					}, this);
					this.attachListener(a, "afterSetData", function() {
						this.setData(a.getData(1))
					}, this);
					this.attachListener(a, "loadSnapshot", function(a) {
						this.setData(a.data, 1)
					}, this);
					this.attachListener(a, "beforeFocus", function() {
						var b = a.getSelection();
						(b = b && b.getNative()) && "Control" == b.type || this.focus()
					}, this);
					this.attachListener(a, "insertHtml", function(a) {
						this.insertHtml(a.data.dataValue, a.data.mode, a.data.range)
					}, this);
					this.attachListener(a, "insertElement", function(a) {
						this.insertElement(a.data)
					}, this);
					this.attachListener(a, "insertText", function(a) {
						this.insertText(a.data)
					}, this);
					this.setReadOnly(a.readOnly);
					this.attachClass("cke_editable");
					a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? this.attachClass("cke_editable_inline") : a.elementMode != CKEDITOR.ELEMENT_MODE_REPLACE && a.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO || this.attachClass("cke_editable_themed");
					this.attachClass("cke_contents_" + a.config.contentsLangDirection);
					a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
					a.keystrokeHandler.attach(this);
					this.on("blur", function() {
						this.hasFocus = !1
					}, null, null, -1);
					this.on("focus", function() {
						this.hasFocus = !0
					}, null, null, -1);
					a.focusManager.add(this);
					this.equals(CKEDITOR.document.getActive()) && (this.hasFocus = !0, a.once("contentDom", function() {
						a.focusManager.focus(this)
					}, this));
					this.isInline() && this.changeAttr("tabindex", a.tabIndex);
					if (!this.is("textarea")) {
						a.document = this.getDocument();
						a.window = this.getWindow();
						var d = a.document;
						this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
						var e = a.config.contentsLangDirection;
						this.getDirection(1) != e && this.changeAttr("dir", e);
						var m = CKEDITOR.getCss();
						if (m) {
							var e = d.getHead(),
								l = e.getCustomData("stylesheet");
							l ? m != l.getText() && (CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? l.$.styleSheet.cssText = m : l.setText(m)) : (m = d.appendStyleText(m), m = new CKEDITOR.dom.element(m.ownerNode || m.owningElement), e.setCustomData("stylesheet", m), m.data("cke-temp", 1))
						}
						e = d.getCustomData("stylesheet_ref") || 0;
						d.setCustomData("stylesheet_ref", e + 1);
						this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
						this.attachListener(this, "click", function(a) {
							a = a.data;
							var b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
							b && 2 != a.$.button && b.isReadOnly() && a.preventDefault()
						});
						var k = {
							8: 1,
							46: 1
						};
						this.attachListener(a, "key", function(b) {
							if (a.readOnly) return !0;
							var c = b.data.domEvent.getKey(),
								d;
							if (c in k) {
								b = a.getSelection();
								var h, e = b.getRanges()[0],
									m = e.startPath(),
									n, l, z, c = 8 == c;
								CKEDITOR.env.ie && 11 > CKEDITOR.env.version && (h = b.getSelectedElement()) || (h = g(b)) ? (a.fire("saveSnapshot"), e.moveToPosition(h, CKEDITOR.POSITION_BEFORE_START), h.remove(), e.select(), a.fire("saveSnapshot"), d = 1) : e.collapsed && ((n = m.block) && (z = n[c ? "getPrevious" : "getNext"](f)) && z.type == CKEDITOR.NODE_ELEMENT && z.is("table") && e[c ? "checkStartOfBlock" : "checkEndOfBlock"]() ? (a.fire("saveSnapshot"), e[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && n.remove(), e["moveToElementEdit" + (c ? "End" : "Start")](z), e.select(), a.fire("saveSnapshot"), d = 1) : m.blockLimit && m.blockLimit.is("td") && (l = m.blockLimit.getAscendant("table")) && e.checkBoundaryOfElement(l, c ? CKEDITOR.START : CKEDITOR.END) && (z = l[c ? "getPrevious" : "getNext"](f)) ? (a.fire("saveSnapshot"), e["moveToElementEdit" + (c ? "End" : "Start")](z), e.checkStartOfBlock() && e.checkEndOfBlock() ? z.remove() : e.select(), a.fire("saveSnapshot"), d = 1) : (l = m.contains(["td", "th", "caption"])) && e.checkBoundaryOfElement(l, c ? CKEDITOR.START : CKEDITOR.END) && (d = 1))
							}
							return !d
						});
						a.blockless && CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller && this.attachListener(this, "keyup", function(b) {
							b.data.getKeystroke() in k && !this.getFirst(c) && (this.appendBogus(), b = a.createRange(), b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START), b.select())
						});
						this.attachListener(this, "dblclick", function(b) {
							if (a.readOnly) return !1;
							b = {
								element: b.data.getTarget()
							};
							a.fire("doubleclick", b)
						});
						CKEDITOR.env.ie && this.attachListener(this, "click", b);
						CKEDITOR.env.ie && !CKEDITOR.env.edge || this.attachListener(this, "mousedown", function(b) {
							var c = b.data.getTarget();
							c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly() && (a.getSelection().selectElement(c), c.is("input", "textarea", "select") && b.data.preventDefault())
						});
						CKEDITOR.env.edge && this.attachListener(this, "mouseup", function(b) {
							(b = b.data.getTarget()) && b.is("img") && a.getSelection().selectElement(b)
						});
						CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function(b) {
							if (2 == b.data.$.button && (b = b.data.getTarget(), !b.getOuterHtml().replace(D, ""))) {
								var c = a.createRange();
								c.moveToElementEditStart(b);
								c.select(!0)
							}
						});
						CKEDITOR.env.webkit && (this.attachListener(this, "click", function(a) {
							a.data.getTarget().is("input", "select") && a.data.preventDefault()
						}), this.attachListener(this, "mouseup", function(a) {
							a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
						}));
						CKEDITOR.env.webkit && this.attachListener(a, "key", function(b) {
							if (a.readOnly) return !0;
							b = b.data.domEvent.getKey();
							if (b in k) {
								var c = 8 == b,
									d = a.getSelection().getRanges()[0];
								b = d.startPath();
								if (d.collapsed) a: {
									var h = b.block;
									if (h && d[c ? "checkStartOfBlock" : "checkEndOfBlock"]() && d.moveToClosestEditablePosition(h, !c) && d.collapsed) {
										if (d.startContainer.type == CKEDITOR.NODE_ELEMENT) {
											var e = d.startContainer.getChild(d.startOffset - (c ? 1 : 0));
											if (e && e.type == CKEDITOR.NODE_ELEMENT && e.is("hr")) {
												a.fire("saveSnapshot");
												e.remove();
												b = !0;
												break a
											}
										}
										d = d.startPath().block;
										if (!d || d && d.contains(h)) b = void 0;
										else {
											a.fire("saveSnapshot");
											var f;
											(f = (c ? d : h).getBogus()) && f.remove();
											f = a.getSelection();
											e = f.createBookmarks();
											(c ? h : d).moveChildren(c ? d : h, !1);
											b.lastElement.mergeSiblings();
											w(h, d, !c);
											f.selectBookmarks(e);
											b = !0
										}
									} else b = !1
								} else c = d,
								f = b.block,
								d = c.endPath().block,
								f && d && !f.equals(d) ? (a.fire("saveSnapshot"), (h = f.getBogus()) && h.remove(), c.enlarge(CKEDITOR.ENLARGE_INLINE), c.deleteContents(), d.getParent() && (d.moveChildren(f, !1), b.lastElement.mergeSiblings(), w(f, d, !0)), c = a.getSelection().getRanges()[0], c.collapse(1), c.optimize(), "" === c.startContainer.getHtml() && c.startContainer.appendBogus(), c.select(), b = !0) : b = !1;
								if (!b) return;
								a.getSelection().scrollIntoView();
								a.fire("saveSnapshot");
								return !1
							}
						}, this, null, 100)
					}
				}
			},
			_: {
				detach: function() {
					this.editor.setData(this.editor.getData(), 0, 1);
					this.clearListeners();
					this.restoreAttrs();
					var a;
					if (a = this.removeCustomData("classes")) for (; a.length;) this.removeClass(a.pop());
					if (!this.is("textarea")) {
						a = this.getDocument();
						var b = a.getHead();
						if (b.getCustomData("stylesheet")) {
							var c = a.getCustomData("stylesheet_ref");
							--c ? a.setCustomData("stylesheet_ref", c) : (a.removeCustomData("stylesheet_ref"), b.removeCustomData("stylesheet").remove())
						}
					}
					this.editor.fire("contentDomUnload");
					delete this.editor
				}
			}
		});
		CKEDITOR.editor.prototype.editable = function(a) {
			var b = this._.editable;
			if (b && a) return 0;
			arguments.length && (b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null));
			return b
		};
		CKEDITOR.on("instanceLoaded", function(b) {
			var c = b.editor;
			c.on("insertElement", function(a) {
				a = a.data;
				a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea")) && ("false" != a.getAttribute("contentEditable") && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1"), a.setAttribute("contentEditable", !1))
			});
			c.on("selectionChange", function(b) {
				if (!c.readOnly) {
					var d = c.getSelection();
					d && !d.isLocked && (d = c.checkDirty(), c.fire("lockSnapshot"), a(b), c.fire("unlockSnapshot"), !d && c.resetDirty())
				}
			})
		});
		CKEDITOR.on("instanceCreated", function(a) {
			var b = a.editor;
			b.on("mode", function() {
				var a = b.editable();
				if (a && a.isInline()) {
					var c = b.title;
					a.changeAttr("role", "textbox");
					a.changeAttr("aria-label", c);
					c && a.changeAttr("title", c);
					var d = b.fire("ariaEditorHelpLabel", {}).label;
					if (d && (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents"))) {
						var e = CKEDITOR.tools.getNextId(),
							d = CKEDITOR.dom.element.createFromHtml('<span id="' + e + '" class="cke_voice_label">' + d + "</span>");
						c.append(d);
						a.changeAttr("aria-describedby", e)
					}
				}
			})
		});
		CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
		f = CKEDITOR.dom.walker.whitespaces(!0);
		y = CKEDITOR.dom.walker.bookmark(!1, !0);
		A = CKEDITOR.dom.walker.empty();
		t = CKEDITOR.dom.walker.bogus();
		D = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;| |&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
		p = function() {
			function a(b) {
				return b.type == CKEDITOR.NODE_ELEMENT
			}

			function b(c, d) {
				var e, f, m, n, g = [],
					l = d.range.startContainer;
				e = d.range.startPath();
				for (var l = C[l.getName()], z = 0, k = c.getChildren(), E = k.count(), B = -1, p = -1, q = 0, w = e.contains(C.$list); z < E; ++z) e = k.getItem(z), a(e) ? (m = e.getName(), w && m in CKEDITOR.dtd.$list ? g = g.concat(b(e, d)) : (n = !! l[m], "br" != m || !e.data("cke-eol") || z && z != E - 1 || (q = (f = z ? g[z - 1].node : k.getItem(z + 1)) && (!a(f) || !f.is("br")), f = f && a(f) && C.$block[f.getName()]), -1 != B || n || (B = z), n || (p = z), g.push({
					isElement: 1,
					isLineBreak: q,
					isBlock: e.isBlockBoundary(),
					hasBlockSibling: f,
					node: e,
					name: m,
					allowed: n
				}), f = q = 0)) : g.push({
					isElement: 0,
					node: e,
					allowed: 1
				}); - 1 < B && (g[B].firstNotAllowed = 1); - 1 < p && (g[p].lastNotAllowed = 1);
				return g
			}

			function d(b, c) {
				var e = [],
					h = b.getChildren(),
					f = h.count(),
					m, g = 0,
					l = C[c],
					z = !b.is(C.$inline) || b.is("br");
				for (z && e.push(" "); g < f; g++) m = h.getItem(g), a(m) && !m.is(l) ? e = e.concat(d(m, c)) : e.push(m);
				z && e.push(" ");
				return e
			}

			function e(b) {
				return a(b.startContainer) && b.startContainer.getChild(b.startOffset - 1)
			}

			function f(b) {
				return b && a(b) && (b.is(C.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
			}

			function g(b, c, d, e) {
				var h = b.clone(),
					f, m;
				h.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
				(f = (new CKEDITOR.dom.walker(h)).next()) && a(f) && p[f.getName()] && (m = f.getPrevious()) && a(m) && !m.getParent().equals(b.startContainer) && d.contains(m) && e.contains(f) && f.isIdentical(m) && (f.moveChildren(m), f.remove(), g(b, c, d, e))
			}

			function E(b, c) {
				function d(b, c) {
					if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) return b.remove(), 1
				}
				var e = c.endContainer.getChild(c.endOffset),
					h = c.endContainer.getChild(c.endOffset - 1);
				e && d(e, b[b.length - 1]);
				h && d(h, b[0]) && (c.setEnd(c.endContainer, c.endOffset - 1), c.collapse())
			}
			var C = CKEDITOR.dtd,
				p = {
					p: 1,
					div: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					ul: 1,
					ol: 1,
					li: 1,
					pre: 1,
					dl: 1,
					blockquote: 1
				},
				q = {
					p: 1,
					div: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1
				},
				w = CKEDITOR.tools.extend({}, C.$inline);
			delete w.br;
			return function(p, v, I, J) {
				var F = p.editor,
					L = !1;
				"unfiltered_html" == v && (v = "html", L = !0);
				if (!J.checkReadOnly()) {
					var K = (new CKEDITOR.dom.elementPath(J.startContainer, J.root)).blockLimit || J.root;
					p = {
						type: v,
						dontFilter: L,
						editable: p,
						editor: F,
						range: J,
						blockLimit: K,
						mergeCandidates: [],
						zombies: []
					};
					v = p.range;
					J = p.mergeCandidates;
					var H, t;
					"text" == p.type && v.shrink(CKEDITOR.SHRINK_ELEMENT, !0, !1) && (H = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", v.document), v.insertNode(H), v.setStartAfter(H));
					L = new CKEDITOR.dom.elementPath(v.startContainer);
					p.endPath = K = new CKEDITOR.dom.elementPath(v.endContainer);
					if (!v.collapsed) {
						var F = K.block || K.blockLimit,
							x = v.getCommonAncestor();
						F && !F.equals(x) && !F.contains(x) && v.checkEndOfBlock() && p.zombies.push(F);
						v.deleteContents()
					}
					for (;
					(t = e(v)) && a(t) && t.isBlockBoundary() && L.contains(t);) v.moveToPosition(t, CKEDITOR.POSITION_BEFORE_END);
					g(v, p.blockLimit, L, K);
					H && (v.setEndBefore(H), v.collapse(), H.remove());
					H = v.startPath();
					if (F = H.contains(f, !1, 1)) v.splitElement(F), p.inlineStylesRoot = F, p.inlineStylesPeak = H.lastElement;
					H = v.createBookmark();
					(F = H.startNode.getPrevious(c)) && a(F) && f(F) && J.push(F);
					(F = H.startNode.getNext(c)) && a(F) && f(F) && J.push(F);
					for (F = H.startNode;
					(F = F.getParent()) && f(F);) J.push(F);
					v.moveToBookmark(H);
					if (H = I) {
						H = p.range;
						if ("text" == p.type && p.inlineStylesRoot) {
							t = p.inlineStylesPeak;
							v = t.getDocument().createText("{cke-peak}");
							for (J = p.inlineStylesRoot.getParent(); !t.equals(J);) v = v.appendTo(t.clone()), t = t.getParent();
							I = v.getOuterHtml().split("{cke-peak}").join(I)
						}
						t = p.blockLimit.getName();
						if (/^\s+|\s+$/.test(I) && "span" in CKEDITOR.dtd[t]) {
							var A = '<span data-cke-marker="1">&nbsp;</span>';
							I = A + I + A
						}
						I = p.editor.dataProcessor.toHtml(I, {
							context: null,
							fixForBody: !1,
							protectedWhitespaces: !! A,
							dontFilter: p.dontFilter,
							filter: p.editor.activeFilter,
							enterMode: p.editor.activeEnterMode
						});
						t = H.document.createElement("body");
						t.setHtml(I);
						A && (t.getFirst().remove(), t.getLast().remove());
						if ((A = H.startPath().block) && (1 != A.getChildCount() || !A.getBogus())) a: {
							var y;
							if (1 == t.getChildCount() && a(y = t.getFirst()) && y.is(q) && !y.hasAttribute("contenteditable")) {
								A = y.getElementsByTag("*");
								H = 0;
								for (J = A.count(); H < J; H++) if (v = A.getItem(H), !v.is(w)) break a;
								y.moveChildren(y.getParent(1));
								y.remove()
							}
						}
						p.dataWrapper = t;
						H = I
					}
					if (H) {
						y = p.range;
						H = y.document;
						var u;
						t = p.blockLimit;
						J = 0;
						var D, A = [],
							M, G;
						I = F = 0;
						var P, W;
						v = y.startContainer;
						var L = p.endPath.elements[0],
							X, K = L.getPosition(v),
							x = !! L.getCommonAncestor(v) && K != CKEDITOR.POSITION_IDENTICAL && !(K & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
						v = b(p.dataWrapper, p);
						for (E(v, y); J < v.length; J++) {
							K = v[J];
							if (u = K.isLineBreak) {
								u = y;
								P = t;
								var S = void 0,
									aa = void 0;
								K.hasBlockSibling ? u = 1 : (S = u.startContainer.getAscendant(C.$block, 1)) && S.is({
									div: 1,
									p: 1
								}) ? (aa = S.getPosition(P), aa == CKEDITOR.POSITION_IDENTICAL || aa == CKEDITOR.POSITION_CONTAINS ? u = 0 : (P = u.splitElement(S), u.moveToPosition(P, CKEDITOR.POSITION_AFTER_START), u = 1)) : u = 0
							}
							if (u) I = 0 < J;
							else {
								u = y.startPath();
								!K.isBlock && l(p.editor, u.block, u.blockLimit) && (G = k(p.editor)) && (G = H.createElement(G), G.appendBogus(), y.insertNode(G), CKEDITOR.env.needsBrFiller && (D = G.getBogus()) && D.remove(), y.moveToPosition(G, CKEDITOR.POSITION_BEFORE_END));
								if ((u = y.startPath().block) && !u.equals(M)) {
									if (D = u.getBogus()) D.remove(), A.push(u);
									M = u
								}
								K.firstNotAllowed && (F = 1);
								if (F && K.isElement) {
									u = y.startContainer;
									for (P = null; u && !C[u.getName()][K.name];) {
										if (u.equals(t)) {
											u = null;
											break
										}
										P = u;
										u = u.getParent()
									}
									if (u) P && (W = y.splitElement(P), p.zombies.push(W), p.zombies.push(P));
									else {
										P = t.getName();
										X = !J;
										u = J == v.length - 1;
										P = d(K.node, P);
										for (var S = [], aa = P.length, ca = 0, ea = void 0, Y = 0, U = -1; ca < aa; ca++) ea = P[ca], " " == ea ? (Y || X && !ca || (S.push(new CKEDITOR.dom.text(" ")), U = S.length), Y = 1) : (S.push(ea), Y = 0);
										u && U == S.length && S.pop();
										X = S
									}
								}
								if (X) {
									for (; u = X.pop();) y.insertNode(u);
									X = 0
								} else y.insertNode(K.node);
								K.lastNotAllowed && J < v.length - 1 && ((W = x ? L : W) && y.setEndAt(W, CKEDITOR.POSITION_AFTER_START), F = 0);
								y.collapse()
							}
						}
						1 != v.length ? D = !1 : (D = v[0], D = D.isElement && "false" == D.node.getAttribute("contenteditable"));
						D && (I = !0, u = v[0].node, y.setStartAt(u, CKEDITOR.POSITION_BEFORE_START), y.setEndAt(u, CKEDITOR.POSITION_AFTER_END));
						p.dontMoveCaret = I;
						p.bogusNeededBlocks = A
					}
					D = p.range;
					var O;
					W = p.bogusNeededBlocks;
					for (X = D.createBookmark(); M = p.zombies.pop();) M.getParent() && (G = D.clone(), G.moveToElementEditStart(M), G.removeEmptyBlocksAtEnd());
					if (W) for (; M = W.pop();) CKEDITOR.env.needsBrFiller ? M.appendBogus() : M.append(D.document.createText(" "));
					for (; M = p.mergeCandidates.pop();) M.mergeSiblings();
					D.moveToBookmark(X);
					if (!p.dontMoveCaret) {
						for (M = e(D); M && a(M) && !M.is(C.$empty);) {
							if (M.isBlockBoundary()) D.moveToPosition(M, CKEDITOR.POSITION_BEFORE_END);
							else {
								if (f(M) && M.getHtml().match(/(\s|&nbsp;)$/g)) {
									O = null;
									break
								}
								O = D.clone();
								O.moveToPosition(M, CKEDITOR.POSITION_BEFORE_END)
							}
							M = M.getLast(c)
						}
						O && D.moveToRange(O)
					}
				}
			}
		}();
		x = function() {
			function a(b) {
				b = new CKEDITOR.dom.walker(b);
				b.guard = function(a, b) {
					if (b) return !1;
					if (a.type == CKEDITOR.NODE_ELEMENT) return a.is(CKEDITOR.dtd.$tableContent)
				};
				b.evaluator = function(a) {
					return a.type == CKEDITOR.NODE_ELEMENT
				};
				return b
			}

			function b(a, c, d) {
				c = a.getDocument().createElement(c);
				a.append(c, d);
				return c
			}

			function c(a) {
				var b = a.count(),
					d;
				for (b; 0 < b--;) d = a.getItem(b), CKEDITOR.tools.trim(d.getHtml()) || (d.appendBogus(), CKEDITOR.env.ie && 9 > CKEDITOR.env.version && d.getChildCount() && d.getFirst().remove())
			}
			return function(d) {
				var e = d.startContainer,
					f = e.getAscendant("table", 1),
					g = !1;
				c(f.getElementsByTag("td"));
				c(f.getElementsByTag("th"));
				f = d.clone();
				f.setStart(e, 0);
				f = a(f).lastBackward();
				f || (f = d.clone(), f.setEndAt(e, CKEDITOR.POSITION_BEFORE_END), f = a(f).lastForward(), g = !0);
				f || (f = e);
				f.is("table") ? (d.setStartAt(f, CKEDITOR.POSITION_BEFORE_START), d.collapse(!0), f.remove()) : (f.is({
					tbody: 1,
					thead: 1,
					tfoot: 1
				}) && (f = b(f, "tr", g)), f.is("tr") && (f = b(f, f.getParent().is("thead") ? "th" : "td", g)), (e = f.getBogus()) && e.remove(), d.moveToPosition(f, g ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END))
			}
		}();
		G = {
			eol: {
				detect: function(a, b) {
					var c = a.range,
						d = c.clone(),
						e = c.clone(),
						f = new CKEDITOR.dom.elementPath(c.startContainer, b),
						g = new CKEDITOR.dom.elementPath(c.endContainer, b);
					d.collapse(1);
					e.collapse();
					f.block && d.checkBoundaryOfElement(f.block, CKEDITOR.END) && (c.setStartAfter(f.block), a.prependEolBr = 1);
					g.block && e.checkBoundaryOfElement(g.block, CKEDITOR.START) && (c.setEndBefore(g.block), a.appendEolBr = 1)
				},
				fix: function(a, b) {
					var c = b.getDocument(),
						d;
					a.appendEolBr && (d = this.createEolBr(c), a.fragment.append(d));
					!a.prependEolBr || d && !d.getPrevious() || a.fragment.append(this.createEolBr(c), 1)
				},
				createEolBr: function(a) {
					return a.createElement("br", {
						attributes: {
							"data-cke-eol": 1
						}
					})
				}
			},
			bogus: {
				exclude: function(a) {
					var b = a.range.getBoundaryNodes(),
						c = b.startNode,
						b = b.endNode;
					!b || !t(b) || c && c.equals(b) || a.range.setEndBefore(b)
				}
			},
			tree: {
				rebuild: function(a, b) {
					var c = a.range,
						d = c.getCommonAncestor(),
						e = new CKEDITOR.dom.elementPath(d, b),
						f = new CKEDITOR.dom.elementPath(c.startContainer, b),
						c = new CKEDITOR.dom.elementPath(c.endContainer, b),
						g;
					d.type == CKEDITOR.NODE_TEXT && (d = d.getParent());
					if (e.blockLimit.is({
						tr: 1,
						table: 1
					})) {
						var l = e.contains("table").getParent();
						g = function(a) {
							return !a.equals(l)
						}
					} else if (e.block && e.block.is(CKEDITOR.dtd.$listItem) && (f = f.contains(CKEDITOR.dtd.$list), c = c.contains(CKEDITOR.dtd.$list), !f.equals(c))) {
						var k = e.contains(CKEDITOR.dtd.$list).getParent();
						g = function(a) {
							return !a.equals(k)
						}
					}
					g || (g = function(a) {
						return !a.equals(e.block) && !a.equals(e.blockLimit)
					});
					this.rebuildFragment(a, b, d, g)
				},
				rebuildFragment: function(a, b, c, d) {
					for (var e; c && !c.equals(b) && d(c);) e = c.clone(0, 1), a.fragment.appendTo(e), a.fragment = e, c = c.getParent()
				}
			},
			cell: {
				shrink: function(a) {
					a = a.range;
					var b = a.startContainer,
						c = a.endContainer,
						d = a.startOffset,
						e = a.endOffset;
					b.type == CKEDITOR.NODE_ELEMENT && b.equals(c) && b.is("tr") && ++d == e && a.shrink(CKEDITOR.SHRINK_TEXT)
				}
			}
		};
		u = function() {
			function a(b, c) {
				var d = b.getParent();
				if (d.is(CKEDITOR.dtd.$inline)) b[c ? "insertBefore" : "insertAfter"](d)
			}

			function b(c, d, e) {
				a(d);
				a(e, 1);
				for (var f; f = e.getNext();) f.insertAfter(d), d = f;
				A(c) && c.remove()
			}

			function c(a, b) {
				var d = new CKEDITOR.dom.range(a);
				d.setStartAfter(b.startNode);
				d.setEndBefore(b.endNode);
				return d
			}
			return {
				list: {
					detectMerge: function(a, b) {
						var d = c(b, a.bookmark),
							e = d.startPath(),
							f = d.endPath(),
							h = e.contains(CKEDITOR.dtd.$list),
							g = f.contains(CKEDITOR.dtd.$list);
						a.mergeList = h && g && h.getParent().equals(g.getParent()) && !h.equals(g);
						a.mergeListItems = e.block && f.block && e.block.is(CKEDITOR.dtd.$listItem) && f.block.is(CKEDITOR.dtd.$listItem);
						if (a.mergeList || a.mergeListItems) d = d.clone(), d.setStartBefore(a.bookmark.startNode), d.setEndAfter(a.bookmark.endNode), a.mergeListBookmark = d.createBookmark()
					},
					merge: function(a, c) {
						if (a.mergeListBookmark) {
							var d = a.mergeListBookmark.startNode,
								e = a.mergeListBookmark.endNode,
								f = new CKEDITOR.dom.elementPath(d, c),
								g = new CKEDITOR.dom.elementPath(e, c);
							if (a.mergeList) {
								var n = f.contains(CKEDITOR.dtd.$list),
									l = g.contains(CKEDITOR.dtd.$list);
								n.equals(l) || (l.moveChildren(n), l.remove())
							}
							a.mergeListItems && (f = f.contains(CKEDITOR.dtd.$listItem), g = g.contains(CKEDITOR.dtd.$listItem), f.equals(g) || b(g, d, e));
							d.remove();
							e.remove()
						}
					}
				},
				block: {
					detectMerge: function(a, b) {
						if (!a.tableContentsRanges && !a.mergeListBookmark) {
							var c = new CKEDITOR.dom.range(b);
							c.setStartBefore(a.bookmark.startNode);
							c.setEndAfter(a.bookmark.endNode);
							a.mergeBlockBookmark = c.createBookmark()
						}
					},
					merge: function(a, c) {
						if (a.mergeBlockBookmark && !a.purgeTableBookmark) {
							var d = a.mergeBlockBookmark.startNode,
								e = a.mergeBlockBookmark.endNode,
								f = new CKEDITOR.dom.elementPath(d, c),
								g = new CKEDITOR.dom.elementPath(e, c),
								f = f.block,
								g = g.block;
							f && g && !f.equals(g) && b(g, d, e);
							d.remove();
							e.remove()
						}
					}
				},
				table: function() {
					function a(c) {
						var e = [],
							f, h = new CKEDITOR.dom.walker(c),
							g = c.startPath().contains(d),
							m = c.endPath().contains(d),
							n = {};
						h.guard = function(a, h) {
							if (a.type == CKEDITOR.NODE_ELEMENT) {
								var l = "visited_" + (h ? "out" : "in");
								if (a.getCustomData(l)) return;
								CKEDITOR.dom.element.setMarker(n, a, l, 1)
							}
							if (h && g && a.equals(g)) f = c.clone(), f.setEndAt(g, CKEDITOR.POSITION_BEFORE_END), e.push(f);
							else if (!h && m && a.equals(m)) f = c.clone(), f.setStartAt(m, CKEDITOR.POSITION_AFTER_START), e.push(f);
							else {
								if (l = !h) l = a.type == CKEDITOR.NODE_ELEMENT && a.is(d) && (!g || b(a, g)) && (!m || b(a, m));
								l && (f = c.clone(), f.selectNodeContents(a), e.push(f))
							}
						};
						h.lastForward();
						CKEDITOR.dom.element.clearAllMarkers(n);
						return e
					}

					function b(a, c) {
						var d = CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED,
							e = a.getPosition(c);
						return e === CKEDITOR.POSITION_IDENTICAL ? !1 : 0 === (e & d)
					}
					var d = {
						td: 1,
						th: 1,
						caption: 1
					};
					return {
						detectPurge: function(a) {
							var b = a.range,
								c = b.clone();
							c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
							var c = new CKEDITOR.dom.walker(c),
								e = 0;
							c.evaluator = function(a) {
								a.type == CKEDITOR.NODE_ELEMENT && a.is(d) && ++e
							};
							c.checkForward();
							if (1 < e) {
								var c = b.startPath().contains("table"),
									f = b.endPath().contains("table");
								c && f && b.checkBoundaryOfElement(c, CKEDITOR.START) && b.checkBoundaryOfElement(f, CKEDITOR.END) && (b = a.range.clone(), b.setStartBefore(c), b.setEndAfter(f), a.purgeTableBookmark = b.createBookmark())
							}
						},
						detectRanges: function(e, f) {
							var h = c(f, e.bookmark),
								g = h.clone(),
								l, k, v = h.getCommonAncestor();
							v.is(CKEDITOR.dtd.$tableContent) && !v.is(d) && (v = v.getAscendant("table", !0));
							k = v;
							v = new CKEDITOR.dom.elementPath(h.startContainer, k);
							k = new CKEDITOR.dom.elementPath(h.endContainer, k);
							v = v.contains("table");
							k = k.contains("table");
							if (v || k) v && k && b(v, k) ? (e.tableSurroundingRange = g, g.setStartAt(v, CKEDITOR.POSITION_AFTER_END), g.setEndAt(k, CKEDITOR.POSITION_BEFORE_START), g = h.clone(), g.setEndAt(v, CKEDITOR.POSITION_AFTER_END), l = h.clone(), l.setStartAt(k, CKEDITOR.POSITION_BEFORE_START), l = a(g).concat(a(l))) : v ? k || (e.tableSurroundingRange = g, g.setStartAt(v, CKEDITOR.POSITION_AFTER_END), h.setEndAt(v, CKEDITOR.POSITION_AFTER_END)) : (e.tableSurroundingRange = g, g.setEndAt(k, CKEDITOR.POSITION_BEFORE_START), h.setStartAt(k, CKEDITOR.POSITION_AFTER_START)), e.tableContentsRanges = l ? l : a(h)
						},
						deleteRanges: function(a) {
							for (var b; b = a.tableContentsRanges.pop();) b.extractContents(), A(b.startContainer) && b.startContainer.appendBogus();
							a.tableSurroundingRange && a.tableSurroundingRange.extractContents()
						},
						purge: function(a) {
							if (a.purgeTableBookmark) {
								var b = a.doc,
									c = a.range.clone(),
									b = b.createElement("p");
								b.insertBefore(a.purgeTableBookmark.startNode);
								c.moveToBookmark(a.purgeTableBookmark);
								c.deleteContents();
								a.range.moveToPosition(b, CKEDITOR.POSITION_AFTER_START)
							}
						}
					}
				}(),
				detectExtractMerge: function(a) {
					return !(a.range.startPath().contains(CKEDITOR.dtd.$listItem) && a.range.endPath().contains(CKEDITOR.dtd.$listItem))
				},
				fixUneditableRangePosition: function(a) {
					a.startContainer.getDtd()["#"] || a.moveToClosestEditablePosition(null, !0)
				},
				autoParagraph: function(a, b) {
					var c = b.startPath(),
						d;
					l(a, c.block, c.blockLimit) && (d = k(a)) && (d = b.document.createElement(d), d.appendBogus(), b.insertNode(d), b.moveToPosition(d, CKEDITOR.POSITION_AFTER_START))
				}
			}
		}()
	})();
	(function() {
		function a() {
			var a = this._.fakeSelection,
				b;
			a && (b = this.getSelection(1), b && b.isHidden() || (a.reset(), a = 0));
			if (!a && (a = b || this.getSelection(1), !a || a.getType() == CKEDITOR.SELECTION_NONE)) return;
			this.fire("selectionCheck", a);
			b = this.elementPath();
			b.compare(this._.selectionPreviousPath) || (CKEDITOR.env.webkit && (this._.previousActive = this.document.getActive()), this._.selectionPreviousPath = b, this.fire("selectionChange", {
				selection: a,
				path: b
			}))
		}

		function d() {
			A = !0;
			y || (b.call(this), y = CKEDITOR.tools.setTimeout(b, 200, this))
		}

		function b() {
			y = null;
			A && (CKEDITOR.tools.setTimeout(a, 0, this), A = !1)
		}

		function c(a) {
			return t(a) || a.type == CKEDITOR.NODE_ELEMENT && !a.is(CKEDITOR.dtd.$empty) ? !0 : !1
		}

		function e(a) {
			function b(c, d) {
				return c && c.type != CKEDITOR.NODE_TEXT ? a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c) : !1
			}
			if (!(a.root instanceof CKEDITOR.editable)) return !1;
			var d = a.startContainer,
				e = a.getPreviousNode(c, null, d),
				f = a.getNextNode(c, null, d);
			return b(e) || b(f, 1) || !(e || f || d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary() && d.getBogus()) ? !0 : !1
		}

		function g(a) {
			l(a, !1);
			var b = a.getDocument().createText(u);
			a.setCustomData("cke-fillingChar", b);
			return b
		}

		function l(a, b) {
			var c = a && a.removeCustomData("cke-fillingChar");
			if (c) {
				if (!1 !== b) {
					var d = a.getDocument().getSelection().getNative(),
						e = d && "None" != d.type && d.getRangeAt(0),
						f = u.length;
					if (c.getLength() > f && e && e.intersectsNode(c.$)) {
						var g = [{
							node: d.anchorNode,
							offset: d.anchorOffset
						}, {
							node: d.focusNode,
							offset: d.focusOffset
						}];
						d.anchorNode == c.$ && d.anchorOffset > f && (g[0].offset -= f);
						d.focusNode == c.$ && d.focusOffset > f && (g[1].offset -= f)
					}
				}
				c.setText(k(c.getText(), 1));
				g && (c = a.getDocument().$, d = c.getSelection(), c = c.createRange(), c.setStart(g[0].node, g[0].offset), c.collapse(!0), d.removeAllRanges(), d.addRange(c), d.extend(g[1].node, g[1].offset))
			}
		}

		function k(a, b) {
			return b ? a.replace(r, function(a, b) {
				return b ? " " : ""
			}) : a.replace(u, "")
		}

		function q(a) {
			var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a.document);
			a.fire("lockSnapshot");
			a.editable().append(b);
			var c = a.getSelection(1),
				d = a.createRange(),
				e = c.root.on("selectionchange", function(a) {
					a.cancel()
				}, null, null, 0);
			d.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
			d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
			c.selectRanges([d]);
			e.removeListener();
			a.fire("unlockSnapshot");
			a._.hiddenSelectionContainer = b
		}

		function w(a) {
			var b = {
				37: 1,
				39: 1,
				8: 1,
				46: 1
			};
			return function(c) {
				var d = c.data.getKeystroke();
				if (b[d]) {
					var e = a.getSelection().getRanges(),
						f = e[0];
					1 == e.length && f.collapsed && (d = f[38 > d ? "getPreviousEditableNode" : "getNextEditableNode"]()) && d.type == CKEDITOR.NODE_ELEMENT && "false" == d.getAttribute("contenteditable") && (a.getSelection().fake(d), c.data.preventDefault(), c.cancel())
				}
			}
		}

		function f(a) {
			for (var b = 0; b < a.length; b++) {
				var c = a[b];
				c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
				if (!c.collapsed) {
					if (c.startContainer.isReadOnly()) for (var d = c.startContainer, e; d && !((e = d.type == CKEDITOR.NODE_ELEMENT) && d.is("body") || !d.isReadOnly());) e && "false" == d.getAttribute("contentEditable") && c.setStartAfter(d), d = d.getParent();
					d = c.startContainer;
					e = c.endContainer;
					var f = c.startOffset,
						g = c.endOffset,
						l = c.clone();
					d && d.type == CKEDITOR.NODE_TEXT && (f >= d.getLength() ? l.setStartAfter(d) : l.setStartBefore(d));
					e && e.type == CKEDITOR.NODE_TEXT && (g ? l.setEndAfter(e) : l.setEndBefore(e));
					d = new CKEDITOR.dom.walker(l);
					d.evaluator = function(d) {
						if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
							var e = c.clone();
							c.setEndBefore(d);
							c.collapsed && a.splice(b--, 1);
							d.getPosition(l.endContainer) & CKEDITOR.POSITION_CONTAINS || (e.setStartAfter(d), e.collapsed || a.splice(b + 1, 0, e));
							return !0
						}
						return !1
					};
					d.next()
				}
			}
			return a
		}
		var y, A, t = CKEDITOR.dom.walker.invisible(1),
			D = function() {
				function a(b) {
					return function(a) {
						var c = a.editor.createRange();
						c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
						return !1
					}
				}

				function b(a) {
					return function(b) {
						var c = b.editor,
							d = c.createRange(),
							e;
						(e = d.moveToClosestEditablePosition(b.selected, a)) || (e = d.moveToClosestEditablePosition(b.selected, !a));
						e && c.getSelection().selectRanges([d]);
						c.fire("saveSnapshot");
						b.selected.remove();
						e || (d.moveToElementEditablePosition(c.editable()), c.getSelection().selectRanges([d]));
						c.fire("saveSnapshot");
						return !1
					}
				}
				var c = a(),
					d = a(1);
				return {
					37: c,
					38: c,
					39: d,
					40: d,
					8: b(),
					46: b(1)
				}
			}();
		CKEDITOR.on("instanceCreated", function(b) {
			function c() {
				var a = e.getSelection();
				a && a.removeAllRanges()
			}
			var e = b.editor;
			e.on("contentDom", function() {
				function b() {
					I = new CKEDITOR.dom.selection(e.getSelection());
					I.lock()
				}

				function c() {
					h.removeListener("mouseup", c);
					k.removeListener("mouseup", c);
					var a = CKEDITOR.document.$.selection,
						b = a.createRange();
					"None" != a.type && b.parentElement().ownerDocument == f.$ && b.select()
				}
				var f = e.document,
					h = CKEDITOR.document,
					g = e.editable(),
					n = f.getBody(),
					k = f.getDocumentElement(),
					q = g.isInline(),
					v, I;
				CKEDITOR.env.gecko && g.attachListener(g, "focus", function(a) {
					a.removeListener();
					0 !== v && (a = e.getSelection().getNative()) && a.isCollapsed && a.anchorNode == g.$ && (a = e.createRange(), a.moveToElementEditStart(g), a.select())
				}, null, null, -2);
				g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
					v && CKEDITOR.env.webkit && (v = e._.previousActive && e._.previousActive.equals(f.getActive()));
					e.unlockSelection(v);
					v = 0
				}, null, null, -1);
				g.attachListener(g, "mousedown", function() {
					v = 0
				});
				if (CKEDITOR.env.ie || q) p ? g.attachListener(g, "beforedeactivate", b, null, null, -1) : g.attachListener(e, "selectionCheck", b, null, null, -1), g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
					e.lockSelection(I);
					v = 1
				}, null, null, -1), g.attachListener(g, "mousedown", function() {
					v = 0
				});
				if (CKEDITOR.env.ie && !q) {
					var J;
					g.attachListener(g, "mousedown", function(a) {
						2 == a.data.$.button && ((a = e.document.getSelection()) && a.getType() != CKEDITOR.SELECTION_NONE || (J = e.window.getScrollPosition()))
					});
					g.attachListener(g, "mouseup", function(a) {
						2 == a.data.$.button && J && (e.document.$.documentElement.scrollLeft = J.x, e.document.$.documentElement.scrollTop = J.y);
						J = null
					});
					if ("BackCompat" != f.$.compatMode) {
						if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) k.on("mousedown", function(a) {
							function b(a) {
								a = a.data.$;
								if (d) {
									var c = n.$.createTextRange();
									try {
										c.moveToPoint(a.clientX, a.clientY)
									} catch (e) {}
									d.setEndPoint(0 > f.compareEndPoints("StartToStart", c) ? "EndToEnd" : "StartToStart", c);
									d.select()
								}
							}

							function c() {
								k.removeListener("mousemove", b);
								h.removeListener("mouseup", c);
								k.removeListener("mouseup", c);
								d.select()
							}
							a = a.data;
							if (a.getTarget().is("html") && a.$.y < k.$.clientHeight && a.$.x < k.$.clientWidth) {
								var d = n.$.createTextRange();
								try {
									d.moveToPoint(a.$.clientX, a.$.clientY)
								} catch (e) {}
								var f = d.duplicate();
								k.on("mousemove", b);
								h.on("mouseup", c);
								k.on("mouseup", c)
							}
						});
						if (7 < CKEDITOR.env.version && 11 > CKEDITOR.env.version) k.on("mousedown", function(a) {
							a.data.getTarget().is("html") && (h.on("mouseup", c), k.on("mouseup", c))
						})
					}
				}
				g.attachListener(g, "selectionchange", a, e);
				g.attachListener(g, "keyup", d, e);
				g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
					e.forceNextSelectionCheck();
					e.selectionChange(1)
				});
				if (q && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
					var F;
					g.attachListener(g, "mousedown", function() {
						F = 1
					});
					g.attachListener(f.getDocumentElement(), "mouseup", function() {
						F && d.call(e);
						F = 0
					})
				} else g.attachListener(CKEDITOR.env.ie ? g : f.getDocumentElement(), "mouseup", d, e);
				CKEDITOR.env.webkit && g.attachListener(f, "keydown", function(a) {
					switch (a.data.getKey()) {
					case 13:
					case 33:
					case 34:
					case 35:
					case 36:
					case 37:
					case 39:
					case 8:
					case 45:
					case 46:
						l(g)
					}
				}, null, null, -1);
				g.attachListener(g, "keydown", w(e), null, null, -1)
			});
			e.on("setData", function() {
				e.unlockSelection();
				CKEDITOR.env.webkit && c()
			});
			e.on("contentDomUnload", function() {
				e.unlockSelection()
			});
			if (CKEDITOR.env.ie9Compat) e.on("beforeDestroy", c, null, null, 9);
			e.on("dataReady", function() {
				delete e._.fakeSelection;
				delete e._.hiddenSelectionContainer;
				e.selectionChange(1)
			});
			e.on("loadSnapshot", function() {
				var a = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT),
					b = e.editable().getLast(a);
				b && b.hasAttribute("data-cke-hidden-sel") && (b.remove(), CKEDITOR.env.gecko && (a = e.editable().getFirst(a)) && a.is("br") && a.getAttribute("_moz_editor_bogus_node") && a.remove())
			}, null, null, 100);
			e.on("key", function(a) {
				if ("wysiwyg" == e.mode) {
					var b = e.getSelection();
					if (b.isFake) {
						var c = D[a.data.keyCode];
						if (c) return c({
							editor: e,
							selected: b.getSelectedElement(),
							selection: b,
							keyEvent: a
						})
					}
				}
			})
		});
		if (CKEDITOR.env.webkit) CKEDITOR.on("instanceReady", function(a) {
			var b = a.editor;
			b.on("selectionChange", function() {
				var a = b.editable(),
					c = a.getCustomData("cke-fillingChar");
				c && (c.getCustomData("ready") ? l(a) : c.setCustomData("ready", 1))
			}, null, null, -1);
			b.on("beforeSetMode", function() {
				l(b.editable())
			}, null, null, -1);
			b.on("getSnapshot", function(a) {
				a.data && (a.data = k(a.data))
			}, b, null, 20);
			b.on("toDataFormat", function(a) {
				a.data.dataValue = k(a.data.dataValue)
			}, null, null, 0)
		});
		CKEDITOR.editor.prototype.selectionChange = function(b) {
			(b ? a : d).call(this)
		};
		CKEDITOR.editor.prototype.getSelection = function(a) {
			return !this._.savedSelection && !this._.fakeSelection || a ? (a = this.editable()) && "wysiwyg" == this.mode ? new CKEDITOR.dom.selection(a) : null : this._.savedSelection || this._.fakeSelection
		};
		CKEDITOR.editor.prototype.lockSelection = function(a) {
			a = a || this.getSelection(1);
			return a.getType() != CKEDITOR.SELECTION_NONE ? (!a.isLocked && a.lock(), this._.savedSelection = a, !0) : !1
		};
		CKEDITOR.editor.prototype.unlockSelection = function(a) {
			var b = this._.savedSelection;
			return b ? (b.unlock(a), delete this._.savedSelection, !0) : !1
		};
		CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
			delete this._.selectionPreviousPath
		};
		CKEDITOR.dom.document.prototype.getSelection = function() {
			return new CKEDITOR.dom.selection(this)
		};
		CKEDITOR.dom.range.prototype.select = function() {
			var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
			a.selectRanges([this]);
			return a
		};
		CKEDITOR.SELECTION_NONE = 1;
		CKEDITOR.SELECTION_TEXT = 2;
		CKEDITOR.SELECTION_ELEMENT = 3;
		var p = "function" != typeof window.getSelection,
			x = 1;
		CKEDITOR.dom.selection = function(a) {
			if (a instanceof CKEDITOR.dom.selection) {
				var b = a;
				a = a.root
			}
			var c = a instanceof CKEDITOR.dom.element;
			this.rev = b ? b.rev : x++;
			this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
			this.root = c ? a : this.document.getBody();
			this.isLocked = 0;
			this._ = {
				cache: {}
			};
			if (b) return CKEDITOR.tools.extend(this._.cache, b._.cache), this.isFake = b.isFake, this.isLocked = b.isLocked, this;
			a = this.getNative();
			var d, e;
			if (a) if (a.getRangeAt) d = (e = a.rangeCount && a.getRangeAt(0)) && new CKEDITOR.dom.node(e.commonAncestorContainer);
			else {
				try {
					e = a.createRange()
				} catch (f) {}
				d = e && CKEDITOR.dom.element.get(e.item && e.item(0) || e.parentElement())
			}
			if (!d || d.type != CKEDITOR.NODE_ELEMENT && d.type != CKEDITOR.NODE_TEXT || !this.root.equals(d) && !this.root.contains(d)) this._.cache.type = CKEDITOR.SELECTION_NONE, this._.cache.startElement = null, this._.cache.selectedElement = null, this._.cache.selectedText = "", this._.cache.ranges = new CKEDITOR.dom.rangeList;
			return this
		};
		var G = {
			img: 1,
			hr: 1,
			li: 1,
			table: 1,
			tr: 1,
			td: 1,
			th: 1,
			embed: 1,
			object: 1,
			ol: 1,
			ul: 1,
			a: 1,
			input: 1,
			form: 1,
			select: 1,
			textarea: 1,
			button: 1,
			fieldset: 1,
			thead: 1,
			tfoot: 1
		},
			u = CKEDITOR.tools.repeat("​", 7),
			r = new RegExp(u + "( )?", "g");
		CKEDITOR.tools.extend(CKEDITOR.dom.selection, {
			_removeFillingCharSequenceString: k,
			_createFillingCharSequenceNode: g,
			FILLING_CHAR_SEQUENCE: u
		});
		CKEDITOR.dom.selection.prototype = {
			getNative: function() {
				return void 0 !== this._.cache.nativeSel ? this._.cache.nativeSel : this._.cache.nativeSel = p ? this.document.$.selection : this.document.getWindow().$.getSelection()
			},
			getType: p ?
			function() {
				var a = this._.cache;
				if (a.type) return a.type;
				var b = CKEDITOR.SELECTION_NONE;
				try {
					var c = this.getNative(),
						d = c.type;
					"Text" == d && (b = CKEDITOR.SELECTION_TEXT);
					"Control" == d && (b = CKEDITOR.SELECTION_ELEMENT);
					c.createRange().parentElement() && (b = CKEDITOR.SELECTION_TEXT)
				} catch (e) {}
				return a.type = b
			} : function() {
				var a = this._.cache;
				if (a.type) return a.type;
				var b = CKEDITOR.SELECTION_TEXT,
					c = this.getNative();
				if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE;
				else if (1 == c.rangeCount) {
					var c = c.getRangeAt(0),
						d = c.startContainer;
					d == c.endContainer && 1 == d.nodeType && 1 == c.endOffset - c.startOffset && G[d.childNodes[c.startOffset].nodeName.toLowerCase()] && (b = CKEDITOR.SELECTION_ELEMENT)
				}
				return a.type = b
			},
			getRanges: function() {
				var a = p ?
				function() {
					function a(b) {
						return (new CKEDITOR.dom.node(b)).getIndex()
					}
					var b = function(b, c) {
							b = b.duplicate();
							b.collapse(c);
							var d = b.parentElement();
							if (!d.hasChildNodes()) return {
								container: d,
								offset: 0
							};
							for (var e = d.children, f, h, g = b.duplicate(), l = 0, v = e.length - 1, k = -1, m, p; l <= v;) if (k = Math.floor((l + v) / 2), f = e[k], g.moveToElementText(f), m = g.compareEndPoints("StartToStart", b), 0 < m) v = k - 1;
							else if (0 > m) l = k + 1;
							else return {
								container: d,
								offset: a(f)
							};
							if (-1 == k || k == e.length - 1 && 0 > m) {
								g.moveToElementText(d);
								g.setEndPoint("StartToStart", b);
								g = g.text.replace(/(\r\n|\r)/g, "\n").length;
								e = d.childNodes;
								if (!g) return f = e[e.length - 1], f.nodeType != CKEDITOR.NODE_TEXT ? {
									container: d,
									offset: e.length
								} : {
									container: f,
									offset: f.nodeValue.length
								};
								for (d = e.length; 0 < g && 0 < d;) h = e[--d], h.nodeType == CKEDITOR.NODE_TEXT && (p = h, g -= h.nodeValue.length);
								return {
									container: p,
									offset: -g
								}
							}
							g.collapse(0 < m ? !0 : !1);
							g.setEndPoint(0 < m ? "StartToStart" : "EndToStart", b);
							g = g.text.replace(/(\r\n|\r)/g, "\n").length;
							if (!g) return {
								container: d,
								offset: a(f) + (0 < m ? 0 : 1)
							};
							for (; 0 < g;) try {
								h = f[0 < m ? "previousSibling" : "nextSibling"], h.nodeType == CKEDITOR.NODE_TEXT && (g -= h.nodeValue.length, p = h), f = h
							} catch (q) {
								return {
									container: d,
									offset: a(f)
								}
							}
							return {
								container: p,
								offset: 0 < m ? -g : p.nodeValue.length + g
							}
						};
					return function() {
						var a = this.getNative(),
							c = a && a.createRange(),
							d = this.getType();
						if (!a) return [];
						if (d == CKEDITOR.SELECTION_TEXT) return a = new CKEDITOR.dom.range(this.root), d = b(c, !0), a.setStart(new CKEDITOR.dom.node(d.container), d.offset), d = b(c), a.setEnd(new CKEDITOR.dom.node(d.container), d.offset), a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse(), [a];
						if (d == CKEDITOR.SELECTION_ELEMENT) {
							for (var d = [], e = 0; e < c.length; e++) {
								for (var f = c.item(e), h = f.parentNode, g = 0, a = new CKEDITOR.dom.range(this.root); g < h.childNodes.length && h.childNodes[g] != f; g++);
								a.setStart(new CKEDITOR.dom.node(h), g);
								a.setEnd(new CKEDITOR.dom.node(h), g + 1);
								d.push(a)
							}
							return d
						}
						return []
					}
				}() : function() {
					var a = [],
						b, c = this.getNative();
					if (!c) return a;
					for (var d = 0; d < c.rangeCount; d++) {
						var e = c.getRangeAt(d);
						b = new CKEDITOR.dom.range(this.root);
						b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
						b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
						a.push(b)
					}
					return a
				};
				return function(b) {
					var c = this._.cache,
						d = c.ranges;
					d || (c.ranges = d = new CKEDITOR.dom.rangeList(a.call(this)));
					return b ? f(new CKEDITOR.dom.rangeList(d.slice())) : d
				}
			}(),
			getStartElement: function() {
				var a = this._.cache;
				if (void 0 !== a.startElement) return a.startElement;
				var b;
				switch (this.getType()) {
				case CKEDITOR.SELECTION_ELEMENT:
					return this.getSelectedElement();
				case CKEDITOR.SELECTION_TEXT:
					var c = this.getRanges()[0];
					if (c) {
						if (c.collapsed) b = c.startContainer, b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
						else {
							for (c.optimize(); b = c.startContainer, c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary();) c.setStartAfter(b);
							b = c.startContainer;
							if (b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
							if ((b = b.getChild(c.startOffset)) && b.type == CKEDITOR.NODE_ELEMENT) for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) b = c, c = c.getFirst();
							else b = c.startContainer
						}
						b = b.$
					}
				}
				return a.startElement = b ? new CKEDITOR.dom.element(b) : null
			},
			getSelectedElement: function() {
				var a = this._.cache;
				if (void 0 !== a.selectedElement) return a.selectedElement;
				var b = this,
					c = CKEDITOR.tools.tryThese(function() {
						return b.getNative().createRange().item(0)
					}, function() {
						for (var a = b.getRanges()[0].clone(), c, d, e = 2; e && !((c = a.getEnclosedNode()) && c.type == CKEDITOR.NODE_ELEMENT && G[c.getName()] && (d = c)); e--) a.shrink(CKEDITOR.SHRINK_ELEMENT);
						return d && d.$
					});
				return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
			},
			getSelectedText: function() {
				var a = this._.cache;
				if (void 0 !== a.selectedText) return a.selectedText;
				var b = this.getNative(),
					b = p ? "Control" == b.type ? "" : b.createRange().text : b.toString();
				return a.selectedText = b
			},
			lock: function() {
				this.getRanges();
				this.getStartElement();
				this.getSelectedElement();
				this.getSelectedText();
				this._.cache.nativeSel = null;
				this.isLocked = 1
			},
			unlock: function(a) {
				if (this.isLocked) {
					if (a) var b = this.getSelectedElement(),
						c = !b && this.getRanges(),
						d = this.isFake;
					this.isLocked = 0;
					this.reset();
					a && (a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
				}
			},
			reset: function() {
				this._.cache = {};
				this.isFake = 0;
				var a = this.root.editor;
				if (a && a._.fakeSelection) if (this.rev == a._.fakeSelection.rev) {
					delete a._.fakeSelection;
					var b = a._.hiddenSelectionContainer;
					if (b) {
						var c = a.checkDirty();
						a.fire("lockSnapshot");
						b.remove();
						a.fire("unlockSnapshot");
						!c && a.resetDirty()
					}
					delete a._.hiddenSelectionContainer
				} else CKEDITOR.warn("selection-fake-reset");
				this.rev = x++
			},
			selectElement: function(a) {
				var b = new CKEDITOR.dom.range(this.root);
				b.setStartBefore(a);
				b.setEndAfter(a);
				this.selectRanges([b])
			},
			selectRanges: function(a) {
				var b = this.root.editor,
					b = b && b._.hiddenSelectionContainer;
				this.reset();
				if (b) for (var b = this.root, c, d = 0; d < a.length; ++d) c = a[d], c.endContainer.equals(b) && (c.endOffset = Math.min(c.endOffset, b.getChildCount()));
				if (a.length) if (this.isLocked) {
					var f = CKEDITOR.document.getActive();
					this.unlock();
					this.selectRanges(a);
					this.lock();
					f && !f.equals(this.root) && f.focus()
				} else {
					var k;
					a: {
						var q, w;
						if (1 == a.length && !(w = a[0]).collapsed && (k = w.getEnclosedNode()) && k.type == CKEDITOR.NODE_ELEMENT && (w = w.clone(), w.shrink(CKEDITOR.SHRINK_ELEMENT, !0), (q = w.getEnclosedNode()) && q.type == CKEDITOR.NODE_ELEMENT && (k = q), "false" == k.getAttribute("contenteditable"))) break a;
						k = void 0
					}
					if (k) this.fake(k);
					else {
						if (p) {
							w = CKEDITOR.dom.walker.whitespaces(!0);
							q = /﻿| /;
							b = {
								table: 1,
								tbody: 1,
								tr: 1
							};
							1 < a.length && (k = a[a.length - 1], a[0].setEnd(k.endContainer, k.endOffset));
							k = a[0];
							a = k.collapsed;
							var t, u, r;
							if ((c = k.getEnclosedNode()) && c.type == CKEDITOR.NODE_ELEMENT && c.getName() in G && (!c.is("a") || !c.getText())) try {
								r = c.$.createControlRange();
								r.addElement(c.$);
								r.select();
								return
							} catch (v) {}
							if (k.startContainer.type == CKEDITOR.NODE_ELEMENT && k.startContainer.getName() in b || k.endContainer.type == CKEDITOR.NODE_ELEMENT && k.endContainer.getName() in b) k.shrink(CKEDITOR.NODE_ELEMENT, !0), a = k.collapsed;
							r = k.createBookmark();
							b = r.startNode;
							a || (f = r.endNode);
							r = k.document.$.body.createTextRange();
							r.moveToElementText(b.$);
							r.moveStart("character", 1);
							f ? (q = k.document.$.body.createTextRange(), q.moveToElementText(f.$), r.setEndPoint("EndToEnd", q), r.moveEnd("character", -1)) : (t = b.getNext(w), u = b.hasAscendant("pre"), t = !(t && t.getText && t.getText().match(q)) && (u || !b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br")), u = k.document.createElement("span"), u.setHtml("&#65279;"), u.insertBefore(b), t && k.document.createText("﻿").insertBefore(b));
							k.setStartBefore(b);
							b.remove();
							a ? (t ? (r.moveStart("character", -1), r.select(), k.document.$.selection.clear()) : r.select(), k.moveToPosition(u, CKEDITOR.POSITION_BEFORE_START), u.remove()) : (k.setEndBefore(f), f.remove(), r.select())
						} else {
							f = this.getNative();
							if (!f) return;
							this.removeAllRanges();
							for (r = 0; r < a.length; r++) {
								if (r < a.length - 1 && (t = a[r], u = a[r + 1], q = t.clone(), q.setStart(t.endContainer, t.endOffset), q.setEnd(u.startContainer, u.startOffset), !q.collapsed && (q.shrink(CKEDITOR.NODE_ELEMENT, !0), k = q.getCommonAncestor(), q = q.getEnclosedNode(), k.isReadOnly() || q && q.isReadOnly()))) {
									u.setStart(t.startContainer, t.startOffset);
									a.splice(r--, 1);
									continue
								}
								k = a[r];
								u = this.document.$.createRange();
								k.collapsed && CKEDITOR.env.webkit && e(k) && (q = g(this.root), k.insertNode(q), (t = q.getNext()) && !q.getPrevious() && t.type == CKEDITOR.NODE_ELEMENT && "br" == t.getName() ? (l(this.root), k.moveToPosition(t, CKEDITOR.POSITION_BEFORE_START)) : k.moveToPosition(q, CKEDITOR.POSITION_AFTER_END));
								u.setStart(k.startContainer.$, k.startOffset);
								try {
									u.setEnd(k.endContainer.$, k.endOffset)
								} catch (I) {
									if (0 <= I.toString().indexOf("NS_ERROR_ILLEGAL_VALUE")) k.collapse(1), u.setEnd(k.endContainer.$, k.endOffset);
									else throw I;
								}
								f.addRange(u)
							}
						}
						this.reset();
						this.root.fire("selectionchange")
					}
				}
			},
			fake: function(a) {
				var b = this.root.editor;
				this.reset();
				q(b);
				var c = this._.cache,
					d = new CKEDITOR.dom.range(this.root);
				d.setStartBefore(a);
				d.setEndAfter(a);
				c.ranges = new CKEDITOR.dom.rangeList(d);
				c.selectedElement = c.startElement = a;
				c.type = CKEDITOR.SELECTION_ELEMENT;
				c.selectedText = c.nativeSel = null;
				this.isFake = 1;
				this.rev = x++;
				b._.fakeSelection = this;
				this.root.fire("selectionchange")
			},
			isHidden: function() {
				var a = this.getCommonAncestor();
				a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent());
				return !(!a || !a.data("cke-hidden-sel"))
			},
			createBookmarks: function(a) {
				a = this.getRanges().createBookmarks(a);
				this.isFake && (a.isFake = 1);
				return a
			},
			createBookmarks2: function(a) {
				a = this.getRanges().createBookmarks2(a);
				this.isFake && (a.isFake = 1);
				return a
			},
			selectBookmarks: function(a) {
				for (var b = [], c, d = 0; d < a.length; d++) {
					var e = new CKEDITOR.dom.range(this.root);
					e.moveToBookmark(a[d]);
					b.push(e)
				}
				a.isFake && (c = b[0].getEnclosedNode(), c && c.type == CKEDITOR.NODE_ELEMENT || (CKEDITOR.warn("selection-not-fake"), a.isFake = 0));
				a.isFake ? this.fake(c) : this.selectRanges(b);
				return this
			},
			getCommonAncestor: function() {
				var a = this.getRanges();
				return a.length ? a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer) : null
			},
			scrollIntoView: function() {
				this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
			},
			removeAllRanges: function() {
				if (this.getType() != CKEDITOR.SELECTION_NONE) {
					var a = this.getNative();
					try {
						a && a[p ? "empty" : "removeAllRanges"]()
					} catch (b) {}
					this.reset()
				}
			}
		}
	})();
	"use strict";
	CKEDITOR.STYLE_BLOCK = 1;
	CKEDITOR.STYLE_INLINE = 2;
	CKEDITOR.STYLE_OBJECT = 3;
	(function() {
		function a(a, b) {
			for (var c, d;
			(a = a.getParent()) && !a.equals(b);) if (a.getAttribute("data-nostyle")) c = a;
			else if (!d) {
				var e = a.getAttribute("contentEditable");
				"false" == e ? c = a : "true" == e && (d = 1)
			}
			return c
		}

		function d(a, b, c, d) {
			return (a.getPosition(b) | d) == d && (!c.childRule || c.childRule(a))
		}

		function b(c) {
			var f = c.document;
			if (c.collapsed) f = G(this, f), c.insertNode(f), c.moveToPosition(f, CKEDITOR.POSITION_BEFORE_END);
			else {
				var g = this.element,
					h = this._.definition,
					l, k = h.ignoreReadonly,
					m = k || h.includeReadonly;
				null == m && (m = c.root.getCustomData("cke_includeReadonly"));
				var n = CKEDITOR.dtd[g];
				n || (l = !0, n = CKEDITOR.dtd.span);
				c.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				c.trim();
				var p = c.createBookmark(),
					q = p.startNode,
					w = p.endNode,
					t = q,
					r;
				if (!k) {
					var u = c.getCommonAncestor(),
						k = a(q, u),
						u = a(w, u);
					k && (t = k.getNextSourceNode(!0));
					u && (w = u)
				}
				for (t.getPosition(w) == CKEDITOR.POSITION_FOLLOWING && (t = 0); t;) {
					k = !1;
					if (t.equals(w)) t = null, k = !0;
					else {
						var y = t.type == CKEDITOR.NODE_ELEMENT ? t.getName() : null,
							u = y && "false" == t.getAttribute("contentEditable"),
							x = y && t.getAttribute("data-nostyle");
						if (y && t.data("cke-bookmark")) {
							t = t.getNextSourceNode(!0);
							continue
						}
						if (u && m && CKEDITOR.dtd.$block[y]) for (var A = t, z = e(A), B = void 0, C = z.length, E = 0, A = C && new CKEDITOR.dom.range(A.getDocument()); E < C; ++E) {
							var B = z[E],
								R = CKEDITOR.filter.instances[B.data("cke-filter")];
							if (R ? R.check(this) : 1) A.selectNodeContents(B), b.call(this, A)
						}
						z = y ? !n[y] || x ? 0 : u && !m ? 0 : d(t, w, h, T) : 1;
						if (z) if (B = t.getParent(), z = h, C = g, E = l, !B || !(B.getDtd() || CKEDITOR.dtd.span)[C] && !E || z.parentRule && !z.parentRule(B)) k = !0;
						else {
							if (r || y && CKEDITOR.dtd.$removeEmpty[y] && (t.getPosition(w) | T) != T || (r = c.clone(), r.setStartBefore(t)), y = t.type, y == CKEDITOR.NODE_TEXT || u || y == CKEDITOR.NODE_ELEMENT && !t.getChildCount()) {
								for (var y = t, Y;
								(k = !y.getNext(H)) && (Y = y.getParent(), n[Y.getName()]) && d(Y, q, h, Q);) y = Y;
								r.setEndAfter(y)
							}
						} else k = !0;
						t = t.getNextSourceNode(x || u)
					}
					if (k && r && !r.collapsed) {
						for (var k = G(this, f), u = k.hasAttributes(), x = r.getCommonAncestor(), y = {}, z = {}, B = {}, C = {}, U, O, da; k && x;) {
							if (x.getName() == g) {
								for (U in h.attributes)!C[U] && (da = x.getAttribute(O)) && (k.getAttribute(U) == da ? z[U] = 1 : C[U] = 1);
								for (O in h.styles)!B[O] && (da = x.getStyle(O)) && (k.getStyle(O) == da ? y[O] = 1 : B[O] = 1)
							}
							x = x.getParent()
						}
						for (U in z) k.removeAttribute(U);
						for (O in y) k.removeStyle(O);
						u && !k.hasAttributes() && (k = null);
						k ? (r.extractContents().appendTo(k), r.insertNode(k), D.call(this, k), k.mergeSiblings(), CKEDITOR.env.ie || k.$.normalize()) : (k = new CKEDITOR.dom.element("span"), r.extractContents().appendTo(k), r.insertNode(k), D.call(this, k), k.remove(!0));
						r = null
					}
				}
				c.moveToBookmark(p);
				c.shrink(CKEDITOR.SHRINK_TEXT);
				c.shrink(CKEDITOR.NODE_ELEMENT, !0)
			}
		}

		function c(a) {
			function b() {
				for (var a = new CKEDITOR.dom.elementPath(d.getParent()), c = new CKEDITOR.dom.elementPath(m.getParent()), e = null, f = null, g = 0; g < a.elements.length; g++) {
					var h = a.elements[g];
					if (h == a.block || h == a.blockLimit) break;
					n.checkElementRemovable(h, !0) && (e = h)
				}
				for (g = 0; g < c.elements.length; g++) {
					h = c.elements[g];
					if (h == c.block || h == c.blockLimit) break;
					n.checkElementRemovable(h, !0) && (f = h)
				}
				f && m.breakParent(f);
				e && d.breakParent(e)
			}
			a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
			var c = a.createBookmark(),
				d = c.startNode;
			if (a.collapsed) {
				for (var e = new CKEDITOR.dom.elementPath(d.getParent(), a.root), f, g = 0, k; g < e.elements.length && (k = e.elements[g]) && k != e.block && k != e.blockLimit; g++) if (this.checkElementRemovable(k)) {
					var l;
					a.collapsed && (a.checkBoundaryOfElement(k, CKEDITOR.END) || (l = a.checkBoundaryOfElement(k, CKEDITOR.START))) ? (f = k, f.match = l ? "start" : "end") : (k.mergeSiblings(), k.is(this.element) ? t.call(this, k) : p(k, h(this)[k.getName()]))
				}
				if (f) {
					k = d;
					for (g = 0;; g++) {
						l = e.elements[g];
						if (l.equals(f)) break;
						else if (l.match) continue;
						else l = l.clone();
						l.append(k);
						k = l
					}
					k["start" == f.match ? "insertBefore" : "insertAfter"](f)
				}
			} else {
				var m = c.endNode,
					n = this;
				b();
				for (e = d; !e.equals(m);) f = e.getNextSourceNode(), e.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(e) && (e.getName() == this.element ? t.call(this, e) : p(e, h(this)[e.getName()]), f.type == CKEDITOR.NODE_ELEMENT && f.contains(d) && (b(), f = d.getNext())), e = f
			}
			a.moveToBookmark(c);
			a.shrink(CKEDITOR.NODE_ELEMENT, !0)
		}

		function e(a) {
			var b = [];
			a.forEach(function(a) {
				if ("true" == a.getAttribute("contenteditable")) return b.push(a), !1
			}, CKEDITOR.NODE_ELEMENT, !0);
			return b
		}

		function g(a) {
			var b = a.getEnclosedNode() || a.getCommonAncestor(!1, !0);
			(a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && u(a, this)
		}

		function l(a) {
			var b = a.getCommonAncestor(!0, !0);
			if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
				var b = this._.definition,
					c = b.attributes;
				if (c) for (var d in c) a.removeAttribute(d, c[d]);
				if (b.styles) for (var e in b.styles) b.styles.hasOwnProperty(e) && a.removeStyle(e)
			}
		}

		function k(a) {
			var b = a.createBookmark(!0),
				c = a.createIterator();
			c.enforceRealBlocks = !0;
			this._.enterMode && (c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR);
			for (var d, e = a.document, f; d = c.getNextParagraph();)!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1) && (f = G(this, e, d), w(d, f));
			a.moveToBookmark(b)
		}

		function q(a) {
			var b = a.createBookmark(1),
				c = a.createIterator();
			c.enforceRealBlocks = !0;
			c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
			for (var d, e; d = c.getNextParagraph();) this.checkElementRemovable(d) && (d.is("pre") ? ((e = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(e), w(d, e)) : t.call(this, d));
			a.moveToBookmark(b)
		}

		function w(a, b) {
			var c = !b;
			c && (b = a.getDocument().createElement("div"), a.copyAttributes(b));
			var d = b && b.is("pre"),
				e = a.is("pre"),
				g = !d && e;
			if (d && !e) {
				e = b;
				(g = a.getBogus()) && g.remove();
				g = a.getHtml();
				g = y(g, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
				g = g.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
				g = g.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
				g = g.replace(/<br\b[^>]*>/gi, "\n");
				if (CKEDITOR.env.ie) {
					var h = a.getDocument().createElement("div");
					h.append(e);
					e.$.outerHTML = "<pre>" + g + "</pre>";
					e.copyAttributes(h.getFirst());
					e = h.getFirst().remove()
				} else e.setHtml(g);
				b = e
			} else g ? b = A(c ? [a.getHtml()] : f(a), b) : a.moveChildren(b);
			b.replace(a);
			if (d) {
				var c = b,
					k;
				(k = c.getPrevious(R)) && k.type == CKEDITOR.NODE_ELEMENT && k.is("pre") && (d = y(k.getHtml(), /\n$/, "") + "\n\n" + y(c.getHtml(), /^\n/, ""), CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d), k.remove())
			} else c && x(b)
		}

		function f(a) {
			var b = [];
			y(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) {
				return b + "</pre>" + c + "<pre>"
			}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) {
				b.push(c)
			});
			return b
		}

		function y(a, b, c) {
			var d = "",
				e = "";
			a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, c) {
				b && (d = b);
				c && (e = c);
				return ""
			});
			return d + a.replace(b, c) + e
		}

		function A(a, b) {
			var c;
			1 < a.length && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
			for (var d = 0; d < a.length; d++) {
				var e = a[d],
					e = e.replace(/(\r\n|\r)/g, "\n"),
					e = y(e, /^[ \t]*\n/, ""),
					e = y(e, /\n$/, ""),
					e = y(e, /^[ \t]+|[ \t]+$/g, function(a, b) {
						return 1 == a.length ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
					}),
					e = e.replace(/\n/g, "<br>"),
					e = e.replace(/[ \t]{2,}/g, function(a) {
						return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
					});
				if (c) {
					var f = b.clone();
					f.setHtml(e);
					c.append(f)
				} else b.setHtml(e)
			}
			return c || b
		}

		function t(a, b) {
			var c = this._.definition,
				d = c.attributes,
				c = c.styles,
				e = h(this)[a.getName()],
				f = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c),
				g;
			for (g in d) if ("class" != g && !this._.definition.fullMatch || a.getAttribute(g) == n(g, d[g])) b && "data-" == g.slice(0, 5) || (f = a.hasAttribute(g), a.removeAttribute(g));
			for (var k in c) this._.definition.fullMatch && a.getStyle(k) != n(k, c[k], !0) || (f = f || !! a.getStyle(k), a.removeStyle(k));
			p(a, e, z[a.getName()]);
			f && (this._.definition.alwaysRemoveElement ? x(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes() ? x(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
		}

		function D(a) {
			for (var b = h(this), c = a.getElementsByTag(this.element), d, e = c.count(); 0 <= --e;) d = c.getItem(e), d.isReadOnly() || t.call(this, d, !0);
			for (var f in b) if (f != this.element) for (c = a.getElementsByTag(f), e = c.count() - 1; 0 <= e; e--) d = c.getItem(e), d.isReadOnly() || p(d, b[f])
		}

		function p(a, b, c) {
			if (b = b && b.attributes) for (var d = 0; d < b.length; d++) {
				var e = b[d][0],
					f;
				if (f = a.getAttribute(e)) {
					var g = b[d][1];
					(null === g || g.test && g.test(f) || "string" == typeof g && f == g) && a.removeAttribute(e)
				}
			}
			c || x(a)
		}

		function x(a, b) {
			if (!a.hasAttributes() || b) if (CKEDITOR.dtd.$block[a.getName()]) {
				var c = a.getPrevious(R),
					d = a.getNext(R);
				!c || c.type != CKEDITOR.NODE_TEXT && c.isBlockBoundary({
					br: 1
				}) || a.append("br", 1);
				!d || d.type != CKEDITOR.NODE_TEXT && d.isBlockBoundary({
					br: 1
				}) || a.append("br");
				a.remove(!0)
			} else c = a.getFirst(), d = a.getLast(), a.remove(!0), c && (c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings(), d && !c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT && d.mergeSiblings())
		}

		function G(a, b, c) {
			var d;
			d = a.element;
			"*" == d && (d = "span");
			d = new CKEDITOR.dom.element(d, b);
			c && c.copyAttributes(d);
			d = u(d, a);
			b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
			return d
		}

		function u(a, b) {
			var c = b._.definition,
				d = c.attributes,
				c = CKEDITOR.style.getStyleText(c);
			if (d) for (var e in d) a.setAttribute(e, d[e]);
			c && a.setAttribute("style", c);
			return a
		}

		function r(a, b) {
			for (var c in a) a[c] = a[c].replace(C, function(a, c) {
				return b[c]
			})
		}

		function h(a) {
			if (a._.overrides) return a._.overrides;
			var b = a._.overrides = {},
				c = a._.definition.overrides;
			if (c) {
				CKEDITOR.tools.isArray(c) || (c = [c]);
				for (var d = 0; d < c.length; d++) {
					var e = c[d],
						f, g;
					"string" == typeof e ? f = e.toLowerCase() : (f = e.element ? e.element.toLowerCase() : a.element, g = e.attributes);
					e = b[f] || (b[f] = {});
					if (g) {
						var e = e.attributes = e.attributes || [],
							h;
						for (h in g) e.push([h.toLowerCase(), g[h]])
					}
				}
			}
			return b
		}

		function n(a, b, c) {
			var d = new CKEDITOR.dom.element("span");
			d[c ? "setStyle" : "setAttribute"](a, b);
			return d[c ? "getStyle" : "getAttribute"](a)
		}

		function m(a, b, c) {
			var d = a.document,
				e = a.getRanges();
			b = b ? this.removeFromRange : this.applyToRange;
			for (var f, g = e.createIterator(); f = g.getNextRange();) b.call(this, f, c);
			a.selectRanges(e);
			d.removeCustomData("doc_processing_style")
		}
		var z = {
			address: 1,
			div: 1,
			h1: 1,
			h2: 1,
			h3: 1,
			h4: 1,
			h5: 1,
			h6: 1,
			p: 1,
			pre: 1,
			section: 1,
			header: 1,
			footer: 1,
			nav: 1,
			article: 1,
			aside: 1,
			figure: 1,
			dialog: 1,
			hgroup: 1,
			time: 1,
			meter: 1,
			menu: 1,
			command: 1,
			keygen: 1,
			output: 1,
			progress: 1,
			details: 1,
			datagrid: 1,
			datalist: 1
		},
			B = {
				a: 1,
				blockquote: 1,
				embed: 1,
				hr: 1,
				img: 1,
				li: 1,
				object: 1,
				ol: 1,
				table: 1,
				td: 1,
				tr: 1,
				th: 1,
				ul: 1,
				dl: 1,
				dt: 1,
				dd: 1,
				form: 1,
				audio: 1,
				video: 1
			},
			E = /\s*(?:;\s*|$)/,
			C = /#\((.+?)\)/g,
			H = CKEDITOR.dom.walker.bookmark(0, 1),
			R = CKEDITOR.dom.walker.whitespaces(1);
		CKEDITOR.style = function(a, b) {
			if ("string" == typeof a.type) return new CKEDITOR.style.customHandlers[a.type](a);
			var c = a.attributes;
			c && c.style && (a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style)), delete c.style);
			b && (a = CKEDITOR.tools.clone(a), r(a.attributes, b), r(a.styles, b));
			c = this.element = a.element ? "string" == typeof a.element ? a.element.toLowerCase() : a.element : "*";
			this.type = a.type || (z[c] ? CKEDITOR.STYLE_BLOCK : B[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
			"object" == typeof this.element && (this.type = CKEDITOR.STYLE_OBJECT);
			this._ = {
				definition: a
			}
		};
		CKEDITOR.style.prototype = {
			apply: function(a) {
				if (a instanceof CKEDITOR.dom.document) return m.call(this, a.getSelection());
				if (this.checkApplicable(a.elementPath(), a)) {
					var b = this._.enterMode;
					b || (this._.enterMode = a.activeEnterMode);
					m.call(this, a.getSelection(), 0, a);
					this._.enterMode = b
				}
			},
			remove: function(a) {
				if (a instanceof CKEDITOR.dom.document) return m.call(this, a.getSelection(), 1);
				if (this.checkApplicable(a.elementPath(), a)) {
					var b = this._.enterMode;
					b || (this._.enterMode = a.activeEnterMode);
					m.call(this, a.getSelection(), 1, a);
					this._.enterMode = b
				}
			},
			applyToRange: function(a) {
				this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? k : this.type == CKEDITOR.STYLE_OBJECT ? g : null;
				return this.applyToRange(a)
			},
			removeFromRange: function(a) {
				this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? c : this.type == CKEDITOR.STYLE_BLOCK ? q : this.type == CKEDITOR.STYLE_OBJECT ? l : null;
				return this.removeFromRange(a)
			},
			applyToObject: function(a) {
				u(a, this)
			},
			checkActive: function(a, b) {
				switch (this.type) {
				case CKEDITOR.STYLE_BLOCK:
					return this.checkElementRemovable(a.block || a.blockLimit, !0, b);
				case CKEDITOR.STYLE_OBJECT:
				case CKEDITOR.STYLE_INLINE:
					for (var c = a.elements, d = 0, e; d < c.length; d++) if (e = c[d], this.type != CKEDITOR.STYLE_INLINE || e != a.block && e != a.blockLimit) {
						if (this.type == CKEDITOR.STYLE_OBJECT) {
							var f = e.getName();
							if (!("string" == typeof this.element ? f == this.element : f in this.element)) continue
						}
						if (this.checkElementRemovable(e, !0, b)) return !0
					}
				}
				return !1
			},
			checkApplicable: function(a, b, c) {
				b && b instanceof CKEDITOR.filter && (c = b);
				if (c && !c.check(this)) return !1;
				switch (this.type) {
				case CKEDITOR.STYLE_OBJECT:
					return !!a.contains(this.element);
				case CKEDITOR.STYLE_BLOCK:
					return !!a.blockLimit.getDtd()[this.element]
				}
				return !0
			},
			checkElementMatch: function(a, b) {
				var c = this._.definition;
				if (!a || !c.ignoreReadonly && a.isReadOnly()) return !1;
				var d = a.getName();
				if ("string" == typeof this.element ? d == this.element : d in this.element) {
					if (!b && !a.hasAttributes()) return !0;
					if (d = c._AC) c = d;
					else {
						var d = {},
							e = 0,
							f = c.attributes;
						if (f) for (var g in f) e++, d[g] = f[g];
						if (g = CKEDITOR.style.getStyleText(c)) d.style || e++, d.style = g;
						d._length = e;
						c = c._AC = d
					}
					if (c._length) {
						for (var h in c) if ("_length" != h) {
							e = a.getAttribute(h) || "";
							if ("style" == h) a: {
								d = c[h];
								"string" == typeof d && (d = CKEDITOR.tools.parseCssText(d));
								"string" == typeof e && (e = CKEDITOR.tools.parseCssText(e, !0));
								g = void 0;
								for (g in d) if (!(g in e) || e[g] != d[g] && "inherit" != d[g] && "inherit" != e[g]) {
									d = !1;
									break a
								}
								d = !0
							} else d = c[h] == e;
							if (d) {
								if (!b) return !0
							} else if (b) return !1
						}
						if (b) return !0
					} else return !0
				}
				return !1
			},
			checkElementRemovable: function(a, b, c) {
				if (this.checkElementMatch(a, b, c)) return !0;
				if (b = h(this)[a.getName()]) {
					var d;
					if (!(b = b.attributes)) return !0;
					for (c = 0; c < b.length; c++) if (d = b[c][0], d = a.getAttribute(d)) {
						var e = b[c][1];
						if (null === e) return !0;
						if ("string" == typeof e) {
							if (d == e) return !0
						} else if (e.test(d)) return !0
					}
				}
				return !1
			},
			buildPreview: function(a) {
				var b = this._.definition,
					c = [],
					d = b.element;
				"bdo" == d && (d = "span");
				var c = ["<", d],
					e = b.attributes;
				if (e) for (var f in e) c.push(" ", f, '="', e[f], '"');
				(e = CKEDITOR.style.getStyleText(b)) && c.push(' style="', e, '"');
				c.push(">", a || b.name, "</", d, ">");
				return c.join("")
			},
			getDefinition: function() {
				return this._.definition
			}
		};
		CKEDITOR.style.getStyleText = function(a) {
			var b = a._ST;
			if (b) return b;
			var b = a.styles,
				c = a.attributes && a.attributes.style || "",
				d = "";
			c.length && (c = c.replace(E, ";"));
			for (var e in b) {
				var f = b[e],
					g = (e + ":" + f).replace(E, ";");
				"inherit" == f ? d += g : c += g
			}
			c.length && (c = CKEDITOR.tools.normalizeCssText(c, !0));
			return a._ST = c + d
		};
		CKEDITOR.style.customHandlers = {};
		CKEDITOR.style.addCustomHandler = function(a) {
			var b = function(a) {
					this._ = {
						definition: a
					};
					this.setup && this.setup(a)
				};
			b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
				assignedTo: CKEDITOR.STYLE_OBJECT
			}, a, !0);
			return this.customHandlers[a.type] = b
		};
		var T = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
			Q = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
	})();
	CKEDITOR.styleCommand = function(a, d) {
		this.requiredContent = this.allowedContent = this.style = a;
		CKEDITOR.tools.extend(this, d, !0)
	};
	CKEDITOR.styleCommand.prototype.exec = function(a) {
		a.focus();
		this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
	};
	CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
	CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
	CKEDITOR.loadStylesSet = function(a, d, b) {
		CKEDITOR.stylesSet.addExternal(a, d, "");
		CKEDITOR.stylesSet.load(a, b)
	};
	CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
		attachStyleStateChange: function(a, d) {
			var b = this._.styleStateChangeCallbacks;
			b || (b = this._.styleStateChangeCallbacks = [], this.on("selectionChange", function(a) {
				for (var d = 0; d < b.length; d++) {
					var g = b[d],
						l = g.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
					g.fn.call(this, l)
				}
			}));
			b.push({
				style: a,
				fn: d
			})
		},
		applyStyle: function(a) {
			a.apply(this)
		},
		removeStyle: function(a) {
			a.remove(this)
		},
		getStylesSet: function(a) {
			if (this._.stylesDefinitions) a(this._.stylesDefinitions);
			else {
				var d = this,
					b = d.config.stylesCombo_stylesSet || d.config.stylesSet;
				if (!1 === b) a(null);
				else if (b instanceof Array) d._.stylesDefinitions = b, a(b);
				else {
					b || (b = "default");
					var b = b.split(":"),
						c = b[0];
					CKEDITOR.stylesSet.addExternal(c, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
					CKEDITOR.stylesSet.load(c, function(b) {
						d._.stylesDefinitions = b[c];
						a(d._.stylesDefinitions)
					})
				}
			}
		}
	});
	CKEDITOR.dom.comment = function(a, d) {
		"string" == typeof a && (a = (d ? d.$ : document).createComment(a));
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
	CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
		type: CKEDITOR.NODE_COMMENT,
		getOuterHtml: function() {
			return "<!--" + this.$.nodeValue + "-->"
		}
	});
	"use strict";
	(function() {
		var a = {},
			d = {},
			b;
		for (b in CKEDITOR.dtd.$blockLimit) b in CKEDITOR.dtd.$list || (a[b] = 1);
		for (b in CKEDITOR.dtd.$block) b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (d[b] = 1);
		CKEDITOR.dom.elementPath = function(b, e) {
			var g = null,
				l = null,
				k = [],
				q = b,
				w;
			e = e || b.getDocument().getBody();
			do
			if (q.type == CKEDITOR.NODE_ELEMENT) {
				k.push(q);
				if (!this.lastElement && (this.lastElement = q, q.is(CKEDITOR.dtd.$object) || "false" == q.getAttribute("contenteditable"))) continue;
				if (q.equals(e)) break;
				if (!l && (w = q.getName(), "true" == q.getAttribute("contenteditable") ? l = q : !g && d[w] && (g = q), a[w])) {
					if (w = !g && "div" == w) {
						a: {
							w = q.getChildren();
							for (var f = 0, y = w.count(); f < y; f++) {
								var A = w.getItem(f);
								if (A.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[A.getName()]) {
									w = !0;
									break a
								}
							}
							w = !1
						}
						w = !w
					}
					w ? g = q : l = q
				}
			}
			while (q = q.getParent());
			l || (l = e);
			this.block = g;
			this.blockLimit = l;
			this.root = e;
			this.elements = k
		}
	})();
	CKEDITOR.dom.elementPath.prototype = {
		compare: function(a) {
			var d = this.elements;
			a = a && a.elements;
			if (!a || d.length != a.length) return !1;
			for (var b = 0; b < d.length; b++) if (!d[b].equals(a[b])) return !1;
			return !0
		},
		contains: function(a, d, b) {
			var c;
			"string" == typeof a && (c = function(b) {
				return b.getName() == a
			});
			a instanceof CKEDITOR.dom.element ? c = function(b) {
				return b.equals(a)
			} : CKEDITOR.tools.isArray(a) ? c = function(b) {
				return -1 < CKEDITOR.tools.indexOf(a, b.getName())
			} : "function" == typeof a ? c = a : "object" == typeof a && (c = function(b) {
				return b.getName() in a
			});
			var e = this.elements,
				g = e.length;
			d && g--;
			b && (e = Array.prototype.slice.call(e, 0), e.reverse());
			for (d = 0; d < g; d++) if (c(e[d])) return e[d];
			return null
		},
		isContextFor: function(a) {
			var d;
			return a in CKEDITOR.dtd.$block ? (d = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit, !! d.getDtd()[a]) : !0
		},
		direction: function() {
			return (this.block || this.blockLimit || this.root).getDirection(1)
		}
	};
	CKEDITOR.dom.text = function(a, d) {
		"string" == typeof a && (a = (d ? d.$ : document).createTextNode(a));
		this.$ = a
	};
	CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
	CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
		type: CKEDITOR.NODE_TEXT,
		getLength: function() {
			return this.$.nodeValue.length
		},
		getText: function() {
			return this.$.nodeValue
		},
		setText: function(a) {
			this.$.nodeValue = a
		},
		split: function(a) {
			var d = this.$.parentNode,
				b = d.childNodes.length,
				c = this.getLength(),
				e = this.getDocument(),
				g = new CKEDITOR.dom.text(this.$.splitText(a), e);
			d.childNodes.length == b && (a >= c ? (g = e.createText(""), g.insertAfter(this)) : (a = e.createText(""), a.insertAfter(g), a.remove()));
			return g
		},
		substring: function(a, d) {
			return "number" != typeof d ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, d)
		}
	});
	(function() {
		function a(a, c, d) {
			var g = a.serializable,
				l = c[d ? "endContainer" : "startContainer"],
				k = d ? "endOffset" : "startOffset",
				q = g ? c.document.getById(a.startNode) : a.startNode;
			a = g ? c.document.getById(a.endNode) : a.endNode;
			l.equals(q.getPrevious()) ? (c.startOffset = c.startOffset - l.getLength() - a.getPrevious().getLength(), l = a.getNext()) : l.equals(a.getPrevious()) && (c.startOffset -= l.getLength(), l = a.getNext());
			l.equals(q.getParent()) && c[k]++;
			l.equals(a.getParent()) && c[k]++;
			c[d ? "endContainer" : "startContainer"] = l;
			return c
		}
		CKEDITOR.dom.rangeList = function(a) {
			if (a instanceof CKEDITOR.dom.rangeList) return a;
			a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
			return CKEDITOR.tools.extend(a, d)
		};
		var d = {
			createIterator: function() {
				var a = this,
					c = CKEDITOR.dom.walker.bookmark(),
					d = [],
					g;
				return {
					getNextRange: function(l) {
						g = void 0 === g ? 0 : g + 1;
						var k = a[g];
						if (k && 1 < a.length) {
							if (!g) for (var q = a.length - 1; 0 <= q; q--) d.unshift(a[q].createBookmark(!0));
							if (l) for (var w = 0; a[g + w + 1];) {
								var f = k.document;
								l = 0;
								q = f.getById(d[w].endNode);
								for (f = f.getById(d[w + 1].startNode);;) {
									q = q.getNextSourceNode(!1);
									if (f.equals(q)) l = 1;
									else if (c(q) || q.type == CKEDITOR.NODE_ELEMENT && q.isBlockBoundary()) continue;
									break
								}
								if (!l) break;
								w++
							}
							for (k.moveToBookmark(d.shift()); w--;) q = a[++g], q.moveToBookmark(d.shift()), k.setEnd(q.endContainer, q.endOffset)
						}
						return k
					}
				}
			},
			createBookmarks: function(b) {
				for (var c = [], d, g = 0; g < this.length; g++) {
					c.push(d = this[g].createBookmark(b, !0));
					for (var l = g + 1; l < this.length; l++) this[l] = a(d, this[l]), this[l] = a(d, this[l], !0)
				}
				return c
			},
			createBookmarks2: function(a) {
				for (var c = [], d = 0; d < this.length; d++) c.push(this[d].createBookmark2(a));
				return c
			},
			moveToBookmarks: function(a) {
				for (var c = 0; c < this.length; c++) this[c].moveToBookmark(a[c])
			}
		}
	})();
	(function() {
		function a() {
			return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
		}

		function d(b) {
			var c = CKEDITOR.skin["ua_" + b],
				d = CKEDITOR.env;
			if (c) for (var c = c.split(",").sort(function(a, b) {
				return a > b ? -1 : 1
			}), e = 0, g; e < c.length; e++) if (g = c[e], d.ie && (g.replace(/^ie/, "") == d.version || d.quirks && "iequirks" == g) && (g = "ie"), d[g]) {
				b += "_" + c[e];
				break
			}
			return CKEDITOR.getUrl(a() + b + ".css")
		}

		function b(a, b) {
			g[a] || (CKEDITOR.document.appendStyleSheet(d(a)), g[a] = 1);
			b && b()
		}

		function c(a) {
			var b = a.getById(l);
			b || (b = a.getHead().append("style"), b.setAttribute("id", l), b.setAttribute("type", "text/css"));
			return b
		}

		function e(a, b, c) {
			var d, e, g;
			if (CKEDITOR.env.webkit) for (b = b.split("}").slice(0, -1), e = 0; e < b.length; e++) b[e] = b[e].split("{");
			for (var k = 0; k < a.length; k++) if (CKEDITOR.env.webkit) for (e = 0; e < b.length; e++) {
				g = b[e][1];
				for (d = 0; d < c.length; d++) g = g.replace(c[d][0], c[d][1]);
				a[k].$.sheet.addRule(b[e][0], g)
			} else {
				g = b;
				for (d = 0; d < c.length; d++) g = g.replace(c[d][0], c[d][1]);
				CKEDITOR.env.ie && 11 > CKEDITOR.env.version ? a[k].$.styleSheet.cssText += g : a[k].$.innerHTML += g
			}
		}
		var g = {};
		CKEDITOR.skin = {
			path: a,
			loadPart: function(c, d) {
				CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function() {
					b(c, d)
				}) : b(c, d)
			},
			getPath: function(a) {
				return CKEDITOR.getUrl(d(a))
			},
			icons: {},
			addIcon: function(a, b, c, d) {
				a = a.toLowerCase();
				this.icons[a] || (this.icons[a] = {
					path: b,
					offset: c || 0,
					bgsize: d || "16px"
				})
			},
			getIconStyle: function(a, b, c, d, e) {
				var g;
				a && (a = a.toLowerCase(), b && (g = this.icons[a + "-rtl"]), g || (g = this.icons[a]));
				a = c || g && g.path || "";
				d = d || g && g.offset;
				e = e || g && g.bgsize || "16px";
				a && (a = a.replace(/'/g, "\\'"));
				return a && "background-image:url('" + CKEDITOR.getUrl(a) + "');background-position:0 " + d + "px;background-size:" + e + ";"
			}
		};
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			getUiColor: function() {
				return this.uiColor
			},
			setUiColor: function(a) {
				var b = c(CKEDITOR.document);
				return (this.setUiColor = function(a) {
					this.uiColor = a;
					var c = CKEDITOR.skin.chameleon,
						d = "",
						g = "";
					"function" == typeof c && (d = c(this, "editor"), g = c(this, "panel"));
					a = [
						[q, a]
					];
					e([b], d, a);
					e(k, g, a)
				}).call(this, a)
			}
		});
		var l = "cke_ui_color",
			k = [],
			q = /\$color/g;
		CKEDITOR.on("instanceLoaded", function(a) {
			if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
				var b = a.editor;
				a = function(a) {
					a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
					if (!a.getById("cke_ui_color")) {
						a = c(a);
						k.push(a);
						var d = b.getUiColor();
						d && e([a], CKEDITOR.skin.chameleon(b, "panel"), [
							[q, d]
						])
					}
				};
				b.on("panelShow", a);
				b.on("menuShow", a);
				b.config.uiColor && b.setUiColor(b.config.uiColor)
			}
		})
	})();
	(function() {
		if (CKEDITOR.env.webkit) CKEDITOR.env.hc = !1;
		else {
			var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
			a.appendTo(CKEDITOR.document.getHead());
			try {
				var d = a.getComputedStyle("border-top-color"),
					b = a.getComputedStyle("border-right-color");
				CKEDITOR.env.hc = !(!d || d != b)
			} catch (c) {
				CKEDITOR.env.hc = !1
			}
			a.remove()
		}
		CKEDITOR.env.hc && (CKEDITOR.env.cssClass += " cke_hc");
		CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
		CKEDITOR.status = "loaded";
		CKEDITOR.fireOnce("loaded");
		if (a = CKEDITOR._.pending) for (delete CKEDITOR._.pending, d = 0; d < a.length; d++) CKEDITOR.editor.prototype.constructor.apply(a[d][0], a[d][1]), CKEDITOR.add(a[d][0])
	})();
/*
 Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
	CKEDITOR.skin.name = "moono";
	CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
	CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8";
	CKEDITOR.skin.chameleon = function() {
		var b = function() {
				return function(b, e) {
					for (var a = b.match(/[^#]./g), c = 0; 3 > c; c++) {
						var f = c,
							d;
						d = parseInt(a[c], 16);
						d = ("0" + (0 > e ? 0 | d * (1 + e) : 0 | d + (255 - d) * e).toString(16)).slice(-2);
						a[f] = d
					}
					return "#" + a.join("")
				}
			}(),
			c = function() {
				var b = new CKEDITOR.template("background:#{to};background-image:linear-gradient(to bottom,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
				return function(c, a) {
					return b.output({
						from: c,
						to: a
					})
				}
			}(),
			f = {
				editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
				panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
			};
		return function(g, e) {
			var a = g.uiColor,
				a = {
					id: "." + g.id,
					defaultBorder: b(a, -.1),
					defaultGradient: c(b(a, .9), a),
					lightGradient: c(b(a, 1), b(a, .7)),
					mediumGradient: c(b(a, .8), b(a, .5)),
					ckeButtonOn: c(b(a, .6), b(a, .7)),
					ckeResizer: b(a, -.4),
					ckeToolbarSeparator: b(a, .5),
					ckeColorauto: b(a, .8),
					dialogBody: b(a, .7),
					dialogTabSelected: c("#FFFFFF", "#FFFFFF"),
					dialogTabSelectedBorder: "#FFF",
					elementsPathColor: b(a, -.6),
					elementsPathBg: a,
					menubuttonIcon: b(a, .5),
					menubuttonIconHover: b(a, .3)
				};
			return f[e].output(a).replace(/\[/g, "{").replace(/\]/g, "}")
		}
	}();
	CKEDITOR.plugins.add("dialogui", {
		onLoad: function() {
			var h = function(b) {
					this._ || (this._ = {});
					this._["default"] = this._.initValue = b["default"] || "";
					this._.required = b.required || !1;
					for (var a = [this._], d = 1; d < arguments.length; d++) a.push(arguments[d]);
					a.push(!0);
					CKEDITOR.tools.extend.apply(CKEDITOR.tools, a);
					return this._
				},
				v = {
					build: function(b, a, d) {
						return new CKEDITOR.ui.dialog.textInput(b, a, d)
					}
				},
				n = {
					build: function(b, a, d) {
						return new CKEDITOR.ui.dialog[a.type](b, a, d)
					}
				},
				q = {
					isChanged: function() {
						return this.getValue() != this.getInitValue()
					},
					reset: function(b) {
						this.setValue(this.getInitValue(), b)
					},
					setInitValue: function() {
						this._.initValue = this.getValue()
					},
					resetInitValue: function() {
						this._.initValue = this._["default"]
					},
					getInitValue: function() {
						return this._.initValue
					}
				},
				r = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
					onChange: function(b, a) {
						this._.domOnChangeRegistered || (b.on("load", function() {
							this.getInputElement().on("change", function() {
								b.parts.dialog.isVisible() && this.fire("change", {
									value: this.getValue()
								})
							}, this)
						}, this), this._.domOnChangeRegistered = !0);
						this.on("change", a)
					}
				}, !0),
				x = /^on([A-Z]\w+)/,
				t = function(b) {
					for (var a in b)(x.test(a) || "title" == a || "type" == a) && delete b[a];
					return b
				},
				w = function(b) {
					b = b.data.getKeystroke();
					b == CKEDITOR.SHIFT + CKEDITOR.ALT + 36 ? this.setDirectionMarker("ltr") : b == CKEDITOR.SHIFT + CKEDITOR.ALT + 35 && this.setDirectionMarker("rtl")
				};
			CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
				labeledElement: function(b, a, d, f) {
					if (!(4 > arguments.length)) {
						var c = h.call(this, a);
						c.labelId = CKEDITOR.tools.getNextId() + "_label";
						this._.children = [];
						var e = {
							role: a.role || "presentation"
						};
						a.includeLabel && (e["aria-labelledby"] = c.labelId);
						CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "div", null, e, function() {
							var e = [],
								g = a.required ? " cke_required" : "";
							"horizontal" != a.labelLayout ? e.push('<label class="cke_dialog_ui_labeled_label' + g + '" ', ' id="' + c.labelId + '"', c.inputId ? ' for="' + c.inputId + '"' : "", (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", a.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', a.controlStyle ? ' style="' + a.controlStyle + '"' : "", ' role="presentation">', f.call(this, b, a), "</div>") : (g = {
								type: "hbox",
								widths: a.widths,
								padding: 0,
								children: [{
									type: "html",
									html: '<label class="cke_dialog_ui_labeled_label' + g + '" id="' + c.labelId + '" for="' + c.inputId + '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(a.label) + "</label>"
								}, {
									type: "html",
									html: '<span class="cke_dialog_ui_labeled_content"' + (a.controlStyle ? ' style="' + a.controlStyle + '"' : "") + ">" + f.call(this, b, a) + "</span>"
								}]
							}, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, g, e));
							return e.join("")
						})
					}
				},
				textInput: function(b, a, d) {
					if (!(3 > arguments.length)) {
						h.call(this, a);
						var f = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput",
							c = {
								"class": "cke_dialog_ui_input_" + a.type,
								id: f,
								type: a.type
							};
						a.validate && (this.validate = a.validate);
						a.maxLength && (c.maxlength = a.maxLength);
						a.size && (c.size = a.size);
						a.inputStyle && (c.style = a.inputStyle);
						var e = this,
							m = !1;
						b.on("load", function() {
							e.getInputElement().on("keydown", function(a) {
								13 == a.data.getKeystroke() && (m = !0)
							});
							e.getInputElement().on("keyup", function(a) {
								13 == a.data.getKeystroke() && m && (b.getButton("ok") && setTimeout(function() {
									b.getButton("ok").click()
								}, 0), m = !1);
								e.bidi && w.call(e, a)
							}, null, null, 1E3)
						});
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							var b = ['<div class="cke_dialog_ui_input_', a.type, '" role="presentation"'];
							a.width && b.push('style="width:' + a.width + '" ');
							b.push("><input ");
							c["aria-labelledby"] = this._.labelId;
							this._.required && (c["aria-required"] = this._.required);
							for (var e in c) b.push(e + '="' + c[e] + '" ');
							b.push(" /></div>");
							return b.join("")
						})
					}
				},
				textarea: function(b, a, d) {
					if (!(3 > arguments.length)) {
						h.call(this, a);
						var f = this,
							c = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea",
							e = {};
						a.validate && (this.validate = a.validate);
						e.rows = a.rows || 5;
						e.cols = a.cols || 20;
						e["class"] = "cke_dialog_ui_input_textarea " + (a["class"] || "");
						"undefined" != typeof a.inputStyle && (e.style = a.inputStyle);
						a.dir && (e.dir = a.dir);
						if (f.bidi) b.on("load", function() {
							f.getInputElement().on("keyup", w)
						}, f);
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							e["aria-labelledby"] = this._.labelId;
							this._.required && (e["aria-required"] = this._.required);
							var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', c, '" '],
								b;
							for (b in e) a.push(b + '="' + CKEDITOR.tools.htmlEncode(e[b]) + '" ');
							a.push(">", CKEDITOR.tools.htmlEncode(f._["default"]), "</textarea></div>");
							return a.join("")
						})
					}
				},
				checkbox: function(b, a, d) {
					if (!(3 > arguments.length)) {
						var f = h.call(this, a, {
							"default": !! a["default"]
						});
						a.validate && (this.validate = a.validate);
						CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "span", null, null, function() {
							var c = CKEDITOR.tools.extend({}, a, {
								id: a.id ? a.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
							}, !0),
								e = [],
								d = CKEDITOR.tools.getNextId() + "_label",
								g = {
									"class": "cke_dialog_ui_checkbox_input",
									type: "checkbox",
									"aria-labelledby": d
								};
							t(c);
							a["default"] && (g.checked = "checked");
							"undefined" != typeof c.inputStyle && (c.style = c.inputStyle);
							f.checkbox = new CKEDITOR.ui.dialog.uiElement(b, c, e, "input", null, g);
							e.push(' <label id="', d, '" for="', g.id, '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(a.label), "</label>");
							return e.join("")
						})
					}
				},
				radio: function(b, a, d) {
					if (!(3 > arguments.length)) {
						h.call(this, a);
						this._["default"] || (this._["default"] = this._.initValue = a.items[0][1]);
						a.validate && (this.validate = a.validate);
						var f = [],
							c = this;
						a.role = "radiogroup";
						a.includeLabel = !0;
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							for (var e = [], d = [], g = (a.id ? a.id : CKEDITOR.tools.getNextId()) + "_radio", k = 0; k < a.items.length; k++) {
								var l = a.items[k],
									h = void 0 !== l[2] ? l[2] : l[0],
									n = void 0 !== l[1] ? l[1] : l[0],
									p = CKEDITOR.tools.getNextId() + "_radio_input",
									q = p + "_label",
									p = CKEDITOR.tools.extend({}, a, {
										id: p,
										title: null,
										type: null
									}, !0),
									h = CKEDITOR.tools.extend({}, p, {
										title: h
									}, !0),
									r = {
										type: "radio",
										"class": "cke_dialog_ui_radio_input",
										name: g,
										value: n,
										"aria-labelledby": q
									},
									u = [];
								c._["default"] == n && (r.checked = "checked");
								t(p);
								t(h);
								"undefined" != typeof p.inputStyle && (p.style = p.inputStyle);
								p.keyboardFocusable = !0;
								f.push(new CKEDITOR.ui.dialog.uiElement(b, p, u, "input", null, r));
								u.push(" ");
								new CKEDITOR.ui.dialog.uiElement(b, h, u, "label", null, {
									id: q,
									"for": r.id
								}, l[0]);
								e.push(u.join(""))
							}
							new CKEDITOR.ui.dialog.hbox(b, f, e, d);
							return d.join("")
						});
						this._.children = f
					}
				},
				button: function(b, a, d) {
					if (arguments.length) {
						"function" == typeof a && (a = a(b.getParentEditor()));
						h.call(this, a, {
							disabled: a.disabled || !1
						});
						CKEDITOR.event.implementOn(this);
						var f = this;
						b.on("load", function() {
							var a = this.getElement();
							(function() {
								a.on("click", function(a) {
									f.click();
									a.data.preventDefault()
								});
								a.on("keydown", function(a) {
									a.data.getKeystroke() in {
										32: 1
									} && (f.click(), a.data.preventDefault())
								})
							})();
							a.unselectable()
						}, this);
						var c = CKEDITOR.tools.extend({}, a);
						delete c.style;
						var e = CKEDITOR.tools.getNextId() + "_label";
						CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "a", null, {
							style: a.style,
							href: "javascript:void(0)",
							title: a.label,
							hidefocus: "true",
							"class": a["class"],
							role: "button",
							"aria-labelledby": e
						}, '<span id="' + e + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(a.label) + "</span>")
					}
				},
				select: function(b, a, d) {
					if (!(3 > arguments.length)) {
						var f = h.call(this, a);
						a.validate && (this.validate = a.validate);
						f.inputId = CKEDITOR.tools.getNextId() + "_select";
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							var c = CKEDITOR.tools.extend({}, a, {
								id: a.id ? a.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
							}, !0),
								e = [],
								d = [],
								g = {
									id: f.inputId,
									"class": "cke_dialog_ui_input_select",
									"aria-labelledby": this._.labelId
								};
							e.push('<div class="cke_dialog_ui_input_', a.type, '" role="presentation"');
							a.width && e.push('style="width:' + a.width + '" ');
							e.push(">");
							void 0 !== a.size && (g.size = a.size);
							void 0 !== a.multiple && (g.multiple = a.multiple);
							t(c);
							for (var k = 0, l; k < a.items.length && (l = a.items[k]); k++) d.push('<option value="', CKEDITOR.tools.htmlEncode(void 0 !== l[1] ? l[1] : l[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(l[0]));
							"undefined" != typeof c.inputStyle && (c.style = c.inputStyle);
							f.select = new CKEDITOR.ui.dialog.uiElement(b, c, e, "select", null, g, d.join(""));
							e.push("</div>");
							return e.join("")
						})
					}
				},
				file: function(b, a, d) {
					if (!(3 > arguments.length)) {
						void 0 === a["default"] && (a["default"] = "");
						var f = CKEDITOR.tools.extend(h.call(this, a), {
							definition: a,
							buttons: []
						});
						a.validate && (this.validate = a.validate);
						b.on("load", function() {
							CKEDITOR.document.getById(f.frameId).getParent().addClass("cke_dialog_ui_input_file")
						});
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							f.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
							var b = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', f.frameId, '" title="', a.label, '" src="javascript:void('];
							b.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
							b.push(')"></iframe>');
							return b.join("")
						})
					}
				},
				fileButton: function(b, a, d) {
					var f = this;
					if (!(3 > arguments.length)) {
						h.call(this, a);
						a.validate && (this.validate = a.validate);
						var c = CKEDITOR.tools.extend({}, a),
							e = c.onClick;
						c.className = (c.className ? c.className + " " : "") + "cke_dialog_ui_button";
						c.onClick = function(c) {
							var d = a["for"];
							e && !1 === e.call(this, c) || (b.getContentElement(d[0], d[1]).submit(), this.disable())
						};
						b.on("load", function() {
							b.getContentElement(a["for"][0], a["for"][1])._.buttons.push(f)
						});
						CKEDITOR.ui.dialog.button.call(this, b, c, d)
					}
				},
				html: function() {
					var b = /^\s*<[\w:]+\s+([^>]*)?>/,
						a = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
						d = /\/$/;
					return function(f, c, e) {
						if (!(3 > arguments.length)) {
							var m = [],
								g = c.html;
							"<" != g.charAt(0) && (g = "<span>" + g + "</span>");
							var k = c.focus;
							if (k) {
								var l = this.focus;
								this.focus = function() {
									("function" == typeof k ? k : l).call(this);
									this.fire("focus")
								};
								c.isFocusable && (this.isFocusable = this.isFocusable);
								this.keyboardFocusable = !0
							}
							CKEDITOR.ui.dialog.uiElement.call(this, f, c, m, "span", null, null, "");
							m = m.join("").match(b);
							g = g.match(a) || ["", "", ""];
							d.test(g[1]) && (g[1] = g[1].slice(0, -1), g[2] = "/" + g[2]);
							e.push([g[1], " ", m[1] || "", g[2]].join(""))
						}
					}
				}(),
				fieldset: function(b, a, d, f, c) {
					var e = c.label;
					this._ = {
						children: a
					};
					CKEDITOR.ui.dialog.uiElement.call(this, b, c, f, "fieldset", null, null, function() {
						var a = [];
						e && a.push("<legend" + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + e + "</legend>");
						for (var b = 0; b < d.length; b++) a.push(d[b]);
						return a.join("")
					})
				}
			}, !0);
			CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
			CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				setLabel: function(b) {
					var a = CKEDITOR.document.getById(this._.labelId);
					1 > a.getChildCount() ? (new CKEDITOR.dom.text(b, CKEDITOR.document)).appendTo(a) : a.getChild(0).$.nodeValue = b;
					return this
				},
				getLabel: function() {
					var b = CKEDITOR.document.getById(this._.labelId);
					return !b || 1 > b.getChildCount() ? "" : b.getChild(0).getText()
				},
				eventProcessors: r
			}, !0);
			CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				click: function() {
					return this._.disabled ? !1 : this.fire("click", {
						dialog: this._.dialog
					})
				},
				enable: function() {
					this._.disabled = !1;
					var b = this.getElement();
					b && b.removeClass("cke_disabled")
				},
				disable: function() {
					this._.disabled = !0;
					this.getElement().addClass("cke_disabled")
				},
				isVisible: function() {
					return this.getElement().getFirst().isVisible()
				},
				isEnabled: function() {
					return !this._.disabled
				},
				eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
					onClick: function(b, a) {
						this.on("click", function() {
							a.apply(this, arguments)
						})
					}
				}, !0),
				accessKeyUp: function() {
					this.click()
				},
				accessKeyDown: function() {
					this.focus()
				},
				keyboardFocusable: !0
			}, !0);
			CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
				getInputElement: function() {
					return CKEDITOR.document.getById(this._.inputId)
				},
				focus: function() {
					var b = this.selectParentTab();
					setTimeout(function() {
						var a = b.getInputElement();
						a && a.$.focus()
					}, 0)
				},
				select: function() {
					var b = this.selectParentTab();
					setTimeout(function() {
						var a = b.getInputElement();
						a && (a.$.focus(), a.$.select())
					}, 0)
				},
				accessKeyUp: function() {
					this.select()
				},
				setValue: function(b) {
					if (this.bidi) {
						var a = b && b.charAt(0);
						(a = "‪" == a ? "ltr" : "‫" == a ? "rtl" : null) && (b = b.slice(1));
						this.setDirectionMarker(a)
					}
					b || (b = "");
					return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
				},
				getValue: function() {
					var b = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call(this);
					if (this.bidi && b) {
						var a = this.getDirectionMarker();
						a && (b = ("ltr" == a ? "‪" : "‫") + b)
					}
					return b
				},
				setDirectionMarker: function(b) {
					var a = this.getInputElement();
					b ? a.setAttributes({
						dir: b,
						"data-cke-dir-marker": b
					}) : this.getDirectionMarker() && a.removeAttributes(["dir", "data-cke-dir-marker"])
				},
				getDirectionMarker: function() {
					return this.getInputElement().data("cke-dir-marker")
				},
				keyboardFocusable: !0
			}, q, !0);
			CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
			CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
				getInputElement: function() {
					return this._.select.getElement()
				},
				add: function(b, a, d) {
					var f = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
						c = this.getInputElement().$;
					f.$.text = b;
					f.$.value = void 0 === a || null === a ? b : a;
					void 0 === d || null === d ? CKEDITOR.env.ie ? c.add(f.$) : c.add(f.$, null) : c.add(f.$, d);
					return this
				},
				remove: function(b) {
					this.getInputElement().$.remove(b);
					return this
				},
				clear: function() {
					for (var b = this.getInputElement().$; 0 < b.length;) b.remove(0);
					return this
				},
				keyboardFocusable: !0
			}, q, !0);
			CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				getInputElement: function() {
					return this._.checkbox.getElement()
				},
				setValue: function(b, a) {
					this.getInputElement().$.checked = b;
					!a && this.fire("change", {
						value: b
					})
				},
				getValue: function() {
					return this.getInputElement().$.checked
				},
				accessKeyUp: function() {
					this.setValue(!this.getValue())
				},
				eventProcessors: {
					onChange: function(b, a) {
						if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version) return r.onChange.apply(this, arguments);
						b.on("load", function() {
							var a = this._.checkbox.getElement();
							a.on("propertychange", function(b) {
								b = b.data.$;
								"checked" == b.propertyName && this.fire("change", {
									value: a.$.checked
								})
							}, this)
						}, this);
						this.on("change", a);
						return null
					}
				},
				keyboardFocusable: !0
			}, q, !0);
			CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				setValue: function(b, a) {
					for (var d = this._.children, f, c = 0; c < d.length && (f = d[c]); c++) f.getElement().$.checked = f.getValue() == b;
					!a && this.fire("change", {
						value: b
					})
				},
				getValue: function() {
					for (var b = this._.children, a = 0; a < b.length; a++) if (b[a].getElement().$.checked) return b[a].getValue();
					return null
				},
				accessKeyUp: function() {
					var b = this._.children,
						a;
					for (a = 0; a < b.length; a++) if (b[a].getElement().$.checked) {
						b[a].getElement().focus();
						return
					}
					b[0].getElement().focus()
				},
				eventProcessors: {
					onChange: function(b, a) {
						if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version) return r.onChange.apply(this, arguments);
						b.on("load", function() {
							for (var a = this._.children, b = this, c = 0; c < a.length; c++) a[c].getElement().on("propertychange", function(a) {
								a = a.data.$;
								"checked" == a.propertyName && this.$.checked && b.fire("change", {
									value: this.getAttribute("value")
								})
							})
						}, this);
						this.on("change", a);
						return null
					}
				}
			}, q, !0);
			CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, q, {
				getInputElement: function() {
					var b = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
					return 0 < b.$.forms.length ? new CKEDITOR.dom.element(b.$.forms[0].elements[0]) : this.getElement()
				},
				submit: function() {
					this.getInputElement().getParent().$.submit();
					return this
				},
				getAction: function() {
					return this.getInputElement().getParent().$.action
				},
				registerEvents: function(b) {
					var a = /^on([A-Z]\w+)/,
						d, f = function(a, b, c, d) {
							a.on("formLoaded", function() {
								a.getInputElement().on(c, d, a)
							})
						},
						c;
					for (c in b) if (d = c.match(a)) this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, b[c]) : f(this, this._.dialog, d[1].toLowerCase(), b[c]);
					return this
				},
				reset: function() {
					function b() {
						d.$.open();
						var b = "";
						f.size && (b = f.size - (CKEDITOR.env.ie ? 7 : 0));
						var h = a.frameId + "_input";
						d.$.write(['<html dir="' + g + '" lang="' + k + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + g + '" lang="' + k + '" action="', CKEDITOR.tools.htmlEncode(f.action), '"><label id="', a.labelId, '" for="', h, '" style="display:none">', CKEDITOR.tools.htmlEncode(f.label), '</label><input style="width:100%" id="', h, '" aria-labelledby="', a.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(f.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(0 < b ? b : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + e + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + m + ")}", "</script>"].join(""));
						d.$.close();
						for (b = 0; b < c.length; b++) c[b].enable()
					}
					var a = this._,
						d = CKEDITOR.document.getById(a.frameId).getFrameDocument(),
						f = a.definition,
						c = a.buttons,
						e = this.formLoadedNumber,
						m = this.formUnloadNumber,
						g = a.dialog._.editor.lang.dir,
						k = a.dialog._.editor.langCode;
					e || (e = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
						this.fire("formLoaded")
					}, this), m = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
						this.getInputElement().clearCustomData()
					}, this), this.getDialog()._.editor.on("destroy", function() {
						CKEDITOR.tools.removeFunction(e);
						CKEDITOR.tools.removeFunction(m)
					}));
					CKEDITOR.env.gecko ? setTimeout(b, 500) : b()
				},
				getValue: function() {
					return this.getInputElement().$.value || ""
				},
				setInitValue: function() {
					this._.initValue = ""
				},
				eventProcessors: {
					onChange: function(b, a) {
						this._.domOnChangeRegistered || (this.on("formLoaded", function() {
							this.getInputElement().on("change", function() {
								this.fire("change", {
									value: this.getValue()
								})
							}, this)
						}, this), this._.domOnChangeRegistered = !0);
						this.on("change", a)
					}
				},
				keyboardFocusable: !0
			}, !0);
			CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
			CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
			CKEDITOR.dialog.addUIElement("text", v);
			CKEDITOR.dialog.addUIElement("password", v);
			CKEDITOR.dialog.addUIElement("textarea", n);
			CKEDITOR.dialog.addUIElement("checkbox", n);
			CKEDITOR.dialog.addUIElement("radio", n);
			CKEDITOR.dialog.addUIElement("button", n);
			CKEDITOR.dialog.addUIElement("select", n);
			CKEDITOR.dialog.addUIElement("file", n);
			CKEDITOR.dialog.addUIElement("fileButton", n);
			CKEDITOR.dialog.addUIElement("html", n);
			CKEDITOR.dialog.addUIElement("fieldset", {
				build: function(b, a, d) {
					for (var f = a.children, c, e = [], h = [], g = 0; g < f.length && (c = f[g]); g++) {
						var k = [];
						e.push(k);
						h.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(b, c, k))
					}
					return new CKEDITOR.ui.dialog[a.type](b, h, e, d, a)
				}
			})
		}
	});
	CKEDITOR.DIALOG_RESIZE_NONE = 0;
	CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
	CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
	CKEDITOR.DIALOG_RESIZE_BOTH = 3;
	CKEDITOR.DIALOG_STATE_IDLE = 1;
	CKEDITOR.DIALOG_STATE_BUSY = 2;
	(function() {
		function x() {
			for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--) if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
			return null
		}

		function A() {
			for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++) if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
			return null
		}

		function K(a, b) {
			for (var c = a.$.getElementsByTagName("input"), d = 0, e = c.length; d < e; d++) {
				var f = new CKEDITOR.dom.element(c[d]);
				"text" == f.getAttribute("type").toLowerCase() && (b ? (f.setAttribute("value", f.getCustomData("fake_value") || ""), f.removeCustomData("fake_value")) : (f.setCustomData("fake_value", f.getAttribute("value")), f.setAttribute("value", "")))
			}
		}

		function T(a, b) {
			var c = this.getInputElement();
			c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0));
			a || (this.select ? this.select() : this.focus());
			b && alert(b);
			this.fire("validated", {
				valid: a,
				msg: b
			})
		}

		function U() {
			var a = this.getInputElement();
			a && a.removeAttribute("aria-invalid")
		}

		function V(a) {
			var b = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", W).output({
				id: CKEDITOR.tools.getNextNumber(),
				editorId: a.id,
				langDir: a.lang.dir,
				langCode: a.langCode,
				editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
				closeTitle: a.lang.common.close,
				hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
			})),
				c = b.getChild([0, 0, 0, 0, 0]),
				d = c.getChild(0),
				e = c.getChild(1);
			a.plugins.clipboard && CKEDITOR.plugins.clipboard.preventDefaultDropOnElement(c);
			!CKEDITOR.env.ie || CKEDITOR.env.quirks || CKEDITOR.env.edge || (a = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())", CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + a + '" tabIndex="-1"></iframe>').appendTo(c.getParent()));
			d.unselectable();
			e.unselectable();
			return {
				element: b,
				parts: {
					dialog: b.getChild(0),
					title: d,
					close: e,
					tabs: c.getChild(2),
					contents: c.getChild([3, 0, 0, 0]),
					footer: c.getChild([3, 0, 1, 0])
				}
			}
		}

		function L(a, b, c) {
			this.element = b;
			this.focusIndex = c;
			this.tabIndex = 0;
			this.isFocusable = function() {
				return !b.getAttribute("disabled") && b.isVisible()
			};
			this.focus = function() {
				a._.currentFocusIndex = this.focusIndex;
				this.element.focus()
			};
			b.on("keydown", function(a) {
				a.data.getKeystroke() in {
					32: 1,
					13: 1
				} && this.fire("click")
			});
			b.on("focus", function() {
				this.fire("mouseover")
			});
			b.on("blur", function() {
				this.fire("mouseout")
			})
		}

		function X(a) {
			function b() {
				a.layout()
			}
			var c = CKEDITOR.document.getWindow();
			c.on("resize", b);
			a.on("hide", function() {
				c.removeListener("resize", b)
			})
		}

		function M(a, b) {
			this._ = {
				dialog: a
			};
			CKEDITOR.tools.extend(this, b)
		}

		function Y(a) {
			function b(b) {
				var c = a.getSize(),
					k = CKEDITOR.document.getWindow().getViewPaneSize(),
					q = b.data.$.screenX,
					n = b.data.$.screenY,
					r = q - d.x,
					l = n - d.y;
				d = {
					x: q,
					y: n
				};
				e.x += r;
				e.y += l;
				a.move(e.x + h[3] < g ? -h[3] : e.x - h[1] > k.width - c.width - g ? k.width - c.width + ("rtl" == f.lang.dir ? 0 : h[1]) : e.x, e.y + h[0] < g ? -h[0] : e.y - h[2] > k.height - c.height - g ? k.height - c.height + h[2] : e.y, 1);
				b.data.preventDefault()
			}

			function c() {
				CKEDITOR.document.removeListener("mousemove", b);
				CKEDITOR.document.removeListener("mouseup", c);
				if (CKEDITOR.env.ie6Compat) {
					var a = u.getChild(0).getFrameDocument();
					a.removeListener("mousemove", b);
					a.removeListener("mouseup", c)
				}
			}
			var d = null,
				e = null,
				f = a.getParentEditor(),
				g = f.config.dialog_magnetDistance,
				h = CKEDITOR.skin.margins || [0, 0, 0, 0];
			"undefined" == typeof g && (g = 20);
			a.parts.title.on("mousedown", function(g) {
				d = {
					x: g.data.$.screenX,
					y: g.data.$.screenY
				};
				CKEDITOR.document.on("mousemove", b);
				CKEDITOR.document.on("mouseup", c);
				e = a.getPosition();
				if (CKEDITOR.env.ie6Compat) {
					var f = u.getChild(0).getFrameDocument();
					f.on("mousemove", b);
					f.on("mouseup", c)
				}
				g.data.preventDefault()
			}, a)
		}

		function Z(a) {
			function b(b) {
				var c = "rtl" == f.lang.dir,
					n = k.width,
					q = k.height,
					G = n + (b.data.$.screenX - m.x) * (c ? -1 : 1) * (a._.moved ? 1 : 2),
					H = q + (b.data.$.screenY - m.y) * (a._.moved ? 1 : 2),
					B = a._.element.getFirst(),
					B = c && B.getComputedStyle("right"),
					C = a.getPosition();
				C.y + H > p.height && (H = p.height - C.y);
				(c ? B : C.x) + G > p.width && (G = p.width - (c ? B : C.x));
				if (e == CKEDITOR.DIALOG_RESIZE_WIDTH || e == CKEDITOR.DIALOG_RESIZE_BOTH) n = Math.max(d.minWidth || 0, G - g);
				if (e == CKEDITOR.DIALOG_RESIZE_HEIGHT || e == CKEDITOR.DIALOG_RESIZE_BOTH) q = Math.max(d.minHeight || 0, H - h);
				a.resize(n, q);
				a._.moved || a.layout();
				b.data.preventDefault()
			}

			function c() {
				CKEDITOR.document.removeListener("mouseup", c);
				CKEDITOR.document.removeListener("mousemove", b);
				q && (q.remove(), q = null);
				if (CKEDITOR.env.ie6Compat) {
					var a = u.getChild(0).getFrameDocument();
					a.removeListener("mouseup", c);
					a.removeListener("mousemove", b)
				}
			}
			var d = a.definition,
				e = d.resizable;
			if (e != CKEDITOR.DIALOG_RESIZE_NONE) {
				var f = a.getParentEditor(),
					g, h, p, m, k, q, n = CKEDITOR.tools.addFunction(function(e) {
						k = a.getSize();
						var d = a.parts.contents;
						d.$.getElementsByTagName("iframe").length && (q = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'), d.append(q));
						h = k.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
						g = k.width - a.parts.contents.getSize("width", 1);
						m = {
							x: e.screenX,
							y: e.screenY
						};
						p = CKEDITOR.document.getWindow().getViewPaneSize();
						CKEDITOR.document.on("mousemove", b);
						CKEDITOR.document.on("mouseup", c);
						CKEDITOR.env.ie6Compat && (d = u.getChild(0).getFrameDocument(), d.on("mousemove", b), d.on("mouseup", c));
						e.preventDefault && e.preventDefault()
					});
				a.on("load", function() {
					var b = "";
					e == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : e == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
					b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + f.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(f.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + ("ltr" == f.lang.dir ? "◢" : "◣") + "</div>");
					a.parts.footer.append(b, 1)
				});
				f.on("destroy", function() {
					CKEDITOR.tools.removeFunction(n)
				})
			}
		}

		function I(a) {
			a.data.preventDefault(1)
		}

		function N(a) {
			var b = CKEDITOR.document.getWindow(),
				c = a.config,
				d = c.dialog_backgroundCoverColor || "white",
				e = c.dialog_backgroundCoverOpacity,
				f = c.baseFloatZIndex,
				c = CKEDITOR.tools.genKey(d, e, f),
				g = z[c];
			g ? g.show() : (f = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", f, "; top: 0px; left: 0px; ", CKEDITOR.env.ie6Compat ? "" : "background-color: " + d, '" class="cke_dialog_background_cover">'], CKEDITOR.env.ie6Compat && (d = "<html><body style=\\'background-color:" + d + ";\\'></body></html>", f.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:'), f.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + d + "' );document.close();") + "})())"), f.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')), f.push("</div>"), g = CKEDITOR.dom.element.createFromHtml(f.join("")), g.setOpacity(void 0 !== e ? e : .5), g.on("keydown", I), g.on("keypress", I), g.on("keyup", I), g.appendTo(CKEDITOR.document.getBody()), z[c] = g);
			a.focusManager.add(g);
			u = g;
			a = function() {
				var a = b.getViewPaneSize();
				g.setStyles({
					width: a.width + "px",
					height: a.height + "px"
				})
			};
			var h = function() {
					var a = b.getScrollPosition(),
						c = CKEDITOR.dialog._.currentTop;
					g.setStyles({
						left: a.x + "px",
						top: a.y + "px"
					});
					if (c) {
						do a = c.getPosition(), c.move(a.x, a.y);
						while (c = c._.parentDialog)
					}
				};
			J = a;
			b.on("resize", a);
			a();
			CKEDITOR.env.mac && CKEDITOR.env.webkit || g.focus();
			if (CKEDITOR.env.ie6Compat) {
				var p = function() {
						h();
						arguments.callee.prevScrollHandler.apply(this, arguments)
					};
				b.$.setTimeout(function() {
					p.prevScrollHandler = window.onscroll ||
					function() {};
					window.onscroll = p
				}, 0);
				h()
			}
		}

		function O(a) {
			u && (a.focusManager.remove(u), a = CKEDITOR.document.getWindow(), u.hide(), a.removeListener("resize", J), CKEDITOR.env.ie6Compat && a.$.setTimeout(function() {
				window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
			}, 0), J = null)
		}
		var v = CKEDITOR.tools.cssLength,
			W = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
		CKEDITOR.dialog = function(a, b) {
			function c() {
				var a = l._.focusList;
				a.sort(function(a, b) {
					return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
				});
				for (var b = a.length, c = 0; c < b; c++) a[c].focusIndex = c
			}

			function d(a) {
				var b = l._.focusList;
				a = a || 0;
				if (!(1 > b.length)) {
					var c = l._.currentFocusIndex;
					l._.tabBarMode && 0 > a && (c = 0);
					try {
						b[c].getInputElement().$.blur()
					} catch (e) {}
					var d = c,
						g = 1 < l._.pageCount;
					do {
						d += a;
						if (g && !l._.tabBarMode && (d == b.length || -1 == d)) {
							l._.tabBarMode = !0;
							l._.tabs[l._.currentTabId][0].focus();
							l._.currentFocusIndex = -1;
							return
						}
						d = (d + b.length) % b.length;
						if (d == c) break
					} while (a && !b[d].isFocusable());
					b[d].focus();
					"text" == b[d].type && b[d].select()
				}
			}

			function e(b) {
				if (l == CKEDITOR.dialog._.currentTop) {
					var c = b.data.getKeystroke(),
						e = "rtl" == a.lang.dir,
						g = [37, 38, 39, 40];
					q = n = 0;
					if (9 == c || c == CKEDITOR.SHIFT + 9) d(c == CKEDITOR.SHIFT + 9 ? -1 : 1), q = 1;
					else if (c == CKEDITOR.ALT + 121 && !l._.tabBarMode && 1 < l.getPageCount()) l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus(), l._.currentFocusIndex = -1, q = 1;
					else if (-1 != CKEDITOR.tools.indexOf(g, c) && l._.tabBarMode) c = -1 != CKEDITOR.tools.indexOf([e ? 39 : 37, 38], c) ? x.call(l) : A.call(l), l.selectPage(c), l._.tabs[c][0].focus(), q = 1;
					else if (13 != c && 32 != c || !l._.tabBarMode) if (13 == c) c = b.data.getTarget(), c.is("a", "button", "select", "textarea") || c.is("input") && "button" == c.$.type || ((c = this.getButton("ok")) && CKEDITOR.tools.setTimeout(c.click, 0, c), q = 1), n = 1;
					else if (27 == c)(c = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(c.click, 0, c) : !1 !== this.fire("cancel", {
						hide: !0
					}).hide && this.hide(), n = 1;
					else return;
					else this.selectPage(this._.currentTabId), this._.tabBarMode = !1, this._.currentFocusIndex = -1, d(1), q = 1;
					f(b)
				}
			}

			function f(a) {
				q ? a.data.preventDefault(1) : n && a.data.stopPropagation()
			}
			var g = CKEDITOR.dialog._.dialogDefinitions[b],
				h = CKEDITOR.tools.clone(aa),
				p = a.config.dialog_buttonsOrder || "OS",
				m = a.lang.dir,
				k = {},
				q, n;
			("OS" == p && CKEDITOR.env.mac || "rtl" == p && "ltr" == m || "ltr" == p && "rtl" == m) && h.buttons.reverse();
			g = CKEDITOR.tools.extend(g(a), h);
			g = CKEDITOR.tools.clone(g);
			g = new P(this, g);
			h = V(a);
			this._ = {
				editor: a,
				element: h.element,
				name: b,
				contentSize: {
					width: 0,
					height: 0
				},
				size: {
					width: 0,
					height: 0
				},
				contents: {},
				buttons: {},
				accessKeyMap: {},
				tabs: {},
				tabIdList: [],
				currentTabId: null,
				currentTabIndex: null,
				pageCount: 0,
				lastTab: null,
				tabBarMode: !1,
				focusList: [],
				currentFocusIndex: 0,
				hasFocus: !1
			};
			this.parts = h.parts;
			CKEDITOR.tools.setTimeout(function() {
				a.fire("ariaWidget", this.parts.contents)
			}, 0, this);
			h = {
				position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
				top: 0,
				visibility: "hidden"
			};
			h["rtl" == m ? "right" : "left"] = 0;
			this.parts.dialog.setStyles(h);
			CKEDITOR.event.call(this);
			this.definition = g = CKEDITOR.fire("dialogDefinition", {
				name: b,
				definition: g
			}, a).definition;
			if (!("removeDialogTabs" in a._) && a.config.removeDialogTabs) {
				h = a.config.removeDialogTabs.split(";");
				for (m = 0; m < h.length; m++) if (p = h[m].split(":"), 2 == p.length) {
					var r = p[0];
					k[r] || (k[r] = []);
					k[r].push(p[1])
				}
				a._.removeDialogTabs = k
			}
			if (a._.removeDialogTabs && (k = a._.removeDialogTabs[b])) for (m = 0; m < k.length; m++) g.removeContents(k[m]);
			if (g.onLoad) this.on("load", g.onLoad);
			if (g.onShow) this.on("show", g.onShow);
			if (g.onHide) this.on("hide", g.onHide);
			if (g.onOk) this.on("ok", function(b) {
				a.fire("saveSnapshot");
				setTimeout(function() {
					a.fire("saveSnapshot")
				}, 0);
				!1 === g.onOk.call(this, b) && (b.data.hide = !1)
			});
			this.state = CKEDITOR.DIALOG_STATE_IDLE;
			if (g.onCancel) this.on("cancel", function(a) {
				!1 === g.onCancel.call(this, a) && (a.data.hide = !1)
			});
			var l = this,
				t = function(a) {
					var b = l._.contents,
						c = !1,
						d;
					for (d in b) for (var e in b[d]) if (c = a.call(this, b[d][e])) return
				};
			this.on("ok", function(a) {
				t(function(b) {
					if (b.validate) {
						var c = b.validate(this),
							d = "string" == typeof c || !1 === c;
						d && (a.data.hide = !1, a.stop());
						T.call(b, !d, "string" == typeof c ? c : void 0);
						return d
					}
				})
			}, this, null, 0);
			this.on("cancel", function(b) {
				t(function(c) {
					if (c.isChanged()) return a.config.dialog_noConfirmCancel || confirm(a.lang.common.confirmCancel) || (b.data.hide = !1), !0
				})
			}, this, null, 0);
			this.parts.close.on("click", function(a) {
				!1 !== this.fire("cancel", {
					hide: !0
				}).hide && this.hide();
				a.data.preventDefault()
			}, this);
			this.changeFocus = d;
			var y = this._.element;
			a.focusManager.add(y, 1);
			this.on("show", function() {
				y.on("keydown", e, this);
				if (CKEDITOR.env.gecko) y.on("keypress", f, this)
			});
			this.on("hide", function() {
				y.removeListener("keydown", e);
				CKEDITOR.env.gecko && y.removeListener("keypress", f);
				t(function(a) {
					U.apply(a)
				})
			});
			this.on("iframeAdded", function(a) {
				(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", e, this, null, 0)
			});
			this.on("show", function() {
				c();
				var b = 1 < l._.pageCount;
				a.config.dialog_startupFocusTab && b ? (l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus(), l._.currentFocusIndex = -1) : this._.hasFocus || (this._.currentFocusIndex = b ? -1 : this._.focusList.length - 1, g.onFocus ? (b = g.onFocus.call(this)) && b.focus() : d(1))
			}, this, null, 4294967295);
			if (CKEDITOR.env.ie6Compat) this.on("load", function() {
				var a = this.getElement(),
					b = a.getFirst();
				b.remove();
				b.appendTo(a)
			}, this);
			Y(this);
			Z(this);
			(new CKEDITOR.dom.text(g.title, CKEDITOR.document)).appendTo(this.parts.title);
			for (m = 0; m < g.contents.length; m++)(k = g.contents[m]) && this.addPage(k);
			this.parts.tabs.on("click", function(a) {
				var b = a.data.getTarget();
				b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))), this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, d(1)), a.data.preventDefault())
			}, this);
			m = [];
			k = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
				type: "hbox",
				className: "cke_dialog_footer_buttons",
				widths: [],
				children: g.buttons
			}, m).getChild();
			this.parts.footer.setHtml(m.join(""));
			for (m = 0; m < k.length; m++) this._.buttons[k[m].id] = k[m]
		};
		CKEDITOR.dialog.prototype = {
			destroy: function() {
				this.hide();
				this._.element.remove()
			},
			resize: function() {
				return function(a, b) {
					this._.contentSize && this._.contentSize.width == a && this._.contentSize.height == b || (CKEDITOR.dialog.fire("resize", {
						dialog: this,
						width: a,
						height: b
					}, this._.editor), this.fire("resize", {
						width: a,
						height: b
					}, this._.editor), this.parts.contents.setStyles({
						width: a + "px",
						height: b + "px"
					}), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = {
						width: a,
						height: b
					})
				}
			}(),
			getSize: function() {
				var a = this._.element.getFirst();
				return {
					width: a.$.offsetWidth || 0,
					height: a.$.offsetHeight || 0
				}
			},
			move: function(a, b, c) {
				var d = this._.element.getFirst(),
					e = "rtl" == this._.editor.lang.dir,
					f = "fixed" == d.getComputedStyle("position");
				CKEDITOR.env.ie && d.setStyle("zoom", "100%");
				f && this._.position && this._.position.x == a && this._.position.y == b || (this._.position = {
					x: a,
					y: b
				}, f || (f = CKEDITOR.document.getWindow().getScrollPosition(), a += f.x, b += f.y), e && (f = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - f.width - a), b = {
					top: (0 < b ? b : 0) + "px"
				}, b[e ? "right" : "left"] = (0 < a ? a : 0) + "px", d.setStyles(b), c && (this._.moved = 1))
			},
			getPosition: function() {
				return CKEDITOR.tools.extend({}, this._.position)
			},
			show: function() {
				var a = this._.element,
					b = this.definition;
				a.getParent() && a.getParent().equals(CKEDITOR.document.getBody()) ? a.setStyle("display", "block") : a.appendTo(CKEDITOR.document.getBody());
				this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
				this.reset();
				this.selectPage(this.definition.contents[0].id);
				null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
				this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10);
				null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this, this._.parentDialog = null, N(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2), CKEDITOR.dialog._.currentTop = this);
				a.on("keydown", Q);
				a.on("keyup", R);
				this._.hasFocus = !1;
				for (var c in b.contents) if (b.contents[c]) {
					var a = b.contents[c],
						d = this._.tabs[a.id],
						e = a.requiredContent,
						f = 0;
					if (d) {
						for (var g in this._.contents[a.id]) {
							var h = this._.contents[a.id][g];
							"hbox" != h.type && "vbox" != h.type && h.getInputElement() && (h.requiredContent && !this._.editor.activeFilter.check(h.requiredContent) ? h.disable() : (h.enable(), f++))
						}!f || e && !this._.editor.activeFilter.check(e) ? d[0].addClass("cke_dialog_tab_disabled") : d[0].removeClass("cke_dialog_tab_disabled")
					}
				}
				CKEDITOR.tools.setTimeout(function() {
					this.layout();
					X(this);
					this.parts.dialog.setStyle("visibility", "");
					this.fireOnce("load", {});
					CKEDITOR.ui.fire("ready", this);
					this.fire("show", {});
					this._.editor.fire("dialogShow", this);
					this._.parentDialog || this._.editor.focusManager.lock();
					this.foreach(function(a) {
						a.setInitValue && a.setInitValue()
					})
				}, 100, this)
			},
			layout: function() {
				var a = this.parts.dialog,
					b = this.getSize(),
					c = CKEDITOR.document.getWindow().getViewPaneSize(),
					d = (c.width - b.width) / 2,
					e = (c.height - b.height) / 2;
				CKEDITOR.env.ie6Compat || (b.height + (0 < e ? e : 0) > c.height || b.width + (0 < d ? d : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
				this.move(this._.moved ? this._.position.x : d, this._.moved ? this._.position.y : e)
			},
			foreach: function(a) {
				for (var b in this._.contents) for (var c in this._.contents[b]) a.call(this, this._.contents[b][c]);
				return this
			},
			reset: function() {
				var a = function(a) {
						a.reset && a.reset(1)
					};
				return function() {
					this.foreach(a);
					return this
				}
			}(),
			setupContent: function() {
				var a = arguments;
				this.foreach(function(b) {
					b.setup && b.setup.apply(b, a)
				})
			},
			commitContent: function() {
				var a = arguments;
				this.foreach(function(b) {
					CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
					b.commit && b.commit.apply(b, a)
				})
			},
			hide: function() {
				if (this.parts.dialog.isVisible()) {
					this.fire("hide", {});
					this._.editor.fire("dialogHide", this);
					this.selectPage(this._.tabIdList[0]);
					var a = this._.element;
					a.setStyle("display", "none");
					this.parts.dialog.setStyle("visibility", "hidden");
					for (ba(this); CKEDITOR.dialog._.currentTop != this;) CKEDITOR.dialog._.currentTop.hide();
					if (this._.parentDialog) {
						var b = this._.parentDialog.getElement().getFirst();
						b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
					} else O(this._.editor);
					if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex -= 10;
					else {
						CKEDITOR.dialog._.currentZIndex = null;
						a.removeListener("keydown", Q);
						a.removeListener("keyup", R);
						var c = this._.editor;
						c.focus();
						setTimeout(function() {
							c.focusManager.unlock();
							CKEDITOR.env.iOS && c.window.focus()
						}, 0)
					}
					delete this._.parentDialog;
					this.foreach(function(a) {
						a.resetInitValue && a.resetInitValue()
					});
					this.setState(CKEDITOR.DIALOG_STATE_IDLE)
				}
			},
			addPage: function(a) {
				if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
					for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", d = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
						type: "vbox",
						className: "cke_dialog_page_contents",
						children: a.elements,
						expand: !! a.expand,
						padding: a.padding,
						style: a.style || "width: 100%;"
					}, b), e = this._.contents[a.id] = {}, f = d.getChild(), g = 0; d = f.shift();) d.notAllowed || "hbox" == d.type || "vbox" == d.type || g++, e[d.id] = d, "function" == typeof d.getChild && f.push.apply(f, d.getChild());
					g || (a.hidden = !0);
					b = CKEDITOR.dom.element.createFromHtml(b.join(""));
					b.setAttribute("role", "tabpanel");
					d = CKEDITOR.env;
					e = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
					c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', 0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', e, '"', d.gecko && !d.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
					b.setAttribute("aria-labelledby", e);
					this._.tabs[a.id] = [c, b];
					this._.tabIdList.push(a.id);
					!a.hidden && this._.pageCount++;
					this._.lastTab = c;
					this.updateStyle();
					b.setAttribute("name", a.id);
					b.appendTo(this.parts.contents);
					c.unselectable();
					this.parts.tabs.append(c);
					a.accessKey && (S(this, this, "CTRL+" + a.accessKey, ca, da), this._.accessKeyMap["CTRL+" + a.accessKey] = a.id)
				}
			},
			selectPage: function(a) {
				if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && !1 !== this.fire("selectPage", {
					page: a,
					currentPage: this._.currentTabId
				})) {
					for (var b in this._.tabs) {
						var c = this._.tabs[b][0],
							d = this._.tabs[b][1];
						b != a && (c.removeClass("cke_dialog_tab_selected"), d.hide());
						d.setAttribute("aria-hidden", b != a)
					}
					var e = this._.tabs[a];
					e[0].addClass("cke_dialog_tab_selected");
					CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ? (K(e[1]), e[1].show(), setTimeout(function() {
						K(e[1], 1)
					}, 0)) : e[1].show();
					this._.currentTabId = a;
					this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
				}
			},
			updateStyle: function() {
				this.parts.dialog[(1 === this._.pageCount ? "add" : "remove") + "Class"]("cke_single_page")
			},
			hidePage: function(a) {
				var b = this._.tabs[a] && this._.tabs[a][0];
				b && 1 != this._.pageCount && b.isVisible() && (a == this._.currentTabId && this.selectPage(x.call(this)), b.hide(), this._.pageCount--, this.updateStyle())
			},
			showPage: function(a) {
				if (a = this._.tabs[a] && this._.tabs[a][0]) a.show(), this._.pageCount++, this.updateStyle()
			},
			getElement: function() {
				return this._.element
			},
			getName: function() {
				return this._.name
			},
			getContentElement: function(a, b) {
				var c = this._.contents[a];
				return c && c[b]
			},
			getValueOf: function(a, b) {
				return this.getContentElement(a, b).getValue()
			},
			setValueOf: function(a, b, c) {
				return this.getContentElement(a, b).setValue(c)
			},
			getButton: function(a) {
				return this._.buttons[a]
			},
			click: function(a) {
				return this._.buttons[a].click()
			},
			disableButton: function(a) {
				return this._.buttons[a].disable()
			},
			enableButton: function(a) {
				return this._.buttons[a].enable()
			},
			getPageCount: function() {
				return this._.pageCount
			},
			getParentEditor: function() {
				return this._.editor
			},
			getSelectedElement: function() {
				return this.getParentEditor().getSelection().getSelectedElement()
			},
			addFocusable: function(a, b) {
				if ("undefined" == typeof b) b = this._.focusList.length, this._.focusList.push(new L(this, a, b));
				else {
					this._.focusList.splice(b, 0, new L(this, a, b));
					for (var c = b + 1; c < this._.focusList.length; c++) this._.focusList[c].focusIndex++
				}
			},
			setState: function(a) {
				if (this.state != a) {
					this.state = a;
					if (a == CKEDITOR.DIALOG_STATE_BUSY) {
						if (!this.parts.spinner) {
							var b = this.getParentEditor().lang.dir,
								c = {
									attributes: {
										"class": "cke_dialog_spinner"
									},
									styles: {
										"float": "rtl" == b ? "right" : "left"
									}
								};
							c.styles["margin-" + ("rtl" == b ? "left" : "right")] = "8px";
							this.parts.spinner = CKEDITOR.document.createElement("div", c);
							this.parts.spinner.setHtml("&#8987;");
							this.parts.spinner.appendTo(this.parts.title, 1)
						}
						this.parts.spinner.show();
						this.getButton("ok").disable()
					} else a == CKEDITOR.DIALOG_STATE_IDLE && (this.parts.spinner && this.parts.spinner.hide(), this.getButton("ok").enable());
					this.fire("state", a)
				}
			}
		};
		CKEDITOR.tools.extend(CKEDITOR.dialog, {
			add: function(a, b) {
				this._.dialogDefinitions[a] && "function" != typeof b || (this._.dialogDefinitions[a] = b)
			},
			exists: function(a) {
				return !!this._.dialogDefinitions[a]
			},
			getCurrent: function() {
				return CKEDITOR.dialog._.currentTop
			},
			isTabEnabled: function(a, b, c) {
				a = a.config.removeDialogTabs;
				return !(a && a.match(new RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
			},
			okButton: function() {
				var a = function(a, c) {
						c = c || {};
						return CKEDITOR.tools.extend({
							id: "ok",
							type: "button",
							label: a.lang.common.ok,
							"class": "cke_dialog_ui_button_ok",
							onClick: function(a) {
								a = a.data.dialog;
								!1 !== a.fire("ok", {
									hide: !0
								}).hide && a.hide()
							}
						}, c, !0)
					};
				a.type = "button";
				a.override = function(b) {
					return CKEDITOR.tools.extend(function(c) {
						return a(c, b)
					}, {
						type: "button"
					}, !0)
				};
				return a
			}(),
			cancelButton: function() {
				var a = function(a, c) {
						c = c || {};
						return CKEDITOR.tools.extend({
							id: "cancel",
							type: "button",
							label: a.lang.common.cancel,
							"class": "cke_dialog_ui_button_cancel",
							onClick: function(a) {
								a = a.data.dialog;
								!1 !== a.fire("cancel", {
									hide: !0
								}).hide && a.hide()
							}
						}, c, !0)
					};
				a.type = "button";
				a.override = function(b) {
					return CKEDITOR.tools.extend(function(c) {
						return a(c, b)
					}, {
						type: "button"
					}, !0)
				};
				return a
			}(),
			addUIElement: function(a, b) {
				this._.uiElementBuilders[a] = b
			}
		});
		CKEDITOR.dialog._ = {
			uiElementBuilders: {},
			dialogDefinitions: {},
			currentTop: null,
			currentZIndex: null
		};
		CKEDITOR.event.implementOn(CKEDITOR.dialog);
		CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
		var aa = {
			resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
			minWidth: 600,
			minHeight: 400,
			buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
		},
			D = function(a, b, c) {
				for (var d = 0, e; e = a[d]; d++) if (e.id == b || c && e[c] && (e = D(e[c], b, c))) return e;
				return null
			},
			E = function(a, b, c, d, e) {
				if (c) {
					for (var f = 0, g; g = a[f]; f++) {
						if (g.id == c) return a.splice(f, 0, b), b;
						if (d && g[d] && (g = E(g[d], b, c, d, !0))) return g
					}
					if (e) return null
				}
				a.push(b);
				return b
			},
			F = function(a, b, c) {
				for (var d = 0, e; e = a[d]; d++) {
					if (e.id == b) return a.splice(d, 1);
					if (c && e[c] && (e = F(e[c], b, c))) return e
				}
				return null
			},
			P = function(a, b) {
				this.dialog = a;
				for (var c = b.contents, d = 0, e; e = c[d]; d++) c[d] = e && new M(a, e);
				CKEDITOR.tools.extend(this, b)
			};
		P.prototype = {
			getContents: function(a) {
				return D(this.contents, a)
			},
			getButton: function(a) {
				return D(this.buttons, a)
			},
			addContents: function(a, b) {
				return E(this.contents, a, b)
			},
			addButton: function(a, b) {
				return E(this.buttons, a, b)
			},
			removeContents: function(a) {
				F(this.contents, a)
			},
			removeButton: function(a) {
				F(this.buttons, a)
			}
		};
		M.prototype = {
			get: function(a) {
				return D(this.elements, a, "children")
			},
			add: function(a, b) {
				return E(this.elements, a, b, "children")
			},
			remove: function(a) {
				F(this.elements, a, "children")
			}
		};
		var J, z = {},
			u, w = {},
			Q = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey,
					c = a.data.$.altKey,
					d = a.data.$.shiftKey,
					e = String.fromCharCode(a.data.$.keyCode);
				(b = w[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key), a.data.preventDefault())
			},
			R = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey,
					c = a.data.$.altKey,
					d = a.data.$.shiftKey,
					e = String.fromCharCode(a.data.$.keyCode);
				(b = w[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()))
			},
			S = function(a, b, c, d, e) {
				(w[c] || (w[c] = [])).push({
					uiElement: a,
					dialog: b,
					key: c,
					keyup: e || a.accessKeyUp,
					keydown: d || a.accessKeyDown
				})
			},
			ba = function(a) {
				for (var b in w) {
					for (var c = w[b], d = c.length - 1; 0 <= d; d--) c[d].dialog != a && c[d].uiElement != a || c.splice(d, 1);
					0 === c.length && delete w[b]
				}
			},
			da = function(a, b) {
				a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
			},
			ca = function() {};
		(function() {
			CKEDITOR.ui.dialog = {
				uiElement: function(a, b, c, d, e, f, g) {
					if (!(4 > arguments.length)) {
						var h = (d.call ? d(b) : d) || "div",
							p = ["<", h, " "],
							m = (e && e.call ? e(b) : e) || {},
							k = (f && f.call ? f(b) : f) || {},
							q = (g && g.call ? g.call(this, a, b) : g) || "",
							n = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
						b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) && (m.display = "none", this.notAllowed = !0);
						k.id = n;
						var r = {};
						b.type && (r["cke_dialog_ui_" + b.type] = 1);
						b.className && (r[b.className] = 1);
						b.disabled && (r.cke_disabled = 1);
						for (var l = k["class"] && k["class"].split ? k["class"].split(" ") : [], n = 0; n < l.length; n++) l[n] && (r[l[n]] = 1);
						l = [];
						for (n in r) l.push(n);
						k["class"] = l.join(" ");
						b.title && (k.title = b.title);
						r = (b.style || "").split(";");
						b.align && (l = b.align, m["margin-left"] = "left" == l ? 0 : "auto", m["margin-right"] = "right" == l ? 0 : "auto");
						for (n in m) r.push(n + ":" + m[n]);
						b.hidden && r.push("display:none");
						for (n = r.length - 1; 0 <= n; n--)"" === r[n] && r.splice(n, 1);
						0 < r.length && (k.style = (k.style ? k.style + "; " : "") + r.join("; "));
						for (n in k) p.push(n + '="' + CKEDITOR.tools.htmlEncode(k[n]) + '" ');
						p.push(">", q, "</", h, ">");
						c.push(p.join(""));
						(this._ || (this._ = {})).dialog = a;
						"boolean" == typeof b.isChanged && (this.isChanged = function() {
							return b.isChanged
						});
						"function" == typeof b.isChanged && (this.isChanged = b.isChanged);
						"function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function(a) {
							return function(c) {
								a.call(this, b.setValue.call(this, c))
							}
						}));
						"function" == typeof b.getValue && (this.getValue = CKEDITOR.tools.override(this.getValue, function(a) {
							return function() {
								return b.getValue.call(this, a.call(this))
							}
						}));
						CKEDITOR.event.implementOn(this);
						this.registerEvents(b);
						this.accessKeyUp && this.accessKeyDown && b.accessKey && S(this, a, "CTRL+" + b.accessKey);
						var t = this;
						a.on("load", function() {
							var b = t.getInputElement();
							if (b) {
								var c = t.type in {
									checkbox: 1,
									ratio: 1
								} && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? "cke_dialog_ui_focused" : "";
								b.on("focus", function() {
									a._.tabBarMode = !1;
									a._.hasFocus = !0;
									t.fire("focus");
									c && this.addClass(c)
								});
								b.on("blur", function() {
									t.fire("blur");
									c && this.removeClass(c)
								})
							}
						});
						CKEDITOR.tools.extend(this, b);
						this.keyboardFocusable && (this.tabIndex = b.tabIndex || 0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function() {
							a._.currentFocusIndex = t.focusIndex
						}))
					}
				},
				hbox: function(a, b, c, d, e) {
					if (!(4 > arguments.length)) {
						this._ || (this._ = {});
						var f = this._.children = b,
							g = e && e.widths || null,
							h = e && e.height || null,
							p, m = {
								role: "presentation"
							};
						e && e.align && (m.align = e.align);
						CKEDITOR.ui.dialog.uiElement.call(this, a, e || {
							type: "hbox"
						}, d, "table", {}, m, function() {
							var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
							for (p = 0; p < c.length; p++) {
								var b = "cke_dialog_ui_hbox_child",
									d = [];
								0 === p && (b = "cke_dialog_ui_hbox_first");
								p == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
								a.push('<td class="', b, '" role="presentation" ');
								g ? g[p] && d.push("width:" + v(g[p])) : d.push("width:" + Math.floor(100 / c.length) + "%");
								h && d.push("height:" + v(h));
								e && void 0 !== e.padding && d.push("padding:" + v(e.padding));
								CKEDITOR.env.ie && CKEDITOR.env.quirks && f[p].align && d.push("text-align:" + f[p].align);
								0 < d.length && a.push('style="' + d.join("; ") + '" ');
								a.push(">", c[p], "</td>")
							}
							a.push("</tr></tbody>");
							return a.join("")
						})
					}
				},
				vbox: function(a, b, c, d, e) {
					if (!(3 > arguments.length)) {
						this._ || (this._ = {});
						var f = this._.children = b,
							g = e && e.width || null,
							h = e && e.heights || null;
						CKEDITOR.ui.dialog.uiElement.call(this, a, e || {
							type: "vbox"
						}, d, "div", null, {
							role: "presentation"
						}, function() {
							var b = ['<table role="presentation" cellspacing="0" border="0" '];
							b.push('style="');
							e && e.expand && b.push("height:100%;");
							b.push("width:" + v(g || "100%"), ";");
							CKEDITOR.env.webkit && b.push("float:none;");
							b.push('"');
							b.push('align="', CKEDITOR.tools.htmlEncode(e && e.align || ("ltr" == a.getParentEditor().lang.dir ? "left" : "right")), '" ');
							b.push("><tbody>");
							for (var d = 0; d < c.length; d++) {
								var k = [];
								b.push('<tr><td role="presentation" ');
								g && k.push("width:" + v(g || "100%"));
								h ? k.push("height:" + v(h[d])) : e && e.expand && k.push("height:" + Math.floor(100 / c.length) + "%");
								e && void 0 !== e.padding && k.push("padding:" + v(e.padding));
								CKEDITOR.env.ie && CKEDITOR.env.quirks && f[d].align && k.push("text-align:" + f[d].align);
								0 < k.length && b.push('style="', k.join("; "), '" ');
								b.push(' class="cke_dialog_ui_vbox_child">', c[d], "</td></tr>")
							}
							b.push("</tbody></table>");
							return b.join("")
						})
					}
				}
			}
		})();
		CKEDITOR.ui.dialog.uiElement.prototype = {
			getElement: function() {
				return CKEDITOR.document.getById(this.domId)
			},
			getInputElement: function() {
				return this.getElement()
			},
			getDialog: function() {
				return this._.dialog
			},
			setValue: function(a, b) {
				this.getInputElement().setValue(a);
				!b && this.fire("change", {
					value: a
				});
				return this
			},
			getValue: function() {
				return this.getInputElement().getValue()
			},
			isChanged: function() {
				return !1
			},
			selectParentTab: function() {
				for (var a = this.getInputElement();
				(a = a.getParent()) && -1 == a.$.className.search("cke_dialog_page_contents"););
				if (!a) return this;
				a = a.getAttribute("name");
				this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
				return this
			},
			focus: function() {
				this.selectParentTab().getInputElement().focus();
				return this
			},
			registerEvents: function(a) {
				var b = /^on([A-Z]\w+)/,
					c, d = function(a, b, c, d) {
						b.on("load", function() {
							a.getInputElement().on(c, d, a)
						})
					},
					e;
				for (e in a) if (c = e.match(b)) this.eventProcessors[e] ? this.eventProcessors[e].call(this, this._.dialog, a[e]) : d(this, this._.dialog, c[1].toLowerCase(), a[e]);
				return this
			},
			eventProcessors: {
				onLoad: function(a, b) {
					a.on("load", b, this)
				},
				onShow: function(a, b) {
					a.on("show", b, this)
				},
				onHide: function(a, b) {
					a.on("hide", b, this)
				}
			},
			accessKeyDown: function() {
				this.focus()
			},
			accessKeyUp: function() {},
			disable: function() {
				var a = this.getElement();
				this.getInputElement().setAttribute("disabled", "true");
				a.addClass("cke_disabled")
			},
			enable: function() {
				var a = this.getElement();
				this.getInputElement().removeAttribute("disabled");
				a.removeClass("cke_disabled")
			},
			isEnabled: function() {
				return !this.getElement().hasClass("cke_disabled")
			},
			isVisible: function() {
				return this.getInputElement().isVisible()
			},
			isFocusable: function() {
				return this.isEnabled() && this.isVisible() ? !0 : !1
			}
		};
		CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
			getChild: function(a) {
				if (1 > arguments.length) return this._.children.concat();
				a.splice || (a = [a]);
				return 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
			}
		}, !0);
		CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
		(function() {
			var a = {
				build: function(a, c, d) {
					for (var e = c.children, f, g = [], h = [], p = 0; p < e.length && (f = e[p]); p++) {
						var m = [];
						g.push(m);
						h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, m))
					}
					return new CKEDITOR.ui.dialog[c.type](a, h, g, d, c)
				}
			};
			CKEDITOR.dialog.addUIElement("hbox", a);
			CKEDITOR.dialog.addUIElement("vbox", a)
		})();
		CKEDITOR.dialogCommand = function(a, b) {
			this.dialogName = a;
			CKEDITOR.tools.extend(this, b, !0)
		};
		CKEDITOR.dialogCommand.prototype = {
			exec: function(a) {
				a.openDialog(this.dialogName)
			},
			canUndo: !1,
			editorFocus: 1
		};
		(function() {
			var a = /^([a]|[^a])+$/,
				b = /^\d*$/,
				c = /^\d*(?:\.\d+)?$/,
				d = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
				e = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
				f = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
			CKEDITOR.VALIDATE_OR = 1;
			CKEDITOR.VALIDATE_AND = 2;
			CKEDITOR.dialog.validate = {
				functions: function() {
					var a = arguments;
					return function() {
						var b = this && this.getValue ? this.getValue() : a[0],
							c, d = CKEDITOR.VALIDATE_AND,
							e = [],
							f;
						for (f = 0; f < a.length; f++) if ("function" == typeof a[f]) e.push(a[f]);
						else break;
						f < a.length && "string" == typeof a[f] && (c = a[f], f++);
						f < a.length && "number" == typeof a[f] && (d = a[f]);
						var n = d == CKEDITOR.VALIDATE_AND ? !0 : !1;
						for (f = 0; f < e.length; f++) n = d == CKEDITOR.VALIDATE_AND ? n && e[f](b) : n || e[f](b);
						return n ? !0 : c
					}
				},
				regex: function(a, b) {
					return function(c) {
						c = this && this.getValue ? this.getValue() : c;
						return a.test(c) ? !0 : b
					}
				},
				notEmpty: function(b) {
					return this.regex(a, b)
				},
				integer: function(a) {
					return this.regex(b, a)
				},
				number: function(a) {
					return this.regex(c, a)
				},
				cssLength: function(a) {
					return this.functions(function(a) {
						return e.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				htmlLength: function(a) {
					return this.functions(function(a) {
						return d.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				inlineStyle: function(a) {
					return this.functions(function(a) {
						return f.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				equals: function(a, b) {
					return this.functions(function(b) {
						return b == a
					}, b)
				},
				notEqual: function(a, b) {
					return this.functions(function(b) {
						return b != a
					}, b)
				}
			};
			CKEDITOR.on("instanceDestroyed", function(a) {
				if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
					for (var b; b = CKEDITOR.dialog._.currentTop;) b.hide();
					for (var c in z) z[c].remove();
					z = {}
				}
				a = a.editor._.storedDialogs;
				for (var d in a) a[d].destroy()
			})
		})();
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			openDialog: function(a, b) {
				var c = null,
					d = CKEDITOR.dialog._.dialogDefinitions[a];
				null === CKEDITOR.dialog._.currentTop && N(this);
				if ("function" == typeof d) c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c, c), c.show();
				else {
					if ("failed" == d) throw O(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
					"string" == typeof d && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d), function() {
						"function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
						this.openDialog(a, b)
					}, this, 0, 1)
				}
				CKEDITOR.skin.loadPart("dialog");
				return c
			}
		})
	})();
	CKEDITOR.plugins.add("dialog", {
		requires: "dialogui",
		init: function(x) {
			x.on("doubleclick", function(A) {
				A.data.dialog && x.openDialog(A.data.dialog)
			}, null, null, 999)
		}
	});
	CKEDITOR.plugins.add("about", {
		requires: "dialog",
		init: function(a) {
			var b = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
			b.modes = {
				wysiwyg: 1,
				source: 1
			};
			b.canUndo = !1;
			b.readOnly = 1;
			a.ui.addButton && a.ui.addButton("About", {
				label: a.lang.about.title,
				command: "about",
				toolbar: "about"
			});
			CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
		}
	});
	(function() {
		CKEDITOR.plugins.add("a11yhelp", {
			requires: "dialog",
			availableLangs: {
				af: 1,
				ar: 1,
				bg: 1,
				ca: 1,
				cs: 1,
				cy: 1,
				da: 1,
				de: 1,
				"de-ch": 1,
				el: 1,
				en: 1,
				"en-gb": 1,
				eo: 1,
				es: 1,
				et: 1,
				eu: 1,
				fa: 1,
				fi: 1,
				fo: 1,
				fr: 1,
				"fr-ca": 1,
				gl: 1,
				gu: 1,
				he: 1,
				hi: 1,
				hr: 1,
				hu: 1,
				id: 1,
				it: 1,
				ja: 1,
				km: 1,
				ko: 1,
				ku: 1,
				lt: 1,
				lv: 1,
				mk: 1,
				mn: 1,
				nb: 1,
				nl: 1,
				no: 1,
				pl: 1,
				pt: 1,
				"pt-br": 1,
				ro: 1,
				ru: 1,
				si: 1,
				sk: 1,
				sl: 1,
				sq: 1,
				sr: 1,
				"sr-latn": 1,
				sv: 1,
				th: 1,
				tr: 1,
				tt: 1,
				ug: 1,
				uk: 1,
				vi: 1,
				zh: 1,
				"zh-cn": 1
			},
			init: function(b) {
				var c = this;
				b.addCommand("a11yHelp", {
					exec: function() {
						var a = b.langCode,
							a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/, "")] ? a.replace(/-.*/, "") : "en";
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function() {
							b.lang.a11yhelp = c.langEntries[a];
							b.openDialog("a11yHelp")
						})
					},
					modes: {
						wysiwyg: 1,
						source: 1
					},
					readOnly: 1,
					canUndo: !1
				});
				b.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
				CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js");
				b.on("ariaEditorHelpLabel", function(a) {
					a.data.label = b.lang.common.editorHelp
				})
			}
		})
	})();
	(function() {
		function f(c) {
			var a = this.att;
			c = c && c.hasAttribute(a) && c.getAttribute(a) || "";
			void 0 !== c && this.setValue(c)
		}

		function g() {
			for (var c, a = 0; a < arguments.length; a++) if (arguments[a] instanceof CKEDITOR.dom.element) {
				c = arguments[a];
				break
			}
			if (c) {
				var a = this.att,
					b = this.getValue();
				b ? c.setAttribute(a, b) : c.removeAttribute(a, b)
			}
		}
		var k = {
			id: 1,
			dir: 1,
			classes: 1,
			styles: 1
		};
		CKEDITOR.plugins.add("dialogadvtab", {
			requires: "dialog",
			allowedContent: function(c) {
				c || (c = k);
				var a = [];
				c.id && a.push("id");
				c.dir && a.push("dir");
				var b = "";
				a.length && (b += "[" + a.join(",") + "]");
				c.classes && (b += "(*)");
				c.styles && (b += "{*}");
				return b
			},
			createAdvancedTab: function(c, a, b) {
				a || (a = k);
				var d = c.lang.common,
					h = {
						id: "advanced",
						label: d.advancedTab,
						title: d.advancedTab,
						elements: [{
							type: "vbox",
							padding: 1,
							children: []
						}]
					},
					e = [];
				if (a.id || a.dir) a.id && e.push({
					id: "advId",
					att: "id",
					type: "text",
					requiredContent: b ? b + "[id]" : null,
					label: d.id,
					setup: f,
					commit: g
				}), a.dir && e.push({
					id: "advLangDir",
					att: "dir",
					type: "select",
					requiredContent: b ? b + "[dir]" : null,
					label: d.langDir,
					"default": "",
					style: "width:100%",
					items: [
						[d.notSet, ""],
						[d.langDirLTR, "ltr"],
						[d.langDirRTL, "rtl"]
					],
					setup: f,
					commit: g
				}), h.elements[0].children.push({
					type: "hbox",
					widths: ["50%", "50%"],
					children: [].concat(e)
				});
				if (a.styles || a.classes) e = [], a.styles && e.push({
					id: "advStyles",
					att: "style",
					type: "text",
					requiredContent: b ? b + "{cke-xyz}" : null,
					label: d.styles,
					"default": "",
					validate: CKEDITOR.dialog.validate.inlineStyle(d.invalidInlineStyle),
					onChange: function() {},
					getStyle: function(a, c) {
						var b = this.getValue().match(new RegExp("(?:^|;)\\s*" + a + "\\s*:\\s*([^;]*)", "i"));
						return b ? b[1] : c
					},
					updateStyle: function(a, b) {
						var d = this.getValue(),
							e = c.document.createElement("span");
						e.setAttribute("style", d);
						e.setStyle(a, b);
						d = CKEDITOR.tools.normalizeCssText(e.getAttribute("style"));
						this.setValue(d, 1)
					},
					setup: f,
					commit: g
				}), a.classes && e.push({
					type: "hbox",
					widths: ["45%", "55%"],
					children: [{
						id: "advCSSClasses",
						att: "class",
						type: "text",
						requiredContent: b ? b + "(cke-xyz)" : null,
						label: d.cssClasses,
						"default": "",
						setup: f,
						commit: g
					}]
				}), h.elements[0].children.push({
					type: "hbox",
					widths: ["50%", "50%"],
					children: [].concat(e)
				});
				return h
			}
		})
	})();
	CKEDITOR.plugins.add("basicstyles", {
		init: function(c) {
			var e = 0,
				d = function(g, d, b, a) {
					if (a) {
						a = new CKEDITOR.style(a);
						var f = h[b];
						f.unshift(a);
						c.attachStyleStateChange(a, function(a) {
							!c.readOnly && c.getCommand(b).setState(a)
						});
						c.addCommand(b, new CKEDITOR.styleCommand(a, {
							contentForms: f
						}));
						c.ui.addButton && c.ui.addButton(g, {
							label: d,
							command: b,
							toolbar: "basicstyles," + (e += 10)
						})
					}
				},
				h = {
					bold: ["strong", "b", ["span", function(a) {
						a = a.styles["font-weight"];
						return "bold" == a || 700 <= +a
					}]],
					italic: ["em", "i", ["span", function(a) {
						return "italic" == a.styles["font-style"]
					}]],
					underline: ["u", ["span", function(a) {
						return "underline" == a.styles["text-decoration"]
					}]],
					strike: ["s", "strike", ["span", function(a) {
						return "line-through" == a.styles["text-decoration"]
					}]],
					subscript: ["sub"],
					superscript: ["sup"]
				},
				b = c.config,
				a = c.lang.basicstyles;
			d("Bold", a.bold, "bold", b.coreStyles_bold);
			d("Italic", a.italic, "italic", b.coreStyles_italic);
			d("Underline", a.underline, "underline", b.coreStyles_underline);
			d("Strike", a.strike, "strike", b.coreStyles_strike);
			d("Subscript", a.subscript, "subscript", b.coreStyles_subscript);
			d("Superscript", a.superscript, "superscript", b.coreStyles_superscript);
			c.setKeystroke([
				[CKEDITOR.CTRL + 66, "bold"],
				[CKEDITOR.CTRL + 73, "italic"],
				[CKEDITOR.CTRL + 85, "underline"]
			])
		}
	});
	CKEDITOR.config.coreStyles_bold = {
		element: "strong",
		overrides: "b"
	};
	CKEDITOR.config.coreStyles_italic = {
		element: "em",
		overrides: "i"
	};
	CKEDITOR.config.coreStyles_underline = {
		element: "u"
	};
	CKEDITOR.config.coreStyles_strike = {
		element: "s",
		overrides: "strike"
	};
	CKEDITOR.config.coreStyles_subscript = {
		element: "sub"
	};
	CKEDITOR.config.coreStyles_superscript = {
		element: "sup"
	};
	(function() {
		function q(a, f, d, b) {
			if (!a.isReadOnly() && !a.equals(d.editable())) {
				CKEDITOR.dom.element.setMarker(b, a, "bidi_processed", 1);
				b = a;
				for (var c = d.editable();
				(b = b.getParent()) && !b.equals(c);) if (b.getCustomData("bidi_processed")) {
					a.removeStyle("direction");
					a.removeAttribute("dir");
					return
				}
				b = "useComputedState" in d.config ? d.config.useComputedState : 1;
				(b ? a.getComputedStyle("direction") : a.getStyle("direction") || a.hasAttribute("dir")) != f && (a.removeStyle("direction"), b ? (a.removeAttribute("dir"), f != a.getComputedStyle("direction") && a.setAttribute("dir", f)) : a.setAttribute("dir", f), d.forceNextSelectionCheck())
			}
		}

		function v(a, f, d) {
			var b = a.getCommonAncestor(!1, !0);
			a = a.clone();
			a.enlarge(d == CKEDITOR.ENTER_BR ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
			if (a.checkBoundaryOfElement(b, CKEDITOR.START) && a.checkBoundaryOfElement(b, CKEDITOR.END)) {
				for (var c; b && b.type == CKEDITOR.NODE_ELEMENT && (c = b.getParent()) && 1 == c.getChildCount() && !(b.getName() in f);) b = c;
				return b.type == CKEDITOR.NODE_ELEMENT && b.getName() in f && b
			}
		}

		function p(a) {
			return {
				context: "p",
				allowedContent: {
					"h1 h2 h3 h4 h5 h6 table ul ol blockquote div tr p div li td": {
						propertiesOnly: !0,
						attributes: "dir"
					}
				},
				requiredContent: "p[dir]",
				refresh: function(a, d) {
					var b = a.config.useComputedState,
						c, b = void 0 === b || b;
					if (!b) {
						c = d.lastElement;
						for (var h = a.editable(); c && !(c.getName() in u || c.equals(h));) {
							var e = c.getParent();
							if (!e) break;
							c = e
						}
					}
					c = c || d.block || d.blockLimit;
					c.equals(a.editable()) && (h = a.getSelection().getRanges()[0].getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT && (c = h);
					c && (b = b ? c.getComputedStyle("direction") : c.getStyle("direction") || c.getAttribute("dir"), a.getCommand("bidirtl").setState("rtl" == b ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF), a.getCommand("bidiltr").setState("ltr" == b ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF));
					b = (d.block || d.blockLimit || a.editable()).getDirection(1);
					b != (a._.selDir || a.lang.dir) && (a._.selDir = b, a.fire("contentDirChanged", b))
				},
				exec: function(f) {
					var d = f.getSelection(),
						b = f.config.enterMode,
						c = d.getRanges();
					if (c && c.length) {
						for (var h = {}, e = d.createBookmarks(), c = c.createIterator(), g, l = 0; g = c.getNextRange(1);) {
							var k = g.getEnclosedNode();
							k && (!k || k.type == CKEDITOR.NODE_ELEMENT && k.getName() in r) || (k = v(g, t, b));
							k && q(k, a, f, h);
							var m = new CKEDITOR.dom.walker(g),
								n = e[l].startNode,
								p = e[l++].endNode;
							m.evaluator = function(a) {
								var c = b == CKEDITOR.ENTER_P ? "p" : "div",
									d;
								if (d = (a ? a.type == CKEDITOR.NODE_ELEMENT : !1) && a.getName() in t) {
									if (c = a.is(c)) c = (c = a.getParent()) ? c.type == CKEDITOR.NODE_ELEMENT : !1;
									d = !(c && a.getParent().is("blockquote"))
								}
								return !!(d && a.getPosition(n) & CKEDITOR.POSITION_FOLLOWING && (a.getPosition(p) & CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_CONTAINS) == CKEDITOR.POSITION_PRECEDING)
							};
							for (; k = m.next();) q(k, a, f, h);
							g = g.createIterator();
							for (g.enlargeBr = b != CKEDITOR.ENTER_BR; k = g.getNextParagraph(b == CKEDITOR.ENTER_P ? "p" : "div");) q(k, a, f, h)
						}
						CKEDITOR.dom.element.clearAllMarkers(h);
						f.forceNextSelectionCheck();
						d.selectBookmarks(e);
						f.focus()
					}
				}
			}
		}

		function w(a) {
			var f = a == l.setAttribute,
				d = a == l.removeAttribute,
				b = /\bdirection\s*:\s*(.*?)\s*(:?$|;)/;
			return function(c, h) {
				if (!this.isReadOnly()) {
					var e;
					if (e = c == (f || d ? "dir" : "direction") || "style" == c && (d || b.test(h))) {
						a: {
							e = this;
							for (var g = e.getDocument().getBody().getParent(); e;) {
								if (e.equals(g)) {
									e = !1;
									break a
								}
								e = e.getParent()
							}
							e = !0
						}
						e = !e
					}
					if (e && (e = this.getDirection(1), g = a.apply(this, arguments), e != this.getDirection(1))) return this.getDocument().fire("dirChanged", this), g
				}
				return a.apply(this, arguments)
			}
		}
		var t = {
			table: 1,
			ul: 1,
			ol: 1,
			blockquote: 1,
			div: 1
		},
			r = {},
			u = {};
		CKEDITOR.tools.extend(r, t, {
			tr: 1,
			p: 1,
			div: 1,
			li: 1
		});
		CKEDITOR.tools.extend(u, r, {
			td: 1
		});
		CKEDITOR.plugins.add("bidi", {
			init: function(a) {
				function f(b, c, d, e, f) {
					a.addCommand(d, new CKEDITOR.command(a, e));
					a.ui.addButton && a.ui.addButton(b, {
						label: c,
						command: d,
						toolbar: "bidi," + f
					})
				}
				if (!a.blockless) {
					var d = a.lang.bidi;
					f("BidiLtr", d.ltr, "bidiltr", p("ltr"), 10);
					f("BidiRtl", d.rtl, "bidirtl", p("rtl"), 20);
					a.on("contentDom", function() {
						a.document.on("dirChanged", function(b) {
							a.fire("dirChanged", {
								node: b.data,
								dir: b.data.getDirection(1)
							})
						})
					});
					a.on("contentDirChanged", function(b) {
						b = (a.lang.dir != b.data ? "add" : "remove") + "Class";
						var c = a.ui.space(a.config.toolbarLocation);
						if (c) c[b]("cke_mixed_dir_content")
					})
				}
			}
		});
		for (var l = CKEDITOR.dom.element.prototype, n = ["setStyle", "removeStyle", "setAttribute", "removeAttribute"], m = 0; m < n.length; m++) l[n[m]] = CKEDITOR.tools.override(l[n[m]], w)
	})();
	(function() {
		var m = {
			exec: function(g) {
				var a = g.getCommand("blockquote").state,
					k = g.getSelection(),
					c = k && k.getRanges()[0];
				if (c) {
					var h = k.createBookmarks();
					if (CKEDITOR.env.ie) {
						var e = h[0].startNode,
							b = h[0].endNode,
							d;
						if (e && "blockquote" == e.getParent().getName()) for (d = e; d = d.getNext();) if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
							e.move(d, !0);
							break
						}
						if (b && "blockquote" == b.getParent().getName()) for (d = b; d = d.getPrevious();) if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
							b.move(d);
							break
						}
					}
					var f = c.createIterator();
					f.enlargeBr = g.config.enterMode != CKEDITOR.ENTER_BR;
					if (a == CKEDITOR.TRISTATE_OFF) {
						for (e = []; a = f.getNextParagraph();) e.push(a);
						1 > e.length && (a = g.document.createElement(g.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), b = h.shift(), c.insertNode(a), a.append(new CKEDITOR.dom.text("﻿", g.document)), c.moveToBookmark(b), c.selectNodeContents(a), c.collapse(!0), b = c.createBookmark(), e.push(a), h.unshift(b));
						d = e[0].getParent();
						c = [];
						for (b = 0; b < e.length; b++) a = e[b], d = d.getCommonAncestor(a.getParent());
						for (a = {
							table: 1,
							tbody: 1,
							tr: 1,
							ol: 1,
							ul: 1
						}; a[d.getName()];) d = d.getParent();
						for (b = null; 0 < e.length;) {
							for (a = e.shift(); !a.getParent().equals(d);) a = a.getParent();
							a.equals(b) || c.push(a);
							b = a
						}
						for (; 0 < c.length;) if (a = c.shift(), "blockquote" == a.getName()) {
							for (b = new CKEDITOR.dom.documentFragment(g.document); a.getFirst();) b.append(a.getFirst().remove()), e.push(b.getLast());
							b.replace(a)
						} else e.push(a);
						c = g.document.createElement("blockquote");
						for (c.insertBefore(e[0]); 0 < e.length;) a = e.shift(), c.append(a)
					} else if (a == CKEDITOR.TRISTATE_ON) {
						b = [];
						for (d = {}; a = f.getNextParagraph();) {
							for (e = c = null; a.getParent();) {
								if ("blockquote" == a.getParent().getName()) {
									c = a.getParent();
									e = a;
									break
								}
								a = a.getParent()
							}
							c && e && !e.getCustomData("blockquote_moveout") && (b.push(e), CKEDITOR.dom.element.setMarker(d, e, "blockquote_moveout", !0))
						}
						CKEDITOR.dom.element.clearAllMarkers(d);
						a = [];
						e = [];
						for (d = {}; 0 < b.length;) f = b.shift(), c = f.getParent(), f.getPrevious() ? f.getNext() ? (f.breakParent(f.getParent()), e.push(f.getNext())) : f.remove().insertAfter(c) : f.remove().insertBefore(c), c.getCustomData("blockquote_processed") || (e.push(c), CKEDITOR.dom.element.setMarker(d, c, "blockquote_processed", !0)), a.push(f);
						CKEDITOR.dom.element.clearAllMarkers(d);
						for (b = e.length - 1; 0 <= b; b--) {
							c = e[b];
							a: {
								d = c;
								for (var f = 0, m = d.getChildCount(), l = void 0; f < m && (l = d.getChild(f)); f++) if (l.type == CKEDITOR.NODE_ELEMENT && l.isBlockBoundary()) {
									d = !1;
									break a
								}
								d = !0
							}
							d && c.remove()
						}
						if (g.config.enterMode == CKEDITOR.ENTER_BR) for (c = !0; a.length;) if (f = a.shift(), "div" == f.getName()) {
							b = new CKEDITOR.dom.documentFragment(g.document);
							!c || !f.getPrevious() || f.getPrevious().type == CKEDITOR.NODE_ELEMENT && f.getPrevious().isBlockBoundary() || b.append(g.document.createElement("br"));
							for (c = f.getNext() && !(f.getNext().type == CKEDITOR.NODE_ELEMENT && f.getNext().isBlockBoundary()); f.getFirst();) f.getFirst().remove().appendTo(b);
							c && b.append(g.document.createElement("br"));
							b.replace(f);
							c = !1
						}
					}
					k.selectBookmarks(h);
					g.focus()
				}
			},
			refresh: function(g, a) {
				this.setState(g.elementPath(a.block || a.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
			},
			context: "blockquote",
			allowedContent: "blockquote",
			requiredContent: "blockquote"
		};
		CKEDITOR.plugins.add("blockquote", {
			init: function(g) {
				g.blockless || (g.addCommand("blockquote", m), g.ui.addButton && g.ui.addButton("Blockquote", {
					label: g.lang.blockquote.toolbar,
					command: "blockquote",
					toolbar: "blocks,10"
				}))
			}
		})
	})();
	(function() {
		function r(b, a, c) {
			a.type || (a.type = "auto");
			if (c && !1 === b.fire("beforePaste", a) || !a.dataValue && a.dataTransfer.isEmpty()) return !1;
			a.dataValue || (a.dataValue = "");
			if (CKEDITOR.env.gecko && "drop" == a.method && b.toolbox) b.once("afterPaste", function() {
				b.toolbox.focus()
			});
			return b.fire("paste", a)
		}

		function y(b) {
			function a() {
				var a = b.editable();
				if (CKEDITOR.plugins.clipboard.isCustomCopyCutSupported) {
					var d = function(a) {
							b.readOnly && "cut" == a.name || n.initPasteDataTransfer(a, b);
							a.data.preventDefault()
						};
					a.on("copy", d);
					a.on("cut", d);
					a.on("cut", function() {
						b.readOnly || b.extractSelectedHtml()
					}, null, null, 999)
				}
				a.on(n.mainPasteEvent, function(b) {
					"beforepaste" == n.mainPasteEvent && p || k(b)
				});
				"beforepaste" == n.mainPasteEvent && (a.on("paste", function(a) {
					v || (e(), a.data.preventDefault(), k(a), f("paste") || b.openDialog("paste"))
				}), a.on("contextmenu", g, null, null, 0), a.on("beforepaste", function(b) {
					!b.data || b.data.$.ctrlKey || b.data.$.shiftKey || g()
				}, null, null, 0));
				a.on("beforecut", function() {
					!p && h(b)
				});
				var c;
				a.attachListener(CKEDITOR.env.ie ? a : b.document.getDocumentElement(), "mouseup", function() {
					c = setTimeout(function() {
						t()
					}, 0)
				});
				b.on("destroy", function() {
					clearTimeout(c)
				});
				a.on("keyup", t)
			}

			function c(a) {
				return {
					type: a,
					canUndo: "cut" == a,
					startDisabled: !0,
					exec: function() {
						"cut" == this.type && h();
						var a;
						var d = this.type;
						if (CKEDITOR.env.ie) a = f(d);
						else try {
							a = b.document.$.execCommand(d, !1, null)
						} catch (c) {
							a = !1
						}
						a || b.showNotification(b.lang.clipboard[this.type + "Error"]);
						return a
					}
				}
			}

			function d() {
				return {
					canUndo: !1,
					async: !0,
					exec: function(b, a) {
						var d = this,
							c = function(a, c) {
								a && r(b, a, !! c);
								b.fire("afterCommandExec", {
									name: "paste",
									command: d,
									returnValue: !! a
								})
							};
						"string" == typeof a ? c({
							dataValue: a,
							method: "paste",
							dataTransfer: n.initPasteDataTransfer()
						}, 1) : b.getClipboardData(c)
					}
				}
			}

			function e() {
				v = 1;
				setTimeout(function() {
					v = 0
				}, 100)
			}

			function g() {
				p = 1;
				setTimeout(function() {
					p = 0
				}, 10)
			}

			function f(a) {
				var d = b.document,
					c = d.getBody(),
					e = !1,
					f = function() {
						e = !0
					};
				c.on(a, f);
				7 < CKEDITOR.env.version ? d.$.execCommand(a) : d.$.selection.createRange().execCommand(a);
				c.removeListener(a, f);
				return e
			}

			function h() {
				if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
					var a = b.getSelection(),
						d, c, e;
					a.getType() == CKEDITOR.SELECTION_ELEMENT && (d = a.getSelectedElement()) && (c = a.getRanges()[0], e = b.document.createText(""), e.insertBefore(d), c.setStartBefore(e), c.setEndAfter(d), a.selectRanges([c]), setTimeout(function() {
						d.getParent() && (e.remove(), a.selectElement(d))
					}, 0))
				}
			}

			function l(a, d) {
				var c = b.document,
					e = b.editable(),
					f = function(b) {
						b.cancel()
					},
					q;
				if (!c.getById("cke_pastebin")) {
					var g = b.getSelection(),
						h = g.createBookmarks();
					CKEDITOR.env.ie && g.root.fire("selectionchange");
					var m = new CKEDITOR.dom.element(!CKEDITOR.env.webkit && !e.is("body") || CKEDITOR.env.ie ? "div" : "body", c);
					m.setAttributes({
						id: "cke_pastebin",
						"data-cke-temp": "1"
					});
					var k = 0,
						c = c.getWindow();
					CKEDITOR.env.webkit ? (e.append(m), m.addClass("cke_editable"), e.is("body") || (k = "static" != e.getComputedStyle("position") ? e : CKEDITOR.dom.element.get(e.$.offsetParent), k = k.getDocumentPosition().y)) : e.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(m);
					m.setStyles({
						position: "absolute",
						top: c.getScrollPosition().y - k + 10 + "px",
						width: "1px",
						height: Math.max(1, c.getViewPaneSize().height - 20) + "px",
						overflow: "hidden",
						margin: 0,
						padding: 0
					});
					CKEDITOR.env.safari && m.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "text"));
					(k = m.getParent().isReadOnly()) ? (m.setOpacity(0), m.setAttribute("contenteditable", !0)) : m.setStyle("ltr" == b.config.contentsLangDirection ? "left" : "right", "-10000px");
					b.on("selectionChange", f, null, null, 0);
					if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) q = e.once("blur", f, null, null, -100);
					k && m.focus();
					k = new CKEDITOR.dom.range(m);
					k.selectNodeContents(m);
					var t = k.select();
					CKEDITOR.env.ie && (q = e.once("blur", function() {
						b.lockSelection(t)
					}));
					var l = CKEDITOR.document.getWindow().getScrollPosition().y;
					setTimeout(function() {
						CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop = l);
						q && q.removeListener();
						CKEDITOR.env.ie && e.focus();
						g.selectBookmarks(h);
						m.remove();
						var a;
						CKEDITOR.env.webkit && (a = m.getFirst()) && a.is && a.hasClass("Apple-style-span") && (m = a);
						b.removeListener("selectionChange", f);
						d(m.getHtml())
					}, 0)
				}
			}

			function z() {
				if ("paste" == n.mainPasteEvent) return b.fire("beforePaste", {
					type: "auto",
					method: "paste"
				}), !1;
				b.focus();
				e();
				var a = b.focusManager;
				a.lock();
				if (b.editable().fire(n.mainPasteEvent) && !f("paste")) return a.unlock(), !1;
				a.unlock();
				return !0
			}

			function q(a) {
				if ("wysiwyg" == b.mode) switch (a.data.keyCode) {
				case CKEDITOR.CTRL + 86:
				case CKEDITOR.SHIFT + 45:
					a = b.editable();
					e();
					"paste" == n.mainPasteEvent && a.fire("beforepaste");
					break;
				case CKEDITOR.CTRL + 88:
				case CKEDITOR.SHIFT + 46:
					b.fire("saveSnapshot"), setTimeout(function() {
						b.fire("saveSnapshot")
					}, 50)
				}
			}

			function k(a) {
				var d = {
					type: "auto",
					method: "paste",
					dataTransfer: n.initPasteDataTransfer(a)
				};
				d.dataTransfer.cacheData();
				var c = !1 !== b.fire("beforePaste", d);
				c && n.canClipboardApiBeTrusted(d.dataTransfer, b) ? (a.data.preventDefault(), setTimeout(function() {
					r(b, d)
				}, 0)) : l(a, function(a) {
					d.dataValue = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
					c && r(b, d)
				})
			}

			function t() {
				if ("wysiwyg" == b.mode) {
					var a = u("paste");
					b.getCommand("cut").setState(u("cut"));
					b.getCommand("copy").setState(u("copy"));
					b.getCommand("paste").setState(a);
					b.fire("pasteState", a)
				}
			}

			function u(a) {
				if (w && a in {
					paste: 1,
					cut: 1
				}) return CKEDITOR.TRISTATE_DISABLED;
				if ("paste" == a) return CKEDITOR.TRISTATE_OFF;
				a = b.getSelection();
				var d = a.getRanges();
				return a.getType() == CKEDITOR.SELECTION_NONE || 1 == d.length && d[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
			}
			var n = CKEDITOR.plugins.clipboard,
				p = 0,
				v = 0,
				w = 0;
			(function() {
				b.on("key", q);
				b.on("contentDom", a);
				b.on("selectionChange", function(b) {
					w = b.data.selection.getRanges()[0].checkReadOnly();
					t()
				});
				b.contextMenu && b.contextMenu.addListener(function(b, a) {
					w = a.getRanges()[0].checkReadOnly();
					return {
						cut: u("cut"),
						copy: u("copy"),
						paste: u("paste")
					}
				})
			})();
			(function() {
				function a(d, c, e, f, q) {
					var g = b.lang.clipboard[c];
					b.addCommand(c, e);
					b.ui.addButton && b.ui.addButton(d, {
						label: g,
						command: c,
						toolbar: "clipboard," + f
					});
					b.addMenuItems && b.addMenuItem(c, {
						label: g,
						command: c,
						group: "clipboard",
						order: q
					})
				}
				a("Cut", "cut", c("cut"), 10, 1);
				a("Copy", "copy", c("copy"), 20, 4);
				a("Paste", "paste", d(), 30, 8)
			})();
			b.getClipboardData = function(a, d) {
				function c(a) {
					a.removeListener();
					a.cancel();
					d(a.data)
				}

				function e(a) {
					a.removeListener();
					a.cancel();
					k = !0;
					d({
						type: g,
						dataValue: a.data.dataValue,
						dataTransfer: a.data.dataTransfer,
						method: "paste"
					})
				}

				function f() {
					this.customTitle = a && a.title
				}
				var q = !1,
					g = "auto",
					k = !1;
				d || (d = a, a = null);
				b.on("paste", c, null, null, 0);
				b.on("beforePaste", function(a) {
					a.removeListener();
					q = !0;
					g = a.data.type
				}, null, null, 1E3);
				!1 === z() && (b.removeListener("paste", c), q && b.fire("pasteDialog", f) ? (b.on("pasteDialogCommit", e), b.on("dialogHide", function(a) {
					a.removeListener();
					a.data.removeListener("pasteDialogCommit", e);
					setTimeout(function() {
						k || d(null)
					}, 10)
				})) : d(null))
			}
		}

		function A(b) {
			if (CKEDITOR.env.webkit) {
				if (!b.match(/^[^<]*$/g) && !b.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) return "html"
			} else if (CKEDITOR.env.ie) {
				if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi) && !b.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) return "html"
			} else if (CKEDITOR.env.gecko) {
				if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html"
			} else return "html";
			return "htmlifiedtext"
		}

		function B(b, a) {
			function c(a) {
				return CKEDITOR.tools.repeat("</p><p>", ~~ (a / 2)) + (1 == a % 2 ? "<br>" : "")
			}
			a = a.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
			a = a.replace(/<\/?[A-Z]+>/g, function(a) {
				return a.toLowerCase()
			});
			if (a.match(/^[^<]$/)) return a;
			CKEDITOR.env.webkit && -1 < a.indexOf("<div>") && (a = a.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>"), a.match(/<div>(<br>|)<\/div>/) && (a = "<p>" + a.replace(/(<div>(<br>|)<\/div>)+/g, function(a) {
				return c(a.split("</div><div>").length + 1)
			}) + "</p>"), a = a.replace(/<\/div><div>/g, "<br>"), a = a.replace(/<\/?div>/g, ""));
			CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (CKEDITOR.env.gecko && (a = a.replace(/^<br><br>$/, "<br>")), -1 < a.indexOf("<br><br>") && (a = "<p>" + a.replace(/(<br>){2,}/g, function(a) {
				return c(a.length / 4)
			}) + "</p>"));
			return C(b, a)
		}

		function D() {
			function b() {
				var a = {},
					b;
				for (b in CKEDITOR.dtd)"$" != b.charAt(0) && "div" != b && "span" != b && (a[b] = 1);
				return a
			}
			var a = {};
			return {
				get: function(c) {
					return "plain-text" == c ? a.plainText || (a.plainText = new CKEDITOR.filter("br")) : "semantic-content" == c ? ((c = a.semanticContent) || (c = new CKEDITOR.filter, c.allow({
						$1: {
							elements: b(),
							attributes: !0,
							styles: !1,
							classes: !1
						}
					}), c = a.semanticContent = c), c) : c ? new CKEDITOR.filter(c) : null
				}
			}
		}

		function x(b, a, c) {
			a = CKEDITOR.htmlParser.fragment.fromHtml(a);
			var d = new CKEDITOR.htmlParser.basicWriter;
			c.applyTo(a, !0, !1, b.activeEnterMode);
			a.writeHtml(d);
			return d.getHtml()
		}

		function C(b, a) {
			b.enterMode == CKEDITOR.ENTER_BR ? a = a.replace(/(<\/p><p>)+/g, function(a) {
				return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2)
			}).replace(/<\/?p>/g, "") : b.enterMode == CKEDITOR.ENTER_DIV && (a = a.replace(/<(\/)?p>/g, "<$1div>"));
			return a
		}

		function E(b) {
			b.data.preventDefault();
			b.data.$.dataTransfer.dropEffect = "none"
		}

		function F(b) {
			var a = CKEDITOR.plugins.clipboard;
			b.on("contentDom", function() {
				function c(a, d, c) {
					d.select();
					r(b, {
						dataTransfer: c,
						method: "drop"
					}, 1);
					c.sourceEditor.fire("saveSnapshot");
					c.sourceEditor.editable().extractHtmlFromRange(a);
					c.sourceEditor.getSelection().selectRanges([a]);
					c.sourceEditor.fire("saveSnapshot")
				}

				function d(d, c) {
					d.select();
					r(b, {
						dataTransfer: c,
						method: "drop"
					}, 1);
					a.resetDragDataTransfer()
				}

				function e(a, d, c) {
					var e = {
						$: a.data.$,
						target: a.data.getTarget()
					};
					d && (e.dragRange = d);
					c && (e.dropRange = c);
					!1 === b.fire(a.name, e) && a.data.preventDefault()
				}

				function g(a) {
					a.type != CKEDITOR.NODE_ELEMENT && (a = a.getParent());
					return a.getChildCount()
				}
				var f = b.editable(),
					h = CKEDITOR.plugins.clipboard.getDropTarget(b),
					l = b.ui.space("top"),
					p = b.ui.space("bottom");
				a.preventDefaultDropOnElement(l);
				a.preventDefaultDropOnElement(p);
				f.attachListener(h, "dragstart", e);
				f.attachListener(b, "dragstart", a.resetDragDataTransfer, a, null, 1);
				f.attachListener(b, "dragstart", function(d) {
					a.initDragDataTransfer(d, b)
				}, null, null, 2);
				f.attachListener(b, "dragstart", function() {
					var d = a.dragRange = b.getSelection().getRanges()[0];
					CKEDITOR.env.ie && 10 > CKEDITOR.env.version && (a.dragStartContainerChildCount = d ? g(d.startContainer) : null, a.dragEndContainerChildCount = d ? g(d.endContainer) : null)
				}, null, null, 100);
				f.attachListener(h, "dragend", e);
				f.attachListener(b, "dragend", a.initDragDataTransfer, a, null, 1);
				f.attachListener(b, "dragend", a.resetDragDataTransfer, a, null, 100);
				f.attachListener(h, "dragover", function(a) {
					var b = a.data.getTarget();
					b && b.is && b.is("html") ? a.data.preventDefault() : CKEDITOR.env.ie && CKEDITOR.plugins.clipboard.isFileApiSupported && a.data.$.dataTransfer.types.contains("Files") && a.data.preventDefault()
				});
				f.attachListener(h, "drop", function(d) {
					if (!d.data.$.defaultPrevented) {
						d.data.preventDefault();
						var c = d.data.getTarget();
						if (!c.isReadOnly() || c.type == CKEDITOR.NODE_ELEMENT && c.is("html")) {
							var c = a.getRangeAtDropPosition(d, b),
								f = a.dragRange;
							c && e(d, f, c)
						}
					}
				}, null, null, 9999);
				f.attachListener(b, "drop", a.initDragDataTransfer, a, null, 1);
				f.attachListener(b, "drop", function(e) {
					if (e = e.data) {
						var f = e.dropRange,
							g = e.dragRange,
							h = e.dataTransfer;
						h.getTransferType(b) == CKEDITOR.DATA_TRANSFER_INTERNAL ? setTimeout(function() {
							a.internalDrop(g, f, h, b)
						}, 0) : h.getTransferType(b) == CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ? c(g, f, h) : d(f, h)
					}
				}, null, null, 9999)
			})
		}
		CKEDITOR.plugins.add("clipboard", {
			requires: "dialog",
			init: function(b) {
				var a, c = D();
				b.config.forcePasteAsPlainText ? a = "plain-text" : b.config.pasteFilter ? a = b.config.pasteFilter : !CKEDITOR.env.webkit || "pasteFilter" in b.config || (a = "semantic-content");
				b.pasteFilter = c.get(a);
				y(b);
				F(b);
				CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
				b.on("paste", function(a) {
					a.data.dataTransfer || (a.data.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer);
					if (!a.data.dataValue) {
						var c = a.data.dataTransfer,
							g = c.getData("text/html");
						if (g) a.data.dataValue = g, a.data.type = "html";
						else if (g = c.getData("text/plain")) a.data.dataValue = b.editable().transformPlainTextToHtml(g), a.data.type = "text"
					}
				}, null, null, 1);
				b.on("paste", function(a) {
					var b = a.data.dataValue,
						c = CKEDITOR.dtd.$block; - 1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) {
						return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
					})), -1 < b.indexOf('<br class="Apple-interchange-newline">') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1"));
					if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
						var f, h, l = new CKEDITOR.dom.element("div");
						for (l.setHtml(b); 1 == l.getChildCount() && (f = l.getFirst()) && f.type == CKEDITOR.NODE_ELEMENT && (f.hasClass("cke_editable") || f.hasClass("cke_contents"));) l = h = f;
						h && (b = h.getHtml().replace(/<br>$/i, ""))
					}
					CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, f) {
						return f.toLowerCase() in c ? (a.data.preSniffing = "html", "<" + f) : b
					}) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function(b, f) {
						return f in c ? (a.data.endsWithEOL = 1, "</" + f + ">") : b
					}) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
					a.data.dataValue = b
				}, null, null, 3);
				b.on("paste", function(a) {
					a = a.data;
					var e = a.type,
						g = a.dataValue,
						f, h = b.config.clipboard_defaultContentType || "html",
						l = a.dataTransfer.getTransferType(b);
					f = "html" == e || "html" == a.preSniffing ? "html" : A(g);
					"htmlifiedtext" == f && (g = B(b.config, g));
					"text" == e && "html" == f ? g = x(b, g, c.get("plain-text")) : l == CKEDITOR.DATA_TRANSFER_EXTERNAL && b.pasteFilter && !a.dontFilter && (g = x(b, g, b.pasteFilter));
					a.startsWithEOL && (g = '<br data-cke-eol="1">' + g);
					a.endsWithEOL && (g += '<br data-cke-eol="1">');
					"auto" == e && (e = "html" == f || "html" == h ? "html" : "text");
					a.type = e;
					a.dataValue = g;
					delete a.preSniffing;
					delete a.startsWithEOL;
					delete a.endsWithEOL
				}, null, null, 6);
				b.on("paste", function(a) {
					a = a.data;
					a.dataValue && (b.insertHtml(a.dataValue, a.type, a.range), setTimeout(function() {
						b.fire("afterPaste")
					}, 0))
				}, null, null, 1E3);
				b.on("pasteDialog", function(a) {
					setTimeout(function() {
						b.openDialog("paste", a.data)
					}, 0)
				})
			}
		});
		CKEDITOR.plugins.clipboard = {
			isCustomCopyCutSupported: !CKEDITOR.env.ie && !CKEDITOR.env.iOS,
			isCustomDataTypesSupported: !CKEDITOR.env.ie,
			isFileApiSupported: !CKEDITOR.env.ie || 9 < CKEDITOR.env.version,
			mainPasteEvent: CKEDITOR.env.ie && !CKEDITOR.env.edge ? "beforepaste" : "paste",
			canClipboardApiBeTrusted: function(b, a) {
				return b.getTransferType(a) != CKEDITOR.DATA_TRANSFER_EXTERNAL || CKEDITOR.env.chrome && !b.isEmpty() || CKEDITOR.env.gecko && (b.getData("text/html") || b.getFilesCount()) ? !0 : !1
			},
			getDropTarget: function(b) {
				var a = b.editable();
				return CKEDITOR.env.ie && 9 > CKEDITOR.env.version || a.isInline() ? a : b.document
			},
			fixSplitNodesAfterDrop: function(b, a, c, d) {
				function e(b, c, d) {
					var e = b;
					e.type == CKEDITOR.NODE_TEXT && (e = b.getParent());
					if (e.equals(c) && d != c.getChildCount()) return b = a.startContainer.getChild(a.startOffset - 1), c = a.startContainer.getChild(a.startOffset), b && b.type == CKEDITOR.NODE_TEXT && c && c.type == CKEDITOR.NODE_TEXT && (d = b.getLength(), b.setText(b.getText() + c.getText()), c.remove(), a.setStart(b, d), a.collapse(!0)), !0
				}
				var g = a.startContainer;
				"number" == typeof d && "number" == typeof c && g.type == CKEDITOR.NODE_ELEMENT && (e(b.startContainer, g, c) || e(b.endContainer, g, d))
			},
			isDropRangeAffectedByDragRange: function(b, a) {
				var c = a.startContainer,
					d = a.endOffset;
				return b.endContainer.equals(c) && b.endOffset <= d || b.startContainer.getParent().equals(c) && b.startContainer.getIndex() < d || b.endContainer.getParent().equals(c) && b.endContainer.getIndex() < d ? !0 : !1
			},
			internalDrop: function(b, a, c, d) {
				var e = CKEDITOR.plugins.clipboard,
					g = d.editable(),
					f, h;
				d.fire("saveSnapshot");
				d.fire("lockSnapshot", {
					dontUpdate: 1
				});
				CKEDITOR.env.ie && 10 > CKEDITOR.env.version && this.fixSplitNodesAfterDrop(b, a, e.dragStartContainerChildCount, e.dragEndContainerChildCount);
				(h = this.isDropRangeAffectedByDragRange(b, a)) || (f = b.createBookmark(!1));
				e = a.clone().createBookmark(!1);
				h && (f = b.createBookmark(!1));
				b = f.startNode;
				a = f.endNode;
				h = e.startNode;
				a && b.getPosition(h) & CKEDITOR.POSITION_PRECEDING && a.getPosition(h) & CKEDITOR.POSITION_FOLLOWING && h.insertBefore(b);
				b = d.createRange();
				b.moveToBookmark(f);
				g.extractHtmlFromRange(b, 1);
				a = d.createRange();
				a.moveToBookmark(e);
				r(d, {
					dataTransfer: c,
					method: "drop",
					range: a
				}, 1);
				d.fire("unlockSnapshot")
			},
			getRangeAtDropPosition: function(b, a) {
				var c = b.data.$,
					d = c.clientX,
					e = c.clientY,
					g = a.getSelection(!0).getRanges()[0],
					f = a.createRange();
				if (b.data.testRange) return b.data.testRange;
				if (document.caretRangeFromPoint) c = a.document.$.caretRangeFromPoint(d, e), f.setStart(CKEDITOR.dom.node(c.startContainer), c.startOffset), f.collapse(!0);
				else if (c.rangeParent) f.setStart(CKEDITOR.dom.node(c.rangeParent), c.rangeOffset), f.collapse(!0);
				else {
					if (CKEDITOR.env.ie && 8 < CKEDITOR.env.version && g && a.editable().hasFocus) return g;
					if (document.body.createTextRange) {
						a.focus();
						c = a.document.getBody().$.createTextRange();
						try {
							for (var h = !1, l = 0; 20 > l && !h; l++) {
								if (!h) try {
									c.moveToPoint(d, e - l), h = !0
								} catch (p) {}
								if (!h) try {
									c.moveToPoint(d, e + l), h = !0
								} catch (q) {}
							}
							if (h) {
								var k = "cke-temp-" + (new Date).getTime();
								c.pasteHTML('<span id="' + k + '">​</span>');
								var t = a.document.getById(k);
								f.moveToPosition(t, CKEDITOR.POSITION_BEFORE_START);
								t.remove()
							} else {
								var u = a.document.$.elementFromPoint(d, e),
									n = new CKEDITOR.dom.element(u),
									r;
								if (n.equals(a.editable()) || "html" == n.getName()) return g && g.startContainer && !g.startContainer.equals(a.editable()) ? g : null;
								r = n.getClientRect();
								d < r.left ? f.setStartAt(n, CKEDITOR.POSITION_AFTER_START) : f.setStartAt(n, CKEDITOR.POSITION_BEFORE_END);
								f.collapse(!0)
							}
						} catch (v) {
							return null
						}
					} else return null
				}
				return f
			},
			initDragDataTransfer: function(b, a) {
				var c = b.data.$ ? b.data.$.dataTransfer : null,
					d = new this.dataTransfer(c, a);
				c ? this.dragData && d.id == this.dragData.id ? d = this.dragData : this.dragData = d : this.dragData ? d = this.dragData : this.dragData = d;
				b.data.dataTransfer = d
			},
			resetDragDataTransfer: function() {
				this.dragData = null
			},
			initPasteDataTransfer: function(b, a) {
				if (this.isCustomCopyCutSupported && b && b.data && b.data.$) {
					var c = new this.dataTransfer(b.data.$.clipboardData, a);
					this.copyCutData && c.id == this.copyCutData.id ? (c = this.copyCutData, c.$ = b.data.$.clipboardData) : this.copyCutData = c;
					return c
				}
				return new this.dataTransfer(null, a)
			},
			preventDefaultDropOnElement: function(b) {
				b && b.on("dragover", E)
			}
		};
		var p = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ? "cke/id" : "Text";
		CKEDITOR.plugins.clipboard.dataTransfer = function(b, a) {
			b && (this.$ = b);
			this._ = {
				metaRegExp: /^<meta.*?>/i,
				bodyRegExp: /<body(?:[\s\S]*?)>([\s\S]*)<\/body>/i,
				fragmentRegExp: /<!--(?:Start|End)Fragment-->/g,
				data: {},
				files: [],
				normalizeType: function(a) {
					a = a.toLowerCase();
					return "text" == a || "text/plain" == a ? "Text" : "url" == a ? "URL" : a
				}
			};
			this.id = this.getData(p);
			this.id || (this.id = "Text" == p ? "" : "cke-" + CKEDITOR.tools.getUniqueId());
			if ("Text" != p) try {
				this.$.setData(p, this.id)
			} catch (c) {}
			a && (this.sourceEditor = a, this.setData("text/html", a.getSelectedHtml(1)), "Text" == p || this.getData("text/plain") || this.setData("text/plain", a.getSelection().getSelectedText()))
		};
		CKEDITOR.DATA_TRANSFER_INTERNAL = 1;
		CKEDITOR.DATA_TRANSFER_CROSS_EDITORS = 2;
		CKEDITOR.DATA_TRANSFER_EXTERNAL = 3;
		CKEDITOR.plugins.clipboard.dataTransfer.prototype = {
			getData: function(b) {
				b = this._.normalizeType(b);
				var a = this._.data[b];
				if (void 0 === a || null === a || "" === a) try {
					a = this.$.getData(b)
				} catch (c) {}
				if (void 0 === a || null === a || "" === a) a = "";
				"text/html" == b ? (a = a.replace(this._.metaRegExp, ""), (b = this._.bodyRegExp.exec(a)) && b.length && (a = b[1], a = a.replace(this._.fragmentRegExp, ""))) : "Text" == b && CKEDITOR.env.gecko && this.getFilesCount() && "file://" == a.substring(0, 7) && (a = "");
				return a
			},
			setData: function(b, a) {
				b = this._.normalizeType(b);
				this._.data[b] = a;
				if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported || "URL" == b || "Text" == b) {
					"Text" == p && "Text" == b && (this.id = a);
					try {
						this.$.setData(b, a)
					} catch (c) {}
				}
			},
			getTransferType: function(b) {
				return this.sourceEditor ? this.sourceEditor == b ? CKEDITOR.DATA_TRANSFER_INTERNAL : CKEDITOR.DATA_TRANSFER_CROSS_EDITORS : CKEDITOR.DATA_TRANSFER_EXTERNAL
			},
			cacheData: function() {
				function b(b) {
					b = a._.normalizeType(b);
					var c = a.getData(b);
					c && (a._.data[b] = c)
				}
				if (this.$) {
					var a = this,
						c, d;
					if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) {
						if (this.$.types) for (c = 0; c < this.$.types.length; c++) b(this.$.types[c])
					} else b("Text"), b("URL");
					d = this._getImageFromClipboard();
					if (this.$ && this.$.files || d) {
						this._.files = [];
						for (c = 0; c < this.$.files.length; c++) this._.files.push(this.$.files[c]);
						0 === this._.files.length && d && this._.files.push(d)
					}
				}
			},
			getFilesCount: function() {
				return this._.files.length ? this._.files.length : this.$ && this.$.files && this.$.files.length ? this.$.files.length : this._getImageFromClipboard() ? 1 : 0
			},
			getFile: function(b) {
				return this._.files.length ? this._.files[b] : this.$ && this.$.files && this.$.files.length ? this.$.files[b] : 0 === b ? this._getImageFromClipboard() : void 0
			},
			isEmpty: function() {
				var b = {},
					a;
				if (this.getFilesCount()) return !1;
				for (a in this._.data) b[a] = 1;
				if (this.$) if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) {
					if (this.$.types) for (var c = 0; c < this.$.types.length; c++) b[this.$.types[c]] = 1
				} else b.Text = 1, b.URL = 1;
				"Text" != p && (b[p] = 0);
				for (a in b) if (b[a] && "" !== this.getData(a)) return !1;
				return !0
			},
			_getImageFromClipboard: function() {
				var b;
				if (this.$ && this.$.items && this.$.items[0]) try {
					if ((b = this.$.items[0].getAsFile()) && b.type) return b
				} catch (a) {}
			}
		}
	})();
	(function() {
		var c = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (c += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
		var c = c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),
			c = c + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>',
			r = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"),
			t = CKEDITOR.addTemplate("button", c);
		CKEDITOR.plugins.add("button", {
			beforeInit: function(a) {
				a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
			}
		});
		CKEDITOR.UI_BUTTON = "button";
		CKEDITOR.ui.button = function(a) {
			CKEDITOR.tools.extend(this, a, {
				title: a.label,
				click: a.click ||
				function(b) {
					b.execCommand(a.command)
				}
			});
			this._ = {}
		};
		CKEDITOR.ui.button.handler = {
			create: function(a) {
				return new CKEDITOR.ui.button(a)
			}
		};
		CKEDITOR.ui.button.prototype = {
			render: function(a, b) {
				function c() {
					var e = a.mode;
					e && (e = this.modes[e] ? void 0 !== k[e] ? k[e] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, e = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : e, this.setState(e), this.refresh && this.refresh())
				}
				var l = CKEDITOR.env,
					m = this._.id = CKEDITOR.tools.getNextId(),
					f = "",
					g = this.command,
					n;
				this._.editor = a;
				var d = {
					id: m,
					button: this,
					editor: a,
					focus: function() {
						CKEDITOR.document.getById(m).focus()
					},
					execute: function() {
						this.button.click(a)
					},
					attach: function(a) {
						this.button.attach(a)
					}
				},
					u = CKEDITOR.tools.addFunction(function(a) {
						if (d.onkey) return a = new CKEDITOR.dom.event(a), !1 !== d.onkey(d, a.getKeystroke())
					}),
					v = CKEDITOR.tools.addFunction(function(a) {
						var b;
						d.onfocus && (b = !1 !== d.onfocus(d, new CKEDITOR.dom.event(a)));
						return b
					}),
					p = 0;
				d.clickFn = n = CKEDITOR.tools.addFunction(function() {
					p && (a.unlockSelection(1), p = 0);
					d.execute();
					l.iOS && a.focus()
				});
				if (this.modes) {
					var k = {};
					a.on("beforeModeUnload", function() {
						a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (k[a.mode] = this._.state)
					}, this);
					a.on("activeFilterChange", c, this);
					a.on("mode", c, this);
					!this.readOnly && a.on("readOnly", c, this)
				} else g && (g = a.getCommand(g)) && (g.on("state", function() {
					this.setState(g.state)
				}, this), f += g.state == CKEDITOR.TRISTATE_ON ? "on" : g.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
				if (this.directional) a.on("contentDirChanged", function(b) {
					var c = CKEDITOR.document.getById(this._.id),
						d = c.getFirst();
					b = b.data;
					b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
					d.setAttribute("style", CKEDITOR.skin.getIconStyle(h, "rtl" == b, this.icon, this.iconOffset))
				}, this);
				g || (f += "off");
				var q = this.name || this.command,
					h = q;
				this.icon && !/\./.test(this.icon) && (h = this.icon, this.icon = null);
				f = {
					id: m,
					name: q,
					iconName: h,
					label: this.label,
					cls: this.className || "",
					state: f,
					ariaDisabled: "disabled" == f ? "true" : "false",
					title: this.title,
					titleJs: l.gecko && !l.hc ? "" : (this.title || "").replace("'", ""),
					hasArrow: this.hasArrow ? "true" : "false",
					keydownFn: u,
					focusFn: v,
					clickFn: n,
					style: CKEDITOR.skin.getIconStyle(h, "rtl" == a.lang.dir, this.icon, this.iconOffset),
					arrowHtml: this.hasArrow ? r.output() : ""
				};
				t.output(f, b);
				if (this.onRender) this.onRender();
				return d
			},
			setState: function(a) {
				if (this._.state == a) return !1;
				this._.state = a;
				var b = CKEDITOR.document.getById(this._.id);
				return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), this.hasArrow ? (a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label, CKEDITOR.document.getById(this._.id + "_label").setText(a)) : a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
			},
			getState: function() {
				return this._.state
			},
			toFeature: function(a) {
				if (this._.feature) return this._.feature;
				var b = this;
				this.allowedContent || this.requiredContent || !this.command || (b = a.getCommand(this.command) || b);
				return this._.feature = b
			}
		};
		CKEDITOR.ui.prototype.addButton = function(a, b) {
			this.add(a, CKEDITOR.UI_BUTTON, b)
		}
	})();
	CKEDITOR.plugins.add("panelbutton", {
		requires: "button",
		onLoad: function() {
			function e(c) {
				var a = this._;
				a.state != CKEDITOR.TRISTATE_DISABLED && (this.createPanel(c), a.on ? a.panel.hide() : a.panel.showBlock(this._.id, this.document.getById(this._.id), 4))
			}
			CKEDITOR.ui.panelButton = CKEDITOR.tools.createClass({
				base: CKEDITOR.ui.button,
				$: function(c) {
					var a = c.panel || {};
					delete c.panel;
					this.base(c);
					this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
					a.block = {
						attributes: a.attributes
					};
					this.hasArrow = a.toolbarRelated = !0;
					this.click = e;
					this._ = {
						panelDefinition: a
					}
				},
				statics: {
					handler: {
						create: function(c) {
							return new CKEDITOR.ui.panelButton(c)
						}
					}
				},
				proto: {
					createPanel: function(c) {
						var a = this._;
						if (!a.panel) {
							var f = this._.panelDefinition,
								e = this._.panelDefinition.block,
								g = f.parent || CKEDITOR.document.getBody(),
								d = this._.panel = new CKEDITOR.ui.floatPanel(c, g, f),
								f = d.addBlock(a.id, e),
								b = this;
							d.onShow = function() {
								b.className && this.element.addClass(b.className + "_panel");
								b.setState(CKEDITOR.TRISTATE_ON);
								a.on = 1;
								b.editorFocus && c.focus();
								if (b.onOpen) b.onOpen()
							};
							d.onHide = function(d) {
								b.className && this.element.getFirst().removeClass(b.className + "_panel");
								b.setState(b.modes && b.modes[c.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
								a.on = 0;
								if (!d && b.onClose) b.onClose()
							};
							d.onEscape = function() {
								d.hide(1);
								b.document.getById(a.id).focus()
							};
							if (this.onBlock) this.onBlock(d, f);
							f.onHide = function() {
								a.on = 0;
								b.setState(CKEDITOR.TRISTATE_OFF)
							}
						}
					}
				}
			})
		},
		beforeInit: function(e) {
			e.ui.addHandler(CKEDITOR.UI_PANELBUTTON, CKEDITOR.ui.panelButton.handler)
		}
	});
	CKEDITOR.UI_PANELBUTTON = "panelbutton";
	(function() {
		CKEDITOR.plugins.add("panel", {
			beforeInit: function(a) {
				a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
			}
		});
		CKEDITOR.UI_PANEL = "panel";
		CKEDITOR.ui.panel = function(a, b) {
			b && CKEDITOR.tools.extend(this, b);
			CKEDITOR.tools.extend(this, {
				className: "",
				css: []
			});
			this.id = CKEDITOR.tools.getNextId();
			this.document = a;
			this.isFramed = this.forceIFrame || this.css.length;
			this._ = {
				blocks: {}
			}
		};
		CKEDITOR.ui.panel.handler = {
			create: function(a) {
				return new CKEDITOR.ui.panel(a)
			}
		};
		var f = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),
			g = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
			h = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
		CKEDITOR.ui.panel.prototype = {
			render: function(a, b) {
				this.getHolderElement = function() {
					var a = this._.holder;
					if (!a) {
						if (this.isFramed) {
							var a = this.document.getById(this.id + "_frame"),
								b = a.getParent(),
								a = a.getFrameDocument();
							CKEDITOR.env.iOS && b.setStyles({
								overflow: "scroll",
								"-webkit-overflow-scrolling": "touch"
							});
							b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
								this.isLoaded = !0;
								if (this.onLoad) this.onLoad()
							}, this));
							a.write(h.output(CKEDITOR.tools.extend({
								css: CKEDITOR.tools.buildStyleHtml(this.css),
								onload: "window.parent.CKEDITOR.tools.callFunction(" + b + ");"
							}, d)));
							a.getWindow().$.CKEDITOR = CKEDITOR;
							a.on("keydown", function(a) {
								var b = a.data.getKeystroke(),
									c = this.document.getById(this.id).getAttribute("dir");
								this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault()
							}, this);
							a = a.getBody();
							a.unselectable();
							CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
						} else a = this.document.getById(this.id);
						this._.holder = a
					}
					return a
				};
				var d = {
					editorId: a.id,
					id: this.id,
					langCode: a.langCode,
					dir: a.lang.dir,
					cls: this.className,
					frame: "",
					env: CKEDITOR.env.cssClass,
					"z-index": a.config.baseFloatZIndex + 1
				};
				if (this.isFramed) {
					var e = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
					d.frame = g.output({
						id: this.id + "_frame",
						src: e
					})
				}
				e = f.output(d);
				b && b.push(e);
				return e
			},
			addBlock: function(a, b) {
				b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
				this._.currentBlock || this.showBlock(a);
				return b
			},
			getBlock: function(a) {
				return this._.blocks[a]
			},
			showBlock: function(a) {
				a = this._.blocks[a];
				var b = this._.currentBlock,
					d = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
				b && b.hide();
				this._.currentBlock = a;
				CKEDITOR.fire("ariaWidget", d);
				a._.focusIndex = -1;
				this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
				a.show();
				return a
			},
			destroy: function() {
				this.element && this.element.remove()
			}
		};
		CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
			$: function(a, b) {
				this.element = a.append(a.getDocument().createElement("div", {
					attributes: {
						tabindex: -1,
						"class": "cke_panel_block"
					},
					styles: {
						display: "none"
					}
				}));
				b && CKEDITOR.tools.extend(this, b);
				this.element.setAttributes({
					role: this.attributes.role || "presentation",
					"aria-label": this.attributes["aria-label"],
					title: this.attributes.title || this.attributes["aria-label"]
				});
				this.keys = {};
				this._.focusIndex = -1;
				this.element.disableContextMenu()
			},
			_: {
				markItem: function(a) {
					-1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a), CKEDITOR.env.webkit && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
				}
			},
			proto: {
				show: function() {
					this.element.setStyle("display", "")
				},
				hide: function() {
					this.onHide && !0 === this.onHide.call(this) || this.element.setStyle("display", "none")
				},
				onKeyDown: function(a, b) {
					var d = this.keys[a];
					switch (d) {
					case "next":
						for (var e = this._.focusIndex, d = this.element.getElementsByTag("a"), c; c = d.getItem(++e);) if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
							this._.focusIndex = e;
							c.focus();
							break
						}
						return c || b ? !1 : (this._.focusIndex = -1, this.onKeyDown(a, 1));
					case "prev":
						e = this._.focusIndex;
						for (d = this.element.getElementsByTag("a"); 0 < e && (c = d.getItem(--e));) {
							if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
								this._.focusIndex = e;
								c.focus();
								break
							}
							c = null
						}
						return c || b ? !1 : (this._.focusIndex = d.count(), this.onKeyDown(a, 1));
					case "click":
					case "mouseup":
						return e = this._.focusIndex, (c = 0 <= e && this.element.getElementsByTag("a").getItem(e)) && (c.$[d] ? c.$[d]() : c.$["on" + d]()), !1
					}
					return !0
				}
			}
		})
	})();
	CKEDITOR.plugins.add("floatpanel", {
		requires: "panel"
	});
	(function() {
		function v(a, b, c, l, h) {
			h = CKEDITOR.tools.genKey(b.getUniqueId(), c.getUniqueId(), a.lang.dir, a.uiColor || "", l.css || "", h || "");
			var g = f[h];
			g || (g = f[h] = new CKEDITOR.ui.panel(b, l), g.element = c.append(CKEDITOR.dom.element.createFromHtml(g.render(a), b)), g.element.setStyles({
				display: "none",
				position: "absolute"
			}));
			return g
		}
		var f = {};
		CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
			$: function(a, b, c, l) {
				function h() {
					e.hide()
				}
				c.forceIFrame = 1;
				c.toolbarRelated && a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (b = CKEDITOR.document.getById("cke_" + a.name));
				var g = b.getDocument();
				l = v(a, g, b, c, l || 0);
				var m = l.element,
					p = m.getFirst(),
					e = this;
				m.disableContextMenu();
				this.element = m;
				this._ = {
					editor: a,
					panel: l,
					parentElement: b,
					definition: c,
					document: g,
					iframe: p,
					children: [],
					dir: a.lang.dir,
					showBlockParams: null
				};
				a.on("mode", h);
				a.on("resize", h);
				g.getWindow().on("resize", function() {
					this.reposition()
				}, this)
			},
			proto: {
				addBlock: function(a, b) {
					return this._.panel.addBlock(a, b)
				},
				addListBlock: function(a, b) {
					return this._.panel.addListBlock(a, b)
				},
				getBlock: function(a) {
					return this._.panel.getBlock(a)
				},
				showBlock: function(a, b, c, l, h, g) {
					var m = this._.panel,
						p = m.showBlock(a);
					this._.showBlockParams = [].slice.call(arguments);
					this.allowBlur(!1);
					var e = this._.editor.editable();
					this._.returnFocus = e.hasFocus ? e : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
					this._.hideTimeout = 0;
					var k = this.element,
						e = this._.iframe,
						e = CKEDITOR.env.ie && !CKEDITOR.env.edge ? e : new CKEDITOR.dom.window(e.$.contentWindow),
						f = k.getDocument(),
						r = this._.parentElement.getPositionedAncestor(),
						t = b.getDocumentPosition(f),
						f = r ? r.getDocumentPosition(f) : {
							x: 0,
							y: 0
						},
						q = "rtl" == this._.dir,
						d = t.x + (l || 0) - f.x,
						n = t.y + (h || 0) - f.y;
					!q || 1 != c && 4 != c ? q || 2 != c && 3 != c || (d += b.$.offsetWidth - 1) : d += b.$.offsetWidth;
					if (3 == c || 4 == c) n += b.$.offsetHeight - 1;
					this._.panel._.offsetParentId = b.getId();
					k.setStyles({
						top: n + "px",
						left: 0,
						display: ""
					});
					k.setOpacity(0);
					k.getFirst().removeStyle("width");
					this._.editor.focusManager.add(e);
					this._.blurSet || (CKEDITOR.event.useCapture = !0, e.on("blur", function(a) {
						function u() {
							delete this._.returnFocus;
							this.hide()
						}
						this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild && (CKEDITOR.env.iOS ? this._.hideTimeout || (this._.hideTimeout = CKEDITOR.tools.setTimeout(u, 0, this)) : u.call(this))
					}, this), e.on("focus", function() {
						this._.focused = !0;
						this.hideChild();
						this.allowBlur(!0)
					}, this), CKEDITOR.env.iOS && (e.on("touchstart", function() {
						clearTimeout(this._.hideTimeout)
					}, this), e.on("touchend", function() {
						this._.hideTimeout = 0;
						this.focus()
					}, this)), CKEDITOR.event.useCapture = !1, this._.blurSet = 1);
					m.onEscape = CKEDITOR.tools.bind(function(a) {
						if (this.onEscape && !1 === this.onEscape(a)) return !1
					}, this);
					CKEDITOR.tools.setTimeout(function() {
						var a = CKEDITOR.tools.bind(function() {
							var a = k;
							a.removeStyle("width");
							if (p.autoSize) {
								var b = p.element.getDocument(),
									b = (CKEDITOR.env.webkit || CKEDITOR.env.edge ? p.element : b.getBody()).$.scrollWidth;
								CKEDITOR.env.ie && CKEDITOR.env.quirks && 0 < b && (b += (a.$.offsetWidth || 0) - (a.$.clientWidth || 0) + 3);
								a.setStyle("width", b + 10 + "px");
								b = p.element.$.scrollHeight;
								CKEDITOR.env.ie && CKEDITOR.env.quirks && 0 < b && (b += (a.$.offsetHeight || 0) - (a.$.clientHeight || 0) + 3);
								a.setStyle("height", b + "px");
								m._.currentBlock.element.setStyle("display", "none").removeStyle("display")
							} else a.removeStyle("height");
							q && (d -= k.$.offsetWidth);
							k.setStyle("left", d + "px");
							var b = m.element.getWindow(),
								a = k.$.getBoundingClientRect(),
								b = b.getViewPaneSize(),
								c = a.width || a.right - a.left,
								e = a.height || a.bottom - a.top,
								l = q ? a.right : b.width - a.left,
								h = q ? b.width - a.right : a.left;
							q ? l < c && (d = h > c ? d + c : b.width > c ? d - a.left : d - a.right + b.width) : l < c && (d = h > c ? d - c : b.width > c ? d - a.right + b.width : d - a.left);
							c = a.top;
							b.height - a.top < e && (n = c > e ? n - e : b.height > e ? n - a.bottom + b.height : n - a.top);
							CKEDITOR.env.ie && (b = a = new CKEDITOR.dom.element(k.$.offsetParent), "html" == b.getName() && (b = b.getDocument().getBody()), "rtl" == b.getComputedStyle("direction") && (d = CKEDITOR.env.ie8Compat ? d - 2 * k.getDocument().getDocumentElement().$.scrollLeft : d - (a.$.scrollWidth - a.$.clientWidth)));
							var a = k.getFirst(),
								f;
							(f = a.getCustomData("activePanel")) && f.onHide && f.onHide.call(this, 1);
							a.setCustomData("activePanel", this);
							k.setStyles({
								top: n + "px",
								left: d + "px"
							});
							k.setOpacity(1);
							g && g()
						}, this);
						m.isLoaded ? a() : m.onLoad = a;
						CKEDITOR.tools.setTimeout(function() {
							var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
							this.focus();
							p.element.focus();
							CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop = a);
							this.allowBlur(!0);
							this._.editor.fire("panelShow", this)
						}, 0, this)
					}, CKEDITOR.env.air ? 200 : 0, this);
					this.visible = 1;
					this.onShow && this.onShow.call(this)
				},
				reposition: function() {
					var a = this._.showBlockParams;
					this.visible && this._.showBlockParams && (this.hide(), this.showBlock.apply(this, a))
				},
				focus: function() {
					if (CKEDITOR.env.webkit) {
						var a = CKEDITOR.document.getActive();
						a && !a.equals(this._.iframe) && a.$.blur()
					}(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
				},
				blur: function() {
					var a = this._.iframe.getFrameDocument().getActive();
					a && a.is("a") && (this._.lastFocused = a)
				},
				hide: function(a) {
					if (this.visible && (!this.onHide || !0 !== this.onHide.call(this))) {
						this.hideChild();
						CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
						this.element.setStyle("display", "none");
						this.visible = 0;
						this.element.getFirst().removeCustomData("activePanel");
						if (a = a && this._.returnFocus) CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(), a.focus();
						delete this._.lastFocused;
						this._.showBlockParams = null;
						this._.editor.fire("panelHide", this)
					}
				},
				allowBlur: function(a) {
					var b = this._.panel;
					void 0 !== a && (b.allowBlur = a);
					return b.allowBlur
				},
				showAsChild: function(a, b, c, f, h, g) {
					if (this._.activeChild != a || a._.panel._.offsetParentId != c.getId()) this.hideChild(), a.onHide = CKEDITOR.tools.bind(function() {
						CKEDITOR.tools.setTimeout(function() {
							this._.focused || this.hide()
						}, 0, this)
					}, this), this._.activeChild = a, this._.focused = !1, a.showBlock(b, c, f, h, g), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function() {
						a.element.getChild(0).$.style.cssText += ""
					}, 100)
				},
				hideChild: function(a) {
					var b = this._.activeChild;
					b && (delete b.onHide, delete this._.activeChild, b.hide(), a && this.focus())
				}
			}
		});
		CKEDITOR.on("instanceDestroyed", function() {
			var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances),
				b;
			for (b in f) {
				var c = f[b];
				a ? c.destroy() : c.element.hide()
			}
			a && (f = {})
		})
	})();
	CKEDITOR.plugins.add("colorbutton", {
		requires: "panelbutton,floatpanel",
		init: function(c) {
			function r(p, h, e, f) {
				var l = new CKEDITOR.style(k["colorButton_" + h + "Style"]),
					m = CKEDITOR.tools.getNextId() + "_colorBox";
				c.ui.add(p, CKEDITOR.UI_PANELBUTTON, {
					label: e,
					title: e,
					modes: {
						wysiwyg: 1
					},
					editorFocus: 0,
					toolbar: "colors," + f,
					allowedContent: l,
					requiredContent: l,
					panel: {
						css: CKEDITOR.skin.getPath("editor"),
						attributes: {
							role: "listbox",
							"aria-label": g.panelTitle
						}
					},
					onBlock: function(a, b) {
						b.autoSize = !0;
						b.element.addClass("cke_colorblock");
						b.element.setHtml(u(a, h, m));
						b.element.getDocument().getBody().setStyle("overflow", "hidden");
						CKEDITOR.ui.fire("ready", this);
						var d = b.keys,
							e = "rtl" == c.lang.dir;
						d[e ? 37 : 39] = "next";
						d[40] = "next";
						d[9] = "next";
						d[e ? 39 : 37] = "prev";
						d[38] = "prev";
						d[CKEDITOR.SHIFT + 9] = "prev";
						d[32] = "click"
					},
					refresh: function() {
						c.activeFilter.check(l) || this.setState(CKEDITOR.TRISTATE_DISABLED)
					},
					onOpen: function() {
						var a = c.getSelection(),
							a = a && a.getStartElement(),
							a = c.elementPath(a),
							b;
						if (a) {
							a = a.block || a.blockLimit || c.document.getBody();
							do b = a && a.getComputedStyle("back" == h ? "background-color" : "color") || "transparent";
							while ("back" == h && "transparent" == b && a && (a = a.getParent()));
							b && "transparent" != b || (b = "#ffffff");
							!1 !== k.colorButton_enableAutomatic && this._.panel._.iframe.getFrameDocument().getById(m).setStyle("background-color", b);
							return b
						}
					}
				})
			}

			function u(p, h, e) {
				var f = [],
					l = k.colorButton_colors.split(","),
					m = c.plugins.colordialog && !1 !== k.colorButton_enableMore,
					a = l.length + (m ? 2 : 1),
					b = CKEDITOR.tools.addFunction(function(a, b) {
						function d(a) {
							this.removeListener("ok", d);
							this.removeListener("cancel", d);
							"ok" == a.name && e(this.getContentElement("picker", "selectedColor").getValue(), b)
						}
						var e = arguments.callee;
						if ("?" == a) c.openDialog("colordialog", function() {
							this.on("ok", d);
							this.on("cancel", d)
						});
						else {
							c.focus();
							p.hide();
							c.fire("saveSnapshot");
							c.removeStyle(new CKEDITOR.style(k["colorButton_" + b + "Style"], {
								color: "inherit"
							}));
							if (a) {
								var f = k["colorButton_" + b + "Style"];
								f.childRule = "back" == b ?
								function(a) {
									return t(a)
								} : function(a) {
									return !(a.is("a") || a.getElementsByTag("a").count()) || t(a)
								};
								c.applyStyle(new CKEDITOR.style(f, {
									color: a
								}))
							}
							c.fire("saveSnapshot")
						}
					});
				!1 !== k.colorButton_enableAutomatic && f.push('<a class="cke_colorauto" _cke_focus=1 hidefocus=true title="', g.auto, '" onclick="CKEDITOR.tools.callFunction(', b, ",null,'", h, "');return false;\" href=\"javascript:void('", g.auto, '\')" role="option" aria-posinset="1" aria-setsize="', a, '"><table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tr><td><span class="cke_colorbox" id="', e, '"></span></td><td colspan=7 align=center>', g.auto, "</td></tr></table></a>");
				f.push('<table role="presentation" cellspacing=0 cellpadding=0 width="100%">');
				for (e = 0; e < l.length; e++) {
					0 === e % 8 && f.push("</tr><tr>");
					var d = l[e].split("/"),
						n = d[0],
						q = d[1] || n;
					d[1] || (n = "#" + n.replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3"));
					d = c.lang.colorbutton.colors[q] || q;
					f.push('<td><a class="cke_colorbox" _cke_focus=1 hidefocus=true title="', d, '" onclick="CKEDITOR.tools.callFunction(', b, ",'", n, "','", h, "'); return false;\" href=\"javascript:void('", d, '\')" role="option" aria-posinset="', e + 2, '" aria-setsize="', a, '"><span class="cke_colorbox" style="background-color:#', q, '"></span></a></td>')
				}
				m && f.push('</tr><tr><td colspan=8 align=center><a class="cke_colormore" _cke_focus=1 hidefocus=true title="', g.more, '" onclick="CKEDITOR.tools.callFunction(', b, ",'?','", h, "');return false;\" href=\"javascript:void('", g.more, "')\"", ' role="option" aria-posinset="', a, '" aria-setsize="', a, '">', g.more, "</a></td>");
				f.push("</tr></table>");
				return f.join("")
			}

			function t(c) {
				return "false" == c.getAttribute("contentEditable") || c.getAttribute("data-nostyle")
			}
			var k = c.config,
				g = c.lang.colorbutton;
			CKEDITOR.env.hc || (r("TextColor", "fore", g.textColorTitle, 10), r("BGColor", "back", g.bgColorTitle, 20))
		}
	});
	CKEDITOR.config.colorButton_colors = "000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF";
	CKEDITOR.config.colorButton_foreStyle = {
		element: "span",
		styles: {
			color: "#(color)"
		},
		overrides: [{
			element: "font",
			attributes: {
				color: null
			}
		}]
	};
	CKEDITOR.config.colorButton_backStyle = {
		element: "span",
		styles: {
			"background-color": "#(color)"
		}
	};
	CKEDITOR.plugins.colordialog = {
		requires: "dialog",
		init: function(b) {
			var c = new CKEDITOR.dialogCommand("colordialog");
			c.editorFocus = !1;
			b.addCommand("colordialog", c);
			CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
			b.getColorFromDialog = function(c, f) {
				var d = function(a) {
						this.removeListener("ok", d);
						this.removeListener("cancel", d);
						a = "ok" == a.name ? this.getValueOf("picker", "selectedColor") : null;
						c.call(f, a)
					},
					e = function(a) {
						a.on("ok", d);
						a.on("cancel", d)
					};
				b.execCommand("colordialog");
				if (b._.storedDialogs && b._.storedDialogs.colordialog) e(b._.storedDialogs.colordialog);
				else CKEDITOR.on("dialogDefinition", function(a) {
					if ("colordialog" == a.data.name) {
						var b = a.data.definition;
						a.removeListener();
						b.onLoad = CKEDITOR.tools.override(b.onLoad, function(a) {
							return function() {
								e(this);
								b.onLoad = a;
								"function" == typeof a && a.call(this)
							}
						})
					}
				})
			}
		}
	};
	CKEDITOR.plugins.add("colordialog", CKEDITOR.plugins.colordialog);
	(function() {
		CKEDITOR.plugins.add("templates", {
			requires: "dialog",
			init: function(a) {
				CKEDITOR.dialog.add("templates", CKEDITOR.getUrl(this.path + "dialogs/templates.js"));
				a.addCommand("templates", new CKEDITOR.dialogCommand("templates"));
				a.ui.addButton && a.ui.addButton("Templates", {
					label: a.lang.templates.button,
					command: "templates",
					toolbar: "doctools,10"
				})
			}
		});
		var c = {},
			f = {};
		CKEDITOR.addTemplates = function(a, d) {
			c[a] = d
		};
		CKEDITOR.getTemplates = function(a) {
			return c[a]
		};
		CKEDITOR.loadTemplates = function(a, d) {
			for (var e = [], b = 0, c = a.length; b < c; b++) f[a[b]] || (e.push(a[b]), f[a[b]] = 1);
			e.length ? CKEDITOR.scriptLoader.load(e, d) : setTimeout(d, 0)
		}
	})();
	CKEDITOR.config.templates_files = [CKEDITOR.getUrl("plugins/templates/templates/default.js")];
	CKEDITOR.config.templates_replaceContent = !0;
	CKEDITOR.plugins.add("menu", {
		requires: "floatpanel",
		beforeInit: function(g) {
			for (var h = g.config.menu_groups.split(","), p = g._.menuGroups = {}, n = g._.menuItems = {}, a = 0; a < h.length; a++) p[h[a]] = a + 1;
			g.addMenuGroup = function(b, a) {
				p[b] = a || 100
			};
			g.addMenuItem = function(a, c) {
				p[c.group] && (n[a] = new CKEDITOR.menuItem(this, a, c))
			};
			g.addMenuItems = function(a) {
				for (var c in a) this.addMenuItem(c, a[c])
			};
			g.getMenuItem = function(a) {
				return n[a]
			};
			g.removeMenuItem = function(a) {
				delete n[a]
			}
		}
	});
	(function() {
		function g(a) {
			a.sort(function(a, c) {
				return a.group < c.group ? -1 : a.group > c.group ? 1 : a.order < c.order ? -1 : a.order > c.order ? 1 : 0
			})
		}
		var h = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (h += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (h += ' onblur="this.style.cssText = this.style.cssText;"');
		var h = h + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),
			p = CKEDITOR.addTemplate("menuItem", h + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
			n = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
		CKEDITOR.menu = CKEDITOR.tools.createClass({
			$: function(a, b) {
				b = this._.definition = b || {};
				this.id = CKEDITOR.tools.getNextId();
				this.editor = a;
				this.items = [];
				this._.listeners = [];
				this._.level = b.level || 1;
				var c = CKEDITOR.tools.extend({}, b.panel, {
					css: [CKEDITOR.skin.getPath("editor")],
					level: this._.level - 1,
					block: {}
				}),
					m = c.block.attributes = c.attributes || {};
				!m.role && (m.role = "menu");
				this._.panelDefinition = c
			},
			_: {
				onShow: function() {
					var a = this.editor.getSelection(),
						b = a && a.getStartElement(),
						c = this.editor.elementPath(),
						m = this._.listeners;
					this.removeAll();
					for (var e = 0; e < m.length; e++) {
						var l = m[e](b, a, c);
						if (l) for (var k in l) {
							var f = this.editor.getMenuItem(k);
							!f || f.command && !this.editor.getCommand(f.command).state || (f.state = l[k], this.add(f))
						}
					}
				},
				onClick: function(a) {
					this.hide();
					if (a.onClick) a.onClick();
					else a.command && this.editor.execCommand(a.command)
				},
				onEscape: function(a) {
					var b = this.parent;
					b ? b._.panel.hideChild(1) : 27 == a && this.hide(1);
					return !1
				},
				onHide: function() {
					this.onHide && this.onHide()
				},
				showSubMenu: function(a) {
					var b = this._.subMenu,
						c = this.items[a];
					if (c = c.getItems && c.getItems()) {
						b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
							level: this._.level + 1
						}, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
						for (var m in c) {
							var e = this.editor.getMenuItem(m);
							e && (e.state = c[m], b.add(e))
						}
						var l = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + String(a));
						setTimeout(function() {
							b.show(l, 2)
						}, 0)
					} else this._.panel.hideChild(1)
				}
			},
			proto: {
				add: function(a) {
					a.order || (a.order = this.items.length);
					this.items.push(a)
				},
				removeAll: function() {
					this.items = []
				},
				show: function(a, b, c, m) {
					if (!this.parent && (this._.onShow(), !this.items.length)) return;
					b = b || ("rtl" == this.editor.lang.dir ? 2 : 1);
					var e = this.items,
						l = this.editor,
						k = this._.panel,
						f = this._.element;
					if (!k) {
						k = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
						k.onEscape = CKEDITOR.tools.bind(function(a) {
							if (!1 === this._.onEscape(a)) return !1
						}, this);
						k.onShow = function() {
							k._.panel.getHolderElement().getParent().addClass("cke").addClass("cke_reset_all")
						};
						k.onHide = CKEDITOR.tools.bind(function() {
							this._.onHide && this._.onHide()
						}, this);
						f = k.addBlock(this.id, this._.panelDefinition.block);
						f.autoSize = !0;
						var d = f.keys;
						d[40] = "next";
						d[9] = "next";
						d[38] = "prev";
						d[CKEDITOR.SHIFT + 9] = "prev";
						d["rtl" == l.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
						d[32] = CKEDITOR.env.ie ? "mouseup" : "click";
						CKEDITOR.env.ie && (d[13] = "mouseup");
						f = this._.element = f.element;
						d = f.getDocument();
						d.getBody().setStyle("overflow", "hidden");
						d.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
						this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
							clearTimeout(this._.showSubTimeout);
							this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, l.config.menu_subMenuDelay || 400, this, [a])
						}, this);
						this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
							clearTimeout(this._.showSubTimeout)
						}, this);
						this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) {
							var b = this.items[a];
							if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1);
							else if (b.getItems) this._.showSubMenu(a);
							else this._.onClick(b)
						}, this)
					}
					g(e);
					for (var d = l.elementPath(), d = ['<div class="cke_menu' + (d && d.direction() != l.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], h = e.length, p = h && e[0].group, n = 0; n < h; n++) {
						var q = e[n];
						p != q.group && (d.push('<div class="cke_menuseparator" role="separator"></div>'), p = q.group);
						q.render(this, n, d)
					}
					d.push("</div>");
					f.setHtml(d.join(""));
					CKEDITOR.ui.fire("ready", this);
					this.parent ? this.parent._.panel.showAsChild(k, this.id, a, b, c, m) : k.showBlock(this.id, a, b, c, m);
					l.fire("menuShow", [k])
				},
				addListener: function(a) {
					this._.listeners.push(a)
				},
				hide: function(a) {
					this._.onHide && this._.onHide();
					this._.panel && this._.panel.hide(a)
				}
			}
		});
		CKEDITOR.menuItem = CKEDITOR.tools.createClass({
			$: function(a, b, c) {
				CKEDITOR.tools.extend(this, c, {
					order: 0,
					className: "cke_menubutton__" + b
				});
				this.group = a._.menuGroups[this.group];
				this.editor = a;
				this.name = b
			},
			proto: {
				render: function(a, b, c) {
					var h = a.id + String(b),
						e = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state,
						l = "",
						k = e == CKEDITOR.TRISTATE_ON ? "on" : e == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
					this.role in {
						menuitemcheckbox: 1,
						menuitemradio: 1
					} && (l = ' aria-checked="' + (e == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
					var f = this.getItems,
						d = "&#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";",
						g = this.name;
					this.icon && !/\./.test(this.icon) && (g = this.icon);
					a = {
						id: h,
						name: this.name,
						iconName: g,
						label: this.label,
						cls: this.className || "",
						state: k,
						hasPopup: f ? "true" : "false",
						disabled: e == CKEDITOR.TRISTATE_DISABLED,
						title: this.label,
						href: "javascript:void('" + (this.label || "").replace("'") + "')",
						hoverFn: a._.itemOverFn,
						moveOutFn: a._.itemOutFn,
						clickFn: a._.itemClickFn,
						index: b,
						iconStyle: CKEDITOR.skin.getIconStyle(g, "rtl" == this.editor.lang.dir, g == this.icon ? null : this.icon, this.iconOffset),
						arrowHtml: f ? n.output({
							label: d
						}) : "",
						role: this.role ? this.role : "menuitem",
						ariaChecked: l
					};
					p.output(a, c)
				}
			}
		})
	})();
	CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
	CKEDITOR.plugins.add("contextmenu", {
		requires: "menu",
		onLoad: function() {
			CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
				base: CKEDITOR.menu,
				$: function(a) {
					this.base.call(this, a, {
						panel: {
							className: "cke_menu_panel",
							attributes: {
								"aria-label": a.lang.contextmenu.options
							}
						}
					})
				},
				proto: {
					addTarget: function(a, e) {
						a.on("contextmenu", function(a) {
							a = a.data;
							var c = CKEDITOR.env.webkit ? f : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
							if (!e || !c) {
								a.preventDefault();
								if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
									var c = this.editor,
										b = (new CKEDITOR.dom.elementPath(a.getTarget(), c.editable())).contains(function(a) {
											return a.hasAttribute("contenteditable")
										}, !0);
									b && "false" == b.getAttribute("contenteditable") && c.getSelection().fake(b)
								}
								var b = a.getTarget().getDocument(),
									d = a.getTarget().getDocument().getDocumentElement(),
									c = !b.equals(CKEDITOR.document),
									b = b.getWindow().getScrollPosition(),
									g = c ? a.$.clientX : a.$.pageX || b.x + a.$.clientX,
									h = c ? a.$.clientY : a.$.pageY || b.y + a.$.clientY;
								CKEDITOR.tools.setTimeout(function() {
									this.open(d, null, g, h)
								}, CKEDITOR.env.ie ? 200 : 0, this)
							}
						}, this);
						if (CKEDITOR.env.webkit) {
							var f, d = function() {
									f = 0
								};
							a.on("keydown", function(a) {
								f = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
							});
							a.on("keyup", d);
							a.on("contextmenu", d)
						}
					},
					open: function(a, e, f, d) {
						this.editor.focus();
						a = a || CKEDITOR.document.getDocumentElement();
						this.editor.selectionChange(1);
						this.show(a, e, f, d)
					}
				}
			})
		},
		beforeInit: function(a) {
			var e = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
			a.on("contentDom", function() {
				e.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl)
			});
			a.addCommand("contextMenu", {
				exec: function() {
					a.contextMenu.open(a.document.getBody())
				}
			});
			a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
			a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
		}
	});
	(function() {
		CKEDITOR.plugins.add("div", {
			requires: "dialog",
			init: function(a) {
				if (!a.blockless) {
					var c = a.lang.div,
						b = "div(*)";
					CKEDITOR.dialog.isTabEnabled(a, "editdiv", "advanced") && (b += ";div[dir,id,lang,title]{*}");
					a.addCommand("creatediv", new CKEDITOR.dialogCommand("creatediv", {
						allowedContent: b,
						requiredContent: "div",
						contextSensitive: !0,
						refresh: function(a, c) {
							this.setState("div" in (a.config.div_wrapTable ? c.root : c.blockLimit).getDtd() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
						}
					}));
					a.addCommand("editdiv", new CKEDITOR.dialogCommand("editdiv", {
						requiredContent: "div"
					}));
					a.addCommand("removediv", {
						requiredContent: "div",
						exec: function(a) {
							function c(b) {
								(b = CKEDITOR.plugins.div.getSurroundDiv(a, b)) && !b.data("cke-div-added") && (f.push(b), b.data("cke-div-added"))
							}
							for (var b = a.getSelection(), g = b && b.getRanges(), e, h = b.createBookmarks(), f = [], d = 0; d < g.length; d++) e = g[d], e.collapsed ? c(b.getStartElement()) : (e = new CKEDITOR.dom.walker(e), e.evaluator = c, e.lastForward());
							for (d = 0; d < f.length; d++) f[d].remove(!0);
							b.selectBookmarks(h)
						}
					});
					a.ui.addButton && a.ui.addButton("CreateDiv", {
						label: c.toolbar,
						command: "creatediv",
						toolbar: "blocks,50"
					});
					a.addMenuItems && (a.addMenuItems({
						editdiv: {
							label: c.edit,
							command: "editdiv",
							group: "div",
							order: 1
						},
						removediv: {
							label: c.remove,
							command: "removediv",
							group: "div",
							order: 5
						}
					}), a.contextMenu && a.contextMenu.addListener(function(b) {
						return !b || b.isReadOnly() ? null : CKEDITOR.plugins.div.getSurroundDiv(a) ? {
							editdiv: CKEDITOR.TRISTATE_OFF,
							removediv: CKEDITOR.TRISTATE_OFF
						} : null
					}));
					CKEDITOR.dialog.add("creatediv", this.path + "dialogs/div.js");
					CKEDITOR.dialog.add("editdiv", this.path + "dialogs/div.js")
				}
			}
		});
		CKEDITOR.plugins.div = {
			getSurroundDiv: function(a, c) {
				var b = a.elementPath(c);
				return a.elementPath(b.blockLimit).contains(function(a) {
					return a.is("div") && !a.isReadOnly()
				}, 1)
			}
		}
	})();
	CKEDITOR.plugins.add("resize", {
		init: function(b) {
			function f(d) {
				var e = c.width,
					m = c.height,
					f = e + (d.data.$.screenX - n.x) * ("rtl" == g ? -1 : 1);
				d = m + (d.data.$.screenY - n.y);
				h && (e = Math.max(a.resize_minWidth, Math.min(f, a.resize_maxWidth)));
				p && (m = Math.max(a.resize_minHeight, Math.min(d, a.resize_maxHeight)));
				b.resize(h ? e : null, m)
			}

			function k() {
				CKEDITOR.document.removeListener("mousemove", f);
				CKEDITOR.document.removeListener("mouseup", k);
				b.document && (b.document.removeListener("mousemove", f), b.document.removeListener("mouseup", k))
			}
			var a = b.config,
				r = b.ui.spaceId("resizer"),
				g = b.element ? b.element.getDirection(1) : "ltr";
			!a.resize_dir && (a.resize_dir = "vertical");
			void 0 === a.resize_maxWidth && (a.resize_maxWidth = 3E3);
			void 0 === a.resize_maxHeight && (a.resize_maxHeight = 3E3);
			void 0 === a.resize_minWidth && (a.resize_minWidth = 750);
			void 0 === a.resize_minHeight && (a.resize_minHeight = 250);
			if (!1 !== a.resize_enabled) {
				var l = null,
					n, c, h = ("both" == a.resize_dir || "horizontal" == a.resize_dir) && a.resize_minWidth != a.resize_maxWidth,
					p = ("both" == a.resize_dir || "vertical" == a.resize_dir) && a.resize_minHeight != a.resize_maxHeight,
					q = CKEDITOR.tools.addFunction(function(d) {
						l || (l = b.getResizable());
						c = {
							width: l.$.offsetWidth || 0,
							height: l.$.offsetHeight || 0
						};
						n = {
							x: d.screenX,
							y: d.screenY
						};
						a.resize_minWidth > c.width && (a.resize_minWidth = c.width);
						a.resize_minHeight > c.height && (a.resize_minHeight = c.height);
						CKEDITOR.document.on("mousemove", f);
						CKEDITOR.document.on("mouseup", k);
						b.document && (b.document.on("mousemove", f), b.document.on("mouseup", k));
						d.preventDefault && d.preventDefault()
					});
				b.on("destroy", function() {
					CKEDITOR.tools.removeFunction(q)
				});
				b.on("uiSpace", function(a) {
					if ("bottom" == a.data.space) {
						var e = "";
						h && !p && (e = " cke_resizer_horizontal");
						!h && p && (e = " cke_resizer_vertical");
						var c = '<span id="' + r + '" class="cke_resizer' + e + " cke_resizer_" + g + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + q + ', event)">' + ("ltr" == g ? "◢" : "◣") + "</span>";
						"ltr" == g && "ltr" == e ? a.data.html += c : a.data.html = c + a.data.html
					}
				}, b, null, 100);
				b.on("maximize", function(a) {
					b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
				})
			}
		}
	});
	(function() {
		function B(a) {
			function d() {
				for (var b = g(), e = CKEDITOR.tools.clone(a.config.toolbarGroups) || q(a), f = 0; f < e.length; f++) {
					var l = e[f];
					if ("/" != l) {
						"string" == typeof l && (l = e[f] = {
							name: l
						});
						var m, d = l.groups;
						if (d) for (var h = 0; h < d.length; h++) m = d[h], (m = b[m]) && c(l, m);
						(m = b[l.name]) && c(l, m)
					}
				}
				return e
			}

			function g() {
				var b = {},
					c, f, e;
				for (c in a.ui.items) f = a.ui.items[c], e = f.toolbar || "others", e = e.split(","), f = e[0], e = parseInt(e[1] || -1, 10), b[f] || (b[f] = []), b[f].push({
					name: c,
					order: e
				});
				for (f in b) b[f] = b[f].sort(function(b, a) {
					return b.order == a.order ? 0 : 0 > a.order ? -1 : 0 > b.order ? 1 : b.order < a.order ? -1 : 1
				});
				return b
			}

			function c(c, e) {
				if (e.length) {
					c.items ? c.items.push(a.ui.create("-")) : c.items = [];
					for (var f; f = e.shift();) f = "string" == typeof f ? f : f.name, b && -1 != CKEDITOR.tools.indexOf(b, f) || (f = a.ui.create(f)) && a.addFeature(f) && c.items.push(f)
				}
			}

			function h(b) {
				var a = [],
					e, d, h;
				for (e = 0; e < b.length; ++e) d = b[e], h = {}, "/" == d ? a.push(d) : CKEDITOR.tools.isArray(d) ? (c(h, CKEDITOR.tools.clone(d)), a.push(h)) : d.items && (c(h, CKEDITOR.tools.clone(d.items)), h.name = d.name, a.push(h));
				return a
			}
			var b = a.config.removeButtons,
				b = b && b.split(","),
				e = a.config.toolbar;
			"string" == typeof e && (e = a.config["toolbar_" + e]);
			return a.toolbar = e ? h(e) : d()
		}

		function q(a) {
			return a._.toolbarGroups || (a._.toolbarGroups = [{
				name: "document",
				groups: ["mode", "document", "doctools"]
			}, {
				name: "clipboard",
				groups: ["clipboard", "undo"]
			}, {
				name: "editing",
				groups: ["find", "selection", "spellchecker"]
			}, {
				name: "forms"
			}, "/",
			{
				name: "basicstyles",
				groups: ["basicstyles", "cleanup"]
			}, {
				name: "paragraph",
				groups: ["list", "indent", "blocks", "align", "bidi"]
			}, {
				name: "links"
			}, {
				name: "insert"
			}, "/",
			{
				name: "styles"
			}, {
				name: "colors"
			}, {
				name: "tools"
			}, {
				name: "others"
			}, {
				name: "about"
			}])
		}
		var y = function() {
				this.toolbars = [];
				this.focusCommandExecuted = !1
			};
		y.prototype.focus = function() {
			for (var a = 0, d; d = this.toolbars[a++];) for (var g = 0, c; c = d.items[g++];) if (c.focus) {
				c.focus();
				return
			}
		};
		var C = {
			modes: {
				wysiwyg: 1,
				source: 1
			},
			readOnly: 1,
			exec: function(a) {
				a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function() {
					a.toolbox.focus()
				}, 100) : a.toolbox.focus())
			}
		};
		CKEDITOR.plugins.add("toolbar", {
			requires: "button",
			init: function(a) {
				var d, g = function(c, h) {
						var b, e = "rtl" == a.lang.dir,
							k = a.config.toolbarGroupCycling,
							r = e ? 37 : 39,
							e = e ? 39 : 37,
							k = void 0 === k || k;
						switch (h) {
						case 9:
						case CKEDITOR.SHIFT + 9:
							for (; !b || !b.items.length;) if (b = 9 == h ? (b ? b.next : c.toolbar.next) || a.toolbox.toolbars[0] : (b ? b.previous : c.toolbar.previous) || a.toolbox.toolbars[a.toolbox.toolbars.length - 1], b.items.length) for (c = b.items[d ? b.items.length - 1 : 0]; c && !c.focus;)(c = d ? c.previous : c.next) || (b = 0);
							c && c.focus();
							return !1;
						case r:
							b = c;
							do b = b.next, !b && k && (b = c.toolbar.items[0]);
							while (b && !b.focus);
							b ? b.focus() : g(c, 9);
							return !1;
						case 40:
							return c.button && c.button.hasArrow ? (a.once("panelShow", function(b) {
								b.data._.panel._.currentBlock.onKeyDown(40)
							}), c.execute()) : g(c, 40 == h ? r : e), !1;
						case e:
						case 38:
							b = c;
							do b = b.previous, !b && k && (b = c.toolbar.items[c.toolbar.items.length - 1]);
							while (b && !b.focus);
							b ? b.focus() : (d = 1, g(c, CKEDITOR.SHIFT + 9), d = 0);
							return !1;
						case 27:
							return a.focus(), !1;
						case 13:
						case 32:
							return c.execute(), !1
						}
						return !0
					};
				a.on("uiSpace", function(c) {
					if (c.data.space == a.config.toolbarLocation) {
						c.removeListener();
						a.toolbox = new y;
						var d = CKEDITOR.tools.getNextId(),
							b = ['<span id="', d, '" class="cke_voice_label">', a.lang.toolbar.toolbars, "</span>", '<span id="' + a.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d, '" onmousedown="return false;">'],
							d = !1 !== a.config.toolbarStartupExpanded,
							e, k;
						a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && b.push('<span class="cke_toolbox_main"' + (d ? ">" : ' style="display:none">'));
						for (var r = a.toolbox.toolbars, f = B(a), l = 0; l < f.length; l++) {
							var m, n = 0,
								v, p = f[l],
								w;
							if (p) if (e && (b.push("</span>"), k = e = 0), "/" === p) b.push('<span class="cke_toolbar_break"></span>');
							else {
								w = p.items || p;
								for (var x = 0; x < w.length; x++) {
									var t = w[x],
										q;
									if (t) {
										var z = function(c) {
												c = c.render(a, b);
												u = n.items.push(c) - 1;
												0 < u && (c.previous = n.items[u - 1], c.previous.next = c);
												c.toolbar = n;
												c.onkey = g;
												c.onfocus = function() {
													a.toolbox.focusCommandExecuted || a.focus()
												}
											};
										if (t.type == CKEDITOR.UI_SEPARATOR) k = e && t;
										else {
											q = !1 !== t.canGroup;
											if (!n) {
												m = CKEDITOR.tools.getNextId();
												n = {
													id: m,
													items: []
												};
												v = p.name && (a.lang.toolbar.toolbarGroups[p.name] || p.name);
												b.push('<span id="', m, '" class="cke_toolbar"', v ? ' aria-labelledby="' + m + '_label"' : "", ' role="toolbar">');
												v && b.push('<span id="', m, '_label" class="cke_voice_label">', v, "</span>");
												b.push('<span class="cke_toolbar_start"></span>');
												var u = r.push(n) - 1;
												0 < u && (n.previous = r[u - 1], n.previous.next = n)
											}
											q ? e || (b.push('<span class="cke_toolgroup" role="presentation">'), e = 1) : e && (b.push("</span>"), e = 0);
											k && (z(k), k = 0);
											z(t)
										}
									}
								}
								e && (b.push("</span>"), k = e = 0);
								n && b.push('<span class="cke_toolbar_end"></span></span>')
							}
						}
						a.config.toolbarCanCollapse && b.push("</span>");
						if (a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
							var A = CKEDITOR.tools.addFunction(function() {
								a.execCommand("toolbarCollapse")
							});
							a.on("destroy", function() {
								CKEDITOR.tools.removeFunction(A)
							});
							a.addCommand("toolbarCollapse", {
								readOnly: 1,
								exec: function(b) {
									var a = b.ui.space("toolbar_collapser"),
										c = a.getPrevious(),
										e = b.ui.space("contents"),
										d = c.getParent(),
										f = parseInt(e.$.style.height, 10),
										h = d.$.offsetHeight,
										g = a.hasClass("cke_toolbox_collapser_min");
									g ? (c.show(), a.removeClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarCollapse)) : (c.hide(), a.addClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarExpand));
									a.getFirst().setText(g ? "▲" : "◀");
									e.setStyle("height", f - (d.$.offsetHeight - h) + "px");
									b.fire("resize", {
										outerHeight: b.container.$.offsetHeight,
										contentsHeight: e.$.offsetHeight,
										outerWidth: b.container.$.offsetWidth
									})
								},
								modes: {
									wysiwyg: 1,
									source: 1
								}
							});
							a.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
							b.push('<a title="' + (d ? a.lang.toolbar.toolbarCollapse : a.lang.toolbar.toolbarExpand) + '" id="' + a.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
							d || b.push(" cke_toolbox_collapser_min");
							b.push('" onclick="CKEDITOR.tools.callFunction(' + A + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
						}
						b.push("</span>");
						c.data.html += b.join("")
					}
				});
				a.on("destroy", function() {
					if (this.toolbox) {
						var a, d = 0,
							b, e, g;
						for (a = this.toolbox.toolbars; d < a.length; d++) for (e = a[d].items, b = 0; b < e.length; b++) g = e[b], g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn), g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn)
					}
				});
				a.on("uiReady", function() {
					var c = a.ui.space("toolbox");
					c && a.focusManager.add(c, 1)
				});
				a.addCommand("toolbarFocus", C);
				a.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
				a.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
				a.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
					create: function() {
						return {
							render: function(a, d) {
								d.push('<span class="cke_toolbar_separator" role="separator"></span>');
								return {}
							}
						}
					}
				})
			}
		});
		CKEDITOR.ui.prototype.addToolbarGroup = function(a, d, g) {
			var c = q(this.editor),
				h = 0 === d,
				b = {
					name: a
				};
			if (g) {
				if (g = CKEDITOR.tools.search(c, function(a) {
					return a.name == g
				})) {
					!g.groups && (g.groups = []);
					if (d && (d = CKEDITOR.tools.indexOf(g.groups, d), 0 <= d)) {
						g.groups.splice(d + 1, 0, a);
						return
					}
					h ? g.groups.splice(0, 0, a) : g.groups.push(a);
					return
				}
				d = null
			}
			d && (d = CKEDITOR.tools.indexOf(c, function(a) {
				return a.name == d
			}));
			h ? c.splice(0, 0, a) : "number" == typeof d ? c.splice(d + 1, 0, b) : c.push(a)
		}
	})();
	CKEDITOR.UI_SEPARATOR = "separator";
	CKEDITOR.config.toolbarLocation = "top";
	(function() {
		function q(a, d) {
			function l(c) {
				c = k.list[c];
				if (c.equals(a.editable()) || "true" == c.getAttribute("contenteditable")) {
					var e = a.createRange();
					e.selectNodeContents(c);
					e.select()
				} else a.getSelection().selectElement(c);
				a.focus()
			}

			function m() {
				n && n.setHtml('<span class="cke_path_empty">&nbsp;</span>');
				delete k.list
			}
			var p = a.ui.spaceId("path"),
				n, k = a._.elementsPath,
				q = k.idBase;
			d.html += '<span id="' + p + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + p + '" class="cke_path" role="group" aria-labelledby="' + p + '_label"><span class="cke_path_empty">&nbsp;</span></span>';
			a.on("uiReady", function() {
				var c = a.ui.space("path");
				c && a.focusManager.add(c, 1)
			});
			k.onClick = l;
			var v = CKEDITOR.tools.addFunction(l),
				w = CKEDITOR.tools.addFunction(function(c, e) {
					var g = k.idBase,
						b;
					e = new CKEDITOR.dom.event(e);
					b = "rtl" == a.lang.dir;
					switch (e.getKeystroke()) {
					case b ? 39:
						37 : case 9:
						return (b = CKEDITOR.document.getById(g + (c + 1))) || (b = CKEDITOR.document.getById(g + "0")), b.focus(), !1;
					case b ? 37:
						39 : case CKEDITOR.SHIFT + 9:
						return (b = CKEDITOR.document.getById(g + (c - 1))) || (b = CKEDITOR.document.getById(g + (k.list.length - 1))), b.focus(), !1;
					case 27:
						return a.focus(), !1;
					case 13:
					case 32:
						return l(c), !1
					}
					return !0
				});
			a.on("selectionChange", function() {
				for (var c = [], e = k.list = [], g = [], b = k.filters, d = !0, l = a.elementPath().elements, f, u = l.length; u--;) {
					var h = l[u],
						r = 0;
					f = h.data("cke-display-name") ? h.data("cke-display-name") : h.data("cke-real-element-type") ? h.data("cke-real-element-type") : h.getName();
					(d = h.hasAttribute("contenteditable") ? "true" == h.getAttribute("contenteditable") : d) || h.hasAttribute("contenteditable") || (r = 1);
					for (var t = 0; t < b.length; t++) {
						var m = b[t](h, f);
						if (!1 === m) {
							r = 1;
							break
						}
						f = m || f
					}
					r || (e.unshift(h), g.unshift(f))
				}
				e = e.length;
				for (b = 0; b < e; b++) f = g[b], d = a.lang.elementspath.eleTitle.replace(/%1/, f), f = x.output({
					id: q + b,
					label: d,
					text: f,
					jsTitle: "javascript:void('" + f + "')",
					index: b,
					keyDownFn: w,
					clickFn: v
				}), c.unshift(f);
				n || (n = CKEDITOR.document.getById(p));
				g = n;
				g.setHtml(c.join("") + '<span class="cke_path_empty">&nbsp;</span>');
				a.fire("elementsPathUpdate", {
					space: g
				})
			});
			a.on("readOnly", m);
			a.on("contentDomUnload", m);
			a.addCommand("elementsPathFocus", y.toolbarFocus);
			a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
		}
		var y = {
			toolbarFocus: {
				editorFocus: !1,
				readOnly: 1,
				exec: function(a) {
					(a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
				}
			}
		},
			d = "";
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (d += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
		var x = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + d + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
		CKEDITOR.plugins.add("elementspath", {
			init: function(a) {
				a._.elementsPath = {
					idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
					filters: []
				};
				a.on("uiSpace", function(d) {
					"bottom" == d.data.space && q(a, d.data)
				})
			}
		})
	})();
	(function() {
		function q(b, d, a) {
			a = b.config.forceEnterMode || a;
			"wysiwyg" == b.mode && (d || (d = b.activeEnterMode), b.elementPath().isContextFor("p") || (d = CKEDITOR.ENTER_BR, a = 1), b.fire("saveSnapshot"), d == CKEDITOR.ENTER_BR ? t(b, d, null, a) : u(b, d, null, a), b.fire("saveSnapshot"))
		}

		function v(b) {
			b = b.getSelection().getRanges(!0);
			for (var d = b.length - 1; 0 < d; d--) b[d].deleteContents();
			return b[0]
		}

		function y(b) {
			var d = b.startContainer.getAscendant(function(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && "true" == a.getAttribute("contenteditable")
			}, !0);
			if (b.root.equals(d)) return b;
			d = new CKEDITOR.dom.range(d);
			d.moveToRange(b);
			return d
		}
		CKEDITOR.plugins.add("enterkey", {
			init: function(b) {
				b.addCommand("enter", {
					modes: {
						wysiwyg: 1
					},
					editorFocus: !1,
					exec: function(b) {
						q(b)
					}
				});
				b.addCommand("shiftEnter", {
					modes: {
						wysiwyg: 1
					},
					editorFocus: !1,
					exec: function(b) {
						q(b, b.activeShiftEnterMode, 1)
					}
				});
				b.setKeystroke([
					[13, "enter"],
					[CKEDITOR.SHIFT + 13, "shiftEnter"]
				])
			}
		});
		var z = CKEDITOR.dom.walker.whitespaces(),
			A = CKEDITOR.dom.walker.bookmark();
		CKEDITOR.plugins.enterkey = {
			enterBlock: function(b, d, a, h) {
				if (a = a || v(b)) {
					a = y(a);
					var f = a.document,
						k = a.checkStartOfBlock(),
						m = a.checkEndOfBlock(),
						l = b.elementPath(a.startContainer),
						c = l.block,
						n = d == CKEDITOR.ENTER_DIV ? "div" : "p",
						e;
					if (k && m) {
						if (c && (c.is("li") || c.getParent().is("li"))) {
							c.is("li") || (c = c.getParent());
							a = c.getParent();
							e = a.getParent();
							h = !c.hasPrevious();
							var p = !c.hasNext(),
								n = b.getSelection(),
								g = n.createBookmarks(),
								k = c.getDirection(1),
								m = c.getAttribute("class"),
								r = c.getAttribute("style"),
								q = e.getDirection(1) != k;
							b = b.enterMode != CKEDITOR.ENTER_BR || q || r || m;
							if (e.is("li")) h || p ? (h && p && a.remove(), c[p ? "insertAfter" : "insertBefore"](e)) : c.breakParent(e);
							else {
								if (b) if (l.block.is("li") ? (e = f.createElement(d == CKEDITOR.ENTER_P ? "p" : "div"), q && e.setAttribute("dir", k), r && e.setAttribute("style", r), m && e.setAttribute("class", m), c.moveChildren(e)) : e = l.block, h || p) e[h ? "insertBefore" : "insertAfter"](a);
								else c.breakParent(a), e.insertAfter(a);
								else if (c.appendBogus(!0), h || p) for (; f = c[h ? "getFirst" : "getLast"]();) f[h ? "insertBefore" : "insertAfter"](a);
								else for (c.breakParent(a); f = c.getLast();) f.insertAfter(a);
								c.remove()
							}
							n.selectBookmarks(g);
							return
						}
						if (c && c.getParent().is("blockquote")) {
							c.breakParent(c.getParent());
							c.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || c.getPrevious().remove();
							c.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || c.getNext().remove();
							a.moveToElementEditStart(c);
							a.select();
							return
						}
					} else if (c && c.is("pre") && !m) {
						t(b, d, a, h);
						return
					}
					if (k = a.splitBlock(n)) {
						d = k.previousBlock;
						c = k.nextBlock;
						l = k.wasStartOfBlock;
						b = k.wasEndOfBlock;
						c ? (g = c.getParent(), g.is("li") && (c.breakParent(g), c.move(c.getNext(), 1))) : d && (g = d.getParent()) && g.is("li") && (d.breakParent(g), g = d.getNext(), a.moveToElementEditStart(g), d.move(d.getPrevious()));
						if (l || b) {
							if (d) {
								if (d.is("li") || !w.test(d.getName()) && !d.is("pre")) e = d.clone()
							} else c && (e = c.clone());
							e ? h && !e.is("li") && e.renameNode(n) : g && g.is("li") ? e = g : (e = f.createElement(n), d && (p = d.getDirection()) && e.setAttribute("dir", p));
							if (f = k.elementPath) for (h = 0, n = f.elements.length; h < n; h++) {
								g = f.elements[h];
								if (g.equals(f.block) || g.equals(f.blockLimit)) break;
								CKEDITOR.dtd.$removeEmpty[g.getName()] && (g = g.clone(), e.moveChildren(g), e.append(g))
							}
							e.appendBogus();
							e.getParent() || a.insertNode(e);
							e.is("li") && e.removeAttribute("value");
							!CKEDITOR.env.ie || !l || b && d.getChildCount() || (a.moveToElementEditStart(b ? d : e), a.select());
							a.moveToElementEditStart(l && !b ? c : e)
						} else c.is("li") && (e = a.clone(), e.selectNodeContents(c), e = new CKEDITOR.dom.walker(e), e.evaluator = function(a) {
							return !(A(a) || z(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
						}, (g = e.next()) && g.type == CKEDITOR.NODE_ELEMENT && g.is("ul", "ol") && (CKEDITOR.env.needsBrFiller ? f.createElement("br") : f.createText(" ")).insertBefore(g)), c && a.moveToElementEditStart(c);
						a.select();
						a.scrollIntoView()
					}
				}
			},
			enterBr: function(b, d, a, h) {
				if (a = a || v(b)) {
					var f = a.document,
						k = a.checkEndOfBlock(),
						m = new CKEDITOR.dom.elementPath(b.getSelection().getStartElement()),
						l = m.block,
						c = l && m.block.getName();
					h || "li" != c ? (!h && k && w.test(c) ? (k = l.getDirection()) ? (f = f.createElement("div"), f.setAttribute("dir", k), f.insertAfter(l), a.setStart(f, 0)) : (f.createElement("br").insertAfter(l), CKEDITOR.env.gecko && f.createText("").insertAfter(l), a.setStartAt(l.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (b = "pre" == c && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? f.createText("\r") : f.createElement("br"), a.deleteContents(), a.insertNode(b), CKEDITOR.env.needsBrFiller ? (f.createText("﻿").insertAfter(b), k && (l || m.blockLimit).appendBogus(), b.getNext().$.nodeValue = "", a.setStartAt(b.getNext(), CKEDITOR.POSITION_AFTER_START)) : a.setStartAt(b, CKEDITOR.POSITION_AFTER_END)), a.collapse(!0), a.select(), a.scrollIntoView()) : u(b, d, a, h)
				}
			}
		};
		var x = CKEDITOR.plugins.enterkey,
			t = x.enterBr,
			u = x.enterBlock,
			w = /^h[1-6]$/
	})();
	(function() {
		function k(b, f) {
			var g = {},
				c = [],
				e = {
					nbsp: " ",
					shy: "­",
					gt: ">",
					lt: "<",
					amp: "&",
					apos: "'",
					quot: '"'
				};
			b = b.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(b, a) {
				var d = f ? "&" + a + ";" : e[a];
				g[d] = f ? e[a] : "&" + a + ";";
				c.push(d);
				return ""
			});
			if (!f && b) {
				b = b.split(",");
				var a = document.createElement("div"),
					d;
				a.innerHTML = "&" + b.join(";&") + ";";
				d = a.innerHTML;
				a = null;
				for (a = 0; a < d.length; a++) {
					var h = d.charAt(a);
					g[h] = "&" + b[a] + ";";
					c.push(h)
				}
			}
			g.regex = c.join(f ? "|" : "");
			return g
		}
		CKEDITOR.plugins.add("entities", {
			afterInit: function(b) {
				function f(a) {
					return h[a]
				}

				function g(b) {
					return "force" != c.entities_processNumerical && a[b] ? a[b] : "&#" + b.charCodeAt(0) + ";"
				}
				var c = b.config;
				if (b = (b = b.dataProcessor) && b.htmlFilter) {
					var e = [];
					!1 !== c.basicEntities && e.push("nbsp,gt,lt,amp");
					c.entities && (e.length && e.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"), c.entities_latin && e.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), c.entities_greek && e.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"), c.entities_additional && e.push(c.entities_additional));
					var a = k(e.join(",")),
						d = a.regex ? "[" + a.regex + "]" : "a^";
					delete a.regex;
					c.entities && c.entities_processNumerical && (d = "[^ -~]|" + d);
					var d = new RegExp(d, "g"),
						h = k("nbsp,gt,lt,amp,shy", !0),
						l = new RegExp(h.regex, "g");
					b.addRules({
						text: function(a) {
							return a.replace(l, f).replace(d, g)
						}
					}, {
						applyToAll: !0,
						excludeNestedEditable: !0
					})
				}
			}
		})
	})();
	CKEDITOR.config.basicEntities = !0;
	CKEDITOR.config.entities = !0;
	CKEDITOR.config.entities_latin = !0;
	CKEDITOR.config.entities_greek = !0;
	CKEDITOR.config.entities_additional = "#39";
	CKEDITOR.plugins.add("popup");
	CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
		popup: function(e, a, b, d) {
			a = a || "80%";
			b = b || "70%";
			"string" == typeof a && 1 < a.length && "%" == a.substr(a.length - 1, 1) && (a = parseInt(window.screen.width * parseInt(a, 10) / 100, 10));
			"string" == typeof b && 1 < b.length && "%" == b.substr(b.length - 1, 1) && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
			640 > a && (a = 640);
			420 > b && (b = 420);
			var f = parseInt((window.screen.height - b) / 2, 10),
				g = parseInt((window.screen.width - a) / 2, 10);
			d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + a + ",height=" + b + ",top=" + f + ",left=" + g;
			var c = window.open("", null, d, !0);
			if (!c) return !1;
			try {
				-1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (c.moveTo(g, f), c.resizeTo(a, b)), c.focus(), c.location.href = e
			} catch (h) {
				window.open(e, null, d, !0)
			}
			return !0
		}
	});
	(function() {
		function g(a, c) {
			var d = [];
			if (c) for (var b in c) d.push(b + "=" + encodeURIComponent(c[b]));
			else return a;
			return a + (-1 != a.indexOf("?") ? "&" : "?") + d.join("&")
		}

		function k(a) {
			a += "";
			return a.charAt(0).toUpperCase() + a.substr(1)
		}

		function m() {
			var a = this.getDialog(),
				c = a.getParentEditor();
			c._.filebrowserSe = this;
			var d = c.config["filebrowser" + k(a.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%",
				a = c.config["filebrowser" + k(a.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%",
				b = this.filebrowser.params || {};
			b.CKEditor = c.name;
			b.CKEditorFuncNum = c._.filebrowserFn;
			b.langCode || (b.langCode = c.langCode);
			b = g(this.filebrowser.url, b);
			c.popup(b, d, a, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
		}

		function n() {
			var a = this.getDialog();
			a.getParentEditor()._.filebrowserSe = this;
			return a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value && a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !0 : !1
		}

		function p(a, c, d) {
			var b = d.params || {};
			b.CKEditor = a.name;
			b.CKEditorFuncNum = a._.filebrowserFn;
			b.langCode || (b.langCode = a.langCode);
			c.action = g(d.url, b);
			c.filebrowser = d
		}

		function l(a, c, d, b) {
			if (b && b.length) for (var e, g = b.length; g--;) if (e = b[g], "hbox" != e.type && "vbox" != e.type && "fieldset" != e.type || l(a, c, d, e.children), e.filebrowser) if ("string" == typeof e.filebrowser && (e.filebrowser = {
				action: "fileButton" == e.type ? "QuickUpload" : "Browse",
				target: e.filebrowser
			}), "Browse" == e.filebrowser.action) {
				var f = e.filebrowser.url;
				void 0 === f && (f = a.config["filebrowser" + k(c) + "BrowseUrl"], void 0 === f && (f = a.config.filebrowserBrowseUrl));
				f && (e.onClick = m, e.filebrowser.url = f, e.hidden = !1)
			} else if ("QuickUpload" == e.filebrowser.action && e["for"] && (f = e.filebrowser.url, void 0 === f && (f = a.config["filebrowser" + k(c) + "UploadUrl"], void 0 === f && (f = a.config.filebrowserUploadUrl)), f)) {
				var h = e.onClick;
				e.onClick = function(a) {
					var b = a.sender;
					if (h && !1 === h.call(b, a)) return !1;
					if (n.call(b, a)) {
						a = b.getDialog().getContentElement(this["for"][0], this["for"][1]).getInputElement();
						if (b = new CKEDITOR.dom.element(a.$.form))(a = b.$.elements.ckCsrfToken) ? a = new CKEDITOR.dom.element(a) : (a = new CKEDITOR.dom.element("input"), a.setAttributes({
							name: "ckCsrfToken",
							type: "hidden"
						}), b.append(a)), a.setAttribute("value", CKEDITOR.tools.getCsrfToken());
						return !0
					}
					return !1
				};
				e.filebrowser.url = f;
				e.hidden = !1;
				p(a, d.getContents(e["for"][0]).get(e["for"][1]), e.filebrowser)
			}
		}

		function h(a, c, d) {
			if (-1 !== d.indexOf(";")) {
				d = d.split(";");
				for (var b = 0; b < d.length; b++) if (h(a, c, d[b])) return !0;
				return !1
			}
			return (a = a.getContents(c).get(d).filebrowser) && a.url
		}

		function q(a, c) {
			var d = this._.filebrowserSe.getDialog(),
				b = this._.filebrowserSe["for"],
				e = this._.filebrowserSe.filebrowser.onSelect;
			b && d.getContentElement(b[0], b[1]).reset();
			if ("function" != typeof c || !1 !== c.call(this._.filebrowserSe)) if (!e || !1 !== e.call(this._.filebrowserSe, a, c)) if ("string" == typeof c && c && alert(c), a && (b = this._.filebrowserSe, d = b.getDialog(), b = b.filebrowser.target || null)) if (b = b.split(":"), e = d.getContentElement(b[0], b[1])) e.setValue(a), d.selectPage(b[0])
		}
		CKEDITOR.plugins.add("filebrowser", {
			requires: "popup",
			init: function(a) {
				a._.filebrowserFn = CKEDITOR.tools.addFunction(q, a);
				a.on("destroy", function() {
					CKEDITOR.tools.removeFunction(this._.filebrowserFn)
				})
			}
		});
		CKEDITOR.on("dialogDefinition", function(a) {
			if (a.editor.plugins.filebrowser) for (var c = a.data.definition, d, b = 0; b < c.contents.length; ++b) if (d = c.contents[b]) l(a.editor, a.data.name, c, d.elements), d.hidden && d.filebrowser && (d.hidden = !h(c, d.id, d.filebrowser))
		})
	})();
	CKEDITOR.plugins.add("find", {
		requires: "dialog",
		init: function(a) {
			var b = a.addCommand("find", new CKEDITOR.dialogCommand("find"));
			b.canUndo = !1;
			b.readOnly = 1;
			a.addCommand("replace", new CKEDITOR.dialogCommand("replace")).canUndo = !1;
			a.ui.addButton && (a.ui.addButton("Find", {
				label: a.lang.find.find,
				command: "find",
				toolbar: "find,10"
			}), a.ui.addButton("Replace", {
				label: a.lang.find.replace,
				command: "replace",
				toolbar: "find,20"
			}));
			CKEDITOR.dialog.add("find", this.path + "dialogs/find.js");
			CKEDITOR.dialog.add("replace", this.path + "dialogs/find.js")
		}
	});
	CKEDITOR.config.find_highlight = {
		element: "span",
		styles: {
			"background-color": "#004",
			color: "#fff"
		}
	};
	(function() {
		function g(a, b) {
			var c = l.exec(a),
				d = l.exec(b);
			if (c) {
				if (!c[2] && "px" == d[2]) return d[1];
				if ("px" == c[2] && !d[2]) return d[1] + "px"
			}
			return b
		}
		var k = CKEDITOR.htmlParser.cssStyle,
			h = CKEDITOR.tools.cssLength,
			l = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
			m = {
				elements: {
					$: function(a) {
						var b = a.attributes;
						if ((b = (b = (b = b && b["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b))) && b.children[0]) && a.attributes["data-cke-resizable"]) {
							var c = (new k(a)).rules;
							a = b.attributes;
							var d = c.width,
								c = c.height;
							d && (a.width = g(a.width, d));
							c && (a.height = g(a.height, c))
						}
						return b
					}
				}
			};
		CKEDITOR.plugins.add("fakeobjects", {
			init: function(a) {
				a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
			},
			afterInit: function(a) {
				(a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(m, {
					applyToAll: !0
				})
			}
		});
		CKEDITOR.editor.prototype.createFakeElement = function(a, b, c, d) {
			var e = this.lang.fakeobjects,
				e = e[c] || e.unknown;
			b = {
				"class": b,
				"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
				"data-cke-real-node-type": a.type,
				alt: e,
				title: e,
				align: a.getAttribute("align") || ""
			};
			CKEDITOR.env.hc || (b.src = CKEDITOR.tools.transparentImageData);
			c && (b["data-cke-real-element-type"] = c);
			d && (b["data-cke-resizable"] = d, c = new k, d = a.getAttribute("width"), a = a.getAttribute("height"), d && (c.rules.width = h(d)), a && (c.rules.height = h(a)), c.populate(b));
			return this.document.createElement("img", {
				attributes: b
			})
		};
		CKEDITOR.editor.prototype.createFakeParserElement = function(a, b, c, d) {
			var e = this.lang.fakeobjects,
				e = e[c] || e.unknown,
				f;
			f = new CKEDITOR.htmlParser.basicWriter;
			a.writeHtml(f);
			f = f.getHtml();
			b = {
				"class": b,
				"data-cke-realelement": encodeURIComponent(f),
				"data-cke-real-node-type": a.type,
				alt: e,
				title: e,
				align: a.attributes.align || ""
			};
			CKEDITOR.env.hc || (b.src = CKEDITOR.tools.transparentImageData);
			c && (b["data-cke-real-element-type"] = c);
			d && (b["data-cke-resizable"] = d, d = a.attributes, a = new k, c = d.width, d = d.height, void 0 !== c && (a.rules.width = h(c)), void 0 !== d && (a.rules.height = h(d)), a.populate(b));
			return new CKEDITOR.htmlParser.element("img", b)
		};
		CKEDITOR.editor.prototype.restoreRealElement = function(a) {
			if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
			var b = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
			if (a.data("cke-resizable")) {
				var c = a.getStyle("width");
				a = a.getStyle("height");
				c && b.setAttribute("width", g(b.getAttribute("width"), c));
				a && b.setAttribute("height", g(b.getAttribute("height"), a))
			}
			return b
		}
	})();
	(function() {
		function d(a) {
			a = a.attributes;
			return "application/x-shockwave-flash" == a.type || f.test(a.src || "")
		}

		function e(a, b) {
			return a.createFakeParserElement(b, "cke_flash", "flash", !0)
		}
		var f = /\.swf(?:$|\?)/i;
		CKEDITOR.plugins.add("flash", {
			requires: "dialog,fakeobjects",
			onLoad: function() {
				CKEDITOR.addCss("img.cke_flash{background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")
			},
			init: function(a) {
				var b = "object[classid,codebase,height,hspace,vspace,width];param[name,value];embed[height,hspace,pluginspage,src,type,vspace,width]";
				CKEDITOR.dialog.isTabEnabled(a, "flash", "properties") && (b += ";object[align]; embed[allowscriptaccess,quality,scale,wmode]");
				CKEDITOR.dialog.isTabEnabled(a, "flash", "advanced") && (b += ";object[id]{*}; embed[bgcolor]{*}(*)");
				a.addCommand("flash", new CKEDITOR.dialogCommand("flash", {
					allowedContent: b,
					requiredContent: "embed"
				}));
				a.ui.addButton && a.ui.addButton("Flash", {
					label: a.lang.common.flash,
					command: "flash",
					toolbar: "insert,20"
				});
				CKEDITOR.dialog.add("flash", this.path + "dialogs/flash.js");
				a.addMenuItems && a.addMenuItems({
					flash: {
						label: a.lang.flash.properties,
						command: "flash",
						group: "flash"
					}
				});
				a.on("doubleclick", function(a) {
					var b = a.data.element;
					b.is("img") && "flash" == b.data("cke-real-element-type") && (a.data.dialog = "flash")
				});
				a.contextMenu && a.contextMenu.addListener(function(a) {
					if (a && a.is("img") && !a.isReadOnly() && "flash" == a.data("cke-real-element-type")) return {
						flash: CKEDITOR.TRISTATE_OFF
					}
				})
			},
			afterInit: function(a) {
				var b = a.dataProcessor;
				(b = b && b.dataFilter) && b.addRules({
					elements: {
						"cke:object": function(b) {
							var c = b.attributes;
							if (!(c.classid && String(c.classid).toLowerCase() || d(b))) {
								for (c = 0; c < b.children.length; c++) if ("cke:embed" == b.children[c].name) {
									if (!d(b.children[c])) break;
									return e(a, b)
								}
								return null
							}
							return e(a, b)
						},
						"cke:embed": function(b) {
							return d(b) ? e(a, b) : null
						}
					}
				}, 5)
			}
		})
	})();
	CKEDITOR.tools.extend(CKEDITOR.config, {
		flashEmbedTagOnly: !1,
		flashAddEmbedTag: !0,
		flashConvertOnEdit: !1
	});
	(function() {
		function k(a) {
			var l = a.config,
				p = a.fire("uiSpace", {
					space: "top",
					html: ""
				}).html,
				t = function() {
					function f(a, c, e) {
						b.setStyle(c, w(e));
						b.setStyle("position", a)
					}

					function e(a) {
						var b = k.getDocumentPosition();
						switch (a) {
						case "top":
							f("absolute", "top", b.y - q - r);
							break;
						case "pin":
							f("fixed", "top", x);
							break;
						case "bottom":
							f("absolute", "top", b.y + (c.height || c.bottom - c.top) + r)
						}
						m = a
					}
					var m, k, n, c, h, q, v, p = l.floatSpaceDockedOffsetX || 0,
						r = l.floatSpaceDockedOffsetY || 0,
						u = l.floatSpacePinnedOffsetX || 0,
						x = l.floatSpacePinnedOffsetY || 0;
					return function(d) {
						if (k = a.editable()) {
							var f = d && "focus" == d.name;
							f && b.show();
							a.fire("floatingSpaceLayout", {
								show: f
							});
							b.removeStyle("left");
							b.removeStyle("right");
							n = b.getClientRect();
							c = k.getClientRect();
							h = g.getViewPaneSize();
							q = n.height;
							v = "pageXOffset" in g.$ ? g.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
							m ? (q + r <= c.top ? e("top") : q + r > h.height - c.bottom ? e("pin") : e("bottom"), d = h.width / 2, d = l.floatSpacePreferRight ? "right" : 0 < c.left && c.right < h.width && c.width > n.width ? "rtl" == l.contentsLangDirection ? "right" : "left" : d - c.left > c.right - d ? "left" : "right", n.width > h.width ? (d = "left", f = 0) : (f = "left" == d ? 0 < c.left ? c.left : 0 : c.right < h.width ? h.width - c.right : 0, f + n.width > h.width && (d = "left" == d ? "right" : "left", f = 0)), b.setStyle(d, w(("pin" == m ? u : p) + f + ("pin" == m ? 0 : "left" == d ? v : -v)))) : (m = "pin", e("pin"), t(d))
						}
					}
				}();
			if (p) {
				var k = new CKEDITOR.template('<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : " ") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : " ") + '<div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
					b = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(k.output({
						content: p,
						id: a.id,
						langDir: a.lang.dir,
						langCode: a.langCode,
						name: a.name,
						style: "display:none;z-index:" + (l.baseFloatZIndex - 1),
						topId: a.ui.spaceId("top"),
						voiceLabel: a.title
					}))),
					u = CKEDITOR.tools.eventsBuffer(500, t),
					e = CKEDITOR.tools.eventsBuffer(100, t);
				b.unselectable();
				b.on("mousedown", function(a) {
					a = a.data;
					a.getTarget().hasAscendant("a", 1) || a.preventDefault()
				});
				a.on("focus", function(b) {
					t(b);
					a.on("change", u.input);
					g.on("scroll", e.input);
					g.on("resize", e.input)
				});
				a.on("blur", function() {
					b.hide();
					a.removeListener("change", u.input);
					g.removeListener("scroll", e.input);
					g.removeListener("resize", e.input)
				});
				a.on("destroy", function() {
					g.removeListener("scroll", e.input);
					g.removeListener("resize", e.input);
					b.clearCustomData();
					b.remove()
				});
				a.focusManager.hasFocus && b.show();
				a.focusManager.add(b, 1)
			}
		}
		var g = CKEDITOR.document.getWindow(),
			w = CKEDITOR.tools.cssLength;
		CKEDITOR.plugins.add("floatingspace", {
			init: function(a) {
				a.on("loaded", function() {
					k(this)
				}, null, null, 20)
			}
		})
	})();
	CKEDITOR.plugins.add("listblock", {
		requires: "panel",
		onLoad: function() {
			var f = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'),
				g = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
				h = CKEDITOR.addTemplate("panel-list-group", '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>'),
				k = /\'/g;
			CKEDITOR.ui.panel.prototype.addListBlock = function(a, b) {
				return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
			};
			CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
				base: CKEDITOR.ui.panel.block,
				$: function(a, b) {
					b = b || {};
					var c = b.attributes || (b.attributes = {});
					(this.multiSelect = !! b.multiSelect) && (c["aria-multiselectable"] = !0);
					!c.role && (c.role = "listbox");
					this.base.apply(this, arguments);
					this.element.setAttribute("role", c.role);
					c = this.keys;
					c[40] = "next";
					c[9] = "next";
					c[38] = "prev";
					c[CKEDITOR.SHIFT + 9] = "prev";
					c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
					CKEDITOR.env.ie && (c[13] = "mouseup");
					this._.pendingHtml = [];
					this._.pendingList = [];
					this._.items = {};
					this._.groups = {}
				},
				_: {
					close: function() {
						if (this._.started) {
							var a = f.output({
								items: this._.pendingList.join("")
							});
							this._.pendingList = [];
							this._.pendingHtml.push(a);
							delete this._.started
						}
					},
					getClick: function() {
						this._.click || (this._.click = CKEDITOR.tools.addFunction(function(a) {
							var b = this.toggle(a);
							if (this.onClick) this.onClick(a, b)
						}, this));
						return this._.click
					}
				},
				proto: {
					add: function(a, b, c) {
						var d = CKEDITOR.tools.getNextId();
						this._.started || (this._.started = 1, this._.size = this._.size || 0);
						this._.items[a] = d;
						var e;
						e = CKEDITOR.tools.htmlEncodeAttr(a).replace(k, "\\'");
						a = {
							id: d,
							val: e,
							onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick",
							clickFn: this._.getClick(),
							title: CKEDITOR.tools.htmlEncodeAttr(c || a),
							text: b || a
						};
						this._.pendingList.push(g.output(a))
					},
					startGroup: function(a) {
						this._.close();
						var b = CKEDITOR.tools.getNextId();
						this._.groups[a] = b;
						this._.pendingHtml.push(h.output({
							id: b,
							label: a
						}))
					},
					commit: function() {
						this._.close();
						this.element.appendHtml(this._.pendingHtml.join(""));
						delete this._.size;
						this._.pendingHtml = []
					},
					toggle: function(a) {
						var b = this.isMarked(a);
						b ? this.unmark(a) : this.mark(a);
						return !b
					},
					hideGroup: function(a) {
						var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
						a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none"))
					},
					hideItem: function(a) {
						this.element.getDocument().getById(this._.items[a]).setStyle("display", "none")
					},
					showAll: function() {
						var a = this._.items,
							b = this._.groups,
							c = this.element.getDocument(),
							d;
						for (d in a) c.getById(a[d]).setStyle("display", "");
						for (var e in b) a = c.getById(b[e]), d = a.getNext(), a.setStyle("display", ""), d && "ul" == d.getName() && d.setStyle("display", "")
					},
					mark: function(a) {
						this.multiSelect || this.unmarkAll();
						a = this._.items[a];
						var b = this.element.getDocument().getById(a);
						b.addClass("cke_selected");
						this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0);
						this.onMark && this.onMark(b)
					},
					unmark: function(a) {
						var b = this.element.getDocument();
						a = this._.items[a];
						var c = b.getById(a);
						c.removeClass("cke_selected");
						b.getById(a + "_option").removeAttribute("aria-selected");
						this.onUnmark && this.onUnmark(c)
					},
					unmarkAll: function() {
						var a = this._.items,
							b = this.element.getDocument(),
							c;
						for (c in a) {
							var d = a[c];
							b.getById(d).removeClass("cke_selected");
							b.getById(d + "_option").removeAttribute("aria-selected")
						}
						this.onUnmark && this.onUnmark()
					},
					isMarked: function(a) {
						return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
					},
					focus: function(a) {
						this._.focusIndex = -1;
						var b = this.element.getElementsByTag("a"),
							c, d = -1;
						if (a) for (c = this.element.getDocument().getById(this._.items[a]).getFirst(); a = b.getItem(++d);) {
							if (a.equals(c)) {
								this._.focusIndex = d;
								break
							}
						} else this.element.focus();
						c && setTimeout(function() {
							c.focus()
						}, 0)
					}
				}
			})
		}
	});
	CKEDITOR.plugins.add("richcombo", {
		requires: "floatpanel,listblock,button",
		beforeInit: function(d) {
			d.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
		}
	});
	(function() {
		var d = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (d += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
		var d = d + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"),
			k = CKEDITOR.addTemplate("combo", d);
		CKEDITOR.UI_RICHCOMBO = "richcombo";
		CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
			$: function(a) {
				CKEDITOR.tools.extend(this, a, {
					canGroup: !1,
					title: a.label,
					modes: {
						wysiwyg: 1
					},
					editorFocus: 1
				});
				a = this.panel || {};
				delete this.panel;
				this.id = CKEDITOR.tools.getNextNumber();
				this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
				a.className = "cke_combopanel";
				a.block = {
					multiSelect: a.multiSelect,
					attributes: a.attributes
				};
				a.toolbarRelated = !0;
				this._ = {
					panelDefinition: a,
					items: {}
				}
			},
			proto: {
				renderHtml: function(a) {
					var b = [];
					this.render(a, b);
					return b.join("")
				},
				render: function(a, b) {
					function g() {
						if (this.getState() != CKEDITOR.TRISTATE_ON) {
							var c = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
							a.readOnly && !this.readOnly && (c = CKEDITOR.TRISTATE_DISABLED);
							this.setState(c);
							this.setValue("");
							c != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh()
						}
					}
					var d = CKEDITOR.env,
						h = "cke_" + this.id,
						e = CKEDITOR.tools.addFunction(function(b) {
							l && (a.unlockSelection(1), l = 0);
							c.execute(b)
						}, this),
						f = this,
						c = {
							id: h,
							combo: this,
							focus: function() {
								CKEDITOR.document.getById(h).getChild(1).focus()
							},
							execute: function(c) {
								var b = f._;
								if (b.state != CKEDITOR.TRISTATE_DISABLED) if (f.createPanel(a), b.on) b.panel.hide();
								else {
									f.commit();
									var d = f.getValue();
									d ? b.list.mark(d) : b.list.unmarkAll();
									b.panel.showBlock(f.id, new CKEDITOR.dom.element(c), 4)
								}
							},
							clickFn: e
						};
					a.on("activeFilterChange", g, this);
					a.on("mode", g, this);
					a.on("selectionChange", g, this);
					!this.readOnly && a.on("readOnly", g, this);
					var m = CKEDITOR.tools.addFunction(function(b, d) {
						b = new CKEDITOR.dom.event(b);
						var g = b.getKeystroke();
						if (40 == g) a.once("panelShow", function(a) {
							a.data._.panel._.currentBlock.onKeyDown(40)
						});
						switch (g) {
						case 13:
						case 32:
						case 40:
							CKEDITOR.tools.callFunction(e, d);
							break;
						default:
							c.onkey(c, g)
						}
						b.preventDefault()
					}),
						n = CKEDITOR.tools.addFunction(function() {
							c.onfocus && c.onfocus()
						}),
						l = 0;
					c.keyDownFn = m;
					d = {
						id: h,
						name: this.name || this.command,
						label: this.label,
						title: this.title,
						cls: this.className || "",
						titleJs: d.gecko && !d.hc ? "" : (this.title || "").replace("'", ""),
						keydownFn: m,
						focusFn: n,
						clickFn: e
					};
					k.output(d, b);
					if (this.onRender) this.onRender();
					return c
				},
				createPanel: function(a) {
					if (!this._.panel) {
						var b = this._.panelDefinition,
							d = this._.panelDefinition.block,
							k = b.parent || CKEDITOR.document.getBody(),
							h = "cke_combopanel__" + this.name,
							e = new CKEDITOR.ui.floatPanel(a, k, b),
							f = e.addListBlock(this.id, d),
							c = this;
						e.onShow = function() {
							this.element.addClass(h);
							c.setState(CKEDITOR.TRISTATE_ON);
							c._.on = 1;
							c.editorFocus && !a.focusManager.hasFocus && a.focus();
							if (c.onOpen) c.onOpen();
							a.once("panelShow", function() {
								f.focus(!f.multiSelect && c.getValue())
							})
						};
						e.onHide = function(b) {
							this.element.removeClass(h);
							c.setState(c.modes && c.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
							c._.on = 0;
							if (!b && c.onClose) c.onClose()
						};
						e.onEscape = function() {
							e.hide(1)
						};
						f.onClick = function(a, b) {
							c.onClick && c.onClick.call(c, a, b);
							e.hide()
						};
						this._.panel = e;
						this._.list = f;
						e.getBlock(this.id).onHide = function() {
							c._.on = 0;
							c.setState(CKEDITOR.TRISTATE_OFF)
						};
						this.init && this.init()
					}
				},
				setValue: function(a, b) {
					this._.value = a;
					var d = this.document.getById("cke_" + this.id + "_text");
					d && (a || b ? d.removeClass("cke_combo_inlinelabel") : (b = this.label, d.addClass("cke_combo_inlinelabel")), d.setText("undefined" != typeof b ? b : a))
				},
				getValue: function() {
					return this._.value || ""
				},
				unmarkAll: function() {
					this._.list.unmarkAll()
				},
				mark: function(a) {
					this._.list.mark(a)
				},
				hideItem: function(a) {
					this._.list.hideItem(a)
				},
				hideGroup: function(a) {
					this._.list.hideGroup(a)
				},
				showAll: function() {
					this._.list.showAll()
				},
				add: function(a, b, d) {
					this._.items[a] = d || a;
					this._.list.add(a, b, d)
				},
				startGroup: function(a) {
					this._.list.startGroup(a)
				},
				commit: function() {
					this._.committed || (this._.list.commit(), this._.committed = 1, CKEDITOR.ui.fire("ready", this));
					this._.committed = 1
				},
				setState: function(a) {
					if (this._.state != a) {
						var b = this.document.getById("cke_" + this.id);
						b.setState(a, "cke_combo");
						a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled");
						this._.state = a
					}
				},
				getState: function() {
					return this._.state
				},
				enable: function() {
					this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
				},
				disable: function() {
					this._.state != CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
				}
			},
			statics: {
				handler: {
					create: function(a) {
						return new CKEDITOR.ui.richCombo(a)
					}
				}
			}
		});
		CKEDITOR.ui.prototype.addRichCombo = function(a, b) {
			this.add(a, CKEDITOR.UI_RICHCOMBO, b)
		}
	})();
	(function() {
		function l(a, b, c, f, p, l, t, v) {
			var w = a.config,
				q = new CKEDITOR.style(t),
				k = p.split(";");
			p = [];
			for (var m = {}, d = 0; d < k.length; d++) {
				var h = k[d];
				if (h) {
					var h = h.split("/"),
						u = {},
						n = k[d] = h[0];
					u[c] = p[d] = h[1] || n;
					m[n] = new CKEDITOR.style(t, u);
					m[n]._.definition.name = n
				} else k.splice(d--, 1)
			}
			a.ui.addRichCombo(b, {
				label: f.label,
				title: f.panelTitle,
				toolbar: "styles," + v,
				allowedContent: q,
				requiredContent: q,
				panel: {
					css: [CKEDITOR.skin.getPath("editor")].concat(w.contentsCss),
					multiSelect: !1,
					attributes: {
						"aria-label": f.panelTitle
					}
				},
				init: function() {
					this.startGroup(f.panelTitle);
					for (var a = 0; a < k.length; a++) {
						var b = k[a];
						this.add(b, m[b].buildPreview(), b)
					}
				},
				onClick: function(b) {
					a.focus();
					a.fire("saveSnapshot");
					var c = this.getValue(),
						f = m[b];
					if (c && b != c) {
						var k = m[c],
							e = a.getSelection().getRanges()[0];
						if (e.collapsed) {
							var d = a.elementPath(),
								g = d.contains(function(a) {
									return k.checkElementRemovable(a)
								});
							if (g) {
								var h = e.checkBoundaryOfElement(g, CKEDITOR.START),
									l = e.checkBoundaryOfElement(g, CKEDITOR.END);
								if (h && l) {
									for (h = e.createBookmark(); d = g.getFirst();) d.insertBefore(g);
									g.remove();
									e.moveToBookmark(h)
								} else h ? e.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START) : l ? e.moveToPosition(g, CKEDITOR.POSITION_AFTER_END) : (e.splitElement(g), e.moveToPosition(g, CKEDITOR.POSITION_AFTER_END), r(e, d.elements.slice(), g));
								a.getSelection().selectRanges([e])
							}
						} else a.removeStyle(k)
					}
					a[c == b ? "removeStyle" : "applyStyle"](f);
					a.fire("saveSnapshot")
				},
				onRender: function() {
					a.on("selectionChange", function(b) {
						var c = this.getValue();
						b = b.data.path.elements;
						for (var d = 0, f; d < b.length; d++) {
							f = b[d];
							for (var e in m) if (m[e].checkElementMatch(f, !0, a)) {
								e != c && this.setValue(e);
								return
							}
						}
						this.setValue("", l)
					}, this)
				},
				refresh: function() {
					a.activeFilter.check(q) || this.setState(CKEDITOR.TRISTATE_DISABLED)
				}
			})
		}

		function r(a, b, c) {
			var f = b.pop();
			if (f) {
				if (c) return r(a, b, f.equals(c) ? null : c);
				c = f.clone();
				a.insertNode(c);
				a.moveToPosition(c, CKEDITOR.POSITION_AFTER_START);
				r(a, b)
			}
		}
		CKEDITOR.plugins.add("font", {
			requires: "richcombo",
			init: function(a) {
				var b = a.config;
				l(a, "Font", "family", a.lang.font, b.font_names, b.font_defaultLabel, b.font_style, 30);
				l(a, "FontSize", "size", a.lang.font.fontSize, b.fontSize_sizes, b.fontSize_defaultLabel, b.fontSize_style, 40)
			}
		})
	})();
	CKEDITOR.config.font_names = "Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif";
	CKEDITOR.config.font_defaultLabel = "";
	CKEDITOR.config.font_style = {
		element: "span",
		styles: {
			"font-family": "#(family)"
		},
		overrides: [{
			element: "font",
			attributes: {
				face: null
			}
		}]
	};
	CKEDITOR.config.fontSize_sizes = "8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px";
	CKEDITOR.config.fontSize_defaultLabel = "";
	CKEDITOR.config.fontSize_style = {
		element: "span",
		styles: {
			"font-size": "#(size)"
		},
		overrides: [{
			element: "font",
			attributes: {
				size: null
			}
		}]
	};
	CKEDITOR.plugins.add("forms", {
		requires: "dialog,fakeobjects",
		onLoad: function() {
			CKEDITOR.addCss(".cke_editable form{border: 1px dotted #FF0000;padding: 2px;}\n");
			CKEDITOR.addCss("img.cke_hidden{background-image: url(" + CKEDITOR.getUrl(this.path + "images/hiddenfield.gif") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 16px !important;height: 16px !important;}")
		},
		init: function(a) {
			var b = a.lang,
				g = 0,
				h = {
					email: 1,
					password: 1,
					search: 1,
					tel: 1,
					text: 1,
					url: 1
				},
				l = {
					checkbox: "input[type,name,checked,required]",
					radio: "input[type,name,checked,required]",
					textfield: "input[type,name,value,size,maxlength,required]",
					textarea: "textarea[cols,rows,name,required]",
					select: "select[name,size,multiple,required]; option[value,selected]",
					button: "input[type,name,value]",
					form: "form[action,name,id,enctype,target,method]",
					hiddenfield: "input[type,name,value]",
					imagebutton: "input[type,alt,src]{width,height,border,border-width,border-style,margin,float}"
				},
				m = {
					checkbox: "input",
					radio: "input",
					textfield: "input",
					textarea: "textarea",
					select: "select",
					button: "input",
					form: "form",
					hiddenfield: "input",
					imagebutton: "input"
				},
				e = function(d, c, e) {
					var h = {
						allowedContent: l[c],
						requiredContent: m[c]
					};
					"form" == c && (h.context = "form");
					a.addCommand(c, new CKEDITOR.dialogCommand(c, h));
					a.ui.addButton && a.ui.addButton(d, {
						label: b.common[d.charAt(0).toLowerCase() + d.slice(1)],
						command: c,
						toolbar: "forms," + (g += 10)
					});
					CKEDITOR.dialog.add(c, e)
				},
				f = this.path + "dialogs/";
			!a.blockless && e("Form", "form", f + "form.js");
			e("Checkbox", "checkbox", f + "checkbox.js");
			e("Radio", "radio", f + "radio.js");
			e("TextField", "textfield", f + "textfield.js");
			e("Textarea", "textarea", f + "textarea.js");
			e("Select", "select", f + "select.js");
			e("Button", "button", f + "button.js");
			var k = a.plugins.image;
			k && !a.plugins.image2 && e("ImageButton", "imagebutton", CKEDITOR.plugins.getPath("image") + "dialogs/image.js");
			e("HiddenField", "hiddenfield", f + "hiddenfield.js");
			a.addMenuItems && (e = {
				checkbox: {
					label: b.forms.checkboxAndRadio.checkboxTitle,
					command: "checkbox",
					group: "checkbox"
				},
				radio: {
					label: b.forms.checkboxAndRadio.radioTitle,
					command: "radio",
					group: "radio"
				},
				textfield: {
					label: b.forms.textfield.title,
					command: "textfield",
					group: "textfield"
				},
				hiddenfield: {
					label: b.forms.hidden.title,
					command: "hiddenfield",
					group: "hiddenfield"
				},
				button: {
					label: b.forms.button.title,
					command: "button",
					group: "button"
				},
				select: {
					label: b.forms.select.title,
					command: "select",
					group: "select"
				},
				textarea: {
					label: b.forms.textarea.title,
					command: "textarea",
					group: "textarea"
				}
			}, k && (e.imagebutton = {
				label: b.image.titleButton,
				command: "imagebutton",
				group: "imagebutton"
			}), !a.blockless && (e.form = {
				label: b.forms.form.menu,
				command: "form",
				group: "form"
			}), a.addMenuItems(e));
			a.contextMenu && (!a.blockless && a.contextMenu.addListener(function(d, c, a) {
				if ((d = a.contains("form", 1)) && !d.isReadOnly()) return {
					form: CKEDITOR.TRISTATE_OFF
				}
			}), a.contextMenu.addListener(function(d) {
				if (d && !d.isReadOnly()) {
					var c = d.getName();
					if ("select" == c) return {
						select: CKEDITOR.TRISTATE_OFF
					};
					if ("textarea" == c) return {
						textarea: CKEDITOR.TRISTATE_OFF
					};
					if ("input" == c) {
						var a = d.getAttribute("type") || "text";
						switch (a) {
						case "button":
						case "submit":
						case "reset":
							return {
								button: CKEDITOR.TRISTATE_OFF
							};
						case "checkbox":
							return {
								checkbox: CKEDITOR.TRISTATE_OFF
							};
						case "radio":
							return {
								radio: CKEDITOR.TRISTATE_OFF
							};
						case "image":
							return k ? {
								imagebutton: CKEDITOR.TRISTATE_OFF
							} : null
						}
						if (h[a]) return {
							textfield: CKEDITOR.TRISTATE_OFF
						}
					}
					if ("img" == c && "hiddenfield" == d.data("cke-real-element-type")) return {
						hiddenfield: CKEDITOR.TRISTATE_OFF
					}
				}
			}));
			a.on("doubleclick", function(d) {
				var c = d.data.element;
				if (!a.blockless && c.is("form")) d.data.dialog = "form";
				else if (c.is("select")) d.data.dialog = "select";
				else if (c.is("textarea")) d.data.dialog = "textarea";
				else if (c.is("img") && "hiddenfield" == c.data("cke-real-element-type")) d.data.dialog = "hiddenfield";
				else if (c.is("input")) {
					c = c.getAttribute("type") || "text";
					switch (c) {
					case "button":
					case "submit":
					case "reset":
						d.data.dialog = "button";
						break;
					case "checkbox":
						d.data.dialog = "checkbox";
						break;
					case "radio":
						d.data.dialog = "radio";
						break;
					case "image":
						d.data.dialog = "imagebutton"
					}
					h[c] && (d.data.dialog = "textfield")
				}
			})
		},
		afterInit: function(a) {
			var b = a.dataProcessor,
				g = b && b.htmlFilter,
				b = b && b.dataFilter;
			CKEDITOR.env.ie && g && g.addRules({
				elements: {
					input: function(a) {
						a = a.attributes;
						var b = a.type;
						b || (a.type = "text");
						"checkbox" != b && "radio" != b || "on" != a.value || delete a.value
					}
				}
			}, {
				applyToAll: !0
			});
			b && b.addRules({
				elements: {
					input: function(b) {
						if ("hidden" == b.attributes.type) return a.createFakeParserElement(b, "cke_hidden", "hiddenfield")
					}
				}
			}, {
				applyToAll: !0
			})
		}
	});
	CKEDITOR.plugins.add("format", {
		requires: "richcombo",
		init: function(a) {
			if (!a.blockless) {
				for (var f = a.config, c = a.lang.format, l = f.format_tags.split(";"), d = {}, m = 0, n = [], g = 0; g < l.length; g++) {
					var h = l[g],
						k = new CKEDITOR.style(f["format_" + h]);
					if (!a.filter.customConfig || a.filter.check(k)) m++, d[h] = k, d[h]._.enterMode = a.config.enterMode, n.push(k)
				}
				0 !== m && a.ui.addRichCombo("Format", {
					label: c.label,
					title: c.panelTitle,
					toolbar: "styles,20",
					allowedContent: n,
					panel: {
						css: [CKEDITOR.skin.getPath("editor")].concat(f.contentsCss),
						multiSelect: !1,
						attributes: {
							"aria-label": c.panelTitle
						}
					},
					init: function() {
						this.startGroup(c.panelTitle);
						for (var a in d) {
							var e = c["tag_" + a];
							this.add(a, d[a].buildPreview(e), e)
						}
					},
					onClick: function(b) {
						a.focus();
						a.fire("saveSnapshot");
						b = d[b];
						var e = a.elementPath();
						a[b.checkActive(e, a) ? "removeStyle" : "applyStyle"](b);
						setTimeout(function() {
							a.fire("saveSnapshot")
						}, 0)
					},
					onRender: function() {
						a.on("selectionChange", function(b) {
							var e = this.getValue();
							b = b.data.path;
							this.refresh();
							for (var c in d) if (d[c].checkActive(b, a)) {
								c != e && this.setValue(c, a.lang.format["tag_" + c]);
								return
							}
							this.setValue("")
						}, this)
					},
					onOpen: function() {
						this.showAll();
						for (var b in d) a.activeFilter.check(d[b]) || this.hideItem(b)
					},
					refresh: function() {
						var b = a.elementPath();
						if (b) {
							if (b.isContextFor("p")) for (var c in d) if (a.activeFilter.check(d[c])) return;
							this.setState(CKEDITOR.TRISTATE_DISABLED)
						}
					}
				})
			}
		}
	});
	CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div";
	CKEDITOR.config.format_p = {
		element: "p"
	};
	CKEDITOR.config.format_div = {
		element: "div"
	};
	CKEDITOR.config.format_pre = {
		element: "pre"
	};
	CKEDITOR.config.format_address = {
		element: "address"
	};
	CKEDITOR.config.format_h1 = {
		element: "h1"
	};
	CKEDITOR.config.format_h2 = {
		element: "h2"
	};
	CKEDITOR.config.format_h3 = {
		element: "h3"
	};
	CKEDITOR.config.format_h4 = {
		element: "h4"
	};
	CKEDITOR.config.format_h5 = {
		element: "h5"
	};
	CKEDITOR.config.format_h6 = {
		element: "h6"
	};
	(function() {
		var b = {
			canUndo: !1,
			exec: function(a) {
				var b = a.document.createElement("hr");
				a.insertElement(b)
			},
			allowedContent: "hr",
			requiredContent: "hr"
		};
		CKEDITOR.plugins.add("horizontalrule", {
			init: function(a) {
				a.blockless || (a.addCommand("horizontalrule", b), a.ui.addButton && a.ui.addButton("HorizontalRule", {
					label: a.lang.horizontalrule.toolbar,
					command: "horizontalrule",
					toolbar: "insert,40"
				}))
			}
		})
	})();
	CKEDITOR.plugins.add("htmlwriter", {
		init: function(b) {
			var a = new CKEDITOR.htmlWriter;
			a.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
			a.indentationChars = b.config.dataIndentationChars || "\t";
			b.dataProcessor.writer = a
		}
	});
	CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
		base: CKEDITOR.htmlParser.basicWriter,
		$: function() {
			this.base();
			this.indentationChars = "\t";
			this.selfClosingEnd = " />";
			this.lineBreakChars = "\n";
			this.sortAttributes = 1;
			this._.indent = 0;
			this._.indentation = "";
			this._.inPre = 0;
			this._.rules = {};
			var b = CKEDITOR.dtd,
				a;
			for (a in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent)) this.setRules(a, {
				indent: !b[a]["#"],
				breakBeforeOpen: 1,
				breakBeforeClose: !b[a]["#"],
				breakAfterClose: 1,
				needsSpace: a in b.$block && !(a in {
					li: 1,
					dt: 1,
					dd: 1
				})
			});
			this.setRules("br", {
				breakAfterOpen: 1
			});
			this.setRules("title", {
				indent: 0,
				breakAfterOpen: 0
			});
			this.setRules("style", {
				indent: 0,
				breakBeforeClose: 1
			});
			this.setRules("pre", {
				breakAfterOpen: 1,
				indent: 0
			})
		},
		proto: {
			openTag: function(b) {
				var a = this._.rules[b];
				this._.afterCloser && a && a.needsSpace && this._.needsSpace && this._.output.push("\n");
				this._.indent ? this.indentation() : a && a.breakBeforeOpen && (this.lineBreak(), this.indentation());
				this._.output.push("<", b);
				this._.afterCloser = 0
			},
			openTagClose: function(b, a) {
				var c = this._.rules[b];
				a ? (this._.output.push(this.selfClosingEnd), c && c.breakAfterClose && (this._.needsSpace = c.needsSpace)) : (this._.output.push(">"), c && c.indent && (this._.indentation += this.indentationChars));
				c && c.breakAfterOpen && this.lineBreak();
				"pre" == b && (this._.inPre = 1)
			},
			attribute: function(b, a) {
				"string" == typeof a && (this.forceSimpleAmpersand && (a = a.replace(/&amp;/g, "&")), a = CKEDITOR.tools.htmlEncodeAttr(a));
				this._.output.push(" ", b, '="', a, '"')
			},
			closeTag: function(b) {
				var a = this._.rules[b];
				a && a.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length));
				this._.indent ? this.indentation() : a && a.breakBeforeClose && (this.lineBreak(), this.indentation());
				this._.output.push("</", b, ">");
				"pre" == b && (this._.inPre = 0);
				a && a.breakAfterClose && (this.lineBreak(), this._.needsSpace = a.needsSpace);
				this._.afterCloser = 1
			},
			text: function(b) {
				this._.indent && (this.indentation(), !this._.inPre && (b = CKEDITOR.tools.ltrim(b)));
				this._.output.push(b)
			},
			comment: function(b) {
				this._.indent && this.indentation();
				this._.output.push("<!--", b, "-->")
			},
			lineBreak: function() {
				!this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars);
				this._.indent = 1
			},
			indentation: function() {
				!this._.inPre && this._.indentation && this._.output.push(this._.indentation);
				this._.indent = 0
			},
			reset: function() {
				this._.output = [];
				this._.indent = 0;
				this._.indentation = "";
				this._.afterCloser = 0;
				this._.inPre = 0
			},
			setRules: function(b, a) {
				var c = this._.rules[b];
				c ? CKEDITOR.tools.extend(c, a, !0) : this._.rules[b] = a
			}
		}
	});
	(function() {
		CKEDITOR.plugins.add("iframe", {
			requires: "dialog,fakeobjects",
			onLoad: function() {
				CKEDITOR.addCss("img.cke_iframe{background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")
			},
			init: function(a) {
				var b = a.lang.iframe,
					c = "iframe[align,longdesc,frameborder,height,name,scrolling,src,title,width]";
				a.plugins.dialogadvtab && (c += ";iframe" + a.plugins.dialogadvtab.allowedContent({
					id: 1,
					classes: 1,
					styles: 1
				}));
				CKEDITOR.dialog.add("iframe", this.path + "dialogs/iframe.js");
				a.addCommand("iframe", new CKEDITOR.dialogCommand("iframe", {
					allowedContent: c,
					requiredContent: "iframe"
				}));
				a.ui.addButton && a.ui.addButton("Iframe", {
					label: b.toolbar,
					command: "iframe",
					toolbar: "insert,80"
				});
				a.on("doubleclick", function(a) {
					var b = a.data.element;
					b.is("img") && "iframe" == b.data("cke-real-element-type") && (a.data.dialog = "iframe")
				});
				a.addMenuItems && a.addMenuItems({
					iframe: {
						label: b.title,
						command: "iframe",
						group: "image"
					}
				});
				a.contextMenu && a.contextMenu.addListener(function(a) {
					if (a && a.is("img") && "iframe" == a.data("cke-real-element-type")) return {
						iframe: CKEDITOR.TRISTATE_OFF
					}
				})
			},
			afterInit: function(a) {
				var b = a.dataProcessor;
				(b = b && b.dataFilter) && b.addRules({
					elements: {
						iframe: function(b) {
							return a.createFakeParserElement(b, "cke_iframe", "iframe", !0)
						}
					}
				})
			}
		})
	})();
	(function() {
		function m(a) {
			function f(a) {
				var b = !1;
				g.attachListener(g, "keydown", function() {
					var d = c.getBody().getElementsByTag(a);
					if (!b) {
						for (var e = 0; e < d.count(); e++) d.getItem(e).setCustomData("retain", !0);
						b = !0
					}
				}, null, null, 1);
				g.attachListener(g, "keyup", function() {
					var d = c.getElementsByTag(a);
					b && (1 != d.count() || d.getItem(0).getCustomData("retain") || d.getItem(0).remove(1), b = !1)
				})
			}
			var b = this.editor,
				c = a.document,
				d = c.body,
				e = c.getElementById("cke_actscrpt");
			e && e.parentNode.removeChild(e);
			(e = c.getElementById("cke_shimscrpt")) && e.parentNode.removeChild(e);
			(e = c.getElementById("cke_basetagscrpt")) && e.parentNode.removeChild(e);
			d.contentEditable = !0;
			CKEDITOR.env.ie && (d.hideFocus = !0, d.disabled = !0, d.removeAttribute("disabled"));
			delete this._.isLoadingData;
			this.$ = d;
			c = new CKEDITOR.dom.document(c);
			this.setup();
			this.fixInitialSelection();
			var g = this;
			CKEDITOR.env.ie && !CKEDITOR.env.edge && c.getDocumentElement().addClass(c.$.compatMode);
			CKEDITOR.env.ie && !CKEDITOR.env.edge && b.enterMode != CKEDITOR.ENTER_P ? f("p") : CKEDITOR.env.edge && b.enterMode != CKEDITOR.ENTER_DIV && f("div");
			if (CKEDITOR.env.webkit || CKEDITOR.env.ie && 10 < CKEDITOR.env.version) c.getDocumentElement().on("mousedown", function(a) {
				a.data.getTarget().is("html") && setTimeout(function() {
					b.editable().focus()
				})
			});
			n(b);
			try {
				b.document.$.execCommand("2D-position", !1, !0)
			} catch (h) {}(CKEDITOR.env.gecko || CKEDITOR.env.ie && "CSS1Compat" == b.document.$.compatMode) && this.attachListener(this, "keydown", function(a) {
				var c = a.data.getKeystroke();
				if (33 == c || 34 == c) if (CKEDITOR.env.ie) setTimeout(function() {
					b.getSelection().scrollIntoView()
				}, 0);
				else if (b.window.$.innerHeight > this.$.offsetHeight) {
					var d = b.createRange();
					d[33 == c ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
					d.select();
					a.data.preventDefault()
				}
			});
			CKEDITOR.env.ie && this.attachListener(c, "blur", function() {
				try {
					c.$.selection.empty()
				} catch (a) {}
			});
			CKEDITOR.env.iOS && this.attachListener(c, "touchend", function() {
				a.focus()
			});
			d = b.document.getElementsByTag("title").getItem(0);
			d.data("cke-title", d.getText());
			CKEDITOR.env.ie && (b.document.$.title = this._.docTitle);
			CKEDITOR.tools.setTimeout(function() {
				"unloaded" == this.status && (this.status = "ready");
				b.fire("contentDom");
				this._.isPendingFocus && (b.focus(), this._.isPendingFocus = !1);
				setTimeout(function() {
					b.fire("dataReady")
				}, 0)
			}, 0, this)
		}

		function n(a) {
			function f() {
				var c;
				a.editable().attachListener(a, "selectionChange", function() {
					var d = a.getSelection().getSelectedElement();
					d && (c && (c.detachEvent("onresizestart", b), c = null), d.$.attachEvent("onresizestart", b), c = d.$)
				})
			}

			function b(a) {
				a.returnValue = !1
			}
			if (CKEDITOR.env.gecko) try {
				var c = a.document.$;
				c.execCommand("enableObjectResizing", !1, !a.config.disableObjectResizing);
				c.execCommand("enableInlineTableEditing", !1, !a.config.disableNativeTableHandles)
			} catch (d) {} else CKEDITOR.env.ie && 11 > CKEDITOR.env.version && a.config.disableObjectResizing && f(a)
		}

		function p() {
			var a = [];
			if (8 <= CKEDITOR.document.$.documentMode) {
				a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
				var f = [],
					b;
				for (b in CKEDITOR.dtd.$removeEmpty) f.push("html.CSS1Compat " + b + "[contenteditable=false]");
				a.push(f.join(",") + "{display:inline-block}")
			} else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
			a.push("html{cursor:text;*cursor:auto}");
			a.push("img,input,textarea{cursor:default}");
			return a.join("\n")
		}
		CKEDITOR.plugins.add("wysiwygarea", {
			init: function(a) {
				a.config.fullPage && a.addFeature({
					allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
					requiredContent: "body"
				});
				a.addMode("wysiwyg", function(f) {
					function b(b) {
						b && b.removeListener();
						a.editable(new l(a, d.$.contentWindow.document.body));
						a.setData(a.getData(1), f)
					}
					var c = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();",
						c = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie && !CKEDITOR.env.edge ? "javascript:void(function(){" + encodeURIComponent(c) + "}())" : "",
						d = CKEDITOR.dom.element.createFromHtml('<iframe src="' + c + '" frameBorder="0"></iframe>');
					d.setStyles({
						width: "100%",
						height: "100%"
					});
					d.addClass("cke_wysiwyg_frame").addClass("cke_reset");
					c = a.ui.space("contents");
					c.append(d);
					var e = CKEDITOR.env.ie && !CKEDITOR.env.edge || CKEDITOR.env.gecko;
					if (e) d.on("load", b);
					var g = a.title,
						h = a.fire("ariaEditorHelpLabel", {}).label;
					g && (CKEDITOR.env.ie && h && (g += ", " + h), d.setAttribute("title", g));
					if (h) {
						var g = CKEDITOR.tools.getNextId(),
							k = CKEDITOR.dom.element.createFromHtml('<span id="' + g + '" class="cke_voice_label">' + h + "</span>");
						c.append(k, 1);
						d.setAttribute("aria-describedby", g)
					}
					a.on("beforeModeUnload", function(a) {
						a.removeListener();
						k && k.remove()
					});
					d.setAttributes({
						tabIndex: a.tabIndex,
						allowTransparency: "true"
					});
					!e && b();
					a.fire("ariaWidget", d)
				})
			}
		});
		CKEDITOR.editor.prototype.addContentsCss = function(a) {
			var f = this.config,
				b = f.contentsCss;
			CKEDITOR.tools.isArray(b) || (f.contentsCss = b ? [b] : []);
			f.contentsCss.push(a)
		};
		var l = CKEDITOR.tools.createClass({
			$: function() {
				this.base.apply(this, arguments);
				this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(a) {
					CKEDITOR.tools.setTimeout(m, 0, this, a)
				}, this);
				this._.docTitle = this.getWindow().getFrame().getAttribute("title")
			},
			base: CKEDITOR.editable,
			proto: {
				setData: function(a, f) {
					var b = this.editor;
					if (f) this.setHtml(a), this.fixInitialSelection(), b.fire("dataReady");
					else {
						this._.isLoadingData = !0;
						b._.dataStore = {
							id: 1
						};
						var c = b.config,
							d = c.fullPage,
							e = c.docType,
							g = CKEDITOR.tools.buildStyleHtml(p()).replace(/<style>/, '<style data-cke-temp="1">');
						d || (g += CKEDITOR.tools.buildStyleHtml(b.config.contentsCss));
						var h = c.baseHref ? '<base href="' + c.baseHref + '" data-cke-temp="1" />' : "";
						d && (a = a.replace(/<!DOCTYPE[^>]*>/i, function(a) {
							b.docType = e = a;
							return ""
						}).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
							b.xmlDeclaration = a;
							return ""
						}));
						a = b.dataProcessor.toHtml(a);
						d ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"), h && (a = a.replace(/<head[^>]*?>/, "$&" + h)), a = a.replace(/<\/head\s*>/, g + "$&"), a = e + a) : a = c.docType + '<html dir="' + c.contentsLangDirection + '" lang="' + (c.contentsLanguage || b.langCode) + '"><head><title>' + this._.docTitle + "</title>" + h + g + "</head><body" + (c.bodyId ? ' id="' + c.bodyId + '"' : "") + (c.bodyClass ? ' class="' + c.bodyClass + '"' : "") + ">" + a + "</body></html>";
						CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2E4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/, "$&<!-- cke-content-start -->")));
						c = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "</script>";
						CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (c += '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)</script>');
						h && CKEDITOR.env.ie && 10 > CKEDITOR.env.version && (c += '<script id="cke_basetagscrpt">var baseTag = document.querySelector( "base" );baseTag.href = baseTag.href;</script>');
						a = a.replace(/(?=\s*<\/(:?head)>)/, c);
						this.clearCustomData();
						this.clearListeners();
						b.fire("contentDomUnload");
						var k = this.getDocument();
						try {
							k.write(a)
						} catch (l) {
							setTimeout(function() {
								k.write(a)
							}, 0)
						}
					}
				},
				getData: function(a) {
					if (a) return this.getHtml();
					a = this.editor;
					var f = a.config,
						b = f.fullPage,
						c = b && a.docType,
						d = b && a.xmlDeclaration,
						e = this.getDocument(),
						b = b ? e.getDocumentElement().getOuterHtml() : e.getBody().getHtml();
					CKEDITOR.env.gecko && f.enterMode != CKEDITOR.ENTER_BR && (b = b.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
					b = a.dataProcessor.toDataFormat(b);
					d && (b = d + "\n" + b);
					c && (b = c + "\n" + b);
					return b
				},
				focus: function() {
					this._.isLoadingData ? this._.isPendingFocus = !0 : l.baseProto.focus.call(this)
				},
				detach: function() {
					var a = this.editor,
						f = a.document,
						b;
					try {
						b = a.window.getFrame()
					} catch (c) {}
					l.baseProto.detach.call(this);
					this.clearCustomData();
					f.getDocumentElement().clearCustomData();
					CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
					b && b.getParent() ? (b.clearCustomData(), (a = b.removeCustomData("onResize")) && a.removeListener(), b.remove()) : CKEDITOR.warn("editor-destroy-iframe")
				}
			}
		})
	})();
	CKEDITOR.config.disableObjectResizing = !1;
	CKEDITOR.config.disableNativeTableHandles = !0;
	CKEDITOR.config.disableNativeSpellChecker = !0;
	(function() {
		function e(b, a) {
			a || (a = b.getSelection().getSelectedElement());
			if (a && a.is("img") && !a.data("cke-realelement") && !a.isReadOnly()) return a
		}

		function f(b) {
			var a = b.getStyle("float");
			if ("inherit" == a || "none" == a) a = 0;
			a || (a = b.getAttribute("align"));
			return a
		}
		CKEDITOR.plugins.add("image", {
			requires: "dialog",
			init: function(b) {
				if (!b.plugins.image2) {
					CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
					var a = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
					CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (a = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
					b.addCommand("image", new CKEDITOR.dialogCommand("image", {
						allowedContent: a,
						requiredContent: "img[alt,src]",
						contentTransformations: [
							["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
							["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
						]
					}));
					b.ui.addButton && b.ui.addButton("Image", {
						label: b.lang.common.image,
						command: "image",
						toolbar: "insert,10"
					});
					b.on("doubleclick", function(b) {
						var a = b.data.element;
						!a.is("img") || a.data("cke-realelement") || a.isReadOnly() || (b.data.dialog = "image")
					});
					b.addMenuItems && b.addMenuItems({
						image: {
							label: b.lang.image.menu,
							command: "image",
							group: "image"
						}
					});
					b.contextMenu && b.contextMenu.addListener(function(a) {
						if (e(b, a)) return {
							image: CKEDITOR.TRISTATE_OFF
						}
					})
				}
			},
			afterInit: function(b) {
				function a(a) {
					var d = b.getCommand("justify" + a);
					if (d) {
						if ("left" == a || "right" == a) d.on("exec", function(d) {
							var c = e(b),
								g;
							c && (g = f(c), g == a ? (c.removeStyle("float"), a == f(c) && c.removeAttribute("align")) : c.setStyle("float", a), d.cancel())
						});
						d.on("refresh", function(d) {
							var c = e(b);
							c && (c = f(c), this.setState(c == a ? CKEDITOR.TRISTATE_ON : "right" == a || "left" == a ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), d.cancel())
						})
					}
				}
				b.plugins.image2 || (a("left"), a("right"), a("center"), a("block"))
			}
		})
	})();
	CKEDITOR.config.image_removeLinkByEmptyURL = !0;
	(function() {
		function m(a, b) {
			var e, f;
			b.on("refresh", function(a) {
				var b = [k],
					c;
				for (c in a.data.states) b.push(a.data.states[c]);
				this.setState(CKEDITOR.tools.search(b, p) ? p : k)
			}, b, null, 100);
			b.on("exec", function(b) {
				e = a.getSelection();
				f = e.createBookmarks(1);
				b.data || (b.data = {});
				b.data.done = !1
			}, b, null, 0);
			b.on("exec", function() {
				a.forceNextSelectionCheck();
				e.selectBookmarks(f)
			}, b, null, 100)
		}
		var k = CKEDITOR.TRISTATE_DISABLED,
			p = CKEDITOR.TRISTATE_OFF;
		CKEDITOR.plugins.add("indent", {
			init: function(a) {
				var b = CKEDITOR.plugins.indent.genericDefinition;
				m(a, a.addCommand("indent", new b(!0)));
				m(a, a.addCommand("outdent", new b));
				a.ui.addButton && (a.ui.addButton("Indent", {
					label: a.lang.indent.indent,
					command: "indent",
					directional: !0,
					toolbar: "indent,20"
				}), a.ui.addButton("Outdent", {
					label: a.lang.indent.outdent,
					command: "outdent",
					directional: !0,
					toolbar: "indent,10"
				}));
				a.on("dirChanged", function(b) {
					var f = a.createRange(),
						l = b.data.node;
					f.setStartBefore(l);
					f.setEndAfter(l);
					for (var n = new CKEDITOR.dom.walker(f), c; c = n.next();) if (c.type == CKEDITOR.NODE_ELEMENT) if (!c.equals(l) && c.getDirection()) f.setStartAfter(c), n = new CKEDITOR.dom.walker(f);
					else {
						var d = a.config.indentClasses;
						if (d) for (var g = "ltr" == b.data.dir ? ["_rtl", ""] : ["", "_rtl"], h = 0; h < d.length; h++) c.hasClass(d[h] + g[0]) && (c.removeClass(d[h] + g[0]), c.addClass(d[h] + g[1]));
						d = c.getStyle("margin-right");
						g = c.getStyle("margin-left");
						d ? c.setStyle("margin-left", d) : c.removeStyle("margin-left");
						g ? c.setStyle("margin-right", g) : c.removeStyle("margin-right")
					}
				})
			}
		});
		CKEDITOR.plugins.indent = {
			genericDefinition: function(a) {
				this.isIndent = !! a;
				this.startDisabled = !this.isIndent
			},
			specificDefinition: function(a, b, e) {
				this.name = b;
				this.editor = a;
				this.jobs = {};
				this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
				this.isIndent = !! e;
				this.relatedGlobal = e ? "indent" : "outdent";
				this.indentKey = e ? 9 : CKEDITOR.SHIFT + 9;
				this.database = {}
			},
			registerCommands: function(a, b) {
				a.on("pluginsLoaded", function() {
					for (var a in b)(function(a, b) {
						var e = a.getCommand(b.relatedGlobal),
							c;
						for (c in b.jobs) e.on("exec", function(d) {
							d.data.done || (a.fire("lockSnapshot"), b.execJob(a, c) && (d.data.done = !0), a.fire("unlockSnapshot"), CKEDITOR.dom.element.clearAllMarkers(b.database))
						}, this, null, c), e.on("refresh", function(d) {
							d.data.states || (d.data.states = {});
							d.data.states[b.name + "@" + c] = b.refreshJob(a, c, d.data.path)
						}, this, null, c);
						a.addFeature(b)
					})(this, b[a])
				})
			}
		};
		CKEDITOR.plugins.indent.genericDefinition.prototype = {
			context: "p",
			exec: function() {}
		};
		CKEDITOR.plugins.indent.specificDefinition.prototype = {
			execJob: function(a, b) {
				var e = this.jobs[b];
				if (e.state != k) return e.exec.call(this, a)
			},
			refreshJob: function(a, b, e) {
				b = this.jobs[b];
				a.activeFilter.checkFeature(this) ? b.state = b.refresh.call(this, a, e) : b.state = k;
				return b.state
			},
			getContext: function(a) {
				return a.contains(this.context)
			}
		}
	})();
	(function() {
		function f(b, c, a) {
			if (!b.getCustomData("indent_processed")) {
				var d = this.editor,
					l = this.isIndent;
				if (c) {
					d = b.$.className.match(this.classNameRegex);
					a = 0;
					d && (d = d[1], a = CKEDITOR.tools.indexOf(c, d) + 1);
					if (0 > (a += l ? 1 : -1)) return;
					a = Math.min(a, c.length);
					a = Math.max(a, 0);
					b.$.className = CKEDITOR.tools.ltrim(b.$.className.replace(this.classNameRegex, ""));
					0 < a && b.addClass(c[a - 1])
				} else {
					c = m(b, a);
					a = parseInt(b.getStyle(c), 10);
					var g = d.config.indentOffset || 40;
					isNaN(a) && (a = 0);
					a += (l ? 1 : -1) * g;
					if (0 > a) return;
					a = Math.max(a, 0);
					a = Math.ceil(a / g) * g;
					b.setStyle(c, a ? a + (d.config.indentUnit || "px") : "");
					"" === b.getAttribute("style") && b.removeAttribute("style")
				}
				CKEDITOR.dom.element.setMarker(this.database, b, "indent_processed", 1)
			}
		}

		function m(b, c) {
			return "ltr" == (c || b.getComputedStyle("direction")) ? "margin-left" : "margin-right"
		}
		var h = CKEDITOR.dtd.$listItem,
			p = CKEDITOR.dtd.$list,
			k = CKEDITOR.TRISTATE_DISABLED,
			n = CKEDITOR.TRISTATE_OFF;
		CKEDITOR.plugins.add("indentblock", {
			requires: "indent",
			init: function(b) {
				function c() {
					a.specificDefinition.apply(this, arguments);
					this.allowedContent = {
						"div h1 h2 h3 h4 h5 h6 ol p pre ul": {
							propertiesOnly: !0,
							styles: d ? null : "margin-left,margin-right",
							classes: d || null
						}
					};
					this.enterBr && (this.allowedContent.div = !0);
					this.requiredContent = (this.enterBr ? "div" : "p") + (d ? "(" + d.join(",") + ")" : "{margin-left}");
					this.jobs = {
						20: {
							refresh: function(a, b) {
								var e = b.block || b.blockLimit;
								if (!e.is(h)) var c = e.getAscendant(h),
									e = c && b.contains(c) || e;
								e.is(h) && (e = e.getParent());
								if (this.enterBr || this.getContext(b)) {
									if (d) {
										var c = d,
											e = e.$.className.match(this.classNameRegex),
											f = this.isIndent,
											c = e ? f ? e[1] != c.slice(-1) : !0 : f;
										return c ? n : k
									}
									return this.isIndent ? n : e ? CKEDITOR[0 >= (parseInt(e.getStyle(m(e)), 10) || 0) ? "TRISTATE_DISABLED" : "TRISTATE_OFF"] : k
								}
								return k
							},
							exec: function(a) {
								var b = a.getSelection(),
									b = b && b.getRanges()[0],
									c;
								if (c = a.elementPath().contains(p)) f.call(this, c, d);
								else for (b = b.createIterator(), a = a.config.enterMode, b.enforceRealBlocks = !0, b.enlargeBr = a != CKEDITOR.ENTER_BR; c = b.getNextParagraph(a == CKEDITOR.ENTER_P ? "p" : "div");) c.isReadOnly() || f.call(this, c, d);
								return !0
							}
						}
					}
				}
				var a = CKEDITOR.plugins.indent,
					d = b.config.indentClasses;
				a.registerCommands(b, {
					indentblock: new c(b, "indentblock", !0),
					outdentblock: new c(b, "outdentblock")
				});
				CKEDITOR.tools.extend(c.prototype, a.specificDefinition.prototype, {
					context: {
						div: 1,
						dl: 1,
						h1: 1,
						h2: 1,
						h3: 1,
						h4: 1,
						h5: 1,
						h6: 1,
						ul: 1,
						ol: 1,
						p: 1,
						pre: 1,
						table: 1
					},
					classNameRegex: d ? new RegExp("(?:^|\\s+)(" + d.join("|") + ")(?=$|\\s)") : null
				})
			}
		})
	})();
	(function() {
		function w(c) {
			function f(b) {
				for (var e = d.startContainer, a = d.endContainer; e && !e.getParent().equals(b);) e = e.getParent();
				for (; a && !a.getParent().equals(b);) a = a.getParent();
				if (!e || !a) return !1;
				for (var g = e, e = [], k = !1; !k;) g.equals(a) && (k = !0), e.push(g), g = g.getNext();
				if (1 > e.length) return !1;
				g = b.getParents(!0);
				for (a = 0; a < g.length; a++) if (g[a].getName && p[g[a].getName()]) {
					b = g[a];
					break
				}
				for (var g = l.isIndent ? 1 : -1, a = e[0], e = e[e.length - 1], k = CKEDITOR.plugins.list.listToArray(b, q), n = k[e.getCustomData("listarray_index")].indent, a = a.getCustomData("listarray_index"); a <= e.getCustomData("listarray_index"); a++) if (k[a].indent += g, 0 < g) {
					var h = k[a].parent;
					k[a].parent = new CKEDITOR.dom.element(h.getName(), h.getDocument())
				}
				for (a = e.getCustomData("listarray_index") + 1; a < k.length && k[a].indent > n; a++) k[a].indent += g;
				e = CKEDITOR.plugins.list.arrayToList(k, q, null, c.config.enterMode, b.getDirection());
				if (!l.isIndent) {
					var f;
					if ((f = b.getParent()) && f.is("li")) for (var g = e.listNode.getChildren(), r = [], m, a = g.count() - 1; 0 <= a; a--)(m = g.getItem(a)) && m.is && m.is("li") && r.push(m)
				}
				e && e.listNode.replace(b);
				if (r && r.length) for (a = 0; a < r.length; a++) {
					for (m = b = r[a];
					(m = m.getNext()) && m.is && m.getName() in p;) CKEDITOR.env.needsNbspFiller && !b.getFirst(x) && b.append(d.document.createText(" ")), b.append(m);
					b.insertAfter(f)
				}
				e && c.fire("contentDomInvalidated");
				return !0
			}
			for (var l = this, q = this.database, p = this.context, n = c.getSelection(), n = (n && n.getRanges()).createIterator(), d; d = n.getNextRange();) {
				for (var b = d.getCommonAncestor(); b && (b.type != CKEDITOR.NODE_ELEMENT || !p[b.getName()]);) {
					if (c.editable().equals(b)) {
						b = !1;
						break
					}
					b = b.getParent()
				}
				b || (b = d.startPath().contains(p)) && d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
				if (!b) {
					var h = d.getEnclosedNode();
					h && h.type == CKEDITOR.NODE_ELEMENT && h.getName() in p && (d.setStartAt(h, CKEDITOR.POSITION_AFTER_START), d.setEndAt(h, CKEDITOR.POSITION_BEFORE_END), b = h)
				}
				b && d.startContainer.type == CKEDITOR.NODE_ELEMENT && d.startContainer.getName() in p && (h = new CKEDITOR.dom.walker(d), h.evaluator = t, d.startContainer = h.next());
				b && d.endContainer.type == CKEDITOR.NODE_ELEMENT && d.endContainer.getName() in p && (h = new CKEDITOR.dom.walker(d), h.evaluator = t, d.endContainer = h.previous());
				if (b) return f(b)
			}
			return 0
		}

		function t(c) {
			return c.type == CKEDITOR.NODE_ELEMENT && c.is("li")
		}

		function x(c) {
			return y(c) && z(c)
		}
		var y = CKEDITOR.dom.walker.whitespaces(!0),
			z = CKEDITOR.dom.walker.bookmark(!1, !0),
			u = CKEDITOR.TRISTATE_DISABLED,
			v = CKEDITOR.TRISTATE_OFF;
		CKEDITOR.plugins.add("indentlist", {
			requires: "indent",
			init: function(c) {
				function f(c) {
					l.specificDefinition.apply(this, arguments);
					this.requiredContent = ["ul", "ol"];
					c.on("key", function(f) {
						if ("wysiwyg" == c.mode && f.data.keyCode == this.indentKey) {
							var n = this.getContext(c.elementPath());
							!n || this.isIndent && CKEDITOR.plugins.indentList.firstItemInPath(this.context, c.elementPath(), n) || (c.execCommand(this.relatedGlobal), f.cancel())
						}
					}, this);
					this.jobs[this.isIndent ? 10 : 30] = {
						refresh: this.isIndent ?
						function(c, f) {
							var d = this.getContext(f),
								b = CKEDITOR.plugins.indentList.firstItemInPath(this.context, f, d);
							return d && this.isIndent && !b ? v : u
						} : function(c, f) {
							return !this.getContext(f) || this.isIndent ? u : v
						},
						exec: CKEDITOR.tools.bind(w, this)
					}
				}
				var l = CKEDITOR.plugins.indent;
				l.registerCommands(c, {
					indentlist: new f(c, "indentlist", !0),
					outdentlist: new f(c, "outdentlist")
				});
				CKEDITOR.tools.extend(f.prototype, l.specificDefinition.prototype, {
					context: {
						ol: 1,
						ul: 1
					}
				})
			}
		});
		CKEDITOR.plugins.indentList = {};
		CKEDITOR.plugins.indentList.firstItemInPath = function(c, f, l) {
			var q = f.contains(t);
			l || (l = f.contains(c));
			return l && q && q.equals(l.getFirst(t))
		}
	})();
	CKEDITOR.plugins.add("smiley", {
		requires: "dialog",
		init: function(a) {
			a.config.smiley_path = a.config.smiley_path || this.path + "images/";
			a.addCommand("smiley", new CKEDITOR.dialogCommand("smiley", {
				allowedContent: "img[alt,height,!src,title,width]",
				requiredContent: "img"
			}));
			a.ui.addButton && a.ui.addButton("Smiley", {
				label: a.lang.smiley.toolbar,
				command: "smiley",
				toolbar: "insert,50"
			});
			CKEDITOR.dialog.add("smiley", this.path + "dialogs/smiley.js")
		}
	});
	CKEDITOR.config.smiley_images = "regular_smile.png sad_smile.png wink_smile.png teeth_smile.png confused_smile.png tongue_smile.png embarrassed_smile.png omg_smile.png whatchutalkingabout_smile.png angry_smile.png angel_smile.png shades_smile.png devil_smile.png cry_smile.png lightbulb.png thumbs_down.png thumbs_up.png heart.png broken_heart.png kiss.png envelope.png".split(" ");
	CKEDITOR.config.smiley_descriptions = "smiley;sad;wink;laugh;frown;cheeky;blush;surprise;indecision;angry;angel;cool;devil;crying;enlightened;no;yes;heart;broken heart;kiss;mail".split(";");
	(function() {
		function n(a, c) {
			c = void 0 === c || c;
			var b;
			if (c) b = a.getComputedStyle("text-align");
			else {
				for (; !a.hasAttribute || !a.hasAttribute("align") && !a.getStyle("text-align");) {
					b = a.getParent();
					if (!b) break;
					a = b
				}
				b = a.getStyle("text-align") || a.getAttribute("align") || ""
			}
			b && (b = b.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ""));
			!b && c && (b = "rtl" == a.getComputedStyle("direction") ? "right" : "left");
			return b
		}

		function g(a, c, b) {
			this.editor = a;
			this.name = c;
			this.value = b;
			this.context = "p";
			c = a.config.justifyClasses;
			var h = a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
			if (c) {
				switch (b) {
				case "left":
					this.cssClassName = c[0];
					break;
				case "center":
					this.cssClassName = c[1];
					break;
				case "right":
					this.cssClassName = c[2];
					break;
				case "justify":
					this.cssClassName = c[3]
				}
				this.cssClassRegex = new RegExp("(?:^|\\s+)(?:" + c.join("|") + ")(?=$|\\s)");
				this.requiredContent = h + "(" + this.cssClassName + ")"
			} else this.requiredContent = h + "{text-align}";
			this.allowedContent = {
				"caption div h1 h2 h3 h4 h5 h6 p pre td th li": {
					propertiesOnly: !0,
					styles: this.cssClassName ? null : "text-align",
					classes: this.cssClassName || null
				}
			};
			a.config.enterMode == CKEDITOR.ENTER_BR && (this.allowedContent.div = !0)
		}

		function l(a) {
			var c = a.editor,
				b = c.createRange();
			b.setStartBefore(a.data.node);
			b.setEndAfter(a.data.node);
			for (var h = new CKEDITOR.dom.walker(b), d; d = h.next();) if (d.type == CKEDITOR.NODE_ELEMENT) if (!d.equals(a.data.node) && d.getDirection()) b.setStartAfter(d), h = new CKEDITOR.dom.walker(b);
			else {
				var e = c.config.justifyClasses;
				e && (d.hasClass(e[0]) ? (d.removeClass(e[0]), d.addClass(e[2])) : d.hasClass(e[2]) && (d.removeClass(e[2]), d.addClass(e[0])));
				e = d.getStyle("text-align");
				"left" == e ? d.setStyle("text-align", "right") : "right" == e && d.setStyle("text-align", "left")
			}
		}
		g.prototype = {
			exec: function(a) {
				var c = a.getSelection(),
					b = a.config.enterMode;
				if (c) {
					for (var h = c.createBookmarks(), d = c.getRanges(), e = this.cssClassName, g, f, k = a.config.useComputedState, k = void 0 === k || k, m = d.length - 1; 0 <= m; m--) for (g = d[m].createIterator(), g.enlargeBr = b != CKEDITOR.ENTER_BR; f = g.getNextParagraph(b == CKEDITOR.ENTER_P ? "p" : "div");) if (!f.isReadOnly()) {
						f.removeAttribute("align");
						f.removeStyle("text-align");
						var l = e && (f.$.className = CKEDITOR.tools.ltrim(f.$.className.replace(this.cssClassRegex, ""))),
							p = this.state == CKEDITOR.TRISTATE_OFF && (!k || n(f, !0) != this.value);
						e ? p ? f.addClass(e) : l || f.removeAttribute("class") : p && f.setStyle("text-align", this.value)
					}
					a.focus();
					a.forceNextSelectionCheck();
					c.selectBookmarks(h)
				}
			},
			refresh: function(a, c) {
				var b = c.block || c.blockLimit;
				this.setState("body" != b.getName() && n(b, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
			}
		};
		CKEDITOR.plugins.add("justify", {
			init: function(a) {
				if (!a.blockless) {
					var c = new g(a, "justifyleft", "left"),
						b = new g(a, "justifycenter", "center"),
						h = new g(a, "justifyright", "right"),
						d = new g(a, "justifyblock", "justify");
					a.addCommand("justifyleft", c);
					a.addCommand("justifycenter", b);
					a.addCommand("justifyright", h);
					a.addCommand("justifyblock", d);
					a.ui.addButton && (a.ui.addButton("JustifyLeft", {
						label: a.lang.justify.left,
						command: "justifyleft",
						toolbar: "align,10"
					}), a.ui.addButton("JustifyCenter", {
						label: a.lang.justify.center,
						command: "justifycenter",
						toolbar: "align,20"
					}), a.ui.addButton("JustifyRight", {
						label: a.lang.justify.right,
						command: "justifyright",
						toolbar: "align,30"
					}), a.ui.addButton("JustifyBlock", {
						label: a.lang.justify.block,
						command: "justifyblock",
						toolbar: "align,40"
					}));
					a.on("dirChanged", l)
				}
			}
		})
	})();
	CKEDITOR.plugins.add("menubutton", {
		requires: "button,menu",
		onLoad: function() {
			var d = function(c) {
					var a = this._,
						b = a.menu;
					a.state !== CKEDITOR.TRISTATE_DISABLED && (a.on && b ? b.hide() : (a.previousState = a.state, b || (b = a.menu = new CKEDITOR.menu(c, {
						panel: {
							className: "cke_menu_panel",
							attributes: {
								"aria-label": c.lang.common.options
							}
						}
					}), b.onHide = CKEDITOR.tools.bind(function() {
						var b = this.command ? c.getCommand(this.command).modes : this.modes;
						this.setState(!b || b[c.mode] ? a.previousState : CKEDITOR.TRISTATE_DISABLED);
						a.on = 0
					}, this), this.onMenu && b.addListener(this.onMenu)), this.setState(CKEDITOR.TRISTATE_ON), a.on = 1, setTimeout(function() {
						b.show(CKEDITOR.document.getById(a.id), 4)
					}, 0)))
				};
			CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
				base: CKEDITOR.ui.button,
				$: function(c) {
					delete c.panel;
					this.base(c);
					this.hasArrow = !0;
					this.click = d
				},
				statics: {
					handler: {
						create: function(c) {
							return new CKEDITOR.ui.menuButton(c)
						}
					}
				}
			})
		},
		beforeInit: function(d) {
			d.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
		}
	});
	CKEDITOR.UI_MENUBUTTON = "menubutton";
	(function() {
		CKEDITOR.plugins.add("language", {
			requires: "menubutton",
			init: function(a) {
				var b = a.config.language_list || ["ar:Arabic:rtl", "fr:French", "es:Spanish"],
					c = this,
					d = a.lang.language,
					e = {},
					g, h, k, f;
				a.addCommand("language", {
					allowedContent: "span[!lang,!dir]",
					requiredContent: "span[lang,dir]",
					contextSensitive: !0,
					exec: function(a, b) {
						var c = e["language_" + b];
						if (c) a[c.style.checkActive(a.elementPath(), a) ? "removeStyle" : "applyStyle"](c.style)
					},
					refresh: function(a) {
						this.setState(c.getCurrentLangElement(a) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
					}
				});
				for (f = 0; f < b.length; f++) g = b[f].split(":"), h = g[0], k = "language_" + h, e[k] = {
					label: g[1],
					langId: h,
					group: "language",
					order: f,
					ltr: "rtl" != ("" + g[2]).toLowerCase(),
					onClick: function() {
						a.execCommand("language", this.langId)
					},
					role: "menuitemcheckbox"
				}, e[k].style = new CKEDITOR.style({
					element: "span",
					attributes: {
						lang: h,
						dir: e[k].ltr ? "ltr" : "rtl"
					}
				});
				e.language_remove = {
					label: d.remove,
					group: "language_remove",
					state: CKEDITOR.TRISTATE_DISABLED,
					order: e.length,
					onClick: function() {
						var b = c.getCurrentLangElement(a);
						b && a.execCommand("language", b.getAttribute("lang"))
					}
				};
				a.addMenuGroup("language", 1);
				a.addMenuGroup("language_remove");
				a.addMenuItems(e);
				a.ui.add("Language", CKEDITOR.UI_MENUBUTTON, {
					label: d.button,
					allowedContent: "span[!lang,!dir]",
					requiredContent: "span[lang,dir]",
					toolbar: "bidi,30",
					command: "language",
					onMenu: function() {
						var b = {},
							d = c.getCurrentLangElement(a),
							f;
						for (f in e) b[f] = CKEDITOR.TRISTATE_OFF;
						b.language_remove = d ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
						d && (b["language_" + d.getAttribute("lang")] = CKEDITOR.TRISTATE_ON);
						return b
					}
				})
			},
			getCurrentLangElement: function(a) {
				var b = a.elementPath();
				a = b && b.elements;
				var c;
				if (b) for (var d = 0; d < a.length; d++) b = a[d], !c && "span" == b.getName() && b.hasAttribute("dir") && b.hasAttribute("lang") && (c = b);
				return c
			}
		})
	})();
	(function() {
		function p(c) {
			return c.replace(/'/g, "\\$&")
		}

		function q(c) {
			for (var b, a = c.length, f = [], e = 0; e < a; e++) b = c.charCodeAt(e), f.push(b);
			return "String.fromCharCode(" + f.join(",") + ")"
		}

		function r(c, b) {
			var a = c.plugins.link,
				f = a.compiledProtectionFunction.params,
				e, d;
			d = [a.compiledProtectionFunction.name, "("];
			for (var g = 0; g < f.length; g++) a = f[g].toLowerCase(), e = b[a], 0 < g && d.push(","), d.push("'", e ? p(encodeURIComponent(b[a])) : "", "'");
			d.push(")");
			return d.join("")
		}

		function n(c) {
			c = c.config.emailProtection || "";
			var b;
			c && "encode" != c && (b = {}, c.replace(/^([^(]+)\(([^)]+)\)$/, function(a, c, e) {
				b.name = c;
				b.params = [];
				e.replace(/[^,\s]+/g, function(a) {
					b.params.push(a)
				})
			}));
			return b
		}
		CKEDITOR.plugins.add("link", {
			requires: "dialog,fakeobjects",
			onLoad: function() {
				function c(b) {
					return a.replace(/%1/g, "rtl" == b ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
				}
				var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
					a = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
				CKEDITOR.addCss(c("ltr") + c("rtl"))
			},
			init: function(c) {
				var b = "a[!href]";
				CKEDITOR.dialog.isTabEnabled(c, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
				CKEDITOR.dialog.isTabEnabled(c, "link", "target") && (b = b.replace("]", ",target,onclick]"));
				c.addCommand("link", new CKEDITOR.dialogCommand("link", {
					allowedContent: b,
					requiredContent: "a[href]"
				}));
				c.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
					allowedContent: "a[!name,id]",
					requiredContent: "a[name]"
				}));
				c.addCommand("unlink", new CKEDITOR.unlinkCommand);
				c.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
				c.setKeystroke(CKEDITOR.CTRL + 76, "link");
				c.ui.addButton && (c.ui.addButton("Link", {
					label: c.lang.link.toolbar,
					command: "link",
					toolbar: "links,10"
				}), c.ui.addButton("Unlink", {
					label: c.lang.link.unlink,
					command: "unlink",
					toolbar: "links,20"
				}), c.ui.addButton("Anchor", {
					label: c.lang.link.anchor.toolbar,
					command: "anchor",
					toolbar: "links,30"
				}));
				CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
				CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
				c.on("doubleclick", function(a) {
					var b = CKEDITOR.plugins.link.getSelectedLink(c) || a.data.element;
					b.isReadOnly() || (b.is("a") ? (a.data.dialog = !b.getAttribute("name") || b.getAttribute("href") && b.getChildCount() ? "link" : "anchor", a.data.link = b) : CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, b) && (a.data.dialog = "anchor"))
				}, null, null, 0);
				c.on("doubleclick", function(a) {
					a.data.dialog in {
						link: 1,
						anchor: 1
					} && a.data.link && c.getSelection().selectElement(a.data.link)
				}, null, null, 20);
				c.addMenuItems && c.addMenuItems({
					anchor: {
						label: c.lang.link.anchor.menu,
						command: "anchor",
						group: "anchor",
						order: 1
					},
					removeAnchor: {
						label: c.lang.link.anchor.remove,
						command: "removeAnchor",
						group: "anchor",
						order: 5
					},
					link: {
						label: c.lang.link.menu,
						command: "link",
						group: "link",
						order: 1
					},
					unlink: {
						label: c.lang.link.unlink,
						command: "unlink",
						group: "link",
						order: 5
					}
				});
				c.contextMenu && c.contextMenu.addListener(function(a) {
					if (!a || a.isReadOnly()) return null;
					a = CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, a);
					if (!a && !(a = CKEDITOR.plugins.link.getSelectedLink(c))) return null;
					var b = {};
					a.getAttribute("href") && a.getChildCount() && (b = {
						link: CKEDITOR.TRISTATE_OFF,
						unlink: CKEDITOR.TRISTATE_OFF
					});
					a && a.hasAttribute("name") && (b.anchor = b.removeAnchor = CKEDITOR.TRISTATE_OFF);
					return b
				});
				this.compiledProtectionFunction = n(c)
			},
			afterInit: function(c) {
				c.dataProcessor.dataFilter.addRules({
					elements: {
						a: function(a) {
							return a.attributes.name ? a.children.length ? null : c.createFakeParserElement(a, "cke_anchor", "anchor") : null
						}
					}
				});
				var b = c._.elementsPath && c._.elementsPath.filters;
				b && b.push(function(a, b) {
					if ("a" == b && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, a) || a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount()))) return "anchor"
				})
			}
		});
		var t = /^javascript:/,
			u = /^mailto:([^?]+)(?:\?(.+))?$/,
			v = /subject=([^;?:@&=$,\/]*)/i,
			w = /body=([^;?:@&=$,\/]*)/i,
			x = /^#(.*)$/,
			y = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
			z = /^(_(?:self|top|parent|blank))$/,
			A = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
			B = /^javascript:([^(]+)\(([^)]+)\)$/,
			C = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
			D = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
			m = {
				id: "advId",
				dir: "advLangDir",
				accessKey: "advAccessKey",
				name: "advName",
				lang: "advLangCode",
				tabindex: "advTabIndex",
				title: "advTitle",
				type: "advContentType",
				"class": "advCSSClasses",
				charset: "advCharset",
				style: "advStyles",
				rel: "advRel"
			};
		CKEDITOR.plugins.link = {
			getSelectedLink: function(c) {
				var b = c.getSelection(),
					a = b.getSelectedElement();
				return a && a.is("a") ? a : (b = b.getRanges()[0]) ? (b.shrink(CKEDITOR.SHRINK_TEXT), c.elementPath(b.getCommonAncestor()).contains("a", 1)) : null
			},
			getEditorAnchors: function(c) {
				for (var b = c.editable(), a = b.isInline() && !c.plugins.divarea ? c.document : b, b = a.getElementsByTag("a"), a = a.getElementsByTag("img"), f = [], e = 0, d; d = b.getItem(e++);)(d.data("cke-saved-name") || d.hasAttribute("name")) && f.push({
					name: d.data("cke-saved-name") || d.getAttribute("name"),
					id: d.getAttribute("id")
				});
				for (e = 0; d = a.getItem(e++);)(d = this.tryRestoreFakeAnchor(c, d)) && f.push({
					name: d.getAttribute("name"),
					id: d.getAttribute("id")
				});
				return f
			},
			fakeAnchor: !0,
			tryRestoreFakeAnchor: function(c, b) {
				if (b && b.data("cke-real-element-type") && "anchor" == b.data("cke-real-element-type")) {
					var a = c.restoreRealElement(b);
					if (a.data("cke-saved-name")) return a
				}
			},
			parseLinkAttributes: function(c, b) {
				var a = b && (b.data("cke-saved-href") || b.getAttribute("href")) || "",
					f = c.plugins.link.compiledProtectionFunction,
					e = c.config.emailProtection,
					d, g = {};
				a.match(t) && ("encode" == e ? a = a.replace(A, function(a, b, c) {
					c = c || "";
					return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + c.replace(/\\'/g, "'")
				}) : e && a.replace(B, function(a, b, c) {
					if (b == f.name) {
						g.type = "email";
						a = g.email = {};
						b = /(^')|('$)/g;
						c = c.match(/[^,\s]+/g);
						for (var d = c.length, e, h, k = 0; k < d; k++) e = decodeURIComponent, h = c[k].replace(b, "").replace(/\\'/g, "'"), h = e(h), e = f.params[k].toLowerCase(), a[e] = h;
						a.address = [a.name, a.domain].join("@")
					}
				}));
				if (!g.type) if (e = a.match(x)) g.type = "anchor", g.anchor = {}, g.anchor.name = g.anchor.id = e[1];
				else if (e = a.match(u)) {
					d = a.match(v);
					a = a.match(w);
					g.type = "email";
					var k = g.email = {};
					k.address = e[1];
					d && (k.subject = decodeURIComponent(d[1]));
					a && (k.body = decodeURIComponent(a[1]))
				} else a && (d = a.match(y)) && (g.type = "url", g.url = {}, g.url.protocol = d[1], g.url.url = d[2]);
				if (b) {
					if (a = b.getAttribute("target")) g.target = {
						type: a.match(z) ? a : "frame",
						name: a
					};
					else if (a = (a = b.data("cke-pa-onclick") || b.getAttribute("onclick")) && a.match(C)) for (g.target = {
						type: "popup",
						name: a[1]
					}; e = D.exec(a[2]);)"yes" != e[2] && "1" != e[2] || e[1] in {
						height: 1,
						width: 1,
						top: 1,
						left: 1
					} ? isFinite(e[2]) && (g.target[e[1]] = e[2]) : g.target[e[1]] = !0;
					var a = {},
						h;
					for (h in m)(e = b.getAttribute(h)) && (a[m[h]] = e);
					if (h = b.data("cke-saved-name") || a.advName) a.advName = h;
					CKEDITOR.tools.isEmpty(a) || (g.advanced = a)
				}
				return g
			},
			getLinkAttributes: function(c, b) {
				var a = c.config.emailProtection || "",
					f = {};
				switch (b.type) {
				case "url":
					var a = b.url && void 0 !== b.url.protocol ? b.url.protocol : "http://",
						e = b.url && CKEDITOR.tools.trim(b.url.url) || "";
					f["data-cke-saved-href"] = 0 === e.indexOf("/") ? e : a + e;
					break;
				case "anchor":
					a = b.anchor && b.anchor.id;
					f["data-cke-saved-href"] = "#" + (b.anchor && b.anchor.name || a || "");
					break;
				case "email":
					var d = b.email,
						e = d.address;
					switch (a) {
					case "":
					case "encode":
						var g = encodeURIComponent(d.subject || ""),
							k = encodeURIComponent(d.body || ""),
							d = [];
						g && d.push("subject=" + g);
						k && d.push("body=" + k);
						d = d.length ? "?" + d.join("&") : "";
						"encode" == a ? (a = ["javascript:void(location.href='mailto:'+", q(e)], d && a.push("+'", p(d), "'"), a.push(")")) : a = ["mailto:", e, d];
						break;
					default:
						a = e.split("@", 2), d.name = a[0], d.domain = a[1], a = ["javascript:", r(c, d)]
					}
					f["data-cke-saved-href"] = a.join("")
				}
				if (b.target) if ("popup" == b.target.type) {
					for (var a = ["window.open(this.href, '", b.target.name || "", "', '"], h = "resizable status location toolbar menubar fullscreen scrollbars dependent".split(" "), e = h.length, g = function(a) {
							b.target[a] && h.push(a + "=" + b.target[a])
						}, d = 0; d < e; d++) h[d] += b.target[h[d]] ? "=yes" : "=no";
					g("width");
					g("left");
					g("height");
					g("top");
					a.push(h.join(","), "'); return false;");
					f["data-cke-pa-onclick"] = a.join("")
				} else "notSet" != b.target.type && b.target.name && (f.target = b.target.name);
				if (b.advanced) {
					for (var l in m)(a = b.advanced[m[l]]) && (f[l] = a);
					f.name && (f["data-cke-saved-name"] = f.name)
				}
				f["data-cke-saved-href"] && (f.href = f["data-cke-saved-href"]);
				l = {
					target: 1,
					onclick: 1,
					"data-cke-pa-onclick": 1,
					"data-cke-saved-name": 1
				};
				b.advanced && CKEDITOR.tools.extend(l, m);
				for (var n in f) delete l[n];
				return {
					set: f,
					removed: CKEDITOR.tools.objectKeys(l)
				}
			}
		};
		CKEDITOR.unlinkCommand = function() {};
		CKEDITOR.unlinkCommand.prototype = {
			exec: function(c) {
				var b = new CKEDITOR.style({
					element: "a",
					type: CKEDITOR.STYLE_INLINE,
					alwaysRemoveElement: 1
				});
				c.removeStyle(b)
			},
			refresh: function(c, b) {
				var a = b.lastElement && b.lastElement.getAscendant("a", !0);
				a && "a" == a.getName() && a.getAttribute("href") && a.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
			},
			contextSensitive: 1,
			startDisabled: 1,
			requiredContent: "a[href]"
		};
		CKEDITOR.removeAnchorCommand = function() {};
		CKEDITOR.removeAnchorCommand.prototype = {
			exec: function(c) {
				var b = c.getSelection(),
					a = b.createBookmarks(),
					f;
				if (b && (f = b.getSelectedElement()) && (f.getChildCount() ? f.is("a") : CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, f))) f.remove(1);
				else if (f = CKEDITOR.plugins.link.getSelectedLink(c)) f.hasAttribute("href") ? (f.removeAttributes({
					name: 1,
					"data-cke-saved-name": 1
				}), f.removeClass("cke_anchor")) : f.remove(1);
				b.selectBookmarks(a)
			},
			requiredContent: "a[name]"
		};
		CKEDITOR.tools.extend(CKEDITOR.config, {
			linkShowAdvancedTab: !0,
			linkShowTargetTab: !0
		})
	})();
	(function() {
		function I(b, m, e) {
			function c(c) {
				if (!(!(a = d[c ? "getFirst" : "getLast"]()) || a.is && a.isBlockBoundary() || !(p = m.root[c ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) || p.is && p.isBlockBoundary({
					br: 1
				}))) b.document.createElement("br")[c ? "insertBefore" : "insertAfter"](a)
			}
			for (var f = CKEDITOR.plugins.list.listToArray(m.root, e), g = [], k = 0; k < m.contents.length; k++) {
				var h = m.contents[k];
				(h = h.getAscendant("li", !0)) && !h.getCustomData("list_item_processed") && (g.push(h), CKEDITOR.dom.element.setMarker(e, h, "list_item_processed", !0))
			}
			h = null;
			for (k = 0; k < g.length; k++) h = g[k].getCustomData("listarray_index"), f[h].indent = -1;
			for (k = h + 1; k < f.length; k++) if (f[k].indent > f[k - 1].indent + 1) {
				g = f[k - 1].indent + 1 - f[k].indent;
				for (h = f[k].indent; f[k] && f[k].indent >= h;) f[k].indent += g, k++;
				k--
			}
			var d = CKEDITOR.plugins.list.arrayToList(f, e, null, b.config.enterMode, m.root.getAttribute("dir")).listNode,
				a, p;
			c(!0);
			c();
			d.replace(m.root);
			b.fire("contentDomInvalidated")
		}

		function B(b, m) {
			this.name = b;
			this.context = this.type = m;
			this.allowedContent = m + " li";
			this.requiredContent = m
		}

		function E(b, m, e, c) {
			for (var f, g; f = b[c ? "getLast" : "getFirst"](J);)(g = f.getDirection(1)) !== m.getDirection(1) && f.setAttribute("dir", g), f.remove(), e ? f[c ? "insertBefore" : "insertAfter"](e) : m.append(f, c)
		}

		function F(b) {
			function m(e) {
				var c = b[e ? "getPrevious" : "getNext"](u);
				c && c.type == CKEDITOR.NODE_ELEMENT && c.is(b.getName()) && (E(b, c, null, !e), b.remove(), b = c)
			}
			m();
			m(1)
		}

		function G(b) {
			return b.type == CKEDITOR.NODE_ELEMENT && (b.getName() in CKEDITOR.dtd.$block || b.getName() in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[b.getName()]["#"]
		}

		function C(b, m, e) {
			b.fire("saveSnapshot");
			e.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
			var c = e.extractContents();
			m.trim(!1, !0);
			var f = m.createBookmark(),
				g = new CKEDITOR.dom.elementPath(m.startContainer),
				k = g.block,
				g = g.lastElement.getAscendant("li", 1) || k,
				h = new CKEDITOR.dom.elementPath(e.startContainer),
				d = h.contains(CKEDITOR.dtd.$listItem),
				h = h.contains(CKEDITOR.dtd.$list);
			k ? (k = k.getBogus()) && k.remove() : h && (k = h.getPrevious(u)) && z(k) && k.remove();
			(k = c.getLast()) && k.type == CKEDITOR.NODE_ELEMENT && k.is("br") && k.remove();
			(k = m.startContainer.getChild(m.startOffset)) ? c.insertBefore(k) : m.startContainer.append(c);
			d && (c = A(d)) && (g.contains(d) ? (E(c, d.getParent(), d), c.remove()) : g.append(c));
			for (; e.checkStartOfBlock() && e.checkEndOfBlock();) {
				h = e.startPath();
				c = h.block;
				if (!c) break;
				c.is("li") && (g = c.getParent(), c.equals(g.getLast(u)) && c.equals(g.getFirst(u)) && (c = g));
				e.moveToPosition(c, CKEDITOR.POSITION_BEFORE_START);
				c.remove()
			}
			e = e.clone();
			c = b.editable();
			e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
			e = new CKEDITOR.dom.walker(e);
			e.evaluator = function(a) {
				return u(a) && !z(a)
			};
			(e = e.next()) && e.type == CKEDITOR.NODE_ELEMENT && e.getName() in CKEDITOR.dtd.$list && F(e);
			m.moveToBookmark(f);
			m.select();
			b.fire("saveSnapshot")
		}

		function A(b) {
			return (b = b.getLast(u)) && b.type == CKEDITOR.NODE_ELEMENT && b.getName() in v ? b : null
		}
		var v = {
			ol: 1,
			ul: 1
		},
			K = CKEDITOR.dom.walker.whitespaces(),
			H = CKEDITOR.dom.walker.bookmark(),
			u = function(b) {
				return !(K(b) || H(b))
			},
			z = CKEDITOR.dom.walker.bogus();
		CKEDITOR.plugins.list = {
			listToArray: function(b, m, e, c, f) {
				if (!v[b.getName()]) return [];
				c || (c = 0);
				e || (e = []);
				for (var g = 0, k = b.getChildCount(); g < k; g++) {
					var h = b.getChild(g);
					h.type == CKEDITOR.NODE_ELEMENT && h.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(h, m, e, c + 1);
					if ("li" == h.$.nodeName.toLowerCase()) {
						var d = {
							parent: b,
							indent: c,
							element: h,
							contents: []
						};
						f ? d.grandparent = f : (d.grandparent = b.getParent(), d.grandparent && "li" == d.grandparent.$.nodeName.toLowerCase() && (d.grandparent = d.grandparent.getParent()));
						m && CKEDITOR.dom.element.setMarker(m, h, "listarray_index", e.length);
						e.push(d);
						for (var a = 0, p = h.getChildCount(), l; a < p; a++) l = h.getChild(a), l.type == CKEDITOR.NODE_ELEMENT && v[l.getName()] ? CKEDITOR.plugins.list.listToArray(l, m, e, c + 1, d.grandparent) : d.contents.push(l)
					}
				}
				return e
			},
			arrayToList: function(b, m, e, c, f) {
				e || (e = 0);
				if (!b || b.length < e + 1) return null;
				for (var g, k = b[e].parent.getDocument(), h = new CKEDITOR.dom.documentFragment(k), d = null, a = e, p = Math.max(b[e].indent, 0), l = null, q, n, t = c == CKEDITOR.ENTER_P ? "p" : "div";;) {
					var r = b[a];
					g = r.grandparent;
					q = r.element.getDirection(1);
					if (r.indent == p) {
						d && b[a].parent.getName() == d.getName() || (d = b[a].parent.clone(!1, 1), f && d.setAttribute("dir", f), h.append(d));
						l = d.append(r.element.clone(0, 1));
						q != d.getDirection(1) && l.setAttribute("dir", q);
						for (g = 0; g < r.contents.length; g++) l.append(r.contents[g].clone(1, 1));
						a++
					} else if (r.indent == Math.max(p, 0) + 1) r = b[a - 1].element.getDirection(1), a = CKEDITOR.plugins.list.arrayToList(b, null, a, c, r != q ? q : null), !l.getChildCount() && CKEDITOR.env.needsNbspFiller && 7 >= k.$.documentMode && l.append(k.createText(" ")), l.append(a.listNode), a = a.nextIndex;
					else if (-1 == r.indent && !e && g) {
						v[g.getName()] ? (l = r.element.clone(!1, !0), q != g.getDirection(1) && l.setAttribute("dir", q)) : l = new CKEDITOR.dom.documentFragment(k);
						var d = g.getDirection(1) != q,
							y = r.element,
							D = y.getAttribute("class"),
							z = y.getAttribute("style"),
							A = l.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (c != CKEDITOR.ENTER_BR || d || z || D),
							w, B = r.contents.length,
							x;
						for (g = 0; g < B; g++) if (w = r.contents[g], H(w) && 1 < B) A ? x = w.clone(1, 1) : l.append(w.clone(1, 1));
						else if (w.type == CKEDITOR.NODE_ELEMENT && w.isBlockBoundary()) {
							d && !w.getDirection() && w.setAttribute("dir", q);
							n = w;
							var C = y.getAttribute("style");
							C && n.setAttribute("style", C.replace(/([^;])$/, "$1;") + (n.getAttribute("style") || ""));
							D && w.addClass(D);
							n = null;
							x && (l.append(x), x = null);
							l.append(w.clone(1, 1))
						} else A ? (n || (n = k.createElement(t), l.append(n), d && n.setAttribute("dir", q)), z && n.setAttribute("style", z), D && n.setAttribute("class", D), x && (n.append(x), x = null), n.append(w.clone(1, 1))) : l.append(w.clone(1, 1));
						x && ((n || l).append(x), x = null);
						l.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && a != b.length - 1 && (CKEDITOR.env.needsBrFiller && (q = l.getLast()) && q.type == CKEDITOR.NODE_ELEMENT && q.is("br") && q.remove(), (q = l.getLast(u)) && q.type == CKEDITOR.NODE_ELEMENT && q.is(CKEDITOR.dtd.$block) || l.append(k.createElement("br")));
						q = l.$.nodeName.toLowerCase();
						"div" != q && "p" != q || l.appendBogus();
						h.append(l);
						d = null;
						a++
					} else return null;
					n = null;
					if (b.length <= a || Math.max(b[a].indent, 0) < p) break
				}
				if (m) for (b = h.getFirst(); b;) {
					if (b.type == CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(m, b), b.getName() in CKEDITOR.dtd.$listItem && (e = b, k = f = c = void 0, c = e.getDirection()))) {
						for (f = e.getParent(); f && !(k = f.getDirection());) f = f.getParent();
						c == k && e.removeAttribute("dir")
					}
					b = b.getNextSourceNode()
				}
				return {
					listNode: h,
					nextIndex: a
				}
			}
		};
		var L = /^h[1-6]$/,
			J = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
		B.prototype = {
			exec: function(b) {
				this.refresh(b, b.elementPath());
				var m = b.config,
					e = b.getSelection(),
					c = e && e.getRanges();
				if (this.state == CKEDITOR.TRISTATE_OFF) {
					var f = b.editable();
					if (f.getFirst(u)) {
						var g = 1 == c.length && c[0];
						(m = g && g.getEnclosedNode()) && m.is && this.type == m.getName() && this.setState(CKEDITOR.TRISTATE_ON)
					} else m.enterMode == CKEDITOR.ENTER_BR ? f.appendBogus() : c[0].fixBlock(1, m.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), e.selectRanges(c)
				}
				for (var m = e.createBookmarks(!0), f = [], k = {}, c = c.createIterator(), h = 0;
				(g = c.getNextRange()) && ++h;) {
					var d = g.getBoundaryNodes(),
						a = d.startNode,
						p = d.endNode;
					a.type == CKEDITOR.NODE_ELEMENT && "td" == a.getName() && g.setStartAt(d.startNode, CKEDITOR.POSITION_AFTER_START);
					p.type == CKEDITOR.NODE_ELEMENT && "td" == p.getName() && g.setEndAt(d.endNode, CKEDITOR.POSITION_BEFORE_END);
					g = g.createIterator();
					for (g.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; d = g.getNextParagraph();) if (!d.getCustomData("list_block")) {
						CKEDITOR.dom.element.setMarker(k, d, "list_block", 1);
						for (var l = b.elementPath(d), a = l.elements, p = 0, l = l.blockLimit, q, n = a.length - 1; 0 <= n && (q = a[n]); n--) if (v[q.getName()] && l.contains(q)) {
							l.removeCustomData("list_group_object_" + h);
							(a = q.getCustomData("list_group_object")) ? a.contents.push(d) : (a = {
								root: q,
								contents: [d]
							}, f.push(a), CKEDITOR.dom.element.setMarker(k, q, "list_group_object", a));
							p = 1;
							break
						}
						p || (p = l, p.getCustomData("list_group_object_" + h) ? p.getCustomData("list_group_object_" + h).contents.push(d) : (a = {
							root: p,
							contents: [d]
						}, CKEDITOR.dom.element.setMarker(k, p, "list_group_object_" + h, a), f.push(a)))
					}
				}
				for (q = []; 0 < f.length;) if (a = f.shift(), this.state == CKEDITOR.TRISTATE_OFF) if (v[a.root.getName()]) {
					c = b;
					h = a;
					a = k;
					g = q;
					p = CKEDITOR.plugins.list.listToArray(h.root, a);
					l = [];
					for (d = 0; d < h.contents.length; d++) n = h.contents[d], (n = n.getAscendant("li", !0)) && !n.getCustomData("list_item_processed") && (l.push(n), CKEDITOR.dom.element.setMarker(a, n, "list_item_processed", !0));
					for (var n = h.root.getDocument(), t = void 0, r = void 0, d = 0; d < l.length; d++) {
						var y = l[d].getCustomData("listarray_index"),
							t = p[y].parent;
						t.is(this.type) || (r = n.createElement(this.type), t.copyAttributes(r, {
							start: 1,
							type: 1
						}), r.removeStyle("list-style-type"), p[y].parent = r)
					}
					a = CKEDITOR.plugins.list.arrayToList(p, a, null, c.config.enterMode);
					p = void 0;
					l = a.listNode.getChildCount();
					for (d = 0; d < l && (p = a.listNode.getChild(d)); d++) p.getName() == this.type && g.push(p);
					a.listNode.replace(h.root);
					c.fire("contentDomInvalidated")
				} else {
					p = b;
					g = a;
					d = q;
					l = g.contents;
					c = g.root.getDocument();
					h = [];
					1 == l.length && l[0].equals(g.root) && (a = c.createElement("div"), l[0].moveChildren && l[0].moveChildren(a), l[0].append(a), l[0] = a);
					g = g.contents[0].getParent();
					for (n = 0; n < l.length; n++) g = g.getCommonAncestor(l[n].getParent());
					t = p.config.useComputedState;
					p = a = void 0;
					t = void 0 === t || t;
					for (n = 0; n < l.length; n++) for (r = l[n]; y = r.getParent();) {
						if (y.equals(g)) {
							h.push(r);
							!p && r.getDirection() && (p = 1);
							r = r.getDirection(t);
							null !== a && (a = a && a != r ? null : r);
							break
						}
						r = y
					}
					if (!(1 > h.length)) {
						l = h[h.length - 1].getNext();
						n = c.createElement(this.type);
						d.push(n);
						for (t = d = void 0; h.length;) d = h.shift(), t = c.createElement("li"), r = d, r.is("pre") || L.test(r.getName()) || "false" == r.getAttribute("contenteditable") ? d.appendTo(t) : (d.copyAttributes(t), a && d.getDirection() && (t.removeStyle("direction"), t.removeAttribute("dir")), d.moveChildren(t), d.remove()), t.appendTo(n);
						a && p && n.setAttribute("dir", a);
						l ? n.insertBefore(l) : n.appendTo(g)
					}
				} else this.state == CKEDITOR.TRISTATE_ON && v[a.root.getName()] && I.call(this, b, a, k);
				for (n = 0; n < q.length; n++) F(q[n]);
				CKEDITOR.dom.element.clearAllMarkers(k);
				e.selectBookmarks(m);
				b.focus()
			},
			refresh: function(b, m) {
				var e = m.contains(v, 1),
					c = m.blockLimit || m.root;
				e && c.contains(e) ? this.setState(e.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
			}
		};
		CKEDITOR.plugins.add("list", {
			requires: "indentlist",
			init: function(b) {
				b.blockless || (b.addCommand("numberedlist", new B("numberedlist", "ol")), b.addCommand("bulletedlist", new B("bulletedlist", "ul")), b.ui.addButton && (b.ui.addButton("NumberedList", {
					label: b.lang.list.numberedlist,
					command: "numberedlist",
					directional: !0,
					toolbar: "list,10"
				}), b.ui.addButton("BulletedList", {
					label: b.lang.list.bulletedlist,
					command: "bulletedlist",
					directional: !0,
					toolbar: "list,20"
				})), b.on("key", function(m) {
					var e = m.data.domEvent.getKey(),
						c;
					if ("wysiwyg" == b.mode && e in {
						8: 1,
						46: 1
					}) {
						var f = b.getSelection().getRanges()[0],
							g = f && f.startPath();
						if (f && f.collapsed) {
							var k = 8 == e,
								h = b.editable(),
								d = new CKEDITOR.dom.walker(f.clone());
							d.evaluator = function(a) {
								return u(a) && !z(a)
							};
							d.guard = function(a, b) {
								return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
							};
							e = f.clone();
							if (k) {
								var a;
								(a = g.contains(v)) && f.checkBoundaryOfElement(a, CKEDITOR.START) && (a = a.getParent()) && a.is("li") && (a = A(a)) ? (c = a, a = a.getPrevious(u), e.moveToPosition(a && z(a) ? a : c, CKEDITOR.POSITION_BEFORE_START)) : (d.range.setStartAt(h, CKEDITOR.POSITION_AFTER_START), d.range.setEnd(f.startContainer, f.startOffset), (a = d.previous()) && a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in v || a.is("li")) && (a.is("li") || (d.range.selectNodeContents(a), d.reset(), d.evaluator = G, a = d.previous()), c = a, e.moveToElementEditEnd(c), e.moveToPosition(e.endPath().block, CKEDITOR.POSITION_BEFORE_END)));
								if (c) C(b, e, f), m.cancel();
								else {
									var p = g.contains(v);
									p && f.checkBoundaryOfElement(p, CKEDITOR.START) && (c = p.getFirst(u), f.checkBoundaryOfElement(c, CKEDITOR.START) && (a = p.getPrevious(u), A(c) ? a && (f.moveToElementEditEnd(a), f.select()) : b.execCommand("outdent"), m.cancel()))
								}
							} else if (c = g.contains("li")) {
								if (d.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END), k = (h = c.getLast(u)) && G(h) ? h : c, g = 0, (a = d.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in v && a.equals(h) ? (g = 1, a = d.next()) : f.checkBoundaryOfElement(k, CKEDITOR.END) && (g = 2), g && a) {
									f = f.clone();
									f.moveToElementEditStart(a);
									if (1 == g && (e.optimize(), !e.startContainer.equals(c))) {
										for (c = e.startContainer; c.is(CKEDITOR.dtd.$inline);) p = c, c = c.getParent();
										p && e.moveToPosition(p, CKEDITOR.POSITION_AFTER_END)
									}
									2 == g && (e.moveToPosition(e.endPath().block, CKEDITOR.POSITION_BEFORE_END), f.endPath().block && f.moveToPosition(f.endPath().block, CKEDITOR.POSITION_AFTER_START));
									C(b, e, f);
									m.cancel()
								}
							} else d.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END), (a = d.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.is(v) && (a = a.getFirst(u), g.block && f.checkStartOfBlock() && f.checkEndOfBlock() ? (g.block.remove(), f.moveToElementEditStart(a), f.select()) : A(a) ? (f.moveToElementEditStart(a), f.select()) : (f = f.clone(), f.moveToElementEditStart(a), C(b, e, f)), m.cancel());
							setTimeout(function() {
								b.selectionChange(1)
							})
						}
					}
				}))
			}
		})
	})();
	(function() {
		CKEDITOR.plugins.liststyle = {
			requires: "dialog,contextmenu",
			init: function(a) {
				if (!a.blockless) {
					var b;
					b = new CKEDITOR.dialogCommand("numberedListStyle", {
						requiredContent: "ol",
						allowedContent: "ol{list-style-type}[start]"
					});
					b = a.addCommand("numberedListStyle", b);
					a.addFeature(b);
					CKEDITOR.dialog.add("numberedListStyle", this.path + "dialogs/liststyle.js");
					b = new CKEDITOR.dialogCommand("bulletedListStyle", {
						requiredContent: "ul",
						allowedContent: "ul{list-style-type}"
					});
					b = a.addCommand("bulletedListStyle", b);
					a.addFeature(b);
					CKEDITOR.dialog.add("bulletedListStyle", this.path + "dialogs/liststyle.js");
					a.addMenuGroup("list", 108);
					a.addMenuItems({
						numberedlist: {
							label: a.lang.liststyle.numberedTitle,
							group: "list",
							command: "numberedListStyle"
						},
						bulletedlist: {
							label: a.lang.liststyle.bulletedTitle,
							group: "list",
							command: "bulletedListStyle"
						}
					});
					a.contextMenu.addListener(function(a) {
						if (!a || a.isReadOnly()) return null;
						for (; a;) {
							var b = a.getName();
							if ("ol" == b) return {
								numberedlist: CKEDITOR.TRISTATE_OFF
							};
							if ("ul" == b) return {
								bulletedlist: CKEDITOR.TRISTATE_OFF
							};
							a = a.getParent()
						}
						return null
					})
				}
			}
		};
		CKEDITOR.plugins.add("liststyle", CKEDITOR.plugins.liststyle)
	})();
	(function() {
		function V(a, c, d) {
			return n(c) && n(d) && d.equals(c.getNext(function(a) {
				return !(E(a) || F(a) || u(a))
			}))
		}

		function z(a) {
			this.upper = a[0];
			this.lower = a[1];
			this.set.apply(this, a.slice(2))
		}

		function O(a) {
			var c = a.element;
			if (c && n(c) && (c = c.getAscendant(a.triggers, !0)) && a.editable.contains(c)) {
				var d = P(c);
				if ("true" == d.getAttribute("contenteditable")) return c;
				if (d.is(a.triggers)) return d
			}
			return null
		}

		function ka(a, c, d) {
			r(a, c);
			r(a, d);
			a = c.size.bottom;
			d = d.size.top;
			return a && d ? 0 | (a + d) / 2 : a || d
		}

		function w(a, c, d) {
			return c = c[d ? "getPrevious" : "getNext"](function(b) {
				return b && b.type == CKEDITOR.NODE_TEXT && !E(b) || n(b) && !u(b) && !A(a, b)
			})
		}

		function q(a, c, d) {
			return a > c && a < d
		}

		function P(a, c) {
			if (a.data("cke-editable")) return null;
			for (c || (a = a.getParent()); a && !a.data("cke-editable");) {
				if (a.hasAttribute("contenteditable")) return a;
				a = a.getParent()
			}
			return null
		}

		function la(a) {
			var c = a.doc,
				d = G('<span contenteditable="false" style="' + Q + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', c),
				b = CKEDITOR.getUrl(this.path + "images/" + (t.hidpi ? "hidpi/" : "") + "icon" + (a.rtl ? "-rtl" : "") + ".png");
			v(d, {
				attach: function() {
					this.wrap.getParent() || this.wrap.appendTo(a.editable, !0);
					return this
				},
				lineChildren: [v(G('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', c), {
					base: Q + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + b + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (t.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (t.hidpi ? "background-size: 9px 10px;" : ""),
					looks: ["top:-8px; border-radius: 2px;", "top:-17px; border-radius: 2px 2px 0px 0px;", "top:-1px; border-radius: 0px 0px 2px 2px;"]
				}), v(G(W, c), {
					base: X + "left:0px;border-left-color:" + a.boxColor + ";",
					looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]
				}), v(G(W, c), {
					base: X + "right:0px;border-right-color:" + a.boxColor + ";",
					looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]
				})],
				detach: function() {
					this.wrap.getParent() && this.wrap.remove();
					return this
				},
				mouseNear: function() {
					r(a, this);
					var b = a.holdDistance,
						c = this.size;
					return c && q(a.mouse.y, c.top - b, c.bottom + b) && q(a.mouse.x, c.left - b, c.right + b) ? !0 : !1
				},
				place: function() {
					var b = a.view,
						c = a.editable,
						d = a.trigger,
						h = d.upper,
						g = d.lower,
						l = h || g,
						p = l.getParent(),
						m = {};
					this.trigger = d;
					h && r(a, h, !0);
					g && r(a, g, !0);
					r(a, p, !0);
					a.inInlineMode && H(a, !0);
					p.equals(c) ? (m.left = b.scroll.x, m.right = -b.scroll.x, m.width = "") : (m.left = l.size.left - l.size.margin.left + b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0), m.width = l.size.outerWidth + l.size.margin.left + l.size.margin.right + b.scroll.x, m.right = "");
					h && g ? m.top = h.size.margin.bottom === g.size.margin.top ? 0 | h.size.bottom + h.size.margin.bottom / 2 : h.size.margin.bottom < g.size.margin.top ? h.size.bottom + h.size.margin.bottom : h.size.bottom + h.size.margin.bottom - g.size.margin.top : h ? g || (m.top = h.size.bottom + h.size.margin.bottom) : m.top = g.size.top - g.size.margin.top;
					d.is(C) || q(m.top, b.scroll.y - 15, b.scroll.y + 5) ? (m.top = a.inInlineMode ? 0 : b.scroll.y, this.look(C)) : d.is(D) || q(m.top, b.pane.bottom - 5, b.pane.bottom + 15) ? (m.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1, this.look(D)) : (a.inInlineMode && (m.top -= b.editable.top + b.editable.border.top), this.look(x));
					a.inInlineMode && (m.top--, m.top += b.editable.scroll.top, m.left += b.editable.scroll.left);
					for (var n in m) m[n] = CKEDITOR.tools.cssLength(m[n]);
					this.setStyles(m)
				},
				look: function(a) {
					if (this.oldLook != a) {
						for (var b = this.lineChildren.length, c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
						this.oldLook = a
					}
				},
				wrap: new R("span", a.doc)
			});
			for (c = d.lineChildren.length; c--;) d.lineChildren[c].appendTo(d);
			d.look(x);
			d.appendTo(d.wrap);
			d.unselectable();
			d.lineChildren[0].on("mouseup", function(b) {
				d.detach();
				S(a, function(b) {
					var c = a.line.trigger;
					b[c.is(I) ? "insertBefore" : "insertAfter"](c.is(I) ? c.lower : c.upper)
				}, !0);
				a.editor.focus();
				t.ie || a.enterMode == CKEDITOR.ENTER_BR || a.hotNode.scrollIntoView();
				b.data.preventDefault(!0)
			});
			d.on("mousedown", function(a) {
				a.data.preventDefault(!0)
			});
			a.line = d
		}

		function S(a, c, d) {
			var b = new CKEDITOR.dom.range(a.doc),
				e = a.editor,
				f;
			t.ie && a.enterMode == CKEDITOR.ENTER_BR ? f = a.doc.createText(J) : (f = (f = P(a.element, !0)) && f.data("cke-enter-mode") || a.enterMode, f = new R(K[f], a.doc), f.is("br") || a.doc.createText(J).appendTo(f));
			d && e.fire("saveSnapshot");
			c(f);
			b.moveToPosition(f, CKEDITOR.POSITION_AFTER_START);
			e.getSelection().selectRanges([b]);
			a.hotNode = f;
			d && e.fire("saveSnapshot")
		}

		function Y(a, c) {
			return {
				canUndo: !0,
				modes: {
					wysiwyg: 1
				},
				exec: function() {
					function d(b) {
						var d = t.ie && 9 > t.version ? " " : J,
							f = a.hotNode && a.hotNode.getText() == d && a.element.equals(a.hotNode) && a.lastCmdDirection === !! c;
						S(a, function(d) {
							f && a.hotNode && a.hotNode.remove();
							d[c ? "insertAfter" : "insertBefore"](b);
							d.setAttributes({
								"data-cke-magicline-hot": 1,
								"data-cke-magicline-dir": !! c
							});
							a.lastCmdDirection = !! c
						});
						t.ie || a.enterMode == CKEDITOR.ENTER_BR || a.hotNode.scrollIntoView();
						a.line.detach()
					}
					return function(b) {
						b = b.getSelection().getStartElement();
						var e;
						b = b.getAscendant(Z, 1);
						if (!aa(a, b) && b && !b.equals(a.editable) && !b.contains(a.editable)) {
							(e = P(b)) && "false" == e.getAttribute("contenteditable") && (b = e);
							a.element = b;
							e = w(a, b, !c);
							var f;
							n(e) && e.is(a.triggers) && e.is(ma) && (!w(a, e, !c) || (f = w(a, e, !c)) && n(f) && f.is(a.triggers)) ? d(e) : (f = O(a, b), n(f) && (w(a, f, !c) ? (b = w(a, f, !c)) && n(b) && b.is(a.triggers) && d(f) : d(f)))
						}
					}
				}()
			}
		}

		function A(a, c) {
			if (!c || c.type != CKEDITOR.NODE_ELEMENT || !c.$) return !1;
			var d = a.line;
			return d.wrap.equals(c) || d.wrap.contains(c)
		}

		function n(a) {
			return a && a.type == CKEDITOR.NODE_ELEMENT && a.$
		}

		function u(a) {
			if (!n(a)) return !1;
			var c;
			(c = ba(a)) || (n(a) ? (c = {
				left: 1,
				right: 1,
				center: 1
			}, c = !(!c[a.getComputedStyle("float")] && !c[a.getAttribute("align")])) : c = !1);
			return c
		}

		function ba(a) {
			return !!{
				absolute: 1,
				fixed: 1
			}[a.getComputedStyle("position")]
		}

		function L(a, c) {
			return n(c) ? c.is(a.triggers) : null
		}

		function aa(a, c) {
			if (!c) return !1;
			for (var d = c.getParents(1), b = d.length; b--;) for (var e = a.tabuList.length; e--;) if (d[b].hasAttribute(a.tabuList[e])) return !0;
			return !1
		}

		function na(a, c, d) {
			c = c[d ? "getLast" : "getFirst"](function(b) {
				return a.isRelevant(b) && !b.is(oa)
			});
			if (!c) return !1;
			r(a, c);
			return d ? c.size.top > a.mouse.y : c.size.bottom < a.mouse.y
		}

		function ca(a) {
			var c = a.editable,
				d = a.mouse,
				b = a.view,
				e = a.triggerOffset;
			H(a);
			var f = d.y > (a.inInlineMode ? b.editable.top + b.editable.height / 2 : Math.min(b.editable.height, b.pane.height) / 2),
				c = c[f ? "getLast" : "getFirst"](function(a) {
					return !(E(a) || F(a))
				});
			if (!c) return null;
			A(a, c) && (c = a.line.wrap[f ? "getPrevious" : "getNext"](function(a) {
				return !(E(a) || F(a))
			}));
			if (!n(c) || u(c) || !L(a, c)) return null;
			r(a, c);
			return !f && 0 <= c.size.top && q(d.y, 0, c.size.top + e) ? (a = a.inInlineMode || 0 === b.scroll.y ? C : x, new z([null, c, I, M, a])) : f && c.size.bottom <= b.pane.height && q(d.y, c.size.bottom - e, b.pane.height) ? (a = a.inInlineMode || q(c.size.bottom, b.pane.height - e, b.pane.height) ? D : x, new z([c, null, da, M, a])) : null
		}

		function ea(a) {
			var c = a.mouse,
				d = a.view,
				b = a.triggerOffset,
				e = O(a);
			if (!e) return null;
			r(a, e);
			var b = Math.min(b, 0 | e.size.outerHeight / 2),
				f = [],
				k, h;
			if (q(c.y, e.size.top - 1, e.size.top + b)) h = !1;
			else if (q(c.y, e.size.bottom - b, e.size.bottom + 1)) h = !0;
			else return null;
			if (u(e) || na(a, e, h) || e.getParent().is(fa)) return null;
			var g = w(a, e, !h);
			if (g) {
				if (g && g.type == CKEDITOR.NODE_TEXT) return null;
				if (n(g)) {
					if (u(g) || !L(a, g) || g.getParent().is(fa)) return null;
					f = [g, e][h ? "reverse" : "concat"]().concat([T, M])
				}
			} else e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? (H(a), h && q(c.y, e.size.bottom - b, d.pane.height) && q(e.size.bottom, d.pane.height - b, d.pane.height) ? k = D : q(c.y, 0, e.size.top + b) && (k = C)) : k = x, f = [null, e][h ? "reverse" : "concat"]().concat([h ? da : I, M, k, e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? h ? D : C : x]);
			return 0 in f ? new z(f) : null
		}

		function U(a, c, d, b) {
			for (var e = c.getDocumentPosition(), f = {}, k = {}, h = {}, g = {}, l = y.length; l--;) f[y[l]] = parseInt(c.getComputedStyle.call(c, "border-" + y[l] + "-width"), 10) || 0, h[y[l]] = parseInt(c.getComputedStyle.call(c, "padding-" + y[l]), 10) || 0, k[y[l]] = parseInt(c.getComputedStyle.call(c, "margin-" + y[l]), 10) || 0;
			d && !b || N(a, b);
			g.top = e.y - (d ? 0 : a.view.scroll.y);
			g.left = e.x - (d ? 0 : a.view.scroll.x);
			g.outerWidth = c.$.offsetWidth;
			g.outerHeight = c.$.offsetHeight;
			g.height = g.outerHeight - (h.top + h.bottom + f.top + f.bottom);
			g.width = g.outerWidth - (h.left + h.right + f.left + f.right);
			g.bottom = g.top + g.outerHeight;
			g.right = g.left + g.outerWidth;
			a.inInlineMode && (g.scroll = {
				top: c.$.scrollTop,
				left: c.$.scrollLeft
			});
			return v({
				border: f,
				padding: h,
				margin: k,
				ignoreScroll: d
			}, g, !0)
		}

		function r(a, c, d) {
			if (!n(c)) return c.size = null;
			if (!c.size) c.size = {};
			else if (c.size.ignoreScroll == d && c.size.date > new Date - ga) return null;
			return v(c.size, U(a, c, d), {
				date: +new Date
			}, !0)
		}

		function H(a, c) {
			a.view.editable = U(a, a.editable, c, !0)
		}

		function N(a, c) {
			a.view || (a.view = {});
			var d = a.view;
			if (!(!c && d && d.date > new Date - ga)) {
				var b = a.win,
					d = b.getScrollPosition(),
					b = b.getViewPaneSize();
				v(a.view, {
					scroll: {
						x: d.x,
						y: d.y,
						width: a.doc.$.documentElement.scrollWidth - b.width,
						height: a.doc.$.documentElement.scrollHeight - b.height
					},
					pane: {
						width: b.width,
						height: b.height,
						bottom: b.height + d.y
					},
					date: +new Date
				}, !0)
			}
		}

		function pa(a, c, d, b) {
			for (var e = b, f = b, k = 0, h = !1, g = !1, l = a.view.pane.height, p = a.mouse; p.y + k < l && 0 < p.y - k;) {
				h || (h = c(e, b));
				g || (g = c(f, b));
				!h && 0 < p.y - k && (e = d(a, {
					x: p.x,
					y: p.y - k
				}));
				!g && p.y + k < l && (f = d(a, {
					x: p.x,
					y: p.y + k
				}));
				if (h && g) break;
				k += 2
			}
			return new z([e, f, null, null])
		}
		CKEDITOR.plugins.add("magicline", {
			init: function(a) {
				var c = a.config,
					d = c.magicline_triggerOffset || 30,
					b = {
						editor: a,
						enterMode: c.enterMode,
						triggerOffset: d,
						holdDistance: 0 | d * (c.magicline_holdDistance || .5),
						boxColor: c.magicline_color || "#ff0000",
						rtl: "rtl" == c.contentsLangDirection,
						tabuList: ["data-cke-hidden-sel"].concat(c.magicline_tabuList || []),
						triggers: c.magicline_everywhere ? Z : {
							table: 1,
							hr: 1,
							div: 1,
							ul: 1,
							ol: 1,
							dl: 1,
							form: 1,
							blockquote: 1
						}
					},
					e, f, k;
				b.isRelevant = function(a) {
					return n(a) && !A(b, a) && !u(a)
				};
				a.on("contentDom", function() {
					var d = a.editable(),
						g = a.document,
						l = a.window;
					v(b, {
						editable: d,
						inInlineMode: d.isInline(),
						doc: g,
						win: l,
						hotNode: null
					}, !0);
					b.boundary = b.inInlineMode ? b.editable : b.doc.getDocumentElement();
					d.is(B.$inline) || (b.inInlineMode && !ba(d) && d.setStyles({
						position: "relative",
						top: null,
						left: null
					}), la.call(this, b), N(b), d.attachListener(a, "beforeUndoImage", function() {
						b.line.detach()
					}), d.attachListener(a, "beforeGetData", function() {
						b.line.wrap.getParent() && (b.line.detach(), a.once("getData", function() {
							b.line.attach()
						}, null, null, 1E3))
					}, null, null, 0), d.attachListener(b.inInlineMode ? g : g.getWindow().getFrame(), "mouseout", function(c) {
						if ("wysiwyg" == a.mode) if (b.inInlineMode) {
							var d = c.data.$.clientX;
							c = c.data.$.clientY;
							N(b);
							H(b, !0);
							var e = b.view.editable,
								f = b.view.scroll;
							d > e.left - f.x && d < e.right - f.x && c > e.top - f.y && c < e.bottom - f.y || (clearTimeout(k), k = null, b.line.detach())
						} else clearTimeout(k), k = null, b.line.detach()
					}), d.attachListener(d, "keyup", function() {
						b.hiddenMode = 0
					}), d.attachListener(d, "keydown", function(c) {
						if ("wysiwyg" == a.mode) switch (c.data.getKeystroke()) {
						case 2228240:
						case 16:
							b.hiddenMode = 1, b.line.detach()
						}
					}), d.attachListener(b.inInlineMode ? d : g, "mousemove", function(c) {
						f = !0;
						if ("wysiwyg" == a.mode && !a.readOnly && !k) {
							var d = {
								x: c.data.$.clientX,
								y: c.data.$.clientY
							};
							k = setTimeout(function() {
								b.mouse = d;
								k = b.trigger = null;
								N(b);
								f && !b.hiddenMode && a.focusManager.hasFocus && !b.line.mouseNear() && (b.element = ha(b, !0)) && ((b.trigger = ca(b) || ea(b) || ia(b)) && !aa(b, b.trigger.upper || b.trigger.lower) ? b.line.attach().place() : (b.trigger = null, b.line.detach()), f = !1)
							}, 30)
						}
					}), d.attachListener(l, "scroll", function() {
						"wysiwyg" == a.mode && (b.line.detach(), t.webkit && (b.hiddenMode = 1, clearTimeout(e), e = setTimeout(function() {
							b.mouseDown || (b.hiddenMode = 0)
						}, 50)))
					}), d.attachListener(ja ? g : l, "mousedown", function() {
						"wysiwyg" == a.mode && (b.line.detach(), b.hiddenMode = 1, b.mouseDown = 1)
					}), d.attachListener(ja ? g : l, "mouseup", function() {
						b.hiddenMode = 0;
						b.mouseDown = 0
					}), a.addCommand("accessPreviousSpace", Y(b)), a.addCommand("accessNextSpace", Y(b, !0)), a.setKeystroke([
						[c.magicline_keystrokePrevious, "accessPreviousSpace"],
						[c.magicline_keystrokeNext, "accessNextSpace"]
					]), a.on("loadSnapshot", function() {
						var c, d, e, f;
						for (f in {
							p: 1,
							br: 1,
							div: 1
						}) for (c = a.document.getElementsByTag(f), e = c.count(); e--;) if ((d = c.getItem(e)).data("cke-magicline-hot")) {
							b.hotNode = d;
							b.lastCmdDirection = "true" === d.data("cke-magicline-dir") ? !0 : !1;
							return
						}
					}), this.backdoor = {
						accessFocusSpace: S,
						boxTrigger: z,
						isLine: A,
						getAscendantTrigger: O,
						getNonEmptyNeighbour: w,
						getSize: U,
						that: b,
						triggerEdge: ea,
						triggerEditable: ca,
						triggerExpand: ia
					})
				}, this)
			}
		});
		var v = CKEDITOR.tools.extend,
			R = CKEDITOR.dom.element,
			G = R.createFromHtml,
			t = CKEDITOR.env,
			ja = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
			B = CKEDITOR.dtd,
			K = {},
			I = 128,
			da = 64,
			T = 32,
			M = 16,
			C = 4,
			D = 2,
			x = 1,
			J = " ",
			fa = B.$listItem,
			oa = B.$tableContent,
			ma = v({}, B.$nonEditable, B.$empty),
			Z = B.$block,
			ga = 100,
			Q = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
			X = Q + "border-color:transparent;display:block;border-style:solid;",
			W = "<span>" + J + "</span>";
		K[CKEDITOR.ENTER_BR] = "br";
		K[CKEDITOR.ENTER_P] = "p";
		K[CKEDITOR.ENTER_DIV] = "div";
		z.prototype = {
			set: function(a, c, d) {
				this.properties = a + c + (d || x);
				return this
			},
			is: function(a) {
				return (this.properties & a) == a
			}
		};
		var ha = function() {
				function a(a, d) {
					var b = a.$.elementFromPoint(d.x, d.y);
					return b && b.nodeType ? new CKEDITOR.dom.element(b) : null
				}
				return function(c, d, b) {
					if (!c.mouse) return null;
					var e = c.doc,
						f = c.line.wrap;
					b = b || c.mouse;
					var k = a(e, b);
					d && A(c, k) && (f.hide(), k = a(e, b), f.show());
					return !k || k.type != CKEDITOR.NODE_ELEMENT || !k.$ || t.ie && 9 > t.version && !c.boundary.equals(k) && !c.boundary.contains(k) ? null : k
				}
			}(),
			E = CKEDITOR.dom.walker.whitespaces(),
			F = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
			ia = function() {
				function a(a) {
					var b = a.element,
						e, f, k;
					if (!n(b) || b.contains(a.editable) || b.isReadOnly()) return null;
					k = pa(a, function(a, b) {
						return !b.equals(a)
					}, function(a, b) {
						return ha(a, !0, b)
					}, b);
					e = k.upper;
					f = k.lower;
					if (V(a, e, f)) return k.set(T, 8);
					if (e && b.contains(e)) for (; !e.getParent().equals(b);) e = e.getParent();
					else e = b.getFirst(function(b) {
						return c(a, b)
					});
					if (f && b.contains(f)) for (; !f.getParent().equals(b);) f = f.getParent();
					else f = b.getLast(function(b) {
						return c(a, b)
					});
					if (!e || !f) return null;
					r(a, e);
					r(a, f);
					if (!q(a.mouse.y, e.size.top, f.size.bottom)) return null;
					for (var b = Number.MAX_VALUE, h, g, l, p; f && !f.equals(e) && (g = e.getNext(a.isRelevant));) h = Math.abs(ka(a, e, g) - a.mouse.y), h < b && (b = h, l = e, p = g), e = g, r(a, e);
					if (!l || !p || !q(a.mouse.y, l.size.top, p.size.bottom)) return null;
					k.upper = l;
					k.lower = p;
					return k.set(T, 8)
				}

				function c(a, b) {
					return !(b && b.type == CKEDITOR.NODE_TEXT || F(b) || u(b) || A(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
				}
				return function(c) {
					var b = a(c),
						e;
					if (e = b) {
						e = b.upper;
						var f = b.lower;
						e = !e || !f || u(f) || u(e) || f.equals(e) || e.equals(f) || f.contains(e) || e.contains(f) ? !1 : L(c, e) && L(c, f) && V(c, e, f) ? !0 : !1
					}
					return e ? b : null
				}
			}(),
			y = ["top", "left", "right", "bottom"]
	})();
	CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51;
	CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52;
	(function() {
		function n(a) {
			if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) return [];
			for (var e = [], f = ["style", "className"], b = 0; b < f.length; b++) {
				var c = a.$.elements.namedItem(f[b]);
				c && (c = new CKEDITOR.dom.element(c), e.push([c, c.nextSibling]), c.remove())
			}
			return e
		}

		function t(a, e) {
			if (a && a.type == CKEDITOR.NODE_ELEMENT && "form" == a.getName() && 0 < e.length) for (var f = e.length - 1; 0 <= f; f--) {
				var b = e[f][0],
					c = e[f][1];
				c ? b.insertBefore(c) : b.appendTo(a)
			}
		}

		function r(a, e) {
			var f = n(a),
				b = {},
				c = a.$;
			e || (b["class"] = c.className || "", c.className = "");
			b.inline = c.style.cssText || "";
			e || (c.style.cssText = "position: static; overflow: visible");
			t(f);
			return b
		}

		function u(a, e) {
			var f = n(a),
				b = a.$;
			"class" in e && (b.className = e["class"]);
			"inline" in e && (b.style.cssText = e.inline);
			t(f)
		}

		function v(a) {
			if (!a.editable().isInline()) {
				var e = CKEDITOR.instances,
					f;
				for (f in e) {
					var b = e[f];
					"wysiwyg" != b.mode || b.readOnly || (b = b.document.getBody(), b.setAttribute("contentEditable", !1), b.setAttribute("contentEditable", !0))
				}
				a.editable().hasFocus && (a.toolbox.focus(), a.focus())
			}
		}
		CKEDITOR.plugins.add("maximize", {
			init: function(a) {
				function e() {
					var b = c.getViewPaneSize();
					a.resize(b.width, b.height, null, !0)
				}
				if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
					var f = a.lang,
						b = CKEDITOR.document,
						c = b.getWindow(),
						l, m, p, n = CKEDITOR.TRISTATE_OFF;
					a.addCommand("maximize", {
						modes: {
							wysiwyg: !CKEDITOR.env.iOS,
							source: !CKEDITOR.env.iOS
						},
						readOnly: 1,
						editorFocus: !1,
						exec: function() {
							var h = a.container.getFirst(function(a) {
								return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
							}),
								g = a.ui.space("contents");
							if ("wysiwyg" == a.mode) {
								var d = a.getSelection();
								l = d && d.getRanges();
								m = c.getScrollPosition()
							} else {
								var k = a.editable().$;
								l = !CKEDITOR.env.ie && [k.selectionStart, k.selectionEnd];
								m = [k.scrollLeft, k.scrollTop]
							}
							if (this.state == CKEDITOR.TRISTATE_OFF) {
								c.on("resize", e);
								p = c.getScrollPosition();
								for (d = a.container; d = d.getParent();) d.setCustomData("maximize_saved_styles", r(d)), d.setStyle("z-index", a.config.baseFloatZIndex - 5);
								g.setCustomData("maximize_saved_styles", r(g, !0));
								h.setCustomData("maximize_saved_styles", r(h, !0));
								g = {
									overflow: CKEDITOR.env.webkit ? "" : "hidden",
									width: 0,
									height: 0
								};
								b.getDocumentElement().setStyles(g);
								!CKEDITOR.env.gecko && b.getDocumentElement().setStyle("position", "fixed");
								CKEDITOR.env.gecko && CKEDITOR.env.quirks || b.getBody().setStyles(g);
								CKEDITOR.env.ie ? setTimeout(function() {
									c.$.scrollTo(0, 0)
								}, 0) : c.$.scrollTo(0, 0);
								h.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
								h.$.offsetLeft;
								h.setStyles({
									"z-index": a.config.baseFloatZIndex - 5,
									left: "0px",
									top: "0px"
								});
								h.addClass("cke_maximized");
								e();
								g = h.getDocumentPosition();
								h.setStyles({
									left: -1 * g.x + "px",
									top: -1 * g.y + "px"
								});
								CKEDITOR.env.gecko && v(a)
							} else if (this.state == CKEDITOR.TRISTATE_ON) {
								c.removeListener("resize", e);
								for (var d = [g, h], q = 0; q < d.length; q++) u(d[q], d[q].getCustomData("maximize_saved_styles")), d[q].removeCustomData("maximize_saved_styles");
								for (d = a.container; d = d.getParent();) u(d, d.getCustomData("maximize_saved_styles")), d.removeCustomData("maximize_saved_styles");
								CKEDITOR.env.ie ? setTimeout(function() {
									c.$.scrollTo(p.x, p.y)
								}, 0) : c.$.scrollTo(p.x, p.y);
								h.removeClass("cke_maximized");
								CKEDITOR.env.webkit && (h.setStyle("display", "inline"), setTimeout(function() {
									h.setStyle("display", "block")
								}, 0));
								a.fire("resize", {
									outerHeight: a.container.$.offsetHeight,
									contentsHeight: g.$.offsetHeight,
									outerWidth: a.container.$.offsetWidth
								})
							}
							this.toggleState();
							if (d = this.uiItems[0]) g = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize, d = CKEDITOR.document.getById(d._.id), d.getChild(1).setHtml(g), d.setAttribute("title", g), d.setAttribute("href", 'javascript:void("' + g + '");');
							"wysiwyg" == a.mode ? l ? (CKEDITOR.env.gecko && v(a), a.getSelection().selectRanges(l), (k = a.getSelection().getStartElement()) && k.scrollIntoView(!0)) : c.$.scrollTo(m.x, m.y) : (l && (k.selectionStart = l[0], k.selectionEnd = l[1]), k.scrollLeft = m[0], k.scrollTop = m[1]);
							l = m = null;
							n = this.state;
							a.fire("maximize", this.state)
						},
						canUndo: !1
					});
					a.ui.addButton && a.ui.addButton("Maximize", {
						label: f.maximize.maximize,
						command: "maximize",
						toolbar: "tools,10"
					});
					a.on("mode", function() {
						var b = a.getCommand("maximize");
						b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : n)
					}, null, null, 100)
				}
			}
		})
	})();
	CKEDITOR.plugins.add("newpage", {
		init: function(a) {
			a.addCommand("newpage", {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				exec: function(b) {
					var a = this;
					b.setData(b.config.newpage_html || "", function() {
						b.focus();
						setTimeout(function() {
							b.fire("afterCommandExec", {
								name: "newpage",
								command: a
							});
							b.selectionChange()
						}, 200)
					})
				},
				async: !0
			});
			a.ui.addButton && a.ui.addButton("NewPage", {
				label: a.lang.newpage.toolbar,
				command: "newpage",
				toolbar: "document,20"
			})
		}
	});
	(function() {
		function e(a) {
			return {
				"aria-label": a,
				"class": "cke_pagebreak",
				contenteditable: "false",
				"data-cke-display-name": "pagebreak",
				"data-cke-pagebreak": 1,
				style: "page-break-after: always",
				title: a
			}
		}
		CKEDITOR.plugins.add("pagebreak", {
			requires: "fakeobjects",
			onLoad: function() {
				var a = ("background:url(" + CKEDITOR.getUrl(this.path + "images/pagebreak.gif") + ") no-repeat center center;clear:both;width:100%;border-top:#999 1px dotted;border-bottom:#999 1px dotted;padding:0;height:7px;cursor:default;").replace(/;/g, " !important;");
				CKEDITOR.addCss("div.cke_pagebreak{" + a + "}")
			},
			init: function(a) {
				a.blockless || (a.addCommand("pagebreak", CKEDITOR.plugins.pagebreakCmd), a.ui.addButton && a.ui.addButton("PageBreak", {
					label: a.lang.pagebreak.toolbar,
					command: "pagebreak",
					toolbar: "insert,70"
				}), CKEDITOR.env.webkit && a.on("contentDom", function() {
					a.document.on("click", function(b) {
						b = b.data.getTarget();
						b.is("div") && b.hasClass("cke_pagebreak") && a.getSelection().selectElement(b)
					})
				}))
			},
			afterInit: function(a) {
				function b(f) {
					CKEDITOR.tools.extend(f.attributes, e(a.lang.pagebreak.alt), !0);
					f.children.length = 0
				}
				var c = a.dataProcessor,
					g = c && c.dataFilter,
					c = c && c.htmlFilter,
					h = /page-break-after\s*:\s*always/i,
					k = /display\s*:\s*none/i;
				c && c.addRules({
					attributes: {
						"class": function(a, b) {
							var c = a.replace("cke_pagebreak", "");
							if (c != a) {
								var d = CKEDITOR.htmlParser.fragment.fromHtml('<span style="display: none;">&nbsp;</span>').children[0];
								b.children.length = 0;
								b.add(d);
								d = b.attributes;
								delete d["aria-label"];
								delete d.contenteditable;
								delete d.title
							}
							return c
						}
					}
				}, {
					applyToAll: !0,
					priority: 5
				});
				g && g.addRules({
					elements: {
						div: function(a) {
							if (a.attributes["data-cke-pagebreak"]) b(a);
							else if (h.test(a.attributes.style)) {
								var c = a.children[0];
								c && "span" == c.name && k.test(c.attributes.style) && b(a)
							}
						}
					}
				})
			}
		});
		CKEDITOR.plugins.pagebreakCmd = {
			exec: function(a) {
				var b = a.document.createElement("div", {
					attributes: e(a.lang.pagebreak.alt)
				});
				a.insertElement(b)
			},
			context: "div",
			allowedContent: {
				div: {
					styles: "!page-break-after"
				},
				span: {
					match: function(a) {
						return (a = a.parent) && "div" == a.name && a.styles && a.styles["page-break-after"]
					},
					styles: "display"
				}
			},
			requiredContent: "div{page-break-after}"
		}
	})();
	(function() {
		var c = {
			canUndo: !1,
			async: !0,
			exec: function(a) {
				a.getClipboardData({
					title: a.lang.pastetext.title
				}, function(b) {
					b && a.fire("paste", {
						type: "text",
						dataValue: b.dataValue,
						method: "paste",
						dataTransfer: CKEDITOR.plugins.clipboard.initPasteDataTransfer()
					});
					a.fire("afterCommandExec", {
						name: "pastetext",
						command: c,
						returnValue: !! b
					})
				})
			}
		};
		CKEDITOR.plugins.add("pastetext", {
			requires: "clipboard",
			init: function(a) {
				a.addCommand("pastetext", c);
				a.ui.addButton && a.ui.addButton("PasteText", {
					label: a.lang.pastetext.button,
					command: "pastetext",
					toolbar: "clipboard,40"
				});
				if (a.config.forcePasteAsPlainText) a.on("beforePaste", function(a) {
					"html" != a.data.type && (a.data.type = "text")
				});
				a.on("pasteState", function(b) {
					a.getCommand("pastetext").setState(b.data)
				})
			}
		})
	})();
	(function() {
		function h(a, d, f) {
			var b = CKEDITOR.cleanWord;
			b ? f() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || d + "filter/default.js"), CKEDITOR.scriptLoader.load(a, f, null, !0));
			return !b
		}

		function k(a) {
			a.data.type = "html"
		}
		CKEDITOR.plugins.add("pastefromword", {
			requires: "clipboard",
			init: function(a) {
				var d = 0,
					f = this.path;
				a.addCommand("pastefromword", {
					canUndo: !1,
					async: !0,
					exec: function(a) {
						var e = this;
						d = 1;
						a.once("beforePaste", k);
						a.getClipboardData({
							title: a.lang.pastefromword.title
						}, function(c) {
							c && a.fire("paste", {
								type: "html",
								dataValue: c.dataValue,
								method: "paste",
								dataTransfer: CKEDITOR.plugins.clipboard.initPasteDataTransfer()
							});
							a.fire("afterCommandExec", {
								name: "pastefromword",
								command: e,
								returnValue: !! c
							})
						})
					}
				});
				a.ui.addButton && a.ui.addButton("PasteFromWord", {
					label: a.lang.pastefromword.toolbar,
					command: "pastefromword",
					toolbar: "clipboard,50"
				});
				a.on("pasteState", function(b) {
					a.getCommand("pastefromword").setState(b.data)
				});
				a.on("paste", function(b) {
					var e = b.data,
						c = e.dataValue;
					if (c && (d || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(c))) {
						e.dontFilter = !0;
						var g = h(a, f, function() {
							if (g) a.fire("paste", e);
							else if (!a.config.pasteFromWordPromptCleanup || d || confirm(a.lang.pastefromword.confirmCleanup)) e.dataValue = CKEDITOR.cleanWord(c, a);
							d = 0
						});
						g && b.cancel()
					}
				}, null, null, 3)
			}
		})
	})();
	(function() {
		var h, k = {
			modes: {
				wysiwyg: 1,
				source: 1
			},
			canUndo: !1,
			readOnly: 1,
			exec: function(a) {
				var g, b = a.config,
					f = b.baseHref ? '<base href="' + b.baseHref + '"/>' : "";
				if (b.fullPage) g = a.getData().replace(/<head>/, "$&" + f).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + a.lang.preview.preview);
				else {
					var b = "<body ",
						d = a.document && a.document.getBody();
					d && (d.getAttribute("id") && (b += 'id="' + d.getAttribute("id") + '" '), d.getAttribute("class") && (b += 'class="' + d.getAttribute("class") + '" '));
					b += ">";
					g = a.config.docType + '<html dir="' + a.config.contentsLangDirection + '"><head>' + f + "<title>" + a.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(a.config.contentsCss) + "</head>" + b + a.getData() + "</body></html>"
				}
				f = 640;
				b = 420;
				d = 80;
				try {
					var c = window.screen,
						f = Math.round(.8 * c.width),
						b = Math.round(.7 * c.height),
						d = Math.round(.1 * c.width)
				} catch (k) {}
				if (!1 === a.fire("contentPreview", a = {
					dataValue: g
				})) return !1;
				var c = "",
					e;
				CKEDITOR.env.ie && (window._cke_htmlToLoad = a.dataValue, e = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )", c = "");
				CKEDITOR.env.gecko && (window._cke_htmlToLoad = a.dataValue, c = CKEDITOR.getUrl(h + "preview.html"));
				c = window.open(c, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + f + ",height=" + b + ",left=" + d);
				CKEDITOR.env.ie && c && (c.location = e);
				CKEDITOR.env.ie || CKEDITOR.env.gecko || (e = c.document, e.open(), e.write(a.dataValue), e.close());
				return !0
			}
		};
		CKEDITOR.plugins.add("preview", {
			init: function(a) {
				a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && (h = this.path, a.addCommand("preview", k), a.ui.addButton && a.ui.addButton("Preview", {
					label: a.lang.preview.preview,
					command: "preview",
					toolbar: "document,40"
				}))
			}
		})
	})();
	CKEDITOR.plugins.add("print", {
		init: function(a) {
			a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && (a.addCommand("print", CKEDITOR.plugins.print), a.ui.addButton && a.ui.addButton("Print", {
				label: a.lang.print.toolbar,
				command: "print",
				toolbar: "document,50"
			}))
		}
	});
	CKEDITOR.plugins.print = {
		exec: function(a) {
			CKEDITOR.env.gecko ? a.window.$.print() : a.document.$.execCommand("Print")
		},
		canUndo: !1,
		readOnly: 1,
		modes: {
			wysiwyg: 1
		}
	};
	CKEDITOR.plugins.add("removeformat", {
		init: function(a) {
			a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
			a.ui.addButton && a.ui.addButton("RemoveFormat", {
				label: a.lang.removeformat.toolbar,
				command: "removeFormat",
				toolbar: "cleanup,10"
			})
		}
	});
	CKEDITOR.plugins.removeformat = {
		commands: {
			removeformat: {
				exec: function(a) {
					for (var h = a._.removeFormatRegex || (a._.removeFormatRegex = new RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), e = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), f = CKEDITOR.plugins.removeformat.filter, m = a.getSelection().getRanges(), n = m.createIterator(), p = function(a) {
							return a.type == CKEDITOR.NODE_ELEMENT
						}, c; c = n.getNextRange();) {
						c.collapsed || c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
						var l = c.createBookmark(),
							b = l.startNode,
							d = l.endNode,
							k = function(b) {
								for (var c = a.elementPath(b), e = c.elements, d = 1, g;
								(g = e[d]) && !g.equals(c.block) && !g.equals(c.blockLimit); d++) h.test(g.getName()) && f(a, g) && b.breakParent(g)
							};
						k(b);
						if (d) for (k(d), b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); b && !b.equals(d);) if (b.isReadOnly()) {
							if (b.getPosition(d) & CKEDITOR.POSITION_CONTAINS) break;
							b = b.getNext(p)
						} else k = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), "img" == b.getName() && b.data("cke-realelement") || !f(a, b) || (h.test(b.getName()) ? b.remove(1) : (b.removeAttributes(e), a.fire("removeFormatCleanup", b))), b = k;
						c.moveToBookmark(l)
					}
					a.forceNextSelectionCheck();
					a.getSelection().selectRanges(m)
				}
			}
		},
		filter: function(a, h) {
			for (var e = a._.removeFormatFilters || [], f = 0; f < e.length; f++) if (!1 === e[f](h)) return !1;
			return !0
		}
	};
	CKEDITOR.editor.prototype.addRemoveFormatFilter = function(a) {
		this._.removeFormatFilters || (this._.removeFormatFilters = []);
		this._.removeFormatFilters.push(a)
	};
	CKEDITOR.config.removeFormatTags = "b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var";
	CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign";
	(function() {
		var b = {
			readOnly: 1,
			exec: function(a) {
				if (a.fire("save") && (a = a.element.$.form)) try {
					a.submit()
				} catch (b) {
					a.submit.click && a.submit.click()
				}
			}
		};
		CKEDITOR.plugins.add("save", {
			init: function(a) {
				a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a.addCommand("save", b).modes = {
					wysiwyg: !! a.element.$.form
				}, a.ui.addButton && a.ui.addButton("Save", {
					label: a.lang.save.toolbar,
					command: "save",
					toolbar: "document,10"
				}))
			}
		})
	})();
	(function() {
		CKEDITOR.plugins.add("selectall", {
			init: function(b) {
				b.addCommand("selectAll", {
					modes: {
						wysiwyg: 1,
						source: 1
					},
					exec: function(a) {
						var b = a.editable();
						if (b.is("textarea")) a = b.$, CKEDITOR.env.ie ? a.createTextRange().execCommand("SelectAll") : (a.selectionStart = 0, a.selectionEnd = a.value.length), a.focus();
						else {
							if (b.is("body")) a.document.$.execCommand("SelectAll", !1, null);
							else {
								var c = a.createRange();
								c.selectNodeContents(b);
								c.select()
							}
							a.forceNextSelectionCheck();
							a.selectionChange()
						}
					},
					canUndo: !1
				});
				b.ui.addButton && b.ui.addButton("SelectAll", {
					label: b.lang.selectall.toolbar,
					command: "selectAll",
					toolbar: "selection,10"
				})
			}
		})
	})();
	(function() {
		var k = {
			readOnly: 1,
			preserveState: !0,
			editorFocus: !1,
			exec: function(a) {
				this.toggleState();
				this.refresh(a)
			},
			refresh: function(a) {
				if (a.document) {
					var c = this.state != CKEDITOR.TRISTATE_ON || a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && !a.focusManager.hasFocus ? "removeClass" : "attachClass";
					a.editable()[c]("cke_show_blocks")
				}
			}
		};
		CKEDITOR.plugins.add("showblocks", {
			onLoad: function() {
				var a = "p div pre address blockquote h1 h2 h3 h4 h5 h6".split(" "),
					c, b, e, f, k = CKEDITOR.getUrl(this.path),
					l = !(CKEDITOR.env.ie && 9 > CKEDITOR.env.version),
					g = l ? ":not([contenteditable=false]):not(.cke_show_blocks_off)" : "",
					d, h;
				for (c = b = e = f = ""; d = a.pop();) h = a.length ? "," : "", c += ".cke_show_blocks " + d + g + h, e += ".cke_show_blocks.cke_contents_ltr " + d + g + h, f += ".cke_show_blocks.cke_contents_rtl " + d + g + h, b += ".cke_show_blocks " + d + g + "{background-image:url(" + CKEDITOR.getUrl(k + "images/block_" + d + ".png") + ")}";
				CKEDITOR.addCss((c + "{background-repeat:no-repeat;border:1px dotted gray;padding-top:8px}").concat(b, e + "{background-position:top left;padding-left:8px}", f + "{background-position:top right;padding-right:8px}"));
				l || CKEDITOR.addCss(".cke_show_blocks [contenteditable=false],.cke_show_blocks .cke_show_blocks_off{border:none;padding-top:0;background-image:none}.cke_show_blocks.cke_contents_rtl [contenteditable=false],.cke_show_blocks.cke_contents_rtl .cke_show_blocks_off{padding-right:0}.cke_show_blocks.cke_contents_ltr [contenteditable=false],.cke_show_blocks.cke_contents_ltr .cke_show_blocks_off{padding-left:0}")
			},
			init: function(a) {
				function c() {
					b.refresh(a)
				}
				if (!a.blockless) {
					var b = a.addCommand("showblocks", k);
					b.canUndo = !1;
					a.config.startupOutlineBlocks && b.setState(CKEDITOR.TRISTATE_ON);
					a.ui.addButton && a.ui.addButton("ShowBlocks", {
						label: a.lang.showblocks.toolbar,
						command: "showblocks",
						toolbar: "tools,20"
					});
					a.on("mode", function() {
						b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
					});
					a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (a.on("focus", c), a.on("blur", c));
					a.on("contentDom", function() {
						b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
					})
				}
			}
		})
	})();
	(function() {
		var f = {
			preserveState: !0,
			editorFocus: !1,
			readOnly: 1,
			exec: function(a) {
				this.toggleState();
				this.refresh(a)
			},
			refresh: function(a) {
				if (a.document) {
					var b = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
					a.editable()[b]("cke_show_borders")
				}
			}
		};
		CKEDITOR.plugins.add("showborders", {
			modes: {
				wysiwyg: 1
			},
			onLoad: function() {
				var a;
				a = (CKEDITOR.env.ie6Compat ? [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : ".%1 table.%2,;.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,;.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,;.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,;.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th;{;border : #d3d3d3 1px dotted;}".split(";")).join("").replace(/%2/g, "cke_show_border").replace(/%1/g, "cke_show_borders ");
				CKEDITOR.addCss(a)
			},
			init: function(a) {
				var b = a.addCommand("showborders", f);
				b.canUndo = !1;
				!1 !== a.config.startupShowBorders && b.setState(CKEDITOR.TRISTATE_ON);
				a.on("mode", function() {
					b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
				}, null, null, 100);
				a.on("contentDom", function() {
					b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
				});
				a.on("removeFormatCleanup", function(d) {
					d = d.data;
					a.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && d.is("table") && (!d.hasAttribute("border") || 0 >= parseInt(d.getAttribute("border"), 10)) && d.addClass("cke_show_border")
				})
			},
			afterInit: function(a) {
				var b = a.dataProcessor;
				a = b && b.dataFilter;
				b = b && b.htmlFilter;
				a && a.addRules({
					elements: {
						table: function(a) {
							a = a.attributes;
							var b = a["class"],
								c = parseInt(a.border, 10);
							c && !(0 >= c) || b && -1 != b.indexOf("cke_show_border") || (a["class"] = (b || "") + " cke_show_border")
						}
					}
				});
				b && b.addRules({
					elements: {
						table: function(a) {
							a = a.attributes;
							var b = a["class"];
							b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/, ""))
						}
					}
				})
			}
		});
		CKEDITOR.on("dialogDefinition", function(a) {
			var b = a.data.name;
			if ("table" == b || "tableProperties" == b) if (a = a.data.definition, b = a.getContents("info").get("txtBorder"), b.commit = CKEDITOR.tools.override(b.commit, function(a) {
				return function(b, c) {
					a.apply(this, arguments);
					var e = parseInt(this.getValue(), 10);
					c[!e || 0 >= e ? "addClass" : "removeClass"]("cke_show_border")
				}
			}), a = (a = a.getContents("advanced")) && a.get("advCSSClasses")) a.setup = CKEDITOR.tools.override(a.setup, function(a) {
				return function() {
					a.apply(this, arguments);
					this.setValue(this.getValue().replace(/cke_show_border/, ""))
				}
			}), a.commit = CKEDITOR.tools.override(a.commit, function(a) {
				return function(b, c) {
					a.apply(this, arguments);
					parseInt(c.getAttribute("border"), 10) || c.addClass("cke_show_border")
				}
			})
		})
	})();
	(function() {
		CKEDITOR.plugins.add("sourcearea", {
			init: function(a) {
				function d() {
					var a = e && this.equals(CKEDITOR.document.getActive());
					this.hide();
					this.setStyle("height", this.getParent().$.clientHeight + "px");
					this.setStyle("width", this.getParent().$.clientWidth + "px");
					this.show();
					a && this.focus()
				}
				if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
					var f = CKEDITOR.plugins.sourcearea;
					a.addMode("source", function(e) {
						var b = a.ui.space("contents").getDocument().createElement("textarea");
						b.setStyles(CKEDITOR.tools.extend({
							width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
							height: "100%",
							resize: "none",
							outline: "none",
							"text-align": "left"
						}, CKEDITOR.tools.cssVendorPrefix("tab-size", a.config.sourceAreaTabSize || 4)));
						b.setAttribute("dir", "ltr");
						b.addClass("cke_source").addClass("cke_reset").addClass("cke_enable_context_menu");
						a.ui.space("contents").append(b);
						b = a.editable(new c(a, b));
						b.setData(a.getData(1));
						CKEDITOR.env.ie && (b.attachListener(a, "resize", d, b), b.attachListener(CKEDITOR.document.getWindow(), "resize", d, b), CKEDITOR.tools.setTimeout(d, 0, b));
						a.fire("ariaWidget", this);
						e()
					});
					a.addCommand("source", f.commands.source);
					a.ui.addButton && a.ui.addButton("Source", {
						label: a.lang.sourcearea.toolbar,
						command: "source",
						toolbar: "mode,10"
					});
					a.on("mode", function() {
						a.getCommand("source").setState("source" == a.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
					});
					var e = CKEDITOR.env.ie && 9 == CKEDITOR.env.version
				}
			}
		});
		var c = CKEDITOR.tools.createClass({
			base: CKEDITOR.editable,
			proto: {
				setData: function(a) {
					this.setValue(a);
					this.status = "ready";
					this.editor.fire("dataReady")
				},
				getData: function() {
					return this.getValue()
				},
				insertHtml: function() {},
				insertElement: function() {},
				insertText: function() {},
				setReadOnly: function(a) {
					this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly")
				},
				detach: function() {
					c.baseProto.detach.call(this);
					this.clearCustomData();
					this.remove()
				}
			}
		})
	})();
	CKEDITOR.plugins.sourcearea = {
		commands: {
			source: {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				editorFocus: !1,
				readOnly: 1,
				exec: function(c) {
					"wysiwyg" == c.mode && c.fire("saveSnapshot");
					c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
					c.setMode("source" == c.mode ? "wysiwyg" : "source")
				},
				canUndo: !1
			}
		}
	};
	CKEDITOR.plugins.add("specialchar", {
		availableLangs: {
			af: 1,
			ar: 1,
			bg: 1,
			ca: 1,
			cs: 1,
			cy: 1,
			da: 1,
			de: 1,
			"de-ch": 1,
			el: 1,
			en: 1,
			"en-gb": 1,
			eo: 1,
			es: 1,
			et: 1,
			eu: 1,
			fa: 1,
			fi: 1,
			fr: 1,
			"fr-ca": 1,
			gl: 1,
			he: 1,
			hr: 1,
			hu: 1,
			id: 1,
			it: 1,
			ja: 1,
			km: 1,
			ko: 1,
			ku: 1,
			lt: 1,
			lv: 1,
			nb: 1,
			nl: 1,
			no: 1,
			pl: 1,
			pt: 1,
			"pt-br": 1,
			ru: 1,
			si: 1,
			sk: 1,
			sl: 1,
			sq: 1,
			sv: 1,
			th: 1,
			tr: 1,
			tt: 1,
			ug: 1,
			uk: 1,
			vi: 1,
			zh: 1,
			"zh-cn": 1
		},
		requires: "dialog",
		init: function(a) {
			var c = this;
			CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
			a.addCommand("specialchar", {
				exec: function() {
					var b = a.langCode,
						b = c.availableLangs[b] ? b : c.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
					CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + b + ".js"), function() {
						CKEDITOR.tools.extend(a.lang.specialchar, c.langEntries[b]);
						a.openDialog("specialchar")
					})
				},
				modes: {
					wysiwyg: 1
				},
				canUndo: !1
			});
			a.ui.addButton && a.ui.addButton("SpecialChar", {
				label: a.lang.specialchar.toolbar,
				command: "specialchar",
				toolbar: "insert,50"
			})
		}
	});
	CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" ");
	CKEDITOR.plugins.add("scayt", {
		requires: "menubutton,dialog",
		tabToOpen: null,
		dialogName: "scaytDialog",
		init: function(a) {
			var c = this,
				d = CKEDITOR.plugins.scayt;
			this.bindEvents(a);
			this.parseConfig(a);
			this.addRule(a);
			CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + "dialogs/options.js"));
			this.addMenuItems(a);
			var b = a.lang.scayt,
				e = CKEDITOR.env;
			a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
				label: b.text_title,
				title: a.plugins.wsc ? a.lang.wsc.title : b.text_title,
				modes: {
					wysiwyg: !(e.ie && (8 > e.version || e.quirks))
				},
				toolbar: "spellchecker,20",
				refresh: function() {
					var b = a.ui.instances.Scayt.getState();
					a.scayt && (b = d.state.scayt[a.name] ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
					a.fire("scaytButtonState", b)
				},
				onRender: function() {
					var b = this;
					a.on("scaytButtonState", function(a) {
						void 0 !== typeof a.data && b.setState(a.data)
					})
				},
				onMenu: function() {
					var b = a.scayt;
					a.getMenuItem("scaytToggle").label = a.lang.scayt[b && d.state.scayt[a.name] ? "btn_disable" : "btn_enable"];
					b = {
						scaytToggle: CKEDITOR.TRISTATE_OFF,
						scaytOptions: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytLangs: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytDict: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytAbout: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						WSC: a.plugins.wsc ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
					};
					a.config.scayt_uiTabs[0] || delete b.scaytOptions;
					a.config.scayt_uiTabs[1] || delete b.scaytLangs;
					a.config.scayt_uiTabs[2] || delete b.scaytDict;
					return b
				}
			});
			a.contextMenu && a.addMenuItems && (a.contextMenu.addListener(function(b, d) {
				var e = a.scayt,
					k, l;
				e && (l = e.getSelectionNode()) && (k = c.menuGenerator(a, l), e.showBanner("." + a.contextMenu._.definition.panel.className.split(" ").join(" .")));
				return k
			}), a.contextMenu._.onHide = CKEDITOR.tools.override(a.contextMenu._.onHide, function(b) {
				return function() {
					var d = a.scayt;
					d && d.hideBanner();
					return b.apply(this)
				}
			}))
		},
		addMenuItems: function(a) {
			var c = this,
				d = CKEDITOR.plugins.scayt;
			a.addMenuGroup("scaytButton");
			for (var b = a.config.scayt_contextMenuItemsOrder.split("|"), e = 0; e < b.length; e++) b[e] = "scayt_" + b[e];
			if ((b = ["grayt_description", "grayt_suggest", "grayt_control"].concat(b)) && b.length) for (e = 0; e < b.length; e++) a.addMenuGroup(b[e], e - 10);
			a.addCommand("scaytToggle", {
				exec: function(a) {
					var b = a.scayt;
					d.state.scayt[a.name] = !d.state.scayt[a.name];
					!0 === d.state.scayt[a.name] ? b || d.createScayt(a) : b && d.destroy(a)
				}
			});
			a.addCommand("scaytAbout", {
				exec: function(a) {
					a.scayt.tabToOpen = "about";
					a.lockSelection();
					a.openDialog(c.dialogName)
				}
			});
			a.addCommand("scaytOptions", {
				exec: function(a) {
					a.scayt.tabToOpen = "options";
					a.lockSelection();
					a.openDialog(c.dialogName)
				}
			});
			a.addCommand("scaytLangs", {
				exec: function(a) {
					a.scayt.tabToOpen = "langs";
					a.lockSelection();
					a.openDialog(c.dialogName)
				}
			});
			a.addCommand("scaytDict", {
				exec: function(a) {
					a.scayt.tabToOpen = "dictionaries";
					a.lockSelection();
					a.openDialog(c.dialogName)
				}
			});
			b = {
				scaytToggle: {
					label: a.lang.scayt.btn_enable,
					group: "scaytButton",
					command: "scaytToggle"
				},
				scaytAbout: {
					label: a.lang.scayt.btn_about,
					group: "scaytButton",
					command: "scaytAbout"
				},
				scaytOptions: {
					label: a.lang.scayt.btn_options,
					group: "scaytButton",
					command: "scaytOptions"
				},
				scaytLangs: {
					label: a.lang.scayt.btn_langs,
					group: "scaytButton",
					command: "scaytLangs"
				},
				scaytDict: {
					label: a.lang.scayt.btn_dictionaries,
					group: "scaytButton",
					command: "scaytDict"
				}
			};
			a.plugins.wsc && (b.WSC = {
				label: a.lang.wsc.toolbar,
				group: "scaytButton",
				onClick: function() {
					var b = CKEDITOR.plugins.scayt,
						d = a.scayt,
						c = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
					(c = c.replace(/\s/g, "")) ? (d && b.state.scayt[a.name] && d.setMarkupPaused && d.setMarkupPaused(!0), a.lockSelection(), a.execCommand("checkspell")) : alert("Nothing to check!")
				}
			});
			a.addMenuItems(b)
		},
		bindEvents: function(a) {
			var c = CKEDITOR.plugins.scayt,
				d = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE,
				b = function() {
					c.destroy(a)
				},
				e = function() {
					!c.state.scayt[a.name] || a.readOnly || a.scayt || c.createScayt(a)
				},
				f = function() {
					var b = a.editable();
					b.attachListener(b, "focus", function(b) {
						CKEDITOR.plugins.scayt && !a.scayt && setTimeout(e, 0);
						b = CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[a.name] && a.scayt;
						var c, h;
						if ((d || b) && a._.savedSelection) {
							b = a._.savedSelection.getSelectedElement();
							b = !b && a._.savedSelection.getRanges();
							for (var f = 0; f < b.length; f++) h = b[f], "string" === typeof h.startContainer.$.nodeValue && (c = h.startContainer.getText().length, (c < h.startOffset || c < h.endOffset) && a.unlockSelection(!1))
						}
					}, this, null, -10)
				},
				g = function() {
					d ? a.config.scayt_inlineModeImmediateMarkup ? e() : (a.on("blur", function() {
						setTimeout(b, 0)
					}), a.on("focus", e), a.focusManager.hasFocus && e()) : e();
					f();
					var c = a.editable();
					c.attachListener(c, "mousedown", function(b) {
						b = b.data.getTarget();
						var d = a.widgets && a.widgets.getByElement(b);
						d && (d.wrapper = b.getAscendant(function(a) {
							return a.hasAttribute("data-cke-widget-wrapper")
						}, !0))
					}, this, null, -10)
				};
			a.on("contentDom", g);
			a.on("beforeCommandExec", function(b) {
				var d = a.scayt,
					e = null,
					f = !1,
					g = !0;
				b.data.name in c.options.disablingCommandExec && "wysiwyg" == a.mode ? d && (c.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)) : "bold" !== b.data.name && "italic" !== b.data.name && "underline" !== b.data.name && "strike" !== b.data.name && "subscript" !== b.data.name && "superscript" !== b.data.name && "enter" !== b.data.name && "cut" !== b.data.name && "language" !== b.data.name || !d || ("cut" === b.data.name && (g = !1, f = !0), "language" === b.data.name && (e = (e = a.plugins.language.getCurrentLangElement(a)) && e.$, f = !0), a.fire("reloadMarkupScayt", {
					removeOptions: {
						removeInside: g,
						forceBookmark: f,
						selectionNode: e
					},
					timeout: 0
				}))
			});
			a.on("beforeSetMode", function(b) {
				if ("source" == b.data) {
					if (b = a.scayt) c.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED);
					a.document && a.document.getBody().removeAttribute("_jquid")
				}
			});
			a.on("afterCommandExec", function(b) {
				"wysiwyg" != a.mode || "undo" != b.data.name && "redo" != b.data.name || setTimeout(function() {
					var b = a.scayt,
						d = b && b.getScaytLangList();
					d && d.ltr && d.rtl && b.fire("startSpellCheck, startGrammarCheck")
				}, 250)
			});
			a.on("readOnly", function(b) {
				var d;
				b && (d = a.scayt, !0 === b.editor.readOnly ? d && d.fire("removeMarkupInDocument", {}) : d ? d.fire("startSpellCheck, startGrammarCheck") : "wysiwyg" == b.editor.mode && !0 === c.state.scayt[b.editor.name] && (c.createScayt(a), b.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON)))
			});
			a.on("beforeDestroy", b);
			a.on("setData", function() {
				b();
				(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || a.plugins.divarea) && g()
			}, this, null, 50);
			a.on("reloadMarkupScayt", function(b) {
				var d = b.data && b.data.removeOptions;
				setTimeout(function() {
					var b = a.scayt,
						c = b && b.getScaytLangList();
					c && c.ltr && c.rtl && (a.document.fire("keydown", new CKEDITOR.dom.event({
						keyCode: 37
					})), b.removeMarkupInSelectionNode(d), b.fire("startSpellCheck, startGrammarCheck"))
				}, b.data && b.data.timeout || 0)
			});
			a.on("insertElement", function() {
				a.fire("reloadMarkupScayt", {
					removeOptions: {
						forceBookmark: !0
					}
				})
			}, this, null, 50);
			a.on("insertHtml", function() {
				a.fire("reloadMarkupScayt")
			}, this, null, 50);
			a.on("insertText", function() {
				a.fire("reloadMarkupScayt")
			}, this, null, 50);
			a.on("scaytDialogShown", function(b) {
				b.data.selectPage(a.scayt.tabToOpen)
			})
		},
		parseConfig: function(a) {
			var c = CKEDITOR.plugins.scayt;
			c.replaceOldOptionsNames(a.config);
			"boolean" !== typeof a.config.scayt_autoStartup && (a.config.scayt_autoStartup = !1);
			c.state.scayt[a.name] = a.config.scayt_autoStartup;
			"boolean" !== typeof a.config.grayt_autoStartup && (a.config.grayt_autoStartup = !1);
			"boolean" !== typeof a.config.scayt_inlineModeImmediateMarkup && (a.config.scayt_inlineModeImmediateMarkup = !1);
			c.state.grayt[a.name] = a.config.grayt_autoStartup;
			a.config.scayt_contextCommands || (a.config.scayt_contextCommands = "ignore|ignoreall|add");
			a.config.scayt_contextMenuItemsOrder || (a.config.scayt_contextMenuItemsOrder = "suggest|moresuggest|control");
			a.config.scayt_sLang || (a.config.scayt_sLang = "en_US");
			if (void 0 === a.config.scayt_maxSuggestions || "number" != typeof a.config.scayt_maxSuggestions || 0 > a.config.scayt_maxSuggestions) a.config.scayt_maxSuggestions = 5;
			if (void 0 === a.config.scayt_minWordLength || "number" != typeof a.config.scayt_minWordLength || 1 > a.config.scayt_minWordLength) a.config.scayt_minWordLength = 4;
			if (void 0 === a.config.scayt_customDictionaryIds || "string" !== typeof a.config.scayt_customDictionaryIds) a.config.scayt_customDictionaryIds = "";
			if (void 0 === a.config.scayt_userDictionaryName || "string" !== typeof a.config.scayt_userDictionaryName) a.config.scayt_userDictionaryName = null;
			if ("string" === typeof a.config.scayt_uiTabs && 3 === a.config.scayt_uiTabs.split(",").length) {
				var d = [],
					b = [];
				a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(",");
				CKEDITOR.tools.search(a.config.scayt_uiTabs, function(a) {
					1 === Number(a) || 0 === Number(a) ? (b.push(!0), d.push(Number(a))) : b.push(!1)
				});
				null === CKEDITOR.tools.search(b, !1) ? a.config.scayt_uiTabs = d : a.config.scayt_uiTabs = [1, 1, 1]
			} else a.config.scayt_uiTabs = [1, 1, 1];
			"string" != typeof a.config.scayt_serviceProtocol && (a.config.scayt_serviceProtocol = null);
			"string" != typeof a.config.scayt_serviceHost && (a.config.scayt_serviceHost = null);
			"string" != typeof a.config.scayt_servicePort && (a.config.scayt_servicePort = null);
			"string" != typeof a.config.scayt_servicePath && (a.config.scayt_servicePath = null);
			a.config.scayt_moreSuggestions || (a.config.scayt_moreSuggestions = "on");
			"string" !== typeof a.config.scayt_customerId && (a.config.scayt_customerId = "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2");
			"string" !== typeof a.config.scayt_srcUrl && (c = document.location.protocol, c = -1 != c.search(/https?:/) ? c : "http:", a.config.scayt_srcUrl = c + "//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js");
			"boolean" !== typeof CKEDITOR.config.scayt_handleCheckDirty && (CKEDITOR.config.scayt_handleCheckDirty = !0);
			"boolean" !== typeof CKEDITOR.config.scayt_handleUndoRedo && (CKEDITOR.config.scayt_handleUndoRedo = !0);
			CKEDITOR.config.scayt_handleUndoRedo = CKEDITOR.plugins.undo ? CKEDITOR.config.scayt_handleUndoRedo : !1;
			"boolean" !== typeof a.config.scayt_multiLanguageMode && (a.config.scayt_multiLanguageMode = !1);
			"object" !== typeof a.config.scayt_multiLanguageStyles && (a.config.scayt_multiLanguageStyles = {});
			a.config.scayt_ignoreAllCapsWords && "boolean" !== typeof a.config.scayt_ignoreAllCapsWords && (a.config.scayt_ignoreAllCapsWords = !1);
			a.config.scayt_ignoreDomainNames && "boolean" !== typeof a.config.scayt_ignoreDomainNames && (a.config.scayt_ignoreDomainNames = !1);
			a.config.scayt_ignoreWordsWithMixedCases && "boolean" !== typeof a.config.scayt_ignoreWordsWithMixedCases && (a.config.scayt_ignoreWordsWithMixedCases = !1);
			a.config.scayt_ignoreWordsWithNumbers && "boolean" !== typeof a.config.scayt_ignoreWordsWithNumbers && (a.config.scayt_ignoreWordsWithNumbers = !1);
			if (a.config.scayt_disableOptionsStorage) {
				var c = CKEDITOR.tools.isArray(a.config.scayt_disableOptionsStorage) ? a.config.scayt_disableOptionsStorage : "string" === typeof a.config.scayt_disableOptionsStorage ? [a.config.scayt_disableOptionsStorage] : void 0,
					e = "all options lang ignore-all-caps-words ignore-domain-names ignore-words-with-mixed-cases ignore-words-with-numbers".split(" "),
					f = ["lang", "ignore-all-caps-words", "ignore-domain-names", "ignore-words-with-mixed-cases", "ignore-words-with-numbers"],
					g = CKEDITOR.tools.search,
					h = CKEDITOR.tools.indexOf;
				a.config.scayt_disableOptionsStorage = function(a) {
					for (var b = [], d = 0; d < a.length; d++) {
						var c = a[d],
							m = !! g(a, "options");
						if (!g(e, c) || m && g(f, function(a) {
							if ("lang" === a) return !1
						})) return;
						g(f, c) && f.splice(h(f, c), 1);
						if ("all" === c || m && g(a, "lang")) return [];
						"options" === c && (f = ["lang"])
					}
					return b = b.concat(f)
				}(c)
			}
		},
		addRule: function(a) {
			var c = CKEDITOR.plugins.scayt,
				d = a.dataProcessor,
				b = d && d.htmlFilter,
				e = a._.elementsPath && a._.elementsPath.filters,
				d = d && d.dataFilter,
				f = a.addRemoveFormatFilter,
				g = function(b) {
					if (a.scayt && (b.hasAttribute(c.options.data_attribute_name) || b.hasAttribute(c.options.problem_grammar_data_attribute))) return !1
				},
				h = function(b) {
					var d = !0;
					a.scayt && (b.hasAttribute(c.options.data_attribute_name) || b.hasAttribute(c.options.problem_grammar_data_attribute)) && (d = !1);
					return d
				};
			e && e.push(g);
			d && d.addRules({
				elements: {
					span: function(a) {
						var b = a.hasClass(c.options.misspelled_word_class) && a.attributes[c.options.data_attribute_name],
							d = a.hasClass(c.options.problem_grammar_class) && a.attributes[c.options.problem_grammar_data_attribute];
						c && (b || d) && delete a.name;
						return a
					}
				}
			});
			b && b.addRules({
				elements: {
					span: function(a) {
						var b = a.hasClass(c.options.misspelled_word_class) && a.attributes[c.options.data_attribute_name],
							d = a.hasClass(c.options.problem_grammar_class) && a.attributes[c.options.problem_grammar_data_attribute];
						c && (b || d) && delete a.name;
						return a
					}
				}
			});
			f && f.call(a, h)
		},
		scaytMenuDefinition: function(a) {
			var c = this;
			a = a.scayt;
			return {
				scayt: {
					scayt_ignore: {
						label: a.getLocal("btn_ignore"),
						group: "scayt_control",
						order: 1,
						exec: function(a) {
							a.scayt.ignoreWord()
						}
					},
					scayt_ignoreall: {
						label: a.getLocal("btn_ignoreAll"),
						group: "scayt_control",
						order: 2,
						exec: function(a) {
							a.scayt.ignoreAllWords()
						}
					},
					scayt_add: {
						label: a.getLocal("btn_addWord"),
						group: "scayt_control",
						order: 3,
						exec: function(a) {
							var b = a.scayt;
							setTimeout(function() {
								b.addWordToUserDictionary()
							}, 10)
						}
					},
					scayt_option: {
						label: a.getLocal("btn_options"),
						group: "scayt_control",
						order: 4,
						exec: function(a) {
							a.scayt.tabToOpen = "options";
							a.lockSelection();
							a.openDialog(c.dialogName)
						},
						verification: function(a) {
							return 1 == a.config.scayt_uiTabs[0] ? !0 : !1
						}
					},
					scayt_language: {
						label: a.getLocal("btn_langs"),
						group: "scayt_control",
						order: 5,
						exec: function(a) {
							a.scayt.tabToOpen = "langs";
							a.lockSelection();
							a.openDialog(c.dialogName)
						},
						verification: function(a) {
							return 1 == a.config.scayt_uiTabs[1] ? !0 : !1
						}
					},
					scayt_dictionary: {
						label: a.getLocal("btn_dictionaries"),
						group: "scayt_control",
						order: 6,
						exec: function(a) {
							a.scayt.tabToOpen = "dictionaries";
							a.lockSelection();
							a.openDialog(c.dialogName)
						},
						verification: function(a) {
							return 1 == a.config.scayt_uiTabs[2] ? !0 : !1
						}
					},
					scayt_about: {
						label: a.getLocal("btn_about"),
						group: "scayt_control",
						order: 7,
						exec: function(a) {
							a.scayt.tabToOpen = "about";
							a.lockSelection();
							a.openDialog(c.dialogName)
						}
					}
				},
				grayt: {
					grayt_problemdescription: {
						label: "Grammar problem description",
						group: "grayt_description",
						order: 1,
						state: CKEDITOR.TRISTATE_DISABLED,
						exec: function(a) {}
					},
					grayt_ignore: {
						label: a.getLocal("btn_ignore"),
						group: "grayt_control",
						order: 2,
						exec: function(a) {
							a.scayt.ignorePhrase()
						}
					}
				}
			}
		},
		buildSuggestionMenuItems: function(a, c, d) {
			var b = {},
				e = {},
				f = d ? "word" : "phrase",
				g = d ? "startGrammarCheck" : "startSpellCheck",
				h = a.scayt;
			if (0 < c.length && "no_any_suggestions" !== c[0]) if (d) for (d = 0; d < c.length; d++) {
				var k = "scayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[d].replace(" ", "_");
				a.addCommand(k, this.createCommand(CKEDITOR.plugins.scayt.suggestions[d], f, g));
				d < a.config.scayt_maxSuggestions ? (a.addMenuItem(k, {
					label: c[d],
					command: k,
					group: "scayt_suggest",
					order: d + 1
				}), b[k] = CKEDITOR.TRISTATE_OFF) : (a.addMenuItem(k, {
					label: c[d],
					command: k,
					group: "scayt_moresuggest",
					order: d + 1
				}), e[k] = CKEDITOR.TRISTATE_OFF, "on" === a.config.scayt_moreSuggestions && (a.addMenuItem("scayt_moresuggest", {
					label: h.getLocal("btn_moreSuggestions"),
					group: "scayt_moresuggest",
					order: 10,
					getItems: function() {
						return e
					}
				}), b.scayt_moresuggest = CKEDITOR.TRISTATE_OFF))
			} else for (d = 0; d < c.length; d++) k = "grayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[d].replace(" ", "_"), a.addCommand(k, this.createCommand(CKEDITOR.plugins.scayt.suggestions[d], f, g)), a.addMenuItem(k, {
				label: c[d],
				command: k,
				group: "grayt_suggest",
				order: d + 1
			}), b[k] = CKEDITOR.TRISTATE_OFF;
			else b.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED, a.addCommand("no_scayt_suggest", {
				exec: function() {}
			}), a.addMenuItem("no_scayt_suggest", {
				label: h.getLocal("btn_noSuggestions") || "no_scayt_suggest",
				command: "no_scayt_suggest",
				group: "scayt_suggest",
				order: 0
			});
			return b
		},
		menuGenerator: function(a, c) {
			var d = a.scayt,
				b = this.scaytMenuDefinition(a),
				e = {},
				f = a.config.scayt_contextCommands.split("|"),
				g = c.getAttribute(d.getLangAttribute()) || d.getLang(),
				h, k;
			h = d.isScaytNode(c);
			k = d.isGraytNode(c);
			h ? (b = b.scayt, e = c.getAttribute(d.getScaytNodeAttributeName()), d.fire("getSuggestionsList", {
				lang: g,
				word: e
			}), e = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions, h)) : k && (b = b.grayt, e = c.getAttribute(d.getGraytNodeAttributeName()), k = d.getProblemDescriptionText(e, g), b.grayt_problemdescription && k && (b.grayt_problemdescription.label = k), d.fire("getGrammarSuggestionsList", {
				lang: g,
				phrase: e
			}), e = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions, h));
			if (h && "off" == a.config.scayt_contextCommands) return e;
			for (var l in b) h && -1 == CKEDITOR.tools.indexOf(f, l.replace("scayt_", "")) && "all" != a.config.scayt_contextCommands || (e[l] = "undefined" != typeof b[l].state ? b[l].state : CKEDITOR.TRISTATE_OFF, "function" !== typeof b[l].verification || b[l].verification(a) || delete e[l], a.addCommand(l, {
				exec: b[l].exec
			}), a.addMenuItem(l, {
				label: a.lang.scayt[b[l].label] || b[l].label,
				command: l,
				group: b[l].group,
				order: b[l].order
			}));
			return e
		},
		createCommand: function(a, c, d) {
			return {
				exec: function(b) {
					b = b.scayt;
					var e = {};
					e[c] = a;
					b.replaceSelectionNode(e);
					"startGrammarCheck" === d && b.removeMarkupInSelectionNode({
						grammarOnly: !0
					});
					b.fire(d)
				}
			}
		}
	});
	CKEDITOR.plugins.scayt = {
		state: {
			scayt: {},
			grayt: {}
		},
		suggestions: [],
		loadingHelper: {
			loadOrder: []
		},
		isLoading: !1,
		options: {
			disablingCommandExec: {
				source: !0,
				newpage: !0,
				templates: !0
			},
			data_attribute_name: "data-scayt-word",
			misspelled_word_class: "scayt-misspell-word",
			problem_grammar_data_attribute: "data-grayt-phrase",
			problem_grammar_class: "gramm-problem"
		},
		backCompatibilityMap: {
			scayt_service_protocol: "scayt_serviceProtocol",
			scayt_service_host: "scayt_serviceHost",
			scayt_service_port: "scayt_servicePort",
			scayt_service_path: "scayt_servicePath",
			scayt_customerid: "scayt_customerId"
		},
		replaceOldOptionsNames: function(a) {
			for (var c in a) c in this.backCompatibilityMap && (a[this.backCompatibilityMap[c]] = a[c], delete a[c])
		},
		createScayt: function(a) {
			var c = this,
				d = CKEDITOR.plugins.scayt;
			this.loadScaytLibrary(a, function(a) {
				var e = a.window && a.window.getFrame() || a.editable();
				e ? (e = {
					lang: a.config.scayt_sLang,
					container: e.$,
					customDictionary: a.config.scayt_customDictionaryIds,
					userDictionaryName: a.config.scayt_userDictionaryName,
					localization: a.langCode,
					customer_id: a.config.scayt_customerId,
					debug: a.config.scayt_debug,
					data_attribute_name: c.options.data_attribute_name,
					misspelled_word_class: c.options.misspelled_word_class,
					problem_grammar_data_attribute: c.options.problem_grammar_data_attribute,
					problem_grammar_class: c.options.problem_grammar_class,
					"options-to-restore": a.config.scayt_disableOptionsStorage,
					focused: a.editable().hasFocus,
					ignoreElementsRegex: a.config.scayt_elementsToIgnore,
					minWordLength: a.config.scayt_minWordLength,
					multiLanguageMode: a.config.scayt_multiLanguageMode,
					multiLanguageStyles: a.config.scayt_multiLanguageStyles,
					graytAutoStartup: d.state.grayt[a.name]
				}, a.config.scayt_serviceProtocol && (e.service_protocol = a.config.scayt_serviceProtocol), a.config.scayt_serviceHost && (e.service_host = a.config.scayt_serviceHost), a.config.scayt_servicePort && (e.service_port = a.config.scayt_servicePort), a.config.scayt_servicePath && (e.service_path = a.config.scayt_servicePath), "boolean" === typeof a.config.scayt_ignoreAllCapsWords && (e["ignore-all-caps-words"] = a.config.scayt_ignoreAllCapsWords), "boolean" === typeof a.config.scayt_ignoreDomainNames && (e["ignore-domain-names"] = a.config.scayt_ignoreDomainNames), "boolean" === typeof a.config.scayt_ignoreWordsWithMixedCases && (e["ignore-words-with-mixed-cases"] = a.config.scayt_ignoreWordsWithMixedCases), "boolean" === typeof a.config.scayt_ignoreWordsWithNumbers && (e["ignore-words-with-numbers"] = a.config.scayt_ignoreWordsWithNumbers), e = new SCAYT.CKSCAYT(e, function() {}, function() {}), e.subscribe("suggestionListSend", function(a) {
					for (var b = {}, d = [], c = 0; c < a.suggestionList.length; c++) b["word_" + a.suggestionList[c]] || (b["word_" + a.suggestionList[c]] = a.suggestionList[c], d.push(a.suggestionList[c]));
					CKEDITOR.plugins.scayt.suggestions = d
				}), e.subscribe("selectionIsChanged", function(d) {
					a.getSelection().isLocked && a.lockSelection()
				}), e.subscribe("graytStateChanged", function(c) {
					d.state.grayt[a.name] = c.state
				}), a.scayt = e, a.fire("scaytButtonState", a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON)) : d.state.scayt[a.name] = !1
			})
		},
		destroy: function(a) {
			a.scayt && a.scayt.destroy();
			delete a.scayt;
			a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF)
		},
		loadScaytLibrary: function(a, c) {
			var d = this,
				b, e;
			this.loadingHelper[a.name] || ("undefined" === typeof window.SCAYT || "function" !== typeof window.SCAYT.CKSCAYT ? (this.loadingHelper[a.name] = c, this.loadingHelper.loadOrder.push(a.name), b = new Date, b = b.getTime(), e = a.config.scayt_srcUrl, e += 0 <= e.indexOf("?") ? "" : "?" + b, this.loadingHelper.ckscaytLoading || (CKEDITOR.scriptLoader.load(e, function(a) {
				if (a) {
					CKEDITOR.fireOnce("scaytReady");
					for (var b = 0; b < d.loadingHelper.loadOrder.length; b++) {
						a = d.loadingHelper.loadOrder[b];
						if ("function" === typeof d.loadingHelper[a]) d.loadingHelper[a](CKEDITOR.instances[a]);
						delete d.loadingHelper[a]
					}
					d.loadingHelper.loadOrder = []
				}
			}), this.loadingHelper.ckscaytLoading = !0)) : window.SCAYT && "function" === typeof window.SCAYT.CKSCAYT && (CKEDITOR.fireOnce("scaytReady"), a.scayt || "function" === typeof c && c(a)))
		}
	};
	CKEDITOR.on("dialogDefinition", function(a) {
		var c = a.data.name;
		a = a.data.definition.dialog;
		if ("scaytDialog" === c) a.on("cancel", function(a) {
			return !1
		}, this, null, -1);
		if ("checkspell" === c) a.on("cancel", function(a) {
			a = a.sender && a.sender.getParentEditor();
			var b = CKEDITOR.plugins.scayt,
				c = a.scayt;
			c && b.state.scayt[a.name] && c.setMarkupPaused && c.setMarkupPaused(!1);
			a.unlockSelection()
		}, this, null, -2);
		if ("link" === c) a.on("ok", function(a) {
			var b = a.sender && a.sender.getParentEditor();
			b && setTimeout(function() {
				b.fire("reloadMarkupScayt", {
					removeOptions: {
						removeInside: !0,
						forceBookmark: !0
					},
					timeout: 0
				})
			}, 0)
		})
	});
	CKEDITOR.on("scaytReady", function() {
		if (!0 === CKEDITOR.config.scayt_handleCheckDirty) {
			var a = CKEDITOR.editor.prototype;
			a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function(a) {
				return function() {
					var b = null,
						c = this.scayt;
					if (CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[this.name] && this.scayt) {
						if (b = "ready" == this.status) var f = c.removeMarkupFromString(this.getSnapshot()),
							c = c.removeMarkupFromString(this._.previousValue),
							b = b && c !== f
					} else b = a.call(this);
					return b
				}
			});
			a.resetDirty = CKEDITOR.tools.override(a.resetDirty, function(a) {
				return function() {
					var b = this.scayt;
					CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[this.name] && this.scayt ? this._.previousValue = b.removeMarkupFromString(this.getSnapshot()) : a.call(this)
				}
			})
		}
		if (!0 === CKEDITOR.config.scayt_handleUndoRedo) {
			var a = CKEDITOR.plugins.undo.Image.prototype,
				c = "function" == typeof a.equalsContent ? "equalsContent" : "equals";
			a[c] = CKEDITOR.tools.override(a[c], function(a) {
				return function(b) {
					var c = b.editor.scayt,
						f = this.contents,
						g = b.contents,
						h = null;
					CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[b.editor.name] && b.editor.scayt && (this.contents = c.removeMarkupFromString(f) || "", b.contents = c.removeMarkupFromString(g) || "");
					h = a.apply(this, arguments);
					this.contents = f;
					b.contents = g;
					return h
				}
			})
		}
	});
	(function() {
		CKEDITOR.plugins.add("stylescombo", {
			requires: "richcombo",
			init: function(c) {
				var l = c.config,
					g = c.lang.stylescombo,
					f = {},
					k = [],
					m = [];
				c.on("stylesSet", function(b) {
					if (b = b.data.styles) {
						for (var a, h, d, e = 0, n = b.length; e < n; e++)(a = b[e], c.blockless && a.element in CKEDITOR.dtd.$block || (h = a.name, a = new CKEDITOR.style(a), c.filter.customConfig && !c.filter.check(a))) || (a._name = h, a._.enterMode = l.enterMode, a._.type = d = a.assignedTo || a.type, a._.weight = e + 1E3 * (d == CKEDITOR.STYLE_OBJECT ? 1 : d == CKEDITOR.STYLE_BLOCK ? 2 : 3), f[h] = a, k.push(a), m.push(a));
						k.sort(function(a, b) {
							return a._.weight - b._.weight
						})
					}
				});
				c.ui.addRichCombo("Styles", {
					label: g.label,
					title: g.panelTitle,
					toolbar: "styles,10",
					allowedContent: m,
					panel: {
						css: [CKEDITOR.skin.getPath("editor")].concat(l.contentsCss),
						multiSelect: !0,
						attributes: {
							"aria-label": g.panelTitle
						}
					},
					init: function() {
						var b, a, c, d, e, f;
						e = 0;
						for (f = k.length; e < f; e++) b = k[e], a = b._name, d = b._.type, d != c && (this.startGroup(g["panelTitle" + String(d)]), c = d), this.add(a, b.type == CKEDITOR.STYLE_OBJECT ? a : b.buildPreview(), a);
						this.commit()
					},
					onClick: function(b) {
						c.focus();
						c.fire("saveSnapshot");
						b = f[b];
						var a = c.elementPath();
						c[b.checkActive(a, c) ? "removeStyle" : "applyStyle"](b);
						c.fire("saveSnapshot")
					},
					onRender: function() {
						c.on("selectionChange", function(b) {
							var a = this.getValue();
							b = b.data.path.elements;
							for (var h = 0, d = b.length, e; h < d; h++) {
								e = b[h];
								for (var g in f) if (f[g].checkElementRemovable(e, !0, c)) {
									g != a && this.setValue(g);
									return
								}
							}
							this.setValue("")
						}, this)
					},
					onOpen: function() {
						var b = c.getSelection().getSelectedElement(),
							b = c.elementPath(b),
							a = [0, 0, 0, 0];
						this.showAll();
						this.unmarkAll();
						for (var h in f) {
							var d = f[h],
								e = d._.type;
							d.checkApplicable(b, c, c.activeFilter) ? a[e]++ : this.hideItem(h);
							d.checkActive(b, c) && this.mark(h)
						}
						a[CKEDITOR.STYLE_BLOCK] || this.hideGroup(g["panelTitle" + String(CKEDITOR.STYLE_BLOCK)]);
						a[CKEDITOR.STYLE_INLINE] || this.hideGroup(g["panelTitle" + String(CKEDITOR.STYLE_INLINE)]);
						a[CKEDITOR.STYLE_OBJECT] || this.hideGroup(g["panelTitle" + String(CKEDITOR.STYLE_OBJECT)])
					},
					refresh: function() {
						var b = c.elementPath();
						if (b) {
							for (var a in f) if (f[a].checkApplicable(b, c, c.activeFilter)) return;
							this.setState(CKEDITOR.TRISTATE_DISABLED)
						}
					},
					reset: function() {
						f = {};
						k = []
					}
				})
			}
		})
	})();
	(function() {
		function k(c) {
			return {
				editorFocus: !1,
				canUndo: !1,
				modes: {
					wysiwyg: 1
				},
				exec: function(d) {
					if (d.editable().hasFocus) {
						var e = d.getSelection(),
							b;
						if (b = (new CKEDITOR.dom.elementPath(e.getCommonAncestor(), e.root)).contains({
							td: 1,
							th: 1
						}, 1)) {
							var e = d.createRange(),
								a = CKEDITOR.tools.tryThese(function() {
									var a = b.getParent().$.cells[b.$.cellIndex + (c ? -1 : 1)];
									a.parentNode.parentNode;
									return a
								}, function() {
									var a = b.getParent(),
										a = a.getAscendant("table").$.rows[a.$.rowIndex + (c ? -1 : 1)];
									return a.cells[c ? a.cells.length - 1 : 0]
								});
							if (a || c) if (a) a = new CKEDITOR.dom.element(a), e.moveToElementEditStart(a), e.checkStartOfBlock() && e.checkEndOfBlock() || e.selectNodeContents(a);
							else return !0;
							else {
								for (var f = b.getAscendant("table").$, a = b.getParent().$.cells, f = new CKEDITOR.dom.element(f.insertRow(-1), d.document), g = 0, h = a.length; g < h; g++) f.append((new CKEDITOR.dom.element(a[g], d.document)).clone(!1, !1)).appendBogus();
								e.moveToElementEditStart(f)
							}
							e.select(!0);
							return !0
						}
					}
					return !1
				}
			}
		}
		var h = {
			editorFocus: !1,
			modes: {
				wysiwyg: 1,
				source: 1
			}
		},
			g = {
				exec: function(c) {
					c.container.focusNext(!0, c.tabIndex)
				}
			},
			f = {
				exec: function(c) {
					c.container.focusPrevious(!0, c.tabIndex)
				}
			};
		CKEDITOR.plugins.add("tab", {
			init: function(c) {
				for (var d = !1 !== c.config.enableTabKeyTools, e = c.config.tabSpaces || 0, b = ""; e--;) b += " ";
				if (b) c.on("key", function(a) {
					9 == a.data.keyCode && (c.insertText(b), a.cancel())
				});
				if (d) c.on("key", function(a) {
					(9 == a.data.keyCode && c.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && c.execCommand("selectPreviousCell")) && a.cancel()
				});
				c.addCommand("blur", CKEDITOR.tools.extend(g, h));
				c.addCommand("blurBack", CKEDITOR.tools.extend(f, h));
				c.addCommand("selectNextCell", k());
				c.addCommand("selectPreviousCell", k(!0))
			}
		})
	})();
	CKEDITOR.dom.element.prototype.focusNext = function(k, h) {
		var g = void 0 === h ? this.getTabIndex() : h,
			f, c, d, e, b, a;
		if (0 >= g) for (b = this.getNextSourceNode(k, CKEDITOR.NODE_ELEMENT); b;) {
			if (b.isVisible() && 0 === b.getTabIndex()) {
				d = b;
				break
			}
			b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)
		} else for (b = this.getDocument().getBody().getFirst(); b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
			if (!f) if (!c && b.equals(this)) {
				if (c = !0, k) {
					if (!(b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
					f = 1
				}
			} else c && !this.contains(b) && (f = 1);
			if (b.isVisible() && !(0 > (a = b.getTabIndex()))) {
				if (f && a == g) {
					d = b;
					break
				}
				a > g && (!d || !e || a < e) ? (d = b, e = a) : d || 0 !== a || (d = b, e = a)
			}
		}
		d && d.focus()
	};
	CKEDITOR.dom.element.prototype.focusPrevious = function(k, h) {
		for (var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e = 0, b, a = this.getDocument().getBody().getLast(); a = a.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
			if (!f) if (!c && a.equals(this)) {
				if (c = !0, k) {
					if (!(a = a.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
					f = 1
				}
			} else c && !this.contains(a) && (f = 1);
			if (a.isVisible() && !(0 > (b = a.getTabIndex()))) if (0 >= g) {
				if (f && 0 === b) {
					d = a;
					break
				}
				b > e && (d = a, e = b)
			} else {
				if (f && b == g) {
					d = a;
					break
				}
				b < g && (!d || b > e) && (d = a, e = b)
			}
		}
		d && d.focus()
	};
	CKEDITOR.plugins.add("table", {
		requires: "dialog",
		init: function(a) {
			function e(a) {
				return CKEDITOR.tools.extend(a || {}, {
					contextSensitive: 1,
					refresh: function(a, f) {
						this.setState(f.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
					}
				})
			}
			if (!a.blockless) {
				var c = a.lang.table;
				a.addCommand("table", new CKEDITOR.dialogCommand("table", {
					context: "table",
					allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ? "table" + a.plugins.dialogadvtab.allowedContent() : ""),
					requiredContent: "table",
					contentTransformations: [
						["table{width}: sizeToStyle", "table[width]: sizeToAttribute"]
					]
				}));
				a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", e()));
				a.addCommand("tableDelete", e({
					exec: function(a) {
						var b = a.elementPath().contains("table", 1);
						if (b) {
							var d = b.getParent(),
								c = a.editable();
							1 != d.getChildCount() || d.is("td", "th") || d.equals(c) || (b = d);
							a = a.createRange();
							a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
							b.remove();
							a.select()
						}
					}
				}));
				a.ui.addButton && a.ui.addButton("Table", {
					label: c.toolbar,
					command: "table",
					toolbar: "insert,30"
				});
				CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
				CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
				a.addMenuItems && a.addMenuItems({
					table: {
						label: c.menu,
						command: "tableProperties",
						group: "table",
						order: 5
					},
					tabledelete: {
						label: c.deleteTable,
						command: "tableDelete",
						group: "table",
						order: 1
					}
				});
				a.on("doubleclick", function(a) {
					a.data.element.is("table") && (a.data.dialog = "tableProperties")
				});
				a.contextMenu && a.contextMenu.addListener(function() {
					return {
						tabledelete: CKEDITOR.TRISTATE_OFF,
						table: CKEDITOR.TRISTATE_OFF
					}
				})
			}
		}
	});
	(function() {
		function t(e) {
			function d(a) {
				0 < b.length || a.type != CKEDITOR.NODE_ELEMENT || !C.test(a.getName()) || a.getCustomData("selected_cell") || (CKEDITOR.dom.element.setMarker(c, a, "selected_cell", !0), b.push(a))
			}
			e = e.getRanges();
			for (var b = [], c = {}, a = 0; a < e.length; a++) {
				var f = e[a];
				if (f.collapsed) f = f.getCommonAncestor(), (f = f.getAscendant("td", !0) || f.getAscendant("th", !0)) && b.push(f);
				else {
					var f = new CKEDITOR.dom.walker(f),
						g;
					for (f.guard = d; g = f.next();) g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.table) || (g = g.getAscendant("td", !0) || g.getAscendant("th", !0)) && !g.getCustomData("selected_cell") && (CKEDITOR.dom.element.setMarker(c, g, "selected_cell", !0), b.push(g))
				}
			}
			CKEDITOR.dom.element.clearAllMarkers(c);
			return b
		}

		function p(e, d) {
			for (var b = t(e), c = b[0], a = c.getAscendant("table"), c = c.getDocument(), f = b[0].getParent(), g = f.$.rowIndex, b = b[b.length - 1], h = b.getParent().$.rowIndex + b.$.rowSpan - 1, b = new CKEDITOR.dom.element(a.$.rows[h]), g = d ? g : h, f = d ? f : b, b = CKEDITOR.tools.buildTableMap(a), a = b[g], g = d ? b[g - 1] : b[g + 1], b = b[0].length, c = c.createElement("tr"), h = 0; a[h] && h < b; h++) {
				var k;
				1 < a[h].rowSpan && g && a[h] == g[h] ? (k = a[h], k.rowSpan += 1) : (k = (new CKEDITOR.dom.element(a[h])).clone(), k.removeAttribute("rowSpan"), k.appendBogus(), c.append(k), k = k.$);
				h += k.colSpan - 1
			}
			d ? c.insertBefore(f) : c.insertAfter(f)
		}

		function u(e) {
			if (e instanceof CKEDITOR.dom.selection) {
				var d = t(e),
					b = d[0].getAscendant("table"),
					c = CKEDITOR.tools.buildTableMap(b);
				e = d[0].getParent().$.rowIndex;
				for (var d = d[d.length - 1], a = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [], f = e; f <= a; f++) {
					for (var g = c[f], h = new CKEDITOR.dom.element(b.$.rows[f]), k = 0; k < g.length; k++) {
						var l = new CKEDITOR.dom.element(g[k]),
							n = l.getParent().$.rowIndex;
						1 == l.$.rowSpan ? l.remove() : (--l.$.rowSpan, n == f && (n = c[f + 1], n[k - 1] ? l.insertAfter(new CKEDITOR.dom.element(n[k - 1])) : (new CKEDITOR.dom.element(b.$.rows[f + 1])).append(l, 1)));
						k += l.$.colSpan - 1
					}
					d.push(h)
				}
				c = b.$.rows;
				b = new CKEDITOR.dom.element(c[a + 1] || (0 < e ? c[e - 1] : null) || b.$.parentNode);
				for (f = d.length; 0 <= f; f--) u(d[f]);
				return b
			}
			e instanceof CKEDITOR.dom.element && (b = e.getAscendant("table"), 1 == b.$.rows.length ? b.remove() : e.remove());
			return null
		}

		function v(e, d) {
			for (var b = d ? Infinity : 0, c = 0; c < e.length; c++) {
				var a;
				a = e[c];
				for (var f = d, g = a.getParent().$.cells, h = 0, k = 0; k < g.length; k++) {
					var l = g[k],
						h = h + (f ? 1 : l.colSpan);
					if (l == a.$) break
				}
				a = h - 1;
				if (d ? a < b : a > b) b = a
			}
			return b
		}

		function m(e, d) {
			for (var b = t(e), c = b[0].getAscendant("table"), a = v(b, 1), b = v(b), a = d ? a : b, f = CKEDITOR.tools.buildTableMap(c), c = [], b = [], g = f.length, h = 0; h < g; h++) c.push(f[h][a]), b.push(d ? f[h][a - 1] : f[h][a + 1]);
			for (h = 0; h < g; h++) c[h] && (1 < c[h].colSpan && b[h] == c[h] ? (a = c[h], a.colSpan += 1) : (a = (new CKEDITOR.dom.element(c[h])).clone(), a.removeAttribute("colSpan"), a.appendBogus(), a[d ? "insertBefore" : "insertAfter"].call(a, new CKEDITOR.dom.element(c[h])), a = a.$), h += a.rowSpan - 1)
		}

		function y(e, d) {
			var b = e.getStartElement();
			if (b = b.getAscendant("td", 1) || b.getAscendant("th", 1)) {
				var c = b.clone();
				c.appendBogus();
				d ? c.insertBefore(b) : c.insertAfter(b)
			}
		}

		function x(e) {
			if (e instanceof CKEDITOR.dom.selection) {
				e = t(e);
				var d = e[0] && e[0].getAscendant("table"),
					b;
				a: {
					var c = 0;
					b = e.length - 1;
					for (var a = {}, f, g; f = e[c++];) CKEDITOR.dom.element.setMarker(a, f, "delete_cell", !0);
					for (c = 0; f = e[c++];) if ((g = f.getPrevious()) && !g.getCustomData("delete_cell") || (g = f.getNext()) && !g.getCustomData("delete_cell")) {
						CKEDITOR.dom.element.clearAllMarkers(a);
						b = g;
						break a
					}
					CKEDITOR.dom.element.clearAllMarkers(a);
					g = e[0].getParent();
					(g = g.getPrevious()) ? b = g.getLast() : (g = e[b].getParent(), b = (g = g.getNext()) ? g.getChild(0) : null)
				}
				for (g = e.length - 1; 0 <= g; g--) x(e[g]);
				b ? q(b, !0) : d && d.remove()
			} else e instanceof CKEDITOR.dom.element && (d = e.getParent(), 1 == d.getChildCount() ? d.remove() : e.remove())
		}

		function q(e, d) {
			var b = e.getDocument(),
				c = CKEDITOR.document;
			CKEDITOR.env.ie && 10 == CKEDITOR.env.version && (c.focus(), b.focus());
			b = new CKEDITOR.dom.range(b);
			b["moveToElementEdit" + (d ? "End" : "Start")](e) || (b.selectNodeContents(e), b.collapse(d ? !1 : !0));
			b.select(!0)
		}

		function z(e, d, b) {
			e = e[d];
			if ("undefined" == typeof b) return e;
			for (d = 0; e && d < e.length; d++) {
				if (b.is && e[d] == b.$) return d;
				if (d == b) return new CKEDITOR.dom.element(e[d])
			}
			return b.is ? -1 : null
		}

		function w(e, d, b) {
			var c = t(e),
				a;
			if ((d ? 1 != c.length : 2 > c.length) || (a = e.getCommonAncestor()) && a.type == CKEDITOR.NODE_ELEMENT && a.is("table")) return !1;
			var f;
			e = c[0];
			a = e.getAscendant("table");
			var g = CKEDITOR.tools.buildTableMap(a),
				h = g.length,
				k = g[0].length,
				l = e.getParent().$.rowIndex,
				n = z(g, l, e);
			if (d) {
				var r;
				try {
					var q = parseInt(e.getAttribute("rowspan"), 10) || 1;
					f = parseInt(e.getAttribute("colspan"), 10) || 1;
					r = g["up" == d ? l - q : "down" == d ? l + q : l]["left" == d ? n - f : "right" == d ? n + f : n]
				} catch (D) {
					return !1
				}
				if (!r || e.$ == r) return !1;
				c["up" == d || "left" == d ? "unshift" : "push"](new CKEDITOR.dom.element(r))
			}
			d = e.getDocument();
			var p = l,
				q = r = 0,
				u = !b && new CKEDITOR.dom.documentFragment(d),
				w = 0;
			for (d = 0; d < c.length; d++) {
				f = c[d];
				var m = f.getParent(),
					x = f.getFirst(),
					v = f.$.colSpan,
					y = f.$.rowSpan,
					m = m.$.rowIndex,
					A = z(g, m, f),
					w = w + v * y,
					q = Math.max(q, A - n + v);
				r = Math.max(r, m - l + y);
				b || (v = f, (y = v.getBogus()) && y.remove(), v.trim(), f.getChildren().count() && (m == p || !x || x.isBlockBoundary && x.isBlockBoundary({
					br: 1
				}) || (p = u.getLast(CKEDITOR.dom.walker.whitespaces(!0)), !p || p.is && p.is("br") || u.append("br")), f.moveChildren(u)), d ? f.remove() : f.setHtml(""));
				p = m
			}
			if (b) return r * q == w;
			u.moveChildren(e);
			e.appendBogus();
			q >= k ? e.removeAttribute("rowSpan") : e.$.rowSpan = r;
			r >= h ? e.removeAttribute("colSpan") : e.$.colSpan = q;
			b = new CKEDITOR.dom.nodeList(a.$.rows);
			c = b.count();
			for (d = c - 1; 0 <= d; d--) a = b.getItem(d), a.$.cells.length || (a.remove(), c++);
			return e
		}

		function A(e, d) {
			var b = t(e);
			if (1 < b.length) return !1;
			if (d) return !0;
			var b = b[0],
				c = b.getParent(),
				a = c.getAscendant("table"),
				f = CKEDITOR.tools.buildTableMap(a),
				g = c.$.rowIndex,
				h = z(f, g, b),
				k = b.$.rowSpan,
				l;
			if (1 < k) {
				l = Math.ceil(k / 2);
				for (var k = Math.floor(k / 2), c = g + l, a = new CKEDITOR.dom.element(a.$.rows[c]), f = z(f, c), n, c = b.clone(), g = 0; g < f.length; g++) if (n = f[g], n.parentNode == a.$ && g > h) {
					c.insertBefore(new CKEDITOR.dom.element(n));
					break
				} else n = null;
				n || a.append(c)
			} else for (k = l = 1, a = c.clone(), a.insertAfter(c), a.append(c = b.clone()), n = z(f, g), h = 0; h < n.length; h++) n[h].rowSpan++;
			c.appendBogus();
			b.$.rowSpan = l;
			c.$.rowSpan = k;
			1 == l && b.removeAttribute("rowSpan");
			1 == k && c.removeAttribute("rowSpan");
			return c
		}

		function B(e, d) {
			var b = t(e);
			if (1 < b.length) return !1;
			if (d) return !0;
			var b = b[0],
				c = b.getParent(),
				a = c.getAscendant("table"),
				a = CKEDITOR.tools.buildTableMap(a),
				f = z(a, c.$.rowIndex, b),
				g = b.$.colSpan;
			if (1 < g) c = Math.ceil(g / 2), g = Math.floor(g / 2);
			else {
				for (var g = c = 1, h = [], k = 0; k < a.length; k++) {
					var l = a[k];
					h.push(l[f]);
					1 < l[f].rowSpan && (k += l[f].rowSpan - 1)
				}
				for (a = 0; a < h.length; a++) h[a].colSpan++
			}
			a = b.clone();
			a.insertAfter(b);
			a.appendBogus();
			b.$.colSpan = c;
			a.$.colSpan = g;
			1 == c && b.removeAttribute("colSpan");
			1 == g && a.removeAttribute("colSpan");
			return a
		}
		var C = /^(?:td|th)$/;
		CKEDITOR.plugins.tabletools = {
			requires: "table,dialog,contextmenu",
			init: function(e) {
				function d(a) {
					return CKEDITOR.tools.extend(a || {}, {
						contextSensitive: 1,
						refresh: function(a, b) {
							this.setState(b.contains({
								td: 1,
								th: 1
							}, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
						}
					})
				}

				function b(a, b) {
					var c = e.addCommand(a, b);
					e.addFeature(c)
				}
				var c = e.lang.table;
				b("cellProperties", new CKEDITOR.dialogCommand("cellProperties", d({
					allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
					requiredContent: "table"
				})));
				CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
				b("rowDelete", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						q(u(a))
					}
				}));
				b("rowInsertBefore", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						p(a, !0)
					}
				}));
				b("rowInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						p(a)
					}
				}));
				b("columnDelete", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						a = t(a);
						var b = a[0],
							c = a[a.length - 1];
						a = b.getAscendant("table");
						for (var d = CKEDITOR.tools.buildTableMap(a), e, l, n = [], r = 0, p = d.length; r < p; r++) for (var m = 0, u = d[r].length; m < u; m++) d[r][m] == b.$ && (e = m), d[r][m] == c.$ && (l = m);
						for (r = e; r <= l; r++) for (m = 0; m < d.length; m++) c = d[m], b = new CKEDITOR.dom.element(a.$.rows[m]), c = new CKEDITOR.dom.element(c[r]), c.$ && (1 == c.$.colSpan ? c.remove() : --c.$.colSpan, m += c.$.rowSpan - 1, b.$.cells.length || n.push(b));
						l = a.$.rows[0] && a.$.rows[0].cells;
						e = new CKEDITOR.dom.element(l[e] || (e ? l[e - 1] : a.$.parentNode));
						n.length == p && a.remove();
						e && q(e, !0)
					}
				}));
				b("columnInsertBefore", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						m(a, !0)
					}
				}));
				b("columnInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						m(a)
					}
				}));
				b("cellDelete", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						x(a)
					}
				}));
				b("cellMerge", d({
					allowedContent: "td[colspan,rowspan]",
					requiredContent: "td[colspan,rowspan]",
					exec: function(a) {
						q(w(a.getSelection()), !0)
					}
				}));
				b("cellMergeRight", d({
					allowedContent: "td[colspan]",
					requiredContent: "td[colspan]",
					exec: function(a) {
						q(w(a.getSelection(), "right"), !0)
					}
				}));
				b("cellMergeDown", d({
					allowedContent: "td[rowspan]",
					requiredContent: "td[rowspan]",
					exec: function(a) {
						q(w(a.getSelection(), "down"), !0)
					}
				}));
				b("cellVerticalSplit", d({
					allowedContent: "td[rowspan]",
					requiredContent: "td[rowspan]",
					exec: function(a) {
						q(B(a.getSelection()))
					}
				}));
				b("cellHorizontalSplit", d({
					allowedContent: "td[colspan]",
					requiredContent: "td[colspan]",
					exec: function(a) {
						q(A(a.getSelection()))
					}
				}));
				b("cellInsertBefore", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						y(a, !0)
					}
				}));
				b("cellInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						y(a)
					}
				}));
				e.addMenuItems && e.addMenuItems({
					tablecell: {
						label: c.cell.menu,
						group: "tablecell",
						order: 1,
						getItems: function() {
							var a = e.getSelection(),
								b = t(a);
							return {
								tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecell_delete: CKEDITOR.TRISTATE_OFF,
								tablecell_merge: w(a, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_right: w(a, "right", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_down: w(a, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_vertical: B(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_horizontal: A(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_properties: 0 < b.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
							}
						}
					},
					tablecell_insertBefore: {
						label: c.cell.insertBefore,
						group: "tablecell",
						command: "cellInsertBefore",
						order: 5
					},
					tablecell_insertAfter: {
						label: c.cell.insertAfter,
						group: "tablecell",
						command: "cellInsertAfter",
						order: 10
					},
					tablecell_delete: {
						label: c.cell.deleteCell,
						group: "tablecell",
						command: "cellDelete",
						order: 15
					},
					tablecell_merge: {
						label: c.cell.merge,
						group: "tablecell",
						command: "cellMerge",
						order: 16
					},
					tablecell_merge_right: {
						label: c.cell.mergeRight,
						group: "tablecell",
						command: "cellMergeRight",
						order: 17
					},
					tablecell_merge_down: {
						label: c.cell.mergeDown,
						group: "tablecell",
						command: "cellMergeDown",
						order: 18
					},
					tablecell_split_horizontal: {
						label: c.cell.splitHorizontal,
						group: "tablecell",
						command: "cellHorizontalSplit",
						order: 19
					},
					tablecell_split_vertical: {
						label: c.cell.splitVertical,
						group: "tablecell",
						command: "cellVerticalSplit",
						order: 20
					},
					tablecell_properties: {
						label: c.cell.title,
						group: "tablecellproperties",
						command: "cellProperties",
						order: 21
					},
					tablerow: {
						label: c.row.menu,
						group: "tablerow",
						order: 1,
						getItems: function() {
							return {
								tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablerow_delete: CKEDITOR.TRISTATE_OFF
							}
						}
					},
					tablerow_insertBefore: {
						label: c.row.insertBefore,
						group: "tablerow",
						command: "rowInsertBefore",
						order: 5
					},
					tablerow_insertAfter: {
						label: c.row.insertAfter,
						group: "tablerow",
						command: "rowInsertAfter",
						order: 10
					},
					tablerow_delete: {
						label: c.row.deleteRow,
						group: "tablerow",
						command: "rowDelete",
						order: 15
					},
					tablecolumn: {
						label: c.column.menu,
						group: "tablecolumn",
						order: 1,
						getItems: function() {
							return {
								tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecolumn_delete: CKEDITOR.TRISTATE_OFF
							}
						}
					},
					tablecolumn_insertBefore: {
						label: c.column.insertBefore,
						group: "tablecolumn",
						command: "columnInsertBefore",
						order: 5
					},
					tablecolumn_insertAfter: {
						label: c.column.insertAfter,
						group: "tablecolumn",
						command: "columnInsertAfter",
						order: 10
					},
					tablecolumn_delete: {
						label: c.column.deleteColumn,
						group: "tablecolumn",
						command: "columnDelete",
						order: 15
					}
				});
				e.contextMenu && e.contextMenu.addListener(function(a, b, c) {
					return (a = c.contains({
						td: 1,
						th: 1
					}, 1)) && !a.isReadOnly() ? {
						tablecell: CKEDITOR.TRISTATE_OFF,
						tablerow: CKEDITOR.TRISTATE_OFF,
						tablecolumn: CKEDITOR.TRISTATE_OFF
					} : null
				})
			},
			getSelectedCells: t
		};
		CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
	})();
	CKEDITOR.tools.buildTableMap = function(t) {
		t = t.$.rows;
		for (var p = -1, u = [], v = 0; v < t.length; v++) {
			p++;
			!u[p] && (u[p] = []);
			for (var m = -1, y = 0; y < t[v].cells.length; y++) {
				var x = t[v].cells[y];
				for (m++; u[p][m];) m++;
				for (var q = isNaN(x.colSpan) ? 1 : x.colSpan, x = isNaN(x.rowSpan) ? 1 : x.rowSpan, z = 0; z < x; z++) {
					u[p + z] || (u[p + z] = []);
					for (var w = 0; w < q; w++) u[p + z][m + w] = t[v].cells[y]
				}
				m += q - 1
			}
		}
		return u
	};
	(function() {
		var g = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90],
			n = {
				8: 1,
				46: 1
			};
		CKEDITOR.plugins.add("undo", {
			init: function(a) {
				function b(a) {
					d.enabled && !1 !== a.data.command.canUndo && d.save()
				}

				function c() {
					d.enabled = a.readOnly ? !1 : "wysiwyg" == a.mode;
					d.onChange()
				}
				var d = a.undoManager = new e(a),
					l = d.editingHandler = new k(d),
					f = a.addCommand("undo", {
						exec: function() {
							d.undo() && (a.selectionChange(), this.fire("afterUndo"))
						},
						startDisabled: !0,
						canUndo: !1
					}),
					h = a.addCommand("redo", {
						exec: function() {
							d.redo() && (a.selectionChange(), this.fire("afterRedo"))
						},
						startDisabled: !0,
						canUndo: !1
					});
				a.setKeystroke([
					[g[0], "undo"],
					[g[1], "redo"],
					[g[2], "redo"]
				]);
				d.onChange = function() {
					f.setState(d.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
					h.setState(d.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
				};
				a.on("beforeCommandExec", b);
				a.on("afterCommandExec", b);
				a.on("saveSnapshot", function(a) {
					d.save(a.data && a.data.contentOnly)
				});
				a.on("contentDom", l.attachListeners, l);
				a.on("instanceReady", function() {
					a.fire("saveSnapshot")
				});
				a.on("beforeModeUnload", function() {
					"wysiwyg" == a.mode && d.save(!0)
				});
				a.on("mode", c);
				a.on("readOnly", c);
				a.ui.addButton && (a.ui.addButton("Undo", {
					label: a.lang.undo.undo,
					command: "undo",
					toolbar: "undo,10"
				}), a.ui.addButton("Redo", {
					label: a.lang.undo.redo,
					command: "redo",
					toolbar: "undo,20"
				}));
				a.resetUndo = function() {
					d.reset();
					a.fire("saveSnapshot")
				};
				a.on("updateSnapshot", function() {
					d.currentImage && d.update()
				});
				a.on("lockSnapshot", function(a) {
					a = a.data;
					d.lock(a && a.dontUpdate, a && a.forceUpdate)
				});
				a.on("unlockSnapshot", d.unlock, d)
			}
		});
		CKEDITOR.plugins.undo = {};
		var e = CKEDITOR.plugins.undo.UndoManager = function(a) {
				this.strokesRecorded = [0, 0];
				this.locked = null;
				this.previousKeyGroup = -1;
				this.limit = a.config.undoStackSize || 20;
				this.strokesLimit = 25;
				this.editor = a;
				this.reset()
			};
		e.prototype = {
			type: function(a, b) {
				var c = e.getKeyGroup(a),
					d = this.strokesRecorded[c] + 1;
				b = b || d >= this.strokesLimit;
				this.typing || (this.hasUndo = this.typing = !0, this.hasRedo = !1, this.onChange());
				b ? (d = 0, this.editor.fire("saveSnapshot")) : this.editor.fire("change");
				this.strokesRecorded[c] = d;
				this.previousKeyGroup = c
			},
			keyGroupChanged: function(a) {
				return e.getKeyGroup(a) != this.previousKeyGroup
			},
			reset: function() {
				this.snapshots = [];
				this.index = -1;
				this.currentImage = null;
				this.hasRedo = this.hasUndo = !1;
				this.locked = null;
				this.resetType()
			},
			resetType: function() {
				this.strokesRecorded = [0, 0];
				this.typing = !1;
				this.previousKeyGroup = -1
			},
			refreshState: function() {
				this.hasUndo = !! this.getNextImage(!0);
				this.hasRedo = !! this.getNextImage(!1);
				this.resetType();
				this.onChange()
			},
			save: function(a, b, c) {
				var d = this.editor;
				if (this.locked || "ready" != d.status || "wysiwyg" != d.mode) return !1;
				var e = d.editable();
				if (!e || "ready" != e.status) return !1;
				e = this.snapshots;
				b || (b = new f(d));
				if (!1 === b.contents) return !1;
				if (this.currentImage) if (b.equalsContent(this.currentImage)) {
					if (a || b.equalsSelection(this.currentImage)) return !1
				} else!1 !== c && d.fire("change");
				e.splice(this.index + 1, e.length - this.index - 1);
				e.length == this.limit && e.shift();
				this.index = e.push(b) - 1;
				this.currentImage = b;
				!1 !== c && this.refreshState();
				return !0
			},
			restoreImage: function(a) {
				var b = this.editor,
					c;
				a.bookmarks && (b.focus(), c = b.getSelection());
				this.locked = {
					level: 999
				};
				this.editor.loadSnapshot(a.contents);
				a.bookmarks ? c.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (c = this.editor.document.getBody().$.createTextRange(), c.collapse(!0), c.select());
				this.locked = null;
				this.index = a.index;
				this.currentImage = this.snapshots[this.index];
				this.update();
				this.refreshState();
				b.fire("change")
			},
			getNextImage: function(a) {
				var b = this.snapshots,
					c = this.currentImage,
					d;
				if (c) if (a) for (d = this.index - 1; 0 <= d; d--) {
					if (a = b[d], !c.equalsContent(a)) return a.index = d, a
				} else for (d = this.index + 1; d < b.length; d++) if (a = b[d], !c.equalsContent(a)) return a.index = d, a;
				return null
			},
			redoable: function() {
				return this.enabled && this.hasRedo
			},
			undoable: function() {
				return this.enabled && this.hasUndo
			},
			undo: function() {
				if (this.undoable()) {
					this.save(!0);
					var a = this.getNextImage(!0);
					if (a) return this.restoreImage(a), !0
				}
				return !1
			},
			redo: function() {
				if (this.redoable() && (this.save(!0), this.redoable())) {
					var a = this.getNextImage(!1);
					if (a) return this.restoreImage(a), !0
				}
				return !1
			},
			update: function(a) {
				if (!this.locked) {
					a || (a = new f(this.editor));
					for (var b = this.index, c = this.snapshots; 0 < b && this.currentImage.equalsContent(c[b - 1]);)--b;
					c.splice(b, this.index - b + 1, a);
					this.index = b;
					this.currentImage = a
				}
			},
			updateSelection: function(a) {
				if (!this.snapshots.length) return !1;
				var b = this.snapshots,
					c = b[b.length - 1];
				return c.equalsContent(a) && !c.equalsSelection(a) ? (this.currentImage = b[b.length - 1] = a, !0) : !1
			},
			lock: function(a, b) {
				if (this.locked) this.locked.level++;
				else if (a) this.locked = {
					level: 1
				};
				else {
					var c = null;
					if (b) c = !0;
					else {
						var d = new f(this.editor, !0);
						this.currentImage && this.currentImage.equalsContent(d) && (c = d)
					}
					this.locked = {
						update: c,
						level: 1
					}
				}
			},
			unlock: function() {
				if (this.locked && !--this.locked.level) {
					var a = this.locked.update;
					this.locked = null;
					if (!0 === a) this.update();
					else if (a) {
						var b = new f(this.editor, !0);
						a.equalsContent(b) || this.update()
					}
				}
			}
		};
		e.navigationKeyCodes = {
			37: 1,
			38: 1,
			39: 1,
			40: 1,
			36: 1,
			35: 1,
			33: 1,
			34: 1
		};
		e.keyGroups = {
			PRINTABLE: 0,
			FUNCTIONAL: 1
		};
		e.isNavigationKey = function(a) {
			return !!e.navigationKeyCodes[a]
		};
		e.getKeyGroup = function(a) {
			var b = e.keyGroups;
			return n[a] ? b.FUNCTIONAL : b.PRINTABLE
		};
		e.getOppositeKeyGroup = function(a) {
			var b = e.keyGroups;
			return a == b.FUNCTIONAL ? b.PRINTABLE : b.FUNCTIONAL
		};
		e.ieFunctionalKeysBug = function(a) {
			return CKEDITOR.env.ie && e.getKeyGroup(a) == e.keyGroups.FUNCTIONAL
		};
		var f = CKEDITOR.plugins.undo.Image = function(a, b) {
				this.editor = a;
				a.fire("beforeUndoImage");
				var c = a.getSnapshot();
				CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
				this.contents = c;
				b || (this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(!0));
				a.fire("afterUndoImage")
			},
			h = /\b(?:href|src|name)="[^"]*?"/gi;
		f.prototype = {
			equalsContent: function(a) {
				var b = this.contents;
				a = a.contents;
				CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) && (b = b.replace(h, ""), a = a.replace(h, ""));
				return b != a ? !1 : !0
			},
			equalsSelection: function(a) {
				var b = this.bookmarks;
				a = a.bookmarks;
				if (b || a) {
					if (!b || !a || b.length != a.length) return !1;
					for (var c = 0; c < b.length; c++) {
						var d = b[c],
							e = a[c];
						if (d.startOffset != e.startOffset || d.endOffset != e.endOffset || !CKEDITOR.tools.arrayCompare(d.start, e.start) || !CKEDITOR.tools.arrayCompare(d.end, e.end)) return !1
					}
				}
				return !0
			}
		};
		var k = CKEDITOR.plugins.undo.NativeEditingHandler = function(a) {
				this.undoManager = a;
				this.ignoreInputEvent = !1;
				this.keyEventsStack = new m;
				this.lastKeydownImage = null
			};
		k.prototype = {
			onKeydown: function(a) {
				var b = a.data.getKey();
				if (229 !== b) if (-1 < CKEDITOR.tools.indexOf(g, a.data.getKeystroke())) a.data.preventDefault();
				else if (this.keyEventsStack.cleanUp(a), a = this.undoManager, this.keyEventsStack.getLast(b) || this.keyEventsStack.push(b), this.lastKeydownImage = new f(a.editor), e.isNavigationKey(b) || this.undoManager.keyGroupChanged(b)) if (a.strokesRecorded[0] || a.strokesRecorded[1]) a.save(!1, this.lastKeydownImage, !1), a.resetType()
			},
			onInput: function() {
				if (this.ignoreInputEvent) this.ignoreInputEvent = !1;
				else {
					var a = this.keyEventsStack.getLast();
					a || (a = this.keyEventsStack.push(0));
					this.keyEventsStack.increment(a.keyCode);
					this.keyEventsStack.getTotalInputs() >= this.undoManager.strokesLimit && (this.undoManager.type(a.keyCode, !0), this.keyEventsStack.resetInputs())
				}
			},
			onKeyup: function(a) {
				var b = this.undoManager;
				a = a.data.getKey();
				var c = this.keyEventsStack.getTotalInputs();
				this.keyEventsStack.remove(a);
				if (!(e.ieFunctionalKeysBug(a) && this.lastKeydownImage && this.lastKeydownImage.equalsContent(new f(b.editor, !0)))) if (0 < c) b.type(a);
				else if (e.isNavigationKey(a)) this.onNavigationKey(!0)
			},
			onNavigationKey: function(a) {
				var b = this.undoManager;
				!a && b.save(!0, null, !1) || b.updateSelection(new f(b.editor));
				b.resetType()
			},
			ignoreInputEventListener: function() {
				this.ignoreInputEvent = !0
			},
			attachListeners: function() {
				var a = this.undoManager.editor,
					b = a.editable(),
					c = this;
				b.attachListener(b, "keydown", function(a) {
					c.onKeydown(a);
					if (e.ieFunctionalKeysBug(a.data.getKey())) c.onInput()
				}, null, null, 999);
				b.attachListener(b, CKEDITOR.env.ie ? "keypress" : "input", c.onInput, c, null, 999);
				b.attachListener(b, "keyup", c.onKeyup, c, null, 999);
				b.attachListener(b, "paste", c.ignoreInputEventListener, c, null, 999);
				b.attachListener(b, "drop", c.ignoreInputEventListener, c, null, 999);
				b.attachListener(b.isInline() ? b : a.document.getDocumentElement(), "click", function() {
					c.onNavigationKey()
				}, null, null, 999);
				b.attachListener(this.undoManager.editor, "blur", function() {
					c.keyEventsStack.remove(9)
				}, null, null, 999)
			}
		};
		var m = CKEDITOR.plugins.undo.KeyEventsStack = function() {
				this.stack = []
			};
		m.prototype = {
			push: function(a) {
				a = this.stack.push({
					keyCode: a,
					inputs: 0
				});
				return this.stack[a - 1]
			},
			getLastIndex: function(a) {
				if ("number" != typeof a) return this.stack.length - 1;
				for (var b = this.stack.length; b--;) if (this.stack[b].keyCode == a) return b;
				return -1
			},
			getLast: function(a) {
				a = this.getLastIndex(a);
				return -1 != a ? this.stack[a] : null
			},
			increment: function(a) {
				this.getLast(a).inputs++
			},
			remove: function(a) {
				a = this.getLastIndex(a); - 1 != a && this.stack.splice(a, 1)
			},
			resetInputs: function(a) {
				if ("number" == typeof a) this.getLast(a).inputs = 0;
				else for (a = this.stack.length; a--;) this.stack[a].inputs = 0
			},
			getTotalInputs: function() {
				for (var a = this.stack.length, b = 0; a--;) b += this.stack[a].inputs;
				return b
			},
			cleanUp: function(a) {
				a = a.data.$;
				a.ctrlKey || a.metaKey || this.remove(17);
				a.shiftKey || this.remove(16);
				a.altKey || this.remove(18)
			}
		}
	})();
	CKEDITOR.plugins.add("wsc", {
		requires: "dialog",
		parseApi: function(a) {
			a.config.wsc_onFinish = "function" === typeof a.config.wsc_onFinish ? a.config.wsc_onFinish : function() {};
			a.config.wsc_onClose = "function" === typeof a.config.wsc_onClose ? a.config.wsc_onClose : function() {}
		},
		parseConfig: function(a) {
			a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
			a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds || CKEDITOR.config.wsc_customDictionaryIds || "";
			a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "";
			a.config.wsc_customLoaderScript = a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript;
			CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
			CKEDITOR.config.wsc_version = "v4.3.0-master-d769233";
			CKEDITOR.config.wsc_removeGlobalVariable = !0
		},
		init: function(a) {
			var b = CKEDITOR.env;
			this.parseConfig(a);
			this.parseApi(a);
			a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = {
				wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname && !(b.ie && (8 > b.version || b.quirks))
			};
			"undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", {
				label: a.lang.wsc.toolbar,
				click: function(a) {
					var b = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
					(b = b.replace(/\s/g, "")) ? a.execCommand("checkspell") : alert("Nothing to check!")
				},
				toolbar: "spellchecker,10"
			});
			CKEDITOR.dialog.add("checkspell", this.path + (CKEDITOR.env.ie && 7 >= CKEDITOR.env.version ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
		}
	});
	CKEDITOR.config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';
	CKEDITOR.config.skin = 'moono';
	(function() {
		var setIcons = function(icons, strip) {
				var path = CKEDITOR.getUrl('plugins/' + strip);
				icons = icons.split(',');
				for (var i = 0; i < icons.length; i++) CKEDITOR.skin.icons[icons[i]] = {
					path: path,
					offset: -icons[++i],
					bgsize: icons[++i]
				};
			};
		if (CKEDITOR.env.hidpi) setIcons('about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,bidiltr,168,,bidirtl,192,,blockquote,216,,copy-rtl,240,,copy,264,,cut-rtl,288,,cut,312,,paste-rtl,336,,paste,360,,bgcolor,384,,textcolor,408,,templates-rtl,432,,templates,456,,creatediv,480,,find-rtl,504,,find,528,,replace,552,,flash,576,,button,600,,checkbox,624,,form,648,,hiddenfield,672,,imagebutton,696,,radio,720,,select-rtl,744,,select,768,,textarea-rtl,792,,textarea,816,,textfield-rtl,840,,textfield,864,,horizontalrule,888,,iframe,912,,image,936,,indent-rtl,960,,indent,984,,outdent-rtl,1008,,outdent,1032,,smiley,1056,,justifyblock,1080,,justifycenter,1104,,justifyleft,1128,,justifyright,1152,,language,1176,,anchor-rtl,1200,,anchor,1224,,link,1248,,unlink,1272,,bulletedlist-rtl,1296,,bulletedlist,1320,,numberedlist-rtl,1344,,numberedlist,1368,,maximize,1392,,newpage-rtl,1416,,newpage,1440,,pagebreak-rtl,1464,,pagebreak,1488,,pastetext-rtl,1512,,pastetext,1536,,pastefromword-rtl,1560,,pastefromword,1584,,preview-rtl,1608,,preview,1632,,print,1656,,removeformat,1680,,save,1704,,selectall,1728,,showblocks-rtl,1752,,showblocks,1776,,source-rtl,1800,,source,1824,,specialchar,1848,,scayt,1872,,table,1896,,redo-rtl,1920,,redo,1944,,undo-rtl,1968,,undo,1992,,spellchecker,2016,', 'icons_hidpi.png');
		else setIcons('about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,bidiltr,168,auto,bidirtl,192,auto,blockquote,216,auto,copy-rtl,240,auto,copy,264,auto,cut-rtl,288,auto,cut,312,auto,paste-rtl,336,auto,paste,360,auto,bgcolor,384,auto,textcolor,408,auto,templates-rtl,432,auto,templates,456,auto,creatediv,480,auto,find-rtl,504,auto,find,528,auto,replace,552,auto,flash,576,auto,button,600,auto,checkbox,624,auto,form,648,auto,hiddenfield,672,auto,imagebutton,696,auto,radio,720,auto,select-rtl,744,auto,select,768,auto,textarea-rtl,792,auto,textarea,816,auto,textfield-rtl,840,auto,textfield,864,auto,horizontalrule,888,auto,iframe,912,auto,image,936,auto,indent-rtl,960,auto,indent,984,auto,outdent-rtl,1008,auto,outdent,1032,auto,smiley,1056,auto,justifyblock,1080,auto,justifycenter,1104,auto,justifyleft,1128,auto,justifyright,1152,auto,language,1176,auto,anchor-rtl,1200,auto,anchor,1224,auto,link,1248,auto,unlink,1272,auto,bulletedlist-rtl,1296,auto,bulletedlist,1320,auto,numberedlist-rtl,1344,auto,numberedlist,1368,auto,maximize,1392,auto,newpage-rtl,1416,auto,newpage,1440,auto,pagebreak-rtl,1464,auto,pagebreak,1488,auto,pastetext-rtl,1512,auto,pastetext,1536,auto,pastefromword-rtl,1560,auto,pastefromword,1584,auto,preview-rtl,1608,auto,preview,1632,auto,print,1656,auto,removeformat,1680,auto,save,1704,auto,selectall,1728,auto,showblocks-rtl,1752,auto,showblocks,1776,auto,source-rtl,1800,auto,source,1824,auto,specialchar,1848,auto,scayt,1872,auto,table,1896,auto,redo-rtl,1920,auto,redo,1944,auto,undo-rtl,1968,auto,undo,1992,auto,spellchecker,2016,auto', 'icons.png');
	})();
	CKEDITOR.lang.languages = {
		"af": 1,
		"sq": 1,
		"ar": 1,
		"eu": 1,
		"bn": 1,
		"bs": 1,
		"bg": 1,
		"ca": 1,
		"zh-cn": 1,
		"zh": 1,
		"hr": 1,
		"cs": 1,
		"da": 1,
		"nl": 1,
		"en": 1,
		"en-au": 1,
		"en-ca": 1,
		"en-gb": 1,
		"eo": 1,
		"et": 1,
		"fo": 1,
		"fi": 1,
		"fr": 1,
		"fr-ca": 1,
		"gl": 1,
		"ka": 1,
		"de": 1,
		"de-ch": 1,
		"el": 1,
		"gu": 1,
		"he": 1,
		"hi": 1,
		"hu": 1,
		"is": 1,
		"id": 1,
		"it": 1,
		"ja": 1,
		"km": 1,
		"ko": 1,
		"ku": 1,
		"lv": 1,
		"lt": 1,
		"mk": 1,
		"ms": 1,
		"mn": 1,
		"no": 1,
		"nb": 1,
		"fa": 1,
		"pl": 1,
		"pt-br": 1,
		"pt": 1,
		"ro": 1,
		"ru": 1,
		"sr": 1,
		"sr-latn": 1,
		"si": 1,
		"sk": 1,
		"sl": 1,
		"es": 1,
		"sv": 1,
		"tt": 1,
		"th": 1,
		"tr": 1,
		"ug": 1,
		"uk": 1,
		"vi": 1,
		"cy": 1
	};
}());