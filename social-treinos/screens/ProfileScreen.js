import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const uid = auth.currentUser.uid;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userRef = doc(db, 'users', uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }

                const postsRef = collection(db, 'posts');
                const q = query(postsRef, where('userId', '==', uid));
                const postSnap = await getDocs(q);
                const posts = postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserPosts(posts);
            } catch (error) {
                console.log('Erro ao carregar perfil:', error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const logout = () => signOut(auth);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D49D8" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {userData && (
                <>
                    <Image
                        source={{ uri: userData.image || 'https://via.placeholder.com/120' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userData.name}</Text>
                    <Text style={styles.email}>{userData.email}</Text>
                    <Text style={styles.phone}>{userData.phone}</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.editButton]}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.buttonText}>Editar Perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.logoutButton]}
                            onPress={logout}
                        >
                            <Text style={styles.buttonText}>Sair</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Minhas Postagens</Text>
                    <FlatList
                        data={userPosts}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
                        )}
                        contentContainerStyle={styles.gallery}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    phone: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    editButton: {
        backgroundColor: '#2D49D8',
    },
    logoutButton: {
        backgroundColor: '#842C9C',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gallery: {
        gap: 4,
    },
    postImage: {
        width: '32%',
        aspectRatio: 1,
        marginBottom: 6,
        borderRadius: 8,
    },
});
