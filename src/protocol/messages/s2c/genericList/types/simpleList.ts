import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CSimpleList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number, defType: number) {
    reader.skip(4);

    return new S2CSimpleList(listId, defType, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    private defType: number,
    public contents: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, this.defType)
      .skip(4)
      .writeNumbers(this.contents.length, ...this.contents);
  }
}
