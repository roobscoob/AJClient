import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestGenericList {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestGenericList(data.readInt());
  }

  constructor(
    public listId: number,
  ) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.listId);
  }
}
