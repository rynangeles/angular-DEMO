var fs = require('fs-extra')
  , path = require('path')
  , _ = require('underscore')

module.exports.list = list
module.exports.create = create
module.exports.read = read
module.exports.update = update
module.exports.del = del
module.exports.total = total

var DATA_FILE = './resources/data.json'
if (process.env.NODE_ENV === 'test') 
  DATA_FILE = './test/resources/data.json'

var DATA = fs.readJsonSync(DATA_FILE) //happens at server startup

/**********************
 * Public Interface
 **********************/

function list (req, res) {
    var offset = ~~req.query.offset || 0
    , limit = ~~req.query.limit || 25

    res.json(DATA.slice(offset*limit, offset*limit + limit))
}

function create (req, res) {
    var newEmployee = req.body
    newEmployee.id = getLastId() + 1
    DATA.push(newEmployee)
    saveDB(function(err) {
    if (err) 
        res.json(formatRespData(0, err))
    else
        res.json(formatRespData({id: newEmployee.id}))
    })
}

function read (req, res) {
    var id = ~~req.params.id
    var employee = _(DATA).find(function(employee) { return employee.id === id })

    if (!employee)
        res.json(formatRespData(0, "Can't find employee with id: " + id))
    else
        res.json(formatRespData(employee))
}

function update (req, res) {
    var id = ~~req.params.id
    var employee = _(DATA).find(function(employee) { return employee.id === id })

    var newEmployeeData = req.body
    employee = _(employee).extend(newEmployeeData)

    saveDB(function(err) {
    if (err) 
        res.json(formatRespData(0, err))
    else
        res.json(formatRespData({}))
    })
}

function del (req, res) {
    var id = ~~req.params.id
    var employee = _(DATA).find(function(employee) { return employee.id === id })

    var idx = DATA.indexOf(employee)
    if (idx < 0) return res.json(formatRespData(0, "Could not find employee with id: " + id))

    DATA.splice(idx, 1)

    saveDB(function(err) {
    if (err) 
        res.json(formatRespData(0, err))
    else
        res.json(formatRespData({}))
    })
}

function total (req, res) {
    total = DATA.length ? DATA.length : 0
    res.json({total: total})
}



/*******************
 * Private Methods
 *******************/

function getLastId () {
    return DATA.length;
}

function formatRespData (code, content) {
    if (typeof code === 'object') {
        content = code,
        code = 1 //0 failure, 1 = success
    }

    return {
        code: code,
        content: content
    }
}

function saveDB (callback) {
    fs.writeJson(DATA_FILE, DATA, callback)
}

