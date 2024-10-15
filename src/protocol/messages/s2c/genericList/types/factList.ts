import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

//@ts-ignore
export class S2CFactList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CFactList(listId, reader.readTaggedArray(r => ({
      id: r.readInt(),
      media: r.readInt(),
      title: r.readInt(),
      description: r.readInt(),
      type: r.readInt(),
      userVarId: r.readInt(),
      bitIdx: r.readInt(),
    })));
  }

  constructor(
    listId: number,
    public factItems: { id: number, media: number, title: number, description: number, type: number, userVarId: number, bitIdx: number }[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter.writeNumbers(this.listId, DefType.Fact).skip(4).writeTaggedArray(this.factItems, i => StringArrayWriter.writeNumbers(
      i.id,
      i.media,
      i.title,
      i.description,
      i.type,
      i.userVarId,
      i.bitIdx
    ));
  }
}
