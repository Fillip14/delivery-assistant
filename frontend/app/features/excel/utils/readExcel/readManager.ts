import * as DocumentPicker from 'expo-document-picker';
import alertBlock from '../../../../../utils/alertBlock';
import mergeCoordinates from './mergeCoord';
import readExcelFile from './processRead';

const handlePickFile = async (): Promise<any> => {
  const res = await DocumentPicker.getDocumentAsync({});
  if (res.canceled) return;

  const file = res.assets[0];
  const sheets = await readExcelFile(file.uri);
  const mergedData = mergeCoordinates(sheets.Sheet1);

  alertBlock({ title: 'Sucesso', message: `Total de: ${mergedData?.length} paradas.` });

  return { Sheet1: mergedData };
};

export default handlePickFile;
