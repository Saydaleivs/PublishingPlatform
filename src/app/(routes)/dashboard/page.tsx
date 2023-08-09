'use client'

import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '@/app/_components/Navbar'
import { IUser } from '@/app/interfaces'
import useLogout from '@/app/hooks/useLogout'
import FullPageLoader from '@/app/_components/FullPageLoader'
import { ToastContainer } from 'react-toastify'
import VerifyEmailPage from '@/app/_components/VerifyEmail'

export default function Dashboard() {
  const logout = useLogout()
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<IUser>()

  async function getMyData() {
    const response = await axios
      .get('/api/users/me')
      .finally(() => setLoading(false))

    if (response.status === 200) {
      return setUser(response.data.user)
    }
  }

  useEffect(() => {
    getMyData()
  }, [])

  return (
    <>
      {loading && <FullPageLoader />}
      <ToastContainer />
      <div className='min-h-full'>
        <Navbar user={user!} />
        <main>
          <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
            <h3 className='text-xl tracking-tight text-gray-900'>
              Username: {user?.username}
              <br />
              Email: {user?.email}
            </h3>
            <br />

            <button
              onClick={logout}
              className='bg-gray-900 text-white p-2 rounded'
            >
              logout
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
