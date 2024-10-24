import express from 'express';
import { Virhe } from '../errors/virhekasittelija';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiHenkiloRouter : express.Router = express.Router();

apiHenkiloRouter.use(express.json());

apiHenkiloRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

     try {

        if (await prisma.henkilo.count({
            where : {
                id : Number(req.params.id)
            }
        }) === 1) {
            res.json(await prisma.henkilo.findUnique({
                where : {
                    id : Number(req.params.id)
                }
            }))
        } else {
            next(new Virhe(400, "Virheelinen id"));
        }
        
    } catch (e: any) {
        next(new Virhe());
    }
    

});

apiHenkiloRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.henkilo.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiHenkiloRouter;