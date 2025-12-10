import { Button } from "@heroui/react";
import { Plus, X, Wallet, Sparkles } from "lucide-react";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating Action Button dạng Speed Dial
 * Gom nhóm 2 chức năng: Thêm giao dịch và Chat với AI
 */
const FloatingActionButton = ({ onOpenAddTransaction, onOpenChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-28 sm:bottom-32 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Nút Chat AI - Glassmorphism Style */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex items-center gap-2"
            >
              <Button
                isIconOnly
                className="shadow-lg backdrop-blur-md bg-transparent dark:bg-white/10 text-purple-600 dark:text-purple-400 border-2 border-blue-500 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20"
                onPress={() => {
                  onOpenChat();
                  setIsOpen(false);
                }}
                aria-label="Mở Trợ lý AI"
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Nút Thêm Giao Dịch - Explicit Blue Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                isIconOnly
                className="shadow-lg backdrop-blur-md bg-transparent dark:bg-white/10 text-blue-600 dark:text-blue-400 border-2 border-blue-500 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20"
                onPress={() => {
                  onOpenAddTransaction();
                  setIsOpen(false);
                }}
                aria-label="Thêm giao dịch thủ công"
              >
                <Wallet className="w-5 h-5" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <Button
        isIconOnly
        size="lg"
        className={`shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-transparent dark:bg-white/10 text-blue-600 dark:text-blue-400 border-2 border-blue-500 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20 ${
          isOpen ? "rotate-180" : ""
        }`}
        onPress={toggleOpen}
        aria-label={isOpen ? "Đóng menu" : "Mở menu tác vụ"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
