import { useState } from "react";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Plus, Trophy, Flame, Target, Trash2, Calendar } from "lucide-react";
import { useChallenges } from "../../contexts/ChallengesContext";
import { format, differenceInDays, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Template thử thách phổ biến
 */
const CHALLENGE_TEMPLATES = [
  {
    id: "no_coffee",
    title: "30 ngày không mua cà phê",
    description: "Tiết kiệm tiền cà phê trong 30 ngày",
    duration: 30,
    dailyTarget: 40000,
    type: "no_spend",
  },
  {
    id: "no_boba",
    title: "30 ngày không mua trà sữa",
    description: "Tiết kiệm tiền trà sữa trong 30 ngày",
    duration: 30,
    dailyTarget: 45000,
    type: "no_spend",
  },
  {
    id: "daily_save_50k",
    title: "Tiết kiệm 50k/ngày",
    description: "Bỏ heo 50.000đ mỗi ngày trong 30 ngày",
    duration: 30,
    dailyTarget: 50000,
    type: "save_daily",
  },
  {
    id: "weekly_save_500k",
    title: "Tiết kiệm 500k/tuần",
    description: "Đặt riêng 500.000đ mỗi tuần trong 4 tuần",
    duration: 28,
    dailyTarget: 71429,
    type: "save_daily",
  },
];

/**
 * Tab Thử Thách trong trang Planning
 */
const ChallengesTab = () => {
  const {
    challenges,
    loading,
    stats,
    addChallenge,
    editChallenge,
    removeChallenge,
  } = useChallenges();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customForm, setCustomForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "30",
  });

  // Format số tiền
  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  // Handle tạo thử thách từ template
  const handleCreateFromTemplate = async (template) => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + template.duration);

    await addChallenge({
      title: template.title,
      description: template.description,
      type: template.type,
      targetAmount: template.dailyTarget * template.duration,
      dailyTarget: template.dailyTarget,
      startDate: format(today, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    setIsModalOpen(false);
  };

  // Handle tạo thử thách tùy chỉnh
  const handleCreateCustom = async () => {
    if (!customForm.title || !customForm.targetAmount) return;

    const today = new Date();
    const duration = parseInt(customForm.duration) || 30;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + duration);

    await addChallenge({
      title: customForm.title,
      description: customForm.description,
      type: "custom",
      targetAmount: parseFloat(customForm.targetAmount),
      dailyTarget: parseFloat(customForm.targetAmount) / duration,
      startDate: format(today, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    setCustomForm({
      title: "",
      description: "",
      targetAmount: "",
      duration: "30",
    });
    setIsModalOpen(false);
  };

  // Handle xóa thử thách
  const handleDelete = async (challengeId) => {
    if (confirm("Xác nhận xóa thử thách này?")) {
      await removeChallenge(challengeId);
    }
  };

  // Tính tiến độ
  const getProgress = (challenge) => {
    return (challenge.currentAmount / challenge.targetAmount) * 100;
  };

  // Tính ngày còn lại
  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    return Math.max(0, differenceInDays(parseISO(endDate), new Date()));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  const activeChallenges = challenges.filter((c) => c.status === "active");
  const completedChallenges = challenges.filter(
    (c) => c.status === "completed"
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardBody className="p-4 text-center">
            <Trophy size={24} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {stats.activeCount}
            </p>
            <p className="text-xs text-blue-600">Đang thực hiện</p>
          </CardBody>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardBody className="p-4 text-center">
            <Target size={24} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {stats.completedCount}
            </p>
            <p className="text-xs text-green-600">Hoàn thành</p>
          </CardBody>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/20">
          <CardBody className="p-4 text-center">
            <Flame size={24} className="mx-auto text-amber-600 mb-2" />
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {formatMoney(stats.totalSaved)}
            </p>
            <p className="text-xs text-amber-600">Đã tiết kiệm</p>
          </CardBody>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsModalOpen(true)}
        >
          Tạo thử thách
        </Button>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-default-900">
            Đang thực hiện
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id} className="border border-default-200">
                <CardBody className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-default-900">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-default-500">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={16} className="text-orange-500" />
                      <span className="text-sm font-bold text-orange-600">
                        {challenge.streakDays} ngày
                      </span>
                    </div>
                  </div>

                  <Progress
                    value={getProgress(challenge)}
                    color={
                      getProgress(challenge) >= 100 ? "success" : "primary"
                    }
                    size="md"
                    showValueLabel
                    label={`${formatMoney(
                      challenge.currentAmount
                    )} / ${formatMoney(challenge.targetAmount)}`}
                  />

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-default-500">
                      <Calendar size={14} />
                      <span>
                        Còn {getDaysRemaining(challenge.endDate)} ngày
                      </span>
                    </div>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(challenge.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-default-900">
            Đã hoàn thành 🎉
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="border border-success-200 bg-success-50 dark:bg-success-900/20"
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-success-700 dark:text-success-400">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-success-600">
                        Tiết kiệm được {formatMoney(challenge.currentAmount)}
                      </p>
                    </div>
                    <Chip color="success" variant="solid">
                      ✓ Hoàn thành
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {challenges.length === 0 && (
        <Card>
          <CardBody className="p-8 text-center">
            <Trophy size={48} className="mx-auto text-default-300 mb-4" />
            <p className="text-default-500 mb-4">
              Chưa có thử thách nào. Hãy tạo thử thách đầu tiên!
            </p>
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onPress={() => setIsModalOpen(true)}
            >
              Tạo thử thách
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Create Challenge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Tạo thử thách mới</ModalHeader>
          <ModalBody className="gap-6">
            {/* Templates */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-default-700">
                Chọn mẫu có sẵn
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {CHALLENGE_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    isPressable
                    onPress={() => handleCreateFromTemplate(template)}
                    className="border border-default-200 hover:border-primary transition-colors"
                  >
                    <CardBody className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-default-900">
                            {template.title}
                          </p>
                          <p className="text-xs text-default-500">
                            {template.description}
                          </p>
                        </div>
                        <Chip size="sm" color="primary" variant="flat">
                          {formatMoney(
                            template.dailyTarget * template.duration
                          )}
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Challenge */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold text-default-700">
                Hoặc tạo tùy chỉnh
              </h4>
              <Input
                label="Tên thử thách"
                placeholder="Ví dụ: Không mua đồ ăn vặt"
                value={customForm.title}
                onValueChange={(v) =>
                  setCustomForm((prev) => ({ ...prev, title: v }))
                }
              />
              <Textarea
                label="Mô tả"
                placeholder="Mô tả chi tiết..."
                value={customForm.description}
                onValueChange={(v) =>
                  setCustomForm((prev) => ({ ...prev, description: v }))
                }
                minRows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Mục tiêu tiết kiệm"
                  type="number"
                  placeholder="1000000"
                  value={customForm.targetAmount}
                  onValueChange={(v) =>
                    setCustomForm((prev) => ({ ...prev, targetAmount: v }))
                  }
                  endContent={
                    <span className="text-default-400 text-sm">VNĐ</span>
                  }
                />
                <Select
                  label="Thời gian"
                  selectedKeys={[customForm.duration]}
                  onSelectionChange={(keys) =>
                    setCustomForm((prev) => ({
                      ...prev,
                      duration: Array.from(keys)[0],
                    }))
                  }
                >
                  <SelectItem key="7">7 ngày</SelectItem>
                  <SelectItem key="14">14 ngày</SelectItem>
                  <SelectItem key="30">30 ngày</SelectItem>
                  <SelectItem key="60">60 ngày</SelectItem>
                  <SelectItem key="90">90 ngày</SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleCreateCustom}
              isDisabled={!customForm.title || !customForm.targetAmount}
            >
              Tạo tùy chỉnh
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChallengesTab;
