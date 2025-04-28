export function calculateCrop(
  photo: { width: number; height: number },
  layout: { width: any; height: any },
  cropper: { x: any; y: any; width: any; height: any }
) {
  const imageAspect = photo.width / photo.height;
  const layoutAspect = layout.width / layout.height;

  let displayedImageWidth = layout.width;
  let displayedImageHeight = layout.height;

  if (imageAspect > layoutAspect) {
    displayedImageHeight = layout.width / imageAspect;
  } else {
    displayedImageWidth = layout.height * imageAspect;
  }

  const offsetX = (layout.width - displayedImageWidth) / 2;
  const offsetY = (layout.height - displayedImageHeight) / 2;

  const scaleX = photo.width / displayedImageWidth;
  const scaleY = photo.height / displayedImageHeight;

  return {
    originX: (cropper.x - offsetX) * scaleX,
    originY: (cropper.y - offsetY) * scaleY,
    width: cropper.width * scaleX,
    height: cropper.height * scaleY,
  };
}
