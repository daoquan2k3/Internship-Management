
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const BentoCard = ({ icon, label, value }) => (
  <Box
    component={motion.div}
    whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(37,99,235,0.2)" }}
    sx={{
      p: 2.5,
      borderRadius: 4,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: 1,
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      height: "100%",
    }}
  >
    <Box
      sx={{
        p: 1.2,
        borderRadius: 2.5,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.05)" : "primary.50",
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, overflow: "hidden" }}>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.5px" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mt: 0.5,
          wordBreak: "break-word",
          lineHeight: 1.4,
        }}
      >
        {value || (
          <span style={{ fontStyle: "italic", fontWeight: 500, opacity: 0.6 }}>
            Chưa cập nhật
          </span>
        )}
      </Typography>
    </Box>
  </Box>
);
