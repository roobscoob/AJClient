import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CInWorldItemList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CInWorldItemList(listId, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    public worldItemDefs: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.InWorldItems)
      .skip(4)
      .writeNumbers(this.worldItemDefs.length, ...this.worldItemDefs);
  }
}
