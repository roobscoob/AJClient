import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CCurrencyDonationResponse {
  static deserialize(reader: StringArrayReader) {
    return new S2CCurrencyDonationResponse(
      reader.readNumericBoolean(),
    )
  }

  constructor(
    public success: boolean,
  ) { } 

  serialize() {
    return StringArrayWriter.writeNumericBooleans(this.success)
  }
}
