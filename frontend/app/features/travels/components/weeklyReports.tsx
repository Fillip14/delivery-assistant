import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { DataWithSpent, getAllKmData } from '../services/kmStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegistroStackParamList = {
  RegisterTravels: undefined;
  weeklyReports: undefined;
  weekDetails: { weekStart: string; travels: DataWithSpent[] };
};

type WeekGroup = {
  weekStart: string;
  travels: DataWithSpent[];
};

type NavigationProps = NativeStackNavigationProp<RegistroStackParamList, 'weeklyReports'>;

function getWeekStart(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // 🔹 agora pega no fuso local, sem UTC

  const dayOfWeek = date.getDay(); // 0=domingo, 1=segunda

  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + diff);
  return weekStart.toISOString().slice(0, 10);
}

function groupByWeek(data: DataWithSpent[]) {
  const grouped: Record<string, DataWithSpent[]> = {};
  data.forEach((item) => {
    const weekStart = getWeekStart(item.date);
    if (!grouped[weekStart]) grouped[weekStart] = [];
    grouped[weekStart].push(item);
  });
  return grouped;
}

const ShowTravelsWeek = () => {
  const [weeks, setWeeks] = useState<WeekGroup[]>([]);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const loadData = async () => {
      const all = await getAllKmData();
      const grouped = groupByWeek(all);

      const formatted: WeekGroup[] = Object.keys(grouped).map((weekStart) => ({
        weekStart,
        travels: grouped[weekStart],
      }));

      setWeeks(formatted);
    };

    loadData();
  }, []);

  return (
    <FlatList
      data={weeks}
      keyExtractor={(item) => item.weekStart}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('weekDetails', {
              weekStart: item.weekStart,
              travels: item.travels,
            })
          }
        >
          <Text style={styles.title}>Semana começando: {item.weekStart}</Text>
          <Text>Total de viagens: {item.travels.length}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShowTravelsWeek;
