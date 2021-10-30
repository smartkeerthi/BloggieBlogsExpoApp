import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/splashScreen';
import HomeScreen from './screens/homeScreen';
import OnBoardingScreen from './screens/onBoardingScreen';
import PhotoScreen from './screens/photoScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from './screens/aboutScreen';
import BlogScreen from './screens/blogScreen';
import DrawerContent from './screens/DrawerContent';
import AddPostScreen from './screens/AddPostScreen';
import DashboardScreen from './screens/DashboardScreen';
import EditPostScreen from './screens/EditPostScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import en from 'javascript-time-ago/locale/en.json';
import TimeAgo from 'javascript-time-ago';


const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => {
  return(
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen}/>
      <HomeStack.Screen name="BlogPost" component={BlogScreen} />
    </HomeStack.Navigator>
  );
}

const DashboardStackScreen = () => {
  return(
    <DashboardStack.Navigator screenOptions={{headerTitleAlign: 'center', headerStyle:{backgroundColor:'#00c59f'}, headerTintColor: '#fff', headerTitleStyle:{textTransform: 'uppercase'}}}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen}/>
      <DashboardStack.Screen name="Edit Post" component={EditPostScreen}/>
    </DashboardStack.Navigator>
  )
}

const DrawerStack = () => {
  return(
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{headerTitleAlign: 'center', headerStyle:{backgroundColor:'#00c59f'}, headerTintColor: '#fff', headerTitleStyle:{textTransform: 'uppercase'} }}>
      <Drawer.Screen name="Bloggie Blog" component={HomeStackScreen} options={{headerStyle:{backgroundColor: '#008eb1'}}} />
      <Drawer.Screen name="Pictures" component={PhotoScreen} />
      <Drawer.Screen name="Add Post" component={AddPostScreen} />
      <Drawer.Screen name="Dashboard screen" component={DashboardStackScreen} options={{headerShown: false}} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} options={{headerTransparent: false, headerStyle:{backgroundColor: '#00c59f', elevation: 0}}} />
      <Drawer.Screen name="Register" component={RegisterScreen} options={{headerTransparent: false, headerStyle:{backgroundColor: '#00c59f', elevation: 0}}} />
    </Drawer.Navigator>
  )
}


export default function App() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOnBoarding, setIsOnBoarding] = useState(true);

  const getValueFromAsync = async() => {
      try{
        const value = await AsyncStorage.getItem('initialLaunched');
        if(value == 'true'){
          setIsOnBoarding(false);
        }
      }catch(err){
        console.log(err)
      }
  };

  useEffect(() => {
    TimeAgo.addLocale(en);
    getValueFromAsync();
    setTimeout(()=>{
      setIsLoading(false);
    },2000)
  },[])

  if(isLoading){
    return(
      <SplashScreen/>
    );
  }

  return (
    <NavigationContainer>
        {
          isOnBoarding ? (
            <Stack.Navigator>
              <Stack.Screen name="onBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="HomeDrawer" component={DrawerStack} options={{headerShown: false}} />
            </Stack.Navigator>
          ) : (
            <DrawerStack/>
          )
        }
    </NavigationContainer>
  );
}

