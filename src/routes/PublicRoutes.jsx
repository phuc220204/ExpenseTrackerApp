import { Route } from "react-router-dom";
import { routesConfig } from "./routes.config";

/**
 * PublicRoutes - Render các routes công khai
 * Không cần đăng nhập để truy cập
 */
const PublicRoutes = () => {
  return (
    <>
      {routesConfig.public.map((route) => {
        const Element = route.element;
        return (
          <Route key={route.path} path={route.path} element={<Element />} />
        );
      })}
    </>
  );
};

export default PublicRoutes;

/**
 * Helper function để render public routes trong Routes component
 */
export const renderPublicRoutes = () => {
  return routesConfig.public.map((route) => {
    const Element = route.element;
    return <Route key={route.path} path={route.path} element={<Element />} />;
  });
};
