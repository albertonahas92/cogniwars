import { FC } from "react"
import { Box, Button, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTheme } from "@mui/system"
import { Brain } from "../../icons/Brain"

const BrainWrapper = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  width: 300px;
  @media (max-width: 767px) {
    width: 250px;
  }
  margin: auto;
`

export var Landing: FC<Props> = function (props) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        flexGrow: 1,
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: `url('/assets/imgs/${
          theme.palette.mode === "dark" ? "particles" : "particles"
        }.svg') !important`,
      }}
    >
      <BrainWrapper sx={{ m: 2 }}>
        <Brain />
      </BrainWrapper>
      <Typography
        sx={{ fontWeight: "400", fontSize: { md: "4em", xs: "3em" } }}
        variant="h1"
        aria-label="Cogniwars"
        color="primary.light"
      >
        Cogniwars
      </Typography>
      <Typography
        sx={{
          m: 2,
          fontSize: "18px",
          fontWeight: 400,
          px: { xs: "2.5rem", md: 0 },
        }}
        variant="h2"
        color="text.primary"
      >
        The best brain training game
      </Typography>
      <Button
        color="primary"
        fullWidth
        size="large"
        onClick={props.login}
        sx={{
          width: 200,
          mt: 3,
        }}
        aria-label="get started"
        variant="contained"
      >
        Get started
      </Button>
    </Box>
  )
}

interface Props {
  login: () => void
}
