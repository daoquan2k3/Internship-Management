import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// mentor dashboard
import AssignedMentor from "./pages/mentors/AssignedMentor";

// student dashboard
import AssignedStudents from "./pages/students/AssignedStudents";
import StudentReportSubmit from "./pages/students/StudentReportSubmit";

import MainDashboard from "./pages/MainDashboard";

// Management Pages
import UsersManagement from "./pages/management/UsersManagement";
import StudentsManagement from "./pages/management/StudentsManagement";
import MentorsManagement from "./pages/management/MentorsManagement";
import InternshipPhasesManagement from "./pages/management/InternshipPhasesManagement";
import InternshipAssignmentsManagement from "./pages/management/InternshipAssignmentsManagement";
import AssessmentRoundsManagement from "./pages/management/AssessmentRoundsManagement";
import EvaluationCriteriaManagement from "./pages/management/EvaluationCriteriaManagement";
import AssessmentResultsManagement from "./pages/management/AssessmentResultsManagement";
import ReportManagement from "./pages/management/ReportManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AssessmentRoundDetail from "./pages/management/AssessmentRoundDetail";
import AssessmentResultDetail from "./pages/management/AssessmentResultDetail";
import LandingPage from "./pages/LandingPage";
import { AnimatePresence } from "framer-motion";
import AssignmentDetail from "./pages/AssignmentDetail";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import RequireProfileCompletion from "./components/RequireProfileCompletion";

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
                                path="/assignments/:id"
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
            </AnimatePresence>
        </>
    );
}

export default App;
