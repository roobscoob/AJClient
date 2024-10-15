import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestAchievements {
  static deserialize(data: StringArrayReader) {
    const userName = data.readString();
    const sinceRelative = data.readInt();

    return new C2SRequestAchievements(userName, sinceRelative === -1 ? undefined : sinceRelative);
  }

  constructor(
    public userName: string,
    public sinceRelative?: number,
  ) {}

  serialize() {
    return StringArrayWriter.writeStrings(this.userName).writeNumbers(this.sinceRelative ?? -1);
  }
}
