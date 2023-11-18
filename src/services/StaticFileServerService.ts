import axios from "axios";
import FormData from "form-data";

export default class StaticFileServerService {
  async uploadImages(imagesBuffer: Buffer[]): Promise<string[]> {
    try {
      let imagesLink: string[] = [];
      for (let i = 0; i < imagesBuffer.length; i++) {
        const formData = new FormData();
        formData.append("image", imagesBuffer[i].toString("base64"));
        const response = await axios.post(
          "https://api.imgur.com/3/image",
          formData,
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_APP_CLIENT_ID}`,
            },
          }
        );
        if (response.status === 200) {
          imagesLink.push(response.data.data.link);
        } else {
          throw new Error("Error al enviar la imagen al otro servidor.");
        }
      }

      return imagesLink;
    } catch (error) {
      console.error(error);
      throw new Error("Error al enviar la imagen al otro servidor: " + error);
    }
  }
}
