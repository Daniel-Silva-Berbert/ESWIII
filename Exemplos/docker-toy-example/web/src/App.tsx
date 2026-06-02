import { useEffect, useState } from "react";

type Book = {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/books`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os livros.");
        }

        const data = (await response.json()) as Book[];
        setBooks(data);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "Erro inesperado.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadBooks();

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Docker Toy Example</p>
        <h1>Livros</h1>
      </header>

      {isLoading && <p className="status">Carregando livros...</p>}

      {error && !isLoading && <p className="status status-error">{error}</p>}

      {!isLoading && !error && books.length === 0 && (
        <p className="status">Nenhum livro cadastrado ainda.</p>
      )}

      {!isLoading && !error && books.length > 0 && (
        <section className="book-grid" aria-label="Lista de livros">
          {books.map((book) => (
            <article className="book-card" key={book._id}>
              <img className="book-image" src={book.imageUrl} alt={`Capa do livro ${book.title}`} />
              <div className="book-content">
                <h2>{book.title}</h2>
                <p>{book.authors.join(", ")}</p>
                <span>{book.year}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
