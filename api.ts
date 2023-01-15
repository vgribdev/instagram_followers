import { authHeaders, userId } from './auth'
import { User } from './types'

type Mode = 'followers' | 'following'

/**
 * Fetches a partial list of users from Instagram's API
 * @param {Mode} type - Specifies whether to fetch the user's followers or the users they are following.
 * @param {string} [maxId] - The max_id parameter used to paginate through results.
 * @returns {Promise<{users: User[], nextMaxId: string}>} - Returns a promise that when resolved contains an array of users and the next_max_id parameter.
 */
export const fetchPartialUsers = async (type: Mode, maxId?: string) => {
    const queryParams: URLSearchParams = new URLSearchParams({ count: '50' })

    if (maxId) queryParams.append('max_id', maxId)

    const result = await fetch(
        `https://i.instagram.com/api/v1/friendships/${userId}/${type}/?${queryParams.toString()}`,
        {
            headers: authHeaders,
            method: 'GET',
        }
    )
    const data = await result.json()
    const users: User[] = data.users
    const nextMaxId: string = data.next_max_id

    return { users, nextMaxId }
}

/**
 * Fetches a complete list of users from Instagram's API
 * @param {Mode} type - Specifies whether to fetch the user's followers or the users they are following.
 * @returns {Promise<User[]>} - Returns a promise that when resolved contains an array of all the users
 */
export const downloadUsers = async (type: Mode) => {
    let allUsersFound = false
    let allUsers: User[] = []
    const maxPossibleIterations = 10
    let i = 0
    let nextId = ''

    while (!allUsersFound && i < maxPossibleIterations) {
        const { users, nextMaxId } = await fetchPartialUsers(type, nextId)
        allUsers = allUsers.concat(users)
        i++
        if (!nextMaxId) allUsersFound = true
        else nextId = nextMaxId
    }

    return allUsers
}
