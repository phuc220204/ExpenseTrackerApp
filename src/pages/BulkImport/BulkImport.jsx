import {
  Card,
  CardBody,
  Textarea,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Chip,
} from "@heroui/react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useBulkImport } from "./useBulkImport";
import { TEXTAREA_PLACEHOLDER } from "./constants";

/**
 * Component trang Nhập nhiều giao dịch
 * Cho phép người dùng paste dữ liệu từ Excel và import hàng loạt
 * Chỉ chứa UI, logic được xử lý bởi useBulkImport hook
 */
function BulkImport() {
  const {
    rawData,
    setRawData,
    parsedData,
    isAnalyzing,
    isSaving,
    saveResult,
    validCount,
    invalidCount,
    handleAnalyze,
    updateParsedItem,
    handleSaveAll,
  } = useBulkImport();

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nhập Nhiều
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Copy dữ liệu từ Excel và dán vào đây để nhập nhiều giao dịch cùng lúc
        </p>
      </div>

      {/* Khu vực Paste */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardBody className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dán dữ liệu từ Excel
              </label>
              <Textarea
                value={rawData}
                onValueChange={setRawData}
                placeholder={TEXTAREA_PLACEHOLDER}
                minRows={8}
                maxRows={12}
                variant="bordered"
                classNames={{
                  input: "font-mono text-sm",
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Định dạng: Mỗi dòng là một giao dịch, các cột cách nhau bằng Tab
                (khi copy từ Excel sẽ tự động có Tab)
              </p>
            </div>

            <Button
              color="primary"
              onPress={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={!rawData.trim()}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? "Đang phân tích..." : "Phân tích"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Bảng Preview */}
      {parsedData.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardBody className="p-6">
            <div className="space-y-4">
              {/* Thống kê */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Hợp lệ: <strong>{validCount}</strong>
                    </span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Lỗi: <strong>{invalidCount}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {validCount > 0 && (
                  <Button
                    color="success"
                    onPress={handleSaveAll}
                    isLoading={isSaving}
                    disabled={isSaving || validCount === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSaving ? "Đang lưu..." : `Lưu tất cả (${validCount})`}
                  </Button>
                )}
              </div>

              {/* Bảng dữ liệu */}
              <div className="overflow-x-auto">
                <Table
                  aria-label="Bảng xem trước dữ liệu"
                  classNames={{
                    wrapper: "min-h-[400px]",
                  }}
                >
                  <TableHeader>
                    <TableColumn width={60}>STT</TableColumn>
                    <TableColumn>Ngày</TableColumn>
                    <TableColumn>Số tiền</TableColumn>
                    <TableColumn>Danh mục</TableColumn>
                    <TableColumn>Ghi chú</TableColumn>
                    <TableColumn width={100}>Trạng thái</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.rowNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.date}
                            onValueChange={(value) =>
                              updateParsedItem(item.id, { date: value })
                            }
                            size="sm"
                            variant="bordered"
                            classNames={{
                              input: "text-xs",
                            }}
                            isInvalid={!item.isValid && item.errors.includes("Ngày không hợp lệ")}
                            errorMessage={
                              !item.isValid && item.errors.includes("Ngày không hợp lệ")
                                ? "Ngày không hợp lệ"
                                : undefined
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.amount?.toString() || ""}
                            onValueChange={(value) =>
                              updateParsedItem(item.id, { amount: value })
                            }
                            size="sm"
                            variant="bordered"
                            type="number"
                            classNames={{
                              input: "text-xs",
                            }}
                            isInvalid={
                              !item.isValid &&
                              item.errors.includes("Số tiền không hợp lệ")
                            }
                            errorMessage={
                              !item.isValid &&
                              item.errors.includes("Số tiền không hợp lệ")
                                ? "Số tiền không hợp lệ"
                                : undefined
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.category}
                            onValueChange={(value) =>
                              updateParsedItem(item.id, { category: value })
                            }
                            size="sm"
                            variant="bordered"
                            classNames={{
                              input: "text-xs",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.note}
                            onValueChange={(value) =>
                              updateParsedItem(item.id, { note: value })
                            }
                            size="sm"
                            variant="bordered"
                            classNames={{
                              input: "text-xs",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.isValid ? (
                            <Chip
                              size="sm"
                              color="success"
                              variant="flat"
                              startContent={
                                <CheckCircle2 className="w-3 h-3" />
                              }
                            >
                              OK
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              color="danger"
                              variant="flat"
                              startContent={<XCircle className="w-3 h-3" />}
                            >
                              Lỗi
                            </Chip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Hiển thị lỗi chi tiết */}
              {parsedData.some((item) => !item.isValid) && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                        Các dòng có lỗi:
                      </p>
                      <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                        {parsedData
                          .filter((item) => !item.isValid)
                          .map((item) => (
                            <li key={item.id}>
                              Dòng {item.rowNumber}: {item.errors.join(", ")}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Thông báo kết quả lưu */}
      {saveResult && (
        <Card
          className={`border shadow-sm ${
            saveResult.success
              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
              : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <CardBody className="p-4">
            {saveResult.success ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Lưu thành công!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Đã lưu {saveResult.saved} giao dịch vào hệ thống
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Lỗi khi lưu dữ liệu
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    {saveResult.error}
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default BulkImport;

