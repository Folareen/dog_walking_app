import { MaterialIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import RN, { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import MyPosts from '../components/MyPosts'
import NewPost from '../components/NewPost'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import toast from '../utils/toast'

const Owner = () => {
    const [activeTab, setActiveTab] = useState('my-posts')
    const { user, setUser } = useAuthStore()

    const handleSubmit = () => {
        toast('Success!', 'success', 'long')
    }
    return (
        <SafeAreaView style={{ paddingTop: Platform.OS == 'ios' ? 0 : RN.StatusBar.currentHeight, flex: 1 }}>
            <StatusBar style='dark' />
            <View className='bg-white flex-row items-center p-5'>
                <Text className='flex-1  font-opensans text-lg'>
                    Welcome, <Text className='font-opensans_bold capitalize'>{user?.user?.user_metadata?.name}</Text>                </Text>
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
                    setActiveTab('my-posts')
                }} className={`w-[48%] p-4 ${activeTab == 'my-posts' ? 'bg-blue-950 rounded-md ' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'my-posts' ? 'text-white ' : ''} font-roboto text-center `}>
                        My Posts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setActiveTab('new-post')
                }} className={`w-[48%] p-4  ${activeTab == 'new-post' ? ' bg-blue-950 rounded-md' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'new-post' ? 'text-white' : 'text-blue-950'} font-roboto text-center`}>
                        New Post
                    </Text>
                </TouchableOpacity>
            </View>

            {
                activeTab == 'my-posts' ?
                    <MyPosts />
                    :
                    <NewPost setActiveTab={setActiveTab} />
            }

        </SafeAreaView>
    )
}

export default Owner