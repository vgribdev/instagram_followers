import { fetchPartialUsers } from './api'
import { userId } from './auth'
import { authHeaders } from './auth'

describe('fetchPartialUsers', () => {
    beforeEach(() => {
        // Mock the fetch function
        global.fetch = jest.fn().mockResolvedValue({
            json: () =>
                Promise.resolve({
                    users: [
                        { pk: '1', username: 'user1' },
                        { pk: '2', username: 'user2' },
                    ],
                    next_max_id: '3',
                }),
        })
    })

    it('should fetch the correct data', async () => {
        const result = await fetchPartialUsers('followers', '2')
        expect(result).toEqual({
            users: [
                { pk: '1', username: 'user1' },
                { pk: '2', username: 'user2' },
            ],
            nextMaxId: '3',
        })
        expect(fetch).toHaveBeenCalledWith(
            `https://i.instagram.com/api/v1/friendships/${userId}/followers/?count=50&max_id=2`,
            { headers: authHeaders, method: 'GET' }
        )
    })
})
