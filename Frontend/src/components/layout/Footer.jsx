import { Box, Typography, Link } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        zIndex: 10,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {"© "}
        {new Date().getFullYear()}{" "}
        <Link color="inherit" href="/" sx={{ textDecoration: 'none', fontWeight: 600 }}>
          Internship System
        </Link>
        {". All rights reserved."}
      </Typography>
    </Box>
  );
};
