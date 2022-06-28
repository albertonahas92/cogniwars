export const getSquaresCount = (lv: number) => 2 + lv
export const getBoardDimensions = (lv: number, factor = 3) =>
  factor + Math.floor(lv / factor)

export const getSquareSize = (boardDimensions: number) => {
  switch (true) {
    case boardDimensions < 4:
      return "l"
    case boardDimensions < 6:
      return "m"
    case boardDimensions < 8:
      return "s"
    default:
      return "xs"
  }
}

export const getBlockSizeStyle = (size: string) => {
  switch (size) {
    case "l":
      return `width: 100px;
        height: 100px;
        margin: 4px;
        border-radius: 8px;
        @media only screen and (max-width: 600px) {
          width: 20vw;
          height: 20vw;
        }`
    case "m":
      return `width: 75px;
        height: 75px;
        margin: 3px;
        border-radius: 6px;
        @media only screen and (max-width: 600px) {
          width: 15vw;
          height: 15vw;
          margin: 1px;
          border-width: 3px;
          border-radius: 8px;
        }`
    case "s":
      return `width: 50px;
        height: 50px;
        margin: 2px;
        @media only screen and (max-width: 600px) {
          width: 12vw;
          height: 12vw;
          margin: 1px;
        }`
    case "xs":
      return `width: 35px;
        height: 35px;
        margin: 1px;
        @media only screen and (max-width: 600px) {
          width: 8vw;
          height: 8vw;
          margin: 0px;
        }`

    default:
      return ""
  }
}
