import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TravelData } from '../services/kmStorage';

type RouteParams = {
  weekDetails: {
    travels: TravelData[];
  };
};

const WeekDetails = () => {
  const route = useRoute<RouteProp<RouteParams, 'weekDetails'>>();
  const { travels } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Semana de {travels[0].firstDay} - {travels[0].lastDay}
      </Text>
      {travels.map((t, i) => (
        <View key={i} style={styles.item}>
          <Text>Data: {t.date}</Text>
          <Text>KM1 Gasto: {t.travel1Spent} km</Text>
          <Text>KM2 Gasto: {t.travel2Spent} km</Text>
          <Text>Total: {t.totalSpent} km</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  item: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
});

export default WeekDetails;
