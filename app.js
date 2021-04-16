const express = require('express')
const sqlite3 = require('sqlite3')

var app = express()

const PORT = 8080
app.listen(PORT, () => {
  console.log('server run on port ' + PORT)
})

const db = new sqlite3.Database('./wkdb.sqlite3', (err) => {
  if (err) {
    console.log('Error buka database.')
  } else {
    console.log('Database terhubung.')
  }
})

app.get('/guru/', (req, res, next) => {
  const query = `
  select a.*, b.nama as kelas from master_guru a
  inner join master_kelas b on a.walikelas_id=b.id`
  db.all(query, [], (err, row) => {
    if(err) {
      res.status(400).json({"error":err.message})
      return
    } 
    res.status(200).json(row)
  })
})

app.get('/rombel/:wkid', (req, res, next) => {
  const query = `
  select b.*, c.nama as kelas from master_rombel a
  inner join master_siswa b on a.siswa_id=b.id
  inner join master_kelas c on a.kelas_id=c.id
  inner join master_guru d on a.walikelas_id=d.id
  where d.id=?`
  db.all(query, [req.params.wkid], (err, row) => {
    if(err) {
      res.status(400).json({"error":err.message})
      return
    } 
    res.status(200).json(row)
  })
})

app.get('/siswa/detail/:nis', (req, res) => {
  const query = `
  select b.*, c.nama as kelas, d.nama as walikelas from master_rombel a
  inner join master_siswa b on a.siswa_id=b.id
  inner join master_kelas c on a.kelas_id=c.id
  inner join master_guru d on a.walikelas_id=d.id
  where b.NIS=?`
  db.all(query, [req.params.nis], (err, row) => {
    if(err){
      res.status(400).json({"error":err.message})
      return
    }
    res.status(200).json(row)
  })
})

app.get('/kelas', (req, res) => {
  const query = `
  select * from master_kelas`
  db.all(query, [], (err, row) => {
    if(err) {
      res.status(400).json({'error':err.message})
      return
    }
    res.status(200).json(row)
  })
})
