/* eslint-disable react/prefer-stateless-function */

import React from "react";
import MaskedInput from "react-text-mask";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Cleave from "cleave.js/react";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

function CleaveInput(props) {
  const { inputRef, ...rest } = props;
  return (
    <Cleave
      ref={inputRef}
      // placeholder="Enter your credit card number"
      options={{
        numeral: true,
        numeralDecimalMark: ",",
        delimiter: ".",
        numeralPositiveOnly: true
      }}
      {...rest}
    />
  );
}

CleaveInput.propTypes = {
  inputRef: PropTypes.func.isRequired
};

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      mask={rawValue => {
        const mask = createNumberMask({
          thousandsSeparatorSymbol: ".",
          decimalSymbol: ",",
          prefix: "",
          allowDecimal: true,
          decimalLimit: 4
          // requireDecimal: true
        });
        const formedMask = mask(rawValue);
        console.log(formedMask);
        return formedMask;
      }}
      placeholderChar={"\u2000"}
      // showMask
      render={(ref, props) => <CleaveInput inputRef={ref} {...props} />}
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
};

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

class FormattedInputs extends React.Component {
  state = {
    textmask: "",
    numberformat: "1320",
    cleave: "123"
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { textmask, numberformat, cleave } = this.state;

    return (
      <div className={classes.container}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="formatted-text-mask-input">
            react-text-mask
          </InputLabel>
          <Input
            value={textmask}
            onChange={this.handleChange("textmask")}
            id="formatted-text-mask-input"
            inputComponent={TextMaskCustom}
          />
        </FormControl>
        <TextField
          className={classes.formControl}
          label="react-number-format"
          value={numberformat}
          onChange={this.handleChange("numberformat")}
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />

        <TextField
          className={classes.formControl}
          label="react-number-format"
          value={cleave}
          onChange={this.handleChange("cleave")}
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: CleaveInput
          }}
        />
      </div>
    );
  }
}

FormattedInputs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormattedInputs);
