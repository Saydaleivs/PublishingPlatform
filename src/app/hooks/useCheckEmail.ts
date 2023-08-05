import React, { useState, useCallback } from 'react'
import { cookies } from 'next/dist/client/components/headers'
import { debounce } from 'lodash'
import axios from 'axios'

export default function useCheckEmail() {
  const [validEmail, setValidEmail] = useState({
    isValid: true,
    message: '',
    loading: false,
  })

  const isEmailUsed = useCallback(
    debounce(async (email: string) => {
      setValidEmail({ ...validEmail, loading: true })

      const { data } = await axios.get('/api/validation/email', {
        params: { email },
      })

      if (data.status === 200)
        return setValidEmail({
          isValid: true,
          message: 'Email can be used',
          loading: false,
        })
      if (data.status === 400)
        return setValidEmail({
          isValid: false,
          message: 'Email is already used',
          loading: false,
        })
    }, 250),
    []
  )

  return { validEmail, setValidEmail, isEmailUsed }
}
