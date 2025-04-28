import React from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

interface CropperDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContainerLayout {
  width: number;
  height: number;
}

export default function ResizableCropper({
  cropper,
  onChange,
  containerLayout,
}: {
  cropper: CropperDimensions;
  onChange: (callback: (prev: CropperDimensions) => CropperDimensions) => void;
  containerLayout: ContainerLayout;
}) {
  const createResponder = (corner: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        const dx = gesture.dx;
        const dy = gesture.dy;

        onChange((prev) => {
          const updated = { ...prev };
          const limit = 30;

          switch (corner) {
            case 'topLeft':
              updated.x = Math.min(Math.max(prev.x + dx, 0), prev.x + prev.width - limit);
              updated.y = Math.min(Math.max(prev.y + dy, 0), prev.y + prev.height - limit);
              updated.width = prev.width - dx;
              updated.height = prev.height - dy;
              break;
            case 'topRight':
              updated.y = Math.min(Math.max(prev.y + dy, 0), prev.y + prev.height - limit);
              updated.width = prev.width + dx;
              updated.height = prev.height - dy;
              break;
            case 'bottomLeft':
              updated.x = Math.min(Math.max(prev.x + dx, 0), prev.x + prev.width - limit);
              updated.width = prev.width - dx;
              updated.height = prev.height + dy;
              break;
            case 'bottomRight':
              updated.width = prev.width + dx;
              updated.height = prev.height + dy;
              break;
          }

          // Limitar a no salir de imagen
          updated.width = Math.min(updated.width, containerLayout.width - updated.x);
          updated.height = Math.min(updated.height, containerLayout.height - updated.y);

          return updated;
        });
      },
    });

  const topLeft = createResponder('topLeft');
  const topRight = createResponder('topRight');
  const bottomLeft = createResponder('bottomLeft');
  const bottomRight = createResponder('bottomRight');

  return (
    <View
      style={[
        styles.cropBox,
        {
          left: cropper.x,
          top: cropper.y,
          width: cropper.width,
          height: cropper.height,
        },
      ]}
    >
      {/* Corners */}
      <View {...topLeft.panHandlers} style={[styles.corner, { left: -15, top: -15 }]} />
      <View {...topRight.panHandlers} style={[styles.corner, { right: -15, top: -15 }]} />
      <View {...bottomLeft.panHandlers} style={[styles.corner, { left: -15, bottom: -15 }]} />
      <View {...bottomRight.panHandlers} style={[styles.corner, { right: -15, bottom: -15 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});
