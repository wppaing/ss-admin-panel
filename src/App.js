import axios from "axios";
import qs from "qs";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Main from "./components/main";
import { Routes, Route } from "react-router-dom";
import ArtistUploader from "./components/artistUploader";
import CreateAlbum from "./components/createAlbum";
import SongUploader from "./components/songUploader";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showpw, setShowpw] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
        const token = response.data.token;
        localStorage.setItem("token", token);
        setToken(token);
      })
      .catch((error) => {
        setLoading(false);
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
                  <form style={{ width: "100%" }}>
                    <FormControl fullWidth variant="outlined">
                      <TextField
                        type="email"
                        required
                        label="Email"
                        margin="normal"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <TextField
                        required
                        type={showpw ? "text" : "password"}
                        label="Password"
                        margin="normal"
                        sx={{ marginBottom: 2 }}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowpw(!showpw)}
                              >
                                {showpw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        onClick={loginHandler}
                        variant="contained"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            Logging in
                            <CircularProgress
                              color="inherit"
                              size="1rem"
                            />{" "}
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </FormControl>
                  </form>
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
