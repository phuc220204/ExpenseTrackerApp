import { useState } from "react";
import { Button, Spinner, Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Plus, HandCoins, TrendingDown, AlertTriangle } from "lucide-react";
import { useDebts } from "../../contexts/DebtsContext";
import DebtCard from "../../components/Debts/DebtCard";
import CreateDebtModal from "../../components/Debts/CreateDebtModal";
import DebtPaymentModal from "../../components/Debts/DebtPaymentModal";

/**
 * Tab Món Nợ trong trang Planning
 * Hiển thị danh sách nợ vay/cho vay và các thống kê
 */
const DebtsTab = () => {
  const { debts, loading, stats, addDebt, editDebt, makePayment, removeDebt } =
    useDebts();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);

  // Filter state
  const [filterType, setFilterType] = useState("all");

  // Format số tiền
  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  // Handle create/edit submit
  const handleSubmit = async (debtData, debtId) => {
    if (debtId) {
      await editDebt(debtId, debtData);
    } else {
      await addDebt(debtData);
    }
  };

  // Handle edit click
  const handleEdit = (debt) => {
    setEditingDebt(debt);
    setIsCreateModalOpen(true);
  };

  // Handle delete click
  const handleDelete = async (debt) => {
    if (confirm(`Xác nhận xóa khoản nợ với ${debt.personName}?`)) {
      await removeDebt(debt.id);
    }
  };

  // Handle payment click
  const handlePayment = (debt) => {
    setSelectedDebtForPayment(debt);
    setIsPaymentModalOpen(true);
  };

  // Close modals
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingDebt(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedDebtForPayment(null);
  };

  // Filter debts
  const filteredDebts = debts.filter((debt) => {
    if (filterType === "all") return debt.status !== "paid";
    if (filterType === "lend")
      return debt.type === "lend" && debt.status !== "paid";
    if (filterType === "borrow")
      return debt.type === "borrow" && debt.status !== "paid";
    if (filterType === "paid") return debt.status === "paid";
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full">
                <HandCoins size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600">Cho vay</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {formatMoney(stats.totalLend)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/20">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-full">
                <TrendingDown size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-600">Đang nợ</p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {formatMoney(stats.totalBorrow)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {stats.overdueCount > 0 && (
          <Card className="bg-red-50 dark:bg-red-900/20 col-span-2 md:col-span-2">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-full">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-red-600">Quá hạn</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {stats.overdueCount} khoản
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Filter Tabs + Add Button */}
      <div className="flex justify-between items-center">
        <Tabs
          selectedKey={filterType}
          onSelectionChange={setFilterType}
          size="sm"
          variant="underlined"
          color="primary"
        >
          <Tab key="all" title="Tất cả" />
          <Tab key="lend" title="Cho vay" />
          <Tab key="borrow" title="Đi vay" />
          <Tab key="paid" title="Đã trả" />
        </Tabs>

        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          Thêm
        </Button>
      </div>

      {/* Debts List */}
      {filteredDebts.length === 0 ? (
        <Card>
          <CardBody className="p-8 text-center">
            <HandCoins size={48} className="mx-auto text-default-300 mb-4" />
            <p className="text-default-500">
              {filterType === "paid"
                ? "Chưa có khoản nợ nào được trả xong"
                : "Chưa có khoản nợ nào"}
            </p>
            <Button
              color="primary"
              variant="flat"
              className="mt-4"
              startContent={<Plus size={16} />}
              onPress={() => setIsCreateModalOpen(true)}
            >
              Thêm khoản nợ đầu tiên
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPayment={handlePayment}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateDebtModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmit}
        editingDebt={editingDebt}
      />

      <DebtPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onSubmit={makePayment}
        debt={selectedDebtForPayment}
      />
    </div>
  );
};

export default DebtsTab;
