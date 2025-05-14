import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of our context value - metric only
interface UnitContextType {
    formatWeight: (weight: number) => string;
    formatHeight: (height: number) => string;
}

// Create the context with a default value
const UnitContext = createContext<UnitContextType | undefined>(undefined);

// Provider component
export const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Format weight with appropriate units (metric only)
    const formatWeight = (weight: number): string => {
        return `${weight.toFixed(1)} kg`;
    };

    // Format height with appropriate units (metric only)
    const formatHeight = (height: number): string => {
        return `${height} cm`;
    };

    const value = {
        formatWeight,
        formatHeight
    };

    return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};

// Custom hook to use the unit context
export const useUnit = () => {
    const context = useContext(UnitContext);
    if (context === undefined) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
};