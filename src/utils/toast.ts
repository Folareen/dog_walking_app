import Toast from "react-native-root-toast"

export default (message: string, type: 'success' | 'error' | 'info', duration: 'long' | 'short') => {
    Toast.show(message, { position: 40, backgroundColor: type == 'success' ? 'green' : type == 'error' ? 'brown' : type == 'info' ? '#FF8000' : 'black', duration: duration == 'long' ? Toast.durations.LONG : Toast.durations.SHORT, shadow: true, animation: true, hideOnPress: true })
}