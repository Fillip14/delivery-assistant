import alertBlock from '../../../../../utils/alertBlock';

export type TravelInfo = {
  today: string;
  travel1Start: string;
  travel1End: string;
  travel2Start: string;
  travel2End: string;
};

type WeekRange = { firstDay: string; lastDay: string };

export const getWeekRangeFromDate = (dateString: string): WeekRange => {
  const d = new Date(dateString);
  const monday = new Date(d);
  monday.setDate(d.getDate() - (d.getDay() || 7) + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return ['firstDay', 'lastDay'].reduce(
    (acc, key, i) => ({
      ...acc,
      [key]: [monday, sunday][i].toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
    }),
    {} as WeekRange
  );
};

export const processKms = (travel: TravelInfo) => {
  const travel1Spent = Number(travel.travel1End) - Number(travel.travel1Start);
  const travel2Spent = Number(travel.travel2End) - Number(travel.travel2Start);
  const totalSpent = travel1Spent + travel2Spent;

  if (travel1Spent < 0 || travel2Spent < 0)
    alertBlock({ title: 'Erro', message: 'Valores inválidos' });

  const { firstDay, lastDay } = getWeekRangeFromDate(travel.today);

  const data = {
    date: travel.today,
    travel1Start: Number(travel.travel1Start),
    travel1End: Number(travel.travel1End),
    travel2Start: Number(travel.travel2Start),
    travel2End: Number(travel.travel2End),
    travel1Spent: travel1Spent,
    travel2Spent: travel2Spent,
    totalSpent: totalSpent,
    firstDay: firstDay,
    lastDay: lastDay,
  };

  return data;
};
