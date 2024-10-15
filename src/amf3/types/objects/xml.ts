import { BinaryReader } from "../../../utils/binary";
import { CacheTypes } from "../../context";

export class Amf3Xml {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, header: number) {
    return new Amf3Xml(reader.readString(header))
  }

  constructor(
    public xmlString: string,
  ) {}
}
