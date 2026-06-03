const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal Card */}
    <div className="relative bg-white rounded-2xl shadow-xl px-6 py-6 w-80 mx-4">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        This product will be deactivated and hidden from customers. This action can be reversed later.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;