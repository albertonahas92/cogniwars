import { styled } from "@mui/system"
import React, { useEffect } from "react"

const Pad = styled("div")`
  display: grid;
  padding: 10px;
  border-radius: 10px;
  color: #333;
  margin: auto;
  max-width: 80vw;
  @media only screen and (min-width: 600px) {
    max-width: 35vw;
  }
`

const PadButton = styled("span")`
  align-items: center;
  appearance: none;
  background-color: #fcfcfd;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.3) 0 2px 4px,
    rgba(45, 35, 66, 0.2) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395a;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
  margin: 2px;

  &:focus {
    box-shadow: #d6d6e7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
  }
  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
    transform: translateY(-2px);
  }
  &:active {
    box-shadow: #d6d6e7 0 3px 7px inset;
    transform: translateY(2px);
  }
`

export const Numpad = ({ setNumber, onOkClickEnter }: Props) => {
  const onNumberClick = (num: number) => {
    setNumber((number: string) => number + num.toString())
  }
  const onMinusClick = () => {
    setNumber((number: string) => {
      if (number === "-") {
        return ""
      }
      if (number.length > 0) {
        return (parseInt(number, 10) * -1).toString()
      }
      return `-${number}`
    })
  }

  const onBackspaceClick = () => {
    setNumber((number: string) => {
      if (number.toString().length <= 1 || number === "-") return ""
      return number.substr(0, number.toString().length - 1)
    })
  }

  const onKeyDown = (e: any) => {
    console.log(e.which)

    const key = e.which
    if (key >= 48 && key <= 57) {
      // the enter key code or right arrow
      onNumberClick(key - 48)
    } else if (key === 13) {
      // Enter
      onOkClickEnter()
    } else if (key === 109 || key === 189) {
      // Minus
      onMinusClick()
    } else if (key === 8) {
      // Backspace
      onBackspaceClick()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Pad>
      {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((n) => (
        <PadButton
          key={n}
          role="button"
          aria-label="right-button"
          tabIndex={0}
          onClick={() => {
            onNumberClick(n)
          }}
        >
          {n}
        </PadButton>
      ))}
      <PadButton
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onMinusClick}
        className="minus"
      >
        -
      </PadButton>
      <PadButton
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onBackspaceClick}
        className="backspace"
      >
        {"<-"}
      </PadButton>
      <PadButton
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onOkClickEnter}
        style={{ gridColumn: "1 /PadButton 3" }}
      >
        Enter
      </PadButton>
    </Pad>
  )
}

interface Props {
  setNumber: (setNumber: (number: string) => string) => void
  onOkClickEnter: () => void
}
