import { BinaryObject, BinaryReaderStarvationError, BinaryWriter } from "./";
import { BitReader } from "./bitReader";

export class BinaryReader {
  static from(buffer: Buffer | DataView | ArrayBuffer | BinaryWriter): BinaryReader {
    if (buffer instanceof ArrayBuffer)
      return new BinaryReader(buffer);

    if (buffer instanceof BinaryWriter)
      return this.from(buffer.getBuffer());

    return this.from(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  }

  protected constructor(bufferIn: ArrayBuffer) {
    this.buffer = new DataView(bufferIn);
  }

  protected buffer: DataView;
  protected readHead: number = 0;

  private incrHead(value: number): number {
    if (!this.hasBytesLeftToRead(value - 1))
      throw new BinaryReaderStarvationError(value);

    const temp = this.readHead;
    this.readHead += value;
    return temp;
  }

  private incrHeadRange(value: number): [ number, number ] {
    if (!this.hasBytesLeftToRead(value - 1))
      throw new BinaryReaderStarvationError(value);

    const temp = this.readHead;
    this.readHead += value;
    return [temp, this.readHead];
  }

  createBitReader() {
    return new BitReader(this);
  }

  getBuffer() {
    return this.buffer;
  }

  getRemainingBuffer() {
    return this.buffer.buffer.slice(this.readHead)
  }

  clone() {
    return BinaryReader.from(this.getBuffer());
  }

  hasBytesLeftToRead(plus: number = 0): boolean { return (this.readHead + plus) < this.buffer.byteLength }

  countRemainingBytes() { return this.buffer.byteLength - this.readHead }

  readBoolean(): boolean { return this.readUInt8() !== 0 }

  readSInt8(): number { return this.buffer.getInt8(this.incrHead(1)) }
  readUInt8(): number { return this.buffer.getUint8(this.incrHead(1)) }
  readSInt16LE(): number { return this.buffer.getInt16(this.incrHead(2), true) }
  readUInt16LE(): number { return this.buffer.getUint16(this.incrHead(2), true) }
  readSInt16BE(): number { return this.buffer.getInt16(this.incrHead(2), false) }
  readUInt16BE(): number { return this.buffer.getUint16(this.incrHead(2), false) }

  /**
   * WARNING: SLOW. No native call for reading UInt24s.
   */
  readUInt24BE(): number {
    return (this.readUInt8() << 16) | (this.readUInt8() << 8) | this.readUInt8();
  }

  /**
   * WARNING: SLOW. No native call for reading SInt24s.
   */
  readSInt24BE(): number {
    const val = this.readUInt24BE();
    const neg = val & 0x80_00_00;

    if (!neg)
      return val;

    return (0xFF_FF_FF - val + 1) * -1;
  }

  /**
   * WARNING: SLOW. No native call for reading UInt24s.
   */
  readUInt24LE(): number {
    return this.readUInt8() | (this.readUInt8() << 8) | (this.readUInt8() << 16);
  }

  /**
   * WARNING: SLOW. No native call for reading SInt24s.
   */
  readSInt24LE(): number {
    const val = this.readUInt24LE();
    const neg = val & 0x80_00_00;

    if (!neg)
      return val;

    return (0xFF_FF_FF - val + 1) * -1;
  }

  readSInt32LE(): number { return this.buffer.getInt32(this.incrHead(4), true) }
  readUInt32LE(): number { return this.buffer.getUint32(this.incrHead(4), true) }
  readSInt32BE(): number { return this.buffer.getInt32(this.incrHead(4), false) }
  readUInt32BE(): number { return this.buffer.getUint32(this.incrHead(4), false) }

  /**
   * WARNING: SLOW. No native call for reading UInt48s.
   */
  readUInt48BE(): number {
    return (this.readUInt24BE() * 0x1000000) + this.readUInt24BE();
  }

  /**
   * WARNING: SLOW. No native call for reading SInt48s.
   */
  readSInt48BE(): number {
    const val = this.readUInt48BE();
    const neg = val >= 0x800000_000000;

    if (!neg)
      return val;

    return (0xFFFFFF_FFFFFF - val + 1) * -1;
  }

  /**
   * WARNING: SLOW. No native call for reading UInt48s.
   */
  readUInt48LE(): number {
    let binary = this.readUInt8();
    binary |= this.readUInt8() << 8;
    binary |= this.readUInt8() << 16;
    binary |= this.readUInt8() << 24;
    binary >>>= 0;
    binary += this.readUInt8() * 0x100000000;
    binary += this.readUInt8() * 0x10000000000;
    return binary;
  }

  /**
   * WARNING: SLOW. No native call for reading SInt48s.
   */
  readSInt48LE(): number {
    const val = this.readUInt48LE();
    const neg = val >= 0x800000_000000;

    if (!neg)
      return val;

    return (0xFFFFFF_FFFFFF - val + 1) * -1;
  }

  readFloat32LE(): number { return this.buffer.getFloat32(this.incrHead(4), true) }
  readFloat32BE(): number { return this.buffer.getFloat32(this.incrHead(4), false) }
  readFloat64LE(): number { return this.buffer.getFloat64(this.incrHead(8), true) }
  readFloat64BE(): number { return this.buffer.getFloat64(this.incrHead(8), false) }

  readUFixed16LE() { return this.readUInt16LE() / 2 ** 8 }
  readUFixed16BE() { return this.readUInt16BE() / 2 ** 8 }
  readSFixed16LE() { return this.readSInt16LE() / 2 ** 8 }
  readSFixed16BE() { return this.readSInt16BE() / 2 ** 8 }

  readUFixed32LE() { return this.readUInt32LE() / 2 ** 16 }
  readUFixed32BE() { return this.readUInt32BE() / 2 ** 16 }
  readSFixed32LE() { return this.readSInt32LE() / 2 ** 16 }
  readSFixed32BE() { return this.readSInt32BE() / 2 ** 16 }

  readPackedSInt32(): number {
    let readMore = true;
    let shift = 0;
    let output = 0;

    while (readMore) {
      let next = this.readUInt8();

      readMore = (next & 0x80) !== 0;
      if (readMore) 
        next &= 0x7f;

      output |= (next << shift);
      shift += 7;

      if (shift == 35) break;
    }

    return output;
  }

  readPackedUInt32(): number { return this.readPackedSInt32() >>> 0 }

  readUInt30(): number {
    return this.readPackedUInt32() & 0x3FFF_FFFF;
  }

  readSInt29(): number {
    let readMore = true;
    let shift = 0;
    let output = 0;

    while (readMore) {
      let next = this.readUInt8();

      readMore = (next & 0x80) !== 0 && shift !== 35;
      if (readMore)
        next &= 0x7f;

      output <<= 7;
      output |= next;
      shift += 7;
    }

    return output;
  }

  readUInt29(): number { return this.readSInt29() >>> 0 }

  readBytes(length: number) { return BinaryReader.from(this.buffer.buffer.slice(...this.incrHeadRange(length))) }

  readNTString(): string {
    let count = 0;
    
    while (this.buffer.getUint8(this.readHead + count) != 0x00)
      count++;

    const str = this.readString(count);

    this.incrHead(1);

    return str;
  }

  readString(length: number): string { return new TextDecoder().decode(this.readBytes(length).getBuffer().buffer) }

  read<T extends BinaryObject<any, any> | ((reader: BinaryReader, ...args: any[]) => any)>(object: T, ...args: T extends BinaryObject<any, infer ArgT> ? ArgT : T extends (arg0: any, ...args: infer ArgT) => any ? ArgT : []): T extends BinaryObject<infer Type, any> ? Type : T extends (...args: any[]) => infer Type ? Type : never { return "deserialize" in object ? object.deserialize(this, ...(args as any)) : object(this, ...(args as any)) }

  *readRemaining<T extends BinaryObject<any, any> | ((reader: BinaryReader, ...args: any[]) => any)>(object: T, ...args: T extends BinaryObject<any, infer ArgT> ? ArgT : T extends (arg0: any, ...args: infer ArgT) => any ? ArgT : []): Generator<T extends BinaryObject<infer Type, any> ? Type : T extends (...args: any[]) => infer Type ? Type : never> {
    while (this.hasBytesLeftToRead()) {
      yield this.read(object, ...args);
    }
  }

  *readUntil<T extends BinaryObject<any, any> | ((reader: BinaryReader, ...args: any[]) => any)>(object: T, condition: (count: number) => (boolean | ((v: T extends BinaryObject<infer Type, any> ? Type : T extends (...args: any[]) => infer Type ? Type : never) => boolean)), ...args: T extends BinaryObject<any, infer ArgT> ? ArgT : T extends (arg0: any, ...args: infer ArgT) => any ? ArgT : []): Generator<T extends BinaryObject<infer Type, any> ? Type : T extends (...args: any[]) => infer Type ? Type : never> {
    let next: boolean | ((v: any) => boolean);

    let c = 0;

    while (next = condition(c)) {
      c++;

      const value = this.read(object, ...args);

      if (typeof next !== "function") {
        yield value;
        continue;
      }

      if (!next(value))
        break;

      yield value;
    }
  }

  readArray<T extends BinaryObject<any, any> | ((reader: BinaryReader, ...args: any[]) => any)>(count: number, object: T, ...args: T extends BinaryObject<any, infer ArgT> ? ArgT : T extends (arg0: any, ...args: infer ArgT) => any ? ArgT : []): (T extends BinaryObject<infer Type, any> ? Type : T extends (...args: any[]) => infer Type ? Type : never)[] {
    let arr = new Array(count);

    for (let i = 0; i < count; i++) {
      arr[i] = this.read(object, ...args);
    }

    return arr;
  }
}
