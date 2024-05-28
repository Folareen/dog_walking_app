import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../supabase'
import toast from '../utils/toast'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const { navigate } = useNavigation()


    const handleSignup = async () => {
        try {
            setSubmitting(true)

            const { data, error } = await supabase.auth.signUp(
                {
                    email,
                    password,
                    options: {
                        data: {
                            name,
                            role,
                        }
                    }
                }
            )

            if (error) throw error

            toast('Please check your inbox for email verification!', 'success', 'long')
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
                    <Text className='text-white text-4xl mb-6 font-opensans_bold text-center '>Welcome!</Text>

                    <TextInput placeholder='Name' className='px-4 py-2.5 bg-white rounded-lg font-roboto' value={name} onChangeText={(text) => {
                        setName(text)
                    }} />
                    <TextInput placeholder='Email Address' className='px-4 py-2.5 bg-white rounded-lg font-roboto mt-4' value={email} onChangeText={(text) => {
                        setEmail(text)
                    }} />
                    <TextInput placeholder='Password' className='px-4 py-2.5 bg-white rounded-lg font-roboto mt-4' secureTextEntry={true} value={password} onChangeText={(text) => {
                        setPassword(text)
                    }} />

                    <View className='flex-row justify-between mt-4'>
                        <TouchableOpacity onPress={() => {
                            setRole('owner')
                        }} className={`w-[48%] p-4 rounded-md ${role == 'owner' ? 'bg-blue-950' : 'bg-white'}`}>
                            <Text className={`${role == 'owner' ? 'text-white' : 'text-blue-950'} font-roboto text-center`}>
                                Dog Owner
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setRole('walker')
                        }} className={`w-[48%] p-4 rounded-md ${role == 'walker' ? 'bg-blue-950' : 'bg-white'}`}>
                            <Text className={`${role == 'walker' ? 'text-white' : 'text-blue-950'} font-roboto text-center`}>
                                Dog Walker
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleSignup} className={`p-4 mt-6 bg-blue-800 rounded-lg shadow-xl ${submitting ? 'opacity-50' : 'opacity-100'} `} disabled={submitting}>
                        <Text className='text-white font-roboto text-center text-base'>
                            {
                                submitting ?
                                    'Submitting...'
                                    :
                                    'Signup'
                            }
                        </Text>
                    </TouchableOpacity>

                    <View className='flex-row mt-2 justify-center'>
                        <Text className='text-gray-200 mr-0.5 text-base'>
                            Have an account?
                        </Text>
                        <TouchableOpacity className='' onPress={() => {
                            navigate('login')
                        }}>
                            <Text className='text-blue-200 font-roboto text-base'>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ImageBackground>
    )
}

export default Signup