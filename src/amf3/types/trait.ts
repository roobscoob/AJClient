import { BinaryReader } from "../../utils/binary";
import { CacheTypes, type DeserializationContext } from "../context";
import { Amf3String } from "./string";

export class Amf3Trait {
  static CacheType = CacheTypes.ClassTrait;

  static deserialize(reader: BinaryReader, header: number, context: DeserializationContext) {
    const isExternalized = (header & 1) !== 0; header >>= 1;
    const isDynamic = (header & 1) !== 0; header >>= 1;
    const traitCount = header;

    return new Amf3Trait(
      reader.read(context.Cacheable(Amf3String)),
      isExternalized,
      isDynamic,
      traitCount,
    )
  }

  constructor(
    public name: Amf3String,
    public externalized: boolean,
    public dynamic: boolean,
    public traitCount: number,
  ) {}
}
