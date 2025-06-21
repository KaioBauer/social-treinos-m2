import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function CreatePostScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [locationText, setLocationText] = useState('');

    const pickImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        } else {
            Alert.alert('Erro', 'Nenhuma imagem foi selecionada.');
        }
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Ative o acesso à localização');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(loc.coords);

        if (address.length > 0) {
            const { street, city } = address[0];
            setLocationText(`${street}, ${city}`);
        }
    };

    const uploadPost = async () => {
        if (!image || !description || !locationText) {
            Alert.alert('Preencha todos os campos antes de publicar.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('photo', {
                uri: image,
                name: `${Date.now()}.jpg`,
                type: 'image/jpeg',
            });

            const localServerURL = process.env.EXPO_PUBLIC_API_IP;

            const uploadResponse = await fetch(localServerURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error('Erro ao fazer upload da imagem');
            }

            const downloadURL = uploadData.url;

            await addDoc(collection(db, 'posts'), {
                imageUrl: downloadURL,
                description,
                location: locationText,
                createdAt: serverTimestamp(),
                userId: auth.currentUser.uid,
            });

            Alert.alert('Publicado com sucesso!');
            navigation.goBack();
        } catch (err) {
            console.log('❌ Erro ao publicar:', err.message);
            Alert.alert('Erro ao publicar', err.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>📸 Toque para tirar uma foto</Text>
                    )}
                </TouchableOpacity>

                <TextInput
                    placeholder="Escreva uma legenda..."
                    placeholderTextColor="#888"
                    style={styles.input}
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
                    <Text style={styles.locationButtonText}>📍 Detectar Localização</Text>
                </TouchableOpacity>

                {locationText !== '' && (
                    <Text style={styles.locationText}>📌 {locationText}</Text>
                )}

                <TouchableOpacity style={styles.shareButton} onPress={uploadPost}>
                    <Text style={styles.shareButtonText}>Compartilhar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
    },
    imagePicker: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        fontSize: 16,
        color: '#888',
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        paddingVertical: 8,
        marginBottom: 20,
        color: '#333',
    },
    locationButton: {
        backgroundColor: '#eee',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginBottom: 10,
    },
    locationButtonText: {
        color: '#2D49D8',
        fontWeight: 'bold',
        fontSize: 15,
    },
    locationText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    shareButton: {
        backgroundColor: '#2D49D8',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
