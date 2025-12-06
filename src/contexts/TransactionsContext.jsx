import { createContext, useContext } from "react";
import useTransactions from "../hooks/useTransactions";

const TransactionsContext = createContext(null);

/**
 * Provider component để chia sẻ transactions state giữa các components
 */
export const TransactionsProvider = ({ children }) => {
  const transactionsData = useTransactions();

  return (
    <TransactionsContext.Provider value={transactionsData}>
      {children}
    </TransactionsContext.Provider>
  );
};

/**
 * Hook để sử dụng transactions context
 * Đảm bảo tất cả components dùng cùng một instance của transactions state
 */
export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within TransactionsProvider"
    );
  }
  return context;
};

