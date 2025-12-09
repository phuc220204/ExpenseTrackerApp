import OverviewPieChart from "../../components/Charts/OverviewPieChart/OverviewPieChart";
import DailySpendChart from "../../components/Charts/DailySpendChart/DailySpendChart";
import FluctuationChart from "../../components/Charts/FluctuationChart";
import DateFilterBar from "../../components/DateFilterBar";
import RefreshButton from "../../components/RefreshButton";
import ThemeButton from "../../components/ThemeButton";
import { useTransactionsContext } from "../../contexts/TransactionsContext";
import { useStatisticsFilter } from "./useStatisticsFilter";
import TrendLineChart from "../../components/Charts/TrendLineChart/TrendLineChart";
import { useState } from "react";
import { Card, CardBody, CardHeader, ButtonGroup, Button } from "@heroui/react";
import { BarChart3 } from "lucide-react";

/**
 * Component trang Thống Kê
 * Hiển thị các biểu đồ phân tích thu chi
 * Chỉ chứa UI, logic được xử lý bởi useStatisticsFilter hook
 */
function Statistics() {
  const { transactions, isLoading } = useTransactionsContext();
  const { dateRange, setDateRange, filteredTransactions, dateRangeText } =
    useStatisticsFilter(transactions);
  const [fluctuationMode, setFluctuationMode] = useState("daily");

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

        {/* Biểu đồ Biến động Thu Chi - Full Width */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 shadow-md">
          <CardHeader className="flex justify-between items-center px-6 pt-5 pb-0">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Biến Động Thu Chi
              </h3>
            </div>
            <ButtonGroup size="sm" variant="flat">
              <Button
                color={fluctuationMode === "daily" ? "primary" : "default"}
                onPress={() => setFluctuationMode("daily")}
              >
                Theo ngày
              </Button>
              <Button
                color={fluctuationMode === "monthly" ? "primary" : "default"}
                onPress={() => setFluctuationMode("monthly")}
              >
                Theo tháng
              </Button>
            </ButtonGroup>
          </CardHeader>
          <CardBody className="px-2 sm:px-6">
            <FluctuationChart
              transactions={transactions}
              viewMode={fluctuationMode}
            />
          </CardBody>
        </Card>

        {/* Biểu đồ xu hướng - Full Width */}
        <div className="lg:col-span-2">
          <TrendLineChart />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
