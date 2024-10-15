import { BinaryReader } from "../../utils/binary";

export class Amf3Int extends Number {
  static deserialize(reader: BinaryReader) {
    return new Amf3Int(reader.readUInt29());
  }
}
