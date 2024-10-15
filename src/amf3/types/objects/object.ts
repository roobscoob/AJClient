import { Amf3 } from "../..";
import { BinaryReader } from "../../../utils/binary";
import { CacheTypes, DeserializationContext } from "../../context";
import { Amf3String } from "../string";
import { Amf3Trait } from "../trait";

export class Amf3Object {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, header: number, context: DeserializationContext) {
    const trait = reader.read(context.Cacheable(Amf3Trait, header));

    if (trait.externalized)
      return reader.read(context.ExternalizableClass, trait.name.toString());

    const o = new Amf3Object();

    for (const key of reader.readUntil(context.Cacheable(Amf3String), c => trait.dynamic ? (s => s.length !== 0) : c < trait.traitCount)) {
      o[key.toString()] = Amf3.deserializeValue(reader, context);
    }

    return o;
  }

  [key: string]: string;
}
