const fs = require('fs')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware')
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

const getAllTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const getTour = (req, res) => {
    const id = Number(req.params.id)
    const tour = tours.find( el => el.id === id )

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            })
        }
    )
}

const updateTour = (req, res) => {
    const id = Number(req.params.id)

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        })
    }
}

const deleteTour = (req, res) => {
    const id = Number(req.params.id)

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message:'This route is not yet defined'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser)

app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})