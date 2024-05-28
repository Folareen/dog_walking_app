import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import ErrorMsg from './ErrorMsg'
import Spinner from './Spinner'

const MyPosts = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [posts, setPosts] = useState<any>([])

    const { user } = useAuthStore()

    useEffect(() => {

        (async () => {
            try {
                setError('')
                setLoading(true)

                const { data, error } = await supabase
                    .from('posts')
                    .select('*').eq('owner', user?.user?.email)

                if (data) {
                    setPosts(data)
                }

                if (error) {
                    throw new Error(error?.message)
                }
            }
            catch (error: any) {
                setError(error?.message || error)
            } finally {
                setLoading(false)
            }
        })()

    }, [])

    return (
        <View className='flex-1 bg-gray-50'>
            {
                loading ?
                    <Spinner />
                    :
                    error ?
                        <ErrorMsg message={error} />
                        :
                        <ScrollView className=''>
                            {
                                posts.map(({ id, created_at, image, dogName, owner, location, price, duration, description }: any) => (
                                    <View key={id} className='flex-row my-2  mx-1 bg-gray-100 rounded-md' >
                                        <Image source={image ? { uri: 'https://btrmjiumfezulcredqlj.supabase.co/storage/v1/object/public/dog-images/' + image } : require('../assets/images/auth-bg.jpg')} className='h-40 w-40 rounded-t-md' />
                                        <View className='px-2 py-1 flex-1'>
                                            <View>
                                                <View className='flex-row justify-between'>
                                                    <Text className='font-roboto text-lg capitalize'>
                                                        {dogName}
                                                    </Text>
                                                    <Text className='font-roboto text-lg'>
                                                        ${price}
                                                    </Text>
                                                </View>
                                                <Text className='font-roboto text-gray-700'>
                                                    {location}
                                                </Text>
                                            </View>

                                            <Text className='font-roboto text-gray-700 text-xs my-0.5'>
                                                {description}
                                            </Text>

                                            <Text className='font-roboto mt-auto text-sm text-gray-700'>
                                                {duration} minutes
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </ScrollView>

            }

        </View>
    )
}

export default MyPosts