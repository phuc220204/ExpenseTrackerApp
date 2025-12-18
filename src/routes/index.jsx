import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { routesConfig } from "./routes.config";
import AuthGuard from "./guards/AuthGuard";
import Layout from "../components/Layout";

/**
 * PageLoader - Component loading khi lazy load pages
 */
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Spinner size="lg" color="primary" label="Đang tải..." />
  </div>
);

/**
 * AppRoutes - Component chính quản lý tất cả routes
 * Chia thành 3 phần: Public, Private, Error
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        {/* Không cần đăng nhập */}
        {routesConfig.public.map((route) => {
          const Element = route.element;
          return (
            <Route key={route.path} path={route.path} element={<Element />} />
          );
        })}

        {/* ========== PRIVATE ROUTES ========== */}
        {/* Cần đăng nhập mới truy cập được */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Layout />}>
            {routesConfig.private.map((route) => {
              const Element = route.element;
              return route.index ? (
                <Route key={route.path} index element={<Element />} />
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Element />}
                />
              );
            })}
          </Route>
        </Route>

        {/* ========== ERROR ROUTES ========== */}
        {/* 404 và các lỗi khác */}
        {routesConfig.error.map((route) => {
          const Element = route.element;
          return (
            <Route key={route.path} path={route.path} element={<Element />} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
