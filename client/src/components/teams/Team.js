import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layouts/Spinner'
import { Link, useParams } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { getGroupById } from './teamsapicalls'
import Profile from '../profiles/ProfileItem'
const Team = ({setAlert}) => {
    const { id } = useParams();

    const [profiles, setprofiles] = useState("");
    const check = async () => {
        const res = await getGroupById(id);
        if (res.error) {
            setAlert("Problems in this section", "danger")
        }
        else {
            setprofiles(res.result);
        }
    }
    useEffect(() => {
        check();
        console.log("Team rendered")
    }, [])


    return (

        <div>
            {profiles == null ? (
                <Spinner />
            ) : (
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <Profile key={profile._id} profile={profile} />
                        ))
                    ) : <h4>No Profiles found....</h4>}
                </div>
            )}
        </div>
    )
}

Team.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({

    auth: state.auth
});

export default connect(mapStateToProps, { setAlert })(Team);
