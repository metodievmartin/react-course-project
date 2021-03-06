import {useContext} from "react";
import AppCtx from "../../../context/AppCtx";
import GenericGuestPage from "../../GenericGuestPage/GenericGuestPage";
import {getPostsByOwner} from "../../../utils/data";
import MainNewsFeed from "../MainNewsFeed";

const MyPublications = () => {
    const {authUser, authUserID} = useContext(AppCtx);

    if (!authUser) {
        return GenericGuestPage();
    }

    return (
        <div className="my-publications-container">
            <h1 className="my-publications-header">My publications</h1>

            <MainNewsFeed fetchData={() => getPostsByOwner(authUserID)}/>

            <style jsx="true">{`
              .my-publications-container {
                margin-left: 16rem;
              }

              .my-publications-header {
                margin-left: 10px;
                border-bottom: 1px solid lightgray;
                color: #434343;
              }

            `}
            </style>
        </div>
    );
}

export default MyPublications;