import { saveKmData } from '../../services/kmStorage';
import { processKms } from './processKms';

export const kmManager = async (
  today: string,
  travel1Start: string,
  travel1End: string,
  travel2Start: string,
  travel2End: string
) => {
  const data = processKms({ today, travel1Start, travel1End, travel2Start, travel2End });
  await saveKmData(data);
};
