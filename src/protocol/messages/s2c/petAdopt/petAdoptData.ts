import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class S2CPetAdoptData {
  static deserialize(reader: StringArrayReader) {
    const status = reader.readString(); // Boolean

    console.log("Status: " + status);

    return new S2CPetAdoptData(
      status,
      reader.readTaggedArray(r => ({ defId: r.readInt(), invId: r.readInt() })),
    );
  }

  constructor(
    public status: string,
    public adoptAPetData: { defId: number, invId: number }[],
  ) { }

  serialize() {
    return StringArrayWriter
      .writeStrings(this.status)
      .writeTaggedArray(this.adoptAPetData, adoptAPetData => StringArrayWriter.writeNumbers(adoptAPetData.defId, adoptAPetData.invId));
  }
}
