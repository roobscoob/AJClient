import { StringArrayReader } from "../../../../utils/strArrayReader";
import { StringArrayWriter } from "../../../../utils/strArrayWriter";

export class C2SRequestSetVariable {
  static deserialize(data: StringArrayReader) {
    const userVarId = data.readInt();
    const setValue = data.readInt();
    const bitState = data.readNumericBoolean();

    return new C2SRequestSetVariable(userVarId, setValue, bitState);
  }

  constructor(
    public userVarId: number,
    public setValue: number,
    public bitState: boolean = true,
  ) { }

  serialize() {
    return StringArrayWriter
      .writeNumbers(this.userVarId, this.setValue)
      .writeNumericBooleans(this.bitState);
  }
}
