import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// --- COLOR MANIPULATION UTILITIES ---

const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

const rgbToHex = (r: number, g: number, b: number): string => 
    `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1).toUpperCase()}`;

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [r * 255, g * 255, b * 255];
};

const adjustColor = (hex: string, amount: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const [h, s, l] = rgbToHsl(...rgb);
    const newL = Math.max(0, Math.min(1, l + amount));
    const [r, g, b] = hslToRgb(h, s, newL);
    return rgbToHex(r, g, b);
}


// --- THEME GENERATION LOGIC ---

type ThemeMode = 'light' | 'dark';
type ThemeStyle = 'pixel' | 'classic';

const generatePalette = (sourceHex: string, mode: ThemeMode) => {
    const sourceRgb = hexToRgb(sourceHex);
    if (!sourceRgb) return {};

    const [h, s, l] = rgbToHsl(...sourceRgb);
    const generateColor = (newH: number, newS: number, newL: number) => {
        const [r, g, b] = hslToRgb(newH, newS, newL);
        return rgbToHex(r, g, b);
    };
    
    // Tonal palette generation (simplified Material 3 logic)
    const p = (lightness: number) => generateColor(h, s, mode === 'light' ? lightness : 1 - lightness);
    const primary = mode === 'light' ? p(0.40) : p(0.20);
    const onPrimary = mode === 'light' ? p(1.0) : p(0.80);
    const primaryContainer = mode === 'light' ? p(0.90) : p(0.70);
    const onPrimaryContainer = mode === 'light' ? p(0.10) : p(0.10);
    const primaryContainerHover = mode === 'light' ? adjustColor(primaryContainer, -0.05) : adjustColor(primaryContainer, 0.05);

    const secH = h;
    const secS = s * 0.5;
    const sec = (lightness: number) => generateColor(secH, secS, mode === 'light' ? lightness : 1 - lightness);
    const secondaryContainer = sec(0.90);
    const onSecondaryContainer = sec(0.10);
    const secondaryContainerHover = mode === 'light' ? adjustColor(secondaryContainer, -0.05) : adjustColor(secondaryContainer, 0.05);

    const tertH = (h + 0.1) % 1;
    const tertS = s * 0.6;
    const tert = (lightness: number) => generateColor(tertH, tertS, mode === 'light' ? lightness : 1 - lightness);
    const tertiaryContainer = tert(0.90);
    const onTertiaryContainer = tert(0.10);
    const tertiaryContainerHover = mode === 'light' ? adjustColor(tertiaryContainer, -0.05) : adjustColor(tertiaryContainer, 0.05);

    const error = mode === 'light' ? '#B3261E' : '#F2B8B5';
    const onError = mode === 'light' ? '#FFFFFF' : '#601410';
    const errorContainer = mode === 'light' ? '#F9DEDC' : '#8C1D18';
    const onErrContainer = mode === 'light' ? '#410E0B' : '#F9DEDC';
    
    // --- Themed Shadow Color ---
    const shadowColor = mode === 'light' 
        ? `rgba(0, 0, 0, 0.1)` 
        : `rgba(${sourceRgb[0]}, ${sourceRgb[1]}, ${sourceRgb[2]}, 0.25)`;

    return {
        '--color-primary': primary,
        '--color-on-primary': onPrimary,
        '--color-primary-container': primaryContainer,
        '--color-on-primary-container': onPrimaryContainer,
        '--color-primary-container-hover': primaryContainerHover,
        '--color-secondary-container': secondaryContainer,
        '--color-on-secondary-container': onSecondaryContainer,
        '--color-secondary-container-hover': secondaryContainerHover,
        '--color-tertiary-container': tertiaryContainer,
        '--color-on-tertiary-container': onTertiaryContainer,
        '--color-tertiary-container-hover': tertiaryContainerHover,
        '--color-error': error,
        '--color-on-error': onError,
        '--color-error-container': errorContainer,
        '--color-on-error-container': onErrContainer,
        '--color-surface': `var(--sys-color-surface)`,
        '--color-on-surface': `var(--sys-color-on-surface)`,
        '--color-on-surface-variant': `var(--sys-color-on-surface-variant)`,
        '--color-surface-container': `var(--sys-color-surface-container)`,
        '--color-surface-container-low': `var(--sys-color-surface-container-low)`,
        '--color-surface-container-high': `var(--sys-color-surface-container-high)`,
        '--color-surface-container-highest': `var(--sys-color-surface-container-highest)`,
        '--color-outline': `var(--sys-color-outline)`,
        '--color-outline-variant': `var(--sys-color-outline-variant)`,
        '--shadow-color': shadowColor, // New shadow color variable
    };
};

