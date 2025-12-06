import { Card, CardBody } from "@heroui/react";
import TransactionItem from "./TransactionItem";
import { formatDateHeader } from "./useTransactionList";

/**
 * Component hiển thị nhóm giao dịch theo ngày
 * Bao gồm header ngày và danh sách các giao dịch trong ngày đó
 */
const TransactionGroup = ({ date, transactions, onEdit, onDelete }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
        {formatDateHeader(date)}
      </h3>
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardBody className="p-0">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default TransactionGroup;

