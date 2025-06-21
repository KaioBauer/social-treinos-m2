import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../context/AuthContext';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <AuthProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Perfil Público' }} />
            </Stack.Navigator>
        </AuthProvider>
    );
}
