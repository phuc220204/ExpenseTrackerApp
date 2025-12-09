import { Tabs, Tab } from "@heroui/react";
import { PiggyBank, ClipboardList } from "lucide-react";
import BudgetTab from "./BudgetTab"; // Use local BudgetTab
import ShoppingListTab from "./ShoppingListTab";

/**
 * Trang Kế Hoạch Tổng Hợp
 * Chứa 2 tab:
 * 1. Ngân Sách (Quản lý limit hàng tháng)
 * 2. Sổ Tay Mua Sắm (Lên plan mua sắm cụ thể)
 */
const Planning = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Kế Hoạch Tài Chính
        </h1>
        <p className="text-slate-500">
          Quản lý ngân sách và lên kế hoạch mua sắm thông minh
        </p>
      </div>

      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Planning Options"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent:
              "group-data-[selected=true]:text-primary font-medium text-lg",
          }}
        >
          <Tab
            key="budget"
            title={
              <div className="flex items-center space-x-2">
                <PiggyBank size={20} />
                <span>Ngân Sách Tháng</span>
              </div>
            }
          >
            <div className="pt-4">
              <BudgetTab />
            </div>
          </Tab>
          <Tab
            key="shopping"
            title={
              <div className="flex items-center space-x-2">
                <ClipboardList size={20} />
                <span>Sổ Tay Mua Sắm</span>
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
