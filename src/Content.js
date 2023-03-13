import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';

function Content(props) {
    const { classes, likedSubmissions, handleDismissClick } = props;

    return (
        <div className="App">
            <Typography variant="h5" gutterBottom>
                Liked Submissions
            </Typography>
            <List className={classes.root}>
                {likedSubmissions && likedSubmissions.length > 0 && likedSubmissions.map((submission, index) => (
                    <ListItem key={submission.id} className={classes.liked}>
                        <ListItemText primary={submission.data.firstName} secondary={submission.data.email} />
                        <button onClick={() => handleDismissClick(submission)}>Dismiss</button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Content;
