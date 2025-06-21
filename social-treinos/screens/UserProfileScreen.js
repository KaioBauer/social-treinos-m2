import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function UserProfileScreen({ route }) {
    const { userId } = route.params;
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUser(docSnap.data());
            }

            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('userId', '==', userId));
            const querySnap = await getDocs(q);
            const posts = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserPosts(posts);
        };

        loadData();
    }, []);

    if (!user) return <Text style={{ padding: 20 }}>Carregando perfil...</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user.image && <Image source={{ uri: user.image }} style={styles.profileImage} />}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.phone}>{user.phone}</Text>

            <Text style={styles.sectionTitle}>Publicações</Text>

            <View style={styles.grid}>
                {userPosts.map(post => (
                    <Image
                        key={post.id}
                        source={{ uri: post.imageUrl }}
                        style={styles.image}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    email: {
        textAlign: 'center',
        color: '#555',
    },
    phone: {
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
    },
});
