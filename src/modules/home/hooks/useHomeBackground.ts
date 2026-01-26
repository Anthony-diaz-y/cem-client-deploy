// Hook para manejar la imagen de fondo aleatoria
import { useState, useEffect } from "react";
import { getImageUrl } from "@shared/utils/imageHelper";

// Background images
import backgroundImg1 from "@shared/assets/Images/random bg img/coding bg1.jpg";
import backgroundImg2 from "@shared/assets/Images/random bg img/coding bg2.jpg";
import backgroundImg3 from "@shared/assets/Images/random bg img/coding bg3.jpg";
import backgroundImg4 from "@shared/assets/Images/random bg img/coding bg4.jpg";
import backgroundImg5 from "@shared/assets/Images/random bg img/coding bg5.jpg";
import backgroundImg6 from "@shared/assets/Images/random bg img/coding bg6.jpeg";
import backgroundImg7 from "@shared/assets/Images/random bg img/coding bg7.jpg";
import backgroundImg8 from "@shared/assets/Images/random bg img/coding bg8.jpeg";
import backgroundImg9 from "@shared/assets/Images/random bg img/coding bg9.jpg";
import backgroundImg10 from "@shared/assets/Images/random bg img/coding bg10.jpg";
import backgroundImg11 from "@shared/assets/Images/random bg img/coding bg11.jpg";

const randomImages = [
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  backgroundImg5,
  backgroundImg6,
  backgroundImg7,
  backgroundImg8,
  backgroundImg9,
  backgroundImg10,
  backgroundImg11,
];

export function useHomeBackground() {
  // Initialize with first image for SSR consistency
  // Update to random image only after client-side mount to avoid hydration mismatch
  const [backgroundImg, setBackgroundImg] = useState<string>(() =>
    getImageUrl(randomImages[0])
  );

  // Update to random image only after component mounts on client
  // Use queueMicrotask to avoid synchronous setState warning
  useEffect(() => {
    queueMicrotask(() => {
      const randomBg = randomImages[Math.floor(Math.random() * randomImages.length)];
      setBackgroundImg(getImageUrl(randomBg));
    });
  }, []);

  return backgroundImg;
}


