import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import toast from '../utils/toast'

type Props = {
    id: string,
    dogImage: string,
    dogName: string,
    ownerName: string,
    price: number,
    location: string,
    duration: string,
    description: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const Gig = ({ id, dogImage, dogName, ownerName, price, location, duration, description, setActiveTab }: Props) => {
    const { user } = useAuthStore()

    const handleApply = async () => {
        try {
            toast('Applying...Please wait', 'info', 'long')
            const { data, error } = await supabase
                .from('posts')
                .update({ walker: user?.user?.email })
                .eq('owner', ownerName).eq('id', id).select();
            setActiveTab('my-gigs')
            toast('Application Successful', 'success', 'long')
        } catch (error: any) {
            toast(error?.message || error, 'error', 'long')
        }
    }

    return (
        <View key={id} className='flex-row my-3  mx-1 bg-gray-100 rounded-md' >
            <View>
                <Image source={dogImage ? { uri: 'https://btrmjiumfezulcredqlj.supabase.co/storage/v1/object/public/dog-images/' + dogImage } : require('../assets/images/auth-bg.jpg')} className='h-36 w-36 rounded-t-md' />
                <Text className='font-roboto text-sm capitalize p-1 text-center text-white bg-gray-400'>
                    {dogName}
                </Text>
            </View>
            <View className='px-2 py-1 flex-1'>
                <View>
                    <View className='flex-row justify-between'>
                        <Text className='font-roboto_bold text-md '>
                            {ownerName}
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

                <View className='flex-row justify-between mt-auto'>
                    <Text className='font-roboto mt-auto text-sm text-gray-700'>
                        {duration} minutes
                    </Text>
                    <TouchableOpacity className='bg-blue-900 px-2 py-1 rounded-md' onPress={handleApply}>
                        <Text className='text-white font-roboto text-xs'>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default Gig



