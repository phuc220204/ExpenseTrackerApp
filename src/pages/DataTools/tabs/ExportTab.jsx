/**
 * Tab Xuất Dữ Liệu
 * Cho phép xuất dữ liệu ra Excel, Google Sheets, PDF
 */

import { Card, CardBody, Button, Chip } from "@heroui/react";
import {
  Download,
  FileSpreadsheet,
  Copy,
  FileText,
  ExternalLink,
} from "lucide-react";
import { ResultNotification } from "../components";

/**
 * ExportTab - Tab xuất dữ liệu
 * @param {number} transactionsCount - Số lượng giao dịch
 * @param {Function} onExportExcel - Callback xuất Excel
 * @param {Function} onExportGoogleSheets - Callback xuất Google Sheets
 * @param {Function} onExportPDF - Callback xuất PDF
 * @param {Function} onCopyToClipboard - Callback copy to clipboard
 * @param {boolean} isExporting - Đang xuất Excel
 * @param {boolean} isExportingToSheets - Đang xuất Google Sheets
 * @param {Object} exportResult - Kết quả xuất Excel
 * @param {Object} sheetsExportResult - Kết quả xuất Google Sheets
 */
const ExportTab = ({
  transactionsCount = 0,
  onExportExcel,
  onExportGoogleSheets,
  onExportPDF,
  onCopyToClipboard,
  isExporting = false,
  isExportingToSheets = false,
  exportResult = null,
  sheetsExportResult = null,
}) => {
  const exportOptions = [
    {
      id: "excel",
      title: "Xuất Excel (.xlsx)",
      description: "Tải về file Excel để sử dụng offline",
      icon: FileSpreadsheet,
      color: "success",
      gradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      iconBg: "bg-green-100 dark:bg-green-800/50",
      iconColor: "text-green-600 dark:text-green-400",
      action: onExportExcel,
      isLoading: isExporting,
      isDisabled: transactionsCount === 0,
    },
    {
      id: "sheets",
      title: "Xuất Google Sheets",
      description: "Tạo spreadsheet mới trên Google Drive",
      icon: ExternalLink,
      color: "primary",
      gradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-800/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      action: onExportGoogleSheets,
      isLoading: isExportingToSheets,
      isDisabled: transactionsCount === 0,
    },
    {
      id: "pdf",
      title: "Xuất PDF",
      description: "Tải về báo cáo dạng PDF",
      icon: FileText,
      color: "secondary",
      gradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-800/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      action: onExportPDF,
      isLoading: false,
      isDisabled: transactionsCount === 0,
    },
    {
      id: "clipboard",
      title: "Copy to Clipboard",
      description: "Sao chép dữ liệu dạng Tab để paste vào Excel",
      icon: Copy,
      color: "default",
      gradient:
        "from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20",
      iconBg: "bg-gray-100 dark:bg-gray-700/50",
      iconColor: "text-gray-600 dark:text-gray-400",
      action: onCopyToClipboard,
      isLoading: false,
      isDisabled: transactionsCount === 0,
    },
  ];

  return (
    <div className="space-y-4 mt-4">
      {/* Stats Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0">
        <CardBody className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xuất dữ liệu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Xuất giao dịch ra các định dạng khác nhau
              </p>
            </div>
            <Chip
              size="lg"
              color="primary"
              variant="flat"
              className="text-lg font-bold"
            >
              {transactionsCount} giao dịch
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className={`bg-gradient-to-r ${option.gradient} border-0 hover:shadow-md transition-shadow`}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${option.iconBg}`}>
                    <Icon className={`w-6 h-6 ${option.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {option.description}
                    </p>
                    <Button
                      color={option.color}
                      size="sm"
                      startContent={<Download className="w-4 h-4" />}
                      onPress={option.action}
                      isLoading={option.isLoading}
                      isDisabled={option.isDisabled}
                    >
                      Xuất
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Results */}
      <ResultNotification result={sheetsExportResult} type="export" />
      <ResultNotification result={exportResult} type="export" />

      {/* Empty State */}
      {transactionsCount === 0 && (
        <Card className="border border-dashed border-gray-300 dark:border-gray-700">
          <CardBody className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có giao dịch nào để xuất. Hãy thêm giao dịch trước.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ExportTab;
