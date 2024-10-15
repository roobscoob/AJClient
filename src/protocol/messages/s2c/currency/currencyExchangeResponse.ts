import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CCurrencyExchangeResponse {
  static deserialize(reader: StringArrayReader) {
    return new S2CCurrencyExchangeResponse(
      reader.readNumericBoolean(),
      reader.readInt(),
    )
  }

  constructor(
    public success: boolean,
    public newGemCount: number,
  ) { } 

  serialize() {
    return StringArrayWriter.writeNumericBooleans(this.success).writeNumbers(this.newGemCount)
  }
}
