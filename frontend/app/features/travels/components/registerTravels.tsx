import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadKmData, clearAllKmData } from '../services/kmStorage';
import { kmManager } from '../utils/saveTravel/saveKmManager';

type RegistroStackParamList = {
  RegisterTravels: undefined;
  weeklyReports: undefined;
};

type NavigationProps = NativeStackNavigationProp<RegistroStackParamList, 'RegisterTravels'>;

const RegisterTravels = () => {
  const navigation = useNavigation<NavigationProps>();
  const [travel1Start, setTravel1Start] = useState('');
  const [travel1End, setTravel1End] = useState('');
  const [travel2Start, setTravel2Start] = useState('');
  const [travel2End, setTravel2End] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const loadTodayData = useCallback(async () => {
    const data = await loadKmData(today);
    if (data) {
      setTravel1Start(data.travel1Start.toString());
      setTravel1End(data.travel1End.toString());
      setTravel2Start(data.travel2Start.toString());
      setTravel2End(data.travel2End.toString());
    }
  }, [today]);

  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  const handleSave = async () => {
    await kmManager(today, travel1Start, travel1End, travel2Start, travel2End);
    alert('Dados salvos!');
  };

  const handleClear = async () => {
    await clearAllKmData();
    alert('Todos os dados foram removidos!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Data: {today}</Text>
      <View style={styles.kmRow}>
        <TextInput
          style={styles.input}
          placeholder="KM Inicial 1"
          keyboardType="numeric"
          value={travel1Start}
          onChangeText={setTravel1Start}
        />
        <TextInput
          style={styles.input}
          placeholder="KM Final 1"
          keyboardType="numeric"
          value={travel1End}
          onChangeText={setTravel1End}
        />
      </View>
      <View style={styles.kmRow}>
        <TextInput
          style={styles.input}
          placeholder="KM Inicial 2"
          keyboardType="numeric"
          value={travel2Start}
          onChangeText={setTravel2Start}
        />
        <TextInput
          style={styles.input}
          placeholder="KM Final 2"
          keyboardType="numeric"
          value={travel2End}
          onChangeText={setTravel2End}
        />
      </View>

      <View>
        <Button title="Salvar" onPress={handleSave} />
        <View style={{ height: 10 }} />
        <Button
          title="Mostrar todos os dados"
          onPress={() => navigation.navigate('weeklyReports')}
        />
        <View style={{ height: 10 }} />
        <Button title="Limpar todos os dados" onPress={handleClear} color="red" />
        <View style={{ height: 10 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  dateText: { fontSize: 18, marginBottom: 20 },
  kmRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  input: { flex: 0.45, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});

export default RegisterTravels;
