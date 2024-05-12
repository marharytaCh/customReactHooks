import { createContext, ReactNode, useContext, useState, FC } from 'react';
import { IUserProfile } from '../interfaces'; // any userProfile interface

interface UserDataContextProps {
    userData: { user: IUserProfile } | null;
    setUserData: (data: { user: IUserProfile } | null) => void;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

// Provider component to wrap around the components that need access to the data
export const UserDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<{ user: IUserProfile } | null>(null);

    const contextValue: UserDataContextProps = {
        userData,
        setUserData,
    };

    return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};

export const useUserDataContext = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
