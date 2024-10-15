import { StringArrayReader } from "../../../utils/strArrayReader";

export abstract class S2CArtStudioGridDrawingMinigameMessage {
  static deserialize(reader: StringArrayReader) {
    const command = reader.readString();

    switch (command) {
      case "tkn":
        return S2CArtStudioGridDrawingMinigameMessageMasterpieceToken.deserialize(reader);
      default:
        throw new Error("Unknown ArtStudioGridDrawing command: " + command)
    }
  }
}

import { S2CArtStudioGridDrawingMinigameMessageMasterpieceToken } from "./messages/masterpieceToken";
