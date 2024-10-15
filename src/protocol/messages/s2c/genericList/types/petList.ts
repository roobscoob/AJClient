import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CPetList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CPetList(listId, reader.readTaggedArray(reader => ([ reader.readInt(), reader.readInt() ])));
  }

  constructor(
    listId: number,
    public unknown: [number, number][],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Pet)
      .skip(4)
      .writeNumbers(this.unknown.length, ...this.unknown.flat());
  }
}
