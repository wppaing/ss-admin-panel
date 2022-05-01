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
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function CreateAlbum() {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState([]);
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [showImg, setShowImg] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length === 0) {
        setOptions([]);
      } else {
        search(keyword);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const valueSelector = (event, newValue) => {
    const val = [];
    newValue.map((value) => {
      val.push({ id: value.id, name: value.name });
    });
    setArtists(val);
  };

  const search = async (kw) => {
    const config = {
      method: "get",
      url: `https://api-streamservice-ss.herokuapp.com/api/search?keyword=${kw}&limit=5&type=Artist`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios(config)
      .then((response) => {
        setOptions(response.data.section_list);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const imageHandler = (e) => {
    const fileTypes = ["image/jpeg", "image/png"];
    const img = e.target.files[0];
    if (fileTypes.includes(img.type)) {
      setImage(img);
      setShowImg(URL.createObjectURL(img));
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(null);
    setIsLoading(true);
    const data = new FormData();
    data.append("name", name);
    data.append("genre", genre);
    data.append("description", desc);
    data.append("image", image);
    artists.map((el, index) => {
      data.append(`artist_list[${index}][id]`, el.id);
      data.append(`artist_list[${index}][name]`, el.name);
    });
    const config = {
      method: "post",
      url: "https://api-streamservice-ss.herokuapp.com/admin/create-album",
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
              Album creator
            </Typography>
            <FormControl sx={{ width: "100%" }} required={true}>
              <Stack direction="column" spacing={2} mb={2}>
                <TextField
                  label="Album Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Genre"
                  onChange={(e) => setGenre(e.target.value)}
                />
                <Autocomplete
                  multiple
                  disablePortal
                  freeSolo
                  id="combo-box-demo"
                  options={options}
                  filterOptions={(x) => x}
                  onChange={valueSelector}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Artist List"
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
                        alt="Picture"
                      />
                      {option.name}
                    </Box>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.name} {...getTagProps({ index })} />
                    ))
                  }
                />
                <TextField
                  label="Description"
                  multiline
                  minRows={4}
                  onChange={(e) => setDesc(e.target.value)}
                />
                {err && <Alert severity="error">{err.message}</Alert>}
                {success && <Alert severity="success">Success</Alert>}
                <FormLabel htmlFor="chooseimage">Choose image</FormLabel>
                <input
                  id="chooseimage"
                  type="file"
                  accept="image/*"
                  onChange={imageHandler}
                />
                {image && (
                  <>
                    <img
                      src={showImg}
                      alt="Album cover"
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "auto",
                        marginTop: "2rem",
                        borderRadius: "0.2rem",
                      }}
                    />
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
