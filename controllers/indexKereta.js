const supabase = require('../database');


const kereta = async(req, res, next) => {
  const {data, error} = await supabase.from('kota').select();
  console.log(data);
  return res.render("keretaF/kereta", {kotas: data});
}

const pembayaranK = async(req, res, next) => {
  return res.render("keretaF/pembayaranKereta")
}

const tiketK = async(req, res, next) => {
  return res.render("keretaF/tiketKereta")
}

const datapemesanK = async(req, res, next) => {
  return res.render("keretaF/datapemesanK")
}

const cetakTiketK = async (req, res, next) => {
  return res.render("keretaF/cetakTiketK")
}

// function untuk cari tiket kereta 
const cariTiketK = async (req, res, next) => {
  const asal = req.body.asalK;
  const tujuan = req.body.tujuanK;
  const berangkat = req.body.berangkatK;
  
  const berangkatZ = berangkat + "Z";

  const tanggal = new Date(berangkatZ);

  const tanggalK = () => {
    return [tanggal.getDate(), tanggal.getMonth() + 1, tanggal.getFullYear()].join('-')
  }


  const dewasa = req.body.dewasaK;
  const anak = req.body.anakK;
  const bayi = req.body.bayiK;

  const {data: kotaK, error: erroKotaK} = await supabase.from('kota').select().in('stationID', [`${asal}`, `${tujuan}`]);
  const {data: allData, error: errorallData} = await supabase
                  .from('ruteKereta')
                  .select(`*, 
                          kereta(namaKereta)`)
                  .match({kotaAsal : `${asal}`, kotaTujuan: `${tujuan}`} );

  console.log(allData);
  console.log(kotaK)
  return res.render('keretaF/tiketKereta', {
    asalK: asal,
    tujuanK: tujuan,
    berangkatK: tanggalK(),
    dewasaK: dewasa,
    anakK: anak,
    bayiK: bayi,
    kota: kotaK,
    tiketKs: allData
  });
}

module.exports = {
  kereta,
  pembayaranK,
  tiketK,
  datapemesanK,
  cetakTiketK,
  cariTiketK,
}