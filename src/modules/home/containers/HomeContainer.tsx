"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Home from "../Home";
import { getCatalogPageData } from "@shared/services/pageAndComponentData";
import { getImageUrl } from "@shared/utils/imageHelper";
import { RootState } from "@shared/store/store";
import { CatalogPageData } from "../types";

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

/**
 * HomeContainer - Container component for Home page
 * Handles all business logic: data fetching, state management, API calls
 */
const HomeContainer = () => {
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
  const { token } = useSelector((state: RootState) => state.auth);
  const [catalogPageData, setCatalogPageData] =
    useState<CatalogPageData | null>(null);
  const categoryID = "6506c9dff191d7ffdb4a3fe2"; // hard coded

  // Fetch catalog page data
  useEffect(() => {
    const fetchCatalogPageData = async () => {
      const result = await getCatalogPageData(categoryID);
      setCatalogPageData(result);
    };
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID]);

  // Pass data to presentational component
  return (
    <Home
      backgroundImg={backgroundImg}
      catalogPageData={catalogPageData}
      token={token}
    />
  );
};

export default HomeContainer;
