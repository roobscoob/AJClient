import { StringArrayReader } from "../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../utils/strArrayWriter";

export class ArtStudioGridDrawingStartMessage {
  static deserialize(reader: StringArrayReader) {
    return new ArtStudioGridDrawingStartMessage(reader.getRemainingStrings().map(s => parseInt(s)));
  }

  constructor(
    public playerDbIds: number[]
  ) {}

  serialize() {
    return StringArrayWriter.writeNumbers(...this.playerDbIds);
  }
}
