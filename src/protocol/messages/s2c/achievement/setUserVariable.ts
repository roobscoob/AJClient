import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export type UserVars = Record<number, { type: number, value: number }>;

export class S2CSetUserVariable {
  static deserialize(reader: StringArrayReader) {
    const userVarId = reader.readInt();
    const value = reader.readFloat();

    const achievements = reader.readTaggedArray(r => ({ invId: r.readInt(), defId: r.readInt() }))

    return new S2CSetUserVariable(userVarId, value, achievements);
  }

  constructor(
    public userVarId: number,
    public value: number,
    public achievements: { invId: number, defId: number }[],
  ) { }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.userVarId, this.value)
      .writeTaggedArray(this.achievements, a => StringArrayWriter.writeNumbers(a.invId, a.defId));
  }
}
