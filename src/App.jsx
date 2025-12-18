import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AppProviders from "./providers/AppProviders";
import AppRoutes from "./routes";

/**
 * App Component - Entry point của ứng dụng
 *
 * Cấu trúc clean:
 * - ErrorBoundary: Bắt lỗi React
 * - AppProviders: Tất cả Context Providers
 * - BrowserRouter: Routing
 * - AppRoutes: Định nghĩa routes
 */
function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
