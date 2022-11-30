const express = require('express');
const { celebrate } = require('celebrate');
const router = express.Router();

// tanpa login
const { getIndex, cekOrder,
} = require('../controllers/indexController');

// source destinasi tanpa login
const { destinasiBali,  destinasiJakarta, destinasiLombok
, destinasiJogja, destinasiBogor} = require('../controllers/indexDestinasi');

//source kereta
const { kereta, pembayaranK, tiketK, datapemesanK, cetakTiketK, cariTiketK } = require('../controllers/indexKereta');


// source pesawat 
const { pesawat, datapemesanP, pembayaranP, cetakTiketP, cariTiket } = require('../controllers/indexPesawat');


// source login
const { loginReg } = require('../controllers/indexLogin');


// tarik file ejs disini
// index.ejs
router.get("/", getIndex);

// cekorder.ejs
router.get("/cekorder", cekOrder);

// destinasi ejs
router.get("/destinasibali", destinasiBali);
router.get("/destinasijakarta", destinasiJakarta);
router.get("/destinasibogor", destinasiBogor);
router.get("/destinasijogja", destinasiJogja);
router.get("/destinasilombok", destinasiLombok);


// folder kereta
router.get("/kereta", kereta);
router.post("/kereta/tiket", cariTiketK);
router.get("/kereta/tiket/data/:ruteK/:berangkatK/:dewasaK/:anakK/:bayiK", datapemesanK);
router.post("/kereta/tiket/bayar/:ruteK/:berangkatK/:dewasaK/:anakK/:bayiK", pembayaranK);
router.get("/kereta/tiket/e-tiket", cetakTiketK);


// folder pesawat

router.get("/pesawat", pesawat);
router.post("/pesawat/tiket", cariTiket);
router.get("/pesawat/tiket/data/:ruteP/:berangkatP/:dewasaP/:anakP/:bayiP", datapemesanP);
router.post("/pesawat/tiket/bayar/:ruteP/:berangkatP/:dewasaP/:anakP/:bayiP", pembayaranP);
router.post("/pesawat/tiket/e-tiket/:orderID", cetakTiketP);

// folder users
router.get("/login", loginReg);


module.exports = router;