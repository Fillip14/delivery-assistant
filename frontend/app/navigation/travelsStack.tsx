import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterTravels, ShowTravels, WeekDetails } from '../features/travels';

const Stack = createNativeStackNavigator();

const TravelsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RegisterTravels"
        component={RegisterTravels}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="weeklyReports"
        component={ShowTravels}
        options={{ title: 'Relatórios Semanais', headerShown: true }}
      />
      <Stack.Screen
        name="weekDetails"
        component={WeekDetails}
        options={{ title: 'Detalhes da Semana' }}
      />
    </Stack.Navigator>
  );
};

export default TravelsStack;
