import React, { useState, useCallback } from 'react'
import { debounce } from 'lodash'
import axios from 'axios'

export default function useCheckUsername() {
  const [validUsername, setValidUsername] = useState({
    isValid: true,
    message: '',
    loading: false,
  })

  const isUsernameUsed = useCallback(
    debounce(async (username: string) => {
      setValidUsername({ ...validUsername, loading: true })

      const { data } = await axios.get('/api/validation/username', {
        params: { username },
      })

      console.log(data)

      if (data.status === 200)
        return setValidUsername({
          isValid: true,
          message: 'Username can be used',
          loading: false,
        })

      if (data.status === 400)
        return setValidUsername({
          isValid: false,
          message: 'Username is already used',
          loading: false,
        })
    }, 250),
    []
  )

  return { validUsername, setValidUsername, isUsernameUsed }
}
