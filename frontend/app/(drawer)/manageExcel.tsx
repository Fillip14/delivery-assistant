import React, { useState, useCallback } from 'react';
import { View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';

type ExcelData = Record<string, any[]>;

export default function ExcelScreen() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  // Lê o arquivo Excel e retorna os dados
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

  // Faz o merge de dados com base em Latitude e Longitude
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

  // Conta ocorrências por bairro e exibe
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

    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const fileUri = FileSystem.cacheDirectory + 'merged.xlsx';
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Erro', 'Compartilhamento não disponível no dispositivo');
    }
    setExcelData(null);
  }, [excelData]);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Selecionar Excel" onPress={handlePickFile} />
      {/* <Button title="testar Excel" onPress={testeFolder} /> */}
      <View style={{ marginTop: 20 }}>
        <Button title="Download Excel" onPress={handleDownloadExcel} />
      </View>
    </View>
  );
}
