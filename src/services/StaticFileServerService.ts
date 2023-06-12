import axios from "axios";
import FormData from "form-data";

import { UploadImagesResponse } from "../interfaces/Api";

export default class StaticFileServerService {
  private endpointUrl = process.env.STATIC_FILES_SERVER_URL!;

  async uploadImages(imagesBuffer: Buffer[]): Promise<UploadImagesResponse> {
    try {
      const formData = new FormData();

      for (let i = 0; i < imagesBuffer.length; i++) {
        formData.append("images", imagesBuffer[i], `image${i}.jpg`);
      }
      const response = await axios.post(
        this.endpointUrl + "/upload",
        formData,
        formData.getHeaders()
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Error al enviar la imagen al otro servidor.");
      }
    } catch (error) {
      throw new Error("Error al enviar la imagen al otro servidor: " + error);
    }
  }
}
