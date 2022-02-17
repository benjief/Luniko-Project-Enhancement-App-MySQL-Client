import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MaterialTextField({
  className = "",
  label = "",
  helperText = "",
  characterLimit = 500,
  placeholder = "",
  defaultValue = "",
  inputValue = "",
  multiline = false,
  type = "text",
  required = false,
  showCharCounter = false
}) {
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  // const [errorMsg, setErrorMsg] = React.useState("");
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(defaultValue.length);

  const handleOnChange = (value) => {
    if (value) {
      if (type === "email") {
        checkEmailValidity(value);
      } else if (type === "password") {
        checkPasswordValidity(value);
      }
      handleValidValue(value);
    } else {
      let helperText = "Required Field"
      handleInvalidValue(value, helperText);
    }
  }

  const checkEmailValidity = (email) => {
    if (email.match(/[^@]+@[^@]+\./)) {
      handleValidValue(email);
    } else {
      let helperText = "Please enter a valid email address"
      handleInvalidValue(email, helperText);
    }
  }

  const checkPasswordValidity = (password) => {
    if (password.length > 5) {
      handleValidValue(password);
    } else {
      let helperTexst = "Passwords must be at least 6 characters long"
      handleInvalidValue(password, helperText);
    }
  }

  const handleInvalidValue = (value, errorMsgText) => {
    inputValue("");
    setInputLength(value.length);
    if (required) {
      setErrorEnabled(true);
      setDisplayedHelperText(errorMsgText);
    }
  }

  const handleValidValue = (value) => {
    inputValue(value);
    setInputLength(value.length);
    setErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }

  return (
    <Box
      className={className}
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
      <div className="material-text-field">
        <TextField
          label={label}
          defaultValue={defaultValue}
          type={type}
          onChange={(event) => handleOnChange(event.target.value)}
          multiline={multiline}
          error={errorEnabled}
          required={required}
          inputProps={{
            maxLength: characterLimit
          }}
          helperText={showCharCounter ? !errorEnabled ? displayedHelperText !== ""
            ? [displayedHelperText, ". Limit: ", inputLength, "/", characterLimit] : ["Limit: ", inputLength, "/", characterLimit]
            : displayedHelperText
            : displayedHelperText} />
      </div>
    </Box>
  );
}
