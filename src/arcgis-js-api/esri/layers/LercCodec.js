//>>built
define([], function() {
    var J = {
            defaultNoDataValue: -3.4027999387901484E38,
            decode: function(f, q) {
                var z;
                q = q || {};
                var c = q.inputOffset || 0,
                    k = q.encodedMaskData || null === q.encodedMaskData,
                    a = {},
                    h = new Uint8Array(f, c, 10);
                a.fileIdentifierString = String.fromCharCode.apply(null, h);
                if ("CntZImage" != a.fileIdentifierString.trim()) throw "Unexpected file identifier string: " + a.fileIdentifierString;
                var c = c + 10,
                    b = new DataView(f, c, 24);
                a.fileVersion = b.getInt32(0, !0);
                a.imageType = b.getInt32(4, !0);
                a.height = b.getUint32(8, !0);
                a.width =
                    b.getUint32(12, !0);
                a.maxZError = b.getFloat64(16, !0);
                c += 24;
                if (!k)
                    if (b = new DataView(f, c, 16), a.mask = {}, a.mask.numBlocksY = b.getUint32(0, !0), a.mask.numBlocksX = b.getUint32(4, !0), a.mask.numBytes = b.getUint32(8, !0), a.mask.maxValue = b.getFloat32(12, !0), c += 16, 0 < a.mask.numBytes) {
                        var k = new Uint8Array(Math.ceil(a.width * a.height / 8)),
                            b = new DataView(f, c, a.mask.numBytes),
                            h = b.getInt16(0, !0),
                            l = 2,
                            w = 0;
                        do {
                            if (0 < h)
                                for (; h--;) k[w++] = b.getUint8(l++);
                            else
                                for (var x = b.getUint8(l++), h = -h; h--;) k[w++] = x;
                            h = b.getInt16(l, !0);
                            l += 2
                        } while (l <
                            a.mask.numBytes);
                        if (-32768 !== h || w < k.length) throw "Unexpected end of mask RLE encoding";
                        a.mask.bitset = k;
                        c += a.mask.numBytes
                    } else 0 == (a.mask.numBytes | a.mask.numBlocksY | a.mask.maxValue) && (k = new Uint8Array(Math.ceil(a.width * a.height / 8)), a.mask.bitset = k);
                b = new DataView(f, c, 16);
                a.pixels = {};
                a.pixels.numBlocksY = b.getUint32(0, !0);
                a.pixels.numBlocksX = b.getUint32(4, !0);
                a.pixels.numBytes = b.getUint32(8, !0);
                a.pixels.maxValue = b.getFloat32(12, !0);
                c += 16;
                k = a.pixels.numBlocksX;
                h = a.pixels.numBlocksY;
                k += 0 < a.width % k ? 1 : 0;
                h += 0 < a.height % h ? 1 : 0;
                a.pixels.blocks = Array(k * h);
                l = 1E9;
                for (x = w = 0; x < h; x++)
                    for (var A = 0; A < k; A++) {
                        var d = 0,
                            b = new DataView(f, c, Math.min(10, f.byteLength - c)),
                            g = {};
                        a.pixels.blocks[w++] = g;
                        var e = b.getUint8(0);
                        d++;
                        g.encoding = e & 63;
                        if (3 < g.encoding) throw "Invalid block encoding (" + g.encoding + ")";
                        if (2 === g.encoding) c++, l = Math.min(l, 0);
                        else {
                            if (0 !== e && 2 !== e) {
                                e >>= 6;
                                g.offsetType = e;
                                if (2 === e) g.offset = b.getInt8(1), d++;
                                else if (1 === e) g.offset = b.getInt16(1, !0), d += 2;
                                else if (0 === e) g.offset = b.getFloat32(1, !0), d += 4;
                                else throw "Invalid block offset type";
                                l = Math.min(g.offset, l);
                                if (1 === g.encoding)
                                    if (e = b.getUint8(d), d++, g.bitsPerPixel = e & 63, e >>= 6, g.numValidPixelsType = e, 2 === e) g.numValidPixels = b.getUint8(d), d++;
                                    else if (1 === e) g.numValidPixels = b.getUint16(d, !0), d += 2;
                                else if (0 === e) g.numValidPixels = b.getUint32(d, !0), d += 4;
                                else throw "Invalid valid pixel count type";
                            }
                            c += d;
                            if (3 != g.encoding)
                                if (0 === g.encoding) {
                                    b = (a.pixels.numBytes - 1) / 4;
                                    if (b !== Math.floor(b)) throw "uncompressed block has invalid length";
                                    d = new ArrayBuffer(4 * b);
                                    e = new Uint8Array(d);
                                    e.set(new Uint8Array(f,
                                        c, 4 * b));
                                    d = new Float32Array(d);
                                    for (e = 0; e < d.length; e++) l = Math.min(l, d[e]);
                                    g.rawData = d;
                                    c += 4 * b
                                } else 1 === g.encoding && (b = Math.ceil(g.numValidPixels * g.bitsPerPixel / 8), d = Math.ceil(b / 4), d = new ArrayBuffer(4 * d), e = new Uint8Array(d), e.set(new Uint8Array(f, c, b)), g.stuffedData = new Uint32Array(d), c += b)
                        }
                    }
                a.pixels.minValue = l;
                a.eofOffset = c;
                var c = null != q.noDataValue ? q.noDataValue : J.defaultNoDataValue,
                    h = q.encodedMaskData,
                    d = q.returnMask,
                    l = 0,
                    w = a.pixels.numBlocksX,
                    x = a.pixels.numBlocksY,
                    A = Math.floor(a.width / w),
                    g = Math.floor(a.height /
                        x),
                    b = 2 * a.maxZError,
                    h = h || (a.mask ? a.mask.bitset : null),
                    s, k = new(q.pixelType || Float32Array)(a.width * a.height);
                d && h && (s = new Uint8Array(a.width * a.height));
                for (var d = new Float32Array(A * g), t, v, e = 0; e <= x; e++) {
                    var F = e !== x ? g : a.height % x;
                    if (0 !== F)
                        for (var G = 0; G <= w; G++) {
                            var C = G !== w ? A : a.width % w;
                            if (0 !== C) {
                                var m = e * a.width * g + G * A,
                                    H = a.width - C,
                                    r = a.pixels.blocks[l],
                                    n, p;
                                if (2 > r.encoding) {
                                    if (0 === r.encoding) n = r.rawData;
                                    else {
                                        n = r.stuffedData;
                                        p = r.bitsPerPixel;
                                        t = r.numValidPixels;
                                        v = r.offset;
                                        var L = b,
                                            M = d,
                                            I = (1 << p) - 1,
                                            K = 0,
                                            B = void 0,
                                            u =
                                            0,
                                            D = void 0,
                                            E = void 0,
                                            B = 4 * n.length - Math.ceil(p * t / 8);
                                        n[n.length - 1] <<= 8 * B;
                                        for (B = 0; B < t; B++) 0 === u && (E = n[K++], u = 32), u >= p ? (D = E >>> u - p & I, u -= p) : (u = p - u, D = (E & I) << u & I, E = n[K++], u = 32 - u, D += E >>> u), M[B] = v + D * L;
                                        n = d
                                    }
                                    p = 0
                                } else z = 2 === r.encoding ? 0 : r.offset;
                                var y;
                                if (h)
                                    for (v = 0; v < F; v++) {
                                        m & 7 && (y = h[m >> 3], y <<= m & 7);
                                        for (t = 0; t < C; t++) m & 7 || (y = h[m >> 3]), y & 128 ? (s && (s[m] = 1), k[m++] = 2 > r.encoding ? n[p++] : z) : (s && (s[m] = 0), k[m++] = c), y <<= 1;
                                        m += H
                                    } else if (2 > r.encoding)
                                        for (v = 0; v < F; v++) {
                                            for (t = 0; t < C; t++) k[m++] = n[p++];
                                            m += H
                                        } else
                                            for (v = 0; v < F; v++) {
                                                for (t =
                                                    0; t < C; t++) k[m++] = z;
                                                m += H
                                            }
                                    if (1 === r.encoding && p !== r.numValidPixels) throw "Block and Mask do not match";
                                l++
                            }
                        }
                }
                z = s;
                s = {
                    width: a.width,
                    height: a.height,
                    pixelData: k,
                    minValue: a.pixels.minValue,
                    maxValue: a.pixels.maxValue,
                    noDataValue: c
                };
                z && (s.maskData = z);
                q.returnEncodedMask && a.mask && (s.encodedMaskData = a.mask.bitset ? a.mask.bitset : null);
                if (q.returnFileInfo && (s.fileInfo = N(a), q.computeUsedBitDepths)) {
                    z = s.fileInfo;
                    y = a.pixels.numBlocksX * a.pixels.numBlocksY;
                    n = {};
                    for (p = 0; p < y; p++) c = a.pixels.blocks[p], 0 === c.encoding ? n.float32 = !0 : 1 === c.encoding ? n[c.bitsPerPixel] = !0 : n[0] = !0;
                    a = Object.keys(n);
                    z.bitDepths = a
                }
                return s
            }
        },
        N = function(f) {
            return {
                fileIdentifierString: f.fileIdentifierString,
                fileVersion: f.fileVersion,
                imageType: f.imageType,
                height: f.height,
                width: f.width,
                maxZError: f.maxZError,
                eofOffset: f.eofOffset,
                mask: f.mask ? {
                    numBlocksX: f.mask.numBlocksX,
                    numBlocksY: f.mask.numBlocksY,
                    numBytes: f.mask.numBytes,
                    maxValue: f.mask.maxValue
                } : null,
                pixels: {
                    numBlocksX: f.pixels.numBlocksX,
                    numBlocksY: f.pixels.numBlocksY,
                    numBytes: f.pixels.numBytes,
                    maxValue: f.pixels.maxValue,
                    minValue: f.pixels.minValue,
                    noDataValue: this.noDataValue
                }
            }
        };
    return J
});