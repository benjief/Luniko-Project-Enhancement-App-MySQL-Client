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
  showCharCounter = false,
  requiresValidation = false,
  authenticationField = false,
  emailAuthenticationError = "",
  passwordAuthenticationError = "",
  shrinkInputLabel = true,
  isDisabled = false
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  // const [errorMsg, setErrorMsg] = React.useState("");
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(defaultValue.length);
  const [inputLabelShrunk, setInputLabelShrunk] = React.useState(defaultValue === "" ? false : true);

  const handleOnChange = (value) => {
    if (value.trim() !== "") {
      if (type === "email" && requiresValidation) {
        checkEmailValidity(value);
      } else if (type === "password" && requiresValidation) {
        checkPasswordValidity(value);
      } else {
        handleValidValue(value);
      }
    } else {
      if (required || authenticationField) {
        setDisplayedHelperText("Required Field");
        handleEmptyOrInvalidValue(value);
      }
    }
  }

  const handleOnBlur = () => {
    if (!shrinkInputLabel || shrinkInputLabel && (!value || value.trim() === "")) {
      setInputLabelShrunk(false);
    }
    if (required && value.trim() === "") {
      setErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }

  const checkEmailValidity = (email) => {
    if (email.match(/[^@]+@[^@]+\.+[^@]/)) {
      handleValidValue(email);
    } else {
      setDisplayedHelperText("Please enter a valid email address");
      handleEmptyOrInvalidValue(email);
    }
  }

  const checkPasswordValidity = (password) => {
    if (password.length > 5) {
      handleValidValue(password);
    } else {
      setDisplayedHelperText("Passwords must be at least 6 characters long");
      handleEmptyOrInvalidValue(password);
    }
  }

  const handleEmptyOrInvalidValue = (value) => {
    setValue("");
    inputValue("");
    setInputLength(0);
    if (value) {
      setValue(value);
      setInputLength(value.length);
    }
    if (required) {
      setErrorEnabled(true);
    }
  }

  const handleValidValue = (value) => {
    setValue(value);
    inputValue(value);
    setInputLength(value.length);
    setErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }

  const handleOnFocus = () => {
    if (!isDisabled && shrinkInputLabel) {
      setInputLabelShrunk(shrinkInputLabel);
    }
  }

  React.useEffect(() => {
    if (authenticationField) {
      if (emailAuthenticationError !== "") {
        setErrorEnabled(true);
        setDisplayedHelperText(emailAuthenticationError);
      } else if (passwordAuthenticationError !== "") {
        setErrorEnabled(true);
        setDisplayedHelperText(passwordAuthenticationError);
      } else {
        if (value.trim() !== "") {
          setErrorEnabled(false);
          setDisplayedHelperText("");
        }
      }
    }
  }, [authenticationField, emailAuthenticationError, passwordAuthenticationError, errorEnabled, value])

  return (
    <Box
      onSubmit={event => { event.preventDefault(); }}
      className={className}
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
      <div className="material-text-field">
        <TextField
          label={(value && !shrinkInputLabel) ? "" : label}
          InputLabelProps={
            {
              shrink: inputLabelShrunk
            }
          }
          defaultValue={defaultValue}
          type={type}
          onClick={handleOnFocus}
          onChange={(event) => handleOnChange(event.target.value)}
          onBlur={(event) => handleOnBlur(event.target.value)}
          multiline={multiline}
          placeholder={placeholder}
          error={errorEnabled}
          required={required}
          inputProps={{
            maxLength: characterLimit
          }}
          helperText={showCharCounter ? !errorEnabled ? displayedHelperText !== ""
            ? [displayedHelperText, ". Limit: ", inputLength, "/", characterLimit] : ["Limit: ", inputLength, "/", characterLimit]
            : displayedHelperText
            : displayedHelperText}
          disabled={isDisabled} />
      </div>
    </Box>
  );
}
