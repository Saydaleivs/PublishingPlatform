'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { IUser } from '@/app/interfaces'
import Navbar from '@/app/_components/Navbar'

export default function Profile() {
  const initialState = {
    fullName: '',
    username: '',
    address: '',
    email: '',
    imageUrl: '',
    imageName: ''
  }
  const [user, setUser] = useState<IUser>(initialState)

  async function getMyData() {
    const response = await axios.get('/api/users/me')

    if (response.status === 200) {
      setUser({ ...user, ...response.data.user })
    }
  }

  useEffect(() => {
    getMyData()
  }, [])

  return <Navbar user={user} />
}
