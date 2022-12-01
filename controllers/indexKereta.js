const supabase = require('../database');


const kereta = async(req, res, next) => {
  const {data, error} = await supabase.from('kota').select();
  console.log(data);
  return res.render("keretaF/kereta", {kotas: data});
}


// function untuk insert data penumpang dan pemesan
const pembayaranK = async(req, res, next) => {
  let key = req.params.ruteK;
  let berangkat = req.params.berangkatK;
  let dewasa = Number(req.params.dewasaK);
  let anak = Number(req.params.anakK);
  let bayi= Number(req.params.bayiK);
  // data pemesan
  let titlePemesan = req.body.titlePemesan;
  let namadepPemesan = req.body.namaDepanPemesan;
  let namabelPemesan = req.body.namaBelakangPemesan;
  let notelPemesan = req.body.notelPemesan;
  let emailPemesan = req.body.emailPemesan;
  
  let jumlahPenumpang = dewasa + anak + bayi;

  // function untuk insert data ke table pemesan
    const {data: insPemesan, error: errInsPemesan} = await supabase 
    .from('pemesan')
    .insert([
      { 
        titlePemesan: `${titlePemesan}`,
        namadepPemesan: `${namadepPemesan}`,
        namabelPemesan: `${namabelPemesan}`,
        notelPemesan: `${notelPemesan}`,
        emailPemesan: `${emailPemesan}`
      }
    ])
    .select()
  console.log(insPemesan)

  // fungsi untuk input data penumpang
  let titleK = req.body.titlePenumpang;
  let namadepK = req.body.namaDepanPenumpang;
  let namabelK = req.body.namaBelakangPenumpang;

  for(let i = 0; i != jumlahPenumpang; i++){
    const {data: insTiket, error: errInsTiket} = await supabase
      .from('tiketKereta')
      .insert([
        {
          pemesanID: `${insPemesan[0].pemesanID}`,
          ruteK: `${key}`,
          tanggalK: `${berangkat}`,
          titleK: `${titleK[i]}`,
          namadepK: `${namadepK[i]}`, 
          namabelK:`${namabelK[i]}`,
        }
        ])
        .select()
        console.log('insert ke ' + i)
        console.log(insTiket)
    }  

// fungsi untuk insert table transaksi

  // fungsi ini untuk mencari tiketID yang satu pemesanID
  const {data: tiketID, error: errTikeID} = await supabase
    .from('tiketKereta')
    .select()
    .match({
      pemesanID: insPemesan[0].pemesanID
    })
  console.log(tiketID)
    var arr = [];
    
    for(let i = 0; i != tiketID.length; i++) {
      arr.push(tiketID[i].tiketpid)
    }
    console.log(arr)
    
    // fungsi untuk insert data ID Tiket ke dalam table transaksi
    const {data: insTrans, error: errInsTrans} = await supabase
      .from('transaksi')
      .insert([
        {
          noTiket: arr,
          keterangan: 'kereta',
        }
      ])
      .select()
   console.log(insTrans) 
    

  // fungsi untuk menampilkan data rute pesawat                                             
  const { data: ruteKereta, error: errorRute } = await supabase
    .from('ruteKereta')
    .select(`*, kereta (namaKereta) , asal: kotaAsal (namaKota), tujuan: kotaTujuan (namaKota)`)
    .eq('ruteID', `${key}`)
  console.log(ruteKereta)


  return res.render("keretaF/pembayaranKereta",
  {
    dataK: ruteKereta, 
    tanggalK: berangkat, 
    penumpang: jumlahPenumpang,
    orderID: insTrans,
  })
}


const datapemesanK = async(req, res, next) => {
  let key = req.params.ruteK;
  let berangkat = req.params.berangkatK;
  let dewasa = Number(req.params.dewasaK);
  let anak = Number(req.params.anakK);
  let bayi= Number(req.params.bayiK);
  let penumpang = dewasa + anak + bayi;
  // console.log(penumpang, key)

  // fungsi untuk menampilkan detail tiket kereta
  const { data: ruteK, error: errorRute } = await supabase
    .from('ruteKereta')
    .select(`*, kereta (namaKereta) , asal: kotaAsal (namaKota), tujuan: kotaTujuan (namaKota)`)
    .eq('ruteID', `${key}`)

  console.log(ruteK[0]);
  return res.render("keretaF/datapemesanK"
  ,{
    dataK: ruteK,
    berangkatK: berangkat,
    dewasaK: dewasa,
    anakK: anak,
    bayiK: bayi,
    jumlahK: penumpang
  })
}


// function bukan callback untuk menampilkan detail data penumpang
async function dataTiket(ket, nTikets){
  let results = [];
  if (ket == 'kereta'){
    for (let nTiket of nTikets) {
      const {data: penumpangs, error: errPenumpang} = await supabase
        .from('tiketKereta')
        .select()
        .eq('tiketpid', nTiket)
        results.push(penumpangs)
      }
    return results;
  } else {
      for (let nTiket of nTikets) {
        const {data: penumpangs, error: errPenumpang} = await supabase
        .from('tiketPesawat')
        .select()
        .eq('tiketpid', nTiket)
        result.push(penumpangs)
      }
      return results;
  }
}

// function unutuk menampilkan e-tiket kereta
const cetakTiketK = async (req, res, next) => {
  let orderID = req.params.orderID;

  orderID = orderID - 7000;

  const {data: etiketP, error: errEtiketP} = await supabase
    .from('transaksi')
    .select()
    .eq('transaksiID', orderID)

  let nTikets = etiketP[0].noTiket;
  let keterangan = etiketP[0].keterangan;

  const results = await dataTiket(keterangan, nTikets);
  console.log(results[0][0].ruteK)

  const {data: allData, error: errorallData} = await supabase
                  .from('ruteKereta')
                  .select(`*, 
                          kereta(namaKereta)`)
                  .eq('ruteID', results[0][0].ruteK);
  
 
  return res.render('keretaF/cetakTiketK',{
    dataPenumpang: results,
    orderID: orderID + 7000,
    dataK: allData,
  })
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
  datapemesanK,
  cetakTiketK,
  cariTiketK,
}