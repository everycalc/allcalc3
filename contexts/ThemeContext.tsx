import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { calculatorsData } from '../data/calculators';

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

// Refactored for clarity and robustness
const lightenDarkenColor = (hexColor: string, amount: number) => {
  let usePound = false;
  if (hexColor.startsWith("#")) {
    hexColor = hexColor.slice(1);
    usePound = true;
  }

  // Handle 3-digit hex colors by duplicating characters
  if (hexColor.length === 3) {
    hexColor = hexColor[0].repeat(2) + hexColor[1].repeat(2) + hexColor[2].repeat(2);
  }

  const decimalColor = parseInt(hexColor, 16);
  if (isNaN(decimalColor)) return '#000000'; // Fallback for invalid color

  let red = (decimalColor >> 16) & 0xFF;
  let green = (decimalColor >> 8) & 0xFF;
  let blue = decimalColor & 0xFF;

  // Apply the amount to each channel, clamping the result between 0 and 255
  red = Math.max(0, Math.min(255, red + amount));
  green = Math.max(0, Math.min(255, green + amount));
  blue = Math.max(0, Math.min(255, blue + amount));
  
  const toHex = (c: number) => c.toString(16).padStart(2, '0');

  return `${usePound ? "#" : ""}${toHex(red)}${toHex(green)}${toHex(blue)}`;
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
  pinCalculator: (name: string) => void;
  unpinCalculator: (name: string) => void;
}

const DEFAULT_COLOR = '#e53e3e'; // Red
const DEFAULT_THEME_STYLE: ThemeStyle = 'classic';
const DEFAULT_THEME_MODE: ThemeMode = 'dark';
const DEFAULT_POSITION = 'left';
const DEFAULT_CURRENCY = 'inr';
const DEFAULT_CARD_STYLE = 'card';
const DEFAULT_HOME_LAYOUT: HomeLayout = 'grid';

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
  pinCalculator: () => {},
  unpinCalculator: () => {},
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
        --color-text-on-primary: ${isColorDark(color) ? '#ffffff' : '#2d3748'};
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


  useEffect(() => {
    const storedColor = localStorage.getItem('themeColor');
    const storedStyle = localStorage.getItem('themeStyle') as ThemeStyle | null;
    const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    const storedPosition = localStorage.getItem('sidebarPosition') as SidebarPosition | null;
    const storedCurrency = localStorage.getItem('currency') as Currency | null;
    const storedCardStyle = localStorage.getItem('cardStyle') as CardStyle | null;
    const storedLayout = localStorage.getItem('homeLayout') as HomeLayout | null;
    const storedPins = localStorage.getItem('pinnedCalculators');
    
    const initialColor = storedColor || DEFAULT_COLOR;
    const initialStyle = storedStyle || DEFAULT_THEME_STYLE;
    const initialMode = storedMode || DEFAULT_THEME_MODE;
    const initialPosition = storedPosition || DEFAULT_POSITION;
    const initialCurrency = storedCurrency || DEFAULT_CURRENCY;
    const initialCardStyle = storedCardStyle || DEFAULT_CARD_STYLE;
    const initialLayout = storedLayout || DEFAULT_HOME_LAYOUT;

    setThemeColorState(initialColor);
    setThemeStyleState(initialStyle);
    setThemeModeState(initialMode);
    setSidebarPositionState(initialPosition);
    setCurrencyState(initialCurrency);
    setCardStyleState(initialCardStyle);
    setHomeLayoutState(initialLayout);

    if (storedPins) {
        try {
            setPinnedCalculators(JSON.parse(storedPins));
        } catch (e) {
            setPinnedCalculators([]);
        }
    }

    applyThemeStyles(initialColor, initialStyle, initialMode);
  }, []);
  
  const pinCalculator = (name: string) => {
    const newPins = [...pinnedCalculators, name];
    setPinnedCalculators(newPins);
    localStorage.setItem('pinnedCalculators', JSON.stringify(newPins));
  };

  const unpinCalculator = (name: string) => {
    const newPins = pinnedCalculators.filter(p => p !== name);
    setPinnedCalculators(newPins);
    localStorage.setItem('pinnedCalculators', JSON.stringify(newPins));
  };

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
        pinnedCalculators, pinCalculator, unpinCalculator
    }}>
      {children}
    </ThemeContext.Provider>
  );
};