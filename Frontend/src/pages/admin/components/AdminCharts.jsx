import { Box, Typography, Paper, Stack } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#94a3b8", "#8b5cf6", "#3b82f6"];

export const AdminCharts = ({ visitorData, pieData }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 4,
        alignItems: "stretch",
      }}
    >
      <Box sx={{ flex: { xs: "1 1 100%", lg: 2 } }}>
        <Paper
          sx={{
            p: 3,
            height: "100%",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
            Xu hướng truy cập website (7 ngày gần nhất)
          </Typography>
          <Box sx={{ flexGrow: 1, width: "100%", minHeight: 320 }}>
            {(!visitorData || visitorData.length === 0) ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary" variant="body1">Chưa có dữ liệu truy cập</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mui-palette-divider)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      background: "var(--mui-palette-background-paper)",
                      color: "var(--mui-palette-text-primary)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Lượt truy cập"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "var(--mui-palette-background-paper)" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ flex: { xs: "1 1 100%", lg: 1 } }}>
        <Paper
          sx={{
            p: 3,
            height: "100%",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}>
            Tỷ lệ hoàn thành báo cáo
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              minHeight: 250,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(!pieData || pieData.length === 0) ? (
              <Typography color="text.secondary" variant="body1">Chưa có dữ liệu báo cáo</Typography>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      background: "var(--mui-palette-background-paper)",
                      color: "var(--mui-palette-text-primary)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>

          <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[0] }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Đã nộp
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[1] }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Chưa nộp
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};
