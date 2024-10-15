import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class DiamondBundleBuyResponse {
  static deserialize(reader: StringArrayReader) {
    const success = reader.readStringBoolean();

    return new DiamondBundleBuyResponse(success, success ? reader.readInt() : undefined);
  }

  constructor(
    public success: boolean,
    public newDiamondAmount?: number,
  ) {
    if (this.success && this.newDiamondAmount === undefined)
      throw new Error("Cannot have a successful diamond bundle purchase without a newDiamondAmount");
  }

  serialize() {
    return StringArrayWriter.writeStringBooleans(this.success).writeNumbers(this.newDiamondAmount);
  }
}
