import AsyncStorage from '@react-native-async-storage/async-storage';

export type TravelData = {
  date: string;
  travel1Start: number;
  travel1End: number;
  travel2Start: number;
  travel2End: number;
};

export type DataWithSpent = TravelData & {
  travel1Spent: number;
  travel2Spent: number;
};

export const loadKmData = async (date: string): Promise<TravelData | null> => {
  const loadedData = await AsyncStorage.getItem(`km_${date}`);
  if (!loadedData) return null;
  return JSON.parse(loadedData);
};

export const saveKmData = async (data: TravelData) => {
  await AsyncStorage.setItem(`km_${data.date}`, JSON.stringify(data));
};

export const getAllKmData = async (): Promise<DataWithSpent[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const kmKeys = keys.filter((k) => k.startsWith('km_'));
  const stores = await AsyncStorage.multiGet(kmKeys);

  return stores.map(([key, value]) => {
    const parsed = JSON.parse(value || '{}');
    const travel1Start = Number(parsed.travel1Start) || 0;
    const travel1End = Number(parsed.travel1End) || 0;
    const travel2Start = Number(parsed.travel2Start) || 0;
    const travel2End = Number(parsed.travel2End) || 0;

    return {
      date: key.replace('km_', ''),
      travel1Start,
      travel1End,
      travel2Start,
      travel2End,
      travel1Spent: travel1End - travel1Start,
      travel2Spent: travel2End - travel2Start,
    };
  });
};

export const clearAllKmData = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const kmKeys = keys.filter((k) => k.startsWith('km_'));
  await AsyncStorage.multiRemove(kmKeys);
};
