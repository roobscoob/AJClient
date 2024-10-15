import type { AnimalJamClient } from "../../../../client";
import { ScalableBitField } from "../../../../utils/scalableBitField";
import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

enum ItemListType {
  Failure = -1,
  Clothing = 0,
  ClothingInUse = 1,
  ItemsChanged = 2,
  ItemsCreatedDeleted = 3,
}

export abstract class S2CItemList {
  static deserialize(reader: StringArrayReader, context: AnimalJamClient) {
    const itemListType = reader.readEnum(ItemListType);

    switch (itemListType) {
      case ItemListType.Failure:
        return S2CItemListFailure.deserialize(reader);
      case ItemListType.Clothing:
      case ItemListType.ClothingInUse:
        return S2CClothingList.deserialize(reader, context, itemListType === ItemListType.ClothingInUse);
      case ItemListType.ItemsChanged:
      case ItemListType.ItemsCreatedDeleted:
        return S2CItemsChangedList.deserialize(reader, itemListType === ItemListType.ItemsCreatedDeleted)
    }
  }
}

export class S2CItemListFailure extends S2CItemList {
  static deserialize(reader: StringArrayReader) {
    reader.skip(1)

    return new S2CItemListFailure(reader.readInt(), reader.readString());
  }

  constructor(
    public perUserAvatarId: number,
    public userName: string,
  ) { super() }

  serialize() {
    return StringArrayWriter
      .writeNumbers(ItemListType.Failure).skip(1).writeNumbers(this.perUserAvatarId).writeStrings(this.userName);
  }
}

// @ts-ignore
export abstract class S2CClothingList extends S2CItemList {
  static deserialize(reader: StringArrayReader, context: AnimalJamClient, isInUseList: boolean) {
    reader.skip(1);

    const perUserAvatarId = reader.readInt();
    const userName = reader.readString();
    const patternInUseId = reader.readInt();
    const eyesInUseId = reader.readInt();

    if (userName.toLowerCase() === context.getUserName().toLowerCase())
      return S2CMyClothingList.deserialize(reader, isInUseList, perUserAvatarId, userName, patternInUseId, eyesInUseId);
    else
      return S2COthersClothingList.deserialize(reader, isInUseList, perUserAvatarId, userName, patternInUseId, eyesInUseId);
  }

  constructor(
    public perUserAvatarId: number,
    public userName: string,
    public patternInUseId: number,
    public eyesInUseId: number,
  ) { super() }
}

// @ts-ignore
export class S2CMyClothingList extends S2CClothingList {
  static deserialize(reader: StringArrayReader, isInUseList: boolean, perUserAvatarId: number, userName: string, patternInUseId: number, eyesInUseId: number) {
    return new S2CMyClothingList(isInUseList, perUserAvatarId, userName, patternInUseId, eyesInUseId, reader.readTaggedArray(r => ({
      itemDefId: r.readInt(),
      itemInvIdx: r.readInt(),
      itemColor: r.readInt(),
      equippedAvatars: r.readObject(ScalableBitField),
      itemDenStoreInvId: r.readInt(),
    })));
  }

  constructor(
    public isInUseList: boolean,
    perUserAvatarId: number,
    userName: string,
    patternInUseId: number,
    eyesInUseId: number,
    public items: {
      itemDefId: number,
      itemInvIdx: number,
      itemColor: number,
      equippedAvatars: ScalableBitField,
      itemDenStoreInvId: number,
    }[],
  ) { super(perUserAvatarId, userName, patternInUseId, eyesInUseId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(ItemListType.Clothing)
      .skip(1)
      .writeNumbers(this.perUserAvatarId)
      .writeStrings(this.userName)
      .writeNumbers(this.patternInUseId, this.eyesInUseId)
      .writeTaggedArray(this.items, i => StringArrayWriter
        .writeNumbers(i.itemDefId, i.itemInvIdx, i.itemColor)
        .writeObject(i.equippedAvatars)
        .writeNumbers(i.itemDenStoreInvId))
  }
}

// @ts-ignore
export class S2COthersClothingList extends S2CClothingList {
  static deserialize(reader: StringArrayReader, isInUseList: boolean, perUserAvatarId: number, userName: string, patternInUseId: number, eyesInUseId: number) {
    return new S2COthersClothingList(isInUseList, perUserAvatarId, userName, patternInUseId, eyesInUseId, reader.readTaggedArray(r => ({
      itemDefId: r.readInt(),
      itemInvIdx: r.readInt(),
      itemColor: r.readInt(),
    })));
  }

  constructor(
    public isInUseList: boolean,
    perUserAvatarId: number,
    userName: string,
    patternInUseId: number,
    eyesInUseId: number,
    public items: {
      itemDefId: number,
      itemInvIdx: number,
      itemColor: number,
    }[],
  ) { super(perUserAvatarId, userName, patternInUseId, eyesInUseId) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(ItemListType.Clothing)
      .skip(1)
      .writeNumbers(this.perUserAvatarId)
      .writeStrings(this.userName)
      .writeNumbers(this.patternInUseId, this.eyesInUseId)
      .writeTaggedArray(this.items, i => StringArrayWriter
        .writeNumbers(i.itemDefId, i.itemInvIdx, i.itemColor))
  }
}

// @ts-ignore
export class S2CItemsChangedList extends S2CItemList {
  static deserialize(reader: StringArrayReader, isCreatedDeleted: boolean) {
    const equipState = reader.readNumericBoolean();
    const perUserAvatarId = reader.readInt();
    const userName = reader.readString();
    const color = reader.readInt();
    const nowInUseCount = reader.readInt();
    const noLongerInUseCount = reader.readInt();

    const nowInUse = reader.readArray(nowInUseCount, r => ({ invIdx: r.readInt(), defId: r.readInt() }));
    const noLongerInUse = reader.readArray(noLongerInUseCount, r => ({ invIdx: r.readInt() }));

    return new S2CItemsChangedList(isCreatedDeleted, equipState, perUserAvatarId, userName, color, nowInUse, noLongerInUse);
  }

  constructor(
    public isCreatedDeleted: boolean,
    public equipState: boolean,
    public perUserAvatarId: number,
    public userName: string,
    public color: number,
    public nowInUse: { invIdx: number, defId: number }[],
    public noLongerInUse: { invIdx: number }[],
  ) { super() }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.isCreatedDeleted ? ItemListType.ItemsCreatedDeleted : ItemListType.ItemsChanged)
      .writeNumericBooleans(this.equipState)
      .writeNumbers(this.perUserAvatarId)
      .writeStrings(this.userName)
      .writeNumbers(this.color, this.nowInUse.length, this.noLongerInUse.length)
      .writeArray(this.nowInUse, i => StringArrayWriter.writeNumbers(i.invIdx, i.defId))
      .writeArray(this.noLongerInUse, i => StringArrayWriter.writeNumbers(i.invIdx));
  }
}
