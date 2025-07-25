
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// A simple utility to check if a color is dark.
// This helps decide whether text on a colored background should be light or dark.
const isColorDark = (hexColor: string): boolean => {
  const color = hexColor.substring(1); // strip #
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
};

// Simple lighten/darken function
const lightenDarkenColor = (col: string, amt: number) => {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

type ThemeMode = 'light' | 'dark';
type ThemeStyle = 'classic' | 'glass';
type SidebarPosition = 'left' | 'right';
type Currency = 'inr' | 'usd';
type CardStyle = 'simple' | 'card';
type HomeLayout = 'grid' | 'detailedList' | 'compactList';


interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  sidebarPosition: SidebarPosition;
  setSidebarPosition: (position: SidebarPosition) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
  currencySymbol: string;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
  homeLayout: HomeLayout;
  setHomeLayout: (layout: HomeLayout) => void;
  pinnedCalculators: string[];
  togglePin: (name: string) => void;
  isDragEnabled: boolean;
  setIsDragEnabled: (enabled: boolean) => void;
}

const DEFAULT_COLOR = '#e53e3e'; // Red
const DEFAULT_THEME_STYLE: ThemeStyle = 'classic';
const DEFAULT_THEME_MODE: ThemeMode = 'dark';
const DEFAULT_POSITION = 'left';
const DEFAULT_CURRENCY = 'inr';
const DEFAULT_CARD_STYLE = 'card';
const DEFAULT_HOME_LAYOUT: HomeLayout = 'grid';
const DEFAULT_DRAG_ENABLED = false;

