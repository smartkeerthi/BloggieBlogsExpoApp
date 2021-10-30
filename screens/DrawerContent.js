import React, { useEffect, useState } from 'react';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';

const DrawerContent = (props) => {

    const [isLogedIn, setIsLogedIn] = useState(false);
    const checkLoginStatus = async() => {
        const value = await AsyncStorage.getItem('LogedIn');
        if(value == 'true'){
            setIsLogedIn(true);
        }else{
            setIsLogedIn(false);
        }
    }

    useEffect(()=>{
        setInterval(()=>{
            checkLoginStatus();
        },3000)
    },[isLogedIn])

    return (
        <View style={{flex: 1, marginHorizontal: 0}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/logoWhite.png')}
                    style={{width:40, height:40}} />
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff', marginLeft: 10}}>BLOGGIE BLOG</Text>
                </View>
                <Drawer.Section title='Menu'>
                <View style={styles.drawerNavContainer}>
                    <DrawerItem
                        icon = {({color, size}) => (
                            <MaterialIcons name="home" color={color} size={size} />
                        )}
                        labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                        label = "Home"
                        onPress = {() => props.navigation.navigate('Bloggie Blog')}
                        style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                    />
                    <DrawerItem
                        icon = {({color, size}) => (
                            <MaterialIcons name="image" color={color} size={size} />
                        )}
                        labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                        label = "Pictures"
                        onPress = {() => props.navigation.navigate('Pictures')}
                        style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                    />
                    {isLogedIn ? (
                        <>
                        <DrawerItem
                            icon = {({color, size}) => (
                                <MaterialIcons name="dashboard" color={color} size={size} />
                            )}
                            labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                            label = "Dashboard"
                            onPress = {() => props.navigation.navigate('Dashboard screen')}
                            style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                        />
                        <DrawerItem
                            icon = {({color, size}) => (
                                <MaterialIcons name="logout" color={color} size={size} />
                            )}
                            labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                            label = "Logout"
                            onPress = {async() => {
                                const toast = Toast.showLoading('Logging Out...')
                                await AsyncStorage.setItem('token', '');
                                await AsyncStorage.setItem('userName', '');
                                await AsyncStorage.setItem('email', '');
                                await AsyncStorage.setItem('LogedIn', 'false');
                                Toast.hide(toast);
                                Toast.showSuccess('Loged Out Successfully', {delay: 500});
                                checkLoginStatus();
                            }}
                            style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                        />
                        </>
                    ) : (
                        <DrawerItem
                            icon = {({color, size}) => (
                                <MaterialIcons name="login" color={color} size={size} />
                            )}
                            labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                            label = "Sign-in"
                            onPress = {() => props.navigation.navigate('Login')}
                            style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                        />
                    )}
                    <DrawerItem
                        icon = {({color, size}) => (
                            <MaterialIcons name="info" color={color} size={size} />
                        )}
                        labelStyle = {{fontSize: 15, fontWeight: 'bold', letterSpacing: 1}}
                        label = "About"
                        onPress = {() => props.navigation.navigate('About')}
                        style = {{borderBottomColor: '#f4f4f4', borderBottomWidth: 1}}
                    />
                </View>
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomNavSection}>
                <DrawerItem
                    icon = {({color, size}) => (
                        <MaterialIcons name="exit-to-app" color={color} size={size} />
                    )}
                    labelStyle={{fontSize: 15, fontWeight: 'bold', marginLeft: -20}}
                    label = "Exit App"
                    onPress = {() => BackHandler.exitApp()}
                />
            </Drawer.Section>
        </View>
    )
}

export default DrawerContent

const styles = StyleSheet.create({
    logoContainer: {
        width: '100%',
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09508d',
        height: 120,
        marginBottom: 10,
        borderColor: '#fff',
        borderWidth: 3
    },
    bottomNavSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
    },
    drawerNavContainer: {
        flex: 1,
        marginTop: 10
    }
})