const applyTheme = (style: ThemeStyle, color: string, mode: ThemeMode) => {
    const styleId = 'dynamic-theme-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    document.documentElement.setAttribute('data-theme-style', style);
    document.documentElement.setAttribute('data-theme-mode', mode);
    
    if (style === 'pixel') {
        const palette = generatePalette(color, mode);
        const cssString = `:root { ${Object.entries(palette).map(([key, value]) => `${key}: ${value};`).join(' ')} }`;
        styleTag.innerHTML = cssString;
    } else {
        // Classic theme uses static colors from index.html, so we just need to ensure the accent color is set.
        const classicPalette = { '--color-primary': color, '--color-text-on-primary': '#FFFFFF' };
        const cssString = `:root { ${Object.entries(classicPalette).map(([key, value]) => `${key}: ${value};`).join(' ')} }`;
        styleTag.innerHTML = cssString;
    }
};

// --- REACT CONTEXT ---

type SidebarPosition = 'left' | 'right';
type Currency = 'inr' | 'usd';

interface ThemeContextType {
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  sidebarPosition: SidebarPosition;
  setSidebarPosition: (position: SidebarPosition) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
  currencySymbol: string;
  pinnedCalculators: string[];
  pinCalculator: (name: string) => void;
  unpinCalculator: (name: string) => void;
}

const DEFAULT_STYLE = 'pixel';
const DEFAULT_COLOR = '#FFFFFF';
const DEFAULT_THEME_MODE: ThemeMode = 'dark';
const DEFAULT_POSITION = 'left';
const DEFAULT_CURRENCY = 'inr';

export const ThemeContext = createContext<ThemeContextType>({
  themeStyle: DEFAULT_STYLE,
  setThemeStyle: () => {},
  themeColor: DEFAULT_COLOR,
  setThemeColor: () => {},
  themeMode: DEFAULT_THEME_MODE,
  setThemeMode: () => {},
  sidebarPosition: DEFAULT_POSITION,
  setSidebarPosition: () => {},
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  formatCurrency: () => '',
  currencySymbol: '₹',
  pinnedCalculators: [],
  pinCalculator: () => {},
  unpinCalculator: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(DEFAULT_STYLE);
  const [themeColor, setThemeColorState] = useState(DEFAULT_COLOR);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [sidebarPosition, setSidebarPositionState] = useState<SidebarPosition>(DEFAULT_POSITION);
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [pinnedCalculators, setPinnedCalculators] = useState<string[]>([]);

  useEffect(() => {
    const storedStyle = localStorage.getItem('themeStyle') as ThemeStyle | null;
    const storedColor = localStorage.getItem('themeColor');
    const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    const storedPosition = localStorage.getItem('sidebarPosition') as SidebarPosition | null;
    const storedCurrency = localStorage.getItem('currency') as Currency | null;
    const storedPins = localStorage.getItem('pinnedCalculators');
    
    const initialStyle = storedStyle || DEFAULT_STYLE;
    const initialColor = storedColor || DEFAULT_COLOR;
    const initialMode = storedMode || DEFAULT_THEME_MODE;
    const initialPosition = storedPosition || DEFAULT_POSITION;
    const initialCurrency = storedCurrency || DEFAULT_CURRENCY;

    setThemeStyleState(initialStyle);
    setThemeColorState(initialColor);
    setThemeModeState(initialMode);
    setSidebarPositionState(initialPosition);
    setCurrencyState(initialCurrency);

    if (storedPins) {
        try {
            setPinnedCalculators(JSON.parse(storedPins));
        } catch (e) {
            setPinnedCalculators([]);
        }
    }

    applyTheme(initialStyle, initialColor, initialMode);
  }, []);
  
  const pinCalculator = (name: string) => {
    const newPins = [...new Set([...pinnedCalculators, name])];
    setPinnedCalculators(newPins);
    localStorage.setItem('pinnedCalculators', JSON.stringify(newPins));
  };

  const unpinCalculator = (name: string) => {
    const newPins = pinnedCalculators.filter(p => p !== name);
    setPinnedCalculators(newPins);
    localStorage.setItem('pinnedCalculators', JSON.stringify(newPins));
  };

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
    localStorage.setItem('themeStyle', style);
    applyTheme(style, themeColor, themeMode);
  }

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
    applyTheme(themeStyle, color, themeMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
    applyTheme(themeStyle, themeColor, mode);
  }

  const setSidebarPosition = (position: SidebarPosition) => {
    setSidebarPositionState(position);
    localStorage.setItem('sidebarPosition', position);
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
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
        themeStyle, setThemeStyle,
        themeColor, setThemeColor, 
        themeMode, setThemeMode,
        sidebarPosition, setSidebarPosition, 
        currency, setCurrency, 
        formatCurrency, currencySymbol, 
        pinnedCalculators, pinCalculator, unpinCalculator
    }}>
      {children}
    </ThemeContext.Provider>
  );
};