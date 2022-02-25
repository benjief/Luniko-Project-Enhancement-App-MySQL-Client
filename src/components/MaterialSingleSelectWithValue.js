import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Popper } from '@mui/material';

export default function MaterialSingleSelect(
    {
        label = "",
        placeholder = "",
        defaultValue = "",
        value = "",
        singleSelectOptions = [],
        selectedValue = "",
        isDisabled = false,
        required = false
    }

) {
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [displayedValue, setDisplayedValue] = React.useState(value);

    const customPopper = function (props) {
        return <Popper
            {...props}
            placement="bottom"
            disablePortal={true}
        ></Popper>
    };

    const handleOnChange = (object) => {
        if (object) {
            console.log(object);
            selectedValue(object.value);
            setErrorEnabled(false);
            setErrorMsg("");
            setDisplayedValue(object);
        } else {
            if (required) {
                selectedValue("");
                setErrorEnabled(true);
                setErrorMsg("Required Field");
                setDisplayedValue("");
            }
        }
    }

    return (
        <Autocomplete
            // Override of option equality is needed for MUI to properly compare options and values
            isOptionEqualToValue={(option, value) => option.id === value.id}
            PopperComponent={customPopper}
            disablePortal
            disabled={isDisabled}
            // id="combo-box-demo"
            options={singleSelectOptions}
            defaultValue={defaultValue}
            value={displayedValue}
            sx={{ width: "100%", marginBottom: "10px" }}
            onChange={(event, object) => handleOnChange(object)}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={errorEnabled}
                    helperText={errorMsg}
                />}
        />
    );
}