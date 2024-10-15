import { BinaryReader } from "../../../utils/binary";
import { CacheTypes } from "../../context";

export class Amf3XmlDoc {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, header: number) {
    return new Amf3XmlDoc(reader.readString(header))
  }

  constructor(
    public xmlDocString: string,
  ) {}
}
