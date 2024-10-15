import type { AnimalJamClient } from "../client";
import { StringArrayReader } from "../utils/strArrayReader";
import { StringArrayWriter } from "../utils/strArrayWriter";

export type MessageInstance = { serialize(): typeof StringArrayWriter | StringArrayWriter | string[] };
export type Message = {
  deserialize<Context extends any[]>(data: StringArrayReader, context: AnimalJamClient): MessageInstance;
}

export enum Messages {
  BuddyList = "bl",
  // AllUserVars
  ZG = "zg",
  GenericList = "gl",
  TradeList = "tl",
  MinigameInfo = "mi",
  PetUnlock = "pi",
}
