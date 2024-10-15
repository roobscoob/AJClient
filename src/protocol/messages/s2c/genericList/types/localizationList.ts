import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

// @ts-ignore
export class S2CLocalizationList extends S2CGenericList {
  static deserialize(reader: StringArrayReader, listId: number) {
    reader.skip(4);

    return new S2CLocalizationList(listId, reader.readTaggedArray(reader => reader.readInt()));
  }

  constructor(
    listId: number,
    public localizationIds: number[],
  ) { super(listId) }

  serialize() {
    return StringArrayWriter.writeNumbers(this.listId, DefType.Localization).skip(4).writeNumbers(this.localizationIds.length, ...this.localizationIds);
  }
}
