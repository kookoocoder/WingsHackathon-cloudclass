import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaFile,
    FaHistory,
    FaCalendarAlt,
    FaUser,
    FaTasks,
    FaVideo,
    FaFolder,
    FaPlus
} from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: FaHome, path: '/' },
        { name: 'New file', icon: FaPlus, path: '/' },
        { name: 'Recent projects', icon: FaHistory, path: '/' },
        { name: 'Calendar', icon: FaCalendarAlt, path: '/calendar' },
        { name: 'Personal information', icon: FaUser, path: '/personal-info' },
        { name: 'Task list', icon: FaTasks, path: '/tasks' },
        { name: 'start meeting', icon: FaVideo, path: '/' }
    ];

    const handleItemClick = (item) => {
        navigate(item.path);
    };

    return (
        <aside className="sidebar">
            {menuItems.map((item) => (
                <button
                    key={item.name}
                    className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => handleItemClick(item)}
                >
                    <item.icon className="sidebar-icon" />
                    <span>{item.name}</span>
                </button>
            ))}
        </aside>
    );
}