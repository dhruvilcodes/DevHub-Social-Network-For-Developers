import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { createTeam } from './teamsapicalls'
import { setAlert } from '../../actions/alert'

function CreateTeam({ history }) {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        website: "",
        size: ""
    })
    const {
        name,
        date,
        website,
        size
    } = formData;



    const onSubmit = async e => {
        e.preventDefault();
        let res = await createTeam(formData);
        if (res) {
            setAlert('Team Created', "success");
            history.push("/teams");
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }


    return (
        <Fragment className="container">

            <h1 className="large text-primary">
                Create Your Team
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i> Let's get some information about the event
            </p>
            <small style={{color:"red"}}>* Required field</small>
            <form className="form" onSubmit={e => onSubmit(e)}>


                <div className="form-group">
                    <input type="text" placeholder="Name of the event" name="name" value={name} onChange={e => onChange(e)} />
                    <small className="form-text">*Name of the event
                    </small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Website" name="website" value={website} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >*Event's website</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Maximum Team Size" name="size" value={size} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >*Team's Maximum Size</small>
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="date" value={date} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >*Event's Date</small>
                </div>



                <input type="submit" className="btn btn-primary my-1" value="Submit" />
                <Link className="btn btn-light my-1" to="/teams">Go Back</Link>
            </form >
        </Fragment >
    )
}

CreateTeam.propTypes = {
    CreateTeam: PropTypes.func.isRequired

}


export default connect(null, { setAlert })(withRouter(CreateTeam));
