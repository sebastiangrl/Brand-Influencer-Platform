// src/components/dashboard/footer.tsx
"use client";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} BrandConnect. Todos los derechos reservados.
            </p>
            </div>
        </footer>
    );
}