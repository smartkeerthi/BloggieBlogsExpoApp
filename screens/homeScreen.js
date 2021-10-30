import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native'
import axios from '../Axios/axios';
import TimeAgo from 'javascript-time-ago';
import { FAB } from 'react-native-paper';
import Toast from 'react-native-tiny-toast';


const homeScreen = ({navigation}) => {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const timeAgo = new TimeAgo('en')

    const getAllPosts = () => {
        axios.get('/blogs')
        .then((res) => {
            setBlogs(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(true);
        })
    }

    useEffect(() => {
        getAllPosts();
    },[blogs])

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
                        <FlatList
                            data={blogs}
                            refreshing={false}
                            onRefresh={getAllPosts}
                            keyExtractor={({_id}, index) => _id}
                            renderItem={({item}) => (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.navigate('BlogPost',{id: item._id})}}>
                                    <View style={styles.blogContainer}>
                                        <Image source={{uri: item.image}} style={styles.blogImage} />
                                        <Text style={styles.blogTitle}>{item.title}</Text>
                                        <Text style={styles.blogDesc} numberOfLines={3}>{item.description}</Text>
                                        <Text style={{color: '#555', paddingHorizontal: 5, fontSize: 11, letterSpacing: 1}} >Author: {item.author}</Text>
                                        <Text style={{paddingHorizontal:5, color: '#555', fontSize: 11}}>{ timeAgo.format(new Date(item.createdAt))}</Text>
                                        <Text style={{paddingHorizontal:5, color: '#008eb1'}}>Read more...</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        <FAB
                            style={styles.fab}
                            icon="plus"
                            onPress={async()=>{
                                const logedIn = await AsyncStorage.getItem('LogedIn');
                                if(logedIn == 'true'){
                                    navigation.navigate('Add Post')
                                }else{
                                    navigation.navigate('Login');
                                    Toast.show('Login to add post', {delay: 500});
                                }
                            }}
                        />
                        </>
                    )
            }
        </>
    )
}

export default homeScreen

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
    fab: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        margin: 10,
        backgroundColor: "#008eb1"
    }
})
