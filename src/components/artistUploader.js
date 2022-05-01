import {
  FormControl,
  Stack,
  TextField,
  Button,
  Container,
  FormLabel,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function ArtistUploader() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [showimg, setShowImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setIsLoading(true);
    setErr(null);
    setSuccess(null);
    const data = new FormData();
    data.append("name", name);
    data.append("country", country);
    data.append("description", desc);
    data.append("image", image);
    const config = {
      method: "post",
      url: "https://api-streamservice-ss.herokuapp.com/admin/upload-artist",
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
            justifyContent="center"
            sx={{
              minHeight: "100vh",
              paddingY: "2rem",
              marginBottom: "1rem",
            }}
            spacing={3}
          >
            <Typography variant="h4" fontWeight="medium" textAlign="center">
              Artist Uploader
            </Typography>
            <FormControl sx={{ width: "100%" }} required={true}>
              <Stack direction="column" spacing={2} mb={2}>
                <TextField
                  label="Artist Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Country"
                  onChange={(e) => setCountry(e.target.value)}
                />
                <TextField
                  label="Description"
                  multiline
                  minRows={4}
                  onChange={(e) => setDesc(e.target.value)}
                />
                {err && <Alert severity="error">{err.message}</Alert>}
                {success && <Alert severity="success">Success</Alert>}
                <FormLabel>Choose image</FormLabel>
                <input
                  id="chooseimage"
                  type="file"
                  accept="image/*"
                  // style={{ display: "none" }}
                  onChange={imageHandler}
                />
                {/* <Button
            onClick={() => document.getElementById("chooseimage").click()}
          >
            Choose
          </Button> */}
                {image && (
                  <Stack>
                    <img
                      src={showimg}
                      alt="Artist Profile"
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "auto",
                        marginTop: "2rem",
                        borderRadius: "0.2rem",
                      }}
                    />
                  </Stack>
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
