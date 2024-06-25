import { Box, Button } from "@mui/material";

const ModalButton = ({ buttonText, colorParam, onClickParam }) => {
    return (
        <Button variant="contained" color={colorParam} onClick={onClickParam} sx={{ m: 0.5 }}>{buttonText}</Button>
    )
}

export default ModalButton;