import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import RN, { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import AvailableGigs from '../components/AvailableGigs'
import MyGigs from '../components/MyGigs'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import toast from '../utils/toast'

const Walker = () => {
    const [activeTab, setActiveTab] = useState('my-gigs')
    const { user, setUser } = useAuthStore()

    const { navigate } = useNavigation()

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS == 'ios' ? 0 : RN.StatusBar.currentHeight, flex: 1 }}>
            <StatusBar style='dark' />
            <View className='bg-white flex-row items-center p-4 shadow-md'>
                <Text className='flex-1  font-opensans text-lg'>
                    Welcome, <Text className='font-opensans_bold capitalize'>{user?.user?.user_metadata?.name}</Text>
                </Text>
                <TouchableOpacity onPress={async () => {
                    try {
                        await supabase.auth.signOut()
                        toast('Logged out!', 'info', 'short')
                    } catch (error: any) {
                        toast(error?.message, 'error', 'long')
                    }
                }}>
                    <MaterialIcons name="logout" size={24} color="red" />
                </TouchableOpacity>
            </View>

            <View className='flex-row justify-center my-4 '>
                <TouchableOpacity onPress={() => {
                    setActiveTab('my-gigs')
                }} className={`w-[48%] p-4 ${activeTab == 'my-gigs' ? 'bg-blue-950 rounded-md ' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'my-gigs' ? 'text-white ' : ''} font-roboto text-center `}>
                        My Gigs
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setActiveTab('available-gigs')
                }} className={`w-[48%] p-4  ${activeTab == 'available-gigs' ? ' bg-blue-950 rounded-md' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'available-gigs' ? 'text-white' : 'text-blue-950'} font-roboto text-center`}>
                        Available Gigs
                    </Text>
                </TouchableOpacity>
            </View>

            {
                activeTab == 'my-gigs' ?
                    <MyGigs />
                    :
                    <AvailableGigs setActiveTab={setActiveTab} />
            }

        </SafeAreaView>
    )
}

export default Walker