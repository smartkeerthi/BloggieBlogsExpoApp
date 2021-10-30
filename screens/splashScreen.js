import React, { useEffect, useRef } from 'react'
import { Animated, Image, StyleSheet, Text, View } from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar';

const splashScreen = () => {

    const fadeIn = useRef(new Animated.Value(0)).current;
    const fadeUp = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true,
            }),
            Animated.timing(fadeUp, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            })
        ]).start();
    },[fadeIn, fadeUp])

    return (
        <>
        <StatusBar style='auto' backgroundColor='transparent' translucent={true} />
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <LinearGradient
            // colors={['#47c4ff', '#35a5e3', '#2688c7', '#176baa', '#09508d']}
            colors={['#00c59f', '#00aaae', '#008eb1', '#006fa7', '#09508d']}
            style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}/>
            <Animated.Image source={require('../assets/logoWhite.png')}
            style={{width: 100, height: 100, opacity: fadeIn}} />
            <Animated.Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1.5, opacity: fadeIn, transform:[{translateY: fadeUp}]}}>Bloggie Blogs</Animated.Text>
        </View>
        </>
    )
}

export default splashScreen

const styles = StyleSheet.create({})
