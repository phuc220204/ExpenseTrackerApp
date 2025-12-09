import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// Helper to load font
const loadCustomFont = async (doc) => {
  try {
    const response = await fetch(
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf"
    );
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        doc.addFileToVFS("Roboto-Regular.ttf", base64data);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");
        resolve();
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Error loading font:", error);
  }
};

export const exportToPDF = async (transactions) => {
  const doc = new jsPDF();

  // Load font first for Vietnamese support
  await loadCustomFont(doc);

  // Load logo image
  try {
    const imgData = await new Promise((resolve) => {
      const img = new Image();
      img.src = "/Logo_App.jpg";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => {
        resolve(null);
      };
    });

    if (imgData) {
      // Add Logo to PDF (x: 14, y: 10, w: 15, h: 15)
      doc.addImage(imgData, "JPEG", 14, 10, 15, 15);

      // Header Position adjustment
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      if (doc.getFontList().Roboto) {
        doc.setFont("Roboto");
      }
      doc.text("Báo cáo Tài chính", 32, 20);

      doc.setFontSize(10);
      doc.text(`Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 32, 26);
    } else {
      throw new Error("Image load failed");
    }
  } catch (error) {
    console.warn("Could not load logo for PDF:", error);
    // Fallback if logo fails
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    if (doc.getFontList().Roboto) {
      doc.setFont("Roboto");
    }
    doc.text("Báo cáo Tài chính", 14, 22);

    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);
  }

  // Table Data
  const tableColumn = ["Ngày", "Danh mục", "Loại", "Số tiền", "Ghi chú"];
  const tableRows = [];

  transactions.forEach((transaction) => {
    const transactionData = [
      format(new Date(transaction.date), "dd/MM/yyyy"),
      transaction.category,
      transaction.type === "expense" ? "Chi tiêu" : "Thu nhập",
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(transaction.amount),
      transaction.note || "",
    ];
    tableRows.push(transactionData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] }, // Google Blue
    styles: {
      fontSize: 10,
      font: "Roboto",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: "auto" },
    },
  });

  doc.save("baocao-taichinh.pdf");
};
