import type { BinaryReader } from "../utils/binary";
import type { CacheTypes, DeserializationContext } from "./context";

export interface Cacheable<T> {
  CacheType: CacheTypes,
  deserialize(reader: BinaryReader, header: number, context: DeserializationContext): T
}
