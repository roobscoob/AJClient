import { BinaryReader } from "./reader";

export class BitReader {
    constructor(
        protected readonly reader: BinaryReader,
    ) {}

    protected store: number = 0;
    protected knownBits: number = 0;

    private readNextByte() {
        const b = this.reader.readUInt8();
        this.store = this.store << 8 | b;
        this.knownBits += 8;
    }

    readSignedBits(count: number) {
        const unsigned = this.readUnsignedBits(count);
        const sign = unsigned >> (count - 1)
        
        if (!sign)
            return unsigned;

        return 0xf_ffffff_ffffff & unsigned;
    }

    readUnsignedBits(count: number) {
        while (count > this.knownBits)
            this.readNextByte();

        this.knownBits -= count;
        const returnValue = this.store >> this.knownBits;
        this.store &= (1 << this.knownBits) - 1;

        return returnValue;
    }
}
