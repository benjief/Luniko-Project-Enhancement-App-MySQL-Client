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
import MaterialTextField from './MaterialTextField';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

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

export default function UserLoginCard({
    updatedEmail = "",
    emailAuthenticationError = "",
    updatedPassword = "",
    passwordAuthenticationError = "",
    conventionalLoginSelected = false,
    googleLoginSelected = false,
    loginButtonDisabled = true,
    loginWithGoogleButtonDisabled = false,
    displayLoginFadingBalls = false,
    displayGoogleFadingBalls = false
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [loginButtonColor, setLoginButtonColor] = React.useState("#BFBFBF");
    const [googleLogo, setGoogleLogo] = React.useState("google_logo.png");

    const handleOnChangeEmail = (updatedText) => {
        updatedEmail(updatedText);
    }

    const handleOnChangePassword = (updatedText) => {
        updatedPassword(updatedText);
    }

    const handleOnClickLogin = () => {
        conventionalLoginSelected(true);
    }

    const handleOnClickLoginWithGoogle = () => {
        googleLoginSelected(true);
    }

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    //     // cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    // };

    React.useEffect(() => {
        if (!loginButtonDisabled) {
            setLoginButtonColor("var(--lunikoBlue)");
        } else {
            setLoginButtonColor("#BFBFBF");
        }
        if (!loginWithGoogleButtonDisabled) {
            setGoogleLogo("google_logo.png");
        } else {
            setGoogleLogo("google_logo_greyscale.png");
        }
    }, [loginButtonDisabled, loginWithGoogleButtonDisabled]);

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
                    title={"User Login"}
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
                            label="Email"
                            // placeholder="Email Address"
                            inputValue={handleOnChangeEmail}
                            multiline={false}
                            type="email"
                            authenticationField={true}
                            emailAuthenticationError={emailAuthenticationError}
                            shrinkInputLabel={false}
                            required={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Password"
                            // placeholder="Password"
                            inputValue={handleOnChangePassword}
                            multiline={false}
                            type="password"
                            authenticationField={true}
                            passwordAuthenticationError={passwordAuthenticationError}
                            shrinkInputLabel={false}
                            required={true}>
                        </MaterialTextField>
                        <button
                            className="login-button"
                            onClick={handleOnClickLogin}
                            disabled={loginButtonDisabled}
                            style={{ backgroundColor: loginButtonColor }}>
                            {displayLoginFadingBalls
                                ? <div className="fading-balls-container">
                                    <FadingBalls
                                        className="spinner"
                                        color="white"
                                        width="7px"
                                        height="7px"
                                        duration="0.5s"
                                    />
                                </div>
                                : <p>Login</p>}
                        </button>
                        <div
                            className="login-google"
                            onClick={handleOnClickLoginWithGoogle}>
                            {displayGoogleFadingBalls
                                ? <div className="fading-balls-container">
                                    <FadingBalls
                                        className="spinner"
                                        color="var(--lunikoOrange)"
                                        width="7px"
                                        height="7px"
                                        duration="0.5s"
                                    />
                                </div>
                                : <div style={{ display: "flex" }}>
                                    <img src={require("../img/" + googleLogo)} alt="Google" />
                                    <p>Login with Google</p>
                                </div>}
                        </div>
                        <div className="login-text-container">
                            <div>
                                <Link to="/reset">Forgot Password</Link>
                            </div>
                            <div>
                                Don't have an account? <Link to="/register">Register</Link> now.
                            </div>
                        </div>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}