import React from 'react';
import { Link } from 'react-router';

function Footer() {
    return (
        <footer className="bg-black text-gray-400 text-sm py-6 px-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="text-center md:text-left">
                    © {new Date().getFullYear()} <span className="font-semibold text-white">OpenFile</span>. All rights reserved.
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-4">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
                        Privacy Policy
                    </Link>
                    <Link to="/privacy-policy/#terms" className="hover:text-white transition-colors duration-200">
                        Terms of Service
                    </Link>
                    <Link to="/privacy-policy/#security" className="hover:text-white transition-colors duration-200">
                        Security
                    </Link>
                    <Link to="/privacy-policy/#contact" className="hover:text-white transition-colors duration-200">
                        Contact
                    </Link>
                </div>

            </div>
        </footer>
    );
}

export default React.memo(Footer);
