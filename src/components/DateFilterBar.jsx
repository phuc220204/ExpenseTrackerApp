import { Card, CardBody } from "@heroui/react";
import { Select, SelectItem, Input } from "@heroui/react";
import { useState, useMemo, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subMonths,
  subDays,
  subYears,
  format,
  parseISO,
} from "date-fns";

/**
 * Component thanh lọc thời gian
 */
const DateFilterBar = ({ onDateRangeChange }) => {
  const [preset, setPreset] = useState("thisMonth");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Tính toán khoảng ngày hiện tại
  const dateRange = useMemo(() => {
    const today = new Date();
    let from, to;

    switch (preset) {
      case "thisMonth": {
        from = startOfDay(startOfMonth(today));
        to = endOfDay(today);
        break;
      }
      case "lastMonth": {
        const lastMonth = subMonths(today, 1);
        from = startOfDay(startOfMonth(lastMonth));
        to = endOfDay(endOfMonth(lastMonth));
        break;
      }
      case "last7Days": {
        from = startOfDay(subDays(today, 7));
        to = endOfDay(today);
        break;
      }
      case "last2Months": {
        from = startOfDay(subMonths(today, 2));
        to = endOfDay(today);
        break;
      }
      case "last3Months": {
        from = startOfDay(subMonths(today, 3));
        to = endOfDay(today);
        break;
      }
      case "last6Months": {
        from = startOfDay(subMonths(today, 6));
        to = endOfDay(today);
        break;
      }
      case "lastYear": {
        from = startOfDay(subYears(today, 1));
        to = endOfDay(today);
        break;
      }
      case "custom": {
        // Sẽ được xử lý khi customFrom và customTo có giá trị
        if (customFrom && customTo) {
          // Chuẩn hóa ngày custom: từ đầu ngày đến cuối ngày
          from = startOfDay(parseISO(customFrom));
          to = endOfDay(parseISO(customTo));
        } else {
          // Mặc định là tháng này nếu chưa chọn custom
          from = startOfDay(startOfMonth(today));
          to = endOfDay(today);
        }
        break;
      }
      default: {
        from = startOfDay(startOfMonth(today));
        to = endOfDay(today);
      }
    }

    return { from, to };
  }, [preset, customFrom, customTo]);

  // Gọi callback khi dateRange thay đổi
  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(dateRange);
    }
  }, [dateRange, onDateRangeChange]);

  // Format ngày để hiển thị
  const formatDateRange = (range) => {
    return `${format(range.from, "dd/MM/yyyy")} đến ${format(
      range.to,
      "dd/MM/yyyy"
    )}`;
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardBody className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Select Preset */}
          <div className="flex-1 w-full sm:w-auto">
            <Select
              label="Khoảng thời gian"
              selectedKeys={[preset]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setPreset(selected);
                // Reset custom dates khi chọn preset khác
                if (selected !== "custom") {
                  setCustomFrom("");
                  setCustomTo("");
                }
              }}
              variant="bordered"
              classNames={{
                label: "text-gray-700 dark:text-gray-300",
              }}
            >
              <SelectItem key="thisMonth" value="thisMonth">
                Tháng này
              </SelectItem>
              <SelectItem key="lastMonth" value="lastMonth">
                Tháng trước
              </SelectItem>
              <SelectItem key="last7Days" value="last7Days">
                7 ngày qua
              </SelectItem>
              <SelectItem key="last2Months" value="last2Months">
                2 tháng qua
              </SelectItem>
              <SelectItem key="last3Months" value="last3Months">
                3 tháng qua (1 Quý)
              </SelectItem>
              <SelectItem key="last6Months" value="last6Months">
                6 tháng qua
              </SelectItem>
              <SelectItem key="lastYear" value="lastYear">
                1 năm qua
              </SelectItem>
              <SelectItem key="custom" value="custom">
                Tùy chọn ngày
              </SelectItem>
            </Select>
          </div>

          {/* Custom Date Inputs */}
          {preset === "custom" && (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:flex-1">
              <div className="flex-1 w-full">
                <Input
                  type="date"
                  label="Từ ngày"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-gray-700 dark:text-gray-300",
                  }}
                />
              </div>
              <div className="flex-1 w-full">
                <Input
                  type="date"
                  label="Đến ngày"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-gray-700 dark:text-gray-300",
                  }}
                />
              </div>
            </div>
          )}

          {/* Date Range Summary */}
          {!(preset === "custom" && (!customFrom || !customTo)) && (
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {formatDateRange(dateRange)}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default DateFilterBar;
