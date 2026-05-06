import React from "react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const Pagination: React.FC<Props> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  const add = (p: number | string) => pages.push(p);

  // Siempre primera
  if (page > 2) {
    add(1);
    if (page > 3) add("...");
  }

  // Página anterior
  if (page > 1) {
    add(page - 1);
  }

  // Página actual
  add(page);

  // Página siguiente
  if (page < totalPages) {
    add(page + 1);
  }

  // Siempre última
  if (page < totalPages - 1) {
    if (page < totalPages - 2) add("...");
    add(totalPages);
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-2">

        {/* ← */}
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="w-9 h-9 rounded-full border bg-white flex items-center justify-center disabled:opacity-40"
        >
          ‹
        </button>

        {/* Números */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onChange(p as number)}
              className={`w-9 h-9 rounded-md border flex items-center justify-center ${
                page === p
                  ? "bg-gray-200 font-semibold"
                  : "bg-white"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* → */}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="w-9 h-9 rounded-full border bg-white flex items-center justify-center disabled:opacity-40"
        >
          ›
        </button>

      </div>
    </div>
  );
};

export default Pagination;