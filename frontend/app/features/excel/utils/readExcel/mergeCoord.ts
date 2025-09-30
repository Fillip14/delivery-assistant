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

export default mergeCoordinates;
