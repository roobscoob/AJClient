import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CItemRecycleResponse {
  static deserialize(reader: StringArrayReader) {
    const recycledCount = reader.readInt();

    let newGemsAmount: number | undefined = reader.readInt();

    if (newGemsAmount === -1)
      newGemsAmount = undefined;

    const recycledInventoryIdx = reader.readArray(recycledCount, r => r.readInt());

    return new S2CItemRecycleResponse(newGemsAmount, recycledInventoryIdx);
  }

  constructor(
    public newGemsAmount: number | undefined,
    public recycledInventoryIdx: number[],
  ) { }

  serialize() {
    return StringArrayWriter.writeNumbers(this.recycledInventoryIdx.length, this.newGemsAmount, ...this.recycledInventoryIdx);
  }
}
