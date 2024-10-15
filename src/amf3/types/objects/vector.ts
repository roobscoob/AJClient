import { Amf3 } from "../..";
import { BinaryReader } from "../../../utils/binary";
import { CacheTypes, DeserializationContext } from "../../context";
import { Amf3String } from "../string";

export class Amf3VectorInt extends Int32Array {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, size: number, context: DeserializationContext) {
    const isFixedLength = reader.readBoolean();
    const v = new Amf3VectorInt(size);

    for (let i = 0; i < size; i++) {
      v[i] = reader.readSInt29();
    }

    v.isFixedLength = isFixedLength;

    return v;
  }

  public isFixedLength: boolean = false;
}

export class Amf3VectorUInt extends Uint32Array {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, size: number, context: DeserializationContext) {
    const isFixedLength = reader.readBoolean();
    const v = new Amf3VectorUInt(size);

    for (let i = 0; i < size; i++) {
      v[i] = reader.readUInt29();
    }

    v.isFixedLength = isFixedLength;

    return v;
  }

  public isFixedLength: boolean = false;
}

export class Amf3VectorFloat extends Float64Array {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, size: number, context: DeserializationContext) {
    const isFixedLength = reader.readBoolean();
    const view = reader.readBytes(size * Float64Array.BYTES_PER_ELEMENT).getBuffer();
    const v = new Amf3VectorFloat(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength));

    v.isFixedLength = isFixedLength;

    return v;
  }

  public isFixedLength: boolean = false;
}

export class Amf3VectorObject<T = unknown> extends Array<T> {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, size: number, context: DeserializationContext) {
    const isFixedLength = reader.readBoolean();
    const v = new Amf3VectorObject(size);

    v.isFixedLength = isFixedLength;
    v.typeName = reader.read(context.Cacheable(Amf3String));

    for (let i = 0; i < size; i++) {
      v[i] = Amf3.deserializeValue(reader, context);
    }

    return v;
  }

  public isFixedLength: boolean = false;
  public typeName: Amf3String = new Amf3String("");
}
