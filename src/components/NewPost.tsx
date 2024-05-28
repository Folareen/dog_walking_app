import { AntDesign } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import toast from '../utils/toast'

type Props = {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const NewPost = ({ setActiveTab }: Props) => {
    const { user } = useAuthStore()

    const [image, setImage] = useState<any>(null)
    const [dogName, setDogName] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState<string | number>('')
    const [duration, setDuration] = useState<string | number>('')

    const [submitting, setSubmitting] = useState(false)

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


    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            if (!dogName || !location || !price || !duration) {
                throw new Error('Post details cannot be empty')
            }

            const formData = new FormData();
            const file = {
                uri: image.uri as string,
                name: `${new Date().getTime()}` as string,
                type: 'image/png'
            }
            formData.append('image', file)
            const { data, error } = await supabase
                .storage
                .from('dog-images')
                .upload(dogName.split(' ').join('-') + '/' + uuidv4(), formData, {
                    cacheControl: '3600',
                    upsert: false
                })
            if (error) {
                throw new Error(error?.message)
            }
            const imageUrl = data ? data.path : null
            const posts = await supabase
                .from('posts')
                .insert([
                    { owner: user?.user?.email, image: imageUrl, dogName, description, location, price, duration }
                ])
            if (posts?.error) {
                throw new Error(posts?.error?.message)
            }

            toast('Post added', 'success', 'short')
            setActiveTab('my-posts')
        } catch (error: any) {
            toast(error?.message || error || (error && JSON.stringify(error)) || 'Failed to create new post', 'error', 'long')
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <View className='flex-1 p-5'>

            <ScrollView className=' mb-4'>

                <View className='mb-5'>
                    {
                        image ?
                            <View className="w-full flex-row justify-between items-center p-4">
                                <Image source={{ uri: image.uri }} className="h-40 w-40 object-contain" />
                                <TouchableOpacity className="pr-10" onPress={() => {
                                    setImage(null)
                                }}>
                                    <AntDesign name="delete" size={30} color="red" />
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity onPress={launchPicker} className='p-4 bg-white rounded-lg  ' >
                                <Text className='text-sm text-gray-400 '>
                                    Dog Image
                                </Text>
                            </TouchableOpacity>
                    }
                </View>

                <TextInput placeholder='Dog Name' value={dogName} onChangeText={(text) => {
                    setDogName(text)
                }} className='px-4 py-3 bg-white rounded-lg font-roboto ' />

                <TextInput placeholder='Dog Description' value={description} onChangeText={(text) => {
                    if (description.length > 150) {
                        toast('Maximum length is 150!', 'error', 'long')
                    } else {
                        setDescription(text)
                    }
                }} className='px-4 py-3 bg-white rounded-lg font-roboto mt-5' multiline numberOfLines={4} textAlignVertical='top' />

                <TextInput placeholder='Location' value={location} onChangeText={(text) => {
                    setLocation(text)
                }} className='px-4 py-3 bg-white rounded-lg font-roboto mt-5' />

                <TextInput placeholder='Price($)' value={String(price)} onChangeText={(text) => {
                    setPrice(Number(text))
                }} keyboardType='numeric' className='px-4 py-3 bg-white rounded-lg font-roboto mt-5' />

                <TextInput placeholder='Duration in minutes' value={String(duration)} onChangeText={(text) => {
                    setDuration(Number(text))
                }} keyboardType='numeric' className='px-4 py-3 bg-white rounded-lg font-roboto mt-5' />

                <TouchableOpacity onPress={handleSubmit} className={`p-4 mt-6 bg-blue-900 rounded-lg shadow-xl ${submitting ? 'opacity-50' : 'opacity-100'} `} disabled={submitting}>
                    <Text className='text-white font-roboto text-center text-base'>
                        {
                            submitting ?
                                'Submitting...'
                                :
                                'Submit'
                        }
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    )
}

export default NewPost