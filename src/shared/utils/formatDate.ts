export const formatDate = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const options = {
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const
  } satisfies Intl.DateTimeFormatOptions;
  const formattedDate = date.toLocaleDateString("en-US", options);
  // console.log('date = ', formattedDate)

  // const hour = date.getHours()
  // const minutes = date.getMinutes()
  // const period = hour >= 12 ? "PM" : "AM"
  // const formattedTime = `${hour % 12}:${minutes
  //   .toString()
  //   .padStart(2, "0")} ${period}`

  // return `${formattedDate} | ${formattedTime}`
  return `${formattedDate} `;
};
