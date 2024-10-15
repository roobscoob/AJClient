import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class Buddy {
  static deserialize(reader: StringArrayReader, isOnline: boolean) {
    return new Buddy(
      reader.readString(),
      reader.readString(),
      reader.readInt(),
      reader.readInt(),
      isOnline ? reader.readInt() : undefined
    );
  }

  constructor(
    public userName: string,
    public uuid: string,
    public userNameModerationFlag: number,
    public accountType: number,
    public timeLeftHostingCustomParty?: number
  ) { }

  serialize() {
    const writer = StringArrayWriter
      .writeStrings(this.userName, this.uuid)
      .writeNumbers(this.userNameModerationFlag, this.accountType)

    if (this.timeLeftHostingCustomParty !== undefined)
      writer.writeNumbers(this.timeLeftHostingCustomParty);

    return writer;
  }
}
