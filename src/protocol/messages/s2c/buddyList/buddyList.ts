import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";
import { Buddy } from "./buddy";

export abstract class S2CBuddyList {
  static deserialize(reader: StringArrayReader) {
    if (reader.readNumericBoolean())
      return S2CBuddyListBlocks.deserialize(reader);
    else
      return S2CBuddyListBuddies.deserialize(reader);
  }
}

export class S2CBuddyListBuddies extends S2CBuddyList {
  static deserialize(reader: StringArrayReader) {
    return new S2CBuddyListBuddies(
      reader.readTaggedObjectArray(Buddy, true),
      reader.readTaggedObjectArray(Buddy, false),
    );
  }

  constructor(
    public onlineBuddies: Buddy[],
    public offlineBuddies: Buddy[],
  ) { super() }

  serialize() {
    return StringArrayWriter
      .writeNumericBooleans(false)
      .writeTaggedObjectArray(this.onlineBuddies)
      .writeTaggedObjectArray(this.offlineBuddies);
  }
}

export class S2CBuddyListBlocks extends S2CBuddyList {
  static deserialize(reader: StringArrayReader) {
    return new S2CBuddyListBlocks(reader.readTaggedArray(reader => reader.readString()));
  }

  constructor(
    public names: string[],
  ) { super() }

  serialize() {
    return StringArrayWriter
      .writeNumericBooleans(true)
      .writeNumbers(this.names.length)
      .writeStrings(...this.names);
  }
}
