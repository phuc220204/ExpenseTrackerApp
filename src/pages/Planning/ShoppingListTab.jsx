import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Progress,
  Checkbox,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Plus,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useTransactionsContext } from "../../contexts/TransactionsContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";

/**
 * Component ShoppingListTab - Sổ Tay Mua Sắm
 * Cho phép lên kế hoạch mua sắm và theo dõi ngân sách dự kiến
 */
const ShoppingListTab = () => {
  const { currentUser } = useAuth();
  const { addTransaction } = useTransactionsContext();

  // State quản lý danh sách các Plan
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null); // Plan đang chọn để xem chi tiết

  // Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal tạo Plan mới
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanBudget, setNewPlanBudget] = useState("");

  // Loading real-time data
  useEffect(() => {
    if (!currentUser) return;
    const q = collection(db, "users", currentUser.uid, "shopping_plans");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort theo ngày tạo mới nhất
      plansData.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setPlans(plansData);

      // Nếu đang xem 1 plan, cập nhật lại data của nó
      setActivePlan((prevPlan) => {
        if (!prevPlan) return null;
        const updated = plansData.find((p) => p.id === prevPlan.id);
        return updated || null;
      });
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Actions
  const handleCreatePlan = async () => {
    if (!newPlanName || !newPlanBudget) return;
    try {
      const newRef = doc(
        collection(db, "users", currentUser.uid, "shopping_plans")
      );
      await setDoc(newRef, {
        name: newPlanName,
        budget: Number(newPlanBudget),
        items: [], // { id, name, price, isBought }
        createdAt: serverTimestamp(),
      });
      onOpenChange(false);
      setNewPlanName("");
      setNewPlanBudget("");
    } catch (e) {
      console.error("Lỗi tạo plan:", e);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Bạn có chắc muốn xóa kế hoạch này?")) return;
    try {
      await deleteDoc(
        doc(db, "users", currentUser.uid, "shopping_plans", planId)
      );
      if (activePlan?.id === planId) setActivePlan(null);
    } catch (e) {
      console.error("Lỗi xóa plan:", e);
    }
  };

  const handleAddItem = async (name, price) => {
    if (!activePlan) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      isBought: false,
    };
    const updatedItems = [...activePlan.items, newItem];
    await updateDoc(
      doc(db, "users", currentUser.uid, "shopping_plans", activePlan.id),
      {
        items: updatedItems,
      }
    );
  };

  const handleToggleItem = async (itemId, isChecked) => {
    if (!activePlan) return;
    const updatedItems = activePlan.items.map((item) => {
      if (item.id === itemId) return { ...item, isBought: isChecked };
      return item;
    });

    await updateDoc(
      doc(db, "users", currentUser.uid, "shopping_plans", activePlan.id),
      {
        items: updatedItems,
      }
    );

    // Nếu checked -> Hỏi user có muốn tạo giao dịch chi tiêu thật không?
    if (isChecked) {
      const item = activePlan.items.find((i) => i.id === itemId);
      // Auto add transaction feature (Optional: could confirm with toast)
      try {
        await addTransaction({
          date: new Date().toISOString().split("T")[0],
          type: "expense",
          amount: item.price,
          category: "Mua sắm",
          note: `Mua sắm theo kế hoạch: ${activePlan.name} - ${item.name}`,
          paymentMethod: "cash",
        });
        // alert("Đã tự động thêm vào Sổ Thu Chi!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!activePlan) return;
    const updatedItems = activePlan.items.filter((i) => i.id !== itemId);
    await updateDoc(
      doc(db, "users", currentUser.uid, "shopping_plans", activePlan.id),
      {
        items: updatedItems,
      }
    );
  };

  // Render logic
  const renderPlanDetail = () => {
    if (!activePlan) return null;

    const totalEstimated = activePlan.items.reduce(
      (sum, i) => sum + i.price,
      0
    );
    const totalBought = activePlan.items
      .filter((i) => i.isBought)
      .reduce((sum, i) => sum + i.price, 0);
    const remainingBudget = activePlan.budget - totalEstimated;
    const progress = (totalEstimated / activePlan.budget) * 100;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <Button variant="light" onPress={() => setActivePlan(null)}>
            ← Quay lại
          </Button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {activePlan.name}
          </h2>
          <Button
            isIconOnly
            color="danger"
            variant="light"
            onPress={() => handleDeletePlan(activePlan.id)}
          >
            <Trash2 size={20} />
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
            <CardBody className="p-4">
              <p className="text-white/80 text-sm">Ngân sách</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(activePlan.budget)}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-l-4 border-blue-500 shadow-sm">
            <CardBody className="p-4">
              <p className="text-slate-500 text-sm">Dự kiến chi</p>
              <p
                className={`text-2xl font-bold ${
                  remainingBudget < 0 ? "text-red-500" : "text-blue-600"
                }`}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalEstimated)}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-l-4 border-green-500 shadow-sm">
            <CardBody className="p-4">
              <p className="text-slate-500 text-sm">Thực tế đã mua</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalBought)}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Tiến độ ngân sách
            </span>
            <span
              className={
                remainingBudget < 0
                  ? "text-red-500 font-bold"
                  : "text-slate-500"
              }
            >
              {remainingBudget < 0 ? "Vượt ngân sách!" : "Trong tầm kiểm soát"}
            </span>
          </div>
          <Progress
            value={Math.min(progress, 100)}
            color={remainingBudget < 0 ? "danger" : "primary"}
            className="h-3"
          />
        </div>

        {/* Add Item Form */}
        <AddNewItemForm onAdd={handleAddItem} />

        {/* Item List */}
        <div className="space-y-3">
          {activePlan.items.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              Chưa có món nào. Thêm ngay để bắt đầu săn sale!
            </div>
          )}
          {activePlan.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  isSelected={item.isBought}
                  onValueChange={(checked) =>
                    handleToggleItem(item.id, checked)
                  }
                  lineThrough
                  color="success"
                >
                  <span
                    className={
                      item.isBought
                        ? "text-slate-400 line-through"
                        : "text-slate-800 dark:text-white font-medium"
                    }
                  >
                    {item.name}
                  </span>
                </Checkbox>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main View: List of Plans
  return (
    <div className="h-full">
      {activePlan ? (
        renderPlanDetail()
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Create New Card */}
            <Card
              isPressable
              onPress={onOpen}
              className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Plus className="w-6 h-6 text-primary-600" />
                </div>
                <span className="font-medium">Tạo kế hoạch mới</span>
              </div>
            </Card>

            {/* Existing Plans */}
            {plans.map((plan) => (
              <Card
                key={plan.id}
                isPressable
                onPress={() => setActivePlan(plan)}
                className="h-48 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <CardHeader className="flex gap-3">
                  <div className="p-2 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-lg text-white">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">
                      {plan.name}
                    </h3>
                    <p className="text-tiny text-slate-400">
                      {new Date(
                        plan.createdAt?.seconds * 1000
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="justify-end pb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-500 text-xs">Ngân sách</span>
                    <span className="text-lg font-bold text-primary-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(plan.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    {/* Simple progress bar */}
                    <div
                      className="bg-primary-500 h-full"
                      style={{
                        width: `${Math.min(
                          (plan.items?.reduce((s, i) => s + i.price, 0) /
                            plan.budget) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Chip size="sm" variant="flat" color="secondary">
                      {plan.items?.length || 0} món
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        plan.items?.every((i) => i.isBought) &&
                        plan.items.length > 0
                          ? "success"
                          : "warning"
                      }
                    >
                      {plan.items?.every((i) => i.isBought) &&
                      plan.items.length > 0
                        ? "Đã xong"
                        : "Đang mua"}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal Import */}
      <CreatePlanModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        name={newPlanName}
        setName={setNewPlanName}
        budget={newPlanBudget}
        setBudget={setNewPlanBudget}
        onSubmit={handleCreatePlan}
      />
    </div>
  );
};

// Sub-components
const CreatePlanModal = ({
  isOpen,
  onClose,
  name,
  setName,
  budget,
  setBudget,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onOpenChange={onClose}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Tạo Kế Hoạch Mua Sắm Mới</ModalHeader>
          <ModalBody>
            <Input
              label="Tên kế hoạch"
              placeholder="VD: Săn sale 12/12"
              value={name}
              onValueChange={setName}
              autoFocus
            />
            <Input
              label="Ngân sách dự kiến"
              placeholder="2,000,000"
              type="number"
              value={budget}
              onValueChange={setBudget}
              startContent={<span className="text-slate-400 text-sm">₫</span>}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" onPress={onSubmit}>
              Tạo ngay
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

const AddNewItemForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && price) {
      onAdd(name, price);
      setName("");
      setPrice("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-end p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700"
    >
      <Input
        label="Tên món đồ"
        placeholder="VD: Giày Adidas"
        size="sm"
        className="flex-1"
        value={name}
        onValueChange={setName}
      />
      <Input
        label="Giá dự kiến"
        placeholder="0"
        type="number"
        size="sm"
        className="w-32"
        value={price}
        onValueChange={setPrice}
      />
      <Button isIconOnly color="primary" type="submit">
        <Plus size={20} />
      </Button>
    </form>
  );
};

export default ShoppingListTab;
