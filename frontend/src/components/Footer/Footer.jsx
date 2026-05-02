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
                    <span className="footer-link-item">Guides</span>
                    <span className="footer-link-item">Terms of Sale</span>
                    <span className="footer-link-item">Terms of Use</span>
                    <span className="footer-link-item">Privacy Policy</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;