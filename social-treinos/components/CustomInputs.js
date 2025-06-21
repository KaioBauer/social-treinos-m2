
import { TextInput, StyleSheet } from "react-native";

export function EmailInput({ placeholder = "E-mail", value, setValue }) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="white"
            style={styles.input}
            inputMode="email"
            autoCapitalize="none"
            onChangeText={setValue}
            value={value}
        />
    )
}

export function PasswordInput({ placeholder = "Senha", value, setValue }) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="white"
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={setValue}
            value={value}
        />
    )
}

export function CustomTextInput({ placeholder, value, setValue }) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="white"
            style={styles.input}
            onChangeText={setValue}
            value={value}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 18,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 10
    },
});