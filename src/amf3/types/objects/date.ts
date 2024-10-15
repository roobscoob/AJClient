import { BinaryReader } from "../../../utils/binary";
import { CacheTypes } from "../../context";

export class Amf3Date extends Date {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, header: number) {
    return new Amf3Date(reader.readFloat64LE())
  }
}
