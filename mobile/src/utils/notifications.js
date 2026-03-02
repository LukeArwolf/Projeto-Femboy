import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
}

export async function scheduleWorkoutAlarm() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const trigger = {
        hour: 5,
        minute: 50,
        repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔥 Hora do Treino!",
            body: "Acorda 5:50! Hora de esmagar o treino de hoje.",
            data: { withSound: true },
        },
        trigger,
    });

    console.log('Alarm scheduled for 05:50 AM');
}
