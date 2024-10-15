import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export type UserVars = Record<number, { type: number, value: number }>;

export class S2CAchievement {
  static deserialize(reader: StringArrayReader) {
    const userName = reader.readString();

    return new S2CAchievement(userName, reader.readTaggedArray(r => ({ invId: r.readInt(), defId: r.readInt() })))
  }

  constructor(
    public userName: string,
    public achievements: { invId: number, defId: number }[],
  ) { }

  serialize() {
    return StringArrayWriter
      .writeStrings(this.userName)
      .writeTaggedArray(this.achievements, a => StringArrayWriter.writeNumbers(a.invId, a.defId));
  }
}
