import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const COLORS = {
    bg: '#070711',
    tabBar: '#0d0d1a',
    border: 'rgba(255,255,255,0.07)',
    primary: '#00ff88',
    inactive: 'rgba(255,255,255,0.3)',
};

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.bg,
        card: COLORS.tabBar,
        border: COLORS.border,
        text: '#ffffff',
    },
};

function TabIcon({ name, focused }) {
    const icons = {
        Home: focused ? '⬛' : '□',
        Treino: focused ? '🔥' : '○',
        Histórico: focused ? '📊' : '○',
        Perfil: focused ? '👤' : '○',
    };
    const labels = { Home: '🏠', Treino: '💪', Histórico: '📈', Perfil: '👤' };
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22 }}>{labels[name]}</Text>
        </View>
    );
}

function WorkoutStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#070711', shadowOpacity: 0, elevation: 0 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
                cardStyle: { backgroundColor: '#070711' },
            }}
        >
            <Stack.Screen name="WorkoutMain" component={WorkoutScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name="ExerciseDetail"
                component={ExerciseDetailScreen}
                options={({ route }) => ({
                    title: route.params?.exercise?.name || 'Exercício',
                    headerBackTitle: '',
                })}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.inactive,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Treino" component={WorkoutStack} />
                <Tab.Screen name="Histórico" component={HistoryScreen} />
                <Tab.Screen name="Perfil" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#0d0d1a',
        borderTopColor: 'rgba(255,255,255,0.07)',
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 10,
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
});
