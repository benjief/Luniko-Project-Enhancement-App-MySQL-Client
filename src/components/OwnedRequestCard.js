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
import { Link } from 'react-router-dom';

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


export default function OwnedRequestCard({
    uid = "",
    isIdentifier = 0,
    isOwner = 0,
    id = "",
    status = "",
    dateSubmitted = "",
    lastUpdated = "",
    company = "",
    submitter = "",
    identifiers = [],
    scopeType = "",
    department = "",
    description = "",
    value = "",
    effort = "",
    priority = "",
    approved = "",
    rejected = "",
    reasonRejected = "",
    comments = ""
}) {
    const [expanded, setExpanded] = React.useState(false);
    const [cardColor, setCardColor] = React.useState("var(--lunikoMidGrey)");
    var statusAbbreviation = status.charAt(0).toUpperCase();

    const handleExpandClick = () => {
        setExpanded(!expanded);
        // console.log(priority);
        cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    };

    return (
        <Card sx={{
            // minWidth: 350,
            // maxWidth: 350,
            minHeight: "100px",
            maxHeight: expanded ? "calc(100vh - 146.52px)" : "100px",
            overflowY: "scroll",
            borderRadius: "10px",
            boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
            transition: "0.5s",
            backgroundColor: cardColor,
            ":hover": {
                backgroundColor: "var(--lunikoOrange)"
            },
            marginBottom: "20px"

        }}>
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
                title={"Request ID " + id}
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
                    <Typography paragraph>
                        <strong>Status<br /></strong> {status}
                    </Typography>
                    <Typography paragraph>
                        <strong>Company<br /></strong> {company}
                    </Typography>
                    <Typography paragraph>
                        <strong>Submitted By<br /></strong> {submitter}
                    </Typography>
                    <Typography paragraph>
                        <strong>Identifiers<br /></strong>
                        {identifiers.length !== 0
                            ? identifiers.map((val, key) => {
                                return <li
                                    key={key}
                                    style={{ listStyle: "none" }}>
                                    {val}
                                </li>
                            })
                            : "None"}
                    </Typography>
                    <Typography paragraph>
                        <strong>Date Submitted<br /></strong> {dateSubmitted}
                    </Typography>
                    <Typography paragraph>
                        <strong>Last Updated<br /></strong> {lastUpdated}
                    </Typography>
                    <Typography paragraph>
                        <strong>Scope Type<br /></strong> {scopeType}
                    </Typography>
                    <Typography paragraph>
                        <strong>Department<br /></strong> {department}
                    </Typography>
                    <Typography paragraph>
                        <strong>Description<br /></strong> {description}
                    </Typography>
                    <Typography paragraph>
                        <strong>Value<br /></strong> {value}
                    </Typography>
                    <Typography paragraph>
                        <strong>Effort<br /></strong> {effort}
                    </Typography>
                    <Typography paragraph>
                        <strong>Priority<br /></strong> {priority}
                    </Typography>
                    <Typography paragraph>
                        <strong>Approved<br /></strong> {approved}
                    </Typography>
                    <Typography paragraph>
                        <strong>Rejected<br /></strong> {rejected}
                    </Typography>
                    <Typography
                        style={{
                            display: reasonRejected.length === 0 ? "none" : "inline",
                        }}
                        paragraph>
                        <strong>Reason Rejected<br /></strong> {reasonRejected}
                    </Typography>
                    <Typography
                        paragraph>
                        <strong>Comments<br /></strong> {comments}
                    </Typography>
                    <Link to={`/update-owned-request/${uid}/${isIdentifier}/${isOwner}/${id}`}>
                        <button
                            className="update-request-button">
                            Update Request
                        </button>
                    </Link>
                </CardContent>
            </Collapse>
        </Card >
    );
}