import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function PrimaryButton({ action, text }) {
    return (
        <TouchableOpacity onPress={action} style={styles.primaryButton}>
            <Text style={styles.primaryText}>{text}</Text>
        </TouchableOpacity>
    );
}

export function SecondaryButton({ action, text }) {
    return (
        <TouchableOpacity onPress={action} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{text}</Text>
        </TouchableOpacity>
    );
}

export function DangerButton({ action, text }) {
    return (
        <TouchableOpacity onPress={action} style={styles.dangerButton}>
            <Text style={styles.dangerText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: '#4C3AFF', // azul violeta
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
        elevation: 2,
    },
    primaryText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#4C3AFF',
    },
    secondaryText: {
        color: '#4C3AFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    dangerButton: {
        backgroundColor: '#FF4B4B',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
    },
    dangerText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    }
});
