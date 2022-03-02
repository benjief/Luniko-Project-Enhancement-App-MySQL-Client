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
import parse from 'html-react-parser';

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

export default function AddOwnedRequestsCard({
    requestsRemaining = 0,
    id = "",
    dateSubmitted = "",
    lastUpdated = "",
    status = "",
    approved = "",
    submitter = "",
    owners = "",
    scopeType = "",
    department = "",
    description = "",
    value = "",
    comments = "",
    toAdd = ""
}) {
    const [expanded, setExpanded] = React.useState(false);
    // const [cardTransitionTime, setCardTransitionTime] = React.useState("0.2s");
    const [cardColor, setCardColor] = React.useState("var(--lunikoMidGrey)");
    const [cardOpacity, setCardOpacity] = React.useState("100%");
    var statusAbbreviation = status.charAt(0).toUpperCase();

    // React.useEffect(() => {
    //     console.log(owners);
    // }, [owners]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    };

    const handleAddRequest = () => {
        handleExpandClick();
        setTimeout(() => {
            setCardOpacity("0%");
            setTimeout(() => {
                toAdd(id);
            }, 200);
            // This condition ensures properties of an unmounted component aren't changed
            if (requestsRemaining > 0) {
                setTimeout(() => {
                    setCardOpacity("100%");
                }, 200);
            }
        }, 10);

    }

    return (
        <Card
            sx={{
                // minWidth: 350,
                // maxWidth: 350,
                maxHeight: "calc(100vh - 96.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: cardColor,
                ":hover": {
                    backgroundColor: "var(--lunikoOrange)"
                },
                marginBottom: "20px",
                opacity: cardOpacity
            }}>
            <CardHeader
                titleTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                avatar={
                    <Avatar sx={{
                        bgcolor: "var(--lunikoBlue)"
                    }}
                        aria-label="status">
                        {statusAbbreviation}
                    </Avatar>
                }
                title={[<strong>Request ID </strong>, <strong>{id}</strong>]}
            // subheader={[<strong>Date Submitted</strong>, <br />, dateSubmitted, <span />, <strong>Last Updated</strong>, <br />, lastUpdated]}
            />
            {/* <CardContent>
                <Typography variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
            </CardContent> */}
            < CardActions
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
            </CardActions >
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography
                        paragraph>
                        <strong>Status<br /></strong> {status}
                    </Typography>
                    <Typography
                        paragraph>
                        <strong>Approved<br /></strong> {approved}
                    </Typography>
                    <Typography
                        paragraph>
                        <strong>Submitted By<br /></strong> {submitter}
                    </Typography>
                    <Typography
                        paragraph>
                        <strong>Owners<br /></strong> {owners === "" ? "None" : parse(owners)}
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
                        <strong>Comments<br /></strong> {comments}
                    </Typography>
                    <button
                        className="add-request-button"
                        onClick={handleAddRequest}>
                        Become Owner
                    </button>
                </CardContent>
            </Collapse>
        </Card >
    );
}