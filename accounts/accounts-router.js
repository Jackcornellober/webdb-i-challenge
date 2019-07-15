const express = require('express');
const knex = require('knex')

const db = require('../data/dbConfig.js');

const dbConnection = knex({
    client: 'sqlite3',
    connection: {
        filename: './data/budget.db3',
    },
    useNullAsDefault: true,
});

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log(req.query)

    dbConnection('accounts').limit(parseInt(req.query.limit, 10)).orderBy('id' || req.query.sortby, req.query.sortdir).offset(0 || parseInt((req.query.page*2 - 2), 10)).then(accounts => {
        res.status(200).json(accounts);
    })
    .catch(error => {
        res.status(500).json(error);
    })
});

router.get('/:id', (req, res) => {
    dbConnection('accounts').where({ id: req.params.id  }).first().then(account => {
        res.status(200).json({account})
    })
    .catch(error => {
        res.status(500).json(error)
    })
});

router.post('/', (req, res) => {

    const account = req.body 

    dbConnection('accounts').insert(account, 'id').then(arrayOfIds => {
        const idOfLastRecordInserted = arrayOfIds[0];

        res.status(201).json(idOfLastRecordInserted)
    })
    .catch(error => res.status(500).json(error))
});

router.put('/:id', (req, res) => {
    dbConnection('accounts').where({id:req.params.id}).update(req.body).then(count => {
        if(count > 0) {
        res.status(200).json({message: `${count} account(s) updated`});
        }
    })
});

router.delete('/:id', (req, res) => {
    dbConnection('accounts').where({ id: req.params.id,  }).del().then(count => {
        res.status(200).json({message: `${count} account(s) deleted`})
    })
    .catch(error => {
        res.status(500).json(error)
    })
});

module.exports = router;