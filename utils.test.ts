import { User } from './types'
import {
    checkDifferences,
    EnvKeyNotDefinedError,
    getFromEnvOrThrow,
} from './utils'

describe('checkDifferences', () => {
    let following: User[], followers: User[]
    const commonUser: Pick<User, 'full_name' | 'username'> = {
        full_name: 'test',
        username: 'test',
    }

    beforeEach(() => {
        following = [
            { ...commonUser, pk: 1 },
            { ...commonUser, pk: 2 },
            { ...commonUser, pk: 3 },
        ]
        followers = [
            { ...commonUser, pk: 2 },
            { ...commonUser, pk: 3 },
            { ...commonUser, pk: 4 },
        ]
    })

    test('returns users that are not following back', () => {
        const result = checkDifferences(following, followers)
        expect(result).toEqual({
            notFollowingBack: [{ ...commonUser, pk: 1 }],
            followersImNotFollowing: [{ ...commonUser, pk: 4 }],
        })
    })
})

describe('getFromEnvOrThrow', () => {
    beforeEach(() => {
        process.env = {
            TEST_VAR: 'test_value',
        }
    })

    test('retrieves the value of an environment variable', () => {
        const value = getFromEnvOrThrow('TEST_VAR')
        expect(value).toEqual('test_value')
    })

    test('throws an error if the environment variable is not defined', () => {
        expect(() => getFromEnvOrThrow('NON_EXISTING_VAR')).toThrowError(
            new EnvKeyNotDefinedError('NON_EXISTING_VAR')
        )
    })
})
