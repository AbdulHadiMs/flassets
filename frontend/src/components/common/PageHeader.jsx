function PageHeader({ title, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <div className="flex flex-col sm:flex-row gap-3">
        {children}
      </div>
    </div>
  );
}

export default PageHeader;