import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import ErrorMsg from './ErrorMsg'
import Spinner from './Spinner'
import toast from '../utils/toast'

type Props = {
    activeTab: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const MyPosts = ({ activeTab, setActiveTab }: Props) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [posts, setPosts] = useState<any>([])

    const { user } = useAuthStore()

    const handleAction = async (action: string, id: number) => {
        try {
            toast(action == 'approve' ? 'Approving...Please wait' : 'Rejecting...Please wait', 'info', 'long')
            const { data, error } = await supabase
                .from('posts')
                .update({ walker: action == 'approve' ? user?.user?.email : '', approved: action == 'approve' ? true : false })
                .eq('id', id).select();
            setActiveTab(action == 'approve' ? 'approved' : 'vacant')
            toast('Application Successful', 'success', 'long')
        } catch (error: any) {
            toast(error?.message || error, 'error', 'long')
        }
    }

    useEffect(() => {

        (async () => {
            try {
                setError('')
                setLoading(true)

                let res = null

                switch (activeTab) {
                    case 'vacant':
                        res = await supabase
                            .from('posts')
                            .select('*').eq('owner', user?.user?.email).eq('walker', '')
                        break;
                    case 'pending':
                        res = await supabase
                            .from('posts')
                            .select('*').eq('owner', user?.user?.email).neq('walker', '').eq('approved', false)
                        break;
                    case 'approved':
                        res = await supabase
                            .from('posts')
                            .select('*').eq('owner', user?.user?.email).neq('walker', '').eq('approved', true)
                        break;
                    default:
                        break;
                }

                if (res?.data) {
                    setPosts(res.data)
                }

                if (res?.error) {
                    throw res.error
                }
            }
            catch (error: any) {
                setError(error?.message || error)
            } finally {
                setLoading(false)
            }
        })()

    }, [activeTab])

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
                                posts.map(({ id, created_at, image, dogName, owner, location, price, duration, description, walker }: any) => (
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
                                                {
                                                    (activeTab == 'approved' || activeTab == 'pending')
                                                        ?
                                                        `${description.length > 50 ? `${description?.substr(0, 50)}...` : description}`
                                                        :
                                                        `${description}`
                                                }
                                            </Text>

                                            <Text className='font-roboto mt-auto text-sm text-gray-700'>
                                                {duration} minutes
                                            </Text>

                                            {
                                                activeTab == 'approved' ?
                                                    <View className='border-t-[0.5px] border-gray-300 flex-row space-x-2 flex-wrap mt-1.5'>
                                                        <Text className='font-roboto_bold mt-auto text-sm text-gray-700'>
                                                            {walker}
                                                        </Text>
                                                        <Text className='font-roboto mt-auto text-sm text-gray-700'>
                                                            Assigned
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                            }

                                            {
                                                activeTab == 'pending' ?
                                                    <>
                                                        <View className='border-t-[0.5px] border-gray-300 flex-row space-x-2 flex-wrap mt-1.5'>
                                                            <Text className='font-roboto_bold mt-auto text-sm text-gray-700'>
                                                                {walker}
                                                            </Text>
                                                            <Text className='font-roboto mt-auto text-sm text-gray-700'>
                                                                Applied
                                                            </Text>
                                                        </View>

                                                        <View className='flex-row space-x-2'>
                                                            <View>
                                                                <TouchableOpacity className='bg-green-700 px-2 py-1 rounded-md' onPress={async () => { await handleAction('approve', id) }}>
                                                                    <Text className='text-white font-roboto text-xs'>
                                                                        Approve
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity className='bg-red-700 px-2 py-1 rounded-md' onPress={async () => { await handleAction('reject', id) }}>
                                                                    <Text className='text-white font-roboto text-xs'>
                                                                        Reject
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>

                                                    </>
                                                    :
                                                    null
                                            }


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