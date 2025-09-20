import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Index from '../features/home';
import TravelsStack from './travelsStack';
import ExcelScreen from '../features/excel';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="index"
        component={Index}
        options={{ drawerLabel: 'Home', title: 'Home' }}
      />
      <Drawer.Screen
        name="travels"
        component={TravelsStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'RegistrarViagens';
          return {
            drawerLabel: 'Km Rodados',
            title: 'Km Rodados',
            headerShown: routeName !== 'ExibirViagens' && routeName !== 'DetalhesSemana', // Esconde header só na tela Exibir
          };
        }}
      />
      <Drawer.Screen
        name="excel"
        component={ExcelScreen}
        options={{ drawerLabel: 'Excel', title: 'Excel' }}
      />
    </Drawer.Navigator>
  );
}
