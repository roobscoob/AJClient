import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CCurrencyUpdate {
  static deserialize(reader: StringArrayReader) {
    return new S2CCurrencyUpdate(reader.readInt(), reader.readInt(), reader.readInt());
  }

  constructor(
    public currencyId: number,
    public currencyAmount: number,
    public updateReason: number,
  ) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.currencyId, this.currencyAmount, this.updateReason);
  }
}
