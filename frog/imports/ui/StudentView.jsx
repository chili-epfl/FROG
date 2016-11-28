import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { sortBy, reverse, take, find } from 'lodash';
import { objectize, objectIndex } from '../../lib/utils';

import { createLogger } from '../api/logs';
import { Sessions } from '../api/sessions';
import { Activities, Results } from '../api/activities';
import { ActivityData, reactiveData } from '../api/activity_data';
import { Products, addProduct } from '../api/products';

import CollabRunner from './student_view/CollabRunner.jsx';
import { activity_types_obj } from '../activity_types';

const setStudentSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.currentSession':session_id}})
}

const SessionList = ( { sessions, curSessionId } ) => { return(
  <div>
    <h3>Session list</h3>
    <ul> { 
      sessions.map((session) => 
        <li key={session._id}>

          { session._id == curSessionId ? 
            '(current): ' :
            <button className='btn btn-primary btn-sm' onClick={ () => setStudentSession(session._id) }>Join</button> }

          {session._id} <i>({session.state}) </i>
        </li>
      ) 
    } </ul>
  </div>
)}

const Runner = ( { activity } ) => {
  const activity_type = activity_types_obj[activity.activity_type]
  const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)
  const input_raw = Results.findOne({activity_id: activity._id, type: 'product'})
  const data = input_raw && input_raw.result

  const social = Results.findOne({activity_id: activity._id, type: 'social'})

  // if no social operator, assign entire class to group 0
  const group_id = social ? objectIndex(social.result)[Meteor.userId()] : 0

  if(activity_type.meta.mode == 'collab') { 
    return <CollabRunner 
      activity={activity} 
      session_id={1} 
      group_id={group_id}
      onCompletion={onCompletion}
      data={data}/>
  } else {
    const logger = createLogger({
      activity: activity._id, 
      activity_type: activity.activity_type, 
      user: Meteor.userId()
    })
    const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)
    return <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger}
      onCompletion={onCompletion}
      data={data}
      />
  }
}

const ActivityBody = ( { activity, state, products } ) => {
  // check if product has been submitted - means completed (might change this to also allow completion
  // of product-less activities)
  if(state != 'STARTED') { 
    return( <h1>Paused</h1> )
  }
  if(!activity) { 
    return( <h1>No activity selected</h1> )
  }
  if(products.filter(x => x.activity_id == activity._id).length > 0) { 
    return( <h1>Waiting for next activity</h1> ) 
  }
  const createdAt = Sessions.findOne({activity: activity._id}).startedAt
  return( <TimerExample start={createdAt} activity={activity} duration={activity.data.duration} /> )
}

const SessionBody = ( { session, products } ) =>  { return (
  session ? 
    <div>
      <ActivityBody activity={Activities.findOne({_id:session.activity})} state={session.state} products={products}/>
    </div>
    : <p>Please chose a sesssion</p> 
)}

const StudentView = ( { user, sessions, products } ) => { 
  const curSession = user.profile? Sessions.findOne({_id:user.profile.currentSession}) : null 

  return(
  <div>
    <SessionBody 
      session={curSession} 
      products={products} />
    <SessionList 
      sessions={sessions}
      curSessionId={curSession && curSession._id} />
  </div>
)}

var TimerExample = React.createClass({

    getInitialState: function(){

        // This is called before our render function. The object that is 
        // returned is assigned to this.state, so we can use it later.

        return { elapsed: 0 };
    },

    componentDidMount: function(){

        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:

        this.timer = setInterval(this.tick, 50);
    },

    componentWillUnmount: function(){

        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:

        clearInterval(this.timer);
    },

    tick: function(){

        // This function is called every 50 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered

        this.setState({elapsed: new Date() - this.props.start});
    },

    render: function() {
        
        var elapsed = Math.round(this.state.elapsed / 100);

        // This will give a number with one digit after the decimal dot (xx.x):
        var seconds = (this.props.duration - (elapsed / 10)).toFixed(1);    

   
     // Although we return an entire <p> element, react will smartly update
        // only the changed parts, which contain the seconds variable.

        return ( this.props.duration == 0 ? <Runner activity={this.props.activity}/> : 
          ( seconds < 0 ? <h1>Time-out for this activity</h1> :
            <div>
              <p>This activity will end in <b>{seconds} seconds</b>.</p>
              <Runner activity={this.props.activity}/>
            </div>
          )
        );
    }
});

export default createContainer(() => {
  return {
    sessions: Sessions.find().fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()}),
    products: Products.find({user_id:Meteor.userId()}).fetch()
  }
}, StudentView)
