import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeekRangeFromDate } from '../utils/saveTravel/processKms';

export type TravelData = {
  date: string;
  travel1Start: number;
  travel1End: number;
  travel2Start: number;
  travel2End: number;
  travel1Spent: number;
  travel2Spent: number;
  totalSpent: number;
  firstDay: string;
  lastDay: string;
};

export const loadKmData = async (date: string): Promise<TravelData | null> => {
  const { firstDay } = getWeekRangeFromDate(date);
  const loadedData = await AsyncStorage.getItem(`travelsDay_${firstDay}`);
  if (!loadedData) return null;

  const datasOfWeek: TravelData[] = JSON.parse(loadedData);
  const found = datasOfWeek.find((t) => t.date === date);

  return found ?? null;
};

export const saveKmData = async (data: TravelData) => {
  const key = `travelsDay_${data.firstDay}`;
  const loadedData = await AsyncStorage.getItem(key);

  let datasOfWeek: TravelData[] = loadedData ? JSON.parse(loadedData) : [];
  const index = datasOfWeek.findIndex((t) => t.date === data.date);

  if (index >= 0) {
    datasOfWeek[index] = data;
  } else {
    datasOfWeek.push(data);
  }

  await AsyncStorage.setItem(key, JSON.stringify(datasOfWeek));
};

export const getAllKmData = async (): Promise<TravelData[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const kmKeys = keys.filter((k) => k.startsWith('travelsDay_'));
  const stores = await AsyncStorage.multiGet(kmKeys);

  const allData: TravelData[] = [];

  stores.forEach(([key, value]) => {
    if (!value) return;
    const datasOfWeek: TravelData[] = JSON.parse(value); // aqui é array

    datasOfWeek.forEach((parsed) => {
      allData.push({
        date: parsed.date,
        travel1Start: Number(parsed.travel1Start) || 0,
        travel1End: Number(parsed.travel1End) || 0,
        travel2Start: Number(parsed.travel2Start) || 0,
        travel2End: Number(parsed.travel2End) || 0,
        travel1Spent: Number(parsed.travel1Spent) || 0,
        travel2Spent: Number(parsed.travel2Spent) || 0,
        totalSpent: Number(parsed.totalSpent) || 0,
        firstDay: parsed.firstDay,
        lastDay: parsed.lastDay,
      });
    });
  });

  return allData;
};

export const clearAllKmData = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const kmKeys = keys.filter((k) => k.startsWith('travelsDay_'));
  await AsyncStorage.multiRemove(kmKeys);
};
