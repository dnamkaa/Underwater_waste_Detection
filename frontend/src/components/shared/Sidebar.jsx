import React, { useState } from 'react';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiAirportSign1 } from 'react-icons/ci';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constat/navbar';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../../AuthContext'; // Assuming you have an AuthContext to provide user role

const linkClass = 'flex flex-row items-center gap-2 font-light px-3 py-1 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

export const Sidebar = () => {
  const { user, logout } = useAuth(); // Access the user's role and logout method
  
  const role = user?.role;
  const navigate = useNavigate(); // Initialize navigate here
  
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = (key) => {
    setExpandedMenu(expandedMenu === key ? null : key);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Filter links based on role
  const filteredLinks = DASHBOARD_SIDEBAR_LINKS.filter(item => item.roles.includes(role));
  const filteredBottomLinks = DASHBOARD_SIDEBAR_BOTTOM_LINKS.filter(item => item.roles.includes(role));
  const handleLogout = () => {
    if (logout) {
      logout(); // Call the logout function to clear user data
      closeSidebar(); // Close the sidebar
      navigate('/login'); // Redirect to the login page
    } else {
      console.error('Logout function is not defined');
    }
  };


  return (
    <div className="flex">
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden p-2 h-16 bg-sky-600 fixed top-0 left-0 right-50 z-30">
        <AiOutlineMenu onClick={toggleSidebar} className="text-4xl cursor-pointer text-secondary" />
      </div>
      <div className={classNames('bg-background text-Slate-50 p-4 flex flex-col fixed lg:static transition-transform duration-300 transform h-full z-40', {
        'translate-x-0': sidebarOpen,
        '-translate-x-full lg:translate-x-0': !sidebarOpen,
      })} style={{ top: sidebarOpen ? '0' : 'auto', maxHeight: '100vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-3 py-2 px-3 text-orange-600'>
            <CiAirportSign1 fontSize={24} />
            <div className='text-lg font-bold'>KKzone Auto Engineering</div>
          </div>
          <AiOutlineClose onClick={closeSidebar} className="text-2xl cursor-pointer lg:hidden" />
        </div>
        <div className="py-8 flex flex-1 flex-col gap-0.5 text-accent">
          {filteredLinks.map((item) => (
            <SidebarLink key={item.key} 
              item={item}
              isExpanded={expandedMenu === item.key}
              onMenuClick={() => handleMenuClick(item.key)}
              closeSidebar={closeSidebar}
            />
          ))}
        </div>
        <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
          {filteredBottomLinks.map((item) => (
            <SidebarLink22 key={item.key} item={item} closeSidebar={closeSidebar} />
          ))}
          <div className={classNames('text-orange-600 flex flex-row items-center gap-2 font-light px-3 py-1 cursor-pointer text-accent font-bold-700', linkClass)} onClick={handleLogout}>
            <span></span>
            Logout
          </div>
        </div>
      </div>
      {/* Overlay for mobile view to close sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 lg:hidden" onClick={closeSidebar}></div>}
    </div>
  );
};

function SidebarLink22({ item, closeSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    closeSidebar();
    navigate(item.path);
  };

  return (
    <div
      className={classNames(pathname === item.path ? 'bg-neutral-700 text-salmon-600' : 'text-neutral-400', linkClass)}
      onClick={handleLinkClick}
    >
      <span className="text-xl text-orange-600">{item.icon}</span>
      {item.label}
    </div>
  );
}

function SidebarLink({ item, isExpanded, onMenuClick, closeSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    closeSidebar();
    navigate(path);
  };

  if (item.subMenu) {
    return (
      <div>
        <div onClick={onMenuClick} className={classNames(pathname === item.path ? 'bg-white text-accent' : 'text-neutral-400 cursor-pointer', linkClass)}>
          <span className="text-xl text-orange-600">{item.icon}</span>
          {item.label}
        </div>
        {isExpanded && (
          <div className="ml-4">
            {item.subMenu.map((subItem) => (
              <div
                key={subItem.key}
                className={classNames(pathname === subItem.path ? 'bg-white text-orange-700' : 'text-neutral-400', linkClass)}
                onClick={() => handleLinkClick(subItem.path)}
              >
                <span className="text-xl text-orange-400">{subItem.icon}</span>
                {subItem.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={classNames(pathname === item.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClass)}
      onClick={() => handleLinkClick(item.path)}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </div>
  );
}
