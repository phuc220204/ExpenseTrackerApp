import { Card, CardBody } from "@heroui/react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const StatsCard = ({ title, value, type, icon: Icon }) => {
  // Xác định màu sắc dựa trên loại
  const getColors = () => {
    switch (type) {
      case "income":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/20",
          border: "border-emerald-200 dark:border-emerald-800",
          text: "text-emerald-700 dark:text-emerald-400",
          iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        };
      case "expense":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/20",
          border: "border-rose-200 dark:border-rose-800",
          text: "text-rose-700 dark:text-rose-400",
          iconBg: "bg-rose-100 dark:bg-rose-900/40",
        };
      case "balance":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/40",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          iconBg: "bg-gray-100 dark:bg-gray-800",
        };
    }
  };

  const colors = getColors();

  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 shadow-sm hover:shadow-md transition-shadow`}
    >
      <CardBody className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className={`text-lg sm:text-xl md:text-2xl font-bold ${colors.text} break-words`}>
              {formatCurrency(value)}
            </p>
          </div>
          <div
            className={`${colors.iconBg} ${colors.text} p-2 sm:p-3 rounded-lg flex-shrink-0`}
          >
            {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

/**
 * Component StatsCards để hiển thị ba chỉ số thống kê
 * @param {number} totalIncome - Tổng thu nhập
 * @param {number} totalExpense - Tổng chi tiêu
 * @param {number} balance - Số dư
 */
const StatsCards = ({
  totalIncome,
  totalExpense,
  balance,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <StatsCard
        title="Tổng Thu"
        value={totalIncome}
        type="income"
        icon={TrendingUp}
      />
      <StatsCard
        title="Tổng Chi"
        value={totalExpense}
        type="expense"
        icon={TrendingDown}
      />
      <StatsCard
        title="Số Dư"
        value={balance}
        type="balance"
        icon={Wallet}
      />
    </div>
  );
};

export default StatsCards;

