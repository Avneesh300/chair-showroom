export const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString.replace(" ", "T")); // fix for Safari

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const datePart = date.toLocaleDateString("en-GB", options);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${datePart}, ${hours}:${formattedMinutes} ${ampm}`;
};

export const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB");
};