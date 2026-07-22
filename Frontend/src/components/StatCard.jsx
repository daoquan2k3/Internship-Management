import { Card, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <Card
            sx={{
                height: '100%',
                display: "flex",
                alignItems: "center",
                p: 2,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    color: color,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {value}
                </Typography>
            </Box>
        </Card>
    </motion.div>
);

export default StatCard;
