import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestItemRecycle {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestItemRecycle(reader.readTaggedArray(v => v.readInt()));
  }

  constructor(
    public itemInvIndexes: number[],
  ) { }

  serialize() {
    return StringArrayWriter
      .writeTaggedArray(this.itemInvIndexes, w => StringArrayWriter.writeNumbers(w));
  }
}
