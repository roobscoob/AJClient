import { S2CArtStudioGridDrawingMinigameMessage } from "./minigameMessage";
import { ArtStudioGridDrawingStartMessage } from "./startMessage";

export class ArtStudioGridDrawingProvider {
  static getStartMessage() { return ArtStudioGridDrawingStartMessage }
  static getS2CMinigameMessage() { return S2CArtStudioGridDrawingMinigameMessage }
}
