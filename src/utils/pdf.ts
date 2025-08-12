import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// PDF 配置选项类型
interface PDFOptions {
  orientation?: 'portrait' | 'landscape';
  unit?: 'mm' | 'cm' | 'in' | 'px';
  format?: 'a0' | 'a1' | 'a2' | 'a3' | 'a4';
}

// 创建 PDF 实例的工厂函数
export const createPDF = (options: PDFOptions = {}) => {
  return new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: options.unit || 'mm',
    format: options.format || 'a4',
  });
};

// 生成表格 PDF 的类型安全函数
export const generateTablePDF = (
  data: any[],
  headers: string[],
  filename: string = 'table.pdf'
) => {
  const doc = createPDF();

  // 使用autoTable插件
  (doc as any).autoTable({
    head: [headers],
    body: data,
    theme: 'striped',
    margin: { top: 10 },
  });

  doc.save(filename);
  return doc;
};