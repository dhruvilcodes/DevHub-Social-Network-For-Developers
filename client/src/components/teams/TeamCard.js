import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { actionTeam } from './teamsapicalls'
import Moment from 'react-moment';
import moment from 'moment';

const TeamCard = ({ group, auth, change, setChange }) => {
  const [dates,setDates]=useState(true)
  const [present, setPresent] = useState(false);
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    

    let given = moment(group.date, "YYYY-MM-DD");
    let current = moment().startOf('day');
    if(moment.duration(given.diff(current)).asDays()<0)
    {
      setDates(false);
    }
  
   
    if (group && auth && auth.user && group.participants.includes(auth.user._id)) {
      setPresent(true);
      if (group.admin == auth.user._id) {
        setAdmin(true);

      }
    }
  }, [])
  const check = async (id) => {
    const res = await actionTeam(id);
    if (res.error) {
      setAlert(res.error, "danger")
    }
    else {
      setPresent(!present);
      setChange(!change)
    }
  }
 
   

  
 

  return (
    <Fragment>
    
      <div className="card text-black bg-light border border-info ">
        <div className="card-header lead">      <a href={group.website} target="_blank " className="btn btn-primary">{group.name}</a></div>
        <div className='card-body'>
        {!dates && <p className="alert alert-danger rounded  btn-sm px-4"> Expired </p>}
        <p>
            <Moment format='DD/MM/YYYY'>{group.date}</Moment>
        </p>
          <p className="alert alert-danger rounded  btn-sm px-4"> Seats -    {group.size - group.currsize} </p>
          {/* <p className="alert alert-danger rounded  btn-sm px-4"> Remaining -    {group.size-group.currsize} </p> */}

          <div className="col-12">
            <Link to={`/teams/${group._id}`} className='btn btn-primary'>
              View Team
            </Link>

          </div>
          <br />
          <div className="col-12">
            {dates && !group.done && auth && auth.isAuthenticated && !present && (<Fragment>
              <button onClick={() => check(group._id)} type="button" class="btn btn-success">Join Team</button>
            </Fragment>)}


            {dates && auth && auth.isAuthenticated && present && !admin && (<Fragment>
              <button onClick={() => check(group._id)} type="button" class="btn btn-danger">Leave Team</button>
            </Fragment>)}


          </div>
        </div>
      </div>
    </Fragment>
  )
}


export default TeamCard;