export const ThemeContext = createContext<ThemeContextType>({
  themeColor: DEFAULT_COLOR,
  setThemeColor: () => {},
  themeStyle: DEFAULT_THEME_STYLE,
  setThemeStyle: () => {},
  themeMode: DEFAULT_THEME_MODE,
  setThemeMode: () => {},
  sidebarPosition: DEFAULT_POSITION,
  setSidebarPosition: () => {},
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  formatCurrency: () => '',
  currencySymbol: '₹',
  cardStyle: DEFAULT_CARD_STYLE,
  setCardStyle: () => {},
  homeLayout: DEFAULT_HOME_LAYOUT,
  setHomeLayout: () => {},
  pinnedCalculators: [],
  togglePin: () => {},
  isDragEnabled: DEFAULT_DRAG_ENABLED,
  setIsDragEnabled: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const applyThemeStyles = (color: string, style: ThemeStyle, mode: ThemeMode) => {
    const styleId = 'dynamic-theme-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    // Set HTML attributes for CSS to key off of
    document.documentElement.setAttribute('data-theme-style', style);
    document.documentElement.setAttribute('data-theme-mode', mode);

    // Add/remove body class for glass background
    document.body.classList.toggle('glass-theme-bg', style === 'glass');
    document.body.style.backgroundColor = style === 'glass' ? 'transparent' : '';

    // Generate gradient colors
    let gradientColor1, gradientColor2, gradientColor3, gradientColor4;

    if (style === 'glass') {
        if (mode === 'dark') {
            // Dark, moody gradient mixed with the accent color
            gradientColor1 = '#0d0d12'; // very dark purple/blue
            gradientColor2 = lightenDarkenColor(color, -60); // very dark shade of accent
            gradientColor3 = '#1a1a24'; // slightly lighter dark
            gradientColor4 = lightenDarkenColor(color, -40); // dark shade of accent
        } else { // light mode
            // Light, airy gradient mixed with the accent color
            gradientColor1 = '#ffffff'; // white
            gradientColor2 = lightenDarkenColor(color, 60); // very light shade of accent
            gradientColor3 = '#f0f2f5'; // off-white
            gradientColor4 = lightenDarkenColor(color, 40); // light shade of accent
        }
    } else {
        // Fallback for classic theme (though not used for bg)
        gradientColor1 = lightenDarkenColor(color, 40);
        gradientColor2 = lightenDarkenColor(color, -20);
        gradientColor3 = lightenDarkenColor(color, 20);
        gradientColor4 = lightenDarkenColor(color, -40);
    }


    // Set JS-controlled variables (accent color AND gradient colors)
    styleTag.innerHTML = `
      :root {
        --color-primary: ${color};
        --color-primary-light: ${lightenDarkenColor(color, 20)};
        --color-primary-dark: ${lightenDarkenColor(color, -20)};
        --color-text-on-primary: ${isColorDark(color) ? '#ffffff' : '#ffffff'};
        --color-accent: ${lightenDarkenColor(color, -30)};
        --color-accent-dark: ${lightenDarkenColor(color, -50)};

        /* New variables for the glass theme background */
        --gradient-color-1: ${gradientColor1};
        --gradient-color-2: ${gradientColor2};
        --gradient-color-3: ${gradientColor3};
        --gradient-color-4: ${gradientColor4};
      }
    `;
};


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColorState] = useState(DEFAULT_COLOR);
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(DEFAULT_THEME_STYLE);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [sidebarPosition, setSidebarPositionState] = useState<SidebarPosition>(DEFAULT_POSITION);
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [cardStyle, setCardStyleState] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [homeLayout, setHomeLayoutState] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [pinnedCalculators, setPinnedCalculators] = useState<string[]>([]);
  const [isDragEnabled, setIsDragEnabledState] = useState<boolean>(DEFAULT_DRAG_ENABLED);


  useEffect(() => {
    const storedColor = localStorage.getItem('themeColor');
    const storedStyle = localStorage.getItem('themeStyle') as ThemeStyle | null;
    const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    const storedPosition = localStorage.getItem('sidebarPosition') as SidebarPosition | null;
    const storedCurrency = localStorage.getItem('currency') as Currency | null;
    const storedCardStyle = localStorage.getItem('cardStyle') as CardStyle | null;
    const storedLayout = localStorage.getItem('homeLayout') as HomeLayout | null;
    const storedPins = localStorage.getItem('pinnedCalculators');
    const storedDragEnabled = localStorage.getItem('isDragEnabled');
    
    const initialColor = storedColor || DEFAULT_COLOR;
    const initialStyle = storedStyle || DEFAULT_THEME_STYLE;
    const initialMode = storedMode || DEFAULT_THEME_MODE;
    const initialPosition = storedPosition || DEFAULT_POSITION;
    const initialCurrency = storedCurrency || DEFAULT_CURRENCY;
    const initialCardStyle = storedCardStyle || DEFAULT_CARD_STYLE;
    const initialLayout = storedLayout || DEFAULT_HOME_LAYOUT;
    const initialDragEnabled = storedDragEnabled ? JSON.parse(storedDragEnabled) : DEFAULT_DRAG_ENABLED;

    setThemeColorState(initialColor);
    setThemeStyleState(initialStyle);
    setThemeModeState(initialMode);
    setSidebarPositionState(initialPosition);
    setCurrencyState(initialCurrency);
    setCardStyleState(initialCardStyle);
    setHomeLayoutState(initialLayout);
    setIsDragEnabledState(initialDragEnabled);

    if (storedPins) {
        try {
            setPinnedCalculators(JSON.parse(storedPins));
        } catch (e) {
            setPinnedCalculators([]);
        }
    }

    applyThemeStyles(initialColor, initialStyle, initialMode);
  }, []);

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
    applyThemeStyles(color, themeStyle, themeMode);
  };

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
    localStorage.setItem('themeStyle', style);
    applyThemeStyles(themeColor, style, themeMode);
  }

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
    applyThemeStyles(themeColor, themeStyle, mode);
  }

  const setSidebarPosition = (position: SidebarPosition) => {
    setSidebarPositionState(position);
    localStorage.setItem('sidebarPosition', position);
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };
  
  const setCardStyle = (style: CardStyle) => {
    setCardStyleState(style);
    localStorage.setItem('cardStyle', style);
  };

  const setHomeLayout = (layout: HomeLayout) => {
    setHomeLayoutState(layout);
    localStorage.setItem('homeLayout', layout);
  };

  const setIsDragEnabled = (enabled: boolean) => {
    setIsDragEnabledState(enabled);
    localStorage.setItem('isDragEnabled', JSON.stringify(enabled));
  };

  const togglePin = (name: string) => {
    setPinnedCalculators(prev => {
        const newPins = prev.includes(name) 
            ? prev.filter(p => p !== name)
            : [...prev, name];
        localStorage.setItem('pinnedCalculators', JSON.stringify(newPins));
        return newPins;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency === 'inr' ? 'INR' : 'USD',
    }).format(value);
  };
  
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  return (
    <ThemeContext.Provider value={{ 
        themeColor, setThemeColor, 
        themeStyle, setThemeStyle, 
        themeMode, setThemeMode,
        sidebarPosition, setSidebarPosition, 
        currency, setCurrency, 
        formatCurrency, currencySymbol, 
        cardStyle, setCardStyle, 
        homeLayout, setHomeLayout, 
        pinnedCalculators, togglePin,
        isDragEnabled, setIsDragEnabled
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
