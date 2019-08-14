import * as React from "react";
import { makeStyles, Typography, Button } from "@material-ui/core";
import { blueGrey, indigo } from "@material-ui/core/colors";
import HomeIcon from "@material-ui/icons/Home";

const useStyle = makeStyles(theme => ({
  root: {
    height: theme.spacing(8),
    background: "#FFF",
    display: "flex",
    alignItems: "center",
    width: `calc(100% - ${2 * theme.spacing(4)})`,
    padding: theme.spacing(0, 4),
    margin: "0",
    boxShadow: "0px 5px 10px rgba(0,0,0,.025)"
  },
  logo: {
    fontWeight: "600",
    fontSize: "16px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: blueGrey[600]
  }
}));

export const Header = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Typography className={classes.logo}>Frog</Typography>
    </div>
  );
};
