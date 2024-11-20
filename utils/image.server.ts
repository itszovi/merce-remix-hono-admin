import sharp from "sharp"

export const formatImage = async (image: Buffer
  | ArrayBuffer
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | string, width?: number, height?: number) => {
    console.log("image: " + image);
    return await sharp(image)
      .resize({ width, height })
      .toBuffer()
      .then(data => {
        return data
      })
}