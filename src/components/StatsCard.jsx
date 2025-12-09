import { Card, CardBody } from "@heroui/react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

/**
 * Component hiển thị một card thống kê single
 * Thiết kế premium với gradient và animations
 */
const StatsCard = ({ title, value, type, icon: Icon, subtitle }) => {
  // Xác định màu sắc và gradients dựa trên loại
  const getColors = () => {
    switch (type) {
      case "income":
        return {
          gradient:
            "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600",
          lightBg: "bg-emerald-50 dark:bg-emerald-950/30",
          border: "border-emerald-200/50 dark:border-emerald-700/30",
          text: "text-emerald-600 dark:text-emerald-400",
          iconBg: "bg-white/90 dark:bg-emerald-900/50",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          glow: "shadow-emerald-200/50 dark:shadow-emerald-900/30",
        };
      case "expense":
        return {
          gradient: "bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600",
          lightBg: "bg-rose-50 dark:bg-rose-950/30",
          border: "border-rose-200/50 dark:border-rose-700/30",
          text: "text-rose-600 dark:text-rose-400",
          iconBg: "bg-white/90 dark:bg-rose-900/50",
          iconColor: "text-rose-600 dark:text-rose-400",
          glow: "shadow-rose-200/50 dark:shadow-rose-900/30",
        };
      case "balance":
        return {
          gradient:
            "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600",
          lightBg: "bg-blue-50 dark:bg-blue-950/30",
          border: "border-blue-200/50 dark:border-blue-700/30",
          text: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-white/90 dark:bg-blue-900/50",
          iconColor: "text-blue-600 dark:text-blue-400",
          glow: "shadow-blue-200/50 dark:shadow-blue-900/30",
        };
      default:
        return {
          gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
          lightBg: "bg-gray-50 dark:bg-gray-900",
          border: "border-gray-200/50 dark:border-gray-700/30",
          text: "text-gray-600 dark:text-gray-400",
          iconBg: "bg-white/90",
          iconColor: "text-gray-600",
          glow: "shadow-gray-200/50",
        };
    }
  };

  const colors = getColors();
  const isNegative = value < 0;

  return (
    <Card
      className={`${colors.lightBg} ${colors.border} border overflow-hidden shadow-lg ${colors.glow} hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
    >
      <CardBody className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {title}
            </p>
            {/* Value - bigger and bolder */}
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${colors.text} truncate`}
            >
              {type === "balance" && isNegative
                ? ""
                : type === "income"
                ? "+"
                : "-"}
              {formatCurrency(Math.abs(value))}
            </p>
            {/* Subtitle indicator */}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                {type === "income" ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                ) : type === "expense" ? (
                  <ArrowDownRight className="w-3 h-3 text-rose-500" />
                ) : null}
                {subtitle}
              </p>
            )}
          </div>
          {/* Icon with gradient background */}
          <div
            className={`${colors.gradient} p-3 sm:p-4 rounded-2xl shadow-lg flex-shrink-0`}
          >
            {Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

/**
 * Component StatsCards để hiển thị ba chỉ số thống kê
 * Layout responsive với grid system
 * @param {number} totalIncome - Tổng thu nhập
 * @param {number} totalExpense - Tổng chi tiêu
 * @param {number} balance - Số dư
 */
const StatsCards = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <StatsCard
        title="Tổng Thu"
        value={totalIncome}
        type="income"
        icon={TrendingUp}
        subtitle="Trong kỳ"
      />
      <StatsCard
        title="Tổng Chi"
        value={totalExpense}
        type="expense"
        icon={TrendingDown}
        subtitle="Trong kỳ"
      />
      <StatsCard
        title="Số Dư"
        value={balance}
        type="balance"
        icon={Wallet}
        subtitle={balance >= 0 ? "Dương" : "Âm"}
      />
    </div>
  );
};

export default StatsCards;
