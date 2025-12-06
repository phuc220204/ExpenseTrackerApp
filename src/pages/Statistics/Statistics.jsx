import OverviewPieChart from "../../components/Charts/OverviewPieChart/OverviewPieChart";
import DailySpendChart from "../../components/Charts/DailySpendChart/DailySpendChart";
import DateFilterBar from "../../components/DateFilterBar";
import RefreshButton from "../../components/RefreshButton";
import ThemeButton from "../../components/ThemeButton";
import { useTransactionsContext } from "../../contexts/TransactionsContext";
import { useStatisticsFilter } from "./useStatisticsFilter";

/**
 * Component trang Thống Kê
 * Hiển thị các biểu đồ phân tích thu chi
 * Chỉ chứa UI, logic được xử lý bởi useStatisticsFilter hook
 */
function Statistics() {
  const { transactions, isLoading } = useTransactionsContext();
  const { dateRange, setDateRange, filteredTransactions, dateRangeText } =
    useStatisticsFilter(transactions);

  return (
    <div
      className={`space-y-6 transition-opacity duration-300 ${
        isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Tiêu đề */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thống Kê
          </h1>
          <div className="flex items-center gap-2">
            <ThemeButton />
            <RefreshButton />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Phân tích chi tiết thu chi của bạn
        </p>
      </div>

      {/* Thanh lọc thời gian */}
      <DateFilterBar onDateRangeChange={setDateRange} />

      {/* Text tóm tắt khoảng thời gian */}
      {dateRangeText && (
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          {dateRangeText}
        </div>
      )}

      {/* Phần biểu đồ - Layout responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn */}
        <div className="lg:col-span-1">
          <OverviewPieChart transactions={filteredTransactions} />
        </div>

        {/* Biểu đồ cột chi tiêu theo ngày */}
        <div className="lg:col-span-1">
          <DailySpendChart
            transactions={filteredTransactions}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}

export default Statistics;

