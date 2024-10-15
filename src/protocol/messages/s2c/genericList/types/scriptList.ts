import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CScriptList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CScriptList(listId, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    public scriptDefIds: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Script)
      .skip(4)
      .writeNumbers(this.scriptDefIds.length, ...this.scriptDefIds);
  }
}
