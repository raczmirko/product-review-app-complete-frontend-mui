import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import AspectService from "../../services/AspectService";
import ModalButton from "../buttons/ModalButton";

const ViewReviewModal = ({ review, isOpen, setIsOpen }) => {
  const [aspects, setAspects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AspectService.fetchAspects()
      .then((response) => {
        setAspects(response.data);
        setIsLoaded(true);
      })
      .catch((error) => console.error("Error fetching review aspects:", error));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const formatDate = function (dateString) {
    const dateStr = dateString;
    const date = new Date(dateStr);

    // Define options for formatting the date
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  return (
    <>
      {isLoaded && (
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="view-review-modal"
          aria-describedby="modal-view-review"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              outline: "1px solid #81be83",
              textAlign: "center",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  Overall review
                </Typography>
                <Box textAlign="left">
                  <Typography variant="subtitle1" component="div">
                    Product : {review.product.article.name}
                  </Typography>
                </Box>
                <Box textAlign="left">
                  <Typography variant="subtitle1" component="div">
                    Reviewed by: {review.user.username}
                  </Typography>
                </Box>
                <Box textAlign="left" sx={{ display: "flex" }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ alignItems: "center", mr: 1 }}
                  >
                    Value for price:
                  </Typography>
                  <Rating value={review.valueForPrice} readOnly size="small" />
                </Box>
                <Box textAlign="left">
                  <Typography variant="subtitle1" component="div">
                    Purchase country: {review.purchaseCountry.name}
                  </Typography>
                </Box>
                <Box textAlign="left">
                  <Typography variant="subtitle1" component="div">
                    Last modified on: {formatDate(review.date)}.
                  </Typography>
                </Box>
                <Box
                  textAlign="left"
                  sx={{ overflowY: "auto", maxHeight: "200px", mt: 3 }}
                >
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    {review.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  Aspect scores
                </Typography>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "300px",
                    textAlign: "left",
                  }}
                >
                  {review.reviewBodyItems.map((item, index) => {
                    const aspect = aspects.find(
                      (aspect) => aspect.id === item.id.aspectId
                    );
                    const aspectName = aspect ? aspect.name : "Unknown Aspect";
                    return (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          gutterBottom
                        >
                          {aspectName}
                        </Typography>
                        <Rating readOnly value={item.score} />
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: "right", mt: 2 }}>
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

export default ViewReviewModal;
