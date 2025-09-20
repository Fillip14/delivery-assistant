import { Text, View, Button } from 'react-native';
import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';

export default function App() {
  const [memory, setMemory] = useState({ total: 0, used: 0 });

  async function getMemory() {
    const totalMem = await DeviceInfo.getTotalMemory(); // bytes
    const usedMem = await DeviceInfo.getUsedMemory(); // bytes
    setMemory({ total: totalMem, used: usedMem });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Total RAM: {(memory.total / 1024 / 1024).toFixed(2)} MB</Text>
      <Text>Used RAM: {(memory.used / 1024 / 1024).toFixed(2)} MB</Text>
      <Button onPress={getMemory} title="Get Memory" />
    </View>
  );
}
