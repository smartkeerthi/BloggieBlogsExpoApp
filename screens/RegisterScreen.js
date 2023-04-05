import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-tiny-toast';
import axios from '../Axios/axios';

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (name != '' && email != '' && password != '' && confirmPassword != '') {
            const toast = Toast.showLoading('Registering...');
            if (password == confirmPassword) {
                axios.post('/auth/register', {
                    "fullName": name,
                    "email": email,
                    "password": password
                }).then(async (res) => {
                    await AsyncStorage.setItem('token', res.data.token);
                    await AsyncStorage.setItem('userName', res.data.user.fullName);
                    await AsyncStorage.setItem('email', res.data.user.email);
                    await AsyncStorage.setItem('LogedIn', 'true');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    Toast.hide(toast);
                    Toast.showSuccess('Successfully Registered');
                    navigation.goBack();
                }).catch((err) => {
                    console.log(err);
                    Toast.hide(toast);
                    Toast.show(`Failed: ${err.message}`, { position: Toast.position.CENTER });
                })
            } else {
                Toast.hide(toast);
                Toast.show('Password and Confirm Password do not match', { position: Toast.position.CENTER })
            }
        } else {
            Toast.show('Fill all the details', { position: Toast.position.CENTER })
        }
    }

    return (
        <>
            <LinearGradient
                // colors={['#47c4ff', '#35a5e3', '#2688c7', '#176baa', '#09508d']}
                colors={['#00c59f', '#00aaae', '#008eb1', '#006fa7', '#09508d']}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
            <View style={{ flex: 1, alignItems: 'center', width: '80%', alignSelf: 'center', justifyContent: 'center' }}>
                <View style={styles.formControl}>
                    <Text style={styles.formTitle} >Full Name :</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.textArea}
                        placeholder="Enter Full Name"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.formTitle} >Email :</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.textArea}
                        placeholder="Enter Email"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.formTitle} >Password :</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.textArea}
                        placeholder="Enter Password"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.formTitle} >Confirm Password :</Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.textArea}
                        placeholder="Enter Confirm Password"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Button title='Register' color='#008eb1' onPress={handleSubmit} />
                </View>
                <View style={styles.formControl}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => { navigation.navigate('Login') }}>
                        <Text style={{ textAlign: 'center', color: '#00c59f' }}>Already a user? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    formControl: {
        width: '95%',
        marginTop: 15
    },
    formTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#eee'
    },
    textArea: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        marginTop: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        lineHeight: 25,
        color: '#eee'
    }
})
