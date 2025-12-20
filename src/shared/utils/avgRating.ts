interface RatingItem {
  rating: number;
}

export default function GetAvgRating(ratingArr: RatingItem[] | unknown[] | null | undefined): number {
  if (!ratingArr || !Array.isArray(ratingArr) || ratingArr.length === 0) return 0
  
  // Normalizar los datos: filtrar elementos válidos con campo 'rating'
  const validRatingItems = ratingArr.filter((item): item is RatingItem => {
    if (!item || typeof item !== 'object') return false;
    const rating = (item as Record<string, unknown>).rating;
    return typeof rating === 'number' && !isNaN(rating);
  }) as RatingItem[];
  
  const validRatings = validRatingItems.map((item: RatingItem) => item.rating);
  
  if (validRatings.length === 0) return 0;
  
  const totalReviewCount = validRatings.reduce((acc: number, rating: number) => {
    acc += rating;
    return acc;
  }, 0);

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / validRatings.length) * multiplier) / multiplier

  return avgReviewCount
}