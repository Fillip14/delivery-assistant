import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

type ExcelData = Record<string, any[]>;

const readExcelFile = async (uri: string): Promise<ExcelData> => {
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const workbook = XLSX.read(b64, { type: 'base64' });
  const sheets: ExcelData = {};
  workbook.SheetNames.forEach((name) => {
    sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
  });
  return sheets;
};

export default readExcelFile;
