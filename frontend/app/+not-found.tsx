import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { general } from '../styles/global.style';

const NotFoundScreen = () => {
  return (
    <View style={general.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text style={general.container}>This screen doesnt exist.</Text>
      <Link href="/" style={general.container}>
        <Text>Go to home screen!</Text>
      </Link>
    </View>
  );
};

export default NotFoundScreen;
