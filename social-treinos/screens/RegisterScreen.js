import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmailInput, PasswordInput } from '../components/CustomInputs';
import { collection, setDoc, doc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
    const navigation = useNavigation();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const register = async () => {
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

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    name: '',
                    phone: '',
                    image: ''
                });

                navigation.replace('Home');
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    useEffect(() => {
        setErrorMessage('');
    }, [email, password]);

    return (
        <LinearGradient
            colors={['#842C9C', '#2D49D8']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <Text style={styles.title}>Registrar-se</Text>
                    <EmailInput value={email} setValue={setEmail} />
                    <PasswordInput value={password} setValue={setPassword} />

                    {errorMessage &&
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    }

                    <PrimaryButton text={"Registrar-se"} action={register} />

                    <Text style={styles.text}>Já tem uma conta?</Text>

                    <SecondaryButton text={'Voltar para Login'} action={() => navigation.goBack()} />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 30
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#ffcccc',
        marginVertical: 10
    },
    text: {
        textAlign: 'center',
        color: '#eee',
        marginTop: 15
    }
});
