import processExcel from './processExcel';
import saveExcelFile from './saveExcel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDocumentTree } from 'react-native-scoped-storage';
import alertBlock from '../../../../../utils/alertBlock';
import { PERSISTED_FOLDER_KEY } from '../../../../../utils/constats';

type ExcelData = Record<string, any[]>;

const manageExcel = async (excelData: ExcelData | null, folderUri: string) => {
  let finalFolderUri = folderUri;
  if (!excelData) {
    alertBlock({ title: 'Erro', message: 'Selecione um Excel primeiro!' });
    return finalFolderUri;
  }

  if (!folderUri) {
    const shouldConfigure = await alertBlock({
      title: 'Configurar pasta de download',
      message: 'Selecione uma pasta onde os arquivos serão salvos automaticamente.',
      isToConfirm: true,
    });
    if (!shouldConfigure) return finalFolderUri;

    const res = await openDocumentTree(true);
    if (res?.uri) {
      finalFolderUri = res.uri;
      await AsyncStorage.setItem(PERSISTED_FOLDER_KEY, res.uri);
      await alertBlock({ title: 'Sucesso', message: 'Nova pasta configurada!' });
    } else {
      alertBlock({ title: 'Erro', message: 'Falha ao escolher a pasta.' });
      return finalFolderUri;
    }
  }

  const { fileName, base64File } = await processExcel(excelData);
  await saveExcelFile(fileName, base64File, finalFolderUri);

  return finalFolderUri;
};

export default manageExcel;
