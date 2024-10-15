import { AnimalJamClient } from "../../../../client";
import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";
import { MinigameProviders } from "../../../minigames";

export class S2CMinigameStart {
  static deserialize(reader: StringArrayReader, context: AnimalJamClient) {
    const playerIds = reader.readTaggedArray(r => r.readInt());
    const startMessage = context.getCurrentMinigameMessageProvider()?.getStartMessage()

    return new S2CMinigameStart(playerIds, startMessage ? reader.readObject(startMessage) : reader.getRemainingStrings());
  }

  constructor(
    public playerIds: number[],
    public minigameData: string[] | ReturnType<ReturnType<MinigameProviders["getStartMessage"]>["deserialize"]>
  ) {}

  serialize() {
    const v = StringArrayWriter
      .writeTaggedArray(this.playerIds, i => StringArrayWriter.writeNumbers(i));

    if (Array.isArray(this.minigameData))
      return v.writeStrings(...this.minigameData);
    else
      return v.writeObject(this.minigameData);
  }
}
