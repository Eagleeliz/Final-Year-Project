import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
         {/* 1. FIRST SCREEN: Welcome Page*/}
        <Stack.Screen name="welcome" options={{ headerShown: false }} />

          {/* 2. SECOND: Login screen */}
        <Stack.Screen name="login" options={{ title: 'Sign In' ,
         headerBackTitle: 'Back' }} />

           {/* 3. SECOND: Register screen */}
              <Stack.Screen 
          name="register" 
          options={{
            title: 'Create Account',
            headerBackTitle: 'Back'
          }} 
           />

           {/* 4. FOURTH: Main app with tabs (after login) */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false  // No header because tabs have their own
          }} 
        />
        
          {/* 5. Modal screen (optional) */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal', 
            title: 'Modal' 
          }} 
        />

                 </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
