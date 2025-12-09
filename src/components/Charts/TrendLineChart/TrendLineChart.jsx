import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  parseISO,
  getWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  subMonths,
  format,
} from "date-fns";
import { useTransactionsContext } from "../../../contexts/TransactionsContext";

const TrendLineChart = () => {
  const { transactions } = useTransactionsContext();

  const data = useMemo(() => {
    const today = new Date();
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(subMonths(today, 1));

    // Helper để nhóm giao dịch theo tuần trong tháng (Tuần 1, 2, 3, 4)
    const groupByWeek = (txs, monthStart) => {
      const weeks = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      txs.forEach((t) => {
        const date = parseISO(t.date);
        // Chỉ lấy expense
        if (t.type !== "expense") return;

        // Tính tuần tương đối trong tháng (1-5)
        const dayOfMonth = date.getDate();
        const weekIndex = Math.ceil(dayOfMonth / 7);
        if (weeks[weekIndex] !== undefined) {
          weeks[weekIndex] += t.amount;
        }
      });
      return weeks;
    };

    const thisMonthTxs = transactions.filter((t) =>
      isSameMonth(parseISO(t.date), thisMonthStart)
    );
    const lastMonthTxs = transactions.filter((t) =>
      isSameMonth(parseISO(t.date), lastMonthStart)
    );

    const thisMonthData = groupByWeek(thisMonthTxs, thisMonthStart);
    const lastMonthData = groupByWeek(lastMonthTxs, lastMonthStart);

    return [1, 2, 3, 4, 5].map((week) => ({
      name: `Tuần ${week}`,
      "Tháng này": thisMonthData[week],
      "Tháng trước": lastMonthData[week],
    }));
  }, [transactions]);

  return (
    <Card className="h-[400px] w-full shadow-sm border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
          Xu hướng chi tiêu
        </h3>
        <p className="text-sm text-gray-500">
          So sánh với tháng trước (theo tuần)
        </p>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="Tháng này"
              stroke="#006FEE" // Primary Blue
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 0, fill: "#006FEE" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Tháng trước"
              stroke="#9CA3AF" // Gray
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, strokeWidth: 0, fill: "#9CA3AF" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default TrendLineChart;
