import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users.js'

export function User({ id }) {
    const userInfoQuery = useQuery({
        queryKey: ['users', id],
        queryFn: () => getUserInfo(id),
    })
    const userInfo = userInfoQuery.data ?? {}
    console.log(userInfo)

    return <strong>{userInfo?.username ?? id}</strong>
}

User.propTypes = {
    id: PropTypes.string.isRequired,
}
