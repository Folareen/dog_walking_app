import { View, Text, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../supabase'
import toast from '../utils/toast'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const { navigate } = useNavigation()

    const handleLogin = async () => {
        try {
            setSubmitting(true)
            const {
                data,
                error,
            } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
        } catch (error: any) {
            toast(error?.message, 'error', 'long')
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <ImageBackground source={require('../assets/images/auth-bg.jpg')} className='flex-1  relative'>
            <StatusBar style='light' />
            <View className=' h-full w-full z-10 absolute top-0 left-0 bottom-0 right-0 items-center justify-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className='w-4/5 '>
                    <Text className='text-white text-4xl mb-6 font-opensans_bold text-center'>Welcome Back!</Text>

                    <TextInput placeholder='Email Address' className='px-4 py-2.5 bg-white rounded-lg font-semibold mt-4' value={email} onChangeText={(text) => {
                        setEmail(text)
                    }} />
                    <TextInput placeholder='Password' className='px-4 py-2.5 bg-white rounded-lg font-semibold mt-4' secureTextEntry={true} value={password} onChangeText={(text) => {
                        setPassword(text)
                    }} />

                    <TouchableOpacity onPress={handleLogin} className={`p-4 mt-6 bg-blue-800 rounded-lg shadow-xl ${submitting ? 'opacity-50' : 'opacity-100'} `} disabled={submitting}>
                        <Text className='text-white font-roboto text-center text-base'>
                            {
                                submitting ?
                                    'Submitting...'
                                    :
                                    'Login'
                            }
                        </Text>
                    </TouchableOpacity>

                    <View className='flex-row mt-2 justify-center'>
                        <Text className='text-gray-200 mr-0.5 text-base'>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity className='' onPress={() => {
                            navigate('signup')
                        }}>
                            <Text className='text-blue-200 font-roboto text-base'>
                                Create one
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ImageBackground>
    )
}

export default Login