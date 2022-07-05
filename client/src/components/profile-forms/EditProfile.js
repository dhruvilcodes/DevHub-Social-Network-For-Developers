import React, { useState, Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LeetCode from '../icons/Leetcode'
import CodeForces from '../icons/CodeForces'
import CodeChef from '../icons/CodeChef'
import LinkedIn from '../icons/LinkedIn'
import { createProfile, getCurrentProfile } from '../../actions/profile'
import { Link, withRouter } from 'react-router-dom'

function EditProfile({ profile: { profile, loading }, createProfile, getCurrentProfile, history }) {

    const initialState = {
        organization: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername: '',
        bio: '',
        leetcode: '',
        codeforces: '',
        codechef: '',
        linkedin: '',
        photo:''
    }

    const [formData, setFormData] = useState(initialState)
    const [sendForm, setSendForm] = useState(new FormData());
   
    useEffect(() => {
        if (!profile) getCurrentProfile();

        if (!loading && profile) {
            const profileData = { ...initialState };
            for (const key in profile) {
                if (key in profileData) {
                    if(key!=="photo")
                    {
                    profileData[key] = profile[key]
                    sendForm.set(key, profile[key])
                    }
                };
            }
            for (const key in profile.social) {
                if (key in profileData) {
                    profileData[key] = profile.social[key]
                    sendForm.set(key, profile.social[key])
                };
            }
            if (Array.isArray(profileData.skills))
            {
                profileData.skills = profileData.skills.join(', ');
                sendForm.set(skills,profileData.skills );
            }
            setFormData(profileData);
           

        }
        console.log("Component loaded")
    }, [])

    const {
        organization,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        leetcode,
        codeforces,
        codechef,
        linkedin,

    } = formData;

    const onChange = e => {
        const value = e.target.name === "photo" ? e.target.files[0] : e.target.value;

        if(e.target.name==="photo")
        {
            sendForm.set(e.target.name, value);
            
        }
        else  
        {
            sendForm.set(e.target.name, value);
            setFormData({ ...formData, [e.target.name]: e.target.value })

        }
    }


    const onSubmit = e => {
        e.preventDefault();
        createProfile(sendForm, history, profile ? true : false)
        setSendForm(new FormData());
    }

    const [displaySocialInputs, toggleSocialInputs] = useState(false)


    return (
        <Fragment className="container">

            <h1 className="large text-primary">
                Update Your Profile
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i> Let's get some information to make your
                profile stand out
            </p>
            <small style={{color:"red"}}>* Required field</small>
            <form className="form" onSubmit={e => onSubmit(e)}>


                <div className="form-group">
                    <label for="img">Upload Profile Pic:  </label>

                    <input
                        onChange={e => onChange(e)}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="Choose a file"
                    />
                </div>
                <div className="form-group">
                    <select name="status" value={status} onChange={e => onChange(e)}>
                        <option value="0">* Select Professional Status</option>
                        <option value="Developer">Developer</option>
                        <option value="Junior Developer">Junior Developer</option>
                        <option value="Senior Developer">Senior Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor or Teacher</option>
                        <option value="Intern">Intern</option>
                        <option value="Other">Other</option>
                    </select>
                    <small className="form-text"
                    >Give us an idea of where you are at in your career</small
                    >
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Organization" name="organization" value={organization} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >Could be your own organization or one you work for</small
                    >
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Website" name="website" value={website} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >Could be your own or a organization website</small
                    >
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Location" name="location"
                        value={location} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >City & state suggested (eg. Boston, MA)</small
                    >
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >Please use comma separated values (eg.
                        HTML,CSS,JavaScript,PHP)</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        value={githubusername}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text"
                    >If you want your latest repos and a Github link, include your
                        username</small
                    >
                </div>
                <div className="form-group">
                    <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e => onChange(e)}></textarea>
                    <small className="form-text">Tell us a little about yourself</small>
                </div>

                <div className="my-2">
                    <button type="button" className="btn btn-light" onClick={() => toggleSocialInputs(!displaySocialInputs)}>
                        Add Coding Profile / LinkedIn links
                    </button>
                    <span>Optional</span>
                </div>
                {displaySocialInputs && <Fragment>
                    <div className="form-group social-input">
                        <LeetCode />
                        <input type="text" placeholder="LeetCode URL" name="leetcode" value={leetcode} onChange={e => onChange(e)} />
                    </div>

                    <div className="form-group social-input">
                        <CodeForces />
                        <input type="text" placeholder="CodeForces URL" name="codeforces" value={codeforces} onChange={e => onChange(e)} />
                    </div>

                    <div className="form-group social-input">
                        <CodeChef />
                        <input type="text" placeholder="CodeChef URL" name="codechef" value={codechef} onChange={e => onChange(e)} />
                    </div>
                    <div className="form-group social-input">
                        <LinkedIn />
                        <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)} />
                    </div>
                </Fragment>}



                <input type="submit" className="btn btn-primary my-1" value="Submit" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}

EditProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
    profile: state.profile
})


export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));
