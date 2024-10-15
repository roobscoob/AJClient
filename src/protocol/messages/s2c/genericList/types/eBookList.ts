import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CEBookList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CEBookList(listId, reader.readTaggedArray(reader => ({
      eBookId: reader.readInt(),
      mediaId: reader.readInt(),
      listId: reader.readInt(),
    })));
  }

  constructor(
    listId: number,
    public eBooks: { eBookId: number, mediaId: number, listId: number, }[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.EBook)
      .skip(4)
      .writeTaggedArray(this.eBooks, book => StringArrayWriter.writeNumbers(book.eBookId, book.mediaId, book.listId));
  }
}
