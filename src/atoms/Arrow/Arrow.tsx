import React from "react"
import { styled } from "@mui/system"
import { ButtonBase } from "@mui/material"

export const DIR_RIGHT = true
export const DIR_LEFT = false

const ArrowShape = styled(ButtonBase)<{
  direction: Boolean
}>(
  ({ direction }) => `
  position:absolute;
  top:40vh;
  padding:50px;
${direction === DIR_RIGHT ? `right:0` : `left:0`};
& i{
    border: solid black;
    border-width: 0 6px 6px 0;
    display: inline-block;
    padding: 12px;
    border-color:#666;
    transform: rotate(${direction === DIR_RIGHT ? `-45` : `135`}deg);
}`
)

export const Arrow = ({
  direction,
  onClick,
}: {
  direction: boolean
  onClick: () => void
}) => {
  const dir = direction === DIR_RIGHT ? "right" : "left"
  return (
    <ArrowShape
      aria-label={`${dir}-button`}
      direction={direction}
      tabIndex={0}
      onClick={onClick}
    >
      <i></i>
    </ArrowShape>
  )
}
