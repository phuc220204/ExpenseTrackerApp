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
  Select,
  SelectItem,
  Chip,
  Tabs,
  Tab,
  Tooltip,
} from "@heroui/react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useDataTools } from "./useDataTools";
import { IMPORT_TEXTAREA_PLACEHOLDER } from "./constants";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  OTHER_OPTION_KEY,
} from "../../components/AddTransactionModal/constants";
import {
  formatAmountInput,
  parseAmountInput,
} from "../../utils/formatCurrency";

/**
 * Component trang Công cụ Dữ liệu
 * Cho phép người dùng nhập/xuất dữ liệu số lượng lớn
 * Chỉ chứa UI, logic được xử lý bởi useDataTools hook
 */
function DataTools() {
  const {
    rawData,
    setRawData,
    parsedData,
    directInputData,
    isAnalyzing,
    isSaving,
    isExporting,
    isExportingToSheets,
    saveResult,
    exportResult,
    sheetsExportResult,
    validCount,
    invalidCount,
    transactionsCount,
    handleAnalyze,
    updateParsedItem,
    removeParsedItem,
    addNewDirectInputRow,
    updateDirectInputItem,
    removeDirectInputItem,
    handleSaveAll,
    handleDownloadSample,
    handleExportToExcel,
    handleCopyToClipboard,
    handleExportToGoogleSheets,
  } = useDataTools();

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Tiêu đề */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Công Cụ Dữ Liệu
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Nhập và xuất dữ liệu số lượng lớn để tương tác với Excel/Google Sheets
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Data Tools Tabs"
        variant="bordered"
        size="sm"
        className="w-full"
        classNames={{
          tabList: "gap-1 sm:gap-2 overflow-x-auto",
          tab: "min-w-fit px-2 sm:px-4",
          tabContent: "text-xs sm:text-sm",
        }}
      >
        {/* Tab A: Paste từ Excel */}
        <Tab
          key="paste"
          title={
            <Tooltip
              content="Paste từ Excel"
              placement="bottom"
              className="sm:hidden"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Paste từ Excel</span>
              </div>
            </Tooltip>
          }
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-6 mt-3 sm:mt-4 md:mt-6">
            {/* Nút tải file mẫu */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tải file mẫu Excel
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Tải file mẫu để biết định dạng dữ liệu cần nhập
                    </p>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<Download className="w-4 h-4" />}
                    onPress={handleDownloadSample}
                  >
                    Tải file mẫu
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Khu vực Paste */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dán dữ liệu từ Excel
                    </label>
                    <Textarea
                      value={rawData}
                      onValueChange={setRawData}
                      placeholder={IMPORT_TEXTAREA_PLACEHOLDER}
                      minRows={8}
                      maxRows={12}
                      variant="bordered"
                      classNames={{
                        input: "font-mono text-sm",
                      }}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Định dạng: Mỗi dòng là một giao dịch, các cột cách nhau
                      bằng Tab (khi copy từ Excel sẽ tự động có Tab). Bỏ dòng
                      tiêu đề khi paste.
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

            {/* Bảng Preview (từ Paste) */}
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
                          {isSaving
                            ? "Đang lưu..."
                            : `Lưu vào hệ thống (${validCount})`}
                        </Button>
                      )}
                    </div>

                    {/* Bảng dữ liệu */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                      <Table
                        aria-label="Bảng xem trước dữ liệu"
                        classNames={{
                          wrapper: "min-h-[400px] min-w-full",
                        }}
                      >
                        <TableHeader>
                          <TableColumn width={60}>STT</TableColumn>
                          <TableColumn>Ngày</TableColumn>
                          <TableColumn>Số tiền</TableColumn>
                          <TableColumn width={180}>Danh mục</TableColumn>
                          <TableColumn>Ghi chú</TableColumn>
                          <TableColumn>Loại</TableColumn>
                          <TableColumn width={150}>Phương thức</TableColumn>
                          <TableColumn width={100}>Trạng thái</TableColumn>
                          <TableColumn width={80}>Hành động</TableColumn>
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
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.includes("Ngày không hợp lệ")
                                      ? "Ngày không hợp lệ"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.includes("Ngày không hợp lệ")
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Input
                                    value={item.date}
                                    onValueChange={(value) =>
                                      updateParsedItem(item.id, { date: value })
                                    }
                                    size="sm"
                                    variant="bordered"
                                    type="date"
                                    classNames={{
                                      input: "text-xs",
                                    }}
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.includes("Ngày không hợp lệ")
                                    }
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.includes("Số tiền không hợp lệ")
                                      ? "Số tiền không hợp lệ"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.includes(
                                        "Số tiền không hợp lệ"
                                      )
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Input
                                    value={
                                      item.amount
                                        ? formatAmountInput(
                                            item.amount.toString()
                                          )
                                        : ""
                                    }
                                    onValueChange={(value) => {
                                      const parsed = parseAmountInput(value);
                                      updateParsedItem(item.id, {
                                        amount: parsed || "",
                                      });
                                    }}
                                    size="sm"
                                    variant="bordered"
                                    classNames={{
                                      input: "text-xs",
                                    }}
                                    placeholder="0"
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.includes(
                                        "Số tiền không hợp lệ"
                                      )
                                    }
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Select
                                  selectedKeys={
                                    item.category ? [item.category] : []
                                  }
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (selected) {
                                      updateParsedItem(item.id, {
                                        category: selected,
                                      });
                                    }
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  placeholder="Chọn danh mục"
                                  aria-label="Danh mục"
                                  classNames={{
                                    trigger:
                                      "min-h-unit-8 h-unit-8 min-w-[160px]",
                                  }}
                                  disallowEmptySelection={false}
                                >
                                  {[
                                    ...INCOME_CATEGORIES,
                                    ...EXPENSE_CATEGORIES,
                                    "Khác",
                                  ].map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.note || ""}
                                  onValueChange={(value) => {
                                    updateParsedItem(item.id, { note: value });
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  classNames={{
                                    input: "text-xs",
                                  }}
                                  aria-label="Ghi chú"
                                />
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.some((e) => e.includes("Loại"))
                                      ? "Phải chọn 'Thu' hoặc 'Chi'"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.some((e) =>
                                        e.includes("Loại")
                                      )
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Select
                                    selectedKeys={item.type ? [item.type] : []}
                                    onSelectionChange={(keys) => {
                                      const selected = Array.from(keys)[0];
                                      if (selected) {
                                        updateParsedItem(item.id, {
                                          type: selected,
                                        });
                                      }
                                    }}
                                    size="md"
                                    variant="bordered"
                                    placeholder="Chọn loại"
                                    aria-label="Loại giao dịch"
                                    classNames={{
                                      trigger:
                                        "min-h-unit-10 h-unit-10 text-sm min-w-[120px]",
                                      value: "text-sm",
                                    }}
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.some((e) =>
                                        e.includes("Loại")
                                      )
                                    }
                                  >
                                    <SelectItem key="income" value="income">
                                      Thu
                                    </SelectItem>
                                    <SelectItem key="expense" value="expense">
                                      Chi
                                    </SelectItem>
                                  </Select>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Select
                                  selectedKeys={
                                    item.paymentMethod
                                      ? [item.paymentMethod]
                                      : ["cash"]
                                  }
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (selected) {
                                      updateParsedItem(item.id, {
                                        paymentMethod: selected,
                                      });
                                    }
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  placeholder="Chọn phương thức"
                                  aria-label="Phương thức thanh toán"
                                  classNames={{
                                    trigger:
                                      "min-h-unit-8 h-unit-8 min-w-[140px]",
                                  }}
                                >
                                  <SelectItem key="cash" value="cash">
                                    Tiền mặt
                                  </SelectItem>
                                  <SelectItem key="transfer" value="transfer">
                                    Chuyển khoản
                                  </SelectItem>
                                </Select>
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
                                    startContent={
                                      <XCircle className="w-3 h-3" />
                                    }
                                  >
                                    Lỗi
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => removeParsedItem(item.id)}
                                  aria-label="Xóa dòng"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
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
                                    Dòng {item.rowNumber}:{" "}
                                    {item.errors.join(", ")}
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
        </Tab>

        {/* Tab B: Nhập trực tiếp vào bảng */}
        <Tab
          key="direct-input"
          title={
            <Tooltip
              content="Nhập trực tiếp"
              placement="bottom"
              className="sm:hidden"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Nhập trực tiếp</span>
              </div>
            </Tooltip>
          }
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-6 mt-3 sm:mt-4 md:mt-6">
            {/* Header */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Nhập trực tiếp vào bảng
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhập dữ liệu trực tiếp vào bảng bên dưới. Dữ liệu sẽ được
                      validate tự động.
                    </p>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={addNewDirectInputRow}
                  >
                    Thêm hàng mới
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Bảng nhập trực tiếp */}
            {directInputData.length > 0 ? (
              <>
                {/* Thống kê */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardBody className="p-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Hợp lệ:{" "}
                            <strong>
                              {
                                directInputData.filter((item) => item.isValid)
                                  .length
                              }
                            </strong>
                          </span>
                        </div>
                        {directInputData.filter((item) => !item.isValid)
                          .length > 0 && (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Lỗi:{" "}
                              <strong>
                                {
                                  directInputData.filter(
                                    (item) => !item.isValid
                                  ).length
                                }
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>

                      {directInputData.filter((item) => item.isValid).length >
                        0 && (
                        <Button
                          color="success"
                          onPress={handleSaveAll}
                          isLoading={isSaving}
                          disabled={
                            isSaving ||
                            directInputData.filter((item) => item.isValid)
                              .length === 0
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSaving
                            ? "Đang lưu..."
                            : `Lưu vào hệ thống (${
                                directInputData.filter((item) => item.isValid)
                                  .length
                              })`}
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Bảng dữ liệu */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardBody className="p-6">
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                      <Table
                        aria-label="Bảng nhập trực tiếp"
                        classNames={{
                          wrapper: "min-w-full min-h-[200px]",
                          td: "py-2",
                          th: "py-2",
                        }}
                      >
                        <TableHeader>
                          <TableColumn width={60}>STT</TableColumn>
                          <TableColumn>Ngày</TableColumn>
                          <TableColumn>Số tiền</TableColumn>
                          <TableColumn width={180}>Danh mục</TableColumn>
                          <TableColumn>Ghi chú</TableColumn>
                          <TableColumn>Loại</TableColumn>
                          <TableColumn width={150}>Phương thức</TableColumn>
                          <TableColumn width={100}>Trạng thái</TableColumn>
                          <TableColumn width={80}>Hành động</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {directInputData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.rowNumber}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.includes("Ngày không hợp lệ")
                                      ? "Ngày không hợp lệ"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.includes("Ngày không hợp lệ")
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Input
                                    value={item.date}
                                    onValueChange={(value) =>
                                      updateDirectInputItem(item.id, {
                                        date: value,
                                      })
                                    }
                                    size="sm"
                                    variant="bordered"
                                    type="date"
                                    classNames={{
                                      input: "text-xs",
                                    }}
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.includes("Ngày không hợp lệ")
                                    }
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.includes("Số tiền không hợp lệ")
                                      ? "Số tiền không hợp lệ"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.includes(
                                        "Số tiền không hợp lệ"
                                      )
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Input
                                    value={
                                      item.amount
                                        ? formatAmountInput(
                                            item.amount.toString()
                                          )
                                        : ""
                                    }
                                    onValueChange={(value) => {
                                      const parsed = parseAmountInput(value);
                                      updateDirectInputItem(item.id, {
                                        amount: parsed || "",
                                      });
                                    }}
                                    size="sm"
                                    variant="bordered"
                                    classNames={{
                                      input: "text-xs",
                                    }}
                                    placeholder="0"
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.includes(
                                        "Số tiền không hợp lệ"
                                      )
                                    }
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Select
                                  selectedKeys={
                                    item.category ? [item.category] : []
                                  }
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (selected) {
                                      updateDirectInputItem(item.id, {
                                        category: selected,
                                      });
                                    }
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  placeholder="Chọn danh mục"
                                  classNames={{
                                    trigger:
                                      "min-h-unit-8 h-unit-8 min-w-[160px]",
                                  }}
                                  disallowEmptySelection={false}
                                >
                                  {[
                                    ...INCOME_CATEGORIES,
                                    ...EXPENSE_CATEGORIES,
                                    "Khác",
                                  ].map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.note || ""}
                                  onValueChange={(value) => {
                                    updateDirectInputItem(item.id, {
                                      note: value,
                                    });
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  classNames={{
                                    input: "text-xs",
                                  }}
                                  aria-label="Ghi chú"
                                />
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  content={
                                    !item.isValid &&
                                    item.errors.some((e) => e.includes("Loại"))
                                      ? "Phải chọn 'Thu' hoặc 'Chi'"
                                      : ""
                                  }
                                  isDisabled={
                                    !(
                                      !item.isValid &&
                                      item.errors.some((e) =>
                                        e.includes("Loại")
                                      )
                                    )
                                  }
                                  color="danger"
                                  placement="top"
                                >
                                  <Select
                                    selectedKeys={item.type ? [item.type] : []}
                                    onSelectionChange={(keys) => {
                                      const selected = Array.from(keys)[0];
                                      if (selected) {
                                        updateDirectInputItem(item.id, {
                                          type: selected,
                                        });
                                      }
                                    }}
                                    size="md"
                                    variant="bordered"
                                    placeholder="Chọn loại"
                                    classNames={{
                                      trigger:
                                        "min-h-unit-10 h-unit-10 text-sm min-w-[120px]",
                                      value: "text-sm",
                                    }}
                                    isInvalid={
                                      !item.isValid &&
                                      item.errors.some((e) =>
                                        e.includes("Loại")
                                      )
                                    }
                                  >
                                    <SelectItem key="income" value="income">
                                      Thu
                                    </SelectItem>
                                    <SelectItem key="expense" value="expense">
                                      Chi
                                    </SelectItem>
                                  </Select>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Select
                                  selectedKeys={
                                    item.paymentMethod
                                      ? [item.paymentMethod]
                                      : ["cash"]
                                  }
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (selected) {
                                      updateDirectInputItem(item.id, {
                                        paymentMethod: selected,
                                      });
                                    }
                                  }}
                                  size="sm"
                                  variant="bordered"
                                  placeholder="Chọn phương thức"
                                  classNames={{
                                    trigger:
                                      "min-h-unit-8 h-unit-8 min-w-[140px]",
                                  }}
                                >
                                  <SelectItem key="cash" value="cash">
                                    Tiền mặt
                                  </SelectItem>
                                  <SelectItem key="transfer" value="transfer">
                                    Chuyển khoản
                                  </SelectItem>
                                </Select>
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
                                    startContent={
                                      <XCircle className="w-3 h-3" />
                                    }
                                  >
                                    Lỗi
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => removeDirectInputItem(item.id)}
                                  aria-label="Xóa dòng"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Hiển thị lỗi chi tiết */}
                    {directInputData.some((item) => !item.isValid) && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                              Các dòng có lỗi:
                            </p>
                            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                              {directInputData
                                .filter((item) => !item.isValid)
                                .map((item) => (
                                  <li key={item.id}>
                                    Dòng {item.rowNumber}:{" "}
                                    {item.errors.join(", ")}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardBody className="p-12">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm mb-4">
                      Chưa có dữ liệu. Nhấn "Thêm hàng mới" để bắt đầu nhập.
                    </p>
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
        </Tab>

        {/* Tab C: Xuất Dữ Liệu */}
        <Tab
          key="export"
          title={
            <Tooltip
              content="Xuất Dữ Liệu"
              placement="bottom"
              className="sm:hidden"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Xuất Dữ Liệu</span>
              </div>
            </Tooltip>
          }
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-6 mt-3 sm:mt-4 md:mt-6">
            {/* Thống kê */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Hiện có{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                      {transactionsCount}
                    </span>{" "}
                    giao dịch trong hệ thống
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bạn có thể xuất toàn bộ dữ liệu ra file Excel hoặc sao chép
                    vào clipboard
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Nút xuất Excel */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Xuất ra Excel (.xlsx)
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Tải xuống file Excel chứa toàn bộ lịch sử giao dịch của
                      bạn
                    </p>
                  </div>
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<FileSpreadsheet className="w-5 h-5" />}
                    onPress={handleExportToExcel}
                    isLoading={isExporting}
                    disabled={transactionsCount === 0}
                    className="w-full sm:w-auto"
                  >
                    {isExporting ? "Đang xuất..." : "Xuất ra Excel"}
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Nút copy to clipboard */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Sao chép vào Clipboard
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Sao chép dữ liệu dạng bảng vào bộ nhớ đệm để paste thẳng
                      vào Google Sheets đang mở
                    </p>
                  </div>
                  <Button
                    color="secondary"
                    size="lg"
                    variant="flat"
                    startContent={<Copy className="w-5 h-5" />}
                    onPress={handleCopyToClipboard}
                    disabled={transactionsCount === 0}
                    className="w-full sm:w-auto"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Google Sheets Sync */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Đồng bộ với Google Sheets
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Xuất dữ liệu trực tiếp vào một Google Sheet mới. Bạn sẽ
                      được yêu cầu đăng nhập lại để cấp quyền truy cập Google
                      Sheets.
                    </p>
                  </div>
                  <Button
                    color="success"
                    size="lg"
                    startContent={<FileSpreadsheet className="w-5 h-5" />}
                    onPress={handleExportToGoogleSheets}
                    isLoading={isExportingToSheets}
                    disabled={transactionsCount === 0}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isExportingToSheets
                      ? "Đang xuất..."
                      : "Export to Google Sheets"}
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Thông báo kết quả xuất Google Sheets */}
            {sheetsExportResult && (
              <Card
                className={`border shadow-sm ${
                  sheetsExportResult.success
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <CardBody className="p-4">
                  {sheetsExportResult.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            {sheetsExportResult.message}
                          </p>
                        </div>
                      </div>
                      {sheetsExportResult.spreadsheetUrl && (
                        <Button
                          color="success"
                          variant="flat"
                          startContent={<ExternalLink className="w-4 h-4" />}
                          onPress={() => {
                            window.open(
                              sheetsExportResult.spreadsheetUrl,
                              "_blank"
                            );
                          }}
                          className="w-full sm:w-auto"
                        >
                          Mở Google Sheet
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          Lỗi khi xuất dữ liệu
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          {sheetsExportResult.error}
                        </p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Thông báo kết quả xuất */}
            {exportResult && (
              <Card
                className={`border shadow-sm ${
                  exportResult.success
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <CardBody className="p-4">
                  {exportResult.success ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          {exportResult.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          Lỗi khi xuất dữ liệu
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          {exportResult.error}
                        </p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default DataTools;
