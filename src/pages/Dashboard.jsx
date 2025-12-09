import { useState, useMemo } from "react";
import { Tabs, Tab, Chip } from "@heroui/react";
import {
  List,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Sunset,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import StatsCards from "../components/StatsCard";
import TransactionList from "../components/Transactions/TransactionList/TransactionList";
import CalendarView from "../components/Calendar/CalendarView";
import RefreshButton from "../components/RefreshButton";
import ThemeButton from "../components/ThemeButton";
import { useTransactionsContext } from "../contexts/TransactionsContext";
import { useOutletContext } from "react-router-dom";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { vi } from "date-fns/locale";

function Dashboard() {
  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    isLoading,
    deleteTransaction,
  } = useTransactionsContext();
  const { onEditTransaction } = useOutletContext();
  const [viewMode, setViewMode] = useState("list");

  /**
   * Lấy greeting và icon theo thời gian trong ngày
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: "Chào buổi sáng", icon: Sun, color: "text-amber-500" };
    } else if (hour >= 12 && hour < 18) {
      return {
        text: "Chào buổi chiều",
        icon: Sunset,
        color: "text-orange-500",
      };
    } else {
      return { text: "Chào buổi tối", icon: Moon, color: "text-indigo-400" };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  /**
   * Thống kê nhanh cho tháng này
   */
  const monthStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const transactionCount = thisMonthTransactions.length;
    const avgDaily =
      thisMonthTransactions.length > 0
        ? Math.round(totalExpense / new Date().getDate())
        : 0;

    return { transactionCount, avgDaily };
  }, [transactions, totalExpense]);

  return (
    <div
      className={`space-y-4 sm:space-y-6 transition-opacity duration-300 ${
        isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Header cải tiến */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            {/* Greeting */}
            <div className="flex items-center gap-2 mb-1">
              <GreetingIcon className={`w-5 h-5 ${greeting.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {greeting.text}!
              </span>
            </div>
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Tổng Quan
            </h1>
            {/* Date */}
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeButton />
            <RefreshButton />
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Chip
            variant="flat"
            color="default"
            size="sm"
            startContent={<TrendingDown className="w-3 h-3" />}
          >
            {monthStats.transactionCount} giao dịch tháng này
          </Chip>
          <Chip
            variant="flat"
            color="warning"
            size="sm"
            startContent={<TrendingUp className="w-3 h-3" />}
          >
            ~{new Intl.NumberFormat("vi-VN").format(monthStats.avgDaily)}{" "}
            VND/ngày
          </Chip>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <StatsCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      {/* Tabs: Danh sách / Lịch */}
      <div className="mt-4 sm:mt-8">
        <Tabs
          selectedKey={viewMode}
          onSelectionChange={setViewMode}
          aria-label="Chế độ xem"
          color="primary"
          variant="solid"
          classNames={{
            tabList: "bg-slate-100 dark:bg-slate-800 p-1 rounded-xl",
            cursor: "bg-white dark:bg-slate-700 shadow-sm",
            tab: "px-4 py-2",
            tabContent:
              "group-data-[selected=true]:text-primary-600 dark:group-data-[selected=true]:text-primary-400 font-medium",
          }}
        >
          <Tab
            key="list"
            title={
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Danh sách</span>
              </div>
            }
          >
            <div className="mt-4">
              <TransactionList
                transactions={transactions}
                onEdit={onEditTransaction}
                onDelete={deleteTransaction}
              />
            </div>
          </Tab>
          <Tab
            key="calendar"
            title={
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Lịch</span>
              </div>
            }
          >
            <div className="mt-4">
              <CalendarView transactions={transactions} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
