function StatusBadge({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Allocated: "bg-red-100 text-red-700",
    Maintenance: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-sm ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;