import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestItemUse {
  static deserialize(reader: StringArrayReader) {
    const shopId = reader.readInt();

    reader.skip(1);

    return new C2SRequestItemUse(
      shopId,
      reader.readInt(),
      reader.readInt(),
      reader.readNumericBoolean(),
      reader.readInt(),
      reader.readString(),
    )
  }

  constructor(
    public shopId: number,
    public itemId: number,
    public itemColorIdx: number,
    public isDiamond: boolean,
    public tokenInvId: number,
    public selectedUserName: string,
  ) { }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.shopId, 1, this.itemId, this.itemColorIdx)
      .writeNumericBooleans(this.isDiamond)
      .writeNumbers(this.tokenInvId)
      .writeStrings(this.selectedUserName);
  }
}
