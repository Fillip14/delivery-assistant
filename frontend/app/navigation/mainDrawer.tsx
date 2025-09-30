import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Index from '../features/home';
import TravelsStack from './travelsStack';
import ExcelScreen from '../features/excel';
import Configurations from '../features/configurations';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
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
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'RegisterTravels';
          return {
            drawerLabel: 'Km Rodados',
            title: 'Km Rodados',
            headerShown: routeName !== 'weeklyReports' && routeName !== 'weekDetails', // Esconde header só na tela Exibir
          };
        }}
      />
      <Drawer.Screen
        name="excel"
        component={ExcelScreen}
        options={{ drawerLabel: 'Excel', title: 'Excel' }}
      />
      <Drawer.Screen
        name="Configurações"
        component={Configurations}
        options={{ drawerLabel: 'Configurações', title: 'Configurações' }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
