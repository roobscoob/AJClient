import { DefType } from "../../../../../utils/defType";
import { StringArrayReader } from "../../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../../utils/strArrayWriter";
import { S2CGenericList } from "../genericList";

type AllShopLists =
  | S2CClothingShopListResponse
  | S2CDenItemShopListResponse
  | S2CDenRoomShopListResponse
  | S2CCurrencyExchangeShopListResponse
  | S2CDiamondShopListResponse
  | S2CCombinedShopListResponse

type StaticAllShopLists =
  | typeof S2CClothingShopListResponse
  | typeof S2CDenItemShopListResponse
  | typeof S2CDenRoomShopListResponse
  | typeof S2CCurrencyExchangeShopListResponse
  | typeof S2CDiamondShopListResponse
  | typeof S2CCombinedShopListResponse

//@ts-ignore
export abstract class S2CShopListResponse extends S2CGenericList {
  static getShopListForDefType(defType: DefType): StaticAllShopLists {
    if (defType === DefType.Clothing)
      return S2CClothingShopListResponse;

    if (defType === DefType.DenItem)
      return S2CDenItemShopListResponse;

    if (defType === DefType.DenRoom)
      return S2CDenRoomShopListResponse;

    if (defType === DefType.CurrencyExchange)
      return S2CCurrencyExchangeShopListResponse;

    if (defType === DefType.Diamond)
      return S2CDiamondShopListResponse;

    if (defType === DefType.Combined)
      return S2CCombinedShopListResponse;

    throw new Error("No shop list for DefType " + DefType[defType] + ` (${defType})`)
  }

  static deserialize(reader: StringArrayReader, listId: number, glDefType: DefType): AllShopLists {
    const shopName = reader.readString();
    reader.skip(1);
    const diamondPurchaseAll = reader.readNumericBoolean();
    const diamondCost = reader.readInt();

    return this
      .getShopListForDefType(glDefType)
      .deserialize(reader, listId, shopName, diamondPurchaseAll, diamondCost)
  }

  constructor(
    listId: number,
    public shopName: string,
    public diamondPurchaseAll: boolean,
    public diamondCost: number,
  ) { super(listId) }
}

//@ts-ignore
export class S2CClothingShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CClothingShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readTaggedArray(r => r.readInt())
    );
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CClothingShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readArray(itemCount, r => r.readInt())
    )
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public clothingItemDefIds: number[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Clothing)
      .writeStrings(this.shopName)
      .skip(1)
      .writeNumericBooleans(this.diamondPurchaseAll)
      .writeNumbers(this.diamondCost)
      .writeTaggedArray(this.clothingItemDefIds, i => [ i.toString() ])
  }
}

//@ts-ignore
export class S2CDenItemShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDenItemShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readTaggedArray(r => r.readInt())
    );
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDenItemShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readArray(itemCount, r => r.readInt())
    )
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public denItemDefIds: number[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.DenItem)
      .writeStrings(this.shopName)
      .skip(1)
      .writeNumericBooleans(this.diamondPurchaseAll)
      .writeNumbers(this.diamondCost)
      .writeTaggedArray(this.denItemDefIds, i => [i.toString()])
  }
}

// @ts-ignore
export class S2CDenRoomShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDenRoomShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readTaggedArray(r => r.readInt())
    );
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDenRoomShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readArray(itemCount, r => r.readInt())
    )
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public denRoomDefIds: number[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.DenRoom)
      .writeStrings(this.shopName)
      .skip(1)
      .writeNumericBooleans(this.diamondPurchaseAll)
      .writeNumbers(this.diamondCost)
      .writeTaggedArray(this.denRoomDefIds, i => [i.toString()])
  }
}

// @ts-ignore
export class S2CCurrencyExchangeShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CCurrencyExchangeShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readTaggedArray(r => r.readInt())
    );
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CCurrencyExchangeShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readArray(itemCount, r => r.readInt())
    )
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public currencyExchangeDefIds: number[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.CurrencyExchange)
      .writeStrings(this.shopName)
      .skip(1)
      .writeNumericBooleans(this.diamondPurchaseAll)
      .writeNumbers(this.diamondCost)
      .writeTaggedArray(this.currencyExchangeDefIds, i => [i.toString()])
  }
}

// @ts-ignore
export class S2CDiamondShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDiamondShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readTaggedArray(r => r.readInt())
    );
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    return new S2CDiamondShopListResponse(
      listId,
      shopName,
      diamondPurchaseAll,
      diamondCost,
      reader.readArray(itemCount, r => r.readInt())
    )
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public diamondDefIds: number[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.listId, DefType.Diamond)
      .writeStrings(this.shopName)
      .skip(1)
      .writeNumericBooleans(this.diamondPurchaseAll)
      .writeNumbers(this.diamondCost)
      .writeTaggedArray(this.diamondDefIds, i => [i.toString()])
  }
}

//@ts-ignore
export class S2CCombinedShopListResponse extends S2CShopListResponse {
  static deserialize(reader: StringArrayReader, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    const itemCount = reader.readInt();

    if (itemCount === 0)
      return new S2CCombinedShopListResponse(listId, shopName, diamondPurchaseAll, diamondCost, []);

    return this.fromCombined(reader, itemCount, listId, shopName, diamondPurchaseAll, diamondCost);
  }

  static fromCombined(reader: StringArrayReader, itemCount: number, listId: number, shopName: string, diamondPurchaseAll: boolean, diamondCost: number) {
    const glDefTypes = reader
      .readDelimitatedArray(",")
      .readRemainingArray(r => r.readInt() as DefType);

    const itemCounts = reader
      .readDelimitatedArray(",")
      .readRemainingArray(r => r.readInt());

    let items: AllShopLists[] = [];

    for (let i = 0; i < glDefTypes.length; i++) {
      const glDefType = glDefTypes[i];
      const itemCount = itemCounts[i];

      items.push(S2CShopListResponse
        .getShopListForDefType(glDefType)
        .fromCombined(reader, itemCount, listId, shopName, diamondPurchaseAll, diamondCost));
    }

    return new S2CCombinedShopListResponse(listId, shopName, diamondPurchaseAll, diamondCost, items);
  }

  constructor(
    listId: number,
    shopName: string,
    diamondPurchaseAll: boolean,
    diamondCost: number,
    public contents: AllShopLists[],
  ) { super(listId, shopName, diamondPurchaseAll, diamondCost) }

  serialize(): StringArrayWriter {
    return StringArrayWriter.writeNumbers(this.listId, DefType.Combined);
  }
}
