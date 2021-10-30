import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const aboutScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logoBlue.png')} style={{width: 80, height: 80}} />
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#09508d', letterSpacing: 1}} >Bloggie Blog</Text>
            </View>
            <View style={{width: '90%', height: 300, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, textAlign: 'center', fontWeight: '100', color: '#09508d', letterSpacing: 1}} >You can see the blog articles and images from Pixabay.com</Text>
            </View>
            <Text style={{justifyContent: 'flex-end', textAlignVertical: 'bottom', flex: 1, marginBottom: 15, color: '#555'}}>Copyrights 2021 | Bloggie Blog</Text>
        </View>
    )
}

export default aboutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        height: 200
    }
})
