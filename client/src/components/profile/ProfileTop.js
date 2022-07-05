import React from 'react'
import PropTypes from 'prop-types'
import Leetcode from '../icons/Leetcode'
import Leetcodeimg from '../icons/leetcode.ico'
import { API } from  "../../backend";
const ProfileTop = ({
    profile: {
        status,
        organization,
        location,
        website,
        social,
        photo,
        _id,
        user: { name, avatar }
    }

}) => {
    return (
        <div className="profile-grid my-1">

            <div className="profile-top bg-primary p-2">
                <img
                    className="round-img my-1"
                    src={photo?`${API}/api/profile/photo/${_id}`:avatar}
                    alt="profile pictue"
                />
                <h1 className="large">{name}</h1>
                <p className="lead">{status}{organization && <span>{` at   ${organization}`}</span>}</p>
                <div className="icons my-1">
                    <p>{location && <span>{location}</span>}</p>
                    <br />

                    <span>

                       
                        {
                            website && (
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios/50/000000/domain.png" />


                                </a>

                            )
                        }

{
                            social && social.leetcode && (

                                <a href={social.leetcode} target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/external-tal-revivo-light-tal-revivo/48/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-light-tal-revivo.png" />
                                </a>

                            )

                        }
                        {
                            social && social.codeforces && (

                                <a href={social.codeforces} target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/external-tal-revivo-regular-tal-revivo/50/000000/external-codeforces-programming-competitions-and-contests-programming-community-logo-regular-tal-revivo.png"/>



                                </a>

                            )

                        }

                        {
                            social && social.codechef && (

                                <a href={social.codechef} target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios/50/000000/codechef.png"/>

                                </a>

                            )

                        }

                        {
                            social && social.linkedin && (

                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios/50/000000/linkedin-circled--v1.png"/>

                                </a>

                            )

                        }


                    </span>
                </div>
            </div>
        </div>
    )
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileTop