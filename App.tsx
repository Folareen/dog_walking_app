import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import NewGig from './src/screens/NewGig';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Gigs from './src/screens/Gigs';
import { supabase } from './src/supabase';
import useAuthStore from './src/stores/useAuthStore';

const Stack = createStackNavigator()

const App = () => {
  const { user, setUser } = useAuthStore()

  const [isLoaded] = useFonts({
    'opensans': require('./src/assets/fonts/OpenSans-Regular.ttf'),
    'opensans_bold': require('./src/assets/fonts/OpenSans-SemiBold.ttf'),
    'roboto': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'roboto_bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
  })

  const handleOnLayout = async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync()
    }
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session)
    })
  }, [])

  if (!isLoaded) return null

  return (
    <RootSiblingParent>
      <View onLayout={handleOnLayout} className='flex-1'>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
              user ?
                <>
                  <Stack.Screen name='gigs' component={Gigs} />
                  <Stack.Screen name='new-gig' component={NewGig} />
                </>
                :
                <>
                  <Stack.Screen name='login' component={Login} />
                  <Stack.Screen name='signup' component={Signup} />
                </>
            }
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </RootSiblingParent>
  )
}

export default App