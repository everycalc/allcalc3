import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const presetColors = [
  '#6750A4', // M3 Purple
  '#0061A4', // M3 Blue
  '#B3261E', // M3 Red
  '#1E6738', // M3 Green
  '#725B00', // M3 Yellow/Orange
];

const ThemeSelector: React.FC = () => {
  const { 
    themeStyle, setThemeStyle,
    themeColor, setThemeColor, 
    themeMode, setThemeMode,
    sidebarPosition, setSidebarPosition, 
    currency, setCurrency, 
  } = useTheme();

  const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="control-group">
        <label className="block text-sm font-medium text-on-surface-variant mb-2">{label}</label>
        {children}
    </div>
  );

  const ToggleButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => {
    const activeClasses = "toggle-button-active";
    const inactiveClasses = "hover:bg-surface-container-high";
    return (
        <button onClick={onClick} className={`toggle-button w-1/2 py-2 rounded-full transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
  };

  return (
    <div className="space-y-6" id="theme-selector-container">
        <ControlGroup label="Theme Style">
            <div className="toggle-group flex justify-center p-1 rounded-full">
                <ToggleButton onClick={() => setThemeStyle('pixel')} isActive={themeStyle === 'pixel'}>Pixel</ToggleButton>
                <ToggleButton onClick={() => setThemeStyle('classic')} isActive={themeStyle === 'classic'}>Classic</ToggleButton>
            </div>
        </ControlGroup>

        <ControlGroup label="Accent Color">
            <div className="flex items-center space-x-3">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-10 h-10 rounded-full transition transform hover:scale-110 focus:outline-none ${themeColor === color ? 'ring-2 ring-offset-2 ring-offset-surface-container ring-primary' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Set theme color to ${color}`}
                />
              ))}
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-10 h-10 p-0 border-none rounded-full cursor-pointer bg-transparent"
                aria-label="Custom color picker"
              />
            </div>
        </ControlGroup>

        <ControlGroup label="Appearance">
            <div className="toggle-group flex justify-center p-1 rounded-full">
                <ToggleButton onClick={() => setThemeMode('light')} isActive={themeMode === 'light'}>Light</ToggleButton>
                <ToggleButton onClick={() => setThemeMode('dark')} isActive={themeMode === 'dark'}>Dark</ToggleButton>
            </div>
        </ControlGroup>
      
        <ControlGroup label="Sidebar Position">
            <div className="toggle-group flex justify-center p-1 rounded-full">
                <ToggleButton onClick={() => setSidebarPosition('left')} isActive={sidebarPosition === 'left'}>Left</ToggleButton>
                <ToggleButton onClick={() => setSidebarPosition('right')} isActive={sidebarPosition === 'right'}>Right</ToggleButton>
            </div>
        </ControlGroup>

       <ControlGroup label="Currency Symbol">
            <div className="toggle-group flex justify-center p-1 rounded-full">
                <ToggleButton onClick={() => setCurrency('inr')} isActive={currency === 'inr'}>INR (₹)</ToggleButton>
                <ToggleButton onClick={() => setCurrency('usd')} isActive={currency === 'usd'}>USD ($)</ToggleButton>
            </div>
      </ControlGroup>
    </div>
  );
};

export default ThemeSelector;