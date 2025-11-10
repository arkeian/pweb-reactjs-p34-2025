import type { Book } from "../api/books";

interface Props {
    book: Book;
    onDetail: () => void;
    onDelete: () => void;
}

export default function BookCard({ book, onDetail, onDelete }: Props) {
    return (
        <div
            className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center mb-3 p-3 gap-3"
            style={{
                border: "3px solid black",
                boxShadow: "5px 5px 0 #93c5fd",
                backgroundColor: "white",
                borderRadius: "12px",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <div>
                <h5 className="fw-bold m-0">{book.title}</h5>
                <small className="text-muted">
                    {book.writer} - {book.genre}
                </small>
                <div className="mt-2">
                    <span className="fw-semibold">Price:</span> Rp{" "}{book.price.toLocaleString()} |
                    <span className="fw-semibold"> Stock:</span> {book.stockQuantity}
                </div>
            </div>

            <div className="d-grid d-sm-flex gap-2 w-100 w-sm-auto">
                <button
                    onClick={onDetail}
                    // Hapus 'me-2' karena 'gap-2' sudah menangani
                    className="btn btn-primary fw-bold"
                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                >
                    Details
                </button>
                <button
                    onClick={onDelete}
                    className="btn btn-danger fw-bold"
                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}