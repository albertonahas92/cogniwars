import React from "react"
import { Box, Button, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { Challenge } from "../../types/challenge"
import { GameItem, gamesData } from "../../utils/helpers"

const Wrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
  padding: ${theme.spacing(1)};
  justify-content:center;
  align-items: center;
`
)

const ChallengeOnboarding = ({
  challenge,
  onReady,
}: {
  challenge?: Challenge
  onReady?: () => void
}) => {
  //state gameDetails
  const [gameDetails, setGameDetails] = React.useState<GameItem>()

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
        <Box sx={{ p: 1 }}>
          {gameDetails?.instructions?.map((instruction, index) => (
            <Typography variant="body1" color="text.secondary" key={index}>
              {instruction}
            </Typography>
          ))}
        </Box>
        {onReady && (
          <Button variant="contained" onClick={onReady}>
            Ready!
          </Button>
        )}
      </Wrapper>
    </Box>
  )
}

export default ChallengeOnboarding
