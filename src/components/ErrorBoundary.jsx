import React from "react";
import { Button } from "@heroui/react";
import { RefreshCcw, AlertOctagon } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Đã có lỗi xảy ra!
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Rất tiếc về sự bất tiện này. Ứng dụng gặp sự cố không mong muốn.
            </p>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
              <code className="text-xs text-red-500 font-mono break-all">
                {this.state.error && this.state.error.toString()}
              </code>
            </div>

            <Button
              color="primary"
              onPress={this.handleReset}
              startContent={<RefreshCcw className="w-4 h-4" />}
              className="w-full font-medium"
            >
              Tải lại trang
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
