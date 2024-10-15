import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import axiosInstance from "../utility/axiosInstance";
import * as ImagePicker from "expo-image-picker";

const useUploadImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({});

  const uploadImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("result", JSON.stringify(result, null, 1));

      if (result.type === "cancel") {
        console.log("User canceled the document picker");
        return;
      }

      setIsLoading(true);

      const { uri, fileName, mimeType } = result.assets[0];

      if (!["image/jpeg", "image/png"].includes(mimeType)) {
        throw new Error("Only jpg/png files are allowed!");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", {
        uri,
        fileName,
        type: "image/jpg" || "image/jpeg",
      });

      const url = "/document/userdocumentfile";

      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        console.log("response.data", JSON.stringify(response.data, null, 1));
        setAttachment(response?.data?.fileUrl);
        setResult(result.assets[0]);
      } else {
        console.error("Upload failed:", response?.data?.message);
        setError(response?.data?.message || "Upload failed");
      }
    } catch (err) {
      if (err?.response) {
        console.error("Server error:", err?.response?.data);
        setError(err?.response?.data);
      } else if (err?.request) {
        console.log("Network error", JSON.stringify(err.request, null, 1));
        setError("Network error");
      } else {
        console.error("Error:", err?.message);
        setError(err?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, attachment, error, uploadImage, result };
};

export default useUploadImage;
