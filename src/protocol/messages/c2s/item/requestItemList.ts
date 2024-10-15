import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestItemList {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestItemList(reader.readString(), reader.readInt(), reader.readNumericBoolean());
  }

  constructor(
    public username: string,
    public perUserAvatarId: number,
    public getFullList: boolean = true,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeStrings(this.username)
      .writeNumbers(this.perUserAvatarId)
      .writeNumericBooleans(this.getFullList);
  }
}
