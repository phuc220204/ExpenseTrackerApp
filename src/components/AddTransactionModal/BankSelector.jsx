import { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  Input,
  Chip,
} from "@heroui/react";
import { X } from "lucide-react";
import { BANK_LIST, getBankById, getBanksByType, BANK_TYPE } from "./bankStructure";

/**
 * Component chọn Ngân hàng/Ví điện tử với logo và màu sắc
 * Hỗ trợ tên gợi nhớ và theme color
 */
const BankSelector = ({
  value,
  onChange,
  error,
  showCustomName = false,
  customName,
  onCustomNameChange,
  themeColor,
  onThemeColorChange,
}) => {
  const [selectedBankId, setSelectedBankId] = useState("");
  const [customBankName, setCustomBankName] = useState("");

  // Parse value khi component mount hoặc value thay đổi từ bên ngoài
  useEffect(() => {
    if (value) {
      const bank = BANK_LIST.find(
        (b) => b.name === value || b.shortName === value
      );
      if (bank) {
        setSelectedBankId(bank.id);
        setCustomBankName("");
      } else {
        setSelectedBankId("other");
        setCustomBankName(value);
      }
    } else {
      setSelectedBankId("");
      setCustomBankName("");
    }
  }, [value]);

  // Xử lý khi chọn ngân hàng
  const handleBankChange = (bankId) => {
    setSelectedBankId(bankId);
    setCustomBankName("");

    if (bankId === "other") {
      // User chọn "Khác", hiển thị input tùy chỉnh
      onChange("");
    } else {
      const bank = getBankById(bankId);
      if (bank) {
        onChange(bank.name);
        // Set theme color nếu có callback
        if (onThemeColorChange) {
          onThemeColorChange(bank.color);
        }
      }
    }
  };

  // Xử lý khi nhập tên ngân hàng tùy chỉnh
  const handleCustomBankChange = (customValue) => {
    setCustomBankName(customValue);
    onChange(customValue);
  };

  const selectedBank = selectedBankId ? getBankById(selectedBankId) : null;

  // Nhóm ngân hàng theo loại
  const traditionalBanks = getBanksByType(BANK_TYPE.TRADITIONAL);
  const digitalBanks = getBanksByType(BANK_TYPE.DIGITAL);
  const eWallets = getBanksByType(BANK_TYPE.E_WALLET);

  return (
    <div className="space-y-3">
      {/* Chọn Ngân hàng/Ví */}
      <Select
        label="Ngân hàng/Ví điện tử"
        placeholder="Chọn ngân hàng hoặc ví điện tử"
        selectedKeys={selectedBankId ? [selectedBankId] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          if (selected) {
            handleBankChange(selected);
          }
        }}
        variant="bordered"
        isInvalid={!!error}
        errorMessage={error}
        disallowEmptySelection={false}
        classNames={{
          label: "text-gray-700 dark:text-gray-300",
        }}
        renderValue={(items) => {
          return items.map((item) => {
            // Nếu chọn "Khác", hiển thị "Khác"
            if (item.key === "other") {
              return (
                <div key={item.key} className="flex items-center gap-2">
                  <span>Khác</span>
                </div>
              );
            }
            const bank = getBankById(item.key);
            if (!bank) return null;
            const Icon = bank.icon;
            return (
              <div
                key={item.key}
                className="flex items-center gap-2"
                style={{ color: bank.color }}
              >
                <Icon className="w-4 h-4" />
                <span>{bank.name}</span>
              </div>
            );
          });
        }}
      >
        {/* Ngân hàng truyền thống */}
        <SelectItem
          key="section_traditional"
          isReadOnly
          className="font-semibold text-gray-700 dark:text-gray-300"
        >
          Ngân hàng truyền thống
        </SelectItem>
        {traditionalBanks.map((bank) => {
          const Icon = bank.icon;
          return (
            <SelectItem
              key={bank.id}
              value={bank.id}
              startContent={
                <Icon
                  className="w-4 h-4"
                  style={{ color: bank.color }}
                />
              }
              textValue={bank.name}
            >
              <div className="flex items-center gap-2">
                <span>{bank.name}</span>
                {bank.shortName !== bank.name && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    {bank.shortName}
                  </Chip>
                )}
              </div>
            </SelectItem>
          );
        })}

        {/* Ngân hàng số */}
        <SelectItem
          key="section_digital"
          isReadOnly
          className="font-semibold text-gray-700 dark:text-gray-300"
        >
          Ngân hàng số
        </SelectItem>
        {digitalBanks.map((bank) => {
          const Icon = bank.icon;
          return (
            <SelectItem
              key={bank.id}
              value={bank.id}
              startContent={
                <Icon
                  className="w-4 h-4"
                  style={{ color: bank.color }}
                />
              }
              textValue={bank.name}
            >
              <div className="flex items-center gap-2">
                <span>{bank.name}</span>
                {bank.shortName !== bank.name && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    {bank.shortName}
                  </Chip>
                )}
              </div>
            </SelectItem>
          );
        })}

        {/* Ví điện tử */}
        <SelectItem
          key="section_wallet"
          isReadOnly
          className="font-semibold text-gray-700 dark:text-gray-300"
        >
          Ví điện tử
        </SelectItem>
        {eWallets.map((bank) => {
          const Icon = bank.icon;
          return (
            <SelectItem
              key={bank.id}
              value={bank.id}
              startContent={
                <Icon
                  className="w-4 h-4"
                  style={{ color: bank.color }}
                />
              }
              textValue={bank.name}
            >
              <div className="flex items-center gap-2">
                <span>{bank.name}</span>
                {bank.shortName !== bank.name && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    {bank.shortName}
                  </Chip>
                )}
              </div>
            </SelectItem>
          );
        })}

        <SelectItem key="other" value="other">
          Khác
        </SelectItem>
      </Select>

      {/* Hiển thị theme color của ngân hàng đã chọn */}
      {selectedBank && showCustomName && (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: selectedBank.color }}
            title={`Màu chủ đề: ${selectedBank.name}`}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Màu chủ đề: {selectedBank.name}
          </span>
        </div>
      )}

      {/* Input tên gợi nhớ (nếu cần) */}
      {showCustomName && selectedBank && (
        <Input
          label="Tên gợi nhớ (tùy chọn)"
          placeholder={`Ví dụ: Thẻ lương ${selectedBank.shortName}`}
          value={customName || ""}
          onChange={(e) => {
            if (onCustomNameChange) {
              onCustomNameChange(e.target.value);
            }
          }}
          variant="bordered"
          classNames={{
            label: "text-gray-700 dark:text-gray-300",
          }}
        />
      )}

      {/* Input nhập tên ngân hàng tùy chỉnh */}
      {selectedBankId === "other" && (
        <Input
          label="Tên ngân hàng khác"
          placeholder="Nhập tên ngân hàng hoặc ví điện tử..."
          value={customBankName}
          onChange={(e) => handleCustomBankChange(e.target.value)}
          variant="bordered"
          endContent={
            customBankName && (
              <button
                type="button"
                onClick={() => {
                  setCustomBankName("");
                  onChange("");
                }}
                className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Xóa"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )
          }
          classNames={{
            label: "text-gray-700 dark:text-gray-300",
          }}
        />
      )}
    </div>
  );
};

export default BankSelector;

