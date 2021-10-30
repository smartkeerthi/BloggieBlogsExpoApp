import React, { useEffect, useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import axios from '../Axios/axios';
import Toast from 'react-native-tiny-toast';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

const EditPostScreen = ({navigation, route}) => {

    const { id } = route.params;
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [desc, setDesc] = useState('');
    const [content, setContent] = useState('');
    const [local, setLocal] = useState(false);


    const firebaseConfig = {
        apiKey: "AIzaSyCNb8sqiPkfXhI3s1o3scyMwg9chVoGH_U",
        authDomain: "bloggieblogs-kk.firebaseapp.com",
        projectId: "bloggieblogs-kk",
        storageBucket: "bloggieblogs-kk.appspot.com",
        messagingSenderId: "869907182446",
        appId: "1:869907182446:web:e1cfff322044c57ff3877f",
        measurementId: "G-8DD85P5K9B"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }


    const handleChooseImg = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            setImageUrl(result.uri);
            setLocal(true);
        }else{
            setLocal(false);
        }
    }

    const uploadToFirebase = async(uri, imagesName) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        // const response = await fetch(uri);
        // const blob = await response.blob();
        const fileName = imagesName + (new Date().toISOString())
        const ref = firebase.storage().ref().child(`blogImages/${imagesName}/`+ fileName);
        const snapshot = await ref.put(blob);

        blob.close();
        
        return await snapshot.ref.getDownloadURL();
    }

    const handleSubmit = async() => {
        if(title != '' && imageUrl != '' && author != '' && desc != '' && content != ''){
            const toast = Toast.showLoading('Updating...');
            if(local){
                const uploadedUrl = await uploadToFirebase(imageUrl, author);

                axios.patch(`/blogs/${id}`,{
                    "title": title,
                    "image": uploadedUrl,
                    "description": desc,
                    "content": content,
                    "author": author
                }).then((res) => {
                        Toast.hide(toast);
                        setTitle('');
                        setImageUrl('');
                        setDesc('');
                        setContent('');
                        Toast.showSuccess('Successfully Updated');
                        Toast.show('Pull to refresh',{position: Toast.position.BOTTOM, delay: 1000});
                        navigation.goBack();
                    }).catch(err => {
                        console.log(err);
                        Toast.hide(toast);
                        Toast.show(`Failed: ${err.message}`,{position: Toast.position.CENTER});
                    })
            }
        }else{
            Toast.show('Fill all the details', {position: Toast.position.CENTER});
        }
    }

    const getSinglePost = () => {
        axios.get(`/blogs/${id}`).then((res) => {
            setTitle(res.data.title);
            setImageUrl(res.data.image);
            setAuthor(res.data.author);
            setDesc(res.data.description);
            setContent(res.data.content)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getSinglePost();
    },[])

    return (
        <ScrollView style={{flex: 1, marginBottom: 20}} contentContainerStyle={{alignItems: 'center'}}>
            <View style={styles.formControl}>
                <Text style={styles.formTitle} >Title :</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={styles.textArea}
                    placeholder="Enter Title"
                    multiline={true}
                />
            </View>
            <View style={styles.formControl}>
                <Text style={styles.formTitle} >Image URL :</Text>
                <TextInput
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    style={styles.textArea}
                    placeholder="Enter Image URL"
                    multiline={true}
                />
                <TouchableOpacity activeOpacity={0.5} onPress={handleChooseImg}>
                    <Text style={{color: "#008eb1"}}>Choose Image</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.formControl}>
                <Text style={styles.formTitle} >Author :</Text>
                <TextInput
                    value={author}
                    onChangeText={setAuthor}
                    style={styles.textArea}
                    placeholder="Enter Author Name"
                    editable={false}
                />
            </View>
            <View style={styles.formControl}>
                <Text style={styles.formTitle} >Description :</Text>
                <TextInput
                    value={desc}
                    onChangeText={setDesc}
                    style={styles.textArea}
                    placeholder="Enter Blog Description"
                    multiline={true}
                />
            </View>
            <View style={styles.formControl}>
                <Text style={styles.formTitle} >Content :</Text>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    style={styles.textAreaContent}
                    placeholder="Enter Blog Content"
                    multiline={true}
                />
            </View>
            <View style={styles.formControl}>
                <Button title='Update Post' color='#00c59f' onPress={handleSubmit} />
            </View>
        </ScrollView>
    )
}

export default EditPostScreen

const styles = StyleSheet.create({
    formControl: {
        width: '95%',
        marginTop: 15
    },
    formTitle:{
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#555'
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#00c59f',
        marginTop: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        lineHeight: 25
    },
    textAreaContent: {
        borderWidth: 1,
        borderColor: '#00c59f',
        marginTop: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        lineHeight: 25,
        height: 400,
        textAlignVertical: 'top'
    }
})