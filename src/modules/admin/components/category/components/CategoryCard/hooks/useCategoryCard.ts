import type { CategoryCardProps } from "../interfaces/CategoryCard.interface";

export const useCategoryCard = (props: CategoryCardProps) => {
  const { category } = props;

  const courseCount = category.courseCount ?? category.courses?.length ?? 0;

  return {
    courseCount,
  };
};
