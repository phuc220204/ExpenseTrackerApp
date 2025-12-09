import { Tabs, Tab } from "@heroui/react";
import { PiggyBank, ClipboardList, Target } from "lucide-react";
import { Suspense, lazy } from "react";
import { Spinner } from "@heroui/react";
import BudgetTab from "./BudgetTab"; // Use local BudgetTab
import ShoppingListTab from "./ShoppingListTab";

// Lazy load GoalsTab để tối ưu performance
const GoalsTab = lazy(() => import("../Goals"));

/**
 * Trang Kế Hoạch Tổng Hợp
 * Chứa 3 tab:
 * 1. Ngân Sách (Quản lý limit hàng tháng)
 * 2. Sổ Tay Mua Sắm (Lên plan mua sắm cụ thể)
 * 3. Mục tiêu tiết kiệm (Savings Goals)
 */
const Planning = () => {
  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Kế Hoạch Tài Chính
        </h1>
        <p className="text-slate-500">
          Quản lý ngân sách, mục tiêu tiết kiệm và kế hoạch mua sắm
        </p>
      </div>

      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Planning Options"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-4 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent:
              "group-data-[selected=true]:text-primary font-medium text-base md:text-lg",
          }}
        >
          <Tab
            key="budget"
            title={
              <div className="flex items-center space-x-2">
                <PiggyBank size={20} />
                <span>Ngân Sách</span>
              </div>
            }
          >
            <div className="pt-4">
              <BudgetTab />
            </div>
          </Tab>
          <Tab
            key="goals"
            title={
              <div className="flex items-center space-x-2">
                <Target size={20} />
                <span>Tiết Kiệm</span>
              </div>
            }
          >
            <div className="pt-4">
              <Suspense fallback={<Spinner size="lg" label="Đang tải..." />}>
                <GoalsTab />
              </Suspense>
            </div>
          </Tab>
          <Tab
            key="shopping"
            title={
              <div className="flex items-center space-x-2">
                <ClipboardList size={20} />
                <span>Mua Sắm</span>
              </div>
            }
          >
            <div className="pt-4">
              <ShoppingListTab />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Planning;
