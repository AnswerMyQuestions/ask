import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        minWidth: 275,
      },
      pos: {
        marginBottom: 12,
      }
});

class Room extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">{this.props.roomname}</Typography>
          <Typography className={classes.pos} color="textSecondary">{this.props.roomowner}</Typography>
          <Typography variant="body2" component="p">DB질문방입니다.</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">입장</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Room);