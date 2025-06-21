import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmailInput, PasswordInput } from '../components/CustomInputs';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
    const navigation = useNavigation();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const login = async () => {
        if (!email || !password) {
            setErrorMessage('Informe o e-mail e senha.');
            return;
        }
        if (!regexEmail.test(email)) {
            setErrorMessage('E-mail inválido');
            return;
        }
        if (!regexPassword.test(password)) {
            setErrorMessage('A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo');
            return;
        }

        setErrorMessage('');
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log(userCredentials.user);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }

    useEffect(() => {
        setErrorMessage('');
    }, [email, password]);

    return (
        <LinearGradient
            colors={['#842C9C', '#2D49D8']}
            style={styles.gradient}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                    <Text style={styles.title}>TraInApp</Text>

                    <EmailInput value={email} setValue={setEmail} />
                    <PasswordInput value={password} setValue={setPassword} />

                    <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>

                    {errorMessage &&
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    }

                    <PrimaryButton text={'Login'} action={login} />

                    <Text style={styles.text}>Ainda não tem uma conta?</Text>

                    <SecondaryButton text={'Registrar-se'} action={() => navigation.push('Register')} />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 50,
        fontFamily: 'System',
        letterSpacing: 1,
    },
    errorMessage: {
        fontSize: 15,
        textAlign: 'center',
        color: '#FF7F7F',
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff2f2',
        borderRadius: 8,
        paddingVertical: 8,
    },
    text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        marginTop: 24,
    },
    linkText: {
        textAlign: 'right',
        color: '#cfcfff',
        marginTop: 12,
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});
