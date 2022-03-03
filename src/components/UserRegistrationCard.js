import * as React from 'react';
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

export default function UserRegistrationCard({
    updatedFirstName = "",
    updatedLastName = "",
    updatedEmail = "",
    updatedPassword = "",
    registerConventionally = false,
    registerWithGoogle = false,
    registerButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [registerButtonColor, setRegisterButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeFirstName = (updatedText) => {
        updatedFirstName(updatedText);
    }

    const handleOnChangeLastName = (updatedText) => {
        updatedLastName(updatedText);
    }

    const handleOnChangeEmail = (updatedText) => {
        updatedEmail(updatedText);
    }

    const handleOnChangePassword = (updatedText) => {
        updatedPassword(updatedText);
    }

    const handleOnClickRegisterWithEmail = () => {
        registerConventionally(true);
    }

    const handleOnClickRegisterWithGoogle = () => {
        registerWithGoogle(true);
    }

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    //     // cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    // };

    React.useEffect(() => {
        if (!registerButtonDisabled) {
            setRegisterButtonColor("var(--lunikoBlue)");
        } else {
            setRegisterButtonColor("#BFBFBF");
        }
    }, [registerButtonDisabled]);

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
                    title={<strong>Please Fill In the Fields Below</strong>}
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
                        <MaterialTextField
                            label="First Name"
                            characterLimit={45}
                            placeholder="First Name"
                            inputValue={handleOnChangeFirstName}
                            multiline={false}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Last Name"
                            characterLimit={45}
                            placeholder="Last Name"
                            inputValue={handleOnChangeLastName}
                            multiline={false}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Email"
                            characterLimit={45}
                            placeholder="Email Address"
                            inputValue={handleOnChangeEmail}
                            multiline={false}
                            required={true}
                            requiresValidation={true}
                            type="email"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Password"
                            placeholder="Password"
                            inputValue={handleOnChangePassword}
                            multiline={false}
                            required={true}
                            type="password"
                            requiresValidation={true}>
                        </MaterialTextField>
                        <button
                            className="register-button"
                            onClick={handleOnClickRegisterWithEmail}
                            disabled={registerButtonDisabled}
                            style={{ backgroundColor: registerButtonColor }}>
                            Register with Email
                        </button>
                        <div
                            className="register-google"
                            onClick={registerWithGoogle}>
                            <img src={require("../img/google_logo.png")} alt="Google" />
                            <p>Register with Google</p>
                        </div>
                        <div className="popover-container">
                            <BootstrapPopover
                                popoverText=
                                {["A ", <strong>valid email address </strong>, "and password length of ", <strong>at least six characters </strong>,
                                    "are required for registration."]}>
                            </BootstrapPopover>
                        </div>
                        <div className="register-text-container">
                            <div>
                                Already have an account? <Link to="/">Login</Link> now.
                            </div>
                        </div>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}