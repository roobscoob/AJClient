import { BinaryReader } from "../../utils/binary";

export class Amf3Double extends Number {
  static deserialize(reader: BinaryReader) {
    return new Amf3Double(reader.readFloat64LE());
  }
}
