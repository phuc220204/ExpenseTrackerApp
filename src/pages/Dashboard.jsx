import { } from "react";
import StatsCards from "../components/StatsCard";
import TransactionList from "../components/Transactions/TransactionList/TransactionList";
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

  return (
    <div className={`space-y-4 sm:space-y-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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

      {/* Danh sách giao dịch */}
      <div className="mt-4 sm:mt-8">
        <TransactionList
          transactions={transactions}
          onEdit={onEditTransaction}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
}

export default Dashboard;
