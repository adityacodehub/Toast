import React, { useState, useEffect,useCallback } from 'react';
import { Snackbar} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';
import Content from './Content';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles({
    root: {
        width: '100%',
        maxWidth: 360,
    },
    liked: {
        backgroundColor: '#C8E6C9',
    },
});

function App() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [likedSubmissions, setLikedSubmissions] = useState([]);
    const [latestSubmission, setLatestSubmission] = useState(null);
    const [message, setMessage] = useState('');
    
    const fetchData = useCallback(async () => {
        try {
            const response = await fetchLikedFormSubmissions();
            const likedSubmissions = response.formSubmissions.filter(submission => submission.data.liked === true);
            setLikedSubmissions(likedSubmissions);
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        onMessage((submission) => {
            if (submission) {
                setLatestSubmission(submission);
                setMessage(`${submission.data.firstName} ${submission.data.lastName}(${submission.data.email}) just submitted a new form!`);
                setOpen(true);
            }
        });
    }, []);

    const handleToastClose = useCallback(() => {
        setOpen(false);
        if (latestSubmission) {
            setMessage(`${latestSubmission.data.firstName} ${latestSubmission.data.lastName}(${latestSubmission.data.email}) just submitted a new form!`);
        }
    }, [latestSubmission]);

    const handleLikeClick = useCallback(() => {
        setOpen(false);
        const latestSubmissionWithLiked = { ...latestSubmission, data: { ...latestSubmission.data, liked: true } };
        saveLikedFormSubmission(latestSubmissionWithLiked)
            .then(() => fetchData())
            .catch(() => fetchData());

    }, [latestSubmission, fetchData]);



    const handleDismissClick = (submission) => {
        const updatedSubmissionWithDisLiked = { ...submission, data: { ...submission.data, liked: false } };

        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        const updatedSubmissions = submissions.map((s) => {
            if (s.data.email === submission.data.email) {
                return updatedSubmissionWithDisLiked;
            } else {
                return s;
            }
        });

        localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
        fetchData();
    };

    return (
        <>
            <Header />
            <Content
                classes={classes}
                likedSubmissions={likedSubmissions}
                handleDismissClick={handleDismissClick}
            />
            {latestSubmission && (
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleToastClose}
                message={message}
                action={
                    <React.Fragment>
                        <Button color="primary" size="small" onClick={handleLikeClick}>
                            Like
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleToastClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
                )}
        </>
    );
}

export default App;
