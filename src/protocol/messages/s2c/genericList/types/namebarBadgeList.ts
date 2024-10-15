import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CNamebarBadgeList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CNamebarBadgeList(listId, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    public namebarBadgeDefIds: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.NamebarBadge)
      .skip(4)
      .writeNumbers(this.namebarBadgeDefIds.length, ...this.namebarBadgeDefIds);
  }
}
