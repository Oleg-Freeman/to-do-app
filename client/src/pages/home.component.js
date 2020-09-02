import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Task from '../components/task/task.component';
import DefaultTask from '../components/task/defaultTask.component';
import Start from '../components/layout/start.component';

import { connect } from 'react-redux';
import { getTasks, adminGetTasks } from '../redux/actions/dataActions';

class Home extends Component {
  constructor() {
    super();

    this.buttonHandler = this.buttonHandler.bind(this);

    this.state = {
      checked: false
    };
  }

  componentDidMount() {
    const isAdmin = window.localStorage.getItem('isAdmin');
    switch (isAdmin) {
      case 'false':
        this.props.getTasks();
        break;
      case 'true':
        this.props.adminGetTasks();
        break;
      default:
        this.props.getTasks();
    }
  }

  buttonHandler() {
    this.setState({
      checked: true
    })
  }

  render() {
    const { tasks, loading } = this.props.data;
    const isAuthenticated = window.localStorage.getItem('token');
    
    const recentTasksMarkup = !loading ? (
      tasks.map(task => <Task key={task._id} task={task} action={this.buttonHandler}/>)
    ) : <p>Loading...</p>;
    console.log(tasks);
    const tasksExist = tasks.length ? recentTasksMarkup : (<DefaultTask/>);
    const getStarted = isAuthenticated ? tasksExist : (<Start/>)
    
    return (
      <Grid container spacing={10}>
        <Grid item sm={2} xs={12}>
        </Grid>
        <Grid item sm={8} xs={12}>
          {getStarted}
        </Grid>
        <Grid item sm={2} xs={12}>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getTasks: PropTypes.func.isRequired,
  adminGetTasks: PropTypes.func.isRequired,
  history: PropTypes.object,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getTasks, adminGetTasks }
)(Home);
