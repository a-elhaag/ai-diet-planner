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
            // Convert from pounds to kilograms (1 lb = 0.45359237 kg)
            return Number((weight * 0.45359237).toFixed(1));
        } else {
            // Convert from kilograms to pounds (1 kg = 2.20462262185 lbs)
            return Number((weight * 2.20462262185).toFixed(1));
        }
    };

    // Convert height between inches and centimeters
    const convertHeight = (height: number, targetSystem?: UnitSystem): number => {
        const target = targetSystem || unitSystem;
        if (target === 'metric') {
            // Convert from inches to centimeters (1 inch = 2.54 cm)
            return Math.round(height * 2.54);
        } else {
            // Convert from centimeters to inches (1 cm = 0.393701 inches)
            return Number((height * 0.393701).toFixed(1));
        }
    };

    // Format weight with appropriate units
    const formatWeight = (weight: number): string => {
        if (unitSystem === 'imperial') {
            return `${weight.toFixed(1)} lbs`;
        } else {
            const kgWeight = convertWeight(weight, 'metric');
            return `${kgWeight.toFixed(1)} kg`;
        }
    };

    // Format height with appropriate units (including feet and inches for imperial)
    const formatHeight = (heightInInches: number): string => {
        if (unitSystem === 'imperial') {
            let feet = Math.floor(heightInInches / 12);
            let inches = Math.round(heightInInches % 12);
            
            // Handle case where inches rounds up to 12
            if (inches === 12) {
                feet += 1;
                inches = 0;
            }
            
            return `${feet}'${inches}"`;
        } else {
            const cm = convertHeight(heightInInches, 'metric');
            return `${cm} cm`;
        }
    };

    const value = {
        unitSystem,
        toggleUnitSystem,
        formatWeight,
        formatHeight,
        convertWeight,
        convertHeight
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