import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

//@ts-ignore
export class S2CMediaList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number, glDefType: number) {
    reader.skip(4);

    return new S2CMediaList(listId, glDefType, reader.readTaggedArray(r => ({ id: r.readInt(), name: r.readInt() })));
  }

  constructor(
    listId: number,
    public glDefType: number,
    public mediaItems: { id: number, name: number }[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter.writeNumbers(this.listId, this.glDefType).skip(4).writeTaggedArray(this.mediaItems, i => StringArrayWriter.writeNumbers(i.id, i.name));
  }
}
