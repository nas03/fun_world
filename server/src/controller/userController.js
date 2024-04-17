const userModel = require('../model/user')

exports.create = async function (req, res) {
    try {
        const data = req.body;
        const checkUser = await userModel.get(data)
        if (checkUser) return res.status(400).json({ message: "Account existed" })

        const newUser = await userModel.create(data)
        return res.status(200).json({
            message: 'Register successfully',
            account: newUser
        })
    } catch (error) {
        return res.status(500).json({ message: e.message })
    }
}

exports.getAll = async function (req, res) {
    try {
        const response = await userModel.getAll()
        return res.status(200).json({
            message: 'OK',
            data: response
        })
    } catch (error) {
        return res.status(500).json({ message: e.message })
    }
}

exports.update = async function (req, res) {
    try {
        const data = req.body;
        console.log(data)
        const userId = data._id;
        console.log(userId)
        const response = await userModel.update(userId, data)
        return res.status(200).json({
            message: 'OK',
            data: response
        })
    } catch (error) {
        return res.status(500).json({ message: e.message })
    }
}