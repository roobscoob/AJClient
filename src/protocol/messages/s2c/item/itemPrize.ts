import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CItemPrize {
  static deserialize(reader: StringArrayReader) {
    return new S2CItemPrize(
      reader.readInt(),
      reader.readNumericBoolean(),
      reader.readInt(),
      reader.readInt(),
      reader.readInt(),
      reader.readInt(),
    );
  }

  constructor(
    public userVarId: number,
    public isClothing: boolean,
    public defId: number,
    public itemName: number,
    public desc: number,
    public color: number,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.userVarId)
      .writeNumericBooleans(this.isClothing)
      .writeNumbers(this.defId, this.itemName, this.desc, this.color);
  }
}
