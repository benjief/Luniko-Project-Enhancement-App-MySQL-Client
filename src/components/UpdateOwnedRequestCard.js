import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import { yellow } from '@mui/material/colors';
// import { green } from '@mui/material/colors';
// import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { color } from '@mui/system';
import MaterialSingleSelect from './MaterialSingleSelect';
import MaterialSingleSelectWithValue from './MaterialSingleSelectWithValue';
import MaterialTextField from './MaterialTextField';

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

export default function UpdateOwnedRequestCard({
    // uid = "",
    // isIdentifier = 0,
    // isOwner = 0,
    id = "",
    status = "",
    statusOptions = [],
    selectedStatus = "",
    dateSubmitted = "",
    lastUpdated = "",
    company = "",
    submitter = "",
    scopeType = "",
    department = "",
    description = "",
    value = "",
    effort = "",
    effortOptions = [],
    selectedEffort = "",
    priority = "",
    approved = "",
    approveDisabled = false,
    rejected = "",
    rejectDisabled = true,
    approvalOptions = [],
    selectedApproved = "",
    selectedRejected = "",
    reasonRejected = "",
    updatedReasonRejected = "",
    comments = "",
    updatedComments = "",
    requestToUpdate = "",
    updateButtonDisabled = true,
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [approvedValue, setApprovedValue] = React.useState(approved);
    const [rejectedValue, setRejectedValue] = React.useState(rejected);
    const [updateButtonColor, setUpdateButtonColor] = React.useState("#BFBFBF");
    var statusAbbreviation = status.charAt(0).toUpperCase();

    const handleOnSelectStatus = (valueFromSelector) => {
        selectedStatus(valueFromSelector);
    }

    const handleOnSelectEffort = (valueFromSelector) => {
        selectedEffort(valueFromSelector);
        // console.log(updateButtonColor);
        // console.log(updateButtonColor);
    }

    const handleOnSelectApproved = (valueFromSelector) => {
        selectedApproved(valueFromSelector);
        if (valueFromSelector === 1) {
            setApprovedValue("Yes");
            setRejectedValue("No");
        } else {
            console.log(valueFromSelector);
            // setApprovedValue("No");
        }
    }

    const handleOnSelectRejected = (valueFromSelector) => {
        selectedRejected(valueFromSelector);
        setRejectedValue(valueFromSelector === 1 ? "Yes" : "No");
        if (valueFromSelector === 1) {
            setRejectedValue("Yes");
            setApprovedValue("No");
        } else {
            // setRejectedValue("No");
        }
    }

    const handleOnChangeReasonRejected = (updatedText) => {
        updatedReasonRejected(updatedText);
        let regex = new RegExp("[a-zA-Z]");
        if (!updatedText.length > 0 || !regex.test(updatedText)) {
            setRejectedValue("No");
        }
    }

    const handleOnChangeComments = (updatedText) => {
        updatedComments(updatedText);
    }

    const handleUpdateRequest = () => {
        requestToUpdate(id);
    }

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    //     // cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    // };

    React.useEffect(() => {
        if (!updateButtonDisabled) {
            setUpdateButtonColor("var(--lunikoBlue)");
        } else {
            setUpdateButtonColor("#BFBFBF");
        }
    }, [updateButtonDisabled]);

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
                backgroundColor: "var(--lunikoOrange)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    avatar={
                        <Avatar sx={{
                            bgcolor: "var(--lunikoBlue)"
                        }}
                            aria-label="status">
                            {statusAbbreviation}
                        </Avatar>
                    }
                    // title={[<strong>Request ID </strong>, <strong>{id}</strong>]}
                    title={"Request ID " + id}
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
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            paragraph>
                            <strong>Updatable Fields</strong>
                        </Typography>
                        <MaterialSingleSelectWithValue
                            label="Status"
                            placeholder="Status"
                            defaultValue={status}
                            singleSelectOptions={statusOptions}
                            selectedValue={handleOnSelectStatus}
                            required={true}>
                        </MaterialSingleSelectWithValue>
                        <MaterialSingleSelectWithValue
                            label="Effort"
                            placeholder="Effort"
                            defaultValue={effort}
                            singleSelectOptions={effortOptions}
                            selectedValue={handleOnSelectEffort}
                            required={true}>
                        </MaterialSingleSelectWithValue>
                        <MaterialSingleSelectWithValue
                            label="Approved"
                            placeholder="Approved"
                            // defaultValue={approved}
                            value={approvedValue}
                            singleSelectOptions={approvalOptions}
                            selectedValue={handleOnSelectApproved}
                            isDisabled={approveDisabled}
                            required={true}>
                        </MaterialSingleSelectWithValue>
                        <MaterialSingleSelectWithValue
                            label="Rejected"
                            placeholder="Rejected"
                            // defaultValue={rejected}
                            value={rejectedValue}
                            singleSelectOptions={approvalOptions}
                            selectedValue={handleOnSelectRejected}
                            isDisabled={rejectDisabled}
                            required={false}>
                        </MaterialSingleSelectWithValue>
                        <MaterialTextField
                            className="reason-for-rejection"
                            label="Reason for Rejection"
                            helperText={"Required for rejection"}
                            placeholder="Why are you rejecting this request?"
                            defaultValue={reasonRejected}
                            inputValue={handleOnChangeReasonRejected}
                            multiline={true}
                            characterLimit={1000}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="comments-text-field"
                            label="Comments"
                            placeholder="Enter any relevant comments related to this request's status"
                            defaultValue={comments}
                            inputValue={handleOnChangeComments}
                            multiline={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <Typography
                            paragraph>
                            <strong>Company<br /></strong> {company}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Submitted By<br /></strong> {submitter}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Date Submitted<br /></strong> {dateSubmitted}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Last Updated<br /></strong> {lastUpdated}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Scope Type<br /></strong> {scopeType}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Department<br /></strong> {department}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Description<br /></strong> {description}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Value<br /></strong> {value}
                        </Typography>
                        <Typography
                            paragraph>
                            <strong>Priority<br /></strong> {priority}
                        </Typography>
                        <button
                            className="submit-update-request-button"
                            onClick={handleUpdateRequest}
                            disabled={updateButtonDisabled}
                            style={{ backgroundColor: updateButtonColor }}>
                            Update Request
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}