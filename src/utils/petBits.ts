export function unpackPetBits(lowerBits: number, upperBits: number, extraBits: number) {
  const catArray = [
    lowerBits >> 0  & 0xFF, // PetDef
    lowerBits >> 8  & 0x3F, // CurrentColor1Index
    lowerBits >> 14 & 0x1F, // CurrentColor2Index
    lowerBits >> 19 & 0x1F,
    lowerBits >> 24 & 0x0F,
    lowerBits >> 28 & 0x0F,
    upperBits >> 0  & 0x0F,
    upperBits >> 4  & 0x0F,
    upperBits >> 8  & 0x0F,
    upperBits >> 12 & 0x0F,
    upperBits >> 16 & 0x0F,
    upperBits >> 20 & 0x0F,
    extraBits >> 0  & 0x0F,
    extraBits >> 4  & 0x0F,
    extraBits >> 8  & 0x0F,
  ]


}
