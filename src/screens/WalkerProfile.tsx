import RN, { View, Text, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const WalkerProfile = () => {

    const navigation = useNavigation()
    const { params: { id, image, name, email, gender, description } }: any = useRoute()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style='dark' />
            <View className='bg-white flex-row items-center p-5' style={{ paddingTop: Platform.OS == 'ios' ? 10 : (RN.StatusBar.currentHeight || 0) + 10 }}>
                <TouchableOpacity onPress={async () => {
                    navigation.goBack()
                }}>
                    <AntDesign name="left" size={22} color="gray" />
                </TouchableOpacity>

                <Text className='flex-1  font-opensans_bold text-lg text-center'>
                    {name}
                </Text>
            </View>

            <Image source={image ? { uri: 'https://btrmjiumfezulcredqlj.supabase.co/storage/v1/object/public/profile-images/' + image } : require('../assets/images/auth-bg.jpg')} className='w-40 h-40 rounded-full mx-auto my-5' />

            <View className='bg-white p-4 m-2 rounded-sm'>

                <View className='pb-2 mb-2 border-b-[1px] border-b-gray-200'>
                    <Text className='font-opensans text-base'>
                        Email
                    </Text>
                    <Text className='font-opensans_bold text-lg'>
                        {email}
                    </Text>
                </View>

                <View className='pb-2 mb-2 border-b-[1px] border-b-gray-200'>
                    <Text className='font-opensans text-base'>
                        Gender
                    </Text>
                    <Text className='font-opensans_bold text-lg'>
                        {gender}
                    </Text>
                </View>

                <View className='pb-2 border-b-gray-200'>
                    <Text className='font-opensans text-base'>
                        Description
                    </Text>
                    <Text className='font-opensans_bold text-lg'>
                        {description}
                    </Text>
                </View>

            </View>


        </SafeAreaView>
    )
}

export default WalkerProfile