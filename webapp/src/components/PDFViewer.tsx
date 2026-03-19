import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set generic worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    url: string;
    title: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [isLoading, setIsLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setIsLoading(false);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
            {/* Viewer Toolbar */}
            <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 text-slate-300 shadow-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <a href="/mis-prestamos" className="hover:text-white transition-colors bg-slate-700 p-1.5 rounded-md" title="Volver a mis préstamos">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </a>
                    <h1 className="font-semibold text-sm line-clamp-1 max-w-md">{title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-700 rounded-md p-1">
                        <button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={previousPage}
                            className="p-1 hover:bg-slate-600 rounded disabled:opacity-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="text-xs px-2 font-mono">
                            {pageNumber || (numPages ? 1 : '--')} de {numPages || '--'}
                        </span>
                        <button
                            type="button"
                            disabled={pageNumber >= (numPages || -1)}
                            onClick={nextPage}
                            className="p-1 hover:bg-slate-600 rounded disabled:opacity-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-1 border-l border-slate-700 pl-4">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                        </button>
                        <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Area */}
            <div className="flex-1 overflow-auto bg-slate-900 flex justify-center p-8 custom-scrollbar relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin"></div>
                            <span className="text-slate-400 text-sm font-medium animate-pulse">Cargando documento seguro...</span>
                        </div>
                    </div>
                )}

                <div className="shadow-2xl transition-transform duration-200 origin-top">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading=""
                        error={
                            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-6 rounded-lg max-w-md text-center mt-20">
                                <svg className="w-10 h-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <p className="font-semibold mb-1">Error al cargar el documento</p>
                                <p className="text-sm opacity-80">El enlace pudo haber expirado o el archivo no está disponible. Por favor, vuelva a contactar la biblioteca.</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="bg-white"
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}
