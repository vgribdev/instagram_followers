import { downloadUsers } from './api'
import { checkDifferences } from './utils'

const main = async () => {
    const following = await downloadUsers('following')
    const followers = await downloadUsers('followers')

    const { notFollowingBack } = checkDifferences(following, followers)
    for (const user of notFollowingBack) {
        console.log(user.full_name)
    }

    console.log(following.length, followers.length)
}

main()
