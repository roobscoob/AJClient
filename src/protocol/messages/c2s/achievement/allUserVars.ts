import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SAllUserVars {
  static deserialize(data: StringArrayReader) {
    return new C2SAllUserVars();
  }

  serialize() {
    return new StringArrayWriter;
  }
}
