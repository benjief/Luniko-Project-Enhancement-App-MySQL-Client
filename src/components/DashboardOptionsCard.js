import * as React from 'react';
import { logout } from '../firebase';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
// import { yellow } from '@mui/material/colors';
// import { green } from '@mui/material/colors';
// import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { color } from '@mui/system';
import MaterialSingleSelect from './MaterialSingleSelect';
import MaterialSingleSelectWithValue from './MaterialSingleSelectWithValue';
import MaterialTextField from './MaterialTextField';
import MaterialMultiSelect from './MaterialMultiSelect';
import BootstrapPopover from "./BootstrapPopover";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function DashboardOptionsCard({
    uid = "",
    isIdentifier = false,
    isOwner = false,
    firstName = "",
    // createRequest = false,
    // submittedRequests = false,
    // addToOwnedRequests = false,
    // ownedRequests = false,
    submittedRequestsButtonDisabled = true,
    addToOwnedRequestsButtonDisabled = true,
    ownedRequestsButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submittedRequestsButtonColor, setSubmittedRequestsButtonColor] = React.useState("#BFBFBF");
    const [addToOwnedRequestsButtonColor, setAddToOwnedRequestsButtonColor] = React.useState("#BFBFBF");
    const [ownedRequestsButtonColor, setOwnedRequestsButtonColor] = React.useState("#BFBFBF");

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    //     // cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    // };

    // const handleOnClickCreateRequest = () => {
    //     createRequest(true);
    // }

    // const handleOnClickSubmittedRequests = () => {
    //     submittedRequests(true);
    // }

    // const handleOnClickAddToOwnedRequests = () => {
    //     addToOwnedRequests(true);
    // }

    // const handleOnClickOwnedRequests = () => {
    //     ownedRequests(true);
    // }

    React.useEffect(() => {
        !submittedRequestsButtonDisabled
            ? setSubmittedRequestsButtonColor("var(--lunikoBlue)")
            : setSubmittedRequestsButtonColor("#BFBFBF");

        !addToOwnedRequestsButtonDisabled
            ? setAddToOwnedRequestsButtonColor("var(--lunikoBlue)")
            : setAddToOwnedRequestsButtonColor("#BFBFBF");

        !ownedRequestsButtonDisabled
            ? setOwnedRequestsButtonColor("var(--lunikoBlue)")
            : setOwnedRequestsButtonColor("#BFBFBF");
    }, [submittedRequestsButtonDisabled, addToOwnedRequestsButtonDisabled, ownedRequestsButtonDisabled]);

    return (
        <Card
            sx={{
                // minWidth: 350,
                // maxWidth: 350,
                maxHeight: "calc(100vh - 156.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
                    title={"Welcome, " + firstName + "!"}
                />
                {/* < CardActions
                disableSpacing
                style={{ justifyContent: "center", height: "40px", padding: 0, paddingBottom: "10px" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    style={{ marginLeft: 0 }}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions > */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
                        <Link to={`/create-request/${uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="create-request-button">
                                Create Request
                            </button>
                        </Link>
                        <Link to={`/submitted-requests/${uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="submitted-requests-button"
                                disabled={submittedRequestsButtonDisabled}
                                style={{ backgroundColor: submittedRequestsButtonColor }}>
                                Submitted Requests
                            </button>
                        </Link>
                        <Link to={`/add-owned-requests/${uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="add-to-owned-requests-button"
                                disabled={addToOwnedRequestsButtonDisabled}
                                style={{ backgroundColor: addToOwnedRequestsButtonColor }}>
                                Add to Owned Requests
                            </button>
                        </Link >
                        <Link to={`/owned-requests/${uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="owned-requests-button"
                                disabled={ownedRequestsButtonDisabled}
                                style={{ backgroundColor: ownedRequestsButtonColor }}>
                                Owned Requests
                            </button>
                        </Link >
                        <button
                            className="logout-button"
                            onClick={logout}>
                            Logout
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}