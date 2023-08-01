'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { IUser } from '@/app/interfaces'
import Navbar from '@/app/_components/Navbar'

export default function Profile() {
  const [user, setUser] = useState<IUser>({
    username: '',
    email: '',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  })

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
