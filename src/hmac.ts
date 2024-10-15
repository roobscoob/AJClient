import crypto from "node:crypto";

export class SHA256 {
  protected static k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  protected static h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  protected static rrol(num: number, cnt: number): number {
    return (num << (32 - cnt)) | (num >>> cnt);
  }

  static core(x: number[], len: number): number[] {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w: number[] = [];
    var a: number = this.h[0];
    var b: number = this.h[1];
    var c: number = this.h[2];
    var d: number = this.h[3];
    var e: number = this.h[4];
    var f: number = this.h[5];
    var g: number = this.h[6];
    var h: number = this.h[7];

    for (var i: number = 0; i < x.length; i += 16) {
      var olda: number = a;
      var oldb: number = b;
      var oldc: number = c;
      var oldd: number = d;
      var olde: number = e;
      var oldf: number = f;
      var oldg: number = g;
      var oldh: number = h;

      for (var j: number = 0; j < 64; j++) {
        if (j < 16) {
          w[j] = x[i + j] || 0;
        } else {
          var s0: number = this.rrol(w[j - 15], 7) ^ this.rrol(w[j - 15], 18) ^ (w[j - 15] >>> 3);
          var s1: number = this.rrol(w[j - 2], 17) ^ this.rrol(w[j - 2], 19) ^ (w[j - 2] >>> 10);
          w[j] = w[j - 16] + s0 + w[j - 7] + s1;
        }
        var t2: number = (this.rrol(a, 2) ^ this.rrol(a, 13) ^ this.rrol(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));
        var t1: number = h + (this.rrol(e, 6) ^ this.rrol(e, 11) ^ this.rrol(e, 25)) + ((e & f) ^ (g & ~e)) + this.k[j] + w[j];
        h = g;
        g = f;
        f = e;
        e = d + t1;
        d = c;
        c = b;
        b = a;
        a = t1 + t2;

      }
      a += olda;
      b += oldb;
      c += oldc;
      d += oldd;
      e += olde;
      f += oldf;
      g += oldg;
      h += oldh;
    }
    return [a, b, c, d, e, f, g, h];
  }

  static hash(src: ArrayBuffer): ArrayBuffer {
    // const u8src = new Uint8Array(src);

    // var savedLength: number = u8src.length;
    // var len: number = savedLength * 8;

    // const difference = Buffer.alloc(savedLength + (u8src.length % 4));
    // difference.fill(0);
    // new Uint8Array(difference.buffer.slice(difference.byteOffset, difference.byteLength)).set(u8src);

    // const a = new Uint32Array(difference.buffer.slice(difference.byteOffset, difference.byteLength));

    // var h = new Uint32Array(this.core(Array.from(a), len));

    // return h.buffer

    const buf = crypto.createHash("sha256").update(Buffer.from(src)).digest();

    return buf.buffer.slice(buf.byteOffset, buf.byteLength);
  }
}

export class HMAC {
  public static compute(key: ArrayBuffer, data: ArrayBuffer): ArrayBuffer {
    let hashKey: ArrayBuffer;
    const keyu8 = new Uint8Array(key);

    if (keyu8.length > 64) {
      const k = Buffer.alloc(64);
      k.fill(0);
      new Uint8Array(k.buffer.slice(k.byteOffset, k.byteLength)).set(new Uint8Array(SHA256.hash(key)));
      hashKey = k.buffer.slice(k.byteOffset, k.byteLength);
    } else {
      const k = Buffer.alloc(64);
      k.fill(0);
      new Uint8Array(k.buffer.slice(k.byteOffset, k.byteLength)).set(keyu8);
      hashKey = k.buffer.slice(k.byteOffset, k.byteLength);
    }

    const hashKeyu8 = new Uint8Array(hashKey);

    const innerKey: Buffer = Buffer.alloc(64 + data.byteLength);
    const outerKey: Buffer = Buffer.alloc(64 + data.byteLength);

    for (let i: number = 0; i < 64; i++) {
      innerKey[i] = hashKeyu8[i] ^ 0x36;
      outerKey[i] = hashKeyu8[i] ^ 0x5c;
    }

    // inner + data
    new Uint8Array(innerKey.buffer.slice(innerKey.byteOffset + 64)).set(new Uint8Array(data));
    const innerHash = SHA256.hash(innerKey);

    // outer + innerHash
    new Uint8Array(innerKey.buffer.slice(outerKey.byteOffset + 64)).set(new Uint8Array(innerHash));
    const outerHash = SHA256.hash(outerKey);

    return outerHash;
  }
}
