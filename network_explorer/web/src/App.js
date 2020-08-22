import React, {useState, useEffect} from 'react';
import { Button, 
         Grid, 
         makeStyles, 
         Typography, 
         MenuItem, 
         Accordion, 
         AccordionDetails, 
         AccordionSummary, 
         Container, 
         CssBaseline, 
         Collapse, 
         IconButton,
         Box,
         Table,
         TableBody,
         TableCell,
         TableContainer,
         TableHead,
         TableRow,
         Paper
        } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Form } from 'react-final-form';
import { TextField, Select, Checkboxes, CheckboxData } from 'mui-rff';
//import './App.css';



function App() {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    },
    textfield:{
      fontFamily: 'Arial, sans-serif',
      letterSpacing: '0.5px',
      lineHeight: '2rem'
    },
    share: {
      paddingTop: '2rem'
    },
    accordion: {
      /*
      flexBasis: '33.33%',
      flexShrink: 0
      */
    },
    submit: {
      marginTop: '32px',
      textAlign: 'center'
    },
    grid: {
      marginTop: '2rem',
      marginBottom: '2rem',
      fontWeight: 200
    },
    griditem: {

    },
    heading: {
      margin: 'auto',
      paddingBottom: '2rem'
    },
    nopadding: {
      paddingLeft: 0
    },
    displayblock: {
      display: 'block'
    },
    redcircle: {
      height: '25px',
      width: '25px',
      borderRadius: '50%',
      backgroundColor: 'red',
      display: 'inherit'
    },
    greencircle: {
      height: '25px',
      width: '25px',
      borderRadius: '50%',
      backgroundColor: 'green',
      display: 'inherit'
    },
    nodisplay: {
      display: 'none'
    },
    circle: {
      paddingRight: '1rem'
    },
    explore: {
      textDecoration: 'none'
    },
    tablebold: {
      fontWeight: 'bold'
    }
  }));

  const [shares, setShares] = useState([])
  const [advancedOptions, setAdvancedOptions] = useState(false)
  const [guest, setGuest] = useState(false)

  useEffect(() => {
    fetch('/admin/shares').then(response => response.json()).then(text => {console.log(text); setShares(text);} );
  }, []);

  const validateForm = (sharename, sharepath) => {
    const b = shares.filter(a => a.sharename === sharename || a.sharepath === sharepath ? false: true);
    return b.length === shares.length;
  };

  function onSubmit(values) {
    const isValid = validateForm(values["sharename"], values["sharepath"]);
    if (!isValid) {
      alert("Validation failed: duplicate entry for either share name or network location")
      return false;
    }



    if (values["sharetype"] === undefined) {
      values["sharetype"] = "cifs"
    }
    values["key"] = values["sharename"];
    values["isconnected"] = false;  
    values["guest"] = guest;


    

    const networkshare = {sharename: values["sharename"], sharetype: values["sharetype"], sharepath: values["sharepath"], guest: values["guest"], username: values["username"], password: values["password"]};
    console.log(networkshare);

    fetch('/admin/addnetworkshare', {
      method: "post", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(networkshare)
    }).then(response => response.text()).then(text => {
      if (text === "0") {
        values["isconnected"] = true;
        setShares([...shares, values]);
      }
      else {
        alert("Sorry. Can't connect to share. Double-check network details");
      }

    });
  }

  const guestAccess = [ {label: 'Anonymous Access', value: false}];

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onChangeData = (key, value, id) => {
    const nextState = shares.map(a => a.sharename === id ? { ...a, [key]: value } : a);
    setShares(nextState);
   };

  const guestChanged = () => (event) => {
    setGuest(!guest);
  }

   const onRemoveData = (id) => {
    const removedShare = shares.filter(a => a.sharename === id ? true:false);
    const nextState = shares.filter(a => a.sharename === id ? false:true);
    setShares(nextState);
    fetch('/admin/remove/' + removedShare[0]['sharename'], {
      method: "post"
    }).then(response => response.text()).then(text=>{});
   };

   const onExplore = (e) => {
     e.stopPropagation();
   };

   const onConnect = (index) => (e) => {

    e.stopPropagation();    

    let share = {sharename: shares[index]['sharename'], sharetype: shares[index]['sharetype'], sharepath: shares[index]['sharepath']};

     fetch('/admin/connect', {
      method: "post", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(share)       
     }).then(response => response.text()).then(text => {
       console.log("Mounted: " + text);
       if (text === "0" ) {
          share['isconnected'] = true;
          const newShares = shares.map(item => item['sharename'] === share['sharename']? share: item);
          console.log(newShares);
          setShares(newShares);
       }
     });
   };

  return (
<Container component="main" maxWidth="xs">
<CssBaseline />

    <Form
       onSubmit={onSubmit}
       render={({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
              
          <Grid container className={classes.grid}>
          <Typography component="h1" variant="h5" className={classes.heading}>Add Network Shares</Typography>
            <Grid item xs={12}  className={classes.textfield}>
              <TextField type="text" label="Share Name" name="sharename" helperText="eg. Music" required={true} variant="outlined"
            margin="normal"           InputProps={{
              classes: {
                input: classes.textfield,
              },
            }} />
            </Grid>
            <Grid item xs={12} >
              <TextField className={classes.textfield}  label="Network Location" name="sharepath" helperText="eg. //192.168.1.10/Music" required={true}             variant="outlined"
            margin="normal" InputProps={{
              classes: {
                input: classes.textfield,
              },
            }} color="primary" />
            </Grid>

            <Grid item xs={12}  className={classes.share}>
              <Checkboxes
                 label=""
                 name="guest"
                 required={false}
                 data={guestAccess}
                 checked={guest}
                 onChange={guestChanged()}
              /> 
              { !guest &&
              <div>
              <TextField className={classes.textfield}  label="Username" name="username" helperText="" required={false}             variant="outlined"
            margin="normal" InputProps={{
              classes: {
                input: classes.textfield,
              },
            }} color="primary" />
              <TextField className={classes.textfield}  label="Password" name="password" helperText="" required={false}             variant="outlined"
            margin="normal" InputProps={{
              classes: {
                input: classes.textfield,
              },
            }} color="primary" />                                    
          </div>
          }
          
            </Grid>
          
            <Grid item xs={12}>
            <IconButton className={classes.nopadding} onClick={() => setAdvancedOptions(!advancedOptions)}><ExpandMoreIcon/></IconButton>
            <span classes={classes.nopadding}>Advanced Options</span>
              <Collapse in={advancedOptions}>
              <Select  name="sharetype" label="Share Type" value="cifs" required={true}>
               <MenuItem value="cifs">Windows Share</MenuItem>
             </Select>
              </Collapse>
            </Grid>                     
            <Grid item xs={12} className={classes.submit}>
               <Button variant="contained" color="primary" type="submit">
					      Submit
					     </Button>
            </Grid>
          </Grid>          
        </form>    
       )}
    >

    </Form>


    <Grid container className={classes.grid}>
      <Typography className={classes.heading} component="h1" variant="h5">Network Shares</Typography>
     { shares.map((item, index) => (
       <Grid  key={item.sharename} item xs={12}>
         <div className={classes.nodisplay}>{item.isconnected}</div>
    <Accordion key={item.sharename}  expanded={expanded === item.sharename} onChange={handleChange(item.sharename)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          alignItems="center"
        >
          <Box className={classes.circle}>                    { item.isconnected &&
          <span className={classes.greencircle}></span>
          }
          { !item.isconnected &&
          <span className={classes.redcircle}></span> 
          } 
          </Box>

        <Box alignItems="center"  width="100%">
          <Typography>
          {item.sharename}
          </Typography>
        </Box>
        <Box flexShrink={1}>
          { item.isconnected &&
          <a className={classes.explore} href={`/${item.sharename}`} target="_blank"><Button variant="contained" color="secondary" onClick={onExplore}>Explore</Button></a>
          }
          { !item.isconnected &&
          <a className={classes.explore}><Button color="primary" onClick={onConnect(index)}>Connect</Button></a>
          }       
        </Box>
        
        </AccordionSummary>
        <AccordionDetails className={classes.displayblock}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell classes={{root: classes.tablebold}}>Property</TableCell>
                  <TableCell classes={{root: classes.tablebold}}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              <TableRow>
                <TableCell classes={{root: classes.tablebold}}>Share Name</TableCell>
                <TableCell>{item.sharename}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell classes={{root: classes.tablebold}}>Share Location</TableCell>
                <TableCell>{item.sharepath}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell classes={{root: classes.tablebold}}>Share Type</TableCell>
                <TableCell>{item.sharetype}</TableCell>
              </TableRow>   
              </TableBody>                         
            </Table>

          </TableContainer>
          <Button display="inline-block" onClick={() => { onRemoveData(item.sharename)}}>Remove</Button>
        </AccordionDetails>
      </Accordion>
      </Grid>
     ))}
    </Grid>
     
    </Container>
  );
}

export default App;
