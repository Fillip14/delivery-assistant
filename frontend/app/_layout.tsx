import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainDrawer from './navigation/mainDrawer';
import { checkUpdate } from '../scripts/updateCheck';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    checkUpdate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainDrawer />
    </GestureHandlerRootView>
  );
}
