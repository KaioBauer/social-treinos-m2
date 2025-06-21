import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || '');
                    setPhone(data.phone || '');
                    setImage(data.image || null);
                }
            } catch (e) {
                Alert.alert('Erro ao carregar perfil');
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageChanged(true);
        }
    };

    const uploadImageToServer = async () => {
        const formData = new FormData();
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('photo', {
            uri: image,
            name: filename,
            type,
        });

        const serverUrl = process.env.EXPO_PUBLIC_API_IP;

        const response = await fetch(serverUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = await response.json();
        return data.url;
    };

    const saveProfile = async () => {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            let imageUrl = image;

            if (imageChanged && image) {
                imageUrl = await uploadImageToServer();
            }

            await updateDoc(docRef, {
                name,
                phone,
                image: imageUrl,
            });

            Alert.alert('Perfil atualizado com sucesso!');
            navigation.goBack();
        } catch (e) {
            console.error('Erro ao salvar perfil:', e);
            Alert.alert('Erro ao salvar perfil');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D49D8" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Editar Perfil</Text>

                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={{ uri: image || 'https://via.placeholder.com/100' }}
                        style={styles.image}
                    />
                    <Text style={styles.changePhoto}>📷 Alterar foto de perfil</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor="#888"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                    <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 16,
        paddingVertical: 10,
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 10,
    },
    changePhoto: {
        color: '#2D49D8',
        textAlign: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#2D49D8',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
