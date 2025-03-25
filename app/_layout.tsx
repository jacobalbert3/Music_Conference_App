//imports stack navigator component (stack of screens)
//users navigate screens in a stack based manner
import { Stack } from "expo-router";
import { AuthProvider } from './context/AuthContext';


export default function RootLayout() {
  return (
    <AuthProvider>
      {/* defines the stack of screens */}
      <Stack>
        <Stack.Screen
          name="login" 
          options={{ 
            //hides the navigation bar
            headerShown: false,
            // Prevent going back to index (important for login screens)
            gestureEnabled: false
          }} 
        />
        {/* defines the home screen route */}
        <Stack.Screen 
          name="home" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        <Stack.Screen
          name="schedule"
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="speakers"
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="sponsors"
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="floor-plan"
          options={{
            headerTitle: '',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
