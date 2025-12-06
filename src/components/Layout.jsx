import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import AddTransactionModal from "./AddTransactionModal/AddTransactionModal";
import FloatingActionButton from "./FloatingActionButton";
import AIChatBox from "./AIChat/AIChatBox";
import { useTransactionsContext } from "../contexts/TransactionsContext";
import { useDisclosure } from "@heroui/react";

const Layout = () => {
  const { addTransaction, updateTransaction } = useTransactionsContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    onOpenChange(false);
  };

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
    handleCloseModal();
  };

  const handleUpdateTransaction = (id, updatedData) => {
    updateTransaction(id, updatedData);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet context={{ onEditTransaction: handleOpenModal }} />
        </div>
      </main>

      {/* Floating Action Button - Add Transaction */}
      <FloatingActionButton onClick={() => handleOpenModal(null)} />

      {/* AI Chat Box */}
      <AIChatBox />

      {/* Modal thêm/sửa giao dịch */}
      <AddTransactionModal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Layout;
