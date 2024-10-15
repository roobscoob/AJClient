import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class TradeItem {
  static deserialize(reader: StringArrayReader) {
    return new TradeItem(
      reader.readInt(),
      reader.readInt(),
      reader.readInt(),
    )
  }

  constructor(
    public defId: number,
    public invIdx: number,
    public initColor: number,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.defId, this.invIdx, this.initColor);
  }
}

export class TradeDenItem {
  static deserialize(reader: StringArrayReader) {
    return new TradeDenItem(
      reader.readInt(),
      reader.readInt(),
      reader.readInt(),
      reader.readStringBoolean(),
      reader.readString(),
      reader.readInt(),
      reader.readString(),
    );
  }

  constructor(
    public itemDefId: number,
    public invIdx: number,
    public version: number,
    public isApproved: boolean,
    public uniqueImageId: string,
    public uniqueImageCreatorDbId: number,
    public uniqueImageCreatorUUID: string,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.itemDefId, this.invIdx, this.version)
      .writeStringBooleans(this.isApproved)
      .writeStrings(this.uniqueImageId)
      .writeNumbers(this.uniqueImageCreatorDbId)
      .writeStrings(this.uniqueImageCreatorUUID);
  }
}

export class TradePetItem {
  static deserialize(reader: StringArrayReader) {
    return new TradePetItem(
      reader.readInt(),
      reader.readInt(),
      reader.readFloat(),
      [ reader.readInt(), reader.readInt(), reader.readInt() ],
      reader.readString(),
      reader.readInt(),
      reader.readInt(),
      reader.readInt(),
    );
  }

  constructor(
    public defId: number,
    public invIdx: number,
    public createdTs: number,
    public petBits: [number, number, number],
    public petName: string,
    public traitDefId: number,
    public toyDefId: number,
    public foodDefId: number,
  ) {}

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.defId, this.invIdx, this.createdTs, ...this.petBits)
      .writeStrings(this.petName)
      .writeNumbers(this.traitDefId, this.toyDefId, this.foodDefId);
  }
}
