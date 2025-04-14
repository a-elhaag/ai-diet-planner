import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the two unit systems
export type UnitSystem = 'imperial' | 'metric';

// Define the shape of our context value
interface UnitContextType {
    unitSystem: UnitSystem;
    toggleUnitSystem: () => void;
    formatWeight: (weight: number) => string;
    formatHeight: (height: number) => string;
    convertWeight: (weight: number, targetSystem?: UnitSystem) => number;
    convertHeight: (height: number, targetSystem?: UnitSystem) => number;
}

// Create the context with a default value
const UnitContext = createContext<UnitContextType | undefined>(undefined);

// Provider component
export const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

    // Function to toggle between imperial and metric
    const toggleUnitSystem = () => {
        setUnitSystem(current => (current === 'imperial' ? 'metric' : 'imperial'));
    };

    // Convert weight between pounds and kilograms
    const convertWeight = (weight: number, targetSystem?: UnitSystem): number => {
        const target = targetSystem || unitSystem;
        if (target === 'metric') {
            // Convert from pounds to kilograms
            return Math.round((weight / 2.20462) * 10) / 10;
        } else {
            // Convert from kilograms to pounds
            return Math.round((weight * 2.20462) * 10) / 10;
        }
    };

    // Convert height between inches and centimeters
    const convertHeight = (height: number, targetSystem?: UnitSystem): number => {
        const target = targetSystem || unitSystem;
        if (target === 'metric') {
            // Convert from inches to centimeters
            return Math.round(height * 2.54);
        } else {
            // Convert from centimeters to inches
            return Math.round((height / 2.54) * 10) / 10;
        }
    };

    // Format weight with appropriate units
    const formatWeight = (weight: number): string => {
        if (unitSystem === 'imperial') {
            return `${weight} lbs`;
        } else {
            const kgWeight = convertWeight(weight, 'metric');
            return `${kgWeight} kg`;
        }
    };

    // Format height with appropriate units (including feet and inches for imperial)
    const formatHeight = (heightInInches: number): string => {
        if (unitSystem === 'imperial') {
            const feet = Math.floor(heightInInches / 12);
            const inches = Math.round(heightInInches % 12);
            return `${feet}'${inches}"`;
        } else {
            const cm = convertHeight(heightInInches, 'metric');
            return `${cm} cm`;
        }
    };

    // Format height from cm to imperial feet'inches" or keep as cm
    const formatHeightFromCm = (heightInCm: number): string => {
        if (unitSystem === 'imperial') {
            const totalInches = Math.round(heightInCm / 2.54);
            const feet = Math.floor(totalInches / 12);
            const inches = totalInches % 12;
            return `${feet}'${inches}"`;
        } else {
            return `${heightInCm} cm`;
        }
    };

    const value = {
        unitSystem,
        toggleUnitSystem,
        formatWeight,
        formatHeight,
        convertWeight,
        convertHeight,
    };

    return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};

// Custom hook for using the unit context
export const useUnit = (): UnitContextType => {
    const context = useContext(UnitContext);
    if (context === undefined) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
};