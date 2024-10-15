import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CItemUse {
  static deserialize(reader: StringArrayReader) {
    return new S2CItemUse(reader.readNumericBoolean());
  }

  constructor(public successful: boolean) {}

  serialize() {
    return StringArrayWriter.writeNumericBooleans(this.successful);
  }
}
