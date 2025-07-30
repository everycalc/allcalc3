import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const presetColors = [
  '#0095de', // Default Blue
  '#e53e3e', // Red
  '#38a169', // Green
  '#805ad5', // Purple
  '#dd6b20', // Orange
];

// View Switcher Icons
const GridViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const DetailedListViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const CompactListViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5A.75.75 0 012.75 14h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14.75z" clipRule="evenodd" /></svg>;

const ViewSwitcherButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; label: string }> = ({ onClick, isActive, children, label }) => {
    const activeClasses = "bg-primary text-on-primary";
    const inactiveClasses = "text-theme-primary hover:bg-theme-primary";
    return (
        <button onClick={onClick} className={`w-1/3 py-1.5 rounded-md transition-colors flex justify-center items-center ${isActive ? activeClasses : inactiveClasses}`} aria-label={label}>
            {children}
        </button>
    );
};

const ThemeSelector: React.FC = () => {
  const { 
    themeColor, setThemeColor, 
    themeStyle, setThemeStyle,
    themeMode, setThemeMode,
    sidebarPosition, setSidebarPosition, 
    currency, setCurrency, 
    cardStyle, setCardStyle, 
    homeLayout, setHomeLayout,
  } = useTheme();

  return (
    <div className="space-y-4" id="theme-selector-container">
      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Accent Color</label>
        <div className="flex items-center space-x-2">
          {presetColors.map(color => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={`w-8 h-8 rounded-full transition transform hover:scale-110 ${themeColor === color ? 'ring-2 ring-offset-2 ring-offset-theme-primary ring-primary' : ''}`}
              style={{ backgroundColor: color }}
              aria-label={`Set theme color to ${color}`}
            />
          ))}
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-8 h-8 p-0 border-none rounded-full cursor-pointer bg-transparent"
            aria-label="Custom color picker"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Theme Style</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg">
          <button onClick={() => setThemeStyle('classic')} className={`w-1/2 py-1 rounded-md transition ${themeStyle === 'classic' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Classic</button>
          <button onClick={() => setThemeStyle('glass')} className={`w-1/2 py-1 rounded-md transition ${themeStyle === 'glass' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Glass</button>
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Appearance</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg">
          <button onClick={() => setThemeMode('light')} className={`w-1/2 py-1 rounded-md transition ${themeMode === 'light' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Light</button>
          <button onClick={() => setThemeMode('dark')} className={`w-1/2 py-1 rounded-md transition ${themeMode === 'dark' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Dark</button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Sidebar Position</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg">
          <button onClick={() => setSidebarPosition('left')} className={`w-1/2 py-1 rounded-md transition ${sidebarPosition === 'left' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Left</button>
          <button onClick={() => setSidebarPosition('right')} className={`w-1/2 py-1 rounded-md transition ${sidebarPosition === 'right' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Right</button>
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Currency</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg">
          <button onClick={() => setCurrency('inr')} className={`w-1/2 py-1 rounded-md transition ${currency === 'inr' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>INR (₹)</button>
          <button onClick={() => setCurrency('usd')} className={`w-1/2 py-1 rounded-md transition ${currency === 'usd' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>USD ($)</button>
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Home Page Style</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg">
          <button onClick={() => setCardStyle('simple')} className={`w-1/2 py-1 rounded-md transition text-sm ${cardStyle === 'simple' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Simple</button>
          <button onClick={() => setCardStyle('card')} className={`w-1/2 py-1 rounded-md transition text-sm ${cardStyle === 'card' ? 'bg-primary text-on-primary' : 'text-theme-primary hover:bg-theme-primary'}`}>Card</button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">Home Page View</label>
        <div className="flex justify-center bg-theme-tertiary p-1 rounded-lg space-x-1">
            <ViewSwitcherButton onClick={() => setHomeLayout('grid')} isActive={homeLayout === 'grid'} label="Grid View"><GridViewIcon /></ViewSwitcherButton>
            <ViewSwitcherButton onClick={() => setHomeLayout('detailedList')} isActive={homeLayout === 'detailedList'} label="List View"><DetailedListViewIcon /></ViewSwitcherButton>
            <ViewSwitcherButton onClick={() => setHomeLayout('compactList')} isActive={homeLayout === 'compactList'} label="Compact View"><CompactListViewIcon /></ViewSwitcherButton>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;