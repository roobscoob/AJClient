import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export type MinigameInitInfo = {
  gameDefId: number,
  titleStrId: number,
  extName: string,
  swfName: string,
  minPlayers: number,
  maxPlayers: number,
  maxSpectators: number,
  type: number,
  gameCardMediaId: number,
  gameCountUserVarRef: number,
  custom1UserVarRef: number,
  custom2UserVarRef: number,
  readyForPVP: number,
  gemMultiplier: number,
  petDefId: number,
  proModeUserVarRefId: number,
  leaderboardUserVarRef: number,
  gameLibraryIconMediaId: number,
  requiredAvatarType: number
}

export class S2CMinigameInfo {
  static deserialize(reader: StringArrayReader) {
    return new S2CMinigameInfo(
      reader.readTaggedArray<MinigameInitInfo>(reader => ({
        gameDefId: reader.readInt(),
        titleStrId: reader.readInt(),
        extName: reader.readString(),
        swfName: reader.readString(),
        minPlayers: reader.readInt(),
        maxPlayers: reader.readInt(),
        maxSpectators: reader.readInt(),
        type: reader.readInt(),
        gameCardMediaId: reader.readInt(),
        gameCountUserVarRef: reader.readInt(),
        custom1UserVarRef: reader.readInt(),
        custom2UserVarRef: reader.readInt(),
        readyForPVP: reader.readInt(),
        gemMultiplier: reader.readFloat(),
        petDefId: reader.readInt(),
        proModeUserVarRefId: reader.readInt(),
        leaderboardUserVarRef: reader.readInt(),
        gameLibraryIconMediaId: reader.readInt(),
        requiredAvatarType: reader.readInt()
      }))
    );
  }

  constructor(
    public minigameInfos: MinigameInitInfo[]
  ) {}

  serialize() {
    return StringArrayWriter
      .writeTaggedArray(this.minigameInfos, info => 
        StringArrayWriter
          .writeNumbers(info.gameDefId, info.titleStrId)
          .writeStrings(info.extName, info.swfName)
          .writeNumbers(info.minPlayers, info.maxPlayers, info.maxSpectators, info.type, info.gameCardMediaId, info.gameCountUserVarRef, info.custom1UserVarRef, info.custom2UserVarRef, info.readyForPVP, info.gemMultiplier, info.petDefId, info.proModeUserVarRefId, info.leaderboardUserVarRef, info.gameLibraryIconMediaId, info.requiredAvatarType)
      );
  }
}
