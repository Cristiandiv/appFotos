import { useEffect, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text, SafeAreaView }from 'react-native';
import { getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage, firebd} from '../Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";

export default function Home (){

    const [img, setImg] = useState('');
    const [file, siteFile] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebd, 'fotosLegais'), (snapshot)=>{
            snapshot.docChanges().forEach((change) => {
                if(change.type === "added"){
                    siteFile((prevfiles) => [...prevfiles, change.doc.data()]);
                }
            });
        });

    return () => unsubscribe();
}, []);

async function uploadImage(uri, fileType){
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, new Date().toISOString());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
        "state_changed",
        (error) => {
            console.error(error);
        },

        async() => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await saveRecord(fileType, downloadURL, new Date().toISOString());
                setImg('');
            });
        };

async function saveRecord(fileType, url, createAt){
    try{
        const docRef = await addDoc(collection,(firebd,'fotosLegais'),{
            fileType,
            url,
            createAt
        })
    }
    catch(e){
        console.log(e);
    }
}


async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        const { uri } = result.assets[0];
      setImg(uri);
      await uploadImage(uri, "image")
    }
  };

return (
    <View style={style.container}>
        <Text style={style.title}> Mis fotos </Text>

        <FlatList 
        data={file}
        keyExtractor={(item) => item.url}
        renderItem={({item}) => {
            if(item.fileType === "image"){
                return(
                    <Image 
                    source={{uri:item.url}}
                    style={style.fotos}
                    />
                )
            }
        }
        
        }

        numColumns={2}
        
        />

        <TouchableOpacity
        onPress={pickImage}
        style={style.imgpick}
        >
            
            <Text> Images </Text>
        </TouchableOpacity>

    </View>
)


};

const style = StyleSheet.create({

    container: {
        paddingVertical: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    fotos: {
        width: 200,
        height: 200
    },

    title:{
        fontSize: 35
    },

    imgpick:{
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },

});