const {User} = require('../models/user.model');


export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        const user = await User.findOne({ clarkId: id });
        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            })
        }
        res.status(200).json({ success: true});
    }
    catch (error) {
        console.error('Error handling auth callback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}