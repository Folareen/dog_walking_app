import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../supabase'
import toast from '../utils/toast'
import * as ImagePicker from 'expo-image-picker'
import { AntDesign } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const Signup = () => {
    const [image, setImage] = useState<any>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [gender, setGender] = useState('')
    const [description, setDescription] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const { navigate } = useNavigation()


    const handleSignup = async () => {
        try {
            setSubmitting(true)

            if (!name || !email || !password || !role) {
                throw new Error('All fields are required!')
            }

            if (role == 'owner') {
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

            } else if (role == 'walker') {

                if (!image || !gender || !description) {
                    throw new Error('All fields are required!')
                }

                const formData = new FormData();
                const file = {
                    uri: image.uri as string,
                    name: `${new Date().getTime()}` as string,
                    type: 'image/png'
                }
                formData.append('image', file)
                const imageUpload = await supabase
                    .storage
                    .from('profile-images')
                    .upload(email + '/' + uuidv4(), formData, {
                        cacheControl: '3600',
                        upsert: false
                    })
                if (imageUpload.error) {
                    throw new Error(imageUpload.error?.message)
                }
                const imageUrl = imageUpload.data ? imageUpload.data.path : null

                const walkers = await supabase
                    .from('walkers')
                    .insert([
                        { image: imageUrl, name, email, gender, description }
                    ])

                if (walkers?.error) {
                    throw walkers?.error
                }

                const { data, error } = await supabase.auth.signUp(
                    {
                        email,
                        password,
                        options: {
                            data: {
                                name,
                                role,
                                image: imageUrl,
                                gender: gender,
                                description
                            }
                        }
                    }
                )
                if (error) {
                    await supabase
                        .from('walkers')
                        .delete().eq('email', email)
                    throw error
                }

            }

        } catch (error: any) {
            toast(error?.message, 'error', 'long')
        } finally {
            setSubmitting(false)
        }
    }

    const launchPicker = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error: any) {
            toast(error?.message || error, 'error', 'long')
        }
    };

    return (
        <ImageBackground source={require('../assets/images/auth-bg.jpg')} className='flex-1  relative'>
            <StatusBar style='light' />
            <View className=' h-full w-full z-10 absolute top-0 left-0 bottom-0 right-0 items-center justify-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className='w-4/5 '>
                    <Text className='text-white text-4xl mb-6 font-opensans_bold text-center '>Welcome!</Text>

                    <View className='flex-row justify-between mb-4'>
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

                    {
                        role == 'walker' &&
                        <View className='mb-5'>
                            {
                                image ?
                                    <View className="w-full flex-row p-4 justify-center  space-x-2">
                                        <Image source={{ uri: image.uri }} className="h-28 w-28 object-contain" />
                                        <TouchableOpacity className="mr-10 self-start" onPress={() => {
                                            setImage(null)
                                        }}>
                                            <AntDesign name="delete" size={30} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={launchPicker} className='w-28 h-28 bg-white rounded-lg mx-auto items-center justify-center' >
                                        <Text className='text-sm text-gray-400 '>
                                            Profile Picture
                                        </Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    }


                    <TextInput placeholder='Name' className='px-4 py-2.5 bg-white rounded-lg font-roboto' value={name} onChangeText={(text) => {
                        setName(text)
                    }} />
                    <TextInput placeholder='Email Address' className='px-4 py-2.5 bg-white rounded-lg font-roboto mt-4' value={email} onChangeText={(text) => {
                        setEmail(text)
                    }} />
                    <TextInput placeholder='Password' className='px-4 py-2.5 bg-white rounded-lg font-roboto mt-4' secureTextEntry={true} value={password} onChangeText={(text) => {
                        setPassword(text)
                    }} />

                    {
                        role == 'walker'
                        &&
                        <>
                            <View className='bg-white rounded-lg mt-4'>
                                <RNPickerSelect
                                    onValueChange={(value) => setGender(value)}
                                    value={gender}
                                    items={[
                                        { label: 'Male', value: 'Male' },
                                        { label: 'Female', value: 'Female' },
                                    ]}
                                    style={{ placeholder: { color: 'gray' }, }}
                                    placeholder={{ label: 'Gender', }}
                                />
                            </View>

                            <TextInput placeholder='Profile Description' value={description} onChangeText={(text) => {
                                if (description.length > 150) {
                                    toast('Maximum length is 150!', 'error', 'long')
                                } else {
                                    setDescription(text)
                                }
                            }} className='px-4 py-3 bg-white rounded-lg font-roboto mt-5' multiline numberOfLines={4} textAlignVertical='top' />
                        </>

                    }


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