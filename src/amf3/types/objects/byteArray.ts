import { BinaryReader } from "../../../utils/binary";
import { CacheTypes } from "../../context";

export class Amf3ByteArray {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, header: number) {
    const buffer = reader.readBytes(header).getBuffer();

    return new Amf3ByteArray(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  }

  constructor(
    public byteArray: ArrayBuffer,
  ) {}
}
