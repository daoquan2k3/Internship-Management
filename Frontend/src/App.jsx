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

// Student & Teacher
const MyMentor = lazy(() => import("./pages/student/MyMentor"));
const MyStudents = lazy(() => import("./pages/teacher/MyStudents"));
const StudentWorkflow = lazy(() => import("./pages/student/StudentWorkflow"));

// Management Pages
const UsersManagement = lazy(() => import("./pages/management/users/UsersManagement"));
const StudentsManagement = lazy(() => import("./pages/management/students/StudentsManagement"));
const MentorsManagement = lazy(() => import("./pages/management/mentors/MentorsManagement"));
const UniversitiesManagement = lazy(() => import("./pages/management/universities/UniversitiesManagement"));
const CompaniesManagement = lazy(() => import("./pages/management/companies/CompaniesManagement"));
const UniversityClasses = lazy(() => import("./pages/unirep/UniversityClasses"));
const UniversityJoinRequests = lazy(() => import("./pages/unirep/UniversityJoinRequests"));
const FinalEvaluationsRep = lazy(() => import("./pages/unirep/FinalEvaluationsRep"));
const TeacherApplications = lazy(() => import("./pages/teacher/TeacherApplications"));
const InternshipPhasesManagement = lazy(() => import("./pages/management/phases/InternshipPhasesManagement"));
const InternshipAssignmentsManagement = lazy(() => import("./pages/management/assignments/InternshipAssignmentsManagement"));
const AssessmentRoundsManagement = lazy(() => import("./pages/management/assessment-rounds/AssessmentRoundsManagement"));
const ReportManagement = lazy(() => import("./pages/management/reports/ReportManagement"));
const AssessmentRoundDetail = lazy(() => import("./pages/management/assessment-rounds/AssessmentRoundDetail"));
const AssignmentDetail = lazy(() => import("./pages/management/assignments/AssignmentDetail"));
const CompanyApplications = lazy(() => import("./pages/company-rep/CompanyApplications"));

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
                                path="/admin/universities"
                                element={
                                    <AppLayout>
                                        <UniversitiesManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/admin/companies"
                                element={
                                    <AppLayout>
                                        <CompaniesManagement />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/rep/classes"
                                element={
                                    <AppLayout>
                                        <UniversityClasses />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/rep/join-requests"
                                element={
                                    <AppLayout>
                                        <UniversityJoinRequests />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/rep/final-evaluations"
                                element={
                                    <AppLayout>
                                        <FinalEvaluationsRep />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/teacher/applications"
                                element={
                                    <AppLayout>
                                        <TeacherApplications />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/company-rep/applications"
                                element={
                                    <AppLayout>
                                        <CompanyApplications />
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
                                path="/admin/assessment-rounds/:id"
                                element={
                                    <AppLayout>
                                        <AssessmentRoundDetail />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/my-mentor"
                                element={
                                    <AppLayout>
                                        <MyMentor />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/my-students"
                                element={
                                    <AppLayout>
                                        <MyStudents />
                                    </AppLayout>
                                }
                            />

                            <Route
                                path="/my-internship"
                                element={
                                    <AppLayout>
                                        <StudentWorkflow />
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
