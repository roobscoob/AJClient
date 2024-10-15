import { BinaryReader } from "../../utils/binary";
import { CacheTypes } from "../context";

export class Amf3String extends String {
  static CacheType = CacheTypes.String;

  static deserialize(reader: BinaryReader, header: number) {
    return new Amf3String(reader.readString(header));
  }
}
