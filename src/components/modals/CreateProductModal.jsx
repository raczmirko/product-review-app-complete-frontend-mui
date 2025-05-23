import LinkIcon from "@mui/icons-material/Link";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import ArticleService from "../../services/ArticleService";
import CharacteristicService from "../../services/CharacteristicService";
import ProductService from "../../services/ProductService";
import ImageUploadButton from "../buttons/ImageUploadButton";
import ModalButton from "../buttons/ModalButton";
import ArticleCard from "../cards/ArticleCard";
import PackagingSelector from "../selectors/PackagingSelector";
import PackagingTable from "../tables/PackagingTable";

const CreateProductModal = ({
  articleId,
  closeFunction,
  isOpen,
  setIsOpen,
  showNotification,
}) => {
  const [article, setArticle] = useState("");
  const [packaging, setPackaging] = useState("");
  const [characteristicAndValue, setCharacteristicAndValue] = useState([]);
  const [selectedPage, setSelectedPage] = useState("structure");
  const [showPackagingTable, setShowPackagingTable] = useState(false);
  const [images, setImages] = React.useState([]);
  const [refreshSelector, setRefreshSelector] = useState(false);

  const handlePageChange = (event, newPage) => {
    if (newPage !== null) {
      setSelectedPage(newPage);
    }
  };

  const handleFileChange = (event) => {
    if (event && event.target && event.target.files) {
      const fileArray = Array.from(event.target.files);

      const imageArray = fileArray.map((file) => {
        return URL.createObjectURL(file);
      });

      setImages(imageArray);
    } else {
      console.error("Event or event.target is undefined");
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      return updatedImages;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    closeFunction();
  };

  const handleCreate = async () => {
    const result = await ProductService.createProductFull(
      article,
      packaging,
      characteristicAndValue,
      images
    );
    if (result.success) {
      showNotification("success", result.message);
    } else {
      showNotification("error", result.message);
    }
    handleClose();
  };

  const togglePackagingComponent = () => {
    setShowPackagingTable((prevShow) => !prevShow);
  };

  useEffect(() => {
    // If articleId is not null, fetch article
    if (articleId !== undefined) {
      ArticleService.fetchArticleById(articleId)
        .then((data) => {
          setArticle(data);
          CharacteristicService.listAssignedCharacteristics(data.category.id)
            .then((data) => {
              // Manually add a value field to characteristics to then send them to the server later
              const characteristicsAndValue = data.map((characteristic) => ({
                ...characteristic,
                value: "",
              }));
              setCharacteristicAndValue(characteristicsAndValue);
            })
            .catch((error) =>
              console.error("Error setting inheritec characteristics:", error)
            );
        })
        .catch((error) => console.error("Error fetching article:", error));
    }
  }, [isOpen, articleId]);

  const modifyCharacteristicValue = (characteristicId, value) => {
    setCharacteristicAndValue((prevCharacteristics) => {
      return prevCharacteristics.map((char) =>
        char.id === characteristicId ? { ...char, value: value } : char
      );
    });
  };

  const renderPackagingToggleButton = () => {
    if (selectedPage === "structure") {
      return (
        <Button
          variant="contained"
          color="warning"
          sx={{ mr: 1 }}
          onClick={(e) => togglePackagingComponent()}
        >
          Toggle packagings table
        </Button>
      );
    }
    return null;
  };

  const refreshPackagingSelector = () => {
    setRefreshSelector((prev) => !prev);
  };

  const renderSelectedPage = () => {
    switch (selectedPage) {
      case "structure":
        return (
          <Box>
            <Typography variant="subtitle2" component="div" gutterBottom>
              Product structure:
            </Typography>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
              direction={{ xs: "column", sm: "row", md: "row", lg: "row" }}
            >
              <Grid item xs={12} md={5}>
                <ArticleCard article={article} />
              </Grid>
              <Grid item xs={12} md={1} container justifyContent="center">
                <LinkIcon fontSize="large" />
              </Grid>
              <Grid item xs={12} md={5}>
                <PackagingSelector
                  selectedPackaging={packaging}
                  setSelectedPackaging={setPackaging}
                  articleId={articleId}
                  refreshFlag={refreshSelector}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case "images":
        return (
          <Box>
            <Typography variant="subtitle2" component="div" gutterBottom>
              Product Images
            </Typography>
            <Box>
              {images.length > 0 && (
                <Box sx={{ width: "100%", mt: 2 }}>
                  <Box sx={{ display: "flex", overflowX: "auto", mt: 2 }}>
                    {images.map((image, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <img
                          src={image}
                          alt={`Uploaded ${index}`}
                          style={{
                            width: "auto",
                            height: "200px",
                            marginRight: "16px",
                            objectFit: "contain",
                          }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 1,
                            bg: "red",
                            marginRight: "16px",
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          X
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );
      case "characteristics":
        return (
          <Box>
            <Typography variant="subtitle2" component="div" gutterBottom>
              Product Characteristics
            </Typography>
            <Box sx={{ overflowY: "auto", maxHeight: 200 }}>
              {characteristicAndValue.length > 0 ? (
                characteristicAndValue.map((characteristic, index) => (
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
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="subtitle2" component="div" gutterBottom>
              Please select a valid page.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="assign-packaging-modal"
      aria-describedby="modal-to-assign-packaging"
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
          Create a product of "{article.name}"
        </Typography>
        <hr />
        <Typography variant="subtitle1" component="div" gutterBottom>
          An article is the theorical product. Products are made up of the
          combination of an article and a packaging type. One article may be
          available in many different packaging options, resulting in many
          products of the same article. Only the packagings that are not yet
          assigned to this particular article can be chosen (thus product does
          not yet exist).
        </Typography>
        <hr />
        <ToggleButtonGroup
          value={selectedPage}
          exclusive
          onChange={handlePageChange}
          aria-label="page selection"
        >
          <ToggleButton value="structure" aria-label="product structure">
            Structure
          </ToggleButton>
          <ToggleButton value="images" aria-label="product images">
            Images
          </ToggleButton>
          <ToggleButton
            value="characteristics"
            aria-label="product characteristics"
          >
            Characteristics
          </ToggleButton>
        </ToggleButtonGroup>
        <hr />
        <Box sx={{ minHeight: 250 }}>{renderSelectedPage()}</Box>
        {showPackagingTable && (
          <Box sx={{ flexGrow: 1 }}>
            <hr />
            <Typography variant="subtitle2" component="div" gutterBottom>
              Available packaging options:
            </Typography>
            <PackagingTable defPageSize={5} defDensity="compact" />
          </Box>
        )}
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <ImageUploadButton handleFileChange={handleFileChange} />
          {renderPackagingToggleButton()}
          <ModalButton
            buttonText="reload packagings"
            colorParam="info"
            onClickParam={refreshPackagingSelector}
          />
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
    </Modal>
  );
};

export default CreateProductModal;
