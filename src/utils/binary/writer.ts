import { BinaryObjectInstance, BinaryReader } from ".";

export class BinaryWriter {
  static allocate(size: number): BinaryWriter {
    return new BinaryWriter(new ArrayBuffer(size));
  }

  protected constructor(bufferIn: ArrayBuffer) {
    this.buffer = new DataView(bufferIn);
  }

  protected buffer: DataView;
  protected writeHead: number = 0;

  private realloc(newSize: number) {
    if (newSize === this.buffer.byteLength) return;

    const oldBuffer = this.buffer;
    const newBuffer = this.buffer = new DataView(new ArrayBuffer(newSize));

    new Uint8Array(newBuffer.buffer).set(new Uint8Array(oldBuffer.buffer.slice(0, newSize)));
  }

  private truncate() {
    this.realloc(this.writeHead);
  }

  private incrHead(value: number): number {
    while (!this.hasBytesLeftToWrite(value - 1))
      this.realloc(value + this.buffer.byteLength > this.buffer.byteLength * 2 ? value + this.buffer.byteLength : this.buffer.byteLength * 2);

    const temp = this.writeHead;
    this.writeHead += value;
    if (temp === 0x1138F9) {
      debugger;
    }
    return temp;
  }

  private hasBytesLeftToWrite(plus: number = 0): boolean { return (this.writeHead + plus) < this.buffer.byteLength }

  getBuffer() {
    this.truncate();

    return this.buffer;
  }

  getReader() {
    return BinaryReader.from(this);
  }

  writeBoolean(boolean: boolean) { this.writeUInt8(boolean ? 1 : 0) }

  writeSInt8(value: number) { this.buffer.setInt8(this.incrHead(1), value) }
  writeUInt8(value: number) { this.buffer.setUint8(this.incrHead(1), value) }
  writeSInt16LE(value: number) { this.buffer.setInt16(this.incrHead(2), value, true) }
  writeUInt16LE(value: number) { this.buffer.setUint16(this.incrHead(2), value, true) }
  writeSInt16BE(value: number) { this.buffer.setInt16(this.incrHead(2), value, false) }
  writeUInt16BE(value: number) { this.buffer.setUint16(this.incrHead(2), value, false) }

  writeUInt24LE(value: number) {
    this.writeUInt8(value & 0xff);
    this.writeUInt8(~~(value / (2 ** 8)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 16)) & 0xff);
  }
  writeUInt24BE(value: number) {
    this.writeUInt8(~~(value / (2 ** 16)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 8)) & 0xff);
    this.writeUInt8(value & 0xff);
  }

  writeSInt32LE(value: number) { this.buffer.setInt32(this.incrHead(4), value, true) }
  writeUInt32LE(value: number) { this.buffer.setUint32(this.incrHead(4), value, true) }
  writeSInt32BE(value: number) { this.buffer.setInt32(this.incrHead(4), value, false) }
  writeUInt32BE(value: number) { this.buffer.setUint32(this.incrHead(4), value, false) }

  writeUInt48LE(value: number) {
    this.writeUInt8(value & 0xff);
    this.writeUInt8(~~(value / (2 ** 8)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 16)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 24)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 32)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 40)) & 0xff);
  }
  writeUInt48BE(value: number) {
    this.writeUInt8(~~(value / (2 ** 40)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 32)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 24)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 16)) & 0xff);
    this.writeUInt8(~~(value / (2 ** 8)) & 0xff);
    this.writeUInt8(value & 0xff);
  }

  writeFloat32LE(value: number) { this.buffer.setFloat32(this.incrHead(4), value, true) }
  writeFloat32BE(value: number) { this.buffer.setFloat32(this.incrHead(4), value, false) }
  writeFloat64LE(value: number) { this.buffer.setFloat64(this.incrHead(8), value, true) }
  writeFloat64BE(value: number) { this.buffer.setFloat64(this.incrHead(8), value, false) }

  writePackedUInt32(value: number) {
    do {
      let b = value & 0xff;

      if (value >= 0x80) {
        b |= 0x80;
      }

      this.writeUInt8(b);

      value >>>= 7;
    } while (value != 0);
  }

  writePackedInt32(value: number) {
    return this.writePackedUInt32(value >>> 0);
  }

  writeBytes(bytes: Buffer | ArrayBuffer | Uint8Array | DataView | number[] | BinaryReader | BinaryWriter) {
    if (Array.isArray(bytes)) {
      bytes = new Uint8Array(bytes);
    }

    if (bytes instanceof BinaryReader || bytes instanceof BinaryWriter) {
      bytes = bytes.getBuffer();
    }

    while (!(bytes instanceof ArrayBuffer)) {
      bytes = bytes.buffer;
    }

    // this is done here since `incrHead` can change `this.buffer`
    const writeOffset = this.incrHead(bytes.byteLength);

    new Uint8Array(this.buffer.buffer).set(new Uint8Array(bytes), writeOffset);
  }

  writeNTString(string: string) {
    this.writeString(string);
    this.writeUInt8(0);
  }

  writeString(string: string) {
    this.writeBytes(new TextEncoder().encode(string));
  }

  write(instance: BinaryObjectInstance) {
    this.writeBytes(instance.serialize());
  }
}
