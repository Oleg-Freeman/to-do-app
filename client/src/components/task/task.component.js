import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import MyButton from '../../util/MyButton';
import DeleteTask from './DeleteTask';
import EditTask from '../task/EditTask.component'

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

// Redux
import { connect } from 'react-redux';
import { markComplete } from '../../redux/actions/dataActions';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  completedCard: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  },
  edit: {
    marginTop: 20,
    position: 'relative'
  }
};

class Task extends Component {
  constructor() {
    super();

    this.state = {
      checked: false
    }

    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  handleCheckBox() {
    this.props.markComplete(this.props.task._id);
    this.props.action();
  };


  render() {
    const {
      classes,
      task: {
        body,
        createdAt,
        userId,
        completed,
        userName
      }
    } = this.props;

    const _id = this.props.task._id.toString();
    const isAuthenticated = window.localStorage.getItem('token');
    const currentUserId = window.localStorage.getItem('currentUserId');

    const createdBy = window.localStorage.getItem('isAdmin') === 'true' ? (
      <Typography variant="body2" color="primary">{`Created by ${userName}`}</Typography>
    ) : null;

    const deleteButton = window.localStorage.getItem('isAdmin') === 'false' ?
    !isAuthenticated && !currentUserId.replace(/['"]+/g, '') === userId ? null
     : (
      <DeleteTask taskId={_id} />
     ) : <DeleteTask taskId={_id} />;
    const taskMarkup = !completed ? (
      <Card className={classes.card}>
      <Checkbox
      value="CheckBox"
      color="primary"
      onChange={this.handleCheckBox}
      />
      <CardContent className={classes.content}>
        {deleteButton}
        <EditTask key="edit" taskBody={body} taskId={_id}/>
        {createdBy}
        <Typography variant="h6">{body}</Typography>
        <Typography variant="body2" color="textSecondary">
          Created at: {createdAt}
        </Typography>
      </CardContent>
    </Card>
    ) : (
      <Card className={classes.completedCard}>
      <Checkbox
      value="CheckBox"
      defaultChecked
      color="primary"
      onChange={this.handleCheckBox}
      />
      <CardContent className={classes.content}>
        {deleteButton}
        <EditTask key="edit" taskBody={body} taskId={_id}/>
        {createdBy}
        <Typography variant="h6">{body}</Typography>
        <Typography variant="body2" color="textSecondary">
          Created at: {createdAt}
        </Typography>
      </CardContent>
    </Card>
    );
    return (
      <div>
        {taskMarkup}
      </div>
    );
  }
}
Task.propTypes = {
  card: PropTypes.string,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  markComplete: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { markComplete }
  )(withStyles(styles)(Task));
