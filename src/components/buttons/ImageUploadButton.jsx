import VisuallyHiddenInput from "../VisuallyHiddenInput";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageUploadButton = ({ handleFileChange }) => {
    return (
        <Button
            component="label"
            variant="contained"
            color="success"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ mr: 1, height: '100%' }}
        >
            Upload file
            <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChange(e)} />
        </Button>
    )
}

export default ImageUploadButton;