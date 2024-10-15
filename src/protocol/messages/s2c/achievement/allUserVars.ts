import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export type UserVars = Record<number, { type: number, value: number }>;

export class S2CAllUserVars {
  static deserialize(reader: StringArrayReader) {
    return new S2CAllUserVars(reader.reduceTaggedArray({} as UserVars, (reader: StringArrayReader, userVars: UserVars) => {
      userVars[reader.readInt()] = { type: reader.readInt(), value: reader.readInt() }
    }));
  }

  constructor(
    public userVars: Record<number, { type: number, value: number }>,
  ) { }

  serialize() {
    const entries = Object.entries(this.userVars);

    return StringArrayWriter.writeArray(entries, i => StringArrayWriter
      .writeStrings(i[0])
      .writeNumbers(...Object.values(i[1]))
      )
  }
}
