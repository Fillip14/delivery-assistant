import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handlePickFile from './utils/readExcel/readManager';
import manageExcel from './utils/downloadExcel/downloadManager';
import { PERSISTED_FOLDER_KEY } from '../../../utils/constats';

type ExcelData = Record<string, any[]>;

const ExcelScreen = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
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

  const handleGetExcel = async () => {
    const mergedData = await handlePickFile();
    setExcelData(mergedData);
  };

  const handleDownloadExcel = async () => {
    const finalFolderUri = await manageExcel(excelData, folderUri);
    setFolderUri(finalFolderUri);
    setExcelData(null);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Selecionar Excel" onPress={handleGetExcel} />
      <View style={{ marginTop: 20 }} />
      <Button title="Download Excel" onPress={handleDownloadExcel} />
    </View>
  );
};

export default ExcelScreen;
