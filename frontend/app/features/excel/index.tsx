import React, { useState, useCallback, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeFile, openDocumentTree } from 'react-native-scoped-storage';

type ExcelData = Record<string, any[]>;

const PERSISTED_FOLDER_KEY = 'persistedFolderUri';

export default function ExcelScreen() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [folderUri, setFolderUri] = useState<string | null>(null);

  // ------------------ Excel Utils ------------------
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

  const mergeCoordinates = (data: any[]): any[] => {
    const merged: Record<string, any> = {};
    data.forEach((item) => {
      const key = `${item.Latitude},${item.Longitude}`;
      if (merged[key]) {
        merged[key].Sequence.push(String(item.Sequence));
      } else {
        merged[key] = { ...item, Sequence: [String(item.Sequence)] };
      }
    });

    return Object.values(merged).map((item) => ({
      ...item,
      ['Destination Address']: item['Destination Address']
        .replace('Rua', 'R')
        .replace('Rodovia', 'Rod')
        .trim(),
      Sequence: item.Sequence.join(','),
      Bairro: item.Bairro.toUpperCase().trim(),
    }));
  };

  const showBairroCount = (data: any[]) => {
    const count: Record<string, number> = {};
    data.forEach((item) => {
      const bairro = item.Bairro.toUpperCase();
      count[bairro] = (count[bairro] || 0) + 1;
    });
    let message = '';
    for (const bairro in count) {
      message += `${bairro}: ${count[bairro]}\n`;
    }
    Alert.alert('Contagem por Bairro', message);
  };

  const handlePickFile = useCallback(async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.canceled) return;

    const file = res.assets[0];
    const sheets = await readExcelFile(file.uri);
    const mergedData = mergeCoordinates(sheets.Sheet1);

    showBairroCount(mergedData);
    setExcelData({ Sheet1: mergedData });
  }, []);

  // ------------------ SAF / Scoped Storage ------------------
  const loadPersistedFolder = useCallback(async () => {
    const savedUri = await AsyncStorage.getItem(PERSISTED_FOLDER_KEY);
    if (savedUri) {
      setFolderUri(savedUri);
    }
  }, []);

  useEffect(() => {
    loadPersistedFolder();
  }, [loadPersistedFolder]);

  const selectFolder = useCallback(async (): Promise<string | null> => {
    const res = await openDocumentTree(true);
    if (res?.uri) {
      await AsyncStorage.setItem(PERSISTED_FOLDER_KEY, res.uri);
      setFolderUri(res.uri);
      return res.uri;
    }
    return null;
  }, []);

  const saveExcelFile = useCallback(
    async (fileName: string, base64Content: string) => {
      let targetUri = folderUri;

      if (!targetUri) {
        Alert.alert(
          'Primeira Configuração',
          'Selecione uma pasta (como Downloads) onde os arquivos serão salvos automaticamente.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Selecionar Pasta',
              onPress: async () => {
                const newFolder = await selectFolder();
                if (newFolder) saveExcelFile(fileName, base64Content);
              },
            },
          ]
        );
        return;
      }

      try {
        const finalPath = `${fileName}.xlsx`;

        const success = await writeFile(
          targetUri,
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

        // Se der erro, limpa a configuração e tenta novamente
        await AsyncStorage.removeItem(PERSISTED_FOLDER_KEY);
        setFolderUri(null);

        Alert.alert(
          'Erro de Permissão',
          'A pasta pode ter perdido permissão. Selecione uma nova pasta.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Nova Pasta',
              onPress: async () => {
                const newFolder = await selectFolder();
                if (newFolder) saveExcelFile(fileName, base64Content);
              },
            },
          ]
        );
      }
    },
    [folderUri, selectFolder]
  );

  // ------------------ Download ------------------
  const handleDownloadExcel = useCallback(async () => {
    if (!excelData) {
      Alert.alert('Erro', 'Selecione um Excel primeiro!');
      return;
    }

    const workbook = XLSX.utils.book_new();
    for (const sheetName in excelData) {
      const ws = XLSX.utils.json_to_sheet(excelData[sheetName]);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    }

    const base64File = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toTimeString().slice(0, 5).replace(':', '');
    const fileName = `RomaneioMerged_${today}_${timestamp}`;

    await saveExcelFile(fileName, base64File);
    setExcelData(null);
  }, [excelData, saveExcelFile]);

  // ------------------ Reconfigurar pasta ------------------
  const handleReconfigureFolder = useCallback(async () => {
    Alert.alert('Reconfigurar Pasta', 'Deseja alterar a pasta onde os arquivos são salvos?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, Alterar',
        onPress: async () => {
          await AsyncStorage.removeItem(PERSISTED_FOLDER_KEY);
          setFolderUri(null);
          const newFolder = await selectFolder();
          if (newFolder) {
            Alert.alert('Sucesso', 'Nova pasta configurada!');
          }
        },
      },
    ]);
  }, [selectFolder]);

  const handleCheckStatus = useCallback(() => {
    if (folderUri) {
      Alert.alert(
        'Status da Configuração',
        `Pasta configurada:\n${folderUri}\n\nPróximos downloads serão salvos automaticamente nesta pasta.`
      );
    } else {
      Alert.alert('Status da Configuração', 'Nenhuma pasta configurada ainda.');
    }
  }, [folderUri]);

  // ------------------ Render ------------------
  return (
    <View style={{ padding: 20 }}>
      <Button title="Selecionar Excel" onPress={handlePickFile} />
      <View style={{ marginTop: 20 }} />
      <Button title="Download Excel" onPress={handleDownloadExcel} />
      <View style={{ marginTop: 20 }} />
      <Button title="Status da Pasta" onPress={handleCheckStatus} color="#007AFF" />
      <View style={{ marginTop: 10 }} />
      <Button title="Reconfigurar Pasta" onPress={handleReconfigureFolder} color="#666" />
    </View>
  );
}
