import {
  StarFillIcon,
  StarHalfIcon,
  StarOutlineIcon,
  StarPartialIcon,
} from '@/components/Icons';

export function StarRating({ rating }: { rating: number }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<StarFillIcon key={i} />);
    } else if (rating > i - 1 && rating < i) {
      stars.push(<StarHalfIcon key={i} />);
    } else {
      stars.push(<StarOutlineIcon key={i} />);
    }
  }

  return <div className="flex gap-0.5">{stars.map((star) => star)}</div>;
}

export function StarRatingPrecise({ rating }: { rating: number }) {
  const stars = [];
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const partialFill = Math.round((rating % 1) * 100); // % of star that should be filled

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarFillIcon key={`full-${i}`} />);
  }

  if (partialFill > 0 && partialFill < 100) {
    stars.push(<StarPartialIcon key="partial" fillPercentage={partialFill} />);
  }

  for (let i = stars.length; i < totalStars; i++) {
    stars.push(<StarFillIcon key={`full-${i}`} fill="gray" />);
  }

  return <div className="flex gap-0.5">{stars}</div>;
}
