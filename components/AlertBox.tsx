'use client';

interface AlertProps {
  message: string;
  onClose: () => void;
}

export default function AlertBox({ message, onClose }: AlertProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-5 h-35 flex justify-center">
      <div className="bg-white rounded-md p-6 shadow-md border max-w-xs w-full text-center">
        <p className="text-sm font-semibold text-gray-800 mb-4">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-black text-white text-sm font-medium py-2 rounded-md hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
