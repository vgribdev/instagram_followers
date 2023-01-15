import fs from 'fs'
import { User } from './types'
/**
 * Compare two lists of users, the users that are being followed and the users that are following
 * @param {User[]} following - List of users that are being followed
 * @param {User[]} followers - List of users that are following
 * @returns {{notFollowingBack: User[], followersImNotFollowing: User[]}}
 * - An object containing two properties, notFollowingBack and followersImNotFollowing,
 * which are arrays of users that do not follow back and followers that I'm not following, respectively.
 */
export const checkDifferences = (following: User[], followers: User[]) => {
    const followingSet = new Set(following.map((f) => f.pk))
    const followersSet = new Set(followers.map((f) => f.pk))

    // Check people that I'm following but they don't follow back
    const notFollowingBack = following.filter(
        (user) => !followersSet.has(user.pk)
    )
    // Check new people
    const followersImNotFollowing = followers.filter(
        (user) => !followingSet.has(user.pk)
    )

    return { notFollowingBack, followersImNotFollowing }
}

export const jsonReadFile = (fileName: string) =>
    JSON.parse(fs.readFileSync(fileName).toString())

/**
 * Retrieves the value of an environment variable and throws an error if it's not defined
 * @param {string} key - The key of the environment variable to retrieve
 * @returns {string} - The value of the environment variable
 * @throws {Error} - Will throw an error if the environment variable is not defined
 */

export class EnvKeyNotDefinedError extends Error {
    constructor(key: string) {
        super(key)
        this.message = `Environment variable ${key} is not defined`
    }
}

export const getFromEnvOrThrow = (key: string) => {
    const value = process.env[key]
    if (value === undefined) {
        throw new EnvKeyNotDefinedError(key)
    }
    return value
}
