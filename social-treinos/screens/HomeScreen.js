import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { db, auth } from '../firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    getCountFromServer
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const postData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postData);

            const likesMap = {};
            const usersMap = {};

            for (const post of postData) {
                const likeDoc = await getDoc(doc(db, 'posts', post.id, 'likes', userId));
                const likeCountSnap = await getCountFromServer(collection(db, 'posts', post.id, 'likes'));
                likesMap[post.id] = {
                    liked: likeDoc.exists(),
                    count: likeCountSnap.data().count || 0
                };

                if (!usersMap[post.userId]) {
                    const userDoc = await getDoc(doc(db, 'users', post.userId));
                    if (userDoc.exists()) {
                        usersMap[post.userId] = userDoc.data();
                    }
                }
            }

            setLikes(likesMap);
            setUsers(usersMap);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleLike = async (postId) => {
        const likeRef = doc(db, 'posts', postId, 'likes', userId);
        const likeDoc = await getDoc(likeRef);

        if (likeDoc.exists()) {
            await deleteDoc(likeRef);
        } else {
            await setDoc(likeRef, { likedAt: new Date() });
        }
    };

    const handleDelete = async (postId) => {
        Alert.alert('Remover Post', 'Tem certeza que deseja excluir este post?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, 'posts', postId));
                    } catch (err) {
                        console.error('Erro ao deletar post:', err.message);
                        Alert.alert('Erro ao deletar post');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => {
        const user = users[item.userId];
        const isOwner = item.userId === userId;
        const postLikes = likes[item.id] || { liked: false, count: 0 };

        return (
            <View style={styles.post}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}>
                    <Text style={styles.author}>{user ? user.name : 'Usuário'}</Text>
                </TouchableOpacity>

                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.location}><Ionicons name="location-outline" size={14} /> {item.location}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeRow}>
                        <Ionicons
                            name={postLikes.liked ? 'heart' : 'heart-outline'}
                            size={20}
                            color={postLikes.liked ? 'red' : '#888'}
                        />
                        <Text style={styles.likeText}>{postLikes.count}</Text>
                    </TouchableOpacity>
                    {isOwner && (
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        paddingTop: Platform.OS === 'android' ? 35 : 0,
    },
    list: {
        padding: 16
    },
    post: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4
    },
    author: {
        fontWeight: '600',
        color: '#2D49D8',
        fontSize: 16,
        marginBottom: 8
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        marginBottom: 12,
        resizeMode: 'cover'
    },
    description: {
        fontSize: 15,
        color: '#444',
        marginBottom: 4
    },
    location: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    likeText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333'
    }
});
