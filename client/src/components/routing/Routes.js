import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute'
import Register from '../auth/Register';

import Alert from '../layouts/Alert';
import CreateProfile from '../profile-forms/CreateProfile'
import EditProfile from '../profile-forms/EditProfile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Teams from '../teams/Teams'
import Team from '../teams/Team'
import CreateTeam from '../teams/CreateTeam'
import Posts from '../posts/Posts'
import Post from '../post/Post';
import NotFound from '../layouts/NotFound';

const Routes = props => {
  return (
    <section className="container">

            <Alert />
            <Switch>
              <Route exact path={"/register"} component={Register} />
              <Route exact path={"/login"} component={Login} />
              <Route exact path={"/Profiles"} component={Profiles} />
              <Route exact path={"/Teams"} component={Teams} />
              <Route exact path={"/Teams/:id"} component={Team} />
              <Route exact path={"/Profile/:id"} component={Profile} />
              <PrivateRoute exact path={"/dashboard"} component={Dashboard} />
              <PrivateRoute exact path={"/create-profile"} component={CreateProfile} />
              <PrivateRoute exact path={"/create-team"} component={CreateTeam} />
              <PrivateRoute exact path={"/edit-profile"} component={EditProfile} />
              <PrivateRoute exact path={"/add-experience"} component={AddExperience}
              />
              <PrivateRoute exact path={"/add-education"} component={AddEducation}
              />     <PrivateRoute exact path={"/posts"} component={Posts}
              />
              <PrivateRoute exact path={"/posts/:id"} component={Post}
              />
              <Route component={NotFound}/>
              </Switch>
          </section>
  )
}

Routes.propTypes = {}

export default Routes