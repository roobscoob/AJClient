import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CPetAdoptDataCount {
  static deserialize(reader: StringArrayReader) {
    return new S2CPetAdoptDataCount(reader.readInt());
  }

  constructor(
    public count: number,
  ) { }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.count)
  }
}
