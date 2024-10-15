import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestKeepAlive {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestKeepAlive();
  }

  constructor() { }

  serialize() {
    return new StringArrayWriter;
  }
}
