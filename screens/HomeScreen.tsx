import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de cámara denegado');
      return;
    }

    const photo = await cameraRef.current?.takePictureAsync({ quality: 1 });
    if (photo) {
      navigation.navigate('Crop', { photo });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tomar Foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  button: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: 'white', padding: 15, borderRadius: 10
  },
  buttonText: { color: 'black', fontWeight: 'bold' }
});
