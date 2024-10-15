import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SBuddyList {
  static deserialize(data: StringArrayReader) {
    return new C2SBuddyList();
  }

  serialize() {
    return new StringArrayWriter;
  }
}
