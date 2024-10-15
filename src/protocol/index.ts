import { C2SBuddyList, C2SAllUserVars, S2CAllUserVars, S2CBuddyList } from "./messages";
import type { MessageInstance } from "./message";
import { StringArrayReader } from "../utils/strArrayReader";
import { C2SRequestGenericList } from "./messages/c2s/genericList/requestGenericList";
import { S2CGenericList } from "./messages/s2c/genericList/genericList";
import { C2STradeListRequest } from "./messages/c2s/trade/tradeListRequest";
import { S2CTradeList } from "./messages/s2c/trade/tradeList";
import { C2SRequestMinigameInfo } from "./messages/c2s/minigame/requestMinigameInfo";
import { S2CMinigameInfo } from "./messages/s2c/minigame/minigameInfo";
import { S2CPetUnlock } from "./messages/s2c/pet/unlock";
import type { AnimalJamClient } from "../client";
import { C2SRequestAchievements } from "./messages/c2s/achievement/requestAchievements";
import { C2SRequestSetVariable } from "./messages/c2s/achievement/requestSetVariable";
import { S2CSetUserVariable } from "./messages/s2c/achievement/setUserVariable";
import { S2CAchievement } from "./messages/s2c/achievement/achievement";
import { C2SRequestPetAdoptData } from "./messages/c2s/petAdopt/requestPetAdoptData";
import { C2SRequestPetAdoptSeenSet } from "./messages/c2s/petAdopt/requestPetAdoptSeenSet";
import { C2SRequestPetAdoptCount } from "./messages/c2s/petAdopt/requestPetAdoptCount";
import { S2CPetAdoptData } from "./messages/s2c/petAdopt/petAdoptData";
import { S2CPetAdoptDataCount } from "./messages/s2c/petAdopt/petAdoptDataCount";
import { C2SRequestKeepAlive } from "./messages/c2s/keepAlive/requestMinigameInfo";
import { C2SRequestItemList } from "./messages/c2s/item/requestItemList";
import { S2CItemList } from "./messages/s2c/item/itemList";
import { C2SRequestItemUse } from "./messages/c2s/item/requestItemUse";
import { S2CItemUse } from "./messages/s2c/item/itemUse";
import { S2CItemBuyResponse } from "./messages/s2c/item/itemBuyResponse";
import { C2SRequestItemRecycle } from "./messages/c2s/item/requestItemRecycle";
import { S2CItemRecycleResponse } from "./messages/s2c/item/itemRecycleResponse";
import { S2CItemPrize } from "./messages/s2c/item/itemPrize";
import { C2SRequestDiamondBundleBuy } from "./messages/c2s/item/requestDiamondBundleBuy";
import { S2CDiamondShopListResponse } from "./messages/s2c/genericList/types/shopList";
import { S2CCurrencyUpdate } from "./messages/s2c/currency/currencyUpdate";
import { C2SRequestCurrencyDonation } from "./messages/c2s/currency/requestCurrencyDonation";
import { S2CCurrencyDonationResponse } from "./messages/s2c/currency/currencyDonationResponse";
import { C2SRequestCurrencyExchange } from "./messages/c2s/currency/requestCurrencyExchange";
import { S2CCurrencyExchangeResponse } from "./messages/s2c/currency/currencyExchangeResponse";

