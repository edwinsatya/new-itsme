const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 border-t border-green-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 font-mono text-sm">Copyright © {currentYear} It&apos;s me Edwin</p>
          <div className="mt-2 flex justify-center items-center space-x-2 text-green-400 font-mono text-xs">
            <span>{"</"}</span>
            <span>coded_with_passion</span>
            <span>{">"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
