import { useState } from 'react';

const ConfirmationDialog = ({ 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmationDialog;