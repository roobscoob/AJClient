import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestDiamondBundleBuy {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestDiamondBundleBuy(reader.readInt());
  }

  constructor(public shopId: number) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.shopId);
  }
}
