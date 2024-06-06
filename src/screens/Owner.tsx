import { MaterialIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import RN, { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import MyPosts from '../components/MyPosts'
import NewPost from '../components/NewPost'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import toast from '../utils/toast'
import DogWalkers from '../components/DogWalkers'

const Owner = () => {
    const [activeTab, setActiveTab] = useState('posts')
    const [activePostTab, setActivePostTab] = useState('vacant')
    const { user, setUser } = useAuthStore()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style='dark' />
            <View className='bg-white flex-row items-center p-5 shadow-xl border-b-2 border-gray-200' style={{ paddingTop: Platform.OS == 'ios' ? 10 : (RN.StatusBar.currentHeight || 0) + 10 }}>
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

            <View className='flex-row justify-center mb-2 mt-[2px]'>
                <TouchableOpacity onPress={() => {
                    setActiveTab('posts')
                }} className={`flex-1 p-4 ${activeTab == 'posts' ? 'bg-blue-950 ' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'posts' ? 'text-white ' : ''} font-roboto text-center `}>
                        Posts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setActiveTab('dog-walkers')
                }} className={`flex-1 p-4  ${activeTab == 'dog-walkers' ? ' bg-blue-950' : 'bg-white'}`}>
                    <Text className={`${activeTab == 'dog-walkers' ? 'text-white' : 'text-blue-950'} font-roboto text-center`}>
                        Dog Walkers
                    </Text>
                </TouchableOpacity>
            </View>

            {
                activeTab == 'posts' ?
                    <>
                        <View className='flex-row justify-center mb-2 '>
                            <TouchableOpacity onPress={() => {
                                setActivePostTab('vacant')
                            }} className={`flex-1 py-2 ${activePostTab == 'vacant' ? ' bg-blue-950' : 'bg-white'}`}>
                                <Text className={`${activePostTab == 'vacant' ? 'text-white ' : 'text-blue-950'} font-roboto text-center `}>
                                    Vacant
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setActivePostTab('pending')
                            }} className={`flex-1 py-2 ${activePostTab == 'pending' ? ' bg-blue-950 ' : 'bg-white'}`}>
                                <Text className={`${activePostTab == 'pending' ? 'text-white ' : 'text-blue-950'} font-roboto text-center `}>
                                    Pending
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setActivePostTab('approved')
                            }} className={`flex-1 py-2 ${activePostTab == 'approved' ? ' bg-blue-950 ' : 'bg-white'}`}>
                                <Text className={`${activePostTab == 'approved' ? 'text-white ' : 'text-blue-950'} font-roboto text-center `}>
                                    Approved
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setActivePostTab('new-post')
                            }} className={`flex-1 py-2 ${activePostTab == 'new-post' ? ' bg-blue-950 ' : 'bg-white'}`}>
                                <Text className={`${activePostTab == 'new-post' ? 'text-white ' : 'text-blue-950'} font-roboto text-center `}>
                                    New Post
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {
                            activePostTab.includes('post') ?
                                <NewPost setActiveTab={setActiveTab} />
                                :
                                <MyPosts activeTab={activePostTab} setActiveTab={setActivePostTab} />
                        }
                    </>
                    :
                    <DogWalkers />
            }


        </SafeAreaView>
    )
}

export default Owner