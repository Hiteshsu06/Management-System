import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Image = ({ alt, height, src, width, caption }) => (
  <div>
    <LazyLoadImage
      alt={alt}
      height={height}
      src={src}
      width={width} />
    <span>{caption}</span>
  </div>
);

export default Image;