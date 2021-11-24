import { Button, Box, Typography, Alert, Paper, TextField } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Upload from "./utils/upload";
import { debounce } from "lodash";

export default function Record(props) {
  const { password } = props;
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const onStop = (blobUrl, blob) => {
    setFile(new File([blob], name, { type: blob.type }));
  };
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream, error } = useReactMediaRecorder({ video: true, askPermissionOnMount: true, onStop: onStop });

  const handleNameChange = (evt) => {
    setName(evt.target.value + ".mp4");
  };

  const debouncedOverlayHandler = useCallback(debounce(handleNameChange, 300), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
          <Box>
            <TextField
              sx={{ m: 2 }}
              autoFocus
              variant="outlined"
              name="name"
              placeholder="File name"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              onChange={debouncedOverlayHandler}
              margin="dense"
            />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="body2">Status: {status}</Typography>
          {previewStream && previewStream.active && <VideoPreview stream={previewStream} />}
          {mediaBlobUrl && !previewStream.active && <video src={mediaBlobUrl} controls width="50%" />}
          <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
            <Box sx={{ m: 1 }}>
              <Button disabled={name.length === 0} variant="outlined" onClick={startRecording} color="nnys">
                Start Recording
              </Button>
            </Box>
            <Box sx={{ m: 1 }}>
              <Button disabled={name.length === 0} variant="outlined" onClick={stopRecording} color="nnys">
                Stop Recording
              </Button>
            </Box>
          </Box>
          <Upload file={file} password={password} />
        </Paper>
      </Box>
    </>
  );
}

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  if (!stream) return null;

  return <video ref={videoRef} width="50%" autoPlay />;
};