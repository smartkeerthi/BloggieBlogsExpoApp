import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity, Share } from 'react-native';
import axios from '../Axios/axios';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-tiny-toast';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const photoScreen = () => {

    const [images, setImages] = useState([]);
    const [loading, setloading] = useState(true);
    const [search, setSearch] = useState('');

    const handleDownload = async(url, id) => {
        const perms = await MediaLibrary.requestPermissionsAsync();
        if(perms.status == 'granted'){
            FileSystem.downloadAsync(
                url,
                FileSystem.documentDirectory + id + '.jpg'
            ).then(async({uri}) => {
                const asset = await MediaLibrary.createAssetAsync(uri);
                const album = await MediaLibrary.getAlbumAsync('Bloggie Blog');
                if (album == null){
                    await MediaLibrary.createAlbumAsync('Bloggie Blog', asset, false);
                    Toast.showSuccess('Saved to Gallery');
                }else{
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    Toast.showSuccess('Saved to Gallery');
                }
            }).catch(err => {
                console.log(err)
            })
        }else{
            alert('Sorry, we need media permissions to save images!')
        }
    }

    const handleShare = async(url) => {
        try {
            await Share.share({
                message: 'Checkout this Image ' + url
            });
        } catch (error) {
            console.log(error);
        }
    }

    const getImages = () => {
        axios.get('/images')
        .then((res) => {
            setImages(res.data.hits);
            setloading(false);
        })
        .catch(err => {
            console.log(err);
            setloading(true);
        })
    }

    const getQImages = () => {
        setloading(true);
        axios.get(`/images/${search}`)
        .then((res) => {
            setImages([]);
            setImages(res.data.hits);
            setloading(false);
        })
        .catch(err => {
            console.log(err);
            setloading(true);
        })
    }

    useEffect(() => {
        setSearch('');
        getImages();
    },[])

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
                        <TextInput style={styles.textInput} placeholder="Search" onSubmitEditing={() => getQImages()} value={search} onChangeText={setSearch} />
                        <FlatList
                            data={images}
                            keyExtractor = {({id},index) => id.toString()}
                            renderItem = {({item}) => (
                                <>
                                <View activeOpacity={0.4} style={styles.imageContainer}>
                                    <Image source={{uri: item.webformatURL}} style={{width: '100%', height: 300, resizeMode: 'contain', marginVertical: 5}} />
                                    <View style={{width: '95%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center'}}>
                                        <TouchableOpacity onPress={() => {
                                            Clipboard.setString(item.webformatURL);
                                            Toast.show('URL Copied to Clipboard');}} 
                                        activeOpacity={0.5} style={styles.btn}>
                                            <MaterialIcons name="content-copy" size={20} color="#fff" />
                                            <Text style={styles.btnText}>Copy URL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDownload(item.webformatURL, item.id)}
                                        activeOpacity={0.5} style={[styles.btn, {backgroundColor: '#00c59f'}]}>
                                            <MaterialIcons name="file-download" size={20} color="#fff" />
                                            <Text style={styles.btnText}>Download</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleShare(item.webformatURL)} 
                                        activeOpacity={0.5} style={[styles.btn, {backgroundColor: '#35a5e3'}]}>
                                            <MaterialIcons name="share" size={20} color="#fff" />
                                            <Text style={styles.btnText}>Share</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                </>
                            )}
                        />
                       </>
                    )
            }
        </>
    )
}

export default photoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput:{
        margin: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#00c59f',
        color: '#00c59f',
        fontSize: 15,
        letterSpacing: 1,
        paddingVertical: 5
    },
    imageContainer: {
        marginHorizontal: 10,
        marginTop: 5,
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
    btn : {
        backgroundColor: '#008eb1', 
        padding: 10, 
        alignSelf: 'center', 
        marginBottom: 10, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 15,
        width: '32%',
        justifyContent: 'center'
    },
    btnText: {
        color: '#fff', 
        textAlign: 'center', 
        textTransform: 'uppercase',
        marginLeft: 5
    }
})
