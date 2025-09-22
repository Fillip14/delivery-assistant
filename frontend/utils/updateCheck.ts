import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const checkUpdate = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert('Update disponível', 'O app será reiniciado para aplicar a atualização.');
      await Updates.reloadAsync();
    }
  } catch (e: any) {
    console.log('Erro ao buscar update:', e);
    Alert.alert('Erro ao buscar update', e.message || 'Erro desconhecido');
  }
};

export default checkUpdate;
