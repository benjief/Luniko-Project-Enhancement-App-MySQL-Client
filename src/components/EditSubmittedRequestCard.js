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
import MaterialMultiSelect from './MaterialMultiSelect';
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

export default function EditOwnedRequestCard({
    id = "",
    scopeTypeOptions = [],
    departmentOptions = [],
    valueOptions = [],
    identifierOptions = [],
    company = "",
    updatedCompany = "",
    scopeType = "",
    updatedScopeType = "",
    department = "",
    updatedDepartment = "",
    description = "",
    updatedDescription = "",
    value = "",
    updatedValue = 0,
    identifiers = [],
    addedIdentifiers = [],
    requestToUpdate = "",
    updateButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [updateButtonColor, setUpdateButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeCompany = (updatedText) => {
        updatedCompany(updatedText);
    }

    const handleOnSelectScopeType = (valueFromSelector) => {
        updatedScopeType(valueFromSelector);
    }

    const handleOnSelectDepartment = (valueFromSelector) => {
        updatedDepartment(valueFromSelector);
    }

    const handleOnChangeDescription = (updatedText) => {
        updatedDescription(updatedText);
    }

    const handleOnSelectValue = (valueFromSelector) => {
        updatedValue(valueFromSelector);
    }

    const handleOnChangeIdentifiers = (valuesFromSelector) => {
        addedIdentifiers(valuesFromSelector);
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
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
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
                        <MaterialTextField
                            label="Company Name"
                            characterLimit={45}
                            placeholder="Company Name"
                            defaultValue={company}
                            inputValue={handleOnChangeCompany}
                            multiline={false}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialSingleSelect
                            label="Scope Type"
                            placeholder="Scope Type"
                            defaultValue={scopeType}
                            singleSelectOptions={scopeTypeOptions}
                            selectedValue={handleOnSelectScopeType}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Department"
                            placeholder="Department"
                            defaultValue={department}
                            singleSelectOptions={departmentOptions}
                            selectedValue={handleOnSelectDepartment}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Value"
                            placeholder="Value"
                            defaultValue={value}
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
                            placeholder="Description"
                            defaultValue={description}
                            characterLimit={1000}
                            inputValue={handleOnChangeDescription}
                            multiline={true}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
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