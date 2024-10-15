import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestPetAdoptData {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestPetAdoptData(data.readString());
  }

  constructor(public userName: string) {}

  serialize() {
    return StringArrayWriter.writeStrings(this.userName);
  }
}
