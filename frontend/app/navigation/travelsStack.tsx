import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterTravels, ShowTravels, weekDetailsScreen } from '../features/travels';

const Stack = createNativeStackNavigator();

export default function TravelsStack() {
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
        component={weekDetailsScreen}
        options={{ title: 'Detalhes da Semana' }}
      />
    </Stack.Navigator>
  );
}
