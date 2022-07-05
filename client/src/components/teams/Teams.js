import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layouts/Spinner'
import { connect } from 'react-redux'
import { getAllGroups } from './teamsapicalls'
import { setAlert } from '../../actions/alert'
import TeamCard from './TeamCard'
import { Link } from 'react-router-dom'
import { getCurrentProfile } from '../../actions/profile'


const Teams = ({ getCurrentProfile, profile, auth, setAlert }) => {
    const [groups, setGroups] = useState("");
    const [change, setChange] = useState(false);
    const check = async () => {
        const res = await getAllGroups();
        if (res.error) {
            setAlert("Problems in this section", "danger")
        }
        else {
            setGroups((res));
        }
    }
    useEffect(() => {
        check();
        getCurrentProfile();
        console.log("Team rendered")
    }, [change])


    return (
        <div className="row text-center">
            {!groups && <Spinner />}
            <div className="row">
                <div className="col-4 mb-4">
                    <div className="card text-black bg-light border border-info ">
                        <div className="card-header lead">
                            <a href={profile&&profile.profile === null?"\dashboard":"\create-team"} className="btn btn-primary">Create Team</a>
                        </div>
                        <div className='card-body'>
                            {profile&&profile.profile === null &&
                                <p className="alert alert-danger rounded  btn-sm px-4"> Please Note that you need to have a profile to use this feature. </p>}
                            {profile&&profile.profile!== null &&
                                <p className="alert alert-success rounded  btn-sm px-4"> You Can Create/Join a Team </p>}
                        </div>
                    </div>

                </div>
                {groups && groups.map(group => {
                    return (
                        <div className="col-4 mb-4">
                            <TeamCard key={group._id} group={group} auth={auth} change={change} setChange={setChange} />
                        </div>
                    )
                })}


            </div >
        </div>
    )
}

Teams.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    setAlert: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}


const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { setAlert, getCurrentProfile })(Teams)
