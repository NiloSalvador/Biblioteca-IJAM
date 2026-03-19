import { useState, useMemo } from 'react';

type Book = {
    id: string;
    title: string;
    author: string;
    description: string | null;
    cover_url: string | null;
    category: string | null;
    type: 'PHYSICAL' | 'VIRTUAL';
    available_stock: number;
};

export default function BookCatalog({ initialBooks }: { initialBooks: Book[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Derived state
    const filteredBooks = useMemo(() => {
        return initialBooks.filter(book => {
            const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchType = filterType ? book.type === filterType : true;
            const matchCategory = filterCategory ? book.category?.toLowerCase() === filterCategory.toLowerCase() : true;

            return matchSearch && matchType && matchCategory;
        });
    }, [initialBooks, searchTerm, filterType, filterCategory]);

    return (
        <div className="animate-in fade-in duration-500">
            {/* Filters Section */}
            <div className="bg-white border border-slate-200 p-5 rounded-[var(--radius-xl)] mb-8 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center transition-base">
                <div className="relative w-full md:w-1/2 lg:w-2/5 md:ml-2 group">
                    {/* Lucide Search Icon */}
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ijam-text-muted group-focus-within:text-ijam-accent transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                    </svg>
                    <input
                        type="search"
                        placeholder="Buscar por título, autor o tema..."
                        className="w-full pl-11 pr-4 py-2.5 bg-ijam-surface border border-ijam-surface-alt rounded-[var(--radius-md)] focus:ring-2 focus:ring-ijam-accent/30 focus:border-ijam-accent transition-all text-ijam-text text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto md:mr-2">
                    <select
                        className="px-4 py-2.5 bg-ijam-surface border border-ijam-surface-alt rounded-[var(--radius-md)] text-sm focus:ring-2 focus:ring-ijam-accent/30 focus:outline-none focus:border-ijam-accent text-ijam-text cursor-pointer transition-all"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Todas las Categorías</option>
                        {Array.from(new Set(initialBooks.map(b => b.category).filter(Boolean))).map(cat => (
                            <option key={cat} value={cat!}>{cat}</option>
                        ))}
                    </select>
                    <select
                        className="px-4 py-2.5 bg-ijam-surface border border-ijam-surface-alt rounded-[var(--radius-md)] text-sm focus:ring-2 focus:ring-ijam-accent/30 focus:outline-none focus:border-ijam-accent text-ijam-text cursor-pointer transition-all"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Todos los Tipos</option>
                        <option value="VIRTUAL">Virtual (E-Book)</option>
                        <option value="PHYSICAL">Físico</option>
                    </select>
                </div>
            </div>

            {/* Catalog Grid */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-ijam-surface-alt rounded-[var(--radius-xl)] bg-white shadow-sm">
                    <p className="text-ijam-text-muted text-lg">No se encontraron obras que coincidan con su búsqueda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="group flex flex-col items-start justify-start bg-white rounded-[var(--radius-xl)] shadow-card hover:shadow-card-hover border border-slate-200 transition-all duration-200 hover:-translate-y-1 overflow-hidden h-full">
                            {/* Image Section */}
                            <div className="w-full relative aspect-[3/4] overflow-hidden bg-ijam-surface border-b border-slate-100 shrink-0">
                                {book.cover_url ? (
                                    <img
                                        src={book.cover_url}
                                        alt={`Portada de ${book.title}`}
                                        className="object-cover w-full h-full opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 rounded-t-[var(--radius-xl)]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-ijam-surface rounded-t-[var(--radius-xl)]">
                                        <span className="text-ijam-text-muted italic text-sm">Sin Portada</span>
                                    </div>
                                )}

                                {/* Badge */}
                                <div className="absolute top-3 right-3 shadow-sm rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] font-bold tracking-wide border border-slate-200 z-10 uppercase">
                                    {book.type === 'VIRTUAL' ? (
                                        <span className="text-ijam-accent flex items-center gap-1.5">
                                            Virtual
                                        </span>
                                    ) : (
                                        <span className="text-ijam-primary flex items-center gap-1.5">
                                            Físico
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="w-full p-5 flex flex-col flex-grow">
                                <span className="text-[0.7rem] font-bold text-ijam-accent mb-1.5 block uppercase tracking-wider">{book.category || 'General'}</span>
                                <h3 className="text-lg font-semibold text-ijam-text leading-tight mb-2 group-hover:text-ijam-accent transition-colors line-clamp-2">
                                    {book.title}
                                </h3>
                                <p className="text-[0.875rem] font-normal text-ijam-text-muted mb-4 line-clamp-1">{book.author}</p>

                                <div className="flex justify-between items-center w-full mb-5">
                                    {book.available_stock > 0 ? (
                                        <span className="text-xs font-semibold text-ijam-success bg-ijam-success/10 px-2.5 py-1 rounded-full border border-ijam-success/20">
                                            Disponible ({book.available_stock > 100 ? '∞' : book.available_stock})
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold text-ijam-danger bg-ijam-danger/10 px-2.5 py-1 rounded-full border border-ijam-danger/20">
                                            Agotado
                                        </span>
                                    )}
                                </div>

                                {/* Action Button */}
                                <a href={`/libro/${book.id}`} className="mt-auto block w-full text-center px-4 py-2.5 text-sm font-semibold text-ijam-accent border-2 border-ijam-accent rounded-[var(--radius-md)] hover:bg-ijam-accent hover:text-ijam-primary transition-all duration-200">
                                    Ver detalles &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}