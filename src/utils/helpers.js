export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const timeAgo = (date) => {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const categoryColors = {
  tech: "badge-primary",
  music: "badge-accent",
  design: "badge-warning",
  language: "badge-success",
};

export const levelLabels = {
  rookie: { label: "Rookie", cls: "lvl-rookie" },
  intermediate: { label: "Intermediate", cls: "lvl-intermediate" },
  expert: { label: "Expert", cls: "lvl-expert" },
};

export const statusColors = {
  pending: "badge-warning",
  accepted: "badge-primary",
  completed: "badge-success",
  declined: "badge-danger",
};
