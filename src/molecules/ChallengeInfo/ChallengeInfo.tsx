import React from "react"
import { Box, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { Challenge } from "../../types/challenge"
import { gamesData } from "../ChallengeSetupDialog/ChallengeSetupDialog"

const Wrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(1)};
  justify-content:center;
`
)

const ChallengeInfo = ({ challenge }: { challenge?: Challenge }) => {
  //state gameDetails
  const [gameDetails, setGameDetails] = React.useState<any>({})

  React.useEffect(() => {
    const details = gamesData.find((game) => game.key === challenge?.game)
    setGameDetails(details)
  }, [challenge?.game])

  return (
    <Box>
      <Wrapper>
        {gameDetails &&
          gameDetails.Icon &&
          React.createElement(gameDetails?.Icon, {
            fontSize: "large",
            sx: { color: "primary.main" },
          })}
        <Typography variant="h5" color="text.secondary">
          {gameDetails?.name}
        </Typography>
      </Wrapper>
    </Box>
  )
}

export default ChallengeInfo
