import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { useTransactionsContext } from "../contexts/TransactionsContext";

/**
 * Component nút làm mới dữ liệu
 * Hiển thị icon refresh với animation khi đang loading
 */
const RefreshButton = () => {
  const { isLoading, refreshData } = useTransactionsContext();

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onClick={refreshData}
      disabled={isLoading}
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      aria-label="Làm mới dữ liệu"
    >
      <RefreshCcw
        className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
      />
    </Button>
  );
};

export default RefreshButton;

