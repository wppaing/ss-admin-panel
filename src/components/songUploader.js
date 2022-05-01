import {
  Box,
  Container,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Stack,
  Alert,
  FormLabel,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function UploadSong() {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [albumOptions, setAlbumOptions] = useState([]);
  const [name, setName] = useState("");
  const [album, setAlbum] = useState({});
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("");
  const [duration, setDuration] = useState(0);
  const [lrc, setLrc] = useState("");
  const [song, setSong] = useState(null);
  const [showSong, setShowSong] = useState(null);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length === 0) {
        setAlbumOptions([]);
      } else {
        search(keyword);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const search = async (kw) => {
    const config = {
      method: "get",
      url: `https://api-streamservice-ss.herokuapp.com/api/search?keyword=${kw}&limit=5&type=Album`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios(config)
      .then((response) => {
        setAlbumOptions(response.data.section_list);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const songHandler = (e) => {
    const fileTypes = ["audio/x-m4a", "audio/mpeg"];
    const song = e.target.files[0];
    if (fileTypes.includes(song.type)) {
      setSong(song);
      setShowSong(URL.createObjectURL(song));
      const audio = new Audio(URL.createObjectURL(song));
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    if (!album.name) {
      setErr({ message: "Album data needed" });
      return;
    }
    setErr(null);
    setSuccess(null);
    setIsLoading(true);
    const data = new FormData();
    data.append("name", name);
    data.append("genre", genre);
    data.append("lrc_content", lrc);
    data.append("play_duration", duration);
    data.append("language", lang);
    data.append("album_id", album.id);
    data.append("album_name", album.name);
    album.artist_list.map((el, index) => {
      data.append(`artist_list[${index}][id]`, el.id);
      data.append(`artist_list[${index}][name]`, el.name);
    });
    data.append("song", song);
    const config = {
      method: "post",
      url: "https://api-streamservice-ss.herokuapp.com/admin/upload-song",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };
    await axios(config)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
        setSuccess(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        setErr(error);
      });
  };

  return (
    <>
      {localStorage.getItem("token") == null ? (
        <Navigate to="/" />
      ) : (
        <Container maxWidth="sm">
          <Stack
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingY: "2rem",
              marginBottom: "1rem",
            }}
            spacing={3}
            justifyContent="center"
          >
            <Typography variant="h4" fontWeight="medium" textAlign="center">
              Song Uploader
            </Typography>
            <FormControl sx={{ width: "100%" }} required={true}>
              <Stack direction="column" spacing={2} mb={3}>
                <TextField
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Autocomplete
                  disablePortal
                  freeSolo
                  id="albumdata"
                  options={albumOptions}
                  filterOptions={(x) => x}
                  onChange={(e, val) => setAlbum(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Album"
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  )}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{
                        "& > img": {
                          mr: 2,
                          flexShrink: 0,
                          borderRadius: "0.2rem",
                        },
                      }}
                      {...props}
                    >
                      <img
                        loading="lazy"
                        width="40"
                        src={option.images[0]}
                        alt="Profile"
                      />
                      {option.name}
                    </Box>
                  )}
                />
                <TextField
                  label="Genre"
                  onChange={(e) => setGenre(e.target.value)}
                />
                <TextField
                  label="Language"
                  onChange={(e) => setLang(e.target.value)}
                />
                <TextField
                  label="Lyrics"
                  multiline
                  minRows={4}
                  onChange={(e) => setLrc(e.target.value)}
                />
                {err && <Alert severity="error">{err.message}</Alert>}
                {success && <Alert severity="success">Success</Alert>}
                <FormLabel htmlFor="choosesong">Choose song</FormLabel>
                <input
                  id="choosesong"
                  type="file"
                  accept="audio/*"
                  onChange={songHandler}
                />
                {showSong && (
                  <>
                    <audio src={showSong} controls></audio>
                  </>
                )}
              </Stack>
              <Button
                variant="contained"
                onClick={uploadHandler}
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    Uploading...
                    <CircularProgress color="inherit" size="1rem" />
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </FormControl>
          </Stack>
        </Container>
      )}
    </>
  );
}
