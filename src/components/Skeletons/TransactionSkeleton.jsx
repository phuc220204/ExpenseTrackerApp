import { Card, Skeleton } from "@heroui/react";

const TransactionSkeleton = () => {
  return (
    <Card className="w-full p-4 space-y-5" radius="lg">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {/* Icon Skeleton */}
          <Skeleton className="rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-default-300"></div>
          </Skeleton>

          <div className="flex flex-col gap-2">
            {/* Title Skeleton */}
            <Skeleton className="h-3 w-32 rounded-lg">
              <div className="h-3 w-32 rounded-lg bg-default-200"></div>
            </Skeleton>
            {/* Subtitle/Date Skeleton */}
            <Skeleton className="h-3 w-24 rounded-lg">
              <div className="h-3 w-24 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </div>

        {/* Amount Skeleton */}
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-20 rounded-lg">
            <div className="h-4 w-20 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </div>
    </Card>
  );
};

export default TransactionSkeleton;
