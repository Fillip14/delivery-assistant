import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DataWithSpent } from '../services/kmStorage';

type RouteParams = {
  weekDetails: {
    weekStart: string;
    travels: DataWithSpent[];
  };
};

const WeekDetails = () => {
  const route = useRoute<RouteProp<RouteParams, 'weekDetails'>>();
  const { weekStart, travels } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Semana de {weekStart}</Text>
      {travels.map((t, i) => (
        <View key={i} style={styles.item}>
          <Text>Data: {t.date}</Text>
          <Text>KM1 Gasto: {t.travel1Spent}</Text>
          <Text>KM2 Gasto: {t.travel2Spent}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
});

export default WeekDetails;
