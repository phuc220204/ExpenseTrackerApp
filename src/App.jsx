import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spinner } from "@heroui/react";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BudgetProvider } from "./contexts/BudgetContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CategoryProvider } from "./contexts/CategoryContext";

import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Statistics = lazy(() => import("./pages/Statistics/Statistics"));
const DataTools = lazy(() => import("./pages/DataTools/DataTools"));
const Login = lazy(() => import("./pages/Login"));
const Planning = lazy(() => import("./pages/Planning/Planning"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Loading Component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Spinner size="lg" color="primary" label="Đang tải..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CategoryProvider>
            <TransactionsProvider>
              <BudgetProvider>
                <BrowserRouter>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/terms-of-service"
                        element={<TermsOfService />}
                      />

                      {/* Protected routes - Cần đăng nhập mới truy cập được */}
                      <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Dashboard />} />
                          <Route path="statistics" element={<Statistics />} />
                          <Route path="planning" element={<Planning />} />
                          <Route path="data-tools" element={<DataTools />} />
                        </Route>
                      </Route>

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </BudgetProvider>
            </TransactionsProvider>
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
