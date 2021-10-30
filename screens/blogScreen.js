import axios from '../Axios/axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const blogScreen = ({route}) => {
    const { id } = route.params;
    const [blog, setBlog] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCompleteBlog = async() => {
        axios.get(`/blogs/${id}`).then((res) => {
            setBlog(res.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err)
            setLoading(true);
        })
        // try{
        //     const response = await fetch(`http://apibloggieblog.herokuapp.com/api/getPost/${id}`);
        //     const responseJson = await response.json();
        //     setBlog(responseJson);
        //     setLoading(false);
        // }catch(err){
        //     console.log(err);
        // }
        // finally {
        //     setLoading(false);
        // }
    }

    useEffect(() => {
        getCompleteBlog();
    },[])

    return (
        <>
            <StatusBar style='auto' />
            {
                loading ? 
                    (<View style={styles.container}>
                        <ActivityIndicator size='large' color='#008eb1' />
                    </View>) : 
                    (<ScrollView style={styles.blogContainer}>
                        <Image source={{uri: blog.image}} style={styles.image} />
                        <Text style={styles.title}>{ blog.title }</Text>
                        <Text style={styles.content}>{ blog.content }</Text>
                    </ScrollView>)
            }
        </>
    )
}

export default blogScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blogContainer: {
        margin: 5
    },
    image: {
        width: '98%',
        height: 300,
        borderRadius: 10,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: '#008eb1',
        letterSpacing: 1
    },
    content: {
        textAlign: 'justify',
        paddingHorizontal: 10,
        lineHeight: 25,
        fontSize: 15
    }
})
