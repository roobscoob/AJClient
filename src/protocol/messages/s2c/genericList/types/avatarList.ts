import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CAvatarList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CAvatarList(listId, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    public avatarTypeIds: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Avatar)
      .skip(4)
      .writeNumbers(this.avatarTypeIds.length, ...this.avatarTypeIds);
  }
}
