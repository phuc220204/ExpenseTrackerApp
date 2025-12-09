/**
 * Component hiển thị trạng thái validation
 * Dùng chung cho cả PasteExcelTab và DirectInputTab
 */

import { CheckCircle2, XCircle } from "lucide-react";

/**
 * ValidationStatus - Hiển thị số lượng valid/invalid
 * @param {number} validCount - Số dòng hợp lệ
 * @param {number} invalidCount - Số dòng lỗi
 */
const ValidationStatus = ({ validCount = 0, invalidCount = 0 }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
          Hợp lệ: <strong>{validCount}</strong>
        </span>
      </div>
      {invalidCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300 font-medium">
            Lỗi: <strong>{invalidCount}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default ValidationStatus;
