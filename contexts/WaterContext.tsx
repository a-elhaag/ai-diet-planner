import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterContextType {
    waterGlasses: number;
    totalGlasses: number;
    addWaterGlass: () => void;
    removeWaterGlass: () => void;
    resetWaterIntake: () => void;
    getWaterPercentage: () => number;
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [waterGlasses, setWaterGlasses] = useState(0);
    const totalGlasses = 8;

    // Load water intake data on app start
    useEffect(() => {
        loadWaterData();
    }, []);

    // Save water intake data whenever it changes
    useEffect(() => {
        saveWaterData();
    }, [waterGlasses]);

    const loadWaterData = async () => {
        try {
            const today = new Date().toDateString();
            const savedDate = await AsyncStorage.getItem('waterTrackingDate');
            const savedGlasses = await AsyncStorage.getItem('waterGlasses');
            
            // Reset if it's a new day
            if (savedDate !== today) {
                setWaterGlasses(0);
                await AsyncStorage.setItem('waterTrackingDate', today);
            } else if (savedGlasses) {
                setWaterGlasses(parseInt(savedGlasses, 10));
            }
        } catch (error) {
            console.error('Error loading water data:', error);
        }
    };

    const saveWaterData = async () => {
        try {
            await AsyncStorage.setItem('waterGlasses', waterGlasses.toString());
        } catch (error) {
            console.error('Error saving water data:', error);
        }
    };

    const addWaterGlass = () => {
        if (waterGlasses < totalGlasses) {
            setWaterGlasses(prev => prev + 1);
        }
    };

    const removeWaterGlass = () => {
        if (waterGlasses > 0) {
            setWaterGlasses(prev => prev - 1);
        }
    };

    const resetWaterIntake = () => {
        setWaterGlasses(0);
    };

    const getWaterPercentage = (): number => {
        return (waterGlasses / totalGlasses) * 100;
    };

    const value = {
        waterGlasses,
        totalGlasses,
        addWaterGlass,
        removeWaterGlass,
        resetWaterIntake,
        getWaterPercentage
    };

    return <WaterContext.Provider value={value}>{children}</WaterContext.Provider>;
};

export const useWater = () => {
    const context = useContext(WaterContext);
    if (context === undefined) {
        throw new Error('useWater must be used within a WaterProvider');
    }
    return context;
};
