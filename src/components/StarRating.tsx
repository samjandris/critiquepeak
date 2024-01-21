'use client';

import { useRef, useState } from 'react';
import {
  StarFillIcon,
  StarHalfIcon,
  StarOutlineIcon,
  StarPartialIcon,
} from '@/components/Icons';
import { twMerge } from 'tailwind-merge';

export function StarRating({
  rating,
  setRating,
  isChangeable,
  className,
}: {
  rating: number;
  setRating?: (rating: number) => void;
  isChangeable?: boolean;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if ((hoverRating || rating) >= i) {
      stars.push(
        <StarFillIcon
          key={`full-${i}`}
          color={isChangeable && isHovering ? 'lightGray' : 'inherit'}
          className="w-full h-auto"
        />
      );
    } else if ((hoverRating || rating) > i - 1 && (hoverRating || rating) < i) {
      stars.push(
        <StarHalfIcon
          key={`half-${i}`}
          color={isChangeable && isHovering ? 'lightGray' : 'inherit'}
          className="w-full h-auto"
        />
      );
    } else {
      stars.push(
        <StarOutlineIcon
          key={`empty-${i}`}
          color={isChangeable && isHovering ? 'lightGray' : 'inherit'}
          className="w-full h-auto"
        />
      );
    }
  }

  return (
    <div
      ref={divRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={(e) => {
        if (!isChangeable || !isHovering || !divRef.current) return;

        const { left, width } = divRef.current.getBoundingClientRect();
        const mousePosition = e.clientX - left;
        const starWidth = width / 5;
        const starIndex = Math.floor(mousePosition / starWidth) + 1; // Use floor and add 1 to get the correct star index
        const isHalf = (mousePosition % starWidth) / starWidth <= 0.65;

        setHoverRating(isHalf ? starIndex - 0.5 : starIndex);
      }}
      onMouseLeave={() => {
        setHoverRating(0);
        setIsHovering(false);
      }}
      onClick={() => {
        setRating && setRating(hoverRating);
        setIsHovering(false);
      }}
      className={twMerge('flex gap-0.5', className)}
    >
      {stars.map((star) => star)}
    </div>
  );
}

export function StarRatingPrecise({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const stars = [];
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const partialFill = Math.round((rating % 1) * 100);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarFillIcon key={`full-${i}`} className="w-full h-auto" />);
  }

  if (partialFill > 0 && partialFill < 100) {
    stars.push(
      <StarPartialIcon
        key="partial"
        fillPercentage={partialFill}
        className="w-full h-auto"
      />
    );
  }

  for (let i = stars.length; i < totalStars; i++) {
    stars.push(
      <StarFillIcon key={`empty-${i}`} fill="gray" className="w-full h-auto" />
    );
  }

  return <div className={twMerge('flex gap-0.5', className)}>{stars}</div>;
}
