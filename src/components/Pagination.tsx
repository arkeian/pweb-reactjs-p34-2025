interface Pagination {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Pagination) {
    return (
        // --- KOREKSI DISINI ---
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 mt-4">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                // Hapus 'me-2' karena 'gap-2' sudah menangani
                className="btn btn-outline-dark fw-bold"
                style={{ boxShadow: "3px 3px 0 black" }}
            >
                Prev
            </button>

            <span className="fw-semibold">
                Page {page} of {totalPages}
            </span>

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                // Hapus 'ms-2' karena 'gap-2' sudah menangani
                className="btn btn-outline-dark fw-bold"
                style={{ boxShadow: "3px 3px 0 black" }}
            >
                Next
            </button>
        </div>
        // --- BATAS KOREKSI ---
    );
}