import React, { useEffect } from "react"
import { Box, styled } from "@mui/system"
import { ControlHeading1 } from "../ControlPage"
import { useAnalytics } from "../../../hooks/useAnalytics"

export var SubmitLink = styled("a")(
  ({ theme }) => `
  text-decoration: none;
  color: ${theme.palette.primary.main};
  cursor: pointer;
`
)

export var About = function () {
  const { logEvent } = useAnalytics()
  useEffect(() => {
    logEvent("about_page_viewed")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ControlHeading1 variant="h1" color="primary">
        About us
      </ControlHeading1>
      <Box sx={{ textAlign: "left" }}>
        <p>
          Cogniwars is a brain training game that offers many games to stimulate
          your brain which translates into improvements in cognitive functioning
          and decision making in everyday life.
        </p>
      </Box>
    </>
  )
}
