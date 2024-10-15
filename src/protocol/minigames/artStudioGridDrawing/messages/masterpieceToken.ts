import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";
import { S2CArtStudioGridDrawingMinigameMessage } from "../minigameMessage";

export class S2CArtStudioGridDrawingMinigameMessageMasterpieceToken extends S2CArtStudioGridDrawingMinigameMessage {
  static deserialize(reader: StringArrayReader) {
    const success = reader.readNumericBoolean();

    reader.skip(1);

    const token = reader.readString();

    reader.skip(1);

    const userData = reader.readInt();

    return new S2CArtStudioGridDrawingMinigameMessageMasterpieceToken(success, token, userData);
  }

  constructor(
    public success: boolean,
    public token: string,
    public userData: number,
  ) { super() }

  serialize() {
    return StringArrayWriter
      .writeStrings("tkn")
      .writeNumericBooleans(this.success)
      .skip(1)
      .writeStrings(this.token)
      .skip(1)
      .writeNumbers(this.userData);
  }
}
