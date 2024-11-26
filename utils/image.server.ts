import sharp from "sharp"

export const formatImages = async (image: Buffer | string): Promise<{ size: string; buffer: Buffer }[]> => {
  const results: { size: string; buffer: Buffer }[] = [];

  const sizes = [
    { width: 16, height: null },
    { width: 150, height: null },
    { width: 320, height: null },
    { width: 640, height: null },
    { width: 1024, height: null },
    { width: 1920, height: null },
  ]

  for (const size of sizes) {
    const formattedImage = await sharp(image)
      .resize(size.width, size.height)
      .toBuffer();

    results.push({
      size: `${size.width}${size.height ? `x${size.height}` : ''}`,
      buffer: formattedImage
    });
  }

  return results;
};