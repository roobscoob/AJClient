import { BinaryReader, BinaryWriter } from "../utils/binary";
import { DeserializationContext } from "./context";
import { Amf3Array } from "./types/objects/array";
import { Amf3ByteArray } from "./types/objects/byteArray";
import { Amf3Date } from "./types/objects/date";
import { Amf3Object } from "./types/objects/object";
import { Amf3VectorFloat, Amf3VectorInt, Amf3VectorObject, Amf3VectorUInt } from "./types/objects/vector";
import { Amf3Xml } from "./types/objects/xml";
import { Amf3XmlDoc } from "./types/objects/xmlDoc";
import { Amf3String } from "./types/string";

enum AmfValueType {
  Undefined,
  Null,
  False,
  True,
  Integer,
  Double,
  String,
  XmlDoc,
  Date,
  Array,
  Object,
  Xml,
  ByteArray,
  VectorInt,
  VectorUint,
  VectorDouble,
  VectorObject,
  Dictionary
}

export class Amf3 {
  static deserialize(buffer: Buffer | DataView | ArrayBuffer | BinaryWriter, externalizableClasses: Record<string, (r: BinaryReader) => any> = {}) {
    const reader = BinaryReader.from(buffer);
    const value = Amf3.deserializeValue(reader, new DeserializationContext(externalizableClasses));

    // if (reader.countRemainingBytes() > 0)
    //   throw new Error(`Failed to read entire value ${(reader as any).readHead}`);

    return value;
  }

  static deserializeValue(reader: BinaryReader, context: DeserializationContext) {
    const type: AmfValueType = reader.readUInt8();

    switch (type) {
      case AmfValueType.Undefined:    return undefined;
      case AmfValueType.Null:         return null;
      case AmfValueType.False:        return false;
      case AmfValueType.True:         return true;
      case AmfValueType.Integer:      return reader.readUInt29();
      case AmfValueType.Double:       return reader.readFloat64LE();
      case AmfValueType.String:       return reader.read(context.Cacheable(Amf3String));
      case AmfValueType.XmlDoc:       return reader.read(context.Cacheable(Amf3XmlDoc));
      case AmfValueType.Date:         return reader.read(context.Cacheable(Amf3Date));
      case AmfValueType.Array:        return reader.read(context.Cacheable(Amf3Array));
      case AmfValueType.Object:       return reader.read(context.Cacheable(Amf3Object));
      case AmfValueType.Xml:          return reader.read(context.Cacheable(Amf3Xml));
      case AmfValueType.ByteArray:    return reader.read(context.Cacheable(Amf3ByteArray));
      case AmfValueType.VectorInt:    return reader.read(context.Cacheable(Amf3VectorInt));
      case AmfValueType.VectorUint:   return reader.read(context.Cacheable(Amf3VectorUInt));
      case AmfValueType.VectorDouble: return reader.read(context.Cacheable(Amf3VectorFloat));
      case AmfValueType.VectorObject: return reader.read(context.Cacheable(Amf3VectorObject));
      // Dictionary
      default:
        throw new Error(`Unknown value type marker ${type} at ${(reader as any).readHead}`)
    }
  }
}
