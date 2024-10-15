import { StringArrayReader } from "./strArrayReader";
import { StringArrayWriter } from "./strArrayWriter";

export class BitField {
  static deserialize(reader: StringArrayReader) {
    return new BitField(reader.readInt());
  }

  constructor(private bitField: number) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.bitField);
  }
}
