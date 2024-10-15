import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestPetAdoptSeenSet {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestPetAdoptSeenSet(data.readRemainingArray(r => r.readInt()));
  }

  constructor(public defIds: number[]) {}

  serialize() {
    return StringArrayWriter.writeNumbers(...this.defIds);
  }
}
