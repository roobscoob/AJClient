import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";
import { TradeDenItem, TradeItem, TradePetItem } from "./items";

export class S2CTradeList {
  static deserialize(data: StringArrayReader) {
    const clothingItems = data.readTaggedObjectArray(TradeItem);
    const denItems = data.readTaggedObjectArray(TradeDenItem);
    const petItems = data.readTaggedObjectArray(TradePetItem);

    return new S2CTradeList(clothingItems, denItems, petItems)
  }

  constructor(
    public clothingItems: TradeItem[],
    public denItems: TradeDenItem[],
    public petItems: TradePetItem[],
  ) {}

  serialize() {
    return StringArrayWriter
      .writeTaggedObjectArray(this.clothingItems)
      .writeTaggedObjectArray(this.denItems)
      .writeTaggedObjectArray(this.petItems);
  }
}
