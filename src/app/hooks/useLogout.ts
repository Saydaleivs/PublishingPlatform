import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function useLogout() {
  const router = useRouter()
  return async () => {
    const response = await axios.get('/api/users/logout')
    if (response.status === 200) {
      router.push('/signin')
    }
  }
}
