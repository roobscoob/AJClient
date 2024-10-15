import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestCurrencyDonation {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestCurrencyDonation(reader.readInt());
  }

  constructor(public donateAmount: number) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.donateAmount);
  }
}
