import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// Redux stuff
import { connect } from 'react-redux';
import { editTask } from '../../redux/actions/dataActions';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// Icons
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
  // ...theme,
  editButton: {
    position: 'absolute',
    left: '90%',
    top: '50%'
  }
});

class EditTask extends Component {
  constructor() {
    super();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      body: '',
      open: false
    };
  }

  mapUserDetailsToState(taskBody) {
    this.setState({
      body: taskBody ? taskBody : undefined
    });
  };

  handleOpen() {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.taskBody);
  };

  handleClose() {
    this.setState({ open: false });
  };

  componentDidMount() {
    const { taskBody } = this.props;
    this.mapUserDetailsToState(taskBody);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit() {
    const editedTask = {
      body: this.state.body,
    };
    this.props.editTask(editedTask, this.props.taskId);
    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Edit Task"
          onClick={this.handleOpen}
          btnClassName={classes.editButton}
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your task</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="body"
                type="text"
                label="Task"
                multiline
                rows="3"
                placeholder="Write new task here"
                className={classes.textField}
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditTask.propTypes = {
  editTask: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  taskBody: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  newBody: state.data.newBody
});

export default connect(
  mapStateToProps,
  { editTask }
)(withStyles(styles)(EditTask));
