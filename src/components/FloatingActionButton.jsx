import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

/**
 * Floating Action Button để mở modal thêm giao dịch
 */
const FloatingActionButton = ({ onClick }) => {
  return (
    <Button
      isIconOnly
      color="primary"
      size="lg"
      className="fixed bottom-28 sm:bottom-32 lg:bottom-6 right-4 sm:right-6 z-40 shadow-lg hover:shadow-xl transition-shadow rounded-full"
      onClick={onClick}
      aria-label="Thêm giao dịch mới"
    >
      <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
    </Button>
  );
};

export default FloatingActionButton;

