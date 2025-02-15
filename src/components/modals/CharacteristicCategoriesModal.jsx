import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import CharacteristicService from "../../services/CharacteristicService";
import renderAssignedCategoryTree from "../CharacteristicCategoryTreeRenderer";
import ModalButton from "../buttons/ModalButton";

const ShowCharacteristicCategoriesModal = ({
  characteristicId,
  closeFunction,
  isOpen,
  setIsOpen,
}) => {
  const [assignedCategoryTrees, setAssignedCategoryTrees] = useState([]);
  const [characteristic, setCharacteristic] = useState(undefined);

  const handleClose = () => {
    setIsOpen(false);
    closeFunction();
  };

  useEffect(() => {
    // Clear tree when component mounts
    setAssignedCategoryTrees(undefined);
    // Fetch category tree when the component mounts
    if (characteristicId !== undefined) {
      CharacteristicService.fetchCategoryTreeCharacteristics(characteristicId)
        .then((data) => {
          setAssignedCategoryTrees(data);
        })
        .catch((error) => console.error("Error:", error));
      CharacteristicService.fetchCharacteristic(characteristicId)
        .then((data) => {
          setCharacteristic(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [isOpen, characteristicId]);

  return (
    <>
      {characteristic && (
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="create-brand-modal"
          aria-describedby="modal-to-create-brand"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "30%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              outline: "1px solid #81be83",
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Categories to which '{characteristic.name}' (ID#
              {characteristic.id}) is assigned
            </Typography>
            <hr />
            <Typography variant="p" component="div" gutterBottom>
              Subcategories inherit the characteristics of the parent
              categories. Categories that have the '&gt;' symbol can be opened
              to view the hierarchy.
            </Typography>
            <hr />
            <Box sx={{ height: 220, flexGrow: 1, maxWidth: 400 }}>
              {/* Call the renderCategoryTree function with the categoryTree and subSubcategories */}
              {renderAssignedCategoryTree(assignedCategoryTrees)}
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <ModalButton
                buttonText="close"
                colorParam="secondary"
                onClickParam={handleClose}
              />
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ShowCharacteristicCategoriesModal;
