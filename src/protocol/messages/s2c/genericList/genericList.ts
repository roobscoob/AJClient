import { DefType } from "../../../../utils/defType";
import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export abstract class S2CGenericList {
  static deserialize(reader: StringArrayReader) {
    const listId = reader.readInt();
    const glDefType = reader.readInt();

    switch (glDefType) {
      case DefType.Clothing:
      case DefType.DenItem:
      case DefType.DenRoom:
      case DefType.CurrencyExchange:
      case DefType.Diamond:
      case DefType.Combined:
        return S2CShopListResponse.deserialize(reader, listId, glDefType)
      case DefType.Localization:
        return S2CLocalizationList.deserialize(reader, listId);
      case DefType.Media:
      case DefType.PetFoodList:
      case DefType.PetToyList:
        return S2CMediaList.deserialize(reader, listId, glDefType)
      case DefType.Fact:
        return S2CFactList.deserialize(reader, listId);
      case DefType.Stream:
        return S2CStreamList.deserialize(reader, listId);
      case DefType.Avatar:
        return S2CAvatarList.deserialize(reader, listId);
      case DefType.NamebarBadge:
        return S2CNamebarBadgeList.deserialize(reader, listId);
      case DefType.Script:
        return S2CScriptList.deserialize(reader, listId);
      case DefType.Pet:
        return S2CPetList.deserialize(reader, listId);
      case DefType.EBook:
        return S2CEBookList.deserialize(reader, listId);
      case DefType.Game:
      case DefType.Party:
      case DefType.Newspaper:
        return S2CSimpleList.deserialize(reader, listId, glDefType);
      case DefType.InWorldItems:
        return S2CInWorldItemList.deserialize(reader, listId);
      default:
        throw new Error(`Unhandled DefType ${DefType[glDefType]} (${glDefType})`)
    }
  }

  constructor(
    public listId: number
  ) {}
}

import { S2CLocalizationList } from "./types/localizationList";
import { S2CMediaList } from "./types/mediaList";
import { S2CPetList } from "./types/petList";
import { S2CScriptList } from "./types/scriptList";
import { S2CShopListResponse } from "./types/shopList";
import { S2CSimpleList } from "./types/simpleList";
import { S2CStreamList } from "./types/streamList";
import { S2CEBookList } from "./types/eBookList";
import { S2CInWorldItemList } from "./types/inWorldItemList";import { S2CFactList } from "./types/factList";
import { S2CAvatarList } from "./types/avatarList";
import { S2CNamebarBadgeList } from "./types/namebarBadgeList";

