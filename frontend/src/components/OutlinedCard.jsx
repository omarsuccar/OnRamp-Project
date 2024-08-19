import React from "react";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Utility function for truncating description (if needed)
const truncateDescription = (description, wordLimit = 5) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return description;
};

const OutlinedCard = ({ job, onApply, onMoreDetails, hasApplied }) => {
  return (
    <Card
      sx={{
        border: "2px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
        position: "relative",
        padding: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          {job.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {job.companyName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Status: {job.status}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Experience: {job.experienceYears}
        </Typography>
        {job.description && (
          <Typography variant="body2" color="text.secondary">
            {truncateDescription(job.description)}
          </Typography>
        )}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "flex",
            justifyContent: "flex-end",
            width: "calc(100% - 32px)",
          }}
        >
          {hasApplied ? (
            <Button
              variant="outlined"
              sx={{
                borderRadius: "20px",
                padding: "6px 16px",
                fontWeight: "bold",
                textTransform: "none",
                borderColor: "#28a745",
                color: "#28a745",
                "&:hover": {
                  borderColor: "#218838",
                  color: "#218838",
                },
              }}
            >
              <CheckCircleIcon sx={{ mr: 1 }} />
              Applied
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onApply}
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
              Apply
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={onMoreDetails}
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
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OutlinedCard;
