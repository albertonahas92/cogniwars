import { styled } from "@mui/system"
import { keyframes } from "@emotion/react"
import { ButtonBase } from "@mui/material"
import { getBlockSizeStyle } from "../../utils/boardHelpers"

export const nudge = keyframes`
0% {
  transform: rotate(-7deg);
}

33% {
  transform: rotate(7deg);
}

66% {
  transform: rotate(-7deg);
}`

export const ShapesBoard = styled("div")`
  box-sizing: border-box;
  line-height: 0;
  display: flex;
  justify-content: center;
  transition: all 500ms;
`
export const ShapesWrapper = styled("div")`
  display: flex;
`

export const ShapeBlock = styled(ButtonBase)<{
  active: Boolean
  invalid: Boolean
  size: string
}>(
  ({ theme, active, invalid, size }) => `
	display: block;
	background-color: #fff;
	border-radius: 5px;
	border: ${active ? `2px solid ${invalid ? "red" : "green"}` : "none"};
  ${getBlockSizeStyle(size)}
  `
)
