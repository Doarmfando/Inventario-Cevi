export const formatDate = (date: Date) =>
  date.toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
