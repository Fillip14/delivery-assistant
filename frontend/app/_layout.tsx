import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import MainDrawer from './navigation/mainDrawer';
import checkUpdate from '../utils/updateCheck';

const App = () => {
  useEffect(() => {
    checkUpdate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainDrawer />
    </GestureHandlerRootView>
  );
};

export default App;
