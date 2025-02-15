import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import CharacteristicService from "../../services/CharacteristicService";
import ProductCharacteristicValueService from "../../services/ProductCharacteristicValueService";
import ModalButton from "../buttons/ModalButton";
import ProductService from "../../services/ProductService";

const AssignCharacteristicValueModal = ({
  product,
  closeFunction,
  isOpen,
  setIsOpen,
}) => {
  const [characteristicsAndValues, setCharacteristicsAndValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    closeFunction();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const characteristicData =
          await CharacteristicService.listAssignedCharacteristics(
            product.article.category.id
          );
        const characteristicValuesData =
          await ProductCharacteristicValueService.findAllByProductId(
            product.id
          );

        const characteristicsAndValue = characteristicData.map(
          (characteristic) => {
            const assignedValue = characteristicValuesData.data.find(
              (value) => value.characteristic.id === characteristic.id
            );
            return {
              ...characteristic,
              value: assignedValue ? assignedValue.value : "",
            };
          }
        );

        setCharacteristicsAndValues(characteristicsAndValue);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && product) {
      fetchData();
    }
  }, [isOpen, product]);

  const modifyCharacteristicValue = (characteristicId, value) => {
    setCharacteristicsAndValues((prevCharacteristics) => {
      return prevCharacteristics.map((char) =>
        char.id === characteristicId ? { ...char, value: value } : char
      );
    });
  };

  const handleCreate = async () => {
    const response = await ProductService.assignProductCharacteristicValues(
      product,
      characteristicsAndValues
    );
    if (response.success) {
    } else {
      return { success: false };
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="assign-characteristic-value-modal"
      aria-describedby="modal-to-assign-characteristic-value"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "75%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "1px solid #81be83",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          Assign characteristic values to '{product.article.name}':
        </Typography>
        <hr />
        <Box>
          <Typography variant="subtitle2" component="div" gutterBottom>
            Product Characteristics
          </Typography>
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <Box sx={{ overflowY: "auto", maxHeight: 200 }}>
              {characteristicsAndValues.length > 0 ? (
                characteristicsAndValues.map((characteristic, index) => (
                  <FormControl
                    key={index}
                    sx={{ m: 1, width: "95%" }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor={`outlined-adornment-${index}`}>
                      {characteristic.name}
                    </InputLabel>
                    <OutlinedInput
                      id={`outlined-adornment-${index}`}
                      value={characteristic.value}
                      endAdornment={
                        <InputAdornment position="end">
                          {characteristic.unitOfMeasure
                            ? characteristic.unitOfMeasure
                            : ""}
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      onChange={(e) =>
                        modifyCharacteristicValue(
                          characteristic.id,
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                ))
              ) : (
                <Box>No characteristics are inherited.</Box>
              )}
            </Box>
          )}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <ModalButton
              buttonText="save"
              colorParam="success"
              onClickParam={handleCreate}
            />
            <ModalButton
              buttonText="close"
              colorParam="secondary"
              onClickParam={handleClose}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignCharacteristicValueModal;
