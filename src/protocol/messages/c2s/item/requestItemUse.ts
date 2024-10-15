import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestItemUse {
  static deserialize(reader: StringArrayReader) {
    const itemsOnLength = reader.readInt();
    const itemsOffLength = reader.readInt();

    return new C2SRequestItemUse(
      reader.readArray(itemsOnLength, r => r.readInt()),
      reader.readArray(itemsOffLength, r => r.readInt()),
    );
  }

  constructor(
    public itemsOnInvIdx: number[],
    public itemsOffInvIdx: number[],
  ) { }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.itemsOnInvIdx.length, this.itemsOffInvIdx.length)
      .writeNumbers(...this.itemsOnInvIdx, ...this.itemsOffInvIdx);
  }
}
