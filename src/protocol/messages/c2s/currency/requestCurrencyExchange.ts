import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestCurrencyExchange {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestCurrencyExchange(reader.readInt(), reader.readInt());
  }

  constructor(public shopId: number, public defId: number) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.shopId, this.defId);
  }
}
