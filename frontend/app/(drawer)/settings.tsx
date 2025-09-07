import { Text, View } from 'react-native';
import { general } from '../../styles/global.style';

export default function Tab() {
  return (
    <View style={general.container}>
      <Text>Tab [Home|Settings]</Text>
    </View>
  );
}
