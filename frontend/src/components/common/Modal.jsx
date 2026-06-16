function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Modal;