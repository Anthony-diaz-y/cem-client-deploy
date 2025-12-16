"use client";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getImageUrl } from "../utils/imageHelper";

interface ImgProps {
  src: string | { default?: string; src?: string } | unknown;
  className?: string;
  alt?: string;
}

const Img: React.FC<ImgProps> = ({ src, className, alt }) => {
  const imageUrl = getImageUrl(src);

  if (!imageUrl) {
    return null;
  }

  return (
    <LazyLoadImage
      className={`${className} `}
      alt={alt || "Image"}
      effect="blur"
      src={imageUrl}
    />
  );
};

export default Img;
