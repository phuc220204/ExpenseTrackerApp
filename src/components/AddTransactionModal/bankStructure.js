import { Building2, Wallet, CreditCard } from "lucide-react";

/**
 * Cấu trúc thông tin ngân hàng/ví điện tử
 * Bao gồm: tên, loại, màu sắc, logo (icon)
 */

/**
 * Loại tài khoản
 */
export const BANK_TYPE = {
  TRADITIONAL: "traditional", // Ngân hàng truyền thống
  DIGITAL: "digital", // Ngân hàng số
  E_WALLET: "e_wallet", // Ví điện tử
};

/**
 * Danh sách ngân hàng/ví điện tử với thông tin chi tiết
 */
export const BANK_LIST = [
  // Ngân hàng truyền thống
  {
    id: "vietcombank",
    name: "Vietcombank",
    shortName: "VCB",
    type: BANK_TYPE.TRADITIONAL,
    color: "#E41E2E", // Đỏ VCB
    icon: Building2,
  },
  {
    id: "techcombank",
    name: "Techcombank",
    shortName: "TCB",
    type: BANK_TYPE.TRADITIONAL,
    color: "#0066CC", // Xanh TCB
    icon: Building2,
  },
  {
    id: "bidv",
    name: "BIDV",
    shortName: "BIDV",
    type: BANK_TYPE.TRADITIONAL,
    color: "#E41E2E", // Đỏ BIDV
    icon: Building2,
  },
  {
    id: "agribank",
    name: "Agribank",
    shortName: "Agribank",
    type: BANK_TYPE.TRADITIONAL,
    color: "#00A651", // Xanh lá Agribank
    icon: Building2,
  },
  {
    id: "mbbank",
    name: "MBBank",
    shortName: "MB",
    type: BANK_TYPE.TRADITIONAL,
    color: "#E41E2E", // Đỏ MB
    icon: Building2,
  },
  {
    id: "vpbank",
    name: "VPBank",
    shortName: "VPBank",
    type: BANK_TYPE.TRADITIONAL,
    color: "#0066CC", // Xanh VPBank
    icon: Building2,
  },
  {
    id: "acb",
    name: "ACB",
    shortName: "ACB",
    type: BANK_TYPE.TRADITIONAL,
    color: "#0066CC", // Xanh ACB
    icon: Building2,
  },
  {
    id: "tpbank",
    name: "TPBank",
    shortName: "TPBank",
    type: BANK_TYPE.TRADITIONAL,
    color: "#E41E2E", // Đỏ TPBank
    icon: Building2,
  },
  {
    id: "sacombank",
    name: "Sacombank",
    shortName: "Sacombank",
    type: BANK_TYPE.TRADITIONAL,
    color: "#E41E2E", // Đỏ Sacombank
    icon: Building2,
  },
  
  // Ngân hàng số
  {
    id: "timo",
    name: "Timo",
    shortName: "Timo",
    type: BANK_TYPE.DIGITAL,
    color: "#00A651", // Xanh lá Timo
    icon: CreditCard,
  },
  {
    id: "cake",
    name: "Cake by VPBank",
    shortName: "Cake",
    type: BANK_TYPE.DIGITAL,
    color: "#FF6B6B", // Đỏ hồng Cake
    icon: CreditCard,
  },
  {
    id: "kbank",
    name: "KBank",
    shortName: "KBank",
    type: BANK_TYPE.DIGITAL,
    color: "#0066CC", // Xanh KBank
    icon: CreditCard,
  },
  {
    id: "tnex",
    name: "TNEX",
    shortName: "TNEX",
    type: BANK_TYPE.DIGITAL,
    color: "#FF6B6B", // Đỏ hồng TNEX
    icon: CreditCard,
  },
  
  // Ví điện tử
  {
    id: "momo",
    name: "MoMo",
    shortName: "MoMo",
    type: BANK_TYPE.E_WALLET,
    color: "#A50064", // Tím MoMo
    icon: Wallet,
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    shortName: "ZaloPay",
    type: BANK_TYPE.E_WALLET,
    color: "#0068FF", // Xanh ZaloPay
    icon: Wallet,
  },
  {
    id: "vnpay",
    name: "VNPay",
    shortName: "VNPay",
    type: BANK_TYPE.E_WALLET,
    color: "#0066CC", // Xanh VNPay
    icon: Wallet,
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    shortName: "ShopeePay",
    type: BANK_TYPE.E_WALLET,
    color: "#EE4D2D", // Cam ShopeePay
    icon: Wallet,
  },
];

/**
 * Lấy thông tin ngân hàng theo ID
 */
export const getBankById = (id) => {
  return BANK_LIST.find((bank) => bank.id === id);
};

/**
 * Lấy thông tin ngân hàng theo tên
 */
export const getBankByName = (name) => {
  return BANK_LIST.find(
    (bank) => bank.name === name || bank.shortName === name
  );
};

/**
 * Lấy danh sách ngân hàng theo loại
 */
export const getBanksByType = (type) => {
  return BANK_LIST.filter((bank) => bank.type === type);
};

/**
 * Lấy tất cả tên ngân hàng (để tương thích với code cũ)
 */
export const getBankNames = () => {
  return BANK_LIST.map((bank) => bank.name);
};

