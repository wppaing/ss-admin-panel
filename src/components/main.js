import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <Container>
      <Stack
        direction="column"
        spacing={4}
        // border="1px solid black"
        // borderRadius={2}
        padding="1rem"
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" textAlign="center">
            Welcome to admin panel
          </Typography>
        </Box>
        <Stack direction="column" spacing={2} alignItems="center">
          <Link to="/upload-artist">
            <Button variant="contained">Upload artist</Button>
          </Link>
          <Link to="/create-album">
            <Button variant="contained">Create album</Button>
          </Link>
          <Link to="/upload-song">
            <Button variant="contained">Upload song</Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
