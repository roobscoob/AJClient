import { ScalableBitField } from "../../../../utils/scalableBitField";
import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CPetUnlock {
  static deserialize(reader: StringArrayReader) {
    return new S2CPetUnlock(ScalableBitField.deserialize(reader));
  }

  constructor(
    public petUnlock: ScalableBitField,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeObjects(this.petUnlock);
  }
}
