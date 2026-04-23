import React from 'react';
import './Sidebar.css';

const Sidebar = ({ items = [] }) => {
    return (
        <aside className="generic-sidebar">
            <ul className="sidebar-list">
                {items.map((item, index) => (
                    <li key={index} className="sidebar-item">
                        <a href={item.path} className="sidebar-link">
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;