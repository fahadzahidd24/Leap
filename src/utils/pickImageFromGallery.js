import * as ImagePicker from "expo-image-picker";

export async function pickImageFromGallery({ setImage, setPickedImage }) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    //   const response = await fetch(result.assets[0].uri);
    //   const blob = await response.blob();
    setImage({
      uri: result.assets[0].uri,
      type: result.assets[0].mimeType,
      name:
        result.assets[0].fileName ||
        `photo.${result.assets[0].mimeType.split("/")[1]}`,
    });
    {
      setPickedImage && setPickedImage(result.assets[0].uri);
    }
  }
}
