server.post('/new-order', (req, res) => {

    // Just logging the body of the request
    console.log(req.body, 'data from webhook call')

    // Sending a 200 to show success
    res.status(200).json({ message: "success" })

})