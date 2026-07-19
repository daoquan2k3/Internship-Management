import { useState } from 'react';
import { Box, Typography, Button, Container, AppBar, Toolbar, Stack, Chip, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { motion, AnimatePresence } from 'framer-motion';

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } }
};

// Component Feature Card giả lập UI
const FeatureCard = ({ icon, title, desc, delay, themeColors }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Box sx={{
      p: 3, height: '100%',
      background: themeColors.cardBg,
      backdropFilter: 'blur(12px)',
      border: `1px solid ${themeColors.border}`,
      borderRadius: '20px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      boxShadow: themeColors.cardShadow,
      transition: 'all 0.4s ease'
    }}>
      <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ color: themeColors.text, fontWeight: 700, mb: 1, fontSize: '1.1rem', transition: 'color 0.4s ease' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: themeColors.muted, lineHeight: 1.6, transition: 'color 0.4s ease' }}>
        {desc}
      </Typography>
    </Box>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true); // Default là Dark Mode

  // --- BỘ MÀU SẮC ĐỘNG TÙY THEO THEME ---
  const themeColors = {
    bg: isDark ? '#020617' : '#f8fafc', // Slate 950 vs Slate 50
    text: isDark ? '#f8fafc' : '#0f172a',
    muted: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
    navBg: isDark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    cardBg: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.6)',
    cardShadow: isDark ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 10px 30px -10px rgba(0,0,0,0.05)',
    btnMainBg: isDark ? '#f8fafc' : '#0f172a',
    btnMainText: isDark ? '#0f172a' : '#ffffff',
    btnMainHover: isDark ? '#e2e8f0' : '#334155',
    btnOutlinedBg: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    btnOutlinedBorder: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
    fakeAppBg: isDark ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0) 100%)' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0) 100%)',
    fakeAppLine: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        backgroundColor: themeColors.bg,
        overflowX: 'hidden', position: 'relative',
        fontFamily: "'Inter', sans-serif",
        transition: 'background-color 0.5s ease' // Hiệu ứng chuyển màu nền mượt mà
      }}
    >
      {/* LƯỚI NỀN (GRID PATTERN) */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, ${themeColors.grid} 1px, transparent 1px), linear-gradient(to bottom, ${themeColors.grid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 100% 60% at 50% 0%, #000 40%, transparent 110%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 60% at 50% 0%, #000 40%, transparent 110%)',
        transition: 'background-image 0.5s ease'
      }} />

      {/* ÁNH SÁNG NGẦM (GLOW EFFECTS) */}
      <Box sx={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '50vh', background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '20%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* NAVBAR */}
      <AppBar position="fixed" elevation={0} sx={{ background: themeColors.navBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${themeColors.border}`, zIndex: 10, transition: 'background 0.5s ease, border-color 0.5s ease' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 }, minHeight: '70px !important' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: themeColors.text, display: 'flex', alignItems: 'center', gap: 1.5, transition: 'color 0.5s ease' }}>
                <Box sx={{ width: 26, height: 26, borderRadius: 1.5, background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56,189,248,0.4)' }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: '#fff', borderRadius: '50%' }} />
                </Box>
                Internship<Box component="span" sx={{ color: themeColors.muted, fontWeight: 600 }}>System</Box>
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                
                {/* NÚT CHUYỂN SÁNG TỐI */}
                <IconButton 
                  onClick={() => setIsDark(!isDark)} 
                  sx={{ color: themeColors.muted, mr: 1, '&:hover': { color: themeColors.text, bgcolor: themeColors.border } }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isDark ? "dark" : "light"}
                      initial={{ y: -20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: 20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>

                <Button onClick={() => navigate('/login')} disableRipple sx={{ color: themeColors.muted, fontWeight: 600, textTransform: 'none', '&:hover': { color: themeColors.text, bgcolor: themeColors.border }, px: 2, borderRadius: 2, transition: 'all 0.3s ease' }}>
                  Đăng nhập
                </Button>
                <Button variant="contained" disableElevation onClick={() => navigate('/register')} sx={{ bgcolor: themeColors.btnMainBg, color: themeColors.btnMainText, fontWeight: 700, borderRadius: '10px', px: 3, textTransform: 'none', transition: 'all 0.3s ease', '&:hover': { bgcolor: themeColors.btnMainHover } }}>
                  Đăng ký
                </Button>
              </Stack>
            </motion.div>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MAIN HERO SECTION */}
      <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 16, md: 22 }, pb: 10, zIndex: 1, position: 'relative' }}>
        
        <Box component={motion.div} variants={staggerContainer} initial="hidden" animate="visible" sx={{ textAlign: 'center', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div variants={fadeUp}>
            <Chip 
              icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important', color: '#38bdf8' }} />} 
              label="Bản cập nhật 2.0 đã sẵn sàng" 
              variant="outlined" 
              sx={{ mb: 4, fontWeight: 600, color: themeColors.text, borderColor: themeColors.border, bgcolor: themeColors.btnOutlinedBg, py: 2.5, px: 1, borderRadius: '50px', backdropFilter: 'blur(10px)', transition: 'all 0.5s ease', '& .MuiChip-label': { px: 2 } }} 
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' }, color: themeColors.text, letterSpacing: '-0.04em', lineHeight: 1.1, transition: 'color 0.5s ease' }}>
              Nền tảng quản lý <br />
              <Box component="span" sx={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: isDark ? 'drop-shadow(0 0 30px rgba(56,189,248,0.2))' : 'none' }}>
                thực tập thế hệ mới.
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: 400, color: themeColors.muted, lineHeight: 1.6, px: { xs: 2, md: 10 }, fontSize: { xs: '1.1rem', md: '1.25rem' }, transition: 'color 0.5s ease' }}>
              Tối ưu hóa quy trình theo dõi, đánh giá và kết nối giữa sinh viên, Mentor và doanh nghiệp. Trải nghiệm sự minh bạch và chuyên nghiệp tuyệt đối.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
              <Button
                variant="contained" disableElevation size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/register')}
                sx={{
                  px: 4, py: 1.8, fontSize: '1.05rem', borderRadius: '12px', fontWeight: 600,
                  bgcolor: themeColors.btnMainBg, color: themeColors.btnMainText, textTransform: 'none',
                  boxShadow: isDark ? '0 0 20px rgba(255,255,255,0.1)' : '0 8px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: themeColors.btnMainHover, transform: 'translateY(-2px)', boxShadow: isDark ? '0 0 30px rgba(255,255,255,0.2)' : '0 12px 25px rgba(0,0,0,0.15)' }
                }}
              >
                Bắt đầu miễn phí
              </Button>
              <Button
                variant="outlined" size="large" onClick={() => navigate('/login')}
                sx={{
                  px: 4, py: 1.8, fontSize: '1.05rem', borderRadius: '12px', fontWeight: 600,
                  color: themeColors.text, borderColor: themeColors.btnOutlinedBorder, textTransform: 'none',
                  bgcolor: themeColors.btnOutlinedBg, backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: themeColors.border, borderColor: themeColors.text }
                }}
              >
                Đăng nhập hệ thống
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* GIAO DIỆN MÔ PHỎNG (MOCKUP UI) */}
        <Box sx={{ width: '100%', mt: { xs: 8, md: 12 }, position: 'relative' }}>
          
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2, px: { xs: 2, md: 0 } }}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                delay={0.6} themeColors={themeColors}
                icon={<DashboardCustomizeIcon />} title="Bảng điều khiển thông minh"
                desc="Giao diện tổng quan giúp bạn theo dõi toàn bộ tiến độ, báo cáo và đầu việc chỉ trong một màn hình duy nhất."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                delay={0.7} themeColors={themeColors}
                icon={<InsightsIcon />} title="Đánh giá minh bạch"
                desc="Hệ thống chấm điểm đa chiều từ Mentor, lưu vết rõ ràng từng tiêu chí với nhận xét chi tiết."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                delay={0.8} themeColors={themeColors}
                icon={<SecurityIcon />} title="Bảo mật tuyệt đối"
                desc="Dữ liệu sinh viên, dự án và điểm số được mã hóa và phân quyền truy cập nghiêm ngặt."
              />
            </Grid>
          </Grid>

          {/* Fake App Window */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-60px', zIndex: 1, position: 'relative' }}
          >
            <Box sx={{
              width: '90%', maxWidth: '1100px', height: '400px',
              background: themeColors.fakeAppBg,
              borderRadius: '24px 24px 0 0',
              border: `1px solid ${themeColors.border}`, borderBottom: 'none',
              boxShadow: isDark ? '0 -30px 60px -15px rgba(0,0,0,0.5)' : '0 -30px 60px -15px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', p: 4,
              transition: 'all 0.5s ease',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
            }}>
              {/* Cửa sổ App */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: `1px solid ${themeColors.fakeAppLine}`, pb: 2, transition: 'border-color 0.5s ease' }}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                </Stack>
                <Box sx={{ width: 200, height: 24, bgcolor: themeColors.fakeAppLine, borderRadius: 1, transition: 'background-color 0.5s ease' }} />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Stack spacing={2}>
                    <Box sx={{ height: 30, borderRadius: 1, bgcolor: themeColors.fakeAppLine, transition: 'background-color 0.5s ease' }} />
                    <Box sx={{ height: 30, borderRadius: 1, bgcolor: themeColors.fakeAppLine, transition: 'background-color 0.5s ease' }} />
                    <Box sx={{ height: 30, borderRadius: 1, bgcolor: themeColors.fakeAppLine, transition: 'background-color 0.5s ease' }} />
                  </Stack>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ height: 120, borderRadius: 2, bgcolor: themeColors.border, border: `1px solid ${themeColors.fakeAppLine}`, mb: 3, transition: 'all 0.5s ease' }} />
                  <Box sx={{ height: 200, borderRadius: 2, bgcolor: themeColors.grid, border: `1px solid ${themeColors.fakeAppLine}`, transition: 'all 0.5s ease' }} />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Box>

      </Container>
    </Box>
  );
};

export default LandingPage;