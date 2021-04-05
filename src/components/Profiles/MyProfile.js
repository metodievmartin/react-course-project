import {useContext, useEffect, useState} from "react";
import AppCtx from "../../context/AppCtx";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {db, storage} from "../../firebase";
import GridNewsFeed from "../NewsFeed/GridNewsFeed";
import {getPostsByOwner, getUserFavouritePosts} from "../../utils/data";
import RepoList from "../RepoList/RepoList";
import GenericGuestPage from "../GenericGuestPage/GenericGuestPage";

const MyProfile = () => {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [description, setDescription] = useState('');
    const {currentUser} = useContext(AppCtx)
    const userID = currentUser ? currentUser.uid : undefined

    useEffect(() => {
        //setIsLoading(true);
        const unsubscribe = db.collection('users')
            .doc(userID)
            .onSnapshot((snapshot => {
                //setIsLoading(false);
                if (userID && snapshot.data()) {
                    const {profilePic} = snapshot.data();
                    const {description} = snapshot.data();
                    setProfilePic(profilePic)
                    setDescription(description);
                }
            }));

        return () => {
            unsubscribe()
        }

    }, [userID]);


    const onChangeHandler = (ev) => {
        if (ev.target.files[0]) {
            setImage(ev.target.files[0])
        }
    };

    const handleUpload = () => {
        if (!image) {
            return alert('Please select an image!');
        } else if (!image.type.includes('image/')) {
            return alert('Only files of type image are allowed!');
        }

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }),
            (error => {
                // error function
                console.log(error);
                alert(error.message);
            }),
            () => {
                // complete function
                //setIsLoading(true);
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // get the image url and create new post in the DB
                        db.collection('users')
                            .doc(currentUser.uid)
                            .update({
                                profilePic: url
                            })
                            .then(() => {
                                setIsUploadOpen(false);
                            })
                            .catch(err => console.log(err));

                        // reset the values
                        setProgress(0);
                        setImage(null);

                        // close the window
                    });
            }
        )
    };

    if (!currentUser) {
        return GenericGuestPage();
    }

    return (
        <div className="my-profile-container">
            <h1 className="my-profile-header">My profile</h1>

            <section className="my-profile-avatar-section">
                <p><strong>{currentUser.displayName}</strong></p>
                <Avatar
                    className="my-profile-avatar"
                    alt=""
                    src={profilePic}
                >
                </Avatar>
                {
                    isUploadOpen && (
                        <article className="image-uploader-section">
                            <label htmlFor="progressBar">Progress:</label>
                            <progress id="progressBar" value={progress} max="100"/>
                            <input type="file" onChange={onChangeHandler}/>
                            <button onClick={handleUpload}>Upload</button>
                        </article>
                    )
                }
                <button onClick={() => setIsUploadOpen(!isUploadOpen)}>
                    {
                        isUploadOpen ? 'Cancel' : 'Update your profile pic'
                    }
                </button>
                <h4>Description</h4>
                <p className="profile-description">{description}</p>
            </section>

            <section className="my-profile-favourite-posts">
                <h3 className="my-profile-favourite-posts-header">Your latest publications</h3>
                <GridNewsFeed
                    fetchData={() => getPostsByOwner(currentUser.uid, 6)}
                />
                <p><Link to="/my-publications">See all publications</Link></p>
            </section>

            <section className="my-profile-favourite-posts">
                <h3 className="my-profile-favourite-posts-header">Your last saved posts</h3>
                <GridNewsFeed
                    fetchData={() => getUserFavouritePosts(currentUser.uid, 6)}
                />
                <p><Link to="/my-favourites">See all favourites</Link></p>
            </section>

            <style jsx={true}>{`
              .my-profile-container {
                background: white;
                border-left: 1px solid lightgray;
                border-right: 1px solid lightgray;
                border-bottom: 1px solid lightgray;
                padding: 20px;
                margin-left: 16rem;
              }

              .my-profile-avatar-section {
                display: flex;
                flex-flow: column wrap;
                justify-content: center;
                align-items: center;
                border: 1px solid lightgray;
                border-radius: 5px;
                padding: 10px 20px;
              }

              .image-uploader-section {
                display: flex;
                flex-flow: column wrap;
                justify-content: center;
                align-items: center;
              }

              .my-profile-header {
                margin-top: 0;
              }

              .my-profile-avatar {
                height: 100px;
                width: 100px;
                margin: 0 20px 20px 20px;
              }
              
              .my-profile-favourite-posts-header {
                border-bottom: 1px solid lightgray;
              }

            `}
            </style>
        </div>

    );
}

export default MyProfile;