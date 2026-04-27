import React from 'react';
import { CopyrightIcon } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-copyright">
                    <CopyrightIcon size={'15px'} /> {currentYear} FashionShop, Inc. All rights reserved
                </div>

                <div className="footer-links">
                    <a href="/" className="footer-link-item">Guides</a>
                    <a href="/" className="footer-link-item">Terms of Sale</a>
                    <a href="/" className="footer-link-item">Terms of Use</a>
                    <a href="/" className="footer-link-item">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;