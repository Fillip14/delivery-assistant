import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PingPongScreen() {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [direction, setDirection] = useState({ dx: 2, dy: 2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((pos) => {
        let newX = pos.x + direction.dx;
        let newY = pos.y + direction.dy;

        // Bater nas bordas
        if (newX <= 0 || newX >= width - 100) setDirection((d) => ({ ...d, dx: -d.dx }));
        if (newY <= 0 || newY >= height - 80) setDirection((d) => ({ ...d, dy: -d.dy }));

        return { x: newX, y: newY };
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.button, { left: position.x, top: position.y }]}>
        <TouchableOpacity onPress={() => alert('Você clicou!')}>
          <Text style={styles.buttonText}>Ping Pong!</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#ff4757',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
