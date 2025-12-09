import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { List, Calendar as CalendarIcon } from "lucide-react";
import StatsCards from "../components/StatsCard";
import TransactionList from "../components/Transactions/TransactionList/TransactionList";
import CalendarView from "../components/Calendar/CalendarView";
import RefreshButton from "../components/RefreshButton";
import ThemeButton from "../components/ThemeButton";
import { useTransactionsContext } from "../contexts/TransactionsContext";
import { useOutletContext } from "react-router-dom";

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

  return (
    <div
      className={`space-y-4 sm:space-y-6 transition-opacity duration-300 ${
        isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Tiêu đề */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tổng Quan
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeButton />
            <RefreshButton />
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Theo dõi thu chi của bạn
        </p>
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
