import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestMinigameInfo {
  static deserialize(data: StringArrayReader) {
    return new C2SRequestMinigameInfo(data.readRemainingArray(r => r.readInt()));
  }

  constructor(
    public gameDefIds: number[],
  ) { }

  serialize() {
    return StringArrayWriter.writeNumbers(...this.gameDefIds);
  }
}
