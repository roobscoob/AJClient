import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2STradeListRequest {
  static deserialize(reader: StringArrayReader) {
    return new C2STradeListRequest(reader.readString());
  }

  constructor(
    public username: string,
  ) {}

  serialize() {
    return StringArrayWriter.writeStrings(this.username);
  }
}
