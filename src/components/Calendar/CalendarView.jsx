import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Component Lịch Chi Tiêu
 * Hiển thị giao dịch dạng lịch tháng
 * @param {Array} transactions - Mảng giao dịch
 * @param {Function} onDayClick - Callback khi click vào ngày
 */
const CalendarView = ({ transactions = [], onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Tạo mảng các ngày trong tháng (bao gồm ngày của tuần trước/sau để đủ grid)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Bắt đầu từ thứ 2
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Tính toán giao dịch theo ngày
  const transactionsByDate = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      if (!map[tx.date]) {
        map[tx.date] = { income: 0, expense: 0, count: 0, transactions: [] };
      }
      if (tx.type === "income") {
        map[tx.date].income += tx.amount;
      } else {
        map[tx.date].expense += tx.amount;
      }
      map[tx.date].count += 1;
      map[tx.date].transactions.push(tx);
    });
    return map;
  }, [transactions]);

  // Giao dịch của ngày được chọn
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return transactionsByDate[dateKey] || null;
  }, [selectedDate, transactionsByDate]);

  const handleDayClick = (day) => {
    setSelectedDate(day);
    if (onDayClick) {
      const dateKey = format(day, "yyyy-MM-dd");
      onDayClick(day, transactionsByDate[dateKey]?.transactions || []);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, "") + " tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value.toLocaleString("vi-VN");
  };

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Lịch Chi Tiêu
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={goToPreviousMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium text-slate-700 dark:text-slate-200 min-w-[120px] text-center">
            {format(currentMonth, "MMMM yyyy", { locale: vi })}
          </span>
          <Button isIconOnly size="sm" variant="light" onPress={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="flat" color="primary" onPress={goToToday}>
            Hôm nay
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-2 sm:px-6 pb-4">
        {/* Header ngày trong tuần */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid các ngày */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayData = transactionsByDate[dateKey];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`
                  relative p-1 sm:p-2 min-h-[50px] sm:min-h-[70px] rounded-lg transition-all duration-200
                  flex flex-col items-center justify-start
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${isToday ? "ring-2 ring-primary-400 ring-offset-1" : ""}
                  ${
                    isSelected
                      ? "bg-primary-100 dark:bg-primary-900/40"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {format(day, "d")}
                </span>

                {/* Indicators */}
                {dayData && (
                  <div className="flex gap-0.5 mt-1">
                    {dayData.income > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                    {dayData.expense > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                )}

                {/* Amount preview (chỉ hiển thị trên desktop) */}
                {dayData && isCurrentMonth && (
                  <div className="hidden sm:block mt-1 text-[10px] leading-tight">
                    {dayData.income > 0 && (
                      <span className="text-green-600 block">
                        +{formatCurrency(dayData.income)}
                      </span>
                    )}
                    {dayData.expense > 0 && (
                      <span className="text-red-500 block">
                        -{formatCurrency(dayData.expense)}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Chi tiết ngày được chọn */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
              {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
            </h4>
            {selectedDayData ? (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <Chip color="success" variant="flat" size="sm">
                    Thu: {formatCurrency(selectedDayData.income)}
                  </Chip>
                  <Chip color="danger" variant="flat" size="sm">
                    Chi: {formatCurrency(selectedDayData.expense)}
                  </Chip>
                  <Chip color="primary" variant="flat" size="sm">
                    {selectedDayData.count} giao dịch
                  </Chip>
                </div>
                {/* Danh sách giao dịch */}
                <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                  {selectedDayData.transactions.map((tx, i) => (
                    <div
                      key={tx.id || i}
                      className="flex justify-between items-center py-2 px-3 bg-white dark:bg-slate-700 rounded-lg text-sm"
                    >
                      <span className="text-slate-600 dark:text-slate-300 truncate">
                        {tx.category || tx.note || "Không có mô tả"}
                      </span>
                      <span
                        className={`font-medium ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Không có giao dịch nào trong ngày này.
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CalendarView;
