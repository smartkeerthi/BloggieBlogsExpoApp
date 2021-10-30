import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Image, Alert } from 'react-native'
import axios from '../Axios/axios';
import TimeAgo from 'javascript-time-ago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';

const DashboardScreen = ({navigation}) => {

    const [authorblogs, setAuthorBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    // const [selectedId, setSelectedId] = useState('');
    const timeAgo = new TimeAgo('en')

    // const handleDelete = async() => {
    //     return(
    //         Alert.alert("Delete Post", "Are you sure you want to delete this post?",[
    //             {text: "Delete", onPress: () => {
    //                 axios.delete(`/blogs/${selectedId}`).then(() => {
    //                     Toast.showSuccess('Successfully Deleted');
    //                     setSelectedId('');
    //                 }).catch((err) => {
    //                     Toast.show(`Failed: ${err.message}`, {position: Toast.position.BOTTOM})
    //                 })
    //                 // console.log("object");
    //             }}], {cancelable: true})
    //     );
    // }

    const getAuthorBlogs = async() => {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('email');
        setAuthorName(name);
        setAuthorEmail(email);
        try {
            const value = await axios.get(`/blogs/getAuthor/${authorName}`);
            setAuthorBlogs(value.data);
            setLoading(false);
        } catch (error) {
            setLoading(true);
        }
    }

    useEffect(() => {
        getAuthorBlogs();
    },[authorName, authorblogs])

    return (
        <>
            <StatusBar style='auto' />
            {
                loading ? 
                    (<View style={styles.container}>
                        <ActivityIndicator size='large' color='#008eb1' />
                    </View>) : 
                    (
                        <>
                        <View style={{width: '85%', alignSelf: 'center', margin: 5, padding: 10}}>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: 'bold', color: '#008eb1'}}>Author Name: {authorName}</Text>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: 'bold', color: '#008eb1'}}>Author Email: {authorEmail}</Text>
                        </View>
                        {authorblogs.length != 0  ? (
                            <>
                            <FlatList
                                data={authorblogs}
                                refreshing={false}
                                onRefresh={getAuthorBlogs}
                                keyExtractor={({_id}, index) => _id}
                                renderItem={({item}) => (
                                    <View activeOpacity={0.8} onPress={() => {navigation.navigate('Edit Post',{id: item._id})}}>
                                        <View style={styles.blogContainer}>
                                            <Image source={{uri: item.image}} style={styles.blogImage} />
                                            <Text style={styles.blogTitle}>{item.title}</Text>
                                            <Text style={styles.blogDesc} numberOfLines={3}>{item.description}</Text>
                                            <Text style={{color: '#555', paddingHorizontal: 5, fontSize: 11, letterSpacing: 1}} >Author: {item.author}</Text>
                                            <Text style={{paddingHorizontal:5, color: '#555', fontSize: 11}}>{ timeAgo.format(new Date(item.createdAt))}</Text>
                                            <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-evenly'}}>
                                                <TouchableOpacity style={[styles.btn,{backgroundColor: '#008eb1'}]} onPress={() => {navigation.navigate('Edit Post',{id: item._id})}}>
                                                    <Text style={{paddingHorizontal:5, color: '#fff', textAlign: 'center'}}>Edit Post</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.btn, {backgroundColor: '#C70000'}]} onPress={() => {
                                                    Alert.alert("Delete Post", "Are you sure you want to delete this post?",[
                                                    {text: "Delete", onPress: () => {
                                                        axios.delete(`/blogs/${item._id}`).then(() => {
                                                            Toast.showSuccess('Successfully Deleted');
                                                        }).catch((err) => {
                                                            Toast.show(`Failed: ${err.message}`, {position: Toast.position.BOTTOM})
                                                        })
                                                        // console.log("object");
                                                    }}], {cancelable: true})
                                                }}>
                                                    <Text style={{paddingHorizontal:5, color: '#fff', textAlign: 'center'}}>Delete Post</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                            </>
                        ) : (
                            <View style={{flex: 0.7, alignItems: 'center', justifyContent: 'center'}}>
                                <Text>You have not yet created a blog post</Text>
                                <Text>Create new one</Text>
                            </View>
                        )}
                        </>
                    )
            }
        </>
    )
}

export default DashboardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blogContainer: {
        margin: 5,
        paddingHorizontal: 6,
        paddingVertical:7,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        elevation:1,
        borderColor: '#00c59f',
        borderWidth: 0
    },
    blogImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        borderRadius: 10
    },
    blogTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#008eb1',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    blogDesc: {
        textAlign: 'justify',
        paddingHorizontal:5,
        fontSize: 18
    },
    btn: {
        width: '48%',
        paddingVertical: 10
    }
})