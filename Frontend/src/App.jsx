import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireProfileCompletion from "./components/RequireProfileCompletion";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

// Dashboard & General Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

// Mentor & Student
const AssignedMentor = lazy(() => import("./pages/mentors/AssignedMentor"));
const AssignedStudents = lazy(() => import("./pages/students/AssignedStudents"));
const StudentReportSubmit = lazy(() => import("./pages/students/StudentReportSubmit"));

// Management Pages
const UsersManagement = lazy(() => import("./pages/management/users/UsersManagement"));
const StudentsManagement = lazy(() => import("./pages/management/students/StudentsManagement"));
const MentorsManagement = lazy(() => import("./pages/management/mentors/MentorsManagement"));
const InternshipPhasesManagement = lazy(() => import("./pages/management/phases/InternshipPhasesManagement"));
const InternshipAssignmentsManagement = lazy(() => import("./pages/management/assignments/InternshipAssignmentsManagement"));
const AssessmentRoundsManagement = lazy(() => import("./pages/management/assessment-rounds/AssessmentRoundsManagement"));
const EvaluationCriteriaManagement = lazy(() => import("./pages/management/evaluation-criteria/EvaluationCriteriaManagement"));
const ReportManagement = lazy(() => import("./pages/management/reports/ReportManagement"));
const AssessmentResultsManagement = lazy(() => import("./pages/management/assessment-results/AssessmentResultsManagement"));
const AssessmentResultDetail = lazy(() => import("./pages/management/assessment-results/AssessmentResultDetail"));
const AssessmentRoundDetail = lazy(() => import("./pages/management/assessment-rounds/AssessmentRoundDetail"));
const AssignmentDetail = lazy(() => import("./pages/management/assignments/AssignmentDetail"));

// Fallback Loader
const PageLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
    </Box>
);

function App() {
    const location = useLocation();
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <AnimatePresence mode="wait">
                <Suspense fallback={<PageLoader />}>
                    <Routes location={location} key={location.pathname}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Dashboard Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<RequireProfileCompletion />}>
                            <Route
                                path="/dashboard"
                                element={
                                    <AppLayout>
                                        <MainDashboard />
                                    </AppLayout>
                                }
                            />

                            <Route
                                path="/management/users"
                                element={
                                    <AppLayout>
                                        <UsersManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/students"
                                element={
                                    <AppLayout>
                                        <StudentsManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/mentors"
                                element={
                                    <AppLayout>
                                        <MentorsManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/phases"
                                element={
                                    <AppLayout>
                                        <InternshipPhasesManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/assignments"
                                element={
                                    <AppLayout>
                                        <InternshipAssignmentsManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/assessment-rounds"
                                element={
                                    <AppLayout>
                                        <AssessmentRoundsManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/evaluation-criteria"
                                element={
                                    <AppLayout>
                                        <EvaluationCriteriaManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/assessment-results"
                                element={
                                    <AppLayout>
                                        <AssessmentResultsManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/admin/assessment-rounds/:id"
                                element={
                                    <AppLayout>
                                        <AssessmentRoundDetail />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/admin/assessment-results/:id"
                                element={
                                    <AppLayout>
                                        <AssessmentResultDetail />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/my-mentor"
                                element={
                                    <AppLayout>
                                        <AssignedMentor />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/my-students"
                                element={
                                    <AppLayout>
                                        <AssignedStudents />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/submit-report"
                                element={
                                    <AppLayout>
                                        <StudentReportSubmit />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/management/reports"
                                element={
                                    <AppLayout>
                                        <ReportManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/admin/assignments/:id"
                                element={
                                    <AppLayout>
                                        <AssignmentDetail />
                                    </AppLayout>
                                }
                            />
                        </Route>
                        <Route
                            path="/settings"
                            element={
                                <AppLayout>
                                    <SettingsPage />
                                </AppLayout>
                            }
                        />
                    </Route>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Suspense>
            </AnimatePresence>
        </>
    );
}

export default App;
