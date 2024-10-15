import { BitField } from "./bitField";
import { StringArrayReader } from "./strArrayReader";
import { StringArrayWriter } from "./strArrayWriter";

export class ScalableBitField {
  static deserialize(reader: StringArrayReader) {
    return new ScalableBitField(reader.readDelimitatedObjectArray(",", BitField));
  }

  constructor(
    private bitFields: BitField[],
  ) {}

  serialize() {
    return StringArrayWriter
      .writeDelimitatedObjectArray(this.bitFields, ",")
  }
}
