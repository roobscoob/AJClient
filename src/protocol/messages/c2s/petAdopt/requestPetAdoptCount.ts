import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestPetAdoptCount {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestPetAdoptCount(data.readString());
  }

  constructor(public userName: string) {}

  serialize() {
    return StringArrayWriter.writeStrings(this.userName);
  }
}
