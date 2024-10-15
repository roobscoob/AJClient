import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CItemBuyResponse {
  static deserialize(reader: StringArrayReader) {
    return new S2CItemBuyResponse(
      reader.readNumericBoolean(), // success
      reader.readInt(), // shopId
      reader.readNullableInt(), // newCurrencyAmount
      reader.readInt(), // currencyType
    )
  }

  constructor(
    public success: boolean,
    public shopId: number,
    public newCurrencyAmount: number | undefined,
    public currencyType: number,
  ) { } 

  serialize() {
    return StringArrayWriter
      .writeNumericBooleans(this.success)
      .writeNumbers(this.shopId)
      .writeNumbers(this.newCurrencyAmount, this.currencyType)
  }
}
