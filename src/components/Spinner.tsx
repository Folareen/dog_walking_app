import { useEffect, useState } from "react";
import { Animated, Easing, View } from "react-native";

const Spinner = ({ withContainer = true }: { withContainer?: boolean }) => {
    const [spinValue, setSpinValue] = useState(new Animated.Value(0));

    useEffect(() => {
        const spinAnimation = Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        });

        const loop = Animated.loop(spinAnimation, { iterations: -1 });

        loop.start();

        return () => {
            loop.stop();
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View className={`${withContainer ? 'flex-1 justify-center items-center' : ''}`}>
            <Animated.View
                style={{
                    transform: [{ rotate: spin }],
                }} className={`border-solid border-blue-900 border-r-white  border-8 rounded-full  h-12 w-12 `}>
            </Animated.View>
        </View>

    )
}

export default Spinner;