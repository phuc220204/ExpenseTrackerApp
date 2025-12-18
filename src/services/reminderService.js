/**
 * Service cho Smart Reminders (Nhắc nhở thông minh)
 * Sử dụng Browser Notification API
 */

// Key lưu trữ preference trong localStorage
const REMINDER_PREF_KEY = "reminder_preferences";

/**
 * Lấy preferences của user
 */
export const getReminderPreferences = () => {
  try {
    const stored = localStorage.getItem(REMINDER_PREF_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          debtReminders: true,
          budgetWarnings: true,
          dailyReminders: false,
        };
  } catch {
    return {
      debtReminders: true,
      budgetWarnings: true,
      dailyReminders: false,
    };
  }
};

/**
 * Lưu preferences
 */
export const saveReminderPreferences = (prefs) => {
  localStorage.setItem(REMINDER_PREF_KEY, JSON.stringify(prefs));
};

/**
 * Yêu cầu quyền notification
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("Trình duyệt không hỗ trợ thông báo");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

/**
 * Gửi notification
 */
export const sendNotification = (title, options = {}) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.warn("Không có quyền gửi thông báo");
    return null;
  }

  return new Notification(title, {
    icon: "/logoApp.png",
    badge: "/logoApp.png",
    ...options,
  });
};

/**
 * Kiểm tra và gửi nhắc nhở nợ quá hạn
 * @param {Array} debts - Danh sách debts từ context
 */
export const checkDebtReminders = (debts) => {
  const prefs = getReminderPreferences();
  if (!prefs.debtReminders) return;

  const today = new Date().toISOString().split("T")[0];
  const overdueDebts = debts.filter(
    (d) => d.status !== "paid" && d.dueDate && d.dueDate <= today
  );

  if (overdueDebts.length > 0) {
    sendNotification("💰 Nhắc nhở trả nợ", {
      body: `Bạn có ${overdueDebts.length} khoản nợ đến hạn hoặc quá hạn`,
      tag: "debt-reminder",
    });
  }

  // Nhắc nợ sắp đến hạn (trong 3 ngày)
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysStr = threeDaysLater.toISOString().split("T")[0];

  const upcomingDebts = debts.filter(
    (d) =>
      d.status !== "paid" &&
      d.dueDate &&
      d.dueDate > today &&
      d.dueDate <= threeDaysStr
  );

  if (upcomingDebts.length > 0) {
    sendNotification("📅 Nợ sắp đến hạn", {
      body: `${upcomingDebts.length} khoản nợ sẽ đến hạn trong 3 ngày tới`,
      tag: "debt-upcoming",
    });
  }
};

/**
 * Kiểm tra và cảnh báo vượt ngân sách
 * @param {Array} budgets - Danh sách budgets với spent/limit
 */
export const checkBudgetWarnings = (budgets) => {
  const prefs = getReminderPreferences();
  if (!prefs.budgetWarnings) return;

  const overBudget = budgets.filter((b) => b.spent > b.limit);
  const nearingLimit = budgets.filter(
    (b) => b.spent >= b.limit * 0.8 && b.spent <= b.limit
  );

  if (overBudget.length > 0) {
    sendNotification("🚨 Vượt ngân sách!", {
      body: `${overBudget.length} danh mục đã vượt quá ngân sách`,
      tag: "budget-over",
    });
  } else if (nearingLimit.length > 0) {
    sendNotification("⚠️ Cảnh báo ngân sách", {
      body: `${nearingLimit.length} danh mục đã sử dụng hơn 80% ngân sách`,
      tag: "budget-warning",
    });
  }
};

/**
 * Hiển thị in-app toast thay vì notification (fallback)
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: "info" | "warning" | "error"
 */
export const showToast = (message, type = "info") => {
  // Tạo toast element
  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg 
    transition-all duration-300 transform translate-y-4 opacity-0
    ${type === "error" ? "bg-red-500 text-white" : ""}
    ${type === "warning" ? "bg-amber-500 text-white" : ""}
    ${type === "info" ? "bg-blue-500 text-white" : ""}
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.transform = "translateY(4px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
