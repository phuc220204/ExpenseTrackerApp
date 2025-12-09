import { createContext, useContext } from "react";
import useBudgets from "../hooks/useBudgets";

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const budgetData = useBudgets();

  return (
    <BudgetContext.Provider value={budgetData}>
      {children}
    </BudgetContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider");
  }
  return context;
};
