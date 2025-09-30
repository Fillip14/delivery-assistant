import { Alert } from 'react-native';
import { writeFile } from 'react-native-scoped-storage';

const saveExcelFile = async (fileName: string, base64Content: string, folderUri: string) => {
  try {
    const finalPath = `${fileName}.xlsx`;

    const success = await writeFile(
      folderUri,
      base64Content,
      finalPath,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'base64'
    );

    if (success) {
      Alert.alert('Sucesso', `Arquivo salvo: ${fileName}.xlsx`);
    } else {
      throw new Error('Falha ao escrever arquivo');
    }
  } catch (err) {
    console.error('Erro ao salvar:', err);
    Alert.alert('Erro de Permissão');
  }
};

export default saveExcelFile;