const messages = <const>{
  // [*] Generic List Messages
  "gl": [ C2SRequestGenericList, S2CGenericList ],

  // [*] Achievement Messages
  "za": [ C2SRequestAchievements, S2CAchievement ],
  "zs": [ C2SRequestSetVariable, S2CSetUserVariable ],
  "zg": [ C2SAllUserVars, S2CAllUserVars ],

  // [*] PetADopt Messages
  "pad":  [ C2SRequestPetAdoptData, S2CPetAdoptData ],
  "padc": [ C2SRequestPetAdoptCount, S2CPetAdoptDataCount ],
  "pads": [ C2SRequestPetAdoptSeenSet, undefined ],

  // Avatar Messages
  "au":  [ undefined, undefined ],
  "ad":  [ undefined, undefined ],
  "ac":  [ undefined, undefined ],
  "ap":  [ undefined, undefined ],
  "ag":  [ undefined, undefined ],
  "ar":  [ undefined, undefined ],
  "al":  [ undefined, undefined ],
  "ab":  [ undefined, undefined ],
  "as":  [ undefined, undefined ],
  "aa":  [ undefined, undefined ],
  "ak":  [ undefined, undefined ],
  "ao":  [ undefined, undefined ],
  "apb": [ undefined, undefined ],
  "apc": [ undefined, undefined ],
  "afp": [ undefined, undefined ],
  "an":  [ undefined, undefined ],
  "ags": [ undefined, undefined ],
  "af":  [ undefined, undefined ],

  // Buddy Messages
  "bl": [ C2SBuddyList, S2CBuddyList ],
  "ba": [ undefined, undefined ],
  "bs": [ undefined, undefined ],
  "bc": [ undefined, undefined ],
  "bd": [ undefined, undefined ],
  "br": [ undefined, undefined ],
  "bb": [ undefined, undefined ],
  "bu": [ undefined, undefined ],
  "bi": [ undefined, undefined ],

  // ReferAFriend Messages
  "refc": [ undefined, undefined ],
  "refa": [ undefined, undefined ],
  "refh": [ undefined, undefined ],
  "refr": [ undefined, undefined ],

  // [*] KeepAlive Messages
  "ka": [ C2SRequestKeepAlive, undefined ],

  // CreateAccount Messages
  "la": [ undefined, undefined ],
  "lc": [ undefined, undefined ],
  "le": [ undefined, undefined ],
  "ln": [ undefined, undefined ],

  // Den Messages
  "ds":  [ undefined, undefined ],
  "dss": [ undefined, undefined ],
  "dp":  [ undefined, undefined ],
  "dpk": [ undefined, undefined ],
  "di":  [ undefined, undefined ],
  "dc":  [ undefined, undefined ],
  "db":  [ undefined, undefined ],
  "dr":  [ undefined, undefined ],
  "dh":  [ undefined, undefined ],
  "dl":  [ undefined, undefined ],
  "drc": [ undefined, undefined ],
  "de":  [ undefined, undefined ],
  "dmi": [ undefined, undefined ],
  "dph": [ undefined, undefined ],
  "dmc": [ undefined, undefined ],
  "dEf": [ undefined, undefined ],
  "dEr": [ undefined, undefined ],
  "dEc": [ undefined, undefined ],
  "dj":  [ undefined, undefined ],

  // ShopToSell Messages
  "dsu": [ undefined, undefined ],
  "dsi": [ undefined, undefined ],
  "dsb": [ undefined, undefined ],

  // ECard Messages
  "el": [ undefined, undefined ],
  "er": [ undefined, undefined ],
  "ed": [ undefined, undefined ],
  "es": [ undefined, undefined ],
  "eg": [ undefined, undefined ],
  "eb": [ undefined, undefined ],
  "ep": [ undefined, undefined ],
  "eu": [ undefined, undefined ],
  "ei": [ undefined, undefined ],
  "ec": [ undefined, undefined ],

  // Facilitator Messages
  "fd":  [ undefined, undefined ],
  "fk":  [ undefined, undefined ],
  "fb":  [ undefined, undefined ],
  "fm":  [ undefined, undefined ],
  "fs":  [ undefined, undefined ],
  "fg":  [ undefined, undefined ],
  "fp":  [ undefined, undefined ],
  "fr":  [ undefined, undefined ],
  "fra": [ undefined, undefined ],
  "fi":  [ undefined, undefined ], // sent by SFClient 
  "fc":  [ undefined, undefined ],
  "fbm": [ undefined, undefined ],
  "ft":  [ undefined, undefined ],

  // Minigame Messages
  "mi":  [ C2SRequestMinigameInfo, S2CMinigameInfo ],
  "ms":  [ undefined, undefined ],
  "mj":  [ undefined, undefined ],
  "ml":  [ undefined, undefined ],
  "mm":  [ undefined, undefined ],
  "me":  [ undefined, undefined ],
  "mr":  [ undefined, undefined ],
  "mp":  [ undefined, undefined ],
  "mg":  [ undefined, undefined ],
  "ma":  [ undefined, undefined ],
  "mlb": [ undefined, undefined ],
  "mcp": [ undefined, undefined ],
  "msv": [ undefined, undefined ],

  // GameRedemption Messages
  "grc": [ undefined, undefined ],
  "grm": [ undefined, undefined ],

  // [*] Item Messages
  "il": [ C2SRequestItemList, S2CItemList ],
  "iu": [ C2SRequestItemUse, S2CItemUse ],
  "ib": [ C2SRequestItemUse, S2CItemBuyResponse ],
  "ir": [ C2SRequestItemRecycle, S2CItemRecycleResponse ],
  "ip": [ undefined, S2CItemPrize ],
  "id": [ C2SRequestDiamondBundleBuy, S2CDiamondShopListResponse ],

  // [*] Item.Currency Messages
  "cu": [ undefined, S2CCurrencyUpdate ],
  "cd": [ C2SRequestCurrencyDonation, S2CCurrencyDonationResponse ],
  "ce": [ C2SRequestCurrencyExchange, S2CCurrencyExchangeResponse ],

  // Newspaper Messages
  "nps": [ undefined, undefined ],

  // Node Hop Messages
  "nd": [ undefined, undefined ],

  // Party Messages
  "sl":   [ undefined, undefined ],
  "sj":   [ undefined, undefined ],
  "slp":  [ undefined, undefined ],
  "scp":  [ undefined, undefined ],
  "sphp": [ undefined, undefined ],
  "sjp":  [ undefined, undefined ],
  "spk":  [ undefined, undefined ],
  "spn":  [ undefined, undefined ],
  "sm":   [ undefined, undefined ],

  // Sent by SFClient, maybe a Party message, or maybe stands for "SerVer"?
  "sv":   [ undefined, undefined ],

  // Pet Messages
  "pl": [ undefined, undefined ],
  "pc": [ undefined, undefined ],
  "ps": [ undefined, undefined ],
  "pi": [ undefined, undefined ],
  "pm": [ undefined, undefined ],
  "pd": [ undefined, undefined ],
  "pu": [ undefined, S2CPetUnlock ],
  "pn": [ undefined, undefined ],
  "pb": [ undefined, undefined ],

  // Player Wall Messages
  "wt":  [ undefined, undefined ],
  "wss": [ undefined, undefined ],
  "wsg": [ undefined, undefined ],
  "wps": [ undefined, undefined ],
  "wci": [ undefined, undefined ],

  // Quest Messages
  "qqm":         [ undefined, undefined ],
  "qssau":       [ undefined, undefined ],
  "qap":         [ undefined, undefined ],
  "qau":         [ undefined, undefined ],
  "qahs":        [ undefined, undefined ],
  "qas":         [ undefined, undefined ],
  "qjp":         [ undefined, undefined ],
  "qjc":         [ undefined, undefined ],
  "qj":          [ undefined, undefined ],
  "qjx":         [ undefined, undefined ],
  "qw":          [ undefined, undefined ],
  "qs":          [ undefined, undefined ],
  "qcmd":        [ undefined, undefined ],
  "qcmdVT":      [ undefined, undefined ],
  "qp":          [ undefined, undefined ],
  "qm":          [ undefined, undefined ],
  "quxp":        [ undefined, undefined ],
  "quhp":        [ undefined, undefined ],
  "qrspn":       [ undefined, undefined ],
  "qad":         [ undefined, undefined ],
  "qx":          [ undefined, undefined ],
  "qxt":         [ undefined, undefined ],
  "qspn":        [ undefined, undefined ],
  "qatt":        [ undefined, undefined ],
  "qusu":        [ undefined, undefined ],
  "qulu":        [ undefined, undefined ],
  "qporbs":      [ undefined, undefined ],
  "qpup":        [ undefined, undefined ],
  "qsnd":        [ undefined, undefined ],
  "qsndVO":      [ undefined, undefined ],
  "qmusic":      [ undefined, undefined ],
  "qswfs":       [ undefined, undefined ],
  "qmlib":       [ undefined, undefined ],
  "qprr":        [ undefined, undefined ],
  "qpd":         [ undefined, undefined ],
  "qsp":         [ undefined, undefined ],
  "qps":         [ undefined, undefined ],
  "qpa":         [ undefined, undefined ],
  "qbzap":       [ undefined, undefined ],
  "qpzap":       [ undefined, undefined ],
  "qpgift":      [ undefined, undefined ],
  "qpgiftplr":   [ undefined, undefined ],
  "qplq":        [ undefined, undefined ],
  "qrc":         [ undefined, undefined ],
  "qviu":        [ undefined, undefined ],
  "qtorch":      [ undefined, undefined ],
  "qgi":         [ undefined, undefined ],
  "qsndpk":      [ undefined, undefined ],
  "qicon":       [ undefined, undefined ],
  "qseed":       [ undefined, undefined ],
  "qmi":         [ undefined, undefined ],
  "qepr":        [ undefined, undefined ],
  "qplayswf":    [ undefined, undefined ],
  "qshake":      [ undefined, undefined ],
  "qaward":      [ undefined, undefined ],
  "qposturi":    [ undefined, undefined ],
  "qpreloadswf": [ undefined, undefined ],
  "qfade":       [ undefined, undefined ],
  "qavsw":       [ undefined, undefined ],
  "qrestore":    [ undefined, undefined ],
  "qaskr":       [ undefined, undefined ],
  "qmgc":        [ undefined, undefined ],
  "qaa":         [ undefined, undefined ],
  "qpad":        [ undefined, undefined ],
  "qph":         [ undefined, undefined ],
  "qat":         [ undefined, undefined ],
  "qaut":        [ undefined, undefined ],
  "qfrmgdone":   [ undefined, undefined ],
  "qjf":         [ undefined, undefined ],
  "qjk":         [ undefined, undefined ],
  "qep":         [ undefined, undefined ],
  "qpgiftdone":  [ undefined, undefined ],
  "qcq":         [ undefined, undefined ],
  "qdroppup":    [ undefined, undefined ],

  // Resource Messages
  "crg": [ undefined, undefined ],
  "crp": [ undefined, undefined ],

  // Room Messages
  "rj": [ undefined, undefined ],
  "rp": [ undefined, undefined ],
  "rc": [ undefined, undefined ],
  "rf": [ undefined, undefined ],
  "rl": [ undefined, undefined ],
  "rm": [ undefined, undefined ],

  // Trade Messages
  "tl": [ C2STradeListRequest, S2CTradeList ],
  "tb": [ undefined, undefined ],
  "ti": [ undefined, undefined ],
  "ts": [ undefined, undefined ],

  // Verification Messages
  "ves": [ undefined, undefined ],
  "vea": [ undefined, undefined ],

  // World Items
  "wig": [ undefined, undefined ],
}

export function serializeMessage(message: MessageInstance): [ type: string, contents: string[] ] {
  const type = Object.entries(messages).find(x => (x[1][0] && message instanceof x[1][0]) || (x[1][1] && message instanceof x[1][1]))?.[0];

  if (type === undefined) {
    throw new Error(`Could not find command for message class ${message.constructor.name}`);
  }

  let strArray = message.serialize();

  if (!Array.isArray(strArray))
    strArray = strArray.getStringArray();

  return [type, strArray];
}

export function deserializeMessage(type: string, text: string[], toClient: boolean, context: AnimalJamClient): MessageInstance {
  const messageTypes = (messages as any)[type];

  if (messageTypes === undefined) {
    throw new Error(`Could not find message entry for type ${type}`);
  }

  const message = messageTypes[toClient ? 1 : 0];
  if (message === undefined) {
    throw new Error(`Could not find ${toClient ? "S2C" : "C2S"} class for type ${type}`);
  }

  const reader = new StringArrayReader(text);
  return reader.readObject(message, context);
}
