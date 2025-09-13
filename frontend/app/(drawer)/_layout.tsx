import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Configurações',
            title: 'Configurações',
          }}
        />
        <Drawer.Screen
          name="manageExcel"
          options={{
            drawerLabel: 'Excel',
            title: 'Excel',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
