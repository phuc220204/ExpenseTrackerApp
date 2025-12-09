import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { ChevronDown, Plus, Wallet } from "lucide-react";
import { useTransactionsContext } from "../../contexts/TransactionsContext";

const LedgerSwitcher = () => {
  const { currentLedger, ledgers, switchLedger, addLedger } =
    useTransactionsContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newLedgerName, setNewLedgerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleAddLedger = async (onClose) => {
    if (!newLedgerName.trim()) return;

    setIsCreating(true);
    try {
      const newLedger = await addLedger(newLedgerName.trim());
      switchLedger(newLedger);
      onClose();
      setNewLedgerName("");
    } catch (error) {
      console.error("Failed to create ledger", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            className="w-full justify-between bg-gray-100 dark:bg-gray-800 h-12 px-3 mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Wallet size={18} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Sổ thu chi</span>
                <span className="font-semibold text-sm truncate max-w-[120px]">
                  {currentLedger?.name || "Sổ Chính"}
                </span>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Ledger Actions"
          selectionMode="single"
          selectedKeys={new Set([currentLedger?.id])}
          onAction={(key) => {
            if (key === "add_new") {
              onOpen();
            } else {
              const selected = ledgers.find((l) => l.id === key);
              if (selected) switchLedger(selected);
            }
          }}
        >
          {ledgers.map((item) => (
            <DropdownItem key={item.id} startContent={<Wallet size={14} />}>
              {item.name}
            </DropdownItem>
          ))}
          <DropdownItem
            key="add_new"
            className="text-primary"
            startContent={<Plus size={14} />}
          >
            Thêm sổ mới...
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tạo Sổ Thu Chi Mới</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Tên sổ"
                  placeholder="Ví dụ: Cửa hàng mẹ, Quỹ lớp..."
                  variant="bordered"
                  value={newLedgerName}
                  onValueChange={setNewLedgerName}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleAddLedger(onClose)}
                  isLoading={isCreating}
                  isDisabled={!newLedgerName.trim()}
                >
                  Tạo sổ
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LedgerSwitcher;
