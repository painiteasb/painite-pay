export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <a
            href="https://x.com/arc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Arc (@arc)
          </a>
        </div>
        <span className="hidden md:inline text-gray-300 dark:text-gray-700">•</span>
        <div className="flex items-center gap-2">
          <span>Builder:</span>
          <a
            href="https://x.com/Painite_ASB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Painite_ASB (@Painite_ASB)
          </a>
        </div>
      </div>
    </footer>
  );
}
