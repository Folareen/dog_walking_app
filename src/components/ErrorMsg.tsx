import React from 'react'
import { Text } from 'react-native'

const ErrorMsg = ({ message }: { message: string }) => {
    return (
        <Text className='text-red-600 mt-4 text-center'>
            {message}
        </Text>
    )
}

export default ErrorMsg