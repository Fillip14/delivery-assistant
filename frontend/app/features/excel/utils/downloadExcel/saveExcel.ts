import { writeFile } from 'react-native-scoped-storage';
import alertBlock from '../../../../../utils/alertBlock';

const saveExcelFile = async (fileName: string, base64Content: string, folderUri: string) => {
  const finalPath = `${fileName}.xlsx`;

  const success = await writeFile(
    folderUri,
    base64Content,
    finalPath,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'base64'
  );

  if (success) {
    alertBlock({ title: 'Sucesso', message: `Arquivo salvo: ${fileName}.xlsx` });
  } else {
    alertBlock({ title: 'Erro de Permissão', message: 'Não foi possível salvar o arquivo.' });
  }
};

export default saveExcelFile;
