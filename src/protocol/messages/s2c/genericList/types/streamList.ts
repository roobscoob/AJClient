import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

//@ts-ignore
export class S2CStreamList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    const titleText = reader.readString();

    reader.skip(3);

    return new S2CStreamList(listId, titleText, reader.readTaggedArray(r => ({
      defId: r.readInt(),
      thumbnailId: r.readInt(),
      title: r.readDelimitatedArray("|").readRemainingArray(r => r.readInt()),
      status: r.readInt(),
      subtitleId: r.readInt(),
    })));
  }

  constructor(
    listId: number,
    public titleText: string,
    public streamItems: { defId: number, thumbnailId: number, title: number[], status: number, subtitleId: number }[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Stream)
      .writeTaggedArray(this.streamItems, i => 
        StringArrayWriter.writeNumbers(i.defId, i.thumbnailId)
          .writeDelimitatedArray(i.title, "|", w => StringArrayWriter.writeNumbers(w))
          .writeNumbers(i.status, i.subtitleId)
      );
  }
}
