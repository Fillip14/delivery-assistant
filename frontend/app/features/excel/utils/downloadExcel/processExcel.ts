import * as XLSX from 'xlsx';

type ExcelData = Record<string, any[]>;

const processExcel = async (excelData: ExcelData) => {
  const workbook = XLSX.utils.book_new();
  for (const sheetName in excelData) {
    const ws = XLSX.utils.json_to_sheet(excelData[sheetName]);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  }

  const base64File = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  const today = new Date().toISOString().slice(0, 10);
  const timestamp = new Date().toTimeString().slice(0, 5).replace(':', '');
  const fileName = `Romaneio_${today}_${timestamp}`;

  return { fileName, base64File };
};

export default processExcel;
