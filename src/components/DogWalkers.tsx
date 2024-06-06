import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import ErrorMsg from './ErrorMsg'
import Spinner from './Spinner'
import { useNavigation } from '@react-navigation/native'

const DogWalkers = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [walkers, setWalkers] = useState<any>([])

    const { user } = useAuthStore()

    const navigation = useNavigation()

    useEffect(() => {

        (async () => {
            try {
                setError('')
                setLoading(true)

                const { data, error } = await supabase
                    .from('walkers')
                    .select('*')

                if (data) {
                    setWalkers(data)
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
                                walkers.map(({ id, image, name, email, gender, description }: any) => (
                                    <TouchableOpacity key={id} className='flex-row my-2  mx-1 bg-gray-100 rounded-md' onPress={() => {
                                        navigation.navigate('walker-profile', { id, image, name, email, gender, description })
                                    }}>
                                        <View>
                                            <Image source={image ? { uri: 'https://btrmjiumfezulcredqlj.supabase.co/storage/v1/object/public/profile-images/' + image } : require('../assets/images/auth-bg.jpg')} className='h-36 w-36 rounded-t-md' />
                                        </View>
                                        <View className='px-2 py-1 flex-1'>
                                            <View>
                                                <Text className='font-roboto_bold text-base '>
                                                    {name}
                                                </Text>
                                                <Text className='font-roboto_bold text-gray-600 text-base'>
                                                    {email}
                                                </Text>
                                            </View>
                                            <Text className='font-roboto  text-sm my-1.5 '>
                                                {gender}
                                            </Text>

                                            <Text className='font-roboto text-gray-700 text-xs my-0.5 '>
                                                {description}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>

            }

        </View>
    )
}

export default DogWalkers