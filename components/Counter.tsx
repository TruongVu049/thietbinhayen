import { Plus, Minus } from "lucide-react";

export default function Counter({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
}) {
  return (
    <div className="relative flex items-center max-w-[8rem]">
      <button
        type="button"
        id="decrement-button"
        onClick={onDecrease}
        data-input-counter-decrement="quantity-input"
        className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none"
      >
        <Minus className="w-3 h-3 text-gray-900" />
      </button>
      <input
        type="text"
        value={value}
        id="quantity-input"
        data-input-counter=""
        min={1}
        aria-describedby="helper-text-explanation"
        className="bg-gray-50 border-x-0 border-y pointer-events-none border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 "
      />
      <button
        type="button"
        id="increment-button"
        onClick={onIncrease}
        data-input-counter-increment="quantity-input"
        className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none"
      >
        <Plus className="w-3 h-3 text-gray-900" />
      </button>
    </div>
  );
}
