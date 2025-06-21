import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { PrimaryButton } from '../components/Buttons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const resetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    return (
        <LinearGradient colors={['#842C9C', '#2D49D8']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.title}>Recuperar Senha</Text>

                <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#ccc"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <PrimaryButton text="Enviar link de recuperação" action={resetPassword} />
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25
    },
    title: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30
    },
    input: {
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 15,
        fontSize: 18,
        marginBottom: 20,
        color: '#000'
    }
});
