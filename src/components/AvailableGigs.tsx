import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import useAuthStore from '../stores/useAuthStore'
import { supabase } from '../supabase'
import ErrorMsg from './ErrorMsg'
import Gig from './Gig'
import Spinner from './Spinner'

type Props = {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const AvailableGigs = ({ setActiveTab }: Props) => {
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
                    .select('*').eq('walker', '')

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
                                    <Gig key={id} id={id} dogImage={image} dogName={dogName} ownerName={owner} location={location} price={price} duration={duration} description={description} setActiveTab={setActiveTab} />
                                ))
                            }
                        </ScrollView>

            }

        </View>
    )
}

export default AvailableGigs