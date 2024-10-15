import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestMinigameStart {
  static deserialize(reader: StringArrayReader) {
    return new C2SRequestMinigameStart(reader.readInt());
  }

  constructor(public gameId: number) {}

  serialize() {
    return StringArrayWriter.writeNumbers(this.gameId);
  }
}
