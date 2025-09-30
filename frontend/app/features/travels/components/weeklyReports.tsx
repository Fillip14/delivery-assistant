import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { getAllKmData, TravelData } from '../services/kmStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegistroStackParamList = {
  RegisterTravels: undefined;
  weeklyReports: undefined;
  weekDetails: {
    travels: TravelData[];
  };
};

type NavigationProps = NativeStackNavigationProp<RegistroStackParamList, 'weeklyReports'>;

type WeekGroup = {
  firstDay: string;
  travels: TravelData[];
  weekTotal: number;
};

const groupByWeek = (data: TravelData[]): Record<string, TravelData[]> => {
  const grouped: Record<string, TravelData[]> = {};

  data.forEach((item) => {
    const key = item.firstDay; // chave por semana

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);
  });

  return grouped;
};

const ShowTravelsWeek = () => {
  const [weeks, setWeeks] = useState<WeekGroup[]>([]);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const loadData = async () => {
      const all = await getAllKmData();
      const grouped = groupByWeek(all);

      const formatted: WeekGroup[] = Object.keys(grouped).map((firstDay) => ({
        firstDay,
        travels: grouped[firstDay],
        weekTotal: grouped[firstDay].reduce((acc, t) => acc + t.totalSpent, 0),
      }));

      setWeeks(formatted);
    };

    loadData();
  }, []);

  return (
    <FlatList
      data={weeks}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('weekDetails', {
              travels: item.travels,
            })
          }
        >
          {item.travels.length > 0 && (
            <Text style={styles.title}>
              Semana: {item.travels[0].firstDay} - {item.travels[0].lastDay}
            </Text>
          )}
          <Text>Total de viagens: {item.travels.length}</Text>
          <Text>Total de km gasto: {item.weekTotal} km</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
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
