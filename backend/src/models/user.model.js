const {mongoose} = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    clarkId: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true} 
);

export const User = mongoose.model('User', userSchema);