import express from 'express';
import path from 'path';
import apiHenkiloRouter from './routes/apiHenkilo';
import virhekasittelija from './errors/virhekasittelija';
import cors from 'cors';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3105;

app.use(cors({origin : "http://localhost:3000"}));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.static('kuvat'))

app.use("/api/henkilot", apiHenkiloRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});