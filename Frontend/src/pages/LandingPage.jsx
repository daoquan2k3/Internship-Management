import { useThemeContext } from '../context/ThemeContext';
import { Box, Typography, Button, Container, AppBar, Toolbar, Stack, Chip, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
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

const FeatureCard = ({ icon, title, desc, delay, themeColors }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
  >
    <Box sx={{
      p: 4, height: '100%',
      background: themeColors.cardBg,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${themeColors.border}`,
      borderRadius: '24px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      boxShadow: themeColors.cardShadow,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      <Box sx={{ 
        p: 2, borderRadius: '16px', 
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)', 
        color: '#38bdf8', mb: 3,
        boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.2)'
      }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ color: themeColors.text, fontWeight: 800, mb: 1.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: themeColors.muted, lineHeight: 1.7, fontSize: '0.95rem' }}>
        {desc}
      </Typography>
    </Box>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useThemeContext();
  const isDark = mode === 'dark';

  const themeColors = {
    bg: isDark ? '#020617' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#0f172a',
    muted: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    navBg: isDark ? 'rgba(2, 6, 23, 0.65)' : 'rgba(255, 255, 255, 0.7)',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    cardBg: isDark ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)' : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 245, 249, 0.7) 100%)',
    cardShadow: isDark ? '0 20px 40px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 20px 40px -15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5)',
    btnMainBg: isDark ? '#f8fafc' : '#0f172a',
    btnMainText: isDark ? '#0f172a' : '#ffffff',
    btnMainHover: isDark ? '#e2e8f0' : '#334155',
    btnOutlinedBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    btnOutlinedBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
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
        transition: 'background-color 0.5s ease'
      }}
    >
      {/* BACKGROUND ELEMENTS */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, ${themeColors.grid} 1px, transparent 1px), linear-gradient(to bottom, ${themeColors.grid} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 30%, transparent 80%)',
        transition: 'background-image 0.5s ease'
      }} />
      <Box sx={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '90vw', height: '60vh', background: 'radial-gradient(ellipse at top, rgba(56, 189, 248, 0.25), transparent 70%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', top: '30%', left: '-15%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(80px)' }} />
      <Box sx={{ position: 'absolute', top: '20%', right: '-15%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(80px)' }} />

      {/* NAVBAR */}
      <AppBar position="fixed" elevation={0} sx={{ background: themeColors.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: `1px solid ${themeColors.border}`, zIndex: 50, transition: 'background 0.5s ease, border-color 0.5s ease' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 }, minHeight: '76px !important' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: themeColors.text, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(56,189,248,0.4)' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: "#ffffff", borderRadius: '50%' }} />
                </Box>
                Internship<Box component="span" sx={{ color: '#38bdf8', fontWeight: 700 }}>System</Box>
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton onClick={toggleColorMode} sx={{ color: themeColors.muted, '&:hover': { color: themeColors.text, bgcolor: themeColors.border } }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={isDark ? "dark" : "light"} initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                      {isDark ? <LightModeIcon /> : <DarkModeOutlinedIcon />}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>
                <Button onClick={() => navigate('/login')} disableRipple sx={{ color: themeColors.muted, fontWeight: 600, fontSize: '0.95rem', textTransform: 'none', '&:hover': { color: themeColors.text, bgcolor: 'transparent' }, px: 2, transition: 'all 0.3s ease' }}>
                  Đăng nhập
                </Button>
                <Button variant="contained" disableElevation onClick={() => navigate('/register')} sx={{ bgcolor: themeColors.btnMainBg, color: themeColors.btnMainText, fontWeight: 700, fontSize: '0.95rem', borderRadius: '12px', px: 3, py: 1, textTransform: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { bgcolor: themeColors.btnMainHover, transform: 'translateY(-1px)', boxShadow: isDark ? '0 4px 15px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)' } }}>
                  Bắt đầu ngay
                </Button>
              </Stack>
            </motion.div>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO SECTION */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 18, md: 24 }, pb: 12, zIndex: 1, position: 'relative' }}>
        <Box component={motion.div} variants={staggerContainer} initial="hidden" animate="visible" sx={{ textAlign: 'center', maxWidth: '950px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div variants={fadeUp}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', p: '2px', borderRadius: '50px', background: 'linear-gradient(90deg, rgba(56,189,248,0.3) 0%, rgba(139,92,246,0.3) 100%)', mb: 4 }}>
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '1.2rem !important', color: '#38bdf8' }} />}
                label="Thế hệ nền tảng quản lý mới 3.0"
                sx={{ fontWeight: 700, color: themeColors.text, bgcolor: isDark ? '#020617' : '#ffffff', py: 2.5, px: 1, borderRadius: '50px', fontSize: '0.95rem', '& .MuiChip-label': { px: 2 } }}
              />
            </Box>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem' }, color: themeColors.text, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Quản lý thực tập <br />
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                thông minh & toàn diện
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: 400, color: themeColors.muted, lineHeight: 1.7, px: { xs: 2, md: 8 }, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Giải pháp tối ưu hóa toàn bộ quy trình kết nối, đánh giá và theo dõi tiến độ giữa Sinh Viên, Nhà Trường và Doanh Nghiệp. Đơn giản, bảo mật và minh bạch.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button
                variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/register')}
                sx={{
                  px: 4.5, py: 2, fontSize: '1.1rem', borderRadius: '14px', fontWeight: 700,
                  bgcolor: themeColors.btnMainBg, color: themeColors.btnMainText, textTransform: 'none',
                  boxShadow: isDark ? '0 10px 30px rgba(255,255,255,0.1)' : '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': { bgcolor: themeColors.btnMainHover, transform: 'translateY(-4px)', boxShadow: isDark ? '0 15px 35px rgba(255,255,255,0.2)' : '0 15px 35px rgba(0,0,0,0.15)' }
                }}
              >
                Trải nghiệm ngay
              </Button>
              <Button
                variant="outlined" size="large" onClick={() => navigate('/login')}
                sx={{
                  px: 4.5, py: 2, fontSize: '1.1rem', borderRadius: '14px', fontWeight: 700,
                  color: themeColors.text, borderColor: themeColors.border, textTransform: 'none',
                  bgcolor: themeColors.btnOutlinedBg, backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: themeColors.border, borderColor: themeColors.text }
                }}
              >
                Vào hệ thống
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* MOCKUP IMAGE SECTION */}
        <Box sx={{ width: '100%', mt: { xs: 8, md: 14 }, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1, position: 'relative' }}
          >
            <Box sx={{
              width: '100%', maxWidth: '1200px',
              borderRadius: '24px',
              p: { xs: 1, sm: 2 },
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              border: `1px solid ${themeColors.border}`,
              borderBottom: 'none',
              boxShadow: isDark ? '0 30px 80px -20px rgba(0,0,0,0.8)' : '0 30px 80px -20px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(20px)'
            }}>
              <Box component="img" src="/dashboard-mockup.png" alt="Dashboard Mockup" sx={{
                width: '100%', height: 'auto', borderRadius: '16px', display: 'block',
                border: `1px solid ${themeColors.border}`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }} />
            </Box>
          </motion.div>
        </Box>

        {/* FEATURES SECTION */}
        <Box sx={{ mt: { xs: 10, md: 16 }, mb: 8, width: '100%' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', mb: 2, fontSize: { xs: '2rem', md: '2.75rem' }, color: themeColors.text }}>
            Sức mạnh vượt trội
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: themeColors.muted, mb: 8, maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
            Cung cấp mọi công cụ cần thiết để quản lý quy trình thực tập một cách chuyên nghiệp nhất.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                delay={0.2} themeColors={themeColors}
                icon={<DashboardCustomizeIcon fontSize="large" />} title="Quản lý tập trung"
                desc="Giao diện tổng quan giúp bạn theo dõi toàn bộ tiến độ, báo cáo và đầu việc của sinh viên chỉ trong một màn hình duy nhất."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                delay={0.4} themeColors={themeColors}
                icon={<SecurityIcon fontSize="large" />} title="Bảo mật cấp độ cao"
                desc="Dữ liệu cá nhân, báo cáo mật của doanh nghiệp và điểm số được mã hóa và phân quyền truy cập cực kỳ nghiêm ngặt."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                delay={0.6} themeColors={themeColors}
                icon={<SpeedIcon fontSize="large" />} title="Xử lý nhanh chóng"
                desc="Giảm thiểu 80% thời gian xử lý giấy tờ với quy trình duyệt số hóa hoàn toàn tự động và minh bạch."
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;