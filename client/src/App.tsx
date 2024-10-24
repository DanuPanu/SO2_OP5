import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';

interface Henkilo {
    id : number,
    etunimi : string
    sukunimi : string
    titteli : string
    sukupuoli : string
    puhelin : string
    aloittanutPvm : string
    aloittanutAikaleima : string
    sahkoposti : string
    kuva : string
}

interface ApiData {
  henkilot : Henkilo[]
  virhe : string
  haettu : boolean
}

const App : React.FC = () : React.ReactElement => {

  const [valittuHenkilo, setValittuHenkilo] = useState<Henkilo>({
                                  id : 1,
                                  etunimi : "daniel",
                                  sukunimi : "sarpaneva",
                                  titteli : "opiskelija",
                                  sukupuoli : "mies",
                                  puhelin : "1234",
                                  aloittanutPvm : "21.12.2009",
                                  aloittanutAikaleima : "121212",
                                  sahkoposti : "jepjep@joo.com",
                                  kuva : "0.jpeg"
  });

  const [open, setOpen] = useState<boolean>(false);

  const paiva : Date = new Date();
  let dateParts : string[] = valittuHenkilo.aloittanutPvm.split(".");
  let day = dateParts[0];
  let month = dateParts[1]
  let year = dateParts[2]
  let paiva2 : Date = new Date(Number(year), Number(month), Number(day))
  const differenceInMilliseconds = paiva.getTime() - paiva2.getTime();
  const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const differenceInYears = Math.floor(differenceInDays / 365);


  console.log(paiva)

  const handleClickOpen = (ihminen : Henkilo) => {
    setOpen(true)
    setValittuHenkilo(ihminen)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [apiData, setApiData] = useState<ApiData>({
                                                    henkilot : [],
                                                    virhe : "",
                                                    haettu : false
                                                  });

  const apiKutsu = async (metodi? : string, henkilo? : Henkilo, id? : number) : Promise<void> => {

    setApiData({
      ...apiData,
      haettu : false
    });

    let url = (id) ? `http://localhost:3105/api/henkilot/${id}` : `http://localhost:3105/api/henkilot`;

    let asetukset : any = { 
      method : metodi || "GET"
    };
    
    try {

      const yhteys = await fetch(url, asetukset);

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          henkilot : await yhteys.json(),
          haettu : true
        });

      } else {

        let virheteksti :string = "";

        switch (yhteys.status) {

          case 404 : virheteksti = "Palvelimelta ei löydy henkilötietoja"; break;
          default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;

        }

        setApiData({
          ...apiData,
          virhe : virheteksti,
          haettu : true
        });

      }

    } catch (e : any) {

      setApiData({
        ...apiData,
        virhe : "Palvelimeen ei saada yhteyttä",
        haettu : true
      });

    }

  }

  useEffect(() => {
    apiKutsu();
  }, []);

  return (
    <Container>
      
      <Typography variant="h5">Tehtävä 5 henkilöhaku</Typography>

      {(Boolean(apiData.virhe))
        ? <Alert severity="error">{apiData.virhe}</Alert>
        : (apiData.haettu) 
          ? <Stack
              spacing={2}>
              <List>
                {apiData.henkilot.map((henkilo : Henkilo, idx : number) => {
                  return <ListItem 
                            key={idx}  
                          >
                          <ListItemText 
                            primary={`${henkilo.etunimi} ${henkilo.sukunimi}`}
                            secondary={henkilo.titteli}
                          />
                          <ListItemAvatar>
                            <Avatar src={`http://localhost:3105/${henkilo.kuva}`} alt={`${henkilo.etunimi} ${henkilo.sukunimi}`} />
                          </ListItemAvatar> 

                          <Button onClick={() => {handleClickOpen(henkilo)}}>Lisätietoja</Button>

                            <Dialog open={open} onClose={handleClose}>
                              <DialogTitle>Tarkemmat tiedot</DialogTitle>
                              <DialogContent>
                                  <Avatar src={`http://localhost:3105/${valittuHenkilo.kuva}`} />
                                  <Typography variant="h6">{`${valittuHenkilo.etunimi} ${valittuHenkilo.sukunimi}`}</Typography>
                                  <Typography variant="subtitle1">{valittuHenkilo.titteli}</Typography>
                                  <Typography variant="body1">Puhelin: {valittuHenkilo.puhelin}</Typography>
                                  <Typography variant="body1">Sähköposti: {valittuHenkilo.sahkoposti}</Typography>
                                  <Typography variant="body1">Työsuhteen kesto: {differenceInYears} vuotta</Typography>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={handleClose}>Sulje</Button>
                              </DialogActions>
                            </Dialog>
                             </ListItem> 
                          })}               
                
               
              </List>
            </Stack>
          : <Backdrop open={true}>
              <CircularProgress color='inherit'/>
            </Backdrop>
      }

    </Container>
  );
}

export default App;