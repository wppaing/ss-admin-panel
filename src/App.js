import axios from "axios";
import qs from "qs";
import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Main from "./components/main";
import { Routes, Route } from "react-router-dom";
import ArtistUploader from "./components/artistUploader";
import CreateAlbum from "./components/createAlbum";
import SongUploader from "./components/songUploader";

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    const config = {
      method: "post",
      url: "https://api-streamservice-ss.herokuapp.com/login",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({ email, password }),
    };
    await axios(config)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        // setToken(token);
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred");
      });
  };

  return (
    <Box>
      <Routes>
        <Route path="/upload-artist" element={<ArtistUploader />} />
        <Route path="/create-album" element={<CreateAlbum />} />
        <Route path="/upload-song" element={<SongUploader />} />
        <Route
          path="/"
          element={
            <Container
              maxWidth="sm"
              sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {token ? (
                <Main />
              ) : (
                <>
                  <Box sx={{ marginBottom: "2rem" }}>
                    <Typography variant="h3">Log in to your account</Typography>
                  </Box>
                  <FormControl fullWidth>
                    <TextField
                      label="Email"
                      size="medium"
                      margin="normal"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      type="password"
                      label="Password"
                      margin="normal"
                      sx={{ marginBottom: 2 }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      onClick={loginHandler}
                      variant="contained"
                      type="submit"
                    >
                      Login
                    </Button>
                  </FormControl>
                </>
              )}
            </Container>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
