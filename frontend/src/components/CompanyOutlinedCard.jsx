import React from "react";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";

// Utility function for truncating description
const truncateDescription = (description, wordLimit = 15) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return description;
};

const CompanyOutlinedCard = ({
  title,
  subtitle,
  body,
  buttonText,
  experience,
  description,
  onAdditionalButtonClick,
  onApplicantsButtonClick,
}) => (
  <Card
    sx={{
      border: "2px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.02)", // Slightly smaller hover effect
      },
      position: "relative", // For positioning the button
      padding: 2,
    }}
  >
    <CardContent>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        {subtitle}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {experience}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {body}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {truncateDescription(description)}
        </Typography>
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          justifyContent: "flex-end",
          width: "calc(100% - 32px)", // Ensure the button stays within the card
        }}
      >
        <Button
          variant="contained"
          onClick={onAdditionalButtonClick}
          sx={{
            borderRadius: "20px",
            padding: "6px 16px",
            fontWeight: "bold",
            textTransform: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          {buttonText}
        </Button>
        {onApplicantsButtonClick && (
          <Button
            variant="outlined"
            onClick={onApplicantsButtonClick}
            sx={{
              borderRadius: "20px",
              padding: "6px 16px",
              fontWeight: "bold",
              textTransform: "none",
              marginLeft: 1,
              borderColor: "#007bff",
              color: "#007bff",
              "&:hover": {
                borderColor: "#0056b3",
                color: "#0056b3",
              },
            }}
          >
            View Applicants
          </Button>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default CompanyOutlinedCard;
