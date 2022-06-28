import { ButtonBase } from "@mui/material"
import { styled } from "@mui/system"
import { FC } from "react"
import { getBlockSizeStyle, getSquareSize } from "../../utils/boardHelpers"

const BoardRow = styled("div")`
  display: flex;
`

const BoardBlock = styled(ButtonBase)<{
  active: Boolean
  invalid: Boolean
  size: string
}>(
  ({ theme, active, invalid, size }) => `
  display: block;
  background-color: ${
    active
      ? invalid
        ? theme.palette.action.active
        : theme.palette.primary.light
      : theme.palette.action.disabled
  };
  margin: 2px;
  border: 2px solid ${theme.palette.background.paper};
  border-radius: 5px;
  transition:background-color 0.1s ease-in-out;
  ${getBlockSizeStyle(size)}
  `
)

export const GameBoard: FC<Props> = ({
  boardDimensions,
  clickedSqaures,
  activeSqures,
  showActiveSqures,
  showClickedSquares,
  onClickSqaure,
  ordered,
}) => {
  const displayLevel = () => {
    let current = -1
    return [...Array(boardDimensions).keys()].map((row) => (
      <BoardRow key={row}>
        {[...Array(boardDimensions).keys()].map(() => {
          current += 1
          const isActive =
            (activeSqures.indexOf(current) > -1 && showActiveSqures) ||
            (clickedSqaures.indexOf(current) > -1 && showClickedSquares)
          const isInvalid =
            clickedSqaures.indexOf(current) > -1 &&
            ((ordered &&
              activeSqures.indexOf(current) !==
                clickedSqaures.indexOf(current)) ||
              (!ordered && activeSqures.indexOf(current) === -1))
          return (
            <BoardBlock
              focusRipple
              key={current}
              role="button"
              aria-label="block"
              tabIndex={current}
              active={isActive}
              invalid={isInvalid}
              onMouseDown={(e: any) => onClickSqaure(e.target.tabIndex)}
              size={getSquareSize(boardDimensions)}
            ></BoardBlock>
          )
        })}
      </BoardRow>
    ))
  }

  return <div>{displayLevel()}</div>
}

interface Props {
  boardDimensions: number
  clickedSqaures: number[]
  activeSqures: number[]
  showActiveSqures: boolean
  showClickedSquares: boolean
  onClickSqaure: (index: number) => void
  ordered?: boolean
}
