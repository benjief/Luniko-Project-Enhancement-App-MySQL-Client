import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
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
import MaterialMultiSelect from './MaterialMultiSelect';
import BootstrapPopover from "../components/BootstrapPopover";

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
    uid = "",
    scopeTypeOptions = [],
    departmentOptions = [],
    valueOptions = [],
    identifierOptions = [],
    updatedCompany = "",
    selectedScopeType = "",
    selectedDepartment = "",
    updatedDescription = "",
    selectedValue = 0,
    selectedIdentifiers = [],
    requestToSubmit = "",
    submitButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeCompany = (updatedText) => {
        updatedCompany(updatedText);
    }

    const handleOnSelectScopeType = (valueFromSelector) => {
        selectedScopeType(valueFromSelector);
    }

    const handleOnSelectDepartment = (valueFromSelector) => {
        selectedDepartment(valueFromSelector);
    }

    const handleOnChangeDescription = (updatedText) => {
        updatedDescription(updatedText);
    }

    const handleOnSelectValue = (valueFromSelector) => {
        selectedValue(valueFromSelector);
    }

    const handleOnChangeIdentifiers = (valuesFromSelector) => {
        selectedIdentifiers(valuesFromSelector);
    }

    const handleSubmitRequest = () => {
        requestToSubmit(uid);
    }

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    //     // cardColor === "var(--lunikoMidGrey)" ? setCardColor("var(--lunikoOrange)") : setCardColor("var(--lunikoMidGrey)");
    // };

    React.useEffect(() => {
        if (!submitButtonDisabled) {
            setSubmitButtonColor("var(--lunikoBlue)");
        } else {
            setSubmitButtonColor("#BFBFBF");
        }
    }, [submitButtonDisabled]);

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
                backgroundColor: "var(--lunikoOrange)",
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
                    title="Fill In the Fields Below"
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
                            label="Company Name"
                            characterLimit={45}
                            placeholder="Company Name"
                            inputValue={handleOnChangeCompany}
                            multiline={false}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialSingleSelect
                            label="Scope Type"
                            placeholder="Scope Type"
                            singleSelectOptions={scopeTypeOptions}
                            selectedValue={handleOnSelectScopeType}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Department"
                            placeholder="Department"
                            singleSelectOptions={departmentOptions}
                            selectedValue={handleOnSelectDepartment}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Value"
                            placeholder="Value"
                            singleSelectOptions={valueOptions}
                            selectedValue={handleOnSelectValue}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialMultiSelect
                            label="Add Identifiers"
                            placeholder="Add Identifiers"
                            multiSelectOptions={identifierOptions}
                            selectedValues={handleOnChangeIdentifiers}
                            required={false}>
                        </MaterialMultiSelect>
                        <MaterialTextField
                            className="description"
                            label="Description"
                            characterLimit={1000}
                            placeholder="Description"
                            inputValue={handleOnChangeDescription}
                            multiline={true}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <button
                            className="submit-request-button"
                            onClick={handleSubmitRequest}
                            disabled={submitButtonDisabled}
                            style={{ backgroundColor: submitButtonColor }}>
                            Submit Request
                        </button>
                        <div className="popover-container">
                            <BootstrapPopover
                                popoverText=
                                {[<strong>All identifiers </strong>, "added to this request will be ",
                                    "able to view it and receive updates pertaining to it."]}>
                            </BootstrapPopover>
                        </div>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}