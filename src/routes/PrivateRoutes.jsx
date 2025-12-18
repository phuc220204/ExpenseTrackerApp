import { Route } from "react-router-dom";
import { routesConfig } from "./routes.config";
import Layout from "../components/Layout";
import AuthGuard from "./guards/AuthGuard";

/**
 * PrivateRoutes - Render các routes cần đăng nhập
 * Được bảo vệ bởi AuthGuard và wrap bởi Layout
 */
const PrivateRoutes = () => {
  return (
    <Route element={<AuthGuard />}>
      <Route path="/" element={<Layout />}>
        {routesConfig.private.map((route) => {
          const Element = route.element;
          return route.index ? (
            <Route key={route.path} index element={<Element />} />
          ) : (
            <Route key={route.path} path={route.path} element={<Element />} />
          );
        })}
      </Route>
    </Route>
  );
};

export default PrivateRoutes;

/**
 * Helper function để render private routes trong Routes component
 */
export const renderPrivateRoutes = () => {
  return (
    <Route element={<AuthGuard />}>
      <Route path="/" element={<Layout />}>
        {routesConfig.private.map((route) => {
          const Element = route.element;
          return route.index ? (
            <Route key={route.path} index element={<Element />} />
          ) : (
            <Route key={route.path} path={route.path} element={<Element />} />
          );
        })}
      </Route>
    </Route>
  );
};
