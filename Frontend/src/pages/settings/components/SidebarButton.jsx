import { Button } from "@mui/material";
import { styled } from "@mui/system";

export const SidebarButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active, theme }) => ({
  justifyContent: "flex-start",
  padding: "12px 20px",
  borderRadius: "12px",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? (theme.palette.mode === 'dark' ? "rgba(59, 130, 246, 0.15)" : "rgba(25, 118, 210, 0.08)") : "transparent",
  fontWeight: active ? 700 : 600,
  textTransform: "none",
  fontSize: "0.95rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: active 
       ? (theme.palette.mode === 'dark' ? "rgba(59, 130, 246, 0.25)" : "rgba(25, 118, 210, 0.12)") 
       : theme.palette.action.hover,
    transform: "translateX(4px)",
  },
  "& .MuiButton-startIcon": {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    transition: "all 0.3s",
  },
}));
