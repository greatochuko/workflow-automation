import React from "react";

export default function Switch({
  checked,
  onCheckChange,
  id,
  name,
}: {
  checked: boolean;
  onCheckChange: () => void;
  name?: string;
  id?: string;
}) {
  return (
    <>
      <input
        type="checkbox"
        name={name}
        id={id}
        hidden
        checked={checked}
        onChange={onCheckChange}
      />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onCheckChange}
        className={`relative inline-flex h-6 w-[42px] items-center rounded-full transition-colors focus:outline-none ${
          checked ? "bg-accent-black" : "bg-gray-300"
        }`}
        style={{ transition: "background-color 0.2s" }}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow duration-200 ${
            checked ? "translate-x-5" : "translate-x-[2px]"
          }`}
        />
      </button>
    </>
  );
}
