import alertBlock from '@/utils/alertBlock';
import { View, StyleSheet, Button } from 'react-native';
import { openDocumentTree } from 'react-native-scoped-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PERSISTED_FOLDER_KEY } from '../../../utils/constats';

const Configurations = () => {
  const [folderUri, setFolderUri] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPersistedFolder();
    }, [])
  );

  const loadPersistedFolder = async () => {
    const savedUri = await AsyncStorage.getItem(PERSISTED_FOLDER_KEY);
    setFolderUri(savedUri ?? '');
  };

  const handleReconfigureFolder = async () => {
    const shouldReconfigure = await alertBlock({
      title: 'Reconfigurar Pasta',
      message: 'Deseja alterar a pasta onde os arquivos são salvos?',
      isToConfirm: true,
    });
    if (!shouldReconfigure) return;

    await AsyncStorage.removeItem(PERSISTED_FOLDER_KEY);
    setFolderUri('');

    const res = await openDocumentTree(true);
    if (res?.uri) {
      await AsyncStorage.setItem(PERSISTED_FOLDER_KEY, res.uri);
      setFolderUri(res.uri);
      alertBlock({ title: 'Sucesso', message: 'Nova pasta configurada!' });
    }
  };

  const handleCheckStatus = () => {
    alertBlock({
      title: 'Status da Configuração',
      message: folderUri
        ? `Pasta configurada:\n${folderUri}\n\nPróximos downloads serão salvos automaticamente nesta pasta.`
        : 'Nenhuma pasta configurada ainda.',
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Status da Pasta" onPress={handleCheckStatus} color="#007AFF" />
      <View style={{ marginTop: 20 }} />
      <Button
        title="Configurar pasta de salvamento do excel"
        onPress={handleReconfigureFolder}
        color="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Configurations;
