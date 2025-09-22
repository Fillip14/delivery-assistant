import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterTravels, ShowTravels, WeekDetailsScreen } from '../features/travels';

const Stack = createNativeStackNavigator();

const TravelsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RegistrarViagens"
        component={RegisterTravels}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExibirViagens"
        component={ShowTravels}
        options={{ title: 'Exibir Viagens', headerShown: true }}
      />
      <Stack.Screen
        name="DetalhesSemana"
        component={WeekDetailsScreen}
        options={{ title: 'Detalhes da Semana' }}
      />
    </Stack.Navigator>
  );
};

export default TravelsStack;
