import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { calculateCrop } from '../utils/lib';
import ResizableCropper from '../components/ResizableCropper';

export default function CropScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { photo } = route.params as any;

  const [layout, setLayout] = useState({ width: 1, height: 1 });
  const [cropper, setCropper] = useState({
    // TODO: Calculate exactly center of the screen based on devices dimensions
    x: 90,
    y: 270,
    width: 200,
    height: 200,
  });

  const onCropDone = async () => {
    try {
      const cropData = calculateCrop(photo, layout, cropper);

      const context = ImageManipulator.ImageManipulator.manipulate(photo.uri);
      context.crop(cropData);
      const img = await context.renderAsync();
      const result = await img.saveAsync({format: ImageManipulator.SaveFormat.JPEG, compress: 1})
      //const asset = await MediaLibrary.createAssetAsync(cropped.uri);
      //await MediaLibrary.createAlbumAsync('CroppedPhotos', asset, false);

      await MediaLibrary.saveToLibraryAsync(result.uri);

      Alert.alert('Saved', 'Cropped images saved.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something failed.');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.imageContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setLayout({ width, height });
        }}
      >
        <Image source={{ uri: photo.uri }} style={styles.image} resizeMode='contain' />
        <ResizableCropper cropper={cropper} onChange={setCropper} containerLayout={layout} />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onCropDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { flex: 1 },
  image: { width: '100%', height: '100%' },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white' },
});
