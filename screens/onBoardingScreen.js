import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const onBoardingScreen = ({ navigation }) => {
    return (
        <>
            <StatusBar hidden={false} />
            <Onboarding
                nextLabel={<Text style={{ color: '#00c59f', letterSpacing: 1 }}>Next</Text>}
                skipLabel={<Text style={{ color: '#00A1B3', letterSpacing: 1 }}>Skip</Text>}
                DotComponent={({ selected }) => (<View style={{ width: 6, height: 6, borderRadius: 5, marginHorizontal: 3, backgroundColor: selected ? '#09508D' : '#00c59f' }} />)}
                DoneButtonComponent={() => (<TouchableOpacity onPress={() => { navigation.replace('HomeDrawer'); AsyncStorage.setItem('initialLaunched', 'true'); }}><Text style={{ color: '#09508D', letterSpacing: 0.5, marginRight: 20, fontSize: 15, textTransform: 'uppercase' }}>Get Started</Text></TouchableOpacity>)}
                bottomBarColor='rgba(255, 255, 255, 0.6)'
                onSkip={() => {
                    navigation.replace('HomeDrawer');
                    AsyncStorage.setItem('initialLaunched', 'true');
                }}
                pages={[
                    {
                        backgroundColor: '#fff',
                        image: <Image style={{ width: '100%', resizeMode: 'contain', height: 250 }} source={require('../assets/onBoardingImg1.png')} />,
                        title: 'Bloggie Blog',
                        subtitle: 'View all the blogs from bloggie blogs in this app',
                    },
                    // {
                    // backgroundColor: '#fff',
                    // image: <Image style={{width: '100%', resizeMode: 'contain', height: 250}} source={require('../assets/onBoardingImg2.png')} />,
                    // title: '',
                    // subtitle: 'Done with React Native Onboarding Swiper',
                    // },
                    {
                        backgroundColor: '#fff',
                        image: <Image style={{ width: '100%', resizeMode: 'contain', height: 250 }} source={require('../assets/onBoardingImg3.png')} />,
                        title: 'All Devices',
                        subtitle: 'Supported for all devices, download and view on all devices',
                    }
                ]} />
        </>
    )
}

export default onBoardingScreen
