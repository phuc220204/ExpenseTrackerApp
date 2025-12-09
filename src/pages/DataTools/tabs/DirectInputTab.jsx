/**
 * Tab nhập trực tiếp dữ liệu
 * Cải thiện: UI tốt hơn, dùng grid layout thay vì Table
 */

import { Card, CardBody, Button } from "@heroui/react";
import { Plus, Save } from "lucide-react";
import {
  DataInputRow,
  ValidationStatus,
  ErrorList,
  ResultNotification,
} from "../components";

/**
 * DirectInputTab - Tab nhập thủ công
 * @param {Array} data - Dữ liệu các dòng
 * @param {Function} onAddRow - Callback thêm dòng mới
 * @param {Function} onUpdateRow - Callback cập nhật dòng
 * @param {Function} onRemoveRow - Callback xóa dòng
 * @param {Function} onSaveAll - Callback lưu tất cả
 * @param {boolean} isSaving - Đang lưu
 * @param {Object} saveResult - Kết quả lưu
 */
const DirectInputTab = ({
  data = [],
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onSaveAll,
  isSaving = false,
  saveResult = null,
}) => {
  // Tính toán valid/invalid
  const validCount = data.filter((item) => item.isValid).length;
  const invalidCount = data.filter((item) => !item.isValid).length;
  const errorRows = data
    .filter((item) => !item.isValid)
    .map((item) => ({
      rowNumber: item.rowNumber,
      errors: item.errors,
    }));

  return (
    <div className="space-y-4 mt-4">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nhập trực tiếp
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Thêm giao dịch trực tiếp vào bảng. Dữ liệu sẽ được validate tự
                động.
              </p>
            </div>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onAddRow}
            >
              Thêm dòng
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Validation Status */}
      {data.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ValidationStatus
            validCount={validCount}
            invalidCount={invalidCount}
          />
          {validCount > 0 && (
            <Button
              color="success"
              startContent={<Save className="w-4 h-4" />}
              onPress={onSaveAll}
              isLoading={isSaving}
              isDisabled={isSaving || validCount === 0}
            >
              Lưu {validCount} giao dịch
            </Button>
          )}
        </div>
      )}

      {/* Table - Cuộn ngang trên mobile */}
      {data.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardBody className="p-0">
            {/* Mobile scroll hint */}
            <div className="sm:hidden px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
              <span className="text-xs text-blue-600 dark:text-blue-400">
                👉 Vuốt ngang để xem thêm các cột
              </span>
            </div>

            {/* Horizontal scroll wrapper */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <div className="col-span-1 text-center">STT</div>
                  <div className="col-span-2">Ngày</div>
                  <div className="col-span-2">Số tiền</div>
                  <div className="col-span-2">Danh mục</div>
                  <div className="col-span-1">Ghi chú</div>
                  <div className="col-span-1">Loại</div>
                  <div className="col-span-1">PT</div>
                  <div className="col-span-2 text-right">Trạng thái</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.map((item) => (
                    <DataInputRow
                      key={item.id}
                      item={item}
                      onUpdate={onUpdateRow}
                      onRemove={onRemoveRow}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {data.length === 0 && (
        <Card className="border border-dashed border-gray-300 dark:border-gray-700">
          <CardBody className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Chưa có dữ liệu
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Nhấn "Thêm dòng" để bắt đầu nhập giao dịch
            </p>
            <Button
              color="primary"
              variant="flat"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onAddRow}
            >
              Thêm dòng đầu tiên
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Error List */}
      {errorRows.length > 0 && <ErrorList errors={errorRows} />}

      {/* Result Notification */}
      <ResultNotification result={saveResult} type="save" />
    </div>
  );
};

export default DirectInputTab;